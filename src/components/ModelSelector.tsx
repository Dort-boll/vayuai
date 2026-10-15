import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Cpu, CheckCircle2, ShieldCheck, Zap, Globe, Layers } from 'lucide-react';
import { AVAILABLE_MODELS } from '../lib/aiService';

interface ModelSelectorProps {
  currentModel: string;
  onSelectModel: (modelId: string) => void;
}

export default function ModelSelector({
  currentModel,
  onSelectModel,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeModel = AVAILABLE_MODELS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Targeted Button: Renamed to Vayu AI v6.1 with Next-Level Architecture Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#212121] hover:bg-[#2b2b2b] border border-[#383838] hover:border-[#4f4f4f] text-xs font-semibold text-[#F5F5F5] transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.12)] group"
        title="Vayu AI v6.1 - Cognitive Reasoning Architecture"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </div>
        
        {/* Renamed Brand & Version */}
        <span className="tracking-tight font-bold text-[13px] text-white">
          Vayu AI <span className="text-cyan-400 font-semibold text-[11px] ml-0.5">v6.1</span>
        </span>

        {/* Reasoning Core Pill */}
        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold tracking-wide border border-emerald-500/20">
          <Cpu size={11} />
          Reasoning Core
        </span>

        {/* Pure Frontend Tag */}
        <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] bg-sky-500/15 text-sky-400 font-bold uppercase tracking-wider border border-sky-500/20">
          Frontend
        </span>

        <ChevronDown
          size={14}
          className={`text-[#737373] group-hover:text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Next-Level Architecture Modal Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-88 rounded-2xl bg-[#1b1b1b]/95 border border-[#3d3d3d] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-3 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#888888] border-b border-[#2e2e2e] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-cyan-400" />
              <span>Vayu AI v6.1 Engine Spec</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono font-bold">
              100% FRONTEND
            </span>
          </div>

          <div className="p-2 space-y-2.5">
            {/* Primary Engine Card */}
            <div className="p-3.5 rounded-xl bg-[#242424] border border-[#3a3a3a] shadow-inner">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Vayu Omni-Reasoning Engine
                      <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        v6.1
                      </span>
                    </div>
                    <div className="text-[10px] text-[#888888]">Exclusive Deep Reasoning Engine</div>
                  </div>
                </div>
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              </div>

              <p className="text-[11px] text-[#A3A3A3] leading-relaxed mt-2">
                Vayu AI's premier high-parameter analytical foundation engine with deep step-by-step reasoning synthesis, running directly in the browser with total privacy.
              </p>
              
              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#333333] text-[10px]">
                <div className="text-[#888888]">
                  Architecture: <span className="text-[#F5F5F5] font-mono">Pure Client SPA</span>
                </div>
                <div className="text-[#888888]">
                  Reasoning: <span className="text-emerald-400 font-mono">Step-by-Step</span>
                </div>
                <div className="text-[#888888]">
                  AI Architecture: <span className="text-white font-medium">Vayu Neural Core</span>
                </div>
                <div className="text-[#888888]">
                  Runtime: <span className="text-cyan-400 font-medium">100% Frontend</span>
                </div>
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="space-y-1.5 px-1 text-[11px]">
              <div className="flex items-center gap-2 text-[#b0b0b0]">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>Zero Server Backend: Private local storage storage for all conversations.</span>
              </div>
              <div className="flex items-center gap-2 text-[#b0b0b0]">
                <Zap size={13} className="text-cyan-400 shrink-0" />
                <span>Progressive token streaming directly to UI with zero latency jumps.</span>
              </div>
              <div className="flex items-center gap-2 text-[#b0b0b0]">
                <Globe size={13} className="text-indigo-400 shrink-0" />
                <span>Client-orchestrated live web search & voice synthesis.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
