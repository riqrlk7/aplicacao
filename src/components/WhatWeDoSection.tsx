"use client";

import { motion } from "framer-motion";

const items = [
  {
    num: "01",
    title: "Posicionamento",
    description: "Construção de percepção, narrativa e direção da marca."
  },
  {
    num: "02",
    title: "Produtos",
    description: "Estruturação de ofertas, esteira e validação."
  },
  {
    num: "03",
    title: "Comercial",
    description: "Funis, CRM, aplicação e operação de vendas."
  },
  {
    num: "04",
    title: "Infraestrutura",
    description: "Processos, sistemas e organização operacional."
  }
];

const WhatWeDoSection = () => {
  return (
    <section className="relative bg-background overflow-hidden py-36 md:py-48">
      
      {/* Subtle top edge transition */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

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
              Especialização
            </span>
            <h2 className="text-[clamp(36px,5vw,56px)] leading-[1.05] tracking-[-0.04em] font-light text-[#F5F5F5]">
              O que organizamos.
            </h2>
          </motion.div>
        </div>

        {/* Minimalist Rows */}
        <div className="flex flex-col border-t border-white/5">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col md:flex-row md:items-center py-14 md:py-16 border-b border-white/5 hover:border-white/10 transition-colors duration-500 overflow-hidden"
            >
              
              {/* Subtle Blue Glow Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.015] via-transparent to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />
              
              {/* Blue micro glow point on hover */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-accent rounded-full group-hover:h-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />

              {/* Number Column */}
              <div className="w-16 mb-4 md:mb-0 shrink-0 select-none">
                <span className="font-mono text-[12px] text-[#7A7A7A] group-hover:text-accent transition-colors duration-500">
                  {item.num}
                </span>
              </div>

              {/* Title Column */}
              <div className="md:w-[35%] mb-4 md:mb-0 pr-6">
                <h3 className="text-[22px] md:text-[28px] font-light text-[#F5F5F5] tracking-[-0.02em] group-hover:translate-x-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {item.title}
                </h3>
              </div>

              {/* Description Column */}
              <div className="flex-1 md:pl-8">
                <p className="text-[14px] md:text-[16px] text-[#7A7A7A] group-hover:text-[#E5E5E5] font-light leading-relaxed transition-colors duration-500 max-w-xl">
                  {item.description}
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
