"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface FormData {
  // Step 1
  nome: string;
  instagram: string;
  nicho: string;
  cidade: string;
  whatsapp: string;
  // Step 2
  trabalhaSozinho: string;
  equipe: string;
  produtos: string;
  ticketAtual: string;
  aquisicao: string;
  faturamento: string;
  gargalo: string;
  // Step 3
  diferencial: string;
  transformacao: string;
  faltaEstruturar: string;
  audienciaEmpresa: string;
  aparecerMaior: string;
  // Step 4
  visao: string[];
  // Step 5
  direcaoEstrategica: string;
  disponibilidadeOperacional: string;
  processosConsistencia: string;
  buscaAtual: string;
}

const initialData: FormData = {
  nome: "",
  instagram: "",
  nicho: "",
  cidade: "",
  whatsapp: "",
  trabalhaSozinho: "",
  equipe: "",
  produtos: "",
  ticketAtual: "",
  aquisicao: "",
  faturamento: "",
  gargalo: "",
  diferencial: "",
  transformacao: "",
  faltaEstruturar: "",
  audienciaEmpresa: "",
  aparecerMaior: "",
  visao: [],
  direcaoEstrategica: "",
  disponibilidadeOperacional: "",
  processosConsistencia: "",
  buscaAtual: ""
};

const ApplySection = () => {
  const [step, setStep] = useState<number>(0); // 0: Call to Action, 1-5: Steps, 6: Success
  const [data, setData] = useState<FormData>(initialData);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const updateField = (fields: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...fields }));
    setError("");
  };

  const toggleVisao = (item: string) => {
    setData((prev) => {
      const current = prev.visao;
      const visao = current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item];
      return { ...prev, visao };
    });
    setError("");
  };

  // Validation before going to next step
  const validateStep = (): boolean => {
    setError("");
    if (step === 1) {
      if (!data.nome.trim() || !data.instagram.trim() || !data.nicho.trim() || !data.cidade.trim() || !data.whatsapp.trim()) {
        setError("Por favor, preencha todos os campos de identificação.");
        return false;
      }
    } else if (step === 2) {
      if (!data.trabalhaSozinho || !data.equipe || !data.produtos || !data.ticketAtual.trim() || !data.aquisicao.trim() || !data.faturamento || !data.gargalo.trim()) {
        setError("Por favor, preencha todas as perguntas sobre a sua operação atual.");
        return false;
      }
    } else if (step === 3) {
      if (!data.diferencial.trim() || !data.transformacao.trim() || !data.faltaEstruturar.trim() || !data.audienciaEmpresa.trim() || !data.aparecerMaior.trim()) {
        setError("Todas as respostas de posicionamento são cruciais para avaliarmos sua marca.");
        return false;
      }
    } else if (step === 4) {
      if (data.visao.length === 0) {
        setError("Selecione pelo menos um objetivo que deseja construir.");
        return false;
      }
    } else if (step === 5) {
      if (!data.direcaoEstrategica || !data.disponibilidadeOperacional || !data.processosConsistencia || !data.buscaAtual) {
        setError("Precisamos de respostas para todas as perguntas de fit cultural.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
      // Smooth scroll back to top of section for convenient reading
      document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError("");

    try {
      const { error: dbError } = await supabase
        .from("vertice_applications")
        .insert([{
          nome: data.nome,
          instagram: data.instagram,
          nicho: data.nicho,
          cidade: data.cidade,
          whatsapp: data.whatsapp,
          trabalha_sozinho: data.trabalhaSozinho,
          possui_equipe: data.equipe,
          possui_produtos: data.produtos,
          ticket_atual: data.ticketAtual,
          faturamento_mensal: data.faturamento,
          maior_gargalo: data.gargalo,
          diferencial: data.diferencial,
          transformacao: data.transformacao,
          falta_estruturar: data.faltaEstruturar,
          disponibilidade_operacional: data.disponibilidadeOperacional === "Sim",
          objetivos_12_meses: data.visao,
          aceita_direcao: data.direcaoEstrategica === "Sim",
          disposto_processos: data.processosConsistencia === "Sim",
          busca: data.buscaAtual
        }]);

      if (dbError) throw dbError;

      setStep(6);
      document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" });
    } catch (err: any) {
      console.error("Erro ao salvar aplicação:", err);
      setError(err.message || "Erro de conexão ao salvar a aplicação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Variants for Framer Motion horizontal slider transition
  const sliderVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.4 } }
  };

  return (
    <section id="apply-section" className="relative bg-[#050505] border-t border-white/5 overflow-hidden py-32 md:py-40 flex items-center justify-center">
      
      {/* Subtle Background Blue Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/[0.02] blur-[150px] rounded-full" />
      </div>

      <div className="cinematic-container relative z-10 w-full max-w-xl px-6">
        
        {/* Sleek Progress Indicator */}
        {step >= 1 && step <= 5 && (
          <div className="w-full mb-12 select-none">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-[10px] text-[#7A7A7A] uppercase tracking-[0.2em]">
                Etapa {step} de 5
              </span>
              <span className="font-mono text-[10px] text-accent font-semibold uppercase tracking-[0.2em]">
                {Math.round((step / 5) * 100)}% concluído
              </span>
            </div>
            <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden relative">
              <div 
                className="bg-accent h-[2px] rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 0: Landing / Starter Screen */}
          {step === 0 && (
            <motion.div
              key="step-0"
              variants={sliderVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent mb-8 block font-medium">
                Seleção
              </span>
              <h2 className="text-[clamp(38px,6vw,64px)] leading-[1.05] tracking-[-0.04em] font-light text-[#F5F5F5] mb-6">
                Aplicação.
              </h2>
              <p className="text-[15px] md:text-[17px] text-[#7A7A7A] font-light leading-relaxed mb-14 max-w-[450px]">
                A Vértice trabalha com poucas operações por vez.
              </p>

              <button 
                onClick={() => setStep(1)}
                className="relative px-10 py-5 overflow-hidden rounded-sm border border-white/10 hover:border-accent/40 bg-surface/20 backdrop-blur-md transition-all duration-700 cursor-pointer"
              >
                <span className="relative z-10 text-[11px] uppercase tracking-[0.25em] font-medium text-[#F5F5F5]">
                  Iniciar aplicação
                </span>
                <div className="absolute inset-0 bg-accent/[0.04] pointer-events-none" />
              </button>

              <p className="text-[11px] uppercase tracking-[0.3em] text-[#7A7A7A] font-mono mt-10">
                Primeiro estrutura. Depois escala.
              </p>
            </motion.div>
          )}

          {/* STEP 1: Identificação */}
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={sliderVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <div className="mb-10 text-left">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent/60 mb-3 block">
                  Fase 01 — Identificação
                </span>
                <h3 className="text-[26px] md:text-[32px] leading-tight font-light text-[#F5F5F5] tracking-tight">
                  Antes da estrutura, entendemos a operação.
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                {/* Nome */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Nome Completo</label>
                  <input 
                    type="text" 
                    value={data.nome}
                    onChange={(e) => updateField({ nome: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300"
                  />
                </div>

                {/* Instagram */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Instagram</label>
                  <input 
                    type="text" 
                    value={data.instagram}
                    onChange={(e) => updateField({ instagram: e.target.value })}
                    placeholder="@seuinstagram"
                    className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nicho */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Nicho de Atuação</label>
                    <input 
                      type="text" 
                      value={data.nicho}
                      onChange={(e) => updateField({ nicho: e.target.value })}
                      placeholder="Ex: Finanças, Saúde..."
                      className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300"
                    />
                  </div>

                  {/* Cidade */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Cidade / Estado</label>
                    <input 
                      type="text" 
                      value={data.cidade}
                      onChange={(e) => updateField({ cidade: e.target.value })}
                      placeholder="Sua cidade"
                      className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">WhatsApp</label>
                  <input 
                    type="tel" 
                    value={data.whatsapp}
                    onChange={(e) => updateField({ whatsapp: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Navigation */}
              {renderControls(handleBack, handleNext)}
            </motion.div>
          )}

          {/* STEP 2: Momento Atual */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={sliderVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <div className="mb-10 text-left">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent/60 mb-3 block">
                  Fase 02 — Momento Atual
                </span>
                <h3 className="text-[26px] md:text-[32px] leading-tight font-light text-[#F5F5F5] tracking-tight">
                  Como sua operação funciona hoje?
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                
                {/* Trabalha sozinho? */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Você trabalha sozinho?</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Sim", "Não"].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateField({ trabalhaSozinho: val })}
                        className={`py-3 text-[13px] border rounded-sm transition-all duration-300 font-light cursor-pointer ${
                          data.trabalhaSozinho === val
                            ? "border-accent/40 bg-accent/[0.05] text-[#F5F5F5]"
                            : "border-white/5 bg-[#080808]/20 text-[#7A7A7A] hover:border-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Já possui equipe? */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Já possui equipe?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Sim", "Não", "Em estruturação"].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateField({ equipe: val })}
                        className={`py-3 text-[12px] border rounded-sm transition-all duration-300 font-light cursor-pointer ${
                          data.equipe === val
                            ? "border-accent/40 bg-accent/[0.05] text-[#F5F5F5]"
                            : "border-white/5 bg-[#080808]/20 text-[#7A7A7A] hover:border-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Possui produtos? */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Possui produtos estruturados?</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Sim", "Não"].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateField({ produtos: val })}
                        className={`py-3 text-[13px] border rounded-sm transition-all duration-300 font-light cursor-pointer ${
                          data.produtos === val
                            ? "border-accent/40 bg-accent/[0.05] text-[#F5F5F5]"
                            : "border-white/5 bg-[#080808]/20 text-[#7A7A7A] hover:border-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ticket atual */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Ticket Médio Atual</label>
                  <input 
                    type="text" 
                    value={data.ticketAtual}
                    onChange={(e) => updateField({ ticketAtual: e.target.value })}
                    placeholder="Ex: R$ 500 a R$ 2.000"
                    className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300"
                  />
                </div>

                {/* Principal fonte de aquisição */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Principal Fonte de Aquisição</label>
                  <input 
                    type="text" 
                    value={data.aquisicao}
                    onChange={(e) => updateField({ aquisicao: e.target.value })}
                    placeholder="Ex: Orgânico, Tráfego Pago, Lançamentos"
                    className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300"
                  />
                </div>

                {/* Faturamento médio mensal */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Faturamento Médio Mensal</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Até R$ 20k", "R$ 20k - R$ 50k", "R$ 50k - R$ 100k", "Mais de R$ 100k"].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateField({ faturamento: val })}
                        className={`py-3 text-[12px] border rounded-sm transition-all duration-300 font-light cursor-pointer ${
                          data.faturamento === val
                            ? "border-accent/40 bg-accent/[0.05] text-[#F5F5F5]"
                            : "border-white/5 bg-[#080808]/20 text-[#7A7A7A] hover:border-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Maior gargalo hoje */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Qual seu maior gargalo operacional hoje?</label>
                  <textarea 
                    rows={3}
                    value={data.gargalo}
                    onChange={(e) => updateField({ gargalo: e.target.value })}
                    placeholder="O que impede seu negócio de crescer organizadamente?"
                    className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300 resize-none"
                  />
                </div>

              </div>

              {/* Navigation */}
              {renderControls(handleBack, handleNext)}
            </motion.div>
          )}

          {/* STEP 3: Posicionamento */}
          {step === 3 && (
            <motion.div
              key="step-3"
              variants={sliderVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <div className="mb-10 text-left">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent/60 mb-3 block">
                  Fase 03 — Posicionamento
                </span>
                <h3 className="text-[26px] md:text-[32px] leading-tight font-light text-[#F5F5F5] tracking-tight">
                  Como você deseja ser percebido?
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                
                {/* O que diferencia você hoje? */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">O que diferencia você no mercado hoje?</label>
                  <textarea 
                    rows={3}
                    value={data.diferencial}
                    onChange={(e) => updateField({ diferencial: e.target.value })}
                    placeholder="Sua proposta de valor única"
                    className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Qual transformação você entrega? */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Qual transformação você entrega aos seus clientes?</label>
                  <textarea 
                    rows={3}
                    value={data.transformacao}
                    onChange={(e) => updateField({ transformacao: e.target.value })}
                    placeholder="A mudança real pós-serviço/produto"
                    className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300 resize-none"
                  />
                </div>

                {/* O que sente que ainda falta estruturar? */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">O que você sente que ainda falta estruturar?</label>
                  <textarea 
                    rows={3}
                    value={data.faltaEstruturar}
                    onChange={(e) => updateField({ faltaEstruturar: e.target.value })}
                    placeholder="Sistemas, processos, ofertas..."
                    className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Você quer construir audiência ou empresa? */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Você quer construir audiência ou empresa?</label>
                  <textarea 
                    rows={3}
                    value={data.audienciaEmpresa}
                    onChange={(e) => updateField({ audienciaEmpresa: e.target.value })}
                    placeholder="Sua resposta define a estrutura operacional do projeto"
                    className="w-full bg-[#080808]/40 border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 focus:bg-[#080808]/60 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Você quer aparecer mais ou construir algo maior? */}
                <div className="flex flex-col gap-2 p-5 border border-[#245BFF]/10 rounded bg-[#245BFF]/[0.01]">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-accent font-medium mb-1 block">
                    Questão de Alinhamento
                  </label>
                  <label className="text-[13px] text-[#F5F5F5] font-light leading-snug mb-3 block">
                    “Você quer aparecer mais ou construir algo maior?”
                  </label>
                  <textarea 
                    rows={3}
                    value={data.aparecerMaior}
                    onChange={(e) => updateField({ aparecerMaior: e.target.value })}
                    placeholder="Sua visão sincera sobre o seu papel no negócio"
                    className="w-full bg-[#050505] border border-white/5 rounded-sm px-4 py-3.5 text-[14px] text-[#F5F5F5] placeholder:text-[#404040] focus:outline-none focus:border-accent/40 transition-all duration-300 resize-none"
                  />
                </div>

              </div>

              {/* Navigation */}
              {renderControls(handleBack, handleNext)}
            </motion.div>
          )}

          {/* STEP 4: Visão */}
          {step === 4 && (
            <motion.div
              key="step-4"
              variants={sliderVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <div className="mb-10 text-left">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent/60 mb-3 block">
                  Fase 04 — Visão de Expansão
                </span>
                <h3 className="text-[26px] md:text-[32px] leading-tight font-light text-[#F5F5F5] tracking-tight">
                  O que você quer construir nos próximos 12 meses?
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-[0.1em] font-mono text-[#7A7A7A] mb-2 block">
                  Selecione todas as opções aplicáveis à sua meta:
                </span>

                <div className="flex flex-col gap-3">
                  {[
                    { key: "Comunidade", desc: "Estruturar base ativa de clientes fiéis." },
                    { key: "Mentoria", desc: "Ofertas de alto ticket e entrega estruturada." },
                    { key: "Escala", desc: "Multiplicação de canais, funis e tração comercial." },
                    { key: "Presencial", desc: "Eventos, encontros, imersões e networks físicos." },
                    { key: "Equipe", desc: "Processo de recrutamento, papéis e liderança de bastidores." },
                    { key: "Marca forte", desc: "Narrativa, autoridade inabalável e alto valor de mercado." },
                    { key: "Recorrência", desc: "Modelos de assinatura ou esteiras recorrentes previsíveis." }
                  ].map((item) => {
                    const isSelected = data.visao.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        onClick={() => toggleVisao(item.key)}
                        className={`p-4 text-left border rounded-sm transition-all duration-500 flex items-center justify-between group cursor-pointer ${
                          isSelected
                            ? "border-accent/40 bg-accent/[0.04]"
                            : "border-white/5 bg-[#080808]/20 hover:border-white/10"
                        }`}
                      >
                        <div className="flex flex-col pr-4">
                          <span className={`text-[14px] font-medium transition-colors ${isSelected ? "text-[#F5F5F5]" : "text-[#7A7A7A] group-hover:text-[#E5E5E5]"}`}>
                            {item.key}
                          </span>
                          <span className="text-[11px] text-[#404040] group-hover:text-[#7A7A7A] transition-colors mt-0.5 font-light">
                            {item.desc}
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? "border-accent bg-accent" : "border-white/10 bg-transparent group-hover:border-white/20"
                        }`}>
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              {renderControls(handleBack, handleNext)}
            </motion.div>
          )}

          {/* STEP 5: Fit Cultural */}
          {step === 5 && (
            <motion.div
              key="step-5"
              variants={sliderVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <div className="mb-10 text-left">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent/60 mb-3 block">
                  Fase 05 — Fit Cultural
                </span>
                <h3 className="text-[26px] md:text-[32px] leading-tight font-light text-[#F5F5F5] tracking-tight">
                  Aqui separa aventureiro de operador.
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                
                {/* Você aceita direção estratégica? */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Você aceita receber direção estratégica?</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Sim", "Não"].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateField({ direcaoEstrategica: val })}
                        className={`py-3 text-[13px] border rounded-sm transition-all duration-300 font-light cursor-pointer ${
                          data.direcaoEstrategica === val
                            ? "border-accent/40 bg-accent/[0.05] text-[#F5F5F5]"
                            : "border-white/5 bg-[#080808]/20 text-[#7A7A7A] hover:border-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Você possui disponibilidade operacional? */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Você possui disponibilidade operacional real?</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Sim", "Não"].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateField({ disponibilidadeOperacional: val })}
                        className={`py-3 text-[13px] border rounded-sm transition-all duration-300 font-light cursor-pointer ${
                          data.disponibilidadeOperacional === val
                            ? "border-accent/40 bg-accent/[0.05] text-[#F5F5F5]"
                            : "border-white/5 bg-[#080808]/20 text-[#7A7A7A] hover:border-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Está disposto a executar processos com consistência? */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">Está disposto a executar processos com total consistência?</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Sim", "Não"].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateField({ processosConsistencia: val })}
                        className={`py-3 text-[13px] border rounded-sm transition-all duration-300 font-light cursor-pointer ${
                          data.processosConsistencia === val
                            ? "border-accent/40 bg-accent/[0.05] text-[#F5F5F5]"
                            : "border-white/5 bg-[#080808]/20 text-[#7A7A7A] hover:border-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hoje você busca: */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#7A7A7A]">O que você busca primordialmente hoje?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Crescimento rápido", "Estrutura sólida", "Posicionamento", "Escala sustentável"].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateField({ buscaAtual: val })}
                        className={`py-3 px-2 text-[12px] border rounded-sm transition-all duration-300 font-light cursor-pointer ${
                          data.buscaAtual === val
                            ? "border-accent/40 bg-accent/[0.05] text-[#F5F5F5]"
                            : "border-white/5 bg-[#080808]/20 text-[#7A7A7A] hover:border-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Navigation */}
              {renderControls(handleBack, handleSubmit, "Enviar Aplicação")}
            </motion.div>
          )}

          {/* STEP 6: Success Screen */}
          {step === 6 && (
            <motion.div
              key="step-6"
              variants={sliderVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center py-8"
            >
              {/* Premium Success Check Animation */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                className="w-16 h-16 rounded-full border border-accent/30 bg-accent/[0.04] flex items-center justify-center mb-10"
              >
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <h2 className="text-[32px] md:text-[40px] leading-tight tracking-[-0.04em] font-light text-[#F5F5F5] mb-6">
                Aplicação enviada.
              </h2>
              
              <p className="text-[14px] md:text-[15px] text-[#7A7A7A] font-light leading-relaxed mb-12 max-w-[450px]">
                A Vértice analisa cada operação individualmente. <br/>
                Se houver alinhamento estratégico, entraremos em contato.
              </p>

              {/* Back to top/Reset */}
              <button 
                onClick={() => { setData(initialData); setStep(0); }}
                className="relative px-8 py-3.5 overflow-hidden rounded-sm border border-white/5 hover:border-white/10 bg-transparent transition-all duration-500 cursor-pointer"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#7A7A7A] hover:text-[#F5F5F5] transition-colors">
                  Voltar ao início
                </span>
              </button>

              <p className="text-[11px] uppercase tracking-[0.3em] text-[#7A7A7A] font-mono mt-16 select-none">
                “Poucas operações por ciclo.”
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </section>
  );

  // Helper to render navigations inside form steps
  function renderControls(onBack: () => void, onNext: () => void, nextLabel: string = "Continuar") {
    return (
      <div className="mt-12 flex flex-col gap-4 select-none">
        
        {/* Error Alert */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 border border-red-500/20 bg-red-500/[0.02] text-red-400 text-[12px] font-light rounded-sm text-left"
          >
            {error}
          </motion.div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            disabled={loading}
            className={`w-1/3 py-4 text-[11px] uppercase tracking-[0.2em] font-mono text-[#7A7A7A] transition-colors bg-transparent border border-white/5 rounded-sm ${
              loading ? "opacity-30 cursor-not-allowed" : "hover:text-[#F5F5F5] hover:border-white/10 cursor-pointer"
            }`}
          >
            Voltar
          </button>
          <button
            onClick={onNext}
            disabled={loading}
            className={`flex-1 py-4 text-[11px] uppercase tracking-[0.2em] font-mono text-white bg-[#245BFF] border border-[#245BFF]/40 rounded-sm transition-all duration-300 text-center font-medium shadow-[0_0_15px_rgba(36,91,255,0.2)] ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#245BFF]/90 cursor-pointer"
            }`}
          >
            {loading ? "Enviando..." : nextLabel}
          </button>
        </div>
      </div>
    );
  }
};

export default ApplySection;
