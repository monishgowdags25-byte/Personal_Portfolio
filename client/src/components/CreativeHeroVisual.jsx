import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Cpu } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

// Error boundary to prevent Spline load failures from breaking the app
class SplineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("Spline load failed. Using high-performance image/canvas fallback.", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function CreativeHeroVisual({ splineUrl }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Smooth mouse move effect for the interactive fallback
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range [-0.5, 0.5]
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range [-0.5, 0.5]
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // If a Spline URL is provided, render the interactive 3D scene borderless
  if (splineUrl) {
    return (
      <div 
        className="w-full h-[550px] md:h-[750px] flex items-center justify-center bg-transparent pointer-events-auto"
      >
        <SplineErrorBoundary 
          fallback={
            <div className="w-full h-full rounded-[32px] overflow-hidden border border-border-custom bg-[#050505] flex items-center justify-center">
              <ImageFallback 
                mousePos={mousePos} 
                isHovered={isHovered} 
                containerRef={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          }
        >
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-xs uppercase tracking-widest text-text-secondary animate-pulse">Initializing 3D Space...</span>
            </div>
          }>
            <Spline scene={splineUrl} className="w-full h-full" />
          </Suspense>
        </SplineErrorBoundary>
      </div>
    );
  }

  // Otherwise, render the premium fallback containing the dark developer illustration with interactive parallax
  return (
    <ImageFallback 
      mousePos={mousePos} 
      isHovered={isHovered} 
      containerRef={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    />
  );
}

// Separate reusable Image Fallback Component
const ImageFallback = ({ mousePos, isHovered, containerRef, onMouseMove, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative w-full h-[550px] md:h-[750px] rounded-[32px] overflow-hidden border border-border-custom bg-[#050505] flex items-center justify-center cursor-pointer group select-none"
    >
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, white 1px, transparent 0),
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 48px 48px, 48px 48px'
        }}
      />

      {/* Decorative corner ticks (matching the screenshot "+" details) */}
      <div className="absolute top-5 left-5 z-20 font-mono text-[9px] text-accent font-bold pointer-events-none select-none flex items-center gap-1.5 opacity-50">
        <span className="w-1 h-1 rounded-full bg-accent animate-ping" />
        <span>SYS_STATUS: ACTIVE</span>
      </div>
      <div className="absolute top-5 right-5 z-20 font-mono text-[9px] text-text-secondary pointer-events-none select-none opacity-40">
        LAT: 12.9716° N // LON: 77.5946° E
      </div>
      
      {/* Radial lights behind the portrait */}
      <div 
        className="absolute inset-0 opacity-40 transition-transform duration-700 ease-out pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(255, 94, 0, 0.15) 0%, transparent 50%),
            radial-gradient(circle at ${30 - mousePos.x * 20}% ${70 - mousePos.y * 20}%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)
          `,
          filter: 'blur(50px)'
        }}
      />

      {/* Main Portrait Wrapper with 3D Tilt Effect */}
      <motion.div 
        animate={{
          rotateY: mousePos.x * 12,
          rotateX: -mousePos.y * 12,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="relative w-[85%] h-[80%] rounded-2xl overflow-hidden border border-border-custom bg-black/60 shadow-2xl flex items-center justify-center"
      >
        <img 
          src="/src/assets/hero.png" 
          alt="Monish Gowda GS - Creative Developer"
          className="absolute inset-0 w-full h-full object-cover opacity-75 grayscale hover:grayscale-0 transition-all duration-700 ease-out pointer-events-none"
        />

        {/* Ambient Overlay gradient on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

        {/* Dynamic Glowing border reflection */}
        <div 
          className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 100}% ${50 + mousePos.y * 100}%, rgba(255,255,255,0.06) 0%, transparent 50%)`
          }}
        />
        
        {/* Interactive Floating Label */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-1 pointer-events-none">
          <span className="text-[10px] tracking-[0.2em] font-extrabold text-accent uppercase font-display">CREATIVE TECHNOLOGY</span>
          <h4 className="text-lg font-bold font-display text-white tracking-tight flex items-center gap-2">
            Interactive Space Ready
            <Sparkles size={14} className="text-accent animate-pulse" />
          </h4>
        </div>
      </motion.div>

      {/* Hover Instruction Overlay */}
      <div className="absolute bottom-5 left-5 right-5 z-20 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-border-custom flex items-center justify-between text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <span className="font-semibold text-text-secondary flex items-center gap-1.5">
          <Cpu size={14} className="text-accent" />
          Move mouse to rotate visual
        </span>
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-accent">Ready for Spline 3D Integration</span>
      </div>
    </div>
  );
};
