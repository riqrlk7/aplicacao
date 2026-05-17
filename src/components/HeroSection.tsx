"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const uiY = useTransform(scrollY, [0, 500], [0, -80]);
  const uiOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-accent/[0.05] blur-[120px] rounded-full"
        />
      </div>

      <div className="cinematic-container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Copy */}
          <div className="max-w-xl z-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16"
            >
              <Image src="/assets/logo.png" alt="Vértice" width={130} height={28} className="object-contain drop-shadow-[0_0_20px_rgba(37,99,235,0.6)]" />
            </motion.div>

            {/* Headline */}
            <div className="mb-10">
              <h1 className="text-[clamp(44px,6vw,84px)] leading-[1.05] tracking-[-0.04em] font-light text-foreground">
                <motion.span 
                  initial={{ opacity: 0, y: 40, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="block font-thin"
                  style={{ transformPerspective: 1000 }}
                >
                  Estruturamos operações
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 40, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="block"
                  style={{ transformPerspective: 1000 }}
                >
                  para experts e
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 40, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  className="block font-medium text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground-secondary/40"
                  style={{ transformPerspective: 1000 }}
                >
                  co-produtores.
                </motion.span>
              </h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-[16px] md:text-[20px] text-foreground-secondary/80 font-light leading-relaxed mb-16"
            >
              Transformamos conhecimento e audiência em uma operação organizada, posicionada e escalável.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <button className="group relative px-10 py-5 overflow-hidden rounded-full border border-white/10 hover:border-accent/50 transition-all duration-700 bg-surface/30 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <span className="relative z-10 text-[12px] uppercase tracking-[0.3em] font-medium text-foreground group-hover:text-white transition-colors">
                  Aplicar para a Vértice
                </span>
                <div className="absolute inset-0 bg-accent/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left" />
              </button>
            </motion.div>
          </div>

          {/* Right Column: Visual with Motion */}
          <motion.div
            style={{ y: uiY, opacity: uiOpacity }}
            className="relative hidden lg:block w-full h-[600px] z-10"
          >
            {/* Floating Container */}
            <motion.div
              animate={{ y: [-15, 15, -15], rotateZ: [-1, 1, -1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] aspect-[4/5]"
            >
              {/* Glassmorphism Card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-surface/20 backdrop-blur-2xl shadow-2xl flex items-center justify-center">

                {/* Seamless Image Integration */}
                <div
                  className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden"
                  style={{
                    maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)'
                  }}
                >
                  <Image
                    src="/assets/hero.png"
                    alt="Operational Visual"
                    fill
                    className="object-cover mix-blend-screen opacity-80"
                    priority
                  />
                </div>

                {/* Aesthetic Lighting Lines */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
              </div>

              {/* Decorative floating elements behind card */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border border-dashed border-white/5"
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
