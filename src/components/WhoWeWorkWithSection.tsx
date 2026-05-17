"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const profiles = [
  { t: "Experts", d: "Que monetizam conhecimento e precisam de estrutura para escalar." },
  { t: "Coprodutores", d: "Que gerenciam múltiplos projetos e buscam processos e previsibilidade." },
  { t: "Marcas pessoais", d: "Que querem se posicionar com autoridade incontestável no digital." },
  { t: "Operações digitais", d: "Com time enxuto que precisa operar acima da sua capacidade atual." },
  { t: "Negócios com audiência", d: "Que já possuem atenção e buscam monetizar através de infraestrutura." }
];

const WhoWeWorkWithSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  // Cinematic Left Column Scroll Transitions
  const leftX = useTransform(scrollYProgress, [0, 1], [-80, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0.5, 1]);
  const titleRotateY = useTransform(scrollYProgress, [0, 1], [25, 0]);

  return (
    <section ref={sectionRef} className="relative bg-background border-t border-white/5 overflow-hidden py-32 md:py-48" style={{ perspective: "1000px" }}>
      {/* Ambient background linked to scroll */}
      <motion.div 
        style={{ opacity: scrollYProgress }}
        className="absolute inset-0 pointer-events-none flex justify-center items-center"
      >
         <div className="w-[1000px] h-[500px] bg-accent/[0.02] blur-[200px] rounded-full" />
      </motion.div>

      <div className="cinematic-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Sticky Title & Requirement (Scroll Driven) */}
          <div className="lg:col-span-5 lg:sticky lg:top-40 self-start">
            <motion.div
              style={{ 
                x: leftX, 
                opacity: leftOpacity, 
                rotateY: titleRotateY,
                transformOrigin: "left center" 
              }}
            >
              <div className="flex items-center gap-4 mb-8">
                <motion.div 
                  style={{ scaleX: scrollYProgress, originX: 0 }}
                  className="h-[1px] w-12 bg-accent"
                />
                <span className="text-[12px] uppercase tracking-[0.4em] text-accent font-medium">
                  O Padrão Vértice
                </span>
              </div>
              
              <h2 className="text-[clamp(44px,6vw,72px)] leading-[0.95] tracking-[-0.04em] font-light mb-12">
                Para quem <br />
                <span className="text-foreground-secondary/40 font-thin">construímos.</span>
              </h2>
              
              {/* Premium Requirement Box */}
              <div className="relative p-8 rounded-2xl bg-surface/20 border border-white/5 backdrop-blur-md overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                 
                 <p className="text-[16px] text-foreground-secondary/80 font-light leading-relaxed relative z-10">
                   <strong className="text-foreground font-medium block mb-3 text-[18px]">Apenas para quem já começou.</strong>
                   Se você ainda está descobrindo seu posicionamento ou validando a sua primeira oferta, este não é o momento. A nossa infraestrutura foi desenhada para quem já construiu algo real e agora precisa de escala.
                 </p>
                 
                 <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/10 blur-[50px] rounded-full" />
              </div>

            </motion.div>
          </div>

          {/* Right Column: Staggered Bento Grid */}
          <div className="lg:col-span-7 mt-12 lg:mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profiles.map((profile, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative p-8 rounded-2xl border border-white/5 bg-surface/10 hover:bg-surface/30 transition-all duration-700 overflow-hidden ${
                    i % 2 !== 0 ? 'md:translate-y-12' : '' 
                  }`}
                >
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-700" />
                  
                  <div className="relative z-10">
                     <span className="block text-[12px] font-mono text-muted mb-8 group-hover:text-accent transition-colors duration-500">
                       0{i+1}
                     </span>
                     <h3 className="text-[22px] md:text-[26px] font-light text-foreground mb-4 tracking-[-0.02em] group-hover:translate-x-2 transition-transform duration-500">
                       {profile.t}
                     </h3>
                     <p className="text-[14px] md:text-[15px] text-foreground-secondary/60 font-light leading-relaxed group-hover:text-foreground-secondary/90 transition-colors duration-500">
                       {profile.d}
                     </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhoWeWorkWithSection;
