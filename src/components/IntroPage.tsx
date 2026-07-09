import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Sparkles, LogIn, Compass, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface IntroPageProps {
  onAuth: () => void;
  onContinueAsGuest: () => void;
  isLoading: boolean;
}

export default function IntroPage({ onAuth, onContinueAsGuest, isLoading }: IntroPageProps) {
  const [isSwiped, setIsSwiped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(200);

  // Motion values for swipe interactive effects
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, maxDrag * 0.7], [1, 0.1]);
  const scale = useTransform(x, [0, maxDrag], [1, 1.05]);
  const bgOpacity = useTransform(x, [0, maxDrag], ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0.35)"]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setMaxDrag(containerWidth - 48 - 8);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = async (_event: any, info: any) => {
    const currentX = x.get();
    if (currentX >= maxDrag * 0.85) {
      setIsSwiped(true);
      onAuth();
      setTimeout(() => {
        x.set(0);
        setIsSwiped(false);
      }, 3500);
    } else {
      x.set(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050506] overflow-hidden px-4 select-none">
      {/* Premium Multi-layered Parallax Ambient Lights */}
      <motion.div 
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -80, 50, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" 
      />
      
      <motion.div 
        animate={{
          x: [0, -70, 80, 0],
          y: [0, 60, -90, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[550px] h-[550px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" 
      />

      <motion.div 
        animate={{
          x: [0, 50, -40, 0],
          y: [0, 70, -60, 0],
          scale: [1, 1.1, 0.9, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Elegant Mesh Network Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.015)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-30" />

      {/* Intelligent Floating Nodes (Next Level Graphic Elements) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: Math.random() * 0.3 + 0.1, 
              x: Math.random() * 1200 - 200, 
              y: Math.random() * 1000 - 100,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: ['0px', '-120px', '0px'],
              x: ['0px', '40px', '0px'],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-1.5 h-1.5 bg-cyan-400/30 rounded-full blur-[0.5px]"
          />
        ))}
      </div>

      {/* Central Premium Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] p-8 sm:p-10 rounded-[36px] bg-[#0c0c0e]/75 border border-white/10 backdrop-blur-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] relative z-10 flex flex-col items-center"
      >
        {/* Futuristic Card Corner accents */}
        <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-cyan-500/35 rounded-tl" />
        <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-cyan-500/35 rounded-tr" />
        <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-cyan-500/35 rounded-bl" />
        <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-cyan-500/35 rounded-br" />

        {/* Master Logo Sphere with multi-layered depth */}
        <div className="relative group mb-8">
          <motion.div
            animate={{
              boxShadow: ["0 0 30px rgba(6,182,212,0.15)", "0 0 50px rgba(99,102,241,0.35)", "0 0 30px rgba(6,182,212,0.15)"],
              y: [0, -6, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-[28px] p-1 bg-gradient-to-tr from-cyan-500/20 via-zinc-950 to-indigo-500/20 border border-white/15 flex items-center justify-center overflow-hidden backdrop-blur-xl"
          >
            <img
              src="/logo.png"
              alt="Vayu Logo"
              className="w-full h-full object-cover rounded-[24px] transform hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=vayu';
              }}
            />
          </motion.div>
          {/* Glowing Ring around logo */}
          <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 opacity-40 blur-md -z-10 group-hover:opacity-60 transition-opacity" />
        </div>

        {/* Brand & Mission Statement */}
        <div className="space-y-2 mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center justify-center gap-1">
            VAYU<span className="text-cyan-400 font-normal">.AI</span>
          </h1>
          <p className="text-zinc-400 text-[13px] font-medium max-w-[290px] mx-auto leading-relaxed">
            The intelligent interface designed for seamless chat, lightning web queries, and secure personal assistance.
          </p>
        </div>

        {/* Dynamic Highlight Features */}
        <div className="grid grid-cols-2 gap-3 w-full mb-8 text-xs font-semibold text-zinc-300">
          <div className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center group hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300">
            <Sparkles size={16} className="text-cyan-400" />
            <span>AI Chat Engine</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center group hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300">
            <Compass size={16} className="text-indigo-400" />
            <span>Real-time Search</span>
          </div>
        </div>

        {/* Interactive Smooth Swipe Track */}
        <div className="w-full space-y-4">
          <div
            ref={containerRef}
            className="w-full h-14 bg-[#111114]/80 border border-white/10 rounded-full relative flex items-center p-1 overflow-hidden backdrop-blur"
          >
            {/* Slide guide text */}
            <motion.div
              style={{ opacity }}
              className="absolute inset-0 flex items-center justify-center text-zinc-400 text-xs font-bold tracking-widest uppercase pointer-events-none pr-4"
            >
              <span className="bg-gradient-to-r from-zinc-400 via-white to-zinc-400 bg-clip-text text-transparent animate-pulse">
                {isLoading ? "Synchronizing..." : "Swipe to Sign In"}
              </span>
            </motion.div>

            {/* Glowing active track fill */}
            <motion.div
              style={{ width: x, backgroundColor: bgOpacity }}
              className="absolute left-1 top-1 bottom-1 rounded-full pointer-events-none"
            />

            {/* Interactive Tactile Knob */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: maxDrag }}
              dragElastic={0.08}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              style={{ x, scale }}
              animate={isSwiped ? { x: maxDrag } : {}}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white cursor-grab active:cursor-grabbing hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 border border-cyan-400/30 relative z-20 transition-colors duration-200"
            >
              {isSwiped ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight size={18} className="animate-pulse" />
              )}
            </motion.div>
          </div>

          {/* Clean Guest Continuation Option */}
          <button
            onClick={onContinueAsGuest}
            className="w-full py-3.5 px-4 rounded-xl text-zinc-500 hover:text-zinc-100 text-xs font-semibold tracking-widest uppercase transition-all hover:bg-white/[0.03] flex items-center justify-center cursor-pointer border border-transparent hover:border-white/5"
          >
            Enter Workspace as Guest
          </button>
        </div>

        {/* Small security certificate */}
        <div className="mt-8 text-[10px] text-zinc-500 font-bold tracking-widest uppercase flex items-center gap-2">
          <ShieldCheck size={13} className="text-cyan-400" />
          End-to-End Encryption
        </div>
      </motion.div>
    </div>
  );
}


