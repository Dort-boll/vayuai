import { X, Check, Trash2, Cpu, ShieldCheck, User, Sparkles } from 'lucide-react';
import { AVAILABLE_MODELS } from '../lib/aiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onSelectModel: (modelId: string) => void;
  user: any;
  onAuth: () => void;
  onClearAllChats: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentModel,
  onSelectModel,
  user,
  onAuth,
  onClearAllChats,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const activeModel = AVAILABLE_MODELS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#212121] border border-[#383838] shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 text-[#F5F5F5] relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#303030]">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Settings & Preferences
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737373] hover:text-[#F5F5F5] hover:bg-[#2B2B2B] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Dedicated AI Model Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5">
              <Cpu size={14} className="text-emerald-400" />
              Active Intelligence Model
            </label>
            <div className="p-3.5 rounded-2xl bg-[#2a2a2a] border border-[#404040]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-[#F5F5F5]">{activeModel.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                    FLAGSHIP
                  </span>
                </div>
                <Check size={16} className="text-emerald-400" />
              </div>
              <div className="text-[11px] text-[#A3A3A3] leading-relaxed">
                {activeModel.description}
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#353535] flex items-center justify-between text-[10px] text-[#888888]">
                <span>Engine: Vayu Neural Architecture v6.1</span>
                <span className="text-emerald-400 font-mono">Flagship Core</span>
              </div>
            </div>
          </div>

          {/* Account & Session */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5">
              <User size={14} className="text-sky-400" />
              Account & Sync
            </label>
            <div className="p-3 rounded-2xl bg-[#1a1a1a] border border-[#303030] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#F5F5F5]">
                  {user ? user.username : 'Guest Session'}
                </div>
                <div className="text-[11px] text-[#737373]">
                  {user ? 'Cloud Account Synced' : 'Running locally in browser'}
                </div>
              </div>
              <button
                onClick={onAuth}
                className="px-3 py-1.5 rounded-xl bg-[#2B2B2B] hover:bg-[#353535] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                {user ? 'Sign Out' : 'Sign In'}
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-2 pt-2 border-t border-[#303030]">
            <label className="text-xs font-semibold uppercase tracking-wider text-rose-400/80">
              Data Management
            </label>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all conversation history?')) {
                  onClearAllChats();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              Clear All Chat History
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#303030] flex items-center justify-between text-[11px] text-[#737373]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Vayu AI v6.1 • 100% Pure Frontend</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#171717] font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
