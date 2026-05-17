'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronRight, Upload, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, Heart, Gift, X, Search } from 'lucide-react';

interface RifaTicket {
  numero: number;
  status: string; // 'pendente' | 'confirmado'
}

export default function RifaPage() {
  const TOTAL_NUMBERS = 500;
  const PRICE_PER_NUMBER = 10.0;
  const PIX_KEY = '965.239.991-49';

  // DB States
  const [reservedTickets, setReservedTickets] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  // Selection States
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref to scroll to grid
  const gridSectionRef = useRef<HTMLDivElement>(null);

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-05-25T20:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch reserved numbers from Supabase on mount
  useEffect(() => {
    fetchReservedTickets();
  }, []);

  const fetchReservedTickets = async () => {
    setLoading(true);
    try {
      // Connect to table 'rifa_numeros'!
      const { data, error } = await supabase
        .from('rifa_numeros')
        .select('numero, status');

      if (error) throw error;

      const mapped: Record<number, string> = {};
      data?.forEach((item: RifaTicket) => {
        mapped[item.numero] = item.status;
      });
      setReservedTickets(mapped);
    } catch (err: any) {
      console.error('Erro ao carregar reservas:', err.message);
      setErrorMsg('Não foi possível carregar as reservas do banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  // Consult bookings state
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultPhone, setConsultPhone] = useState('');
  const [consultLoading, setConsultLoading] = useState(false);
  const [consultError, setConsultError] = useState('');
  const [consultSearched, setConsultSearched] = useState(false);
  const [consultResults, setConsultResults] = useState<{
    nome: string;
    status: string;
    tickets: number[];
  }[]>([]);

  const handleConsultBookings = async (e: FormEvent) => {
    e.preventDefault();
    const cleanPhone = consultPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setConsultError('Por favor, insira um número de telefone válido.');
      return;
    }

    setConsultLoading(true);
    setConsultError('');
    setConsultSearched(true);
    setConsultResults([]);

    try {
      // 1. Fetch buyers matching the phone
      const { data: buyers, error: buyersError } = await supabase
        .from('rifa_compradores')
        .select('id, nome, status')
        .eq('telefone', cleanPhone);

      if (buyersError) throw buyersError;

      if (!buyers || buyers.length === 0) {
        setConsultResults([]);
        return;
      }

      // 2. Fetch numbers associated with those buyers
      const buyerIds = buyers.map((b) => b.id);
      const { data: tickets, error: ticketsError } = await supabase
        .from('rifa_numeros')
        .select('numero, comprador_id')
        .in('comprador_id', buyerIds);

      if (ticketsError) throw ticketsError;

      // 3. Map tickets to their respective buyers
      const results = buyers.map((b) => {
        const buyerTickets = (tickets || [])
          .filter((t) => t.comprador_id === b.id)
          .map((t) => t.numero)
          .sort((a, b) => a - b);
        return {
          nome: b.nome,
          status: b.status,
          tickets: buyerTickets,
        };
      });

      setConsultResults(results);
    } catch (err: any) {
      console.error(err);
      setConsultError('Erro ao buscar reservas: ' + (err.message || 'Erro inesperado.'));
    } finally {
      setConsultLoading(false);
    }
  };

  const handleConsultPhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);

    if (value.length > 7) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setConsultPhone(value);
  };

  const handleSelectNumber = (num: number) => {
    if (reservedTickets[num]) return;

    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      } else {
        return [...prev, num].sort((a, b) => a - b);
      }
    });
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);

    if (value.length > 7) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setPhone(value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToGrid = () => {
    gridSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (success) {
      setSuccess(false);
      setSelectedNumbers([]);
      setName('');
      setPhone('');
      setReceiptFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!receiptFile) {
      setErrorMsg('Por favor, selecione e anexe um comprovante de pagamento Pix antes de continuar.');
      return;
    }
    if (selectedNumbers.length === 0 || !name || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (nome, telefone válido).');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // 0. Pre-flight check: verify if any selected number is already taken in the database
      const { data: takenNumbers, error: checkError } = await supabase
        .from('rifa_numeros')
        .select('numero')
        .in('numero', selectedNumbers);

      if (checkError) throw checkError;

      if (takenNumbers && takenNumbers.length > 0) {
        const list = takenNumbers.map(t => t.numero.toString().padStart(3, '0')).join(', ');
        throw new Error(`Ops! O(s) número(s) ${list} já foi(foram) reservado(s) por outra pessoa. Por favor, feche este formulário, escolha outro(s) número(s) no grid e tente novamente.`);
      }

      // 1. Upload receipt file to Supabase Storage in 'comprovantes-rifa' bucket
      const filePath = `comprovantes/${Date.now()}-${receiptFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('comprovantes-rifa')
        .upload(filePath, receiptFile);

      if (uploadError) {
        throw new Error(`Erro no upload do comprovante: ${uploadError.message}`);
      }

      // Get public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from('comprovantes-rifa')
        .getPublicUrl(filePath);

      const comprovanteUrl = urlData.publicUrl;

      // 2. Etapa 1: Salvar o comprador na tabela 'rifa_compradores'
      const { data: comprador, error: compradorError } = await supabase
        .from('rifa_compradores')
        .insert({
          nome: name,
          telefone: phone,
          valor_total: totalAmount,
          comprovante_url: comprovanteUrl,
          status: 'pendente'
        })
        .select()
        .single();

      if (compradorError) {
        throw compradorError;
      }

      // Etapa 2: Salvar os números selecionados na tabela 'rifa_numeros'
      const inserts = selectedNumbers.map((num) => ({
        comprador_id: comprador.id,
        numero: num,
        status: 'pendente'
      }));

      const { error: insertError } = await supabase
        .from('rifa_numeros')
        .insert(inserts);

      if (insertError) {
        // Rollback: delete the orphaned comprador row to keep the database consistent
        await supabase.from('rifa_compradores').delete().eq('id', comprador.id);
        
        if (insertError.code === '23505') {
          throw new Error('Um ou mais números selecionados foram reservados recentemente. Feche o modal, atualize e escolha outros.');
        }
        throw insertError;
      }

      // Success
      setSuccess(true);
      fetchReservedTickets();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro inesperado ao realizar reserva.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTicketNumber = (num: number) => num.toString().padStart(3, '0');

  const soldCount = Object.keys(reservedTickets).length;
  const progressPercentage = Math.round((soldCount / TOTAL_NUMBERS) * 100);
  const totalAmount = selectedNumbers.length * PRICE_PER_NUMBER;

  return (
    <main className="min-h-screen bg-[#020202] text-neutral-100 font-sans pb-36 selection:bg-[#10b981] selection:text-black relative select-none">
      {/* Subtle Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Cinematic top radial light effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[550px] bg-gradient-to-b from-[#10b981]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* TWO COLUMN DESKTOP GRID */}
      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_1.85fr] gap-8 lg:gap-12 py-12 lg:py-20 items-start">
        
        {/* LEFT COLUMN: RAFFLE INFO & CAUSE & PRIZES & PIX */}
        <div className="flex flex-col gap-6">
          
          {/* ELEGANT EDITORIAL HERO CARD */}
          <div className="text-left">
            <span className="inline-block text-[10px] font-bold text-[#10b981] uppercase tracking-[0.15em] bg-[#10b981]/5 border border-[#10b981]/12 px-3 py-1 rounded-full mb-3">
              Campanha Beneficente
            </span>
            <h1 className="font-display text-4xl md:text-[2.6rem] font-bold tracking-tight text-white leading-tight mb-2">
              Rifa Solidária da Vanessa
            </h1>
            <p className="text-neutral-400 text-base md:text-lg font-light tracking-wide mb-6">
              Uma ajuda simples que pode fazer diferença.
            </p>

            {/* PROGRESS BAR & STATS COMPOSITION */}
            <div className="grid grid-cols-2 gap-4 mb-6 border-t border-white/5 pt-6">
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-0.5">Valor da Cota</span>
                <span className="font-display text-2xl font-bold text-[#e5c483]">R$ 10,00</span>
              </div>
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-0.5">Data do Sorteio</span>
                <span className="font-display text-2xl font-bold text-[#34d399]">25/05 às 20h</span>
              </div>
            </div>

            {/* LIVE COUNTDOWN TIMER BLOCK */}
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl mb-6 flex flex-col items-center gap-2">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 text-center">
                ⏰ Tempo restante para o sorteio:
              </span>
              <div className="flex gap-2 justify-center">
                <div className="bg-black/30 border border-white/5 rounded-xl p-1.5 px-3 min-w-[50px] text-center">
                  <span className="block text-lg font-bold text-[#34d399] font-mono leading-none">{timeLeft.days}</span>
                  <span className="text-[8px] uppercase text-neutral-400 font-bold">Dias</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-1.5 px-3 min-w-[50px] text-center">
                  <span className="block text-lg font-bold text-[#34d399] font-mono leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <span className="text-[8px] uppercase text-neutral-400 font-bold">Horas</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-1.5 px-3 min-w-[50px] text-center">
                  <span className="block text-lg font-bold text-[#34d399] font-mono leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span className="text-[8px] uppercase text-neutral-400 font-bold">Min</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-1.5 px-3 min-w-[50px] text-center">
                  <span className="block text-lg font-bold text-[#e5c483] font-mono leading-none">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <span className="text-[8px] uppercase text-neutral-400 font-bold">Seg</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full bg-white/[0.02] rounded-full h-1.5 mb-2.5 overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-[#10b981] to-[#34d399] h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-neutral-400 font-medium">
                <span>Progresso de reservas</span>
                <span className="text-white">{soldCount} / {TOTAL_NUMBERS} reservados ({progressPercentage}%)</span>
              </div>
            </div>

            <button 
              onClick={scrollToGrid} 
              className="w-full bg-[#10b981] hover:bg-[#34d399] text-black font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider active:scale-[0.98] shadow-lg shadow-[#10b981]/10"
            >
              <span>Escolher meus números</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setConsultPhone('');
                setConsultError('');
                setConsultSearched(false);
                setConsultResults([]);
                setIsConsultModalOpen(true);
              }}
              className="w-full mt-3 bg-neutral-900/60 border border-white/5 hover:border-emerald-500/20 hover:text-emerald-400 text-neutral-300 font-bold py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider active:scale-[0.98]"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Ver Meus Números Reservados</span>
            </button>
            
            <span className="block text-[10px] text-neutral-500 text-center mt-3">
              {TOTAL_NUMBERS} cotas disponíveis • Sorteio após preencher todas
            </span>
          </div>

          {/* HUMAN CAUSE BENEFICENT CARD */}
          <div className="bg-[#10b981]/[0.02] border border-[#10b981]/12 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            {/* Soft emerald glow backing card */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#10b981]/3 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
            
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-[#10b981]/8 text-[#10b981] rounded-xl shrink-0">
                <Heart className="w-5 h-5 fill-[#10b981]/15" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059] mb-1.5">História da Campanha</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Vanessa realizará uma cirurgia para retirada de um cisto na boca. Essa rifa foi criada para ajudar nos custos do procedimento.
                </p>
              </div>
            </div>
          </div>

          {/* PRIZES CARD */}
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-white">
              <Gift className="w-4.5 h-4.5 text-[#c5a059]" />
              <span>Prêmios da Rifa</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-black/20 border border-white/5 rounded-2xl p-3 flex justify-between items-center hover:border-white/10 transition-all">
                <span className="text-[10px] uppercase font-bold text-[#c5a059] bg-[#c5a059]/6 border border-[#c5a059]/10 px-2.5 py-0.5 rounded">1º Prêmio</span>
                <strong className="text-white text-sm font-medium">Airfryer</strong>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-2xl p-3 flex justify-between items-center hover:border-white/10 transition-all">
                <span className="text-[10px] uppercase font-bold text-[#c5a059] bg-[#c5a059]/6 border border-[#c5a059]/10 px-2.5 py-0.5 rounded">2º Prêmio</span>
                <strong className="text-white text-sm font-medium">Tapete redondo de crochê</strong>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-2xl p-3 flex justify-between items-center hover:border-white/10 transition-all">
                <span className="text-[10px] uppercase font-bold text-[#c5a059] bg-[#c5a059]/6 border border-[#c5a059]/10 px-2.5 py-0.5 rounded">3º Prêmio</span>
                <strong className="text-white text-sm font-medium">2 tapetes de porta de crochê</strong>
              </div>
            </div>
          </div>

          {/* PIX INFORMATION CARD */}
          <div className="bg-[#10b981]/[0.01] border border-[#10b981]/10 rounded-3xl p-6 shadow-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#10b981] mb-2.5">Chave Pix</div>
            <div className="flex justify-between items-center bg-black border border-white/5 p-3.5 rounded-2xl gap-4">
              <span className="text-sm font-mono text-white font-bold select-all tracking-wide">{PIX_KEY}</span>
              <button
                type="button"
                onClick={handleCopyPix}
                className={`flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-black'
                    : 'bg-[#10b981]/6 hover:bg-[#10b981]/12 text-[#10b981] border border-[#10b981]/15 active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-xs text-neutral-400 text-center mt-4 leading-relaxed">
              Depois do pagamento, envie o comprovante para confirmar sua participação.
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: NUMBERS SELECTION GRID */}
        <div ref={gridSectionRef} className="bg-neutral-900/45 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
          {/* Subtle emerald glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#10b981]/2 to-transparent -translate-x-full animate-[shimmer_3.s_infinite] pointer-events-none rounded-3xl" />
          
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <h2 className="text-lg font-bold text-white font-display">Escolha seus números</h2>
            <button 
              onClick={fetchReservedTickets}
              className="text-neutral-400 hover:text-white p-1.5 hover:bg-white/5 rounded-xl transition-all"
              title="Atualizar números"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <RefreshCw className="animate-spin text-[#10b981] w-7 h-7" />
              <p className="text-neutral-400 text-xs">Carregando cotas do banco...</p>
            </div>
          ) : (
            <div>
              {/* RESPONSIVE GRID (10 columns on all screens) with compact sizing */}
              <div className="grid grid-cols-10 gap-1 sm:gap-1.5 mb-6">
                {Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1).map((num) => {
                  const isSelected = selectedNumbers.includes(num);
                  const status = reservedTickets[num];
                  const isPending = status === 'pendente';
                  const isConfirmed = status === 'confirmado';
                  const isBlocked = isPending || isConfirmed;

                  let btnClass = 'border-white/5 bg-white/[0.01] text-neutral-200 hover:bg-white/5 hover:border-white/10 cursor-pointer';
                  if (isSelected) {
                    btnClass = 'border-[#10b981] bg-[#10b981] text-black font-extrabold scale-105';
                  } else if (isConfirmed) {
                    btnClass = 'border-white/[0.01] bg-black/45 text-[#333333] cursor-not-allowed opacity-[0.35] line-through';
                  } else if (isPending) {
                    btnClass = 'border-[#10b981]/25 bg-[#10b981]/[0.01] text-[#10b981]/45 cursor-not-allowed line-through';
                  }

                  return (
                    <button
                      key={num}
                      type="button"
                      disabled={isBlocked}
                      onClick={() => handleSelectNumber(num)}
                      className={`h-7 sm:h-9 w-full flex items-center justify-center rounded-md sm:rounded-lg border text-[9px] sm:text-xs font-bold transition-all duration-200 select-none ${btnClass}`}
                    >
                      {formatTicketNumber(num)}
                    </button>
                  );
                })}
              </div>

              {/* GRID CAPTIONS IN SINGLE LINE WITH COLOR DOTS */}
              <div className="flex flex-wrap gap-5 justify-center items-center text-[10px] uppercase font-bold text-neutral-400 pt-5 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/5 border border-white/5 block" />
                  <span>Livre</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] block" />
                  <span>Selecionado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/25 block" />
                  <span>Reservado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-black/45 border border-white/[0.01] block opacity-35" />
                  <span>Confirmado</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* CAPSULE FLOATING BOTTOM CHECKOUT BAR */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/85 backdrop-blur-2xl border border-white/8 p-3.5 px-6 transition-transform duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-[35px] w-[90%] max-w-[700px] ${
        selectedNumbers.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-left w-full sm:w-auto">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Números Escolhidos</span>
              <span className="text-sm font-bold text-white truncate max-w-[200px] block mt-0.5">
                {selectedNumbers.map(formatTicketNumber).join(', ')}
              </span>
            </div>
            <div className="border-l border-white/5 pl-6">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total da Compra</span>
              <span className="text-xl font-extrabold text-[#34d399] font-display block mt-0.5">
                R$ {totalAmount.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-[#10b981] hover:bg-[#34d399] text-black font-bold py-2.5 px-8 rounded-full transition-all flex items-center justify-center gap-1 text-sm uppercase tracking-wider active:scale-98 shrink-0"
          >
            <span>Pagar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* OVERLAY MODAL FOR FORM PARTICIPATION */}
      <div className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur-[10px] flex items-center justify-center p-4 transition-all duration-300 ${
        isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        
        {/* MODAL WINDOW */}
        <div className={`bg-[#090909] border border-white/10 rounded-3xl w-full max-w-[440px] p-6 relative transform transition-transform duration-300 shadow-2xl ${
          isModalOpen ? 'scale-100' : 'scale-95'
        }`}>
          
          <button 
            onClick={handleCloseModal} 
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-xl hover:bg-white/5 transition-all"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          {success ? (
            /* SUCCESS MESSAGE INSIDE MODAL */
            <div className="text-center py-6 animate-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-emerald-400 mb-1.5">
                Participação Enviada!
              </h2>
              <p className="text-neutral-300 text-xs md:text-sm leading-relaxed mb-5">
                Sua cota está reservada como <strong className="text-[#10b981]">Pendente</strong>. O administrador irá confirmar o Pix e aprovar os seus números em breve! Obrigado pelo apoio! ❤️
              </p>
              <div className="bg-black/30 border border-white/5 rounded-2xl p-4 text-left mb-6 text-xs">
                <p className="mb-1.5 text-neutral-400"><strong>Nome:</strong> <span className="text-white font-medium">{name}</span></p>
                <p className="mb-1.5 text-neutral-400"><strong>Telefone:</strong> <span className="text-white font-medium">{phone}</span></p>
                <p className="mb-1.5 text-neutral-400">
                  <strong>Números ({selectedNumbers.length}):</strong>{' '}
                  <span className="text-[#10b981] font-bold">{selectedNumbers.map(formatTicketNumber).join(', ')}</span>
                </p>
                <p className="text-neutral-400"><strong>Comprovante:</strong> <span className="text-emerald-400 font-mono text-[10px] truncate block mt-0.5">{receiptFile?.name}</span></p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-full bg-[#10b981] hover:bg-[#34d399] text-black font-semibold py-3 px-6 rounded-xl transition-all text-xs"
              >
                Fechar janela
              </button>
            </div>
          ) : (
            /* FORM FLOW INSIDE MODAL */
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Finalizar Participação</h2>
              <p className="text-neutral-400 text-xs mb-4">Insira seus dados e anexe o comprovante Pix.</p>

              {errorMsg && (
                <div className="bg-red-950/10 border border-red-500/20 text-red-200 rounded-xl p-3 mb-4 flex gap-2 items-start text-xs shadow-lg">
                  <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* CHOSEN SUMMARY CARD */}
              <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex justify-between items-center mb-4 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Números Selecionados</span>
                  <div className="flex flex-wrap gap-1 mt-1 max-h-[30px] overflow-y-auto pr-1">
                    {selectedNumbers.map(formatTicketNumber).map((item) => (
                      <span key={item} className="text-[10px] bg-[#10b981]/10 text-[#10b981] px-1.5 py-0.5 rounded font-bold border border-[#10b981]/15">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Valor Total</span>
                  <span className="font-bold text-[#34d399] text-sm font-display mt-0.5 block">
                    R$ {totalAmount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* COPIAR PIX INSIDE MODAL (BOTAO DE PAGAR) */}
              <div className="mb-4 text-xs">
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">1. Copie a Chave Pix e realize a transferência:</span>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className={`w-full font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    copied
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-[#10b981] hover:bg-[#34d399] text-black shadow-lg shadow-[#10b981]/10'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>✓ Chave Pix Copiada com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>⚡ Copiar Chave Pix: {PIX_KEY}</span>
                    </>
                  )}
                </button>
                <span className="block text-[10px] text-neutral-500 text-center mt-1.5">
                  Chave Pix tipo CPF: {PIX_KEY} • Vanessa
                </span>
              </div>

              {/* SUBMIT FORM */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="modal-name" className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Nome Completo</label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-[#10b981] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="modal-phone" className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Telefone / WhatsApp</label>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-[#10b981] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">2. Anexe o Comprovante Pix Pago</label>
                  <div className="relative">
                    <input
                      type="file"
                      required
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-black/40 border border-dashed border-white/10 rounded-xl px-3.5 py-3.5 text-center flex flex-col items-center gap-1.5 hover:border-[#10b981] transition-all">
                      <Upload className="w-4.5 h-4.5 text-neutral-400" />
                      <span className="text-[11px] text-neutral-200 font-medium truncate max-w-full">
                        {receiptFile ? receiptFile.name : 'Selecionar comprovante'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || selectedNumbers.length === 0 || !name || phone.length < 14 || !receiptFile}
                    className="w-full bg-[#10b981] hover:bg-[#34d399] disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-lg active:scale-98 uppercase tracking-wider"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Enviando comprovante...</span>
                      </>
                    ) : !receiptFile ? (
                      <>
                        <span>Anexe o comprovante Pix para liberar</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar participação</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* CONSULT BOOKINGS MODAL */}
      <div className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur-[10px] flex items-center justify-center p-4 transition-all duration-300 ${
        isConsultModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        
        {/* MODAL WINDOW */}
        <div className={`bg-[#090909] border border-white/10 rounded-3xl w-full max-w-[440px] p-6 relative transform transition-transform duration-300 shadow-2xl ${
          isConsultModalOpen ? 'scale-100' : 'scale-95'
        }`}>
          
          <button 
            onClick={() => setIsConsultModalOpen(false)} 
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-xl hover:bg-white/5 transition-all"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          <div>
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#10b981]" />
              <span>Consultar Meus Números</span>
            </h2>
            <p className="text-neutral-400 text-xs mb-4">Insira o número de celular utilizado na reserva para ver as suas cotas.</p>

            {consultError && (
              <div className="bg-red-950/10 border border-red-500/20 text-red-200 rounded-xl p-3 mb-4 flex gap-2 items-start text-xs shadow-lg">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <span>{consultError}</span>
              </div>
            )}

            <form onSubmit={handleConsultBookings} className="space-y-4 mb-4">
              <div>
                <label htmlFor="consult-phone" className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Telefone / WhatsApp</label>
                <div className="flex gap-2">
                  <input
                    id="consult-phone"
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={consultPhone}
                    onChange={handleConsultPhoneChange}
                    className="flex-1 bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-[#10b981] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={consultLoading || consultPhone.length < 14}
                    className="bg-[#10b981] hover:bg-[#34d399] disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-bold px-5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    {consultLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Buscar</span>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* RESULTS VIEW */}
            {consultSearched && !consultLoading && (
              <div className="border-t border-white/5 pt-4 max-h-[250px] overflow-y-auto pr-1">
                {consultResults.length === 0 ? (
                  <div className="text-center py-6 text-neutral-400 text-xs">
                    <p className="mb-1 font-semibold">Nenhuma reserva encontrada.</p>
                    <p className="text-[10px] text-neutral-500">Verifique o telefone ou faça uma nova reserva no grid!</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Reservas Encontradas</h3>
                    {consultResults.map((result, idx) => (
                      <div key={idx} className="bg-black/30 border border-white/5 rounded-2xl p-4 text-xs">
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="font-semibold text-white truncate max-w-[180px]">{result.nome}</span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                            result.status === 'confirmado'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {result.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {result.tickets.map((num) => (
                            <span key={num} className="text-[10px] bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded-md font-mono font-bold border border-[#10b981]/15">
                              {formatTicketNumber(num)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

    </main>
  );
}
