"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const HeroSection = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles only on the client side to avoid SSR mismatch
  useEffect(() => {
    const generatedParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * -20,
    }));
    setParticles(generatedParticles);
  }, []);

  const handleScrollToApply = () => {
    const applySection = document.getElementById("apply-section");
    if (applySection) {
      applySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[95vh] w-full flex flex-col justify-center items-center overflow-hidden bg-background py-20">
      
      {/* 1. Architectural Grid Overlay with Radial Gradient Mask */}
      <div 
        className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" 
        style={{
          maskImage: "radial-gradient(circle at 50% 45%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 45%, black 20%, transparent 75%)"
        }}
      />

      {/* 2. Premium Ambient Glow Behind Logo */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] max-w-full pointer-events-none z-0">
        <motion.div
          animate={{ 
            scale: [1, 1.08, 1], 
            opacity: [0.35, 0.45, 0.35] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-full h-full bg-accent/[0.045] blur-[150px] rounded-full"
        />
      </div>

      {/* 3. Almost Invisible Slowly Drifting Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-accent/25"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, 20, 0],
              opacity: [0, 0.3, 0.6, 0.3, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* 4. Main Content Container */}
      <div className="cinematic-container relative z-10 w-full flex flex-col items-center text-center">
        
        {/* Floating Large Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 relative"
        >
          {/* Outer glow around the logo */}
          <div className="absolute inset-0 bg-accent/10 blur-[40px] rounded-full scale-75 opacity-70 pointer-events-none" />
          
          <motion.div
            animate={{ 
              y: [-8, 8, -8],
              rotate: [-0.5, 0.5, -0.5]
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative"
          >
            <Image 
              src="/assets/logo.png" 
              alt="Vértice" 
              width={260} 
              height={56} 
              className="object-contain drop-shadow-[0_0_35px_rgba(36,91,255,0.18)] grayscale brightness-110" 
              priority
            />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <div className="max-w-4xl mb-6 px-4">
          <h1 className="text-[clamp(38px,6vw,74px)] leading-[1.08] tracking-[-0.04em] font-light text-foreground select-none">
            <motion.span 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="block font-light text-[#F5F5F5]"
            >
              Estruturamos operações
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="block font-extralight text-[#7A7A7A] mt-1"
            >
              para experts e marcas.
            </motion.span>
          </h1>
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="max-w-xl text-[15px] md:text-[18px] text-[#7A7A7A] font-light leading-relaxed mb-12 px-6"
        >
          Posicionamento, produto, comercial e infraestrutura para crescimento digital sustentável.
        </motion.p>

        {/* Centered Premium CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.65 }}
          className="relative group"
        >
          <button 
            onClick={handleScrollToApply}
            className="relative px-8 py-4 overflow-hidden rounded-full border border-white/5 hover:border-accent/40 bg-surface/30 backdrop-blur-md shadow-2xl transition-all duration-700 cursor-pointer"
          >
            <span className="relative z-10 text-[11px] uppercase tracking-[0.25em] font-medium text-[#F5F5F5] group-hover:text-white transition-colors duration-500">
              Aplicar para a Vértice
            </span>
            {/* Very slow micro hover glow */}
            <div className="absolute inset-0 bg-accent/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            {/* Elegant light stripe animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          </button>
        </motion.div>
      </div>

      {/* Laser Bottom Ambient Transition Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
};

export default HeroSection;
