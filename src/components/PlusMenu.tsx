import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Paperclip, Image as ImageIcon, Globe, BrainCircuit, Sparkles, X } from 'lucide-react';

interface PlusMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUpload: () => void;
  onToggleImageGen: () => void;
  onToggleWebSearch: () => void;
  onToggleReasoning: () => void;
  isImageGenActive: boolean;
  isWebSearchActive: boolean;
  isReasoningActive: boolean;
}

export default function PlusMenu({
  isOpen,
  onClose,
  onSelectUpload,
  onToggleImageGen,
  onToggleWebSearch,
  onToggleReasoning,
  isImageGenActive,
  isWebSearchActive,
  isReasoningActive,
}: PlusMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-full left-0 mb-3 w-64 rounded-2xl bg-[#202020] border border-[#353535] shadow-[0_16px_40px_rgba(0,0,0,0.7)] p-1.5 z-50 text-[#F5F5F5] backdrop-blur-xl"
        >
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#737373] border-b border-[#2d2d2d] flex items-center justify-between">
            <span>Tools & Capabilities</span>
            <button
              onClick={onClose}
              className="p-1 hover:text-[#F5F5F5] transition-colors rounded-md"
            >
              <X size={12} />
            </button>
          </div>

          <div className="p-1 space-y-1">
            {/* Upload files */}
            <button
              onClick={() => {
                onSelectUpload();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#F5F5F5] hover:bg-[#2B2B2B] transition-colors group text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#2a2a2a] border border-[#383838] flex items-center justify-center text-[#A3A3A3] group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                <Paperclip size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#F5F5F5]">Add photos & files</div>
                <div className="text-[10px] text-[#737373] truncate">Images, code, PDFs & text</div>
              </div>
            </button>

            {/* Create image */}
            <button
              onClick={() => {
                onToggleImageGen();
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors group text-left cursor-pointer ${
                isImageGenActive ? 'bg-cyan-500/15 text-cyan-300' : 'text-[#F5F5F5] hover:bg-[#2B2B2B]'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
                isImageGenActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-[#2a2a2a] border-[#383838] text-[#A3A3A3] group-hover:text-cyan-400 group-hover:border-cyan-500/40'
              }`}>
                <ImageIcon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium flex items-center gap-1.5">
                  Create image
                  {isImageGenActive && <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-1 rounded font-bold">ON</span>}
                </div>
                <div className="text-[10px] text-[#737373] truncate">Generate 3D & photorealistic art</div>
              </div>
            </button>

            {/* Search the web */}
            <button
              onClick={() => {
                onToggleWebSearch();
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors group text-left cursor-pointer ${
                isWebSearchActive ? 'bg-blue-500/15 text-blue-300' : 'text-[#F5F5F5] hover:bg-[#2B2B2B]'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
                isWebSearchActive
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                  : 'bg-[#2a2a2a] border-[#383838] text-[#A3A3A3] group-hover:text-blue-400 group-hover:border-blue-500/40'
              }`}>
                <Globe size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium flex items-center gap-1.5">
                  Search the web
                  {isWebSearchActive && <span className="text-[9px] bg-blue-400/20 text-blue-300 px-1 rounded font-bold">ON</span>}
                </div>
                <div className="text-[10px] text-[#737373] truncate">Live online search & citations</div>
              </div>
            </button>

            {/* Deep reasoning / Research */}
            <button
              onClick={() => {
                onToggleReasoning();
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors group text-left cursor-pointer ${
                isReasoningActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-[#F5F5F5] hover:bg-[#2B2B2B]'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
                isReasoningActive
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                  : 'bg-[#2a2a2a] border-[#383838] text-[#A3A3A3] group-hover:text-indigo-400 group-hover:border-indigo-500/40'
              }`}>
                <BrainCircuit size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium flex items-center gap-1.5">
                  Deep reasoning
                  {isReasoningActive && <span className="text-[9px] bg-indigo-400/20 text-indigo-300 px-1 rounded font-bold">ON</span>}
                </div>
                <div className="text-[10px] text-[#737373] truncate">Multi-step chain-of-thought</div>
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
