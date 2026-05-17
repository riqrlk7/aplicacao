'use client';

import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../../../lib/supabase';
import { Search, Download, Check, ExternalLink, Calendar, Phone, User, AlertCircle, RefreshCw, Lock, Trash2 } from 'lucide-react';

interface RifaRecord {
  id: string;
  nome: string;
  telefone: string;
  numero: number;
  status: 'pendente' | 'confirmado';
  comprovante_url: string;
  created_at: string;
}

export default function AdminPage() {
  const ADMIN_PASSWORD = '035781';

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // DB States
  const [buyers, setBuyers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Filtering & Search
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'confirmado'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Mutating State
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    // Always require fresh login, do not load automatically from session
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch tickets
      const { data: ticketData, error: ticketError } = await supabase
        .from('rifa_numeros')
        .select('*');

      if (ticketError) throw ticketError;
      setTickets(ticketData || []);

      // 2. Fetch buyers
      const { data: buyerData, error: buyerError } = await supabase
        .from('rifa_compradores')
        .select('*')
        .order('created_at', { ascending: false });

      if (buyerError) throw buyerError;
      setBuyers(buyerData || []);
    } catch (err: any) {
      console.error('Erro ao buscar compradores:', err.message);
      setErrorMsg('Não foi possível carregar os compradores do banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(false);
      fetchRecords();
    } else {
      setLoginError(true);
    }
  };

  const handleConfirmPayment = async (id: string) => {
    setUpdatingId(id);
    try {
      // 1. Update status in rifa_compradores
      const { error: compradorError } = await supabase
        .from('rifa_compradores')
        .update({ status: 'confirmado' })
        .eq('id', id);

      if (compradorError) throw compradorError;

      // 2. Update status in rifa_numeros
      const { error: numerosError } = await supabase
        .from('rifa_numeros')
        .update({ status: 'confirmado' })
        .eq('comprador_id', id);

      if (numerosError) throw numerosError;

      fetchRecords(); // refresh database records
    } catch (err: any) {
      console.error('Erro ao aprovar pagamento:', err.message);
      alert('Erro ao confirmar pagamento: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteBuyer = async (id: string) => {
    if (!confirm('Deseja realmente excluir este comprador e liberar todos os seus números reservados?')) return;
    try {
      const { error } = await supabase
        .from('rifa_compradores')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchRecords();
    } catch (err: any) {
      alert('Erro ao excluir comprador: ' + err.message);
    }
  };

  const formatTicketNumber = (num: number) => num.toString().padStart(3, '0');

  // Filter records
  const filteredRecords = buyers.map((buyer) => {
    const buyerTickets = tickets.filter(t => t.comprador_id === buyer.id).map(t => t.numero);
    const buyerTicketsFormatted = buyerTickets.map(formatTicketNumber).join(', ');
    return {
      ...buyer,
      numero: buyerTickets[0] || 0,
      cotaText: buyerTicketsFormatted || 'Nenhuma',
      ticketsCount: buyerTickets.length
    };
  }).filter((rec) => {
    const matchesStatus = statusFilter === 'todos' || rec.status === statusFilter;
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      rec.nome.toLowerCase().includes(query) ||
      rec.telefone.includes(query) ||
      rec.cotaText.includes(query);

    return matchesStatus && matchesSearch;
  });

  // Export to CSV Function
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert('Nenhum dado para exportar.');
      return;
    }

    const headers = ['Cota', 'Comprador', 'WhatsApp', 'Status', 'Data da Reserva', 'URL do Comprovante'];
    const rows = filteredRecords.map((rec) => [
      formatTicketNumber(rec.numero),
      rec.nome,
      rec.telefone,
      rec.status === 'confirmado' ? 'Confirmado' : 'Pendente',
      new Date(rec.created_at).toLocaleString('pt-BR'),
      rec.comprovante_url,
    ]);

    const csvContent = 
      '\uFEFF' + 
      [
        headers.join(','), 
        ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
      ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_compradores_rifa_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#020202] text-neutral-100 font-sans p-6 md:p-12 relative selection:bg-[#10b981] selection:text-black select-none">
      {/* Subtle Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-[#10b981]/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        
        {!isAuthenticated ? (
          /* ADMINISTRATIVE LOGIN COMPONENT */
          <div className="max-w-[420px] mx-auto my-20 p-8 bg-neutral-900/50 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-2xl text-center">
            <div className="inline-flex p-3 bg-[#10b981]/5 text-[#10b981] border border-[#10b981]/10 rounded-full mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display text-white mb-1.5">Painel do Organizador</h2>
            <p className="text-neutral-400 text-xs mb-6">Acesso restrito. Insira a credencial administrativa para continuar.</p>

            {loginError && (
              <div className="bg-red-950/10 border border-red-500/20 text-red-200 rounded-xl p-3 mb-4 flex gap-2 items-center text-xs justify-center shadow-lg">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Senha incorreta. Tente novamente.</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                required
                maxLength={6}
                placeholder="••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] text-white focus:outline-none focus:border-[#10b981] transition-all font-sans"
              />
              <button 
                type="submit" 
                className="w-full bg-[#10b981] hover:bg-[#34d399] text-black font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg active:scale-98"
              >
                Autenticar Acesso
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED PANEL */
          <div>
            {/* HEADER AREA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  🏆 Painel do Organizador <span className="text-xs font-semibold px-2.5 py-1 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 rounded uppercase tracking-wider">Rifa</span>
                </h1>
                <p className="text-neutral-400 text-sm mt-1">Gerencie os compradores, confirme os pagamentos do Pix e exporte relatórios.</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-neutral-900 border border-white/5 hover:border-[#10b981] hover:text-[#10b981] text-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-lg active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </button>
            </div>

            {/* CONTROLS (SEARCH & FILTERS) */}
            <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-4 md:p-6 mb-6 backdrop-blur-md flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              {/* SEARCH BAR */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar por comprador, celular ou cota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#10b981] placeholder-neutral-500 transition-all"
                />
              </div>

              {/* STATUS FILTERS */}
              <div className="flex bg-black p-1 rounded-xl border border-white/5 self-start md:self-auto">
                {(['todos', 'pendente', 'confirmado'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      statusFilter === filter
                        ? 'bg-[#10b981] text-black shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {filter === 'todos' ? 'Todos' : filter === 'pendente' ? 'Pendentes' : 'Confirmados'}
                  </button>
                ))}
              </div>
            </div>

            {/* ERROR DISPLAY */}
            {errorMsg && (
              <div className="bg-red-950/10 border border-red-500/20 text-red-200 rounded-xl p-4 mb-6 flex gap-3 items-center text-sm shadow-md">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* LOADER */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 bg-neutral-900/10 border border-white/5 rounded-2xl">
                <RefreshCw className="animate-spin text-[#10b981] w-8 h-8" />
                <p className="text-neutral-400 text-sm">Sincronizando com Supabase...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/10 border border-white/5 rounded-2xl text-neutral-400">
                <p className="text-sm">Nenhum comprador encontrado com os filtros atuais.</p>
              </div>
            ) : (
              /* TABLE CONTAINER (SCROLLABLE ON MOBILE) */
              <div className="bg-neutral-900/30 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-black/40 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                        <th className="py-4 px-6">Cota</th>
                        <th className="py-4 px-6">Comprador</th>
                        <th className="py-4 px-6">WhatsApp</th>
                        <th className="py-4 px-6">Reserva</th>
                        <th className="py-4 px-6 text-center">Status</th>
                        <th className="py-4 px-6 text-center">Comprovante</th>
                        <th className="py-4 px-6 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {filteredRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-white/[0.01] transition-all">
                          {/* COTA NUMBER */}
                          <td className="py-4 px-6 font-mono text-[#34d399] font-bold text-sm">
                            {rec.cotaText}
                          </td>

                          {/* BUYER NAME */}
                          <td className="py-4 px-6 font-medium text-white max-w-[200px] truncate">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-neutral-500" />
                              <span>{rec.nome}</span>
                            </div>
                          </td>

                          {/* PHONE */}
                          <td className="py-4 px-6 font-mono text-neutral-300">
                            <a 
                              href={`https://wa.me/55${rec.telefone.replace(/\D/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                              title="Abrir no WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{rec.telefone}</span>
                            </a>
                          </td>

                          {/* BOOKING DATE */}
                          <td className="py-4 px-6 text-neutral-400 text-xs">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                              <span>{new Date(rec.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </div>
                          </td>

                          {/* STATUS BADGE */}
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              rec.status === 'confirmado'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {rec.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                            </span>
                          </td>

                          {/* RECEIPT FILE */}
                          <td className="py-4 px-6 text-center">
                            <a
                              href={rec.comprovante_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#10b981] hover:underline"
                            >
                              <span>Ver Anexo</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>

                          {/* INLINE CONFIRM & DELETE ACTION */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {rec.status === 'pendente' ? (
                                <button
                                  onClick={() => handleConfirmPayment(rec.id)}
                                  disabled={updatingId === rec.id}
                                  className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-600 text-black font-semibold text-xs py-1.5 px-3 rounded-lg transition-all inline-flex items-center gap-1.5 active:scale-95 cursor-pointer"
                                >
                                  {updatingId === rec.id ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Aprovar</span>
                                    </>
                                  )}
                                </button>
                              ) : (
                                <span className="text-xs text-neutral-500 pr-1.5 font-semibold">Aprovado</span>
                              )}
                              <button
                                onClick={() => handleDeleteBuyer(rec.id)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 font-semibold text-xs py-1.5 px-2 rounded-lg transition-all inline-flex items-center cursor-pointer active:scale-95"
                                title="Excluir Comprador"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
