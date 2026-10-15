import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Lock, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Compass, 
  Flame, 
  Radio, 
  ServerOff 
} from 'lucide-react';

interface IntroPageProps {
  onAuth: () => void;
  onContinueAsGuest: () => void;
  isLoading: boolean;
}

export default function IntroPage({ onAuth, onContinueAsGuest, isLoading }: IntroPageProps) {
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isImageHovered, setIsImageHovered] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTechModalOpen) {
        setIsTechModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTechModalOpen]);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#141311] text-[#EFECE6] flex flex-col justify-between overflow-x-hidden overflow-y-auto selection:bg-[#DA7756]/30 selection:text-[#FBF9F5] font-sans">
      
      {/* Warm Ambient Claude-Style Lighting Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Soft warm terracotta / amber gradient orb */}
        <motion.div 
          animate={{
            x: [0, 25, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-20 w-[420px] sm:w-[650px] lg:w-[800px] h-[420px] sm:h-[650px] lg:h-[800px] bg-[#DA7756]/[0.07] rounded-full blur-[140px]" 
        />

        {/* Soft golden sand glow in bottom right */}
        <motion.div 
          animate={{
            x: [0, -35, 25, 0],
            y: [0, 30, -30, 0],
            scale: [1, 0.94, 1.08, 1],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-20 w-[380px] sm:w-[600px] lg:w-[750px] h-[380px] sm:h-[600px] lg:h-[750px] bg-[#D97706]/[0.06] rounded-full blur-[150px]" 
        />

        {/* Subtle warm center haze */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#C2410C]/[0.03] rounded-full blur-[160px]" />
        
        {/* Architectural grid texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(218,119,86,0.03)_0%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />
      </div>

      {/* Top Editorial Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#201E1A] border border-[#343029] p-0.5 shadow-sm flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Vayu AI Logo" className="w-full h-full object-cover rounded-[10px]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-[#FAF7F2]">
              Vayu AI
            </span>
            <span className="text-[11px] font-mono text-[#DA7756] tracking-wider font-semibold">
              v6.1
            </span>
          </div>
        </div>

        {/* Clean, Literary Header Action */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={onContinueAsGuest}
            className="text-[#FAF7F2] bg-[#22201C] hover:bg-[#2C2924] border border-[#38342D] px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer font-medium"
          >
            Guest Preview
          </button>
        </div>
      </header>

      {/* Main Hero Section: 2-Column Claude-Style Layout */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 my-auto flex-1 flex items-center z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Claude-Style Editorial Typography & The Two Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6 sm:space-y-8 order-2 lg:order-1">
            
            {/* Editorial Kicker (Zero-Pill Discipline: Clean Unboxed Text with Separator) */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-xs sm:text-sm font-mono tracking-widest text-[#DA7756] uppercase"
            >
              <span>VAYU AI v6.1</span>
              <span className="text-[#595349]" aria-hidden="true">·</span>
              <span className="text-[#AFA99E] font-sans font-normal tracking-normal capitalize text-xs">
                Pure Frontend Intelligence
              </span>
            </motion.div>

            {/* Master Literary Serif Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FAF7F2] leading-[1.12]">
                Clear reasoning, <br className="hidden sm:inline" />
                <span className="italic text-[#E8C5A5]">
                  crafted for depth and nuance.
                </span>
              </h1>
              <p className="text-[#ACA599] text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed">
                Meet Vayu AI—a next-generation conversational reasoning architecture designed for profound cognitive depth, analytical synthesis, and instant precision. Built with zero telemetry and absolute privacy, running entirely within your browser.
              </p>
            </motion.div>

            {/* The Two Distinct Action Buttons on the Left */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-xl"
            >
              {/* Button 1: Primary - Sign in to Vayu AI */}
              <button
                onClick={onAuth}
                disabled={isLoading}
                className="group relative flex items-center justify-center gap-3 px-7 py-3.5 sm:py-4 rounded-xl bg-[#DA7756] hover:bg-[#C96645] active:bg-[#B85737] text-white font-medium text-sm sm:text-[15px] shadow-[0_4px_24px_rgba(218,119,86,0.3)] hover:shadow-[0_6px_32px_rgba(218,119,86,0.45)] transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Signing in to Vayu AI...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Vayu AI</span>
                    <ArrowRight size={17} className="transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Button 2: Secondary - Start Chatting as Guest */}
              <button
                onClick={onContinueAsGuest}
                className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-[#22201C] hover:bg-[#2B2924] active:bg-[#1C1A17] text-[#EDE8DF] hover:text-white font-medium text-sm sm:text-[15px] border border-[#38342D] hover:border-[#4D483F] transition-all duration-200 cursor-pointer shadow-sm"
              >
                <span>Start Chatting as Guest</span>
              </button>
            </motion.div>

            {/* Quiet Clean Metadata Footer */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#7B756A] pt-1">
              <span>No credit card required</span>
              <span aria-hidden="true">·</span>
              <span>Zero server logging</span>
            </div>

          </div>

          {/* Right Column: Claude-Style Artwork Image Showcase */}
          <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[340px] sm:max-w-[430px] lg:max-w-none flex flex-col items-center"
            >
              
              {/* Outer Warm Terracotta / Sand Halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#DA7756]/20 via-[#D97706]/10 to-transparent rounded-[32px] blur-2xl -z-10 opacity-70" />

              {/* Main Artwork Frame in Claude Style */}
              <div 
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  setMousePos({ x, y });
                }}
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => {
                  setIsImageHovered(false);
                  setMousePos({ x: 0, y: 0 });
                }}
                style={{
                  transform: isImageHovered
                    ? `perspective(1000px) rotateX(${mousePos.y * -6}deg) rotateY(${mousePos.x * 6}deg) scale3d(1.015, 1.015, 1.015)`
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                  transition: isImageHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
                }}
                className="relative w-full rounded-[28px] sm:rounded-[36px] bg-[#1A1916] border border-[#2F2C26] p-3 sm:p-4 shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col items-center select-none"
              >
                
                {/* Image Container with Elegant Ratio & Framing */}
                <div className="relative w-full aspect-square rounded-[22px] sm:rounded-[28px] overflow-hidden bg-[#100F0D] border border-[#2E2B24] group">
                  <img
                    src="/src/assets/images/claude_style_hero_1792046089712.jpg"
                    alt="Claude style geometric celestial sculpture with warm terracotta and sunburst facets"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Soft Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141311]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Minimal Tag Top Right */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#181714]/85 border border-[#333029] text-[10px] font-mono text-[#D4CFC7] backdrop-blur-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DA7756] animate-pulse" />
                    <span>VAYU REASONING MATRIX</span>
                  </div>

                  {/* Floating Tag Bottom Left */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#181714]/90 border border-[#333029] backdrop-blur-md flex items-center justify-between">
                    <div>
                      <div className="text-xs font-serif text-[#FAF7F2]">Vayu Neural Core</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#24221D] border border-[#3A362E] flex items-center justify-center p-1.5 shrink-0">
                      <img src="/logo.png" alt="Vayu AI" className="w-full h-full object-cover rounded" />
                    </div>
                  </div>
                </div>

                {/* Bottom Architectural Caption */}
                <div className="w-full px-2 pt-3 pb-1 flex items-center justify-between text-[11px] font-mono text-[#918B80]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#48BB78]" />
                    <span>Pure Client Engine</span>
                  </div>
                  <span className="text-[#C4BEB4]">Distributed Edge</span>
                </div>

              </div>

            </motion.div>
          </div>

        </div>
      </main>

      {/* Editorial Footer (Zero Pills, Clean Typographic Separators) */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#827C71] z-20 border-t border-[#22201C]">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="font-serif text-[#B5AFA4]">Vayu AI v6.1</span>
          <span aria-hidden="true">·</span>
          <span>Next-Generation Conversational Intelligence</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#DA7756]">100% Pure Frontend</span>
        </div>
        
        <div className="flex items-center gap-4 text-[#A8A296]">
          <button 
            onClick={() => setIsTechModalOpen(true)}
            className="hover:text-[#FAF7F2] transition-colors cursor-pointer"
          >
            Technical Specifications
          </button>
          <span aria-hidden="true">·</span>
          <button 
            onClick={onContinueAsGuest}
            className="hover:text-[#FAF7F2] transition-colors cursor-pointer"
          >
            Launch Guest App
          </button>
        </div>
      </footer>

      {/* Technical Architecture & Specs Modal (Claude Warm Styling) */}
      <AnimatePresence>
        {isTechModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTechModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#181714] border border-[#333029] rounded-2xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden z-10 max-h-[90vh] overflow-y-auto text-[#EDE8DF]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#282621]">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#FAF7F2]">
                    Vayu AI Architecture & Specifications
                  </h3>
                  <p className="text-xs text-[#9E988F] mt-0.5">
                    High-parameter deep cognitive reasoning architecture
                  </p>
                </div>
                <button
                  onClick={() => setIsTechModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#9E988F] hover:text-[#FAF7F2] hover:bg-[#26241F] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
                <div className="p-4 rounded-xl bg-[#201E1A] border border-[#2E2B25] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#DA7756]">AI Model Engine</div>
                  <div className="text-sm font-medium text-[#FAF7F2]">Vayu Neural Architecture</div>
                  <p className="text-xs text-[#9E988F]">Advanced multi-turn reasoning with deep chain-of-thought, mathematical precision, and clean code generation.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#201E1A] border border-[#2E2B25] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#D97706]">Edge Infrastructure</div>
                  <div className="text-sm font-medium text-[#FAF7F2]">Distributed Global Edge</div>
                  <p className="text-xs text-[#9E988F]">Ultra-low latency static edge delivery network providing zero cold starts and instant client execution.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#201E1A] border border-[#2E2B25] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#48BB78]">Privacy & Execution</div>
                  <div className="text-sm font-medium text-[#FAF7F2]">100% Pure Frontend</div>
                  <p className="text-xs text-[#9E988F]">No central database, no telemetry servers, and zero data logging. All state is browser-sandboxed.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#201E1A] border border-[#2E2B25] space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#A855F7]">Authentication & Storage</div>
                  <div className="text-sm font-medium text-[#FAF7F2]">Encrypted Session Sync</div>
                  <p className="text-xs text-[#9E988F]">Sign in directly for secure, private cross-device session synchronization without third-party tracking.</p>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#282621]">
                <button
                  onClick={() => {
                    setIsTechModalOpen(false);
                    onContinueAsGuest();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#25231F] hover:bg-[#2D2A25] text-[#D8D2C7] hover:text-white text-xs font-medium transition-all cursor-pointer"
                >
                  Enter as Guest
                </button>
                <button
                  onClick={() => {
                    setIsTechModalOpen(false);
                    onAuth();
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#DA7756] hover:bg-[#C96645] text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
                >
                  <span>Sign In to Vayu AI</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
