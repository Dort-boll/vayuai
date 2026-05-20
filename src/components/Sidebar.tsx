import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Plus, LogOut, LogIn, User, Search, Trash2, Menu, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ChatThread } from '@/src/types';

interface SidebarProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewChat: () => void;
  onDeleteThread: (id: string) => void;
  user: any;
  onAuth: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  threads,
  activeThreadId,
  onSelectThread,
  onNewChat,
  onDeleteThread,
  user,
  onAuth,
  isOpen,
  setIsOpen
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -320,
          width: isOpen ? 320 : 0
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0d0d0d] border-r border-white/10 transition-all duration-300 ease-in-out lg:relative",
          !isOpen && "lg:w-0 lg:border-none overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between p-4 bg-[#0d0d0d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/10">
              <img 
                src="/logo.png" 
                alt="Vayu Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=vayu';
                }}
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Vayu</h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all group"
          >
            <Plus size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
          {threads.length === 0 ? (
            <div className="text-center py-10 px-4">
              <MessageSquare size={32} className="mx-auto text-zinc-700 mb-2" />
              <p className="text-zinc-500 text-sm">No conversations yet</p>
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.id}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all",
                  activeThreadId === thread.id 
                    ? "bg-white/10 text-white" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                )}
                onClick={() => onSelectThread(thread.id)}
              >
                <MessageSquare size={16} />
                <span className="flex-1 truncate text-sm font-medium">{thread.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteThread(thread.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-[#0d0d0d]">
          {user ? (
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium ring-2 ring-white/5">
                {user.username?.charAt(0).toUpperCase() || <User size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                <button 
                  onClick={onAuth}
                  className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <LogOut size={12} />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onAuth}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              <LogIn size={18} />
              Sign in to Vayu
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}
