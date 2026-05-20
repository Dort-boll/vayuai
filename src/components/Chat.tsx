import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { ArrowUp, User, Bot, Loader2, Search, Zap, Menu } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Message } from '@/src/types';

interface ChatProps {
  messages: Message[];
  onSendMessage: (content: string, useWebSearch?: boolean) => void;
  isLoading: boolean;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Chat({ messages, onSendMessage, isLoading, onToggleSidebar, isSidebarOpen }: ChatProps) {
  const [input, setInput] = useState('');
  const [useWebSearch, setUseWebSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input, useWebSearch);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-screen bg-[#141414] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between h-16 px-4 border-b border-white/5 bg-[#141414]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden lg:hidden">
               <img 
                src="/logo.png" 
                alt="Vayu Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-zinc-100 tracking-tight">Vayu Assistant</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className={cn(
             "px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] uppercase tracking-widest font-bold text-blue-400 flex items-center gap-1.5 shadow-sm shadow-blue-500/5",
             isLoading && "animate-pulse"
           )}>
             <div className={cn("w-1.5 h-1.5 rounded-full bg-blue-400", isLoading && "animate-ping")} />
             Vayu Engine
           </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 mb-8 p-1 bg-white/5 border border-white/10">
                 <img 
                  src="/logo.png" 
                  alt="Vayu Logo" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-3">How can Vayu help you?</h2>
              <p className="text-zinc-500 max-w-md text-lg">Your personal AI assistant for chatting, searching, and getting things done.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-xl">
                 {[
                   "Explain quantum physics",
                   "Write a poem about the moon",
                   "Search for latest tech news",
                   "How to make pasta carbonara"
                 ].map((suggestion, idx) => (
                   <button 
                    key={idx}
                    onClick={() => {
                      setInput(suggestion);
                      onSendMessage(suggestion, suggestion.toLowerCase().includes('search'));
                    }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left text-sm text-zinc-300"
                   >
                     {suggestion}
                   </button>
                 ))}
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={cn(
                    "flex gap-4 md:gap-6",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "flex max-w-[85%] md:max-w-3xl gap-3 md:gap-4",
                    message.role === 'user' && "flex-row-reverse"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border",
                      message.role === 'user' 
                        ? "bg-zinc-800 border-white/10" 
                        : "bg-blue-600 border-blue-500 shadow-sm"
                    )}>
                      {message.role === 'user' ? <User size={16} className="text-zinc-400" /> : <Bot size={18} className="text-white" />}
                    </div>
                    <div className={cn(
                      "prose prose-invert max-w-none pt-1 leading-relaxed",
                      message.role === 'user' ? "text-zinc-100" : "text-zinc-300"
                    )}>
                      <ReactMarkdown 
                        components={{
                          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                          code: ({ children }) => <code className="bg-white/10 px-1 py-0.5 rounded text-indigo-400 font-mono text-sm">{children}</code>,
                          pre: ({ children }) => <pre className="bg-zinc-900/50 p-4 rounded-xl border border-white/10 overflow-x-auto my-4">{children}</pre>
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 md:gap-6"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Loader2 size={18} className="animate-spin text-blue-500" />
                    <span className="text-zinc-500 text-sm">Vayu is thinking...</span>
                  </div>
                </motion.div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-[#141414] via-[#141414] to-transparent">
        <form 
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative group"
        >
          <div className="flex flex-col bg-[#212121] border border-white/10 rounded-2xl shadow-2xl focus-within:border-blue-600/50 focus-within:ring-1 focus-within:ring-blue-600/50 transition-all overflow-hidden">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Vayu anything..."
              className="w-full bg-transparent p-4 text-white resize-none outline-none min-h-[56px] max-h-[200px] leading-relaxed custom-scrollbar"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 bg-zinc-900/30">
               <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUseWebSearch(!useWebSearch)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      useWebSearch 
                        ? "bg-blue-600/20 border-blue-600/50 text-blue-400" 
                        : "bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                    )}
                  >
                    <Search size={14} />
                    Search Web
                  </button>
               </div>
               <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "p-2 rounded-xl transition-all flex items-center justify-center",
                  input.trim() && !isLoading 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95" 
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                )}
              >
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-zinc-600 mt-3 uppercase tracking-tighter">
            Vayu AI Assistant • Intelligence without limits
          </p>
        </form>
      </div>
    </div>
  );
}
