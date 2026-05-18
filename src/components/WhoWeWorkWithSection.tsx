"use client";

import { motion } from "framer-motion";

const profiles = [
  {
    num: "01",
    title: "Experts",
    description: "Que possuem conhecimento, audiência ou autoridade e precisam de estrutura."
  },
  {
    num: "02",
    title: "Marcas pessoais",
    description: "Que buscam consolidar percepção e narrativa com autoridade inquestionável."
  },
  {
    num: "03",
    title: "Coprodutores",
    description: "Que gerenciam múltiplos projetos e buscam processos e previsibilidade."
  },
  {
    num: "04",
    title: "Operações digitais",
    description: "Com time enxuto que precisa de infraestrutura robusta para crescer."
  }
];

const WhoWeWorkWithSection = () => {
  return (
    <section className="relative bg-[#050505] border-t border-white/5 overflow-hidden py-36 md:py-48">
      
      {/* Subtle background gradient flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/[0.015] blur-[150px] rounded-full pointer-events-none" />

      <div className="cinematic-container relative z-10">
        
        {/* Section Header with generous breathing space */}
        <div className="mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-4"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-mono font-medium">
              Segmentos
            </span>
            <h2 className="text-[clamp(36px,5vw,56px)] leading-[1.05] tracking-[-0.04em] font-light text-[#F5F5F5] max-w-xl">
              Construído para quem <br className="hidden sm:block" />
              <span className="text-[#7A7A7A] font-extralight">já começou a crescer.</span>
            </h2>
          </motion.div>
        </div>

        {/* 4 Minimalist Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {profiles.map((profile, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col pt-8 border-t border-white/5 hover:border-white/15 transition-colors duration-500 min-h-[220px]"
            >
              
              {/* Profile Number & Tiny Accent */}
              <div className="flex items-center justify-between mb-8 select-none">
                <span className="font-mono text-[11px] text-[#7A7A7A] group-hover:text-accent transition-colors duration-500">
                  {profile.num}
                </span>
                <div className="w-[3px] h-[3px] rounded-full bg-white/10 group-hover:bg-accent/40 transition-colors duration-500" />
              </div>

              {/* Profile Title */}
              <h3 className="text-[18px] md:text-[20px] font-medium text-[#F5F5F5] tracking-tight mb-4 group-hover:text-white transition-colors">
                {profile.title}
              </h3>

              {/* Profile Phrase Description */}
              <p className="text-[13px] md:text-[14px] text-[#7A7A7A] group-hover:text-[#B0B0B0] font-light leading-relaxed transition-colors duration-500 mt-auto">
                {profile.description}
              </p>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhoWeWorkWithSection;
