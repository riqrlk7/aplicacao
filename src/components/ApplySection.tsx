"use client";

import { motion } from "framer-motion";

const ApplySection = () => {
  return (
    <section className="relative bg-background-secondary border-t border-border-subtle overflow-hidden py-32 md:py-48 flex items-center justify-center text-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.02] blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="cinematic-container relative z-10 w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent/50 mb-8 block">
            NEXT STEP
          </span>
          
          <h2 className="text-[clamp(44px,6vw,72px)] leading-[1] tracking-[-0.04em] font-light mb-8">
            Aplicação.
          </h2>
          
          <p className="text-[18px] md:text-[20px] text-foreground-secondary/80 font-light leading-relaxed mb-16 max-w-[600px] mx-auto">
            Se você já possui conhecimento, audiência ou operação e busca estrutura para o próximo nível, aplique abaixo.
          </p>

          <button className="group relative px-12 py-6 overflow-hidden rounded-sm border border-white/10 hover:border-accent/50 transition-colors duration-700 bg-surface/50 backdrop-blur-md">
            <span className="relative z-10 text-[12px] uppercase tracking-[0.3em] text-foreground group-hover:text-white transition-colors font-medium">
              Aplicar para a Vértice
            </span>
            <div className="absolute inset-0 bg-accent/20 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ApplySection;
