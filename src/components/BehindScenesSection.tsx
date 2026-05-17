"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const skills = [
  "Estratégia de crescimento",
  "Coprodução digital",
  "Estrutura comercial",
  "Posicionamento de experts"
];

const BehindScenesSection = () => {
  return (
    <section className="relative bg-[#050505] border-t border-white/5 overflow-hidden py-32 md:py-48">
      
      <div className="cinematic-container relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full lg:w-[45%] order-2 lg:order-1 flex flex-col justify-center"
          >
            <h2 className="text-[clamp(36px,5vw,56px)] leading-[0.95] tracking-[-0.04em] font-light mb-6">
              Por trás da <br className="hidden md:block" />
              <span className="font-medium text-foreground">VÉRTICE.</span>
            </h2>
            
            <p className="text-[18px] md:text-[22px] text-foreground-secondary/90 font-light leading-tight mb-16">
              Estruturando experts,<br/> marcas e operações digitais.
            </p>

            <div className="mt-auto">
              <span className="w-12 h-[1px] bg-white/20 block mb-6"></span>
              <p className="text-[14px] md:text-[16px] text-muted font-light italic tracking-wide">
                "Não é sobre aparecer mais.<br/> É sobre construir melhor."
              </p>
            </div>
          </motion.div>

          {/* Right Column: Founder Card */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[55%] order-1 lg:order-2 relative group"
          >
            {/* Enterprise glow: very soft, spread out, almost invisible */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 blur-[150px] rounded-full pointer-events-none opacity-40 group-hover:opacity-60 group-hover:translate-x-[-45%] transition-all duration-1000" />

            <div className="relative p-6 md:p-10 rounded-2xl border border-white/5 bg-surface/20 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row gap-8 md:gap-12 items-start overflow-hidden">
              
              {/* Massive Background Text for Billionaire Brand Feel */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(80px,10vw,140px)] font-black text-white/[0.015] tracking-tighter select-none pointer-events-none whitespace-nowrap z-0">
                OPERATION
              </div>

              {/* Photo Column */}
              <div className="w-full md:w-[280px] shrink-0 flex flex-col gap-4 relative z-10">
                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-white/10 bg-black">
                  <Image 
                    src="/assets/eu.png"
                    alt="Gustavo Henrique"
                    fill
                    className="object-cover grayscale contrast-125 brightness-90 group-hover:scale-[1.02] transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>
              </div>

              {/* Info Column */}
              <div className="flex-1 relative z-10 md:pt-4">
                <h3 className="text-[32px] font-semibold tracking-tight text-white mb-1">
                  Gustavo Henrique
                </h3>
                <p className="text-[13px] uppercase tracking-[0.2em] font-mono text-accent mb-6 font-medium">
                  Founder & Estrategista Operacional
                </p>

                <p className="text-[14px] md:text-[15px] text-[#E2E8F0] font-light leading-relaxed mb-8">
                  Gustavo atua na construção de operações digitais para experts e marcas pessoais, conectando posicionamento, produto, conteúdo, comercial e sistemas em uma estrutura clara de crescimento.
                </p>

                {/* Skills Grid - Reduced & Darker Gray */}
                <ul className="flex flex-col gap-y-3">
                  {skills.map((skill, i) => (
                    <li key={i} className="flex items-center gap-3 text-[14px] text-[#94A3B8] font-light">
                      <span className="w-1 h-1 rounded-full bg-white/10"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BehindScenesSection;
