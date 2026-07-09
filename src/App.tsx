/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import IntroPage from './components/IntroPage';
import { Message, ChatThread } from './types';

// Declare puter globally for TypeScript
declare global {
  interface Window {
    puter: any;
  }
}

export default function App() {
  const isPuterReady = () => typeof window !== 'undefined' && window.puter;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showGuestApp, setShowGuestApp] = useState(false);

  // Initialize Threads from Local Storage
  useEffect(() => {
    const saved = localStorage.getItem('vayu_threads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setThreads(parsed);
        if (parsed.length > 0) {
          setActiveThreadId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to load threads", e);
      }
    }
  }, []);

  // Sync Threads to Local Storage
  useEffect(() => {
    localStorage.setItem('vayu_threads', JSON.stringify(threads));
  }, [threads]);

  // Auth Sync
  useEffect(() => {
    const syncUser = async () => {
      if (!isPuterReady()) return;
      try {
        const signedIn = await window.puter.auth.isSignedIn();
        if (signedIn) {
          const u = await window.puter.auth.getUser();
          setUser(u);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Puter Auth Error", e);
      }
    };
    syncUser();
  }, []);

  const handleAuth = async () => {
    if (!isPuterReady()) return;
    if (user) {
      await window.puter.auth.signOut();
      setUser(null);
      setShowGuestApp(false);
    } else {
      try {
        await window.puter.auth.signIn();
        const u = await window.puter.auth.getUser();
        setUser(u);
      } catch (e) {
        console.error("Sign in failed", e);
      }
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

  const handleDeleteThread = (id: string) => {
    setThreads(prev => prev.filter(t => t.id !== id));
    if (activeThreadId === id) {
      setActiveThreadId(null);
    }
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleSendMessage = async (content: string, useWebSearch: boolean = false) => {
    let currentThreadId = activeThreadId;
    
    // Create new thread if none exists
    if (!currentThreadId) {
      const newId = Math.random().toString(36).substring(7);
      const newThread: ChatThread = {
        id: newId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
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
      content,
      timestamp: Date.now(),
    };

    // Add user message to state
    setThreads(prev => prev.map(t => {
      if (t.id === currentThreadId) {
        return {
          ...t,
          messages: [...t.messages, userMessage],
          title: t.messages.length === 0 ? content.slice(0, 30) : t.title,
          updatedAt: Date.now(),
        };
      }
      return t;
    }));

    setIsLoading(true);

    try {
      let response;
      if (!isPuterReady()) throw new Error("Vayu Engine not ready");

      if (useWebSearch) {
        // Guide Puter to search the web
        response = await window.puter.ai.chat(`[USE WEB SEARCH] ${content}`, {
          model: 'baidu/cobuddy:free'
        });
      } else {
        response = await window.puter.ai.chat(content, {
          model: 'baidu/cobuddy:free',
          stream: false
        });
      }

      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: response.message?.content || "I'm sorry, I couldn't generate a response.",
        timestamp: Date.now(),
      };

      setThreads(prev => prev.map(t => {
        if (t.id === currentThreadId) {
          return {
            ...t,
            messages: [...t.messages, assistantMessage],
            updatedAt: Date.now(),
          };
        }
        return t;
      }));
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMessage: Message = {
        id: 'system-' + Date.now(),
        role: 'assistant',
        content: "### ⚠️ Connectivity Issue\n\nI encountered an issue connecting to the Vayu intelligence engine. This often happens if the connection is unstable or if your session has expired.\n\n**Please try the following:**\n1. Check your internet connection.\n2. Sign in to your Vayu account using the sidebar.\n3. Refresh the page and try again.",
        timestamp: Date.now(),
      };
      setThreads(prev => prev.map(t => {
        if (t.id === currentThreadId) {
          return { ...t, messages: [...t.messages, errorMessage] };
        }
        return t;
      }));
    } finally {
      setIsLoading(false);
    }
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
    <div className="flex h-screen bg-[#0d0d0d] font-sans selection:bg-blue-500/30 text-white overflow-hidden">
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={setActiveThreadId}
        onNewChat={handleNewChat}
        onDeleteThread={handleDeleteThread}
        user={user}
        onAuth={handleAuth}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Chat
          messages={activeThread?.messages || []}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
      </main>
    </div>
  );
}
