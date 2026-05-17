"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const blocks = [
  { 
    title: "Estrutura Comercial", 
    description: "Desenvolvemos processos de vendas previsíveis, esteiras de conversão e mecanismos de tração que sustentam a aquisição de clientes." 
  },
  { 
    title: "Produtos & Posicionamento", 
    description: "Desenhamos ofertas, otimizamos o portfólio de produtos e refinamos a mensagem para que a percepção de valor seja imediata e incontestável." 
  },
  { 
    title: "Operação & Escala", 
    description: "Implementamos infraestrutura, processos de gestão e estruturamos equipes para que o negócio cresça de forma eficiente." 
  }
];

const WhatWeDoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress as the section enters the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  // Cinematic Scroll Transitions for the Header
  const titleScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0.5, 1]);
  const titleY = useTransform(scrollYProgress, [0, 1], [150, 0]);
  const titleRotateX = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <section ref={sectionRef} className="relative bg-background overflow-hidden py-32 md:py-48" style={{ perspective: "1000px" }}>
      {/* Ambient background that flares on scroll */}
      <motion.div 
        style={{ opacity: scrollYProgress }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" 
      />
      <motion.div 
        style={{ opacity: scrollYProgress, scale: titleScale }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/[0.04] blur-[150px] rounded-full pointer-events-none" 
      />

      <div className="cinematic-container relative z-10">
        
        {/* Scroll-Driven Immersive Header */}
        <motion.div
          style={{ 
            scale: titleScale, 
            opacity: titleOpacity, 
            y: titleY, 
            rotateX: titleRotateX,
            transformOrigin: "bottom center"
          }}
          className="mb-32 flex flex-col items-center text-center gap-6"
        >
          {/* Laser Guide Line */}
          <motion.div 
            style={{ scaleY: scrollYProgress, originY: 0 }}
            className="w-[1px] h-32 bg-gradient-to-b from-transparent via-accent/40 to-transparent mb-4" 
          />
          
          <span className="text-[11px] uppercase tracking-[0.5em] text-accent font-mono">
            A Engenharia
          </span>
          
          <h2 className="text-[clamp(44px,7vw,96px)] leading-[0.9] tracking-[-0.05em] font-light text-foreground">
            O que fazemos.
          </h2>
          
          <p className="max-w-[480px] text-muted text-[16px] md:text-[18px] font-light mt-4 leading-relaxed">
            Arquitetura operacional profunda para negócios que não podem falhar na execução.
          </p>
        </motion.div>

        {/* The List (Editorial Layout) */}
        <div className="flex flex-col border-t border-white/5">
          {blocks.map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col md:flex-row md:items-center py-12 md:py-16 border-b border-white/5 hover:border-white/20 transition-colors duration-500 overflow-hidden"
            >
              {/* Animated Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />

              {/* Number */}
              <div className="md:w-[15%] mb-6 md:mb-0">
                <span className="font-mono text-[12px] md:text-[14px] text-muted group-hover:text-accent transition-colors duration-500">
                  0{i + 1}
                </span>
              </div>
              
              {/* Title */}
              <div className="md:w-[45%] mb-6 md:mb-0">
                <h3 className="text-[28px] md:text-[40px] font-light text-foreground tracking-[-0.03em] group-hover:translate-x-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {block.title}
                </h3>
              </div>
              
              {/* Description */}
              <div className="md:w-[40%]">
                <p className="text-[15px] md:text-[16px] text-foreground-secondary/60 font-light leading-relaxed group-hover:text-foreground-secondary transition-colors duration-500">
                  {block.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
