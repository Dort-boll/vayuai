import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Plus,
  LogOut,
  LogIn,
  User,
  Search,
  Trash2,
  X,
  Pin,
  Settings,
  Pencil,
  Check,
  PanelLeftClose,
} from 'lucide-react';
import { ChatThread } from '../types';

interface SidebarProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewChat: () => void;
  onDeleteThread: (id: string) => void;
  onTogglePinThread: (id: string) => void;
  onRenameThread: (id: string, newTitle: string) => void;
  user: any;
  onAuth: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenSettings: () => void;
}

export default function Sidebar({
  threads,
  activeThreadId,
  onSelectThread,
  onNewChat,
  onDeleteThread,
  onTogglePinThread,
  onRenameThread,
  user,
  onAuth,
  isOpen,
  setIsOpen,
  onOpenSettings,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Group threads into Pinned, Today, Yesterday, Previous 7 Days, Older
  const groupedThreads = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;

    const filtered = threads.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinned: ChatThread[] = [];
    const today: ChatThread[] = [];
    const yesterday: ChatThread[] = [];
    const previous7Days: ChatThread[] = [];
    const older: ChatThread[] = [];

    filtered.forEach(thread => {
      if (thread.pinned) {
        pinned.push(thread);
        return;
      }
      const age = now - thread.updatedAt;
      if (age < oneDay) {
        today.push(thread);
      } else if (age < 2 * oneDay) {
        yesterday.push(thread);
      } else if (age < sevenDays) {
        previous7Days.push(thread);
      } else {
        older.push(thread);
      }
    });

    return { pinned, today, yesterday, previous7Days, older };
  }, [threads, searchQuery]);

  const handleStartRename = (thread: ChatThread, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingThreadId(thread.id);
    setEditTitle(thread.title);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    e?.preventDefault();
    if (editTitle.trim()) {
      onRenameThread(id, editTitle.trim());
    }
    setEditingThreadId(null);
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -300,
          width: isOpen ? 280 : 0,
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#121212] border-r border-[#353535] lg:relative select-none ${
          !isOpen ? 'lg:w-0 lg:border-none overflow-hidden' : ''
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#242424]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#353535] bg-[#1a1a1a]">
              <img
                src="/logo.png"
                alt="Vayu Logo"
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://api.dicebear.com/7.x/bottts/svg?seed=vayu';
                }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] tracking-tight text-[#F5F5F5]">Vayu AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-bold tracking-tight">
                v6.1
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-[#2B2B2B] rounded-lg text-[#737373] hover:text-[#F5F5F5] transition-colors"
            title="Close sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* New Chat & Search Input */}
        <div className="p-3 space-y-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-[#202020] hover:bg-[#2B2B2B] text-[#F5F5F5] rounded-xl border border-[#353535] transition-all group cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2.5 font-medium text-xs">
              <Plus size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>New chat</span>
            </div>
            <span className="text-[10px] text-[#737373] font-mono border border-[#383838] px-1.5 py-0.5 rounded bg-[#181818]">
              Ctrl+K
            </span>
          </button>

          {/* Search conversations */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#181818] border border-[#2d2d2d] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#737373] outline-none focus:border-[#444444]"
            />
          </div>
        </div>

        {/* Thread History List with Date Categories */}
        <div className="flex-1 overflow-y-auto px-2 space-y-3 custom-scrollbar">
          {threads.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageSquare size={28} className="mx-auto text-[#404040] mb-2" />
              <p className="text-[#737373] text-xs">No conversations yet</p>
            </div>
          ) : (
            <>
              {/* Pinned */}
              {groupedThreads.pinned.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400/80 flex items-center gap-1.5">
                    <Pin size={10} />
                    <span>Pinned</span>
                  </div>
                  {groupedThreads.pinned.map(renderThreadItem)}
                </div>
              )}

              {/* Today */}
              {groupedThreads.today.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                    Today
                  </div>
                  {groupedThreads.today.map(renderThreadItem)}
                </div>
              )}

              {/* Yesterday */}
              {groupedThreads.yesterday.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                    Yesterday
                  </div>
                  {groupedThreads.yesterday.map(renderThreadItem)}
                </div>
              )}

              {/* Previous 7 Days */}
              {groupedThreads.previous7Days.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                    Previous 7 Days
                  </div>
                  {groupedThreads.previous7Days.map(renderThreadItem)}
                </div>
              )}

              {/* Older */}
              {groupedThreads.older.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                    Older
                  </div>
                  {groupedThreads.older.map(renderThreadItem)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Area with User Profile, Settings, & Puter Auth */}
        <div className="p-2.5 border-t border-[#242424] bg-[#121212] space-y-1">
          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#202020] transition-colors cursor-pointer"
          >
            <Settings size={15} />
            <span>Settings</span>
          </button>

          {/* User Profile Card */}
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1c1c1c] border border-[#2d2d2d]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.username?.charAt(0).toUpperCase() || <User size={13} />}
                </div>
                <div className="truncate text-xs font-medium text-[#F5F5F5]">
                  {user.username}
                </div>
              </div>
              <button
                onClick={onAuth}
                className="p-1.5 rounded-lg text-[#737373] hover:text-rose-400 hover:bg-[#2B2B2B] transition-colors"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onAuth}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#202020] hover:bg-[#2B2B2B] text-[#F5F5F5] rounded-xl border border-[#353535] text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <LogIn size={14} className="text-cyan-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );

  function renderThreadItem(thread: ChatThread) {
    const isActive = activeThreadId === thread.id;
    const isEditing = editingThreadId === thread.id;

    if (isEditing) {
      return (
        <form
          key={thread.id}
          onSubmit={e => handleSaveRename(thread.id, e)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#202020] border border-cyan-500/50"
        >
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-xs text-white outline-none"
          />
          <button
            type="submit"
            className="p-1 hover:text-cyan-400 transition-colors"
          >
            <Check size={13} />
          </button>
          <button
            type="button"
            onClick={() => setEditingThreadId(null)}
            className="p-1 hover:text-rose-400 transition-colors"
          >
            <X size={13} />
          </button>
        </form>
      );
    }

    return (
      <div
        key={thread.id}
        onClick={() => onSelectThread(thread.id)}
        className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-xs transition-colors ${
          isActive
            ? 'bg-[#202020] text-[#F5F5F5] font-semibold border border-[#303030]'
            : 'text-[#A3A3A3] hover:bg-[#1a1a1a] hover:text-[#F5F5F5]'
        }`}
      >
        <MessageSquare size={14} className={isActive ? 'text-cyan-400' : 'text-[#737373]'} />
        <span className="flex-1 truncate">{thread.title}</span>

        {/* Action icons on hover */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          {/* Pin */}
          <button
            onClick={e => {
              e.stopPropagation();
              onTogglePinThread(thread.id);
            }}
            title={thread.pinned ? 'Unpin' : 'Pin'}
            className={`p-1 rounded hover:bg-[#2B2B2B] transition-colors ${
              thread.pinned ? 'text-cyan-400' : 'text-[#737373] hover:text-[#F5F5F5]'
            }`}
          >
            <Pin size={12} className={thread.pinned ? 'fill-current' : ''} />
          </button>

          {/* Rename */}
          <button
            onClick={e => handleStartRename(thread, e)}
            title="Rename"
            className="p-1 rounded hover:bg-[#2B2B2B] text-[#737373] hover:text-[#F5F5F5] transition-colors"
          >
            <Pencil size={12} />
          </button>

          {/* Delete */}
          <button
            onClick={e => {
              e.stopPropagation();
              onDeleteThread(thread.id);
            }}
            title="Delete conversation"
            className="p-1 rounded hover:bg-[#2B2B2B] text-[#737373] hover:text-rose-400 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  }
}
