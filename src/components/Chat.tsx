import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  PanelLeft,
  Share2,
  Trash2,
  ArrowDown,
  Loader2,
  SquarePen,
  Sparkles,
  Cpu,
} from 'lucide-react';
import MessageItem from './MessageItem';
import FloatingComposer from './FloatingComposer';
import ModelSelector from './ModelSelector';
import { Message, AttachmentItem, ToolMode } from '../types';

interface ChatProps {
  messages: Message[];
  onSendMessage: (params: {
    content: string;
    toolMode: ToolMode;
    attachments: AttachmentItem[];
  }) => void;
  isLoading: boolean;
  onStopGeneration?: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  currentModel: string;
  onSelectModel: (modelId: string) => void;
  onClearChat?: () => void;
  onNewChat?: () => void;
  onRegenerateMessage?: (messageId: string) => void;
  onEditPrompt?: (content: string) => void;
}

export default function Chat({
  messages,
  onSendMessage,
  isLoading,
  onStopGeneration,
  onToggleSidebar,
  isSidebarOpen,
  currentModel,
  onSelectModel,
  onClearChat,
  onNewChat,
  onRegenerateMessage,
  onEditPrompt,
}: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading, scrollToBottom]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceToBottom > 160);
  };

  const handleExportShare = () => {
    if (messages.length === 0) return;
    const formatted = messages
      .map(
        m =>
          `**${m.role === 'user' ? 'User' : 'Vayu AI v6.1'}** (${new Date(
            m.timestamp
          ).toLocaleTimeString()}):\n${m.content}\n`
      )
      .join('\n---\n\n');

    navigator.clipboard.writeText(formatted).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    });
  };

  const suggestions = [
    {
      title: "Explain quantum computing in simple terms",
      category: "Quantum Science",
      tool: 'reasoning' as ToolMode,
    },
    {
      title: "Write a high-performance concurrent queue in TypeScript",
      category: "Code Architecture",
      tool: 'chat' as ToolMode,
    },
    {
      title: "Create a cyberpunk city floating over clouds with neon aurora",
      category: "Vision Studio",
      tool: 'image' as ToolMode,
    },
    {
      title: "What are the latest breakthroughs in fusion energy research?",
      category: "Live Web Search",
      tool: 'search' as ToolMode,
    },
  ];

  return (
    <div className="flex-1 flex flex-col relative h-screen bg-[#212121] overflow-hidden select-text text-[#ECECEC]">
      
      {/* ChatGPT-Style Sleek Top Navigation Bar */}
      <header className="flex items-center justify-between h-14 px-4 bg-[#212121]/95 backdrop-blur-md sticky top-0 z-30 select-none">
        <div className="flex items-center gap-2">
          {!isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-[#2b2b2b] rounded-lg text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
              title="Open sidebar"
            >
              <PanelLeft size={18} />
            </button>
          )}

          {/* Dedicated NVIDIA Model Indicator Pill */}
          <ModelSelector
            currentModel={currentModel}
            onSelectModel={onSelectModel}
          />
        </div>

        {/* Right Actions: New Chat, Share & Clear */}
        <div className="flex items-center gap-1">
          {onNewChat && (
            <button
              onClick={onNewChat}
              className="p-2 hover:bg-[#2b2b2b] rounded-lg text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
              title="New chat"
            >
              <SquarePen size={18} />
            </button>
          )}

          {messages.length > 0 && (
            <>
              <button
                onClick={handleExportShare}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#b4b4b4] hover:text-white hover:bg-[#2b2b2b] transition-colors cursor-pointer"
                title="Copy conversation transcript"
              >
                <Share2 size={15} />
                <span className="hidden sm:inline">
                  {copiedShare ? 'Copied Transcript' : 'Share'}
                </span>
              </button>

              {onClearChat && (
                <button
                  onClick={onClearChat}
                  className="p-2 rounded-lg text-[#737373] hover:text-rose-400 hover:bg-[#2b2b2b] transition-colors cursor-pointer"
                  title="Clear chat"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Conversation Canvas */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 pt-2 pb-36 custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.length === 0 ? (
            /* ChatGPT-Style Welcome Screen */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center min-h-[62vh] text-center pt-10 pb-8"
            >
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-emerald-500/20 via-[#262626] to-cyan-500/20 border border-[#383838] shadow-[0_0_40px_rgba(16,185,129,0.15)] flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="Vayu Logo"
                    className="w-full h-full object-cover rounded-xl"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://api.dicebear.com/7.x/bottts/svg?seed=vayu';
                    }}
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <Cpu size={12} />
                <span>Vayu AI v6.1 • 100% Pure Frontend</span>
              </div>

              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                What can I help with today?
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#a3a3a3] max-w-md mx-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Vayu AI Omni-Reasoning Engine v6.1</span>
              </div>

              {/* ChatGPT Style Curated Prompt Starters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10 w-full max-w-xl text-left">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSendMessage({
                        content: s.title,
                        toolMode: s.tool,
                        attachments: [],
                      });
                    }}
                    className="p-3.5 rounded-2xl bg-[#262626] hover:bg-[#2e2e2e] border border-[#383838] hover:border-[#4d4d4d] transition-all group cursor-pointer shadow-sm text-left flex flex-col justify-between"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 mb-1">
                      {s.category}
                    </div>
                    <div className="text-[13px] font-medium text-[#ECECEC] group-hover:text-white leading-snug">
                      {s.title}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Render Messages with ChatGPT Style Typography */
            <>
              {messages.map(msg => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  onRegenerate={onRegenerateMessage}
                  onEditPrompt={onEditPrompt}
                />
              ))}

              {/* Streaming / Loading Indicator in ChatGPT Style */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full py-3 flex justify-start"
                >
                  <div className="flex gap-4 max-w-3xl w-full">
                    <div className="w-8 h-8 rounded-full bg-[#262626] border border-[#383838] overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-sm mt-0.5">
                      <img
                        src="/logo.png"
                        alt="Vayu"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex items-center gap-2.5 pt-1.5 text-xs text-[#a3a3a3]">
                      <Loader2 size={16} className="animate-spin text-emerald-400" />
                      <span className="font-medium animate-pulse text-[#b4b4b4]">
                        Vayu AI is thinking...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Jump To Bottom Floating Button */}
      <AnimatePresence>
        {showScrollBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-28 right-6 z-20 w-9 h-9 rounded-full bg-[#2e2e2e] border border-[#404040] text-white shadow-xl flex items-center justify-center hover:bg-[#383838] transition-colors cursor-pointer"
            title="Scroll to latest"
          >
            <ArrowDown size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Anchored ChatGPT-Style Message Composer Container */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none bg-gradient-to-t from-[#212121] via-[#212121]/95 to-transparent pt-6">
        <div className="pointer-events-auto">
          <FloatingComposer
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            onStopGeneration={onStopGeneration}
          />
        </div>
      </div>
    </div>
  );
}
