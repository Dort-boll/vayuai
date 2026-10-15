/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { puter } from '@heyputer/puter.js';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import IntroPage from './components/IntroPage';
import SettingsModal from './components/SettingsModal';
import { Message, ChatThread, AttachmentItem, ToolMode } from './types';
import { sendChatMessage, generateAiImage, DEFAULT_MODEL, parseReasoningAndContent } from './lib/aiService';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showGuestApp, setShowGuestApp] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>(DEFAULT_MODEL);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Cancellation reference to allow stopping streaming / generating
  const abortFlagRef = useRef(false);

  // Initialize Threads from Local Storage
  useEffect(() => {
    const saved = localStorage.getItem('vayu_threads');
    if (saved) {
      try {
        const parsed: ChatThread[] = JSON.parse(saved);
        setThreads(parsed);
        if (parsed.length > 0) {
          setActiveThreadId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to load threads from storage:", e);
      }
    }
  }, []);

  // Sync Threads to Local Storage
  useEffect(() => {
    localStorage.setItem('vayu_threads', JSON.stringify(threads));
  }, [threads]);

  // Auth sync with Puter
  useEffect(() => {
    const syncUser = async () => {
      try {
        const p = typeof window !== 'undefined' && window.puter ? window.puter : puter;
        if (p?.auth?.isSignedIn) {
          const signedIn = await p.auth.isSignedIn();
          if (signedIn) {
            const u = await p.auth.getUser();
            setUser(u);
          } else {
            setUser(null);
          }
        }
      } catch (e) {
        console.warn("Auth Sync:", e);
      }
    };
    syncUser();
  }, []);

  const handleAuth = async () => {
    try {
      const p = typeof window !== 'undefined' && window.puter ? window.puter : puter;
      if (user) {
        await p.auth.signOut();
        setUser(null);
        setShowGuestApp(false);
      } else {
        await p.auth.signIn();
        const u = await p.auth.getUser();
        setUser(u);
      }
    } catch (e) {
      console.error("Authentication action failed:", e);
    }
  };

  const handleNewChat = useCallback(() => {
    const newThread: ChatThread = {
      id: Math.random().toString(36).substring(7),
      title: 'New Conversation',
      messages: [],
      updatedAt: Date.now(),
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat]);

  const handleDeleteThread = (id: string) => {
    setThreads(prev => prev.filter(t => t.id !== id));
    if (activeThreadId === id) {
      const remaining = threads.filter(t => t.id !== id);
      setActiveThreadId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleTogglePinThread = (id: string) => {
    setThreads(prev =>
      prev.map(t => (t.id === id ? { ...t, pinned: !t.pinned } : t))
    );
  };

  const handleRenameThread = (id: string, newTitle: string) => {
    setThreads(prev =>
      prev.map(t => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  const handleClearAllChats = () => {
    setThreads([]);
    setActiveThreadId(null);
    localStorage.removeItem('vayu_threads');
  };

  const handleClearCurrentChat = () => {
    if (!activeThreadId) return;
    setThreads(prev =>
      prev.map(t => (t.id === activeThreadId ? { ...t, messages: [] } : t))
    );
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Send message handler exclusively using NVIDIA Nemotron 30B with smooth progressive output
  const handleSendMessage = async ({
    content,
    toolMode,
    attachments,
  }: {
    content: string;
    toolMode: ToolMode;
    attachments: AttachmentItem[];
  }) => {
    let currentThreadId = activeThreadId;

    // Create a new thread if none exists
    if (!currentThreadId) {
      const newId = Math.random().toString(36).substring(7);
      const titleCandidate = content.trim() || 'New Conversation';
      const newThread: ChatThread = {
        id: newId,
        title: titleCandidate.slice(0, 32) + (titleCandidate.length > 32 ? '...' : ''),
        messages: [],
        updatedAt: Date.now(),
      };
      setThreads(prev => [newThread, ...prev]);
      setActiveThreadId(newId);
      currentThreadId = newId;
    }

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: content.trim() || (toolMode === 'image' ? 'Generate image' : 'Analyze files'),
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    // Update thread with user message
    setThreads(prev =>
      prev.map(t => {
        if (t.id === currentThreadId) {
          const isFirst = t.messages.length === 0;
          const displayTitle = content.trim().slice(0, 32) || 'Conversation';
          return {
            ...t,
            messages: [...t.messages, userMessage],
            title: isFirst ? displayTitle : t.title,
            updatedAt: Date.now(),
          };
        }
        return t;
      })
    );

    setIsLoading(true);
    abortFlagRef.current = false;

    try {
      if (toolMode === 'image') {
        const promptToGenerate = content.trim() || "Futuristic minimalist geometric sphere glowing with electric neon and glass reflections";
        const imageUrl = await generateAiImage(promptToGenerate);

        if (abortFlagRef.current) return;

        const assistantMessage: Message = {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: `Here is your generated artwork crafted by Vayu Vision:\n\n> *"${promptToGenerate}"*`,
          imageResult: imageUrl,
          timestamp: Date.now(),
          modelUsed: 'Vayu Vision Engine',
        };

        setThreads(prev =>
          prev.map(t => {
            if (t.id === currentThreadId) {
              return {
                ...t,
                messages: [...t.messages, assistantMessage],
                updatedAt: Date.now(),
              };
            }
            return t;
          })
        );
      } else {
        // Prepare conversation history
        const history = (activeThread?.messages || []).map(m => ({
          role: m.role,
          content: m.content,
        }));

        const assistantMsgId = Math.random().toString(36).substring(7);
        let hasInitializedAssistant = false;

        const result = await sendChatMessage({
          prompt: content,
          conversationHistory: history,
          model: DEFAULT_MODEL,
          useWebSearch: toolMode === 'search',
          attachments,
          isReasoningMode: toolMode === 'reasoning',
          onChunk: (partialText) => {
            if (abortFlagRef.current) return;
            const { reasoning, content: cleanText } = parseReasoningAndContent(partialText);
            
            setThreads(prev =>
              prev.map(t => {
                if (t.id === currentThreadId) {
                  const existingMsgIdx = t.messages.findIndex(m => m.id === assistantMsgId);
                  const msgData: Message = {
                    id: assistantMsgId,
                    role: 'assistant',
                    content: cleanText,
                    reasoning,
                    timestamp: Date.now(),
                    modelUsed: 'Vayu AI v6.1',
                  };

                  if (existingMsgIdx >= 0) {
                    const nextMessages = [...t.messages];
                    nextMessages[existingMsgIdx] = msgData;
                    return { ...t, messages: nextMessages };
                  } else {
                    hasInitializedAssistant = true;
                    return { ...t, messages: [...t.messages, msgData] };
                  }
                }
                return t;
              })
            );
          }
        });

        if (abortFlagRef.current) return;

        // If streaming didn't output incrementally, perform a silky smooth rapid progressive render
        if (!hasInitializedAssistant) {
          const finalContent = result.content;
          const words = finalContent.split(' ');

          // Immediately render first batch or full if small
          if (words.length <= 15) {
            const assistantMessage: Message = {
              id: assistantMsgId,
              role: 'assistant',
              content: finalContent,
              reasoning: result.reasoning,
              sources: result.sources,
              timestamp: Date.now(),
              modelUsed: 'Vayu AI v6.1',
            };

            setThreads(prev =>
              prev.map(t => {
                if (t.id === currentThreadId) {
                  return { ...t, messages: [...t.messages, assistantMessage], updatedAt: Date.now() };
                }
                return t;
              })
            );
          } else {
            // Rapid smooth progressive typing
            let currentWords = '';
            const step = Math.max(2, Math.floor(words.length / 30));
            
            for (let i = 0; i < words.length; i += step) {
              if (abortFlagRef.current) break;
              currentWords = words.slice(0, i + step).join(' ');

              setThreads(prev =>
                prev.map(t => {
                  if (t.id === currentThreadId) {
                    const existingMsgIdx = t.messages.findIndex(m => m.id === assistantMsgId);
                    const msgData: Message = {
                      id: assistantMsgId,
                      role: 'assistant',
                      content: currentWords,
                      reasoning: result.reasoning,
                      sources: result.sources,
                      timestamp: Date.now(),
                      modelUsed: 'Vayu AI v6.1',
                    };

                    if (existingMsgIdx >= 0) {
                      const nextMessages = [...t.messages];
                      nextMessages[existingMsgIdx] = msgData;
                      return { ...t, messages: nextMessages };
                    } else {
                      return { ...t, messages: [...t.messages, msgData] };
                    }
                  }
                  return t;
                })
              );

              await new Promise(r => setTimeout(r, 16));
            }

            // Final guarantee with exact result text
            setThreads(prev =>
              prev.map(t => {
                if (t.id === currentThreadId) {
                  const existingMsgIdx = t.messages.findIndex(m => m.id === assistantMsgId);
                  const msgData: Message = {
                    id: assistantMsgId,
                    role: 'assistant',
                    content: finalContent,
                    reasoning: result.reasoning,
                    sources: result.sources,
                    timestamp: Date.now(),
                    modelUsed: 'Vayu AI v6.1',
                  };
                  if (existingMsgIdx >= 0) {
                    const nextMessages = [...t.messages];
                    nextMessages[existingMsgIdx] = msgData;
                    return { ...t, messages: nextMessages };
                  }
                  return { ...t, messages: [...t.messages, msgData] };
                }
                return t;
              })
            );
          }
        }
      }
    } catch (error: any) {
      if (abortFlagRef.current) return;
      console.error("Vayu AI Error:", error);
      const errorMessage: Message = {
        id: 'system-' + Date.now(),
        role: 'assistant',
        content: `### ⚠️ Connection Notice\n\n${error?.message || 'Unable to connect to Vayu AI reasoning engine.'}\n\n*Tip: Please wait a moment and click regenerate to retry.*`,
        timestamp: Date.now(),
        modelUsed: 'Vayu AI v6.1',
      };
      setThreads(prev =>
        prev.map(t => {
          if (t.id === currentThreadId) {
            return { ...t, messages: [...t.messages, errorMessage] };
          }
          return t;
        })
      );
    } finally {
      setIsLoading(false);
      abortFlagRef.current = false;
    }
  };

  const handleStopGeneration = () => {
    abortFlagRef.current = true;
    setIsLoading(false);
  };

  const handleRegenerateMessage = (messageId: string) => {
    if (!activeThread) return;
    const msgIndex = activeThread.messages.findIndex(m => m.id === messageId);
    if (msgIndex <= 0) return;

    const previousUserMsg = activeThread.messages[msgIndex - 1];
    if (previousUserMsg && previousUserMsg.role === 'user') {
      setThreads(prev =>
        prev.map(t => {
          if (t.id === activeThread.id) {
            return {
              ...t,
              messages: t.messages.slice(0, msgIndex),
            };
          }
          return t;
        })
      );

      handleSendMessage({
        content: previousUserMsg.content,
        toolMode: 'chat',
        attachments: previousUserMsg.attachments || [],
      });
    }
  };

  const handleEditPrompt = (content: string) => {
    handleSendMessage({
      content,
      toolMode: 'chat',
      attachments: [],
    });
  };

  if (!user && !showGuestApp) {
    return (
      <IntroPage
        onAuth={handleAuth}
        onContinueAsGuest={() => setShowGuestApp(true)}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#212121] font-sans selection:bg-emerald-500/20 text-[#ECECEC] overflow-hidden">
      {/* ChatGPT-Style Dark Sidebar */}
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={setActiveThreadId}
        onNewChat={handleNewChat}
        onDeleteThread={handleDeleteThread}
        onTogglePinThread={handleTogglePinThread}
        onRenameThread={handleRenameThread}
        user={user}
        onAuth={handleAuth}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main ChatGPT Conversation Canvas */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Chat
          messages={activeThread?.messages || []}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onStopGeneration={handleStopGeneration}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          currentModel={currentModel}
          onSelectModel={setCurrentModel}
          onClearChat={handleClearCurrentChat}
          onNewChat={handleNewChat}
          onRegenerateMessage={handleRegenerateMessage}
          onEditPrompt={handleEditPrompt}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentModel={currentModel}
        onSelectModel={setCurrentModel}
        user={user}
        onAuth={handleAuth}
        onClearAllChats={handleClearAllChats}
      />
    </div>
  );
}
