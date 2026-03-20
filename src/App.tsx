/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  CheckCircle2, 
  Send, 
  LayoutDashboard, 
  LogOut, 
  Calendar, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Building2,
  ChevronRight,
  Filter,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  Download,
  Check,
  Edit,
  Eye,
  EyeOff,
  Settings,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Palette,
  Image as ImageIcon,
  Type,
  Layout as LayoutIcon
} from 'lucide-react';
import { Campaign, LeadRequest, Layout } from './types';

// --- Components ---

const Header = ({ onAdminClick, isAdminView }: { onAdminClick: () => void, isAdminView: boolean }) => (
  <header className="bg-reque-primary text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center cursor-pointer" onClick={() => window.location.reload()}>
        <img 
          src="https://bitrix24public.com/reque.bitrix24.com.br/docs/pub/d5a891e53c5cc6b73e422c414d1cc609/showFile?token=t4foj9na2t5x" 
          alt="Reque SST Logo" 
          className="h-12 w-auto"
          referrerPolicy="no-referrer"
        />
      </div>
      <button 
        onClick={onAdminClick}
        className="flex items-center gap-2 text-sm font-medium hover:text-reque-accent transition-colors"
      >
        {isAdminView ? <><LogOut className="w-4 h-4" /> Sair do Admin</> : <><LayoutDashboard className="w-4 h-4" /> Área Restrita</>}
      </button>
    </div>
  </header>
);

const Footer = ({ layout }: { layout: Layout | null }) => (
  <footer 
    className="text-white py-16 px-6 mt-20"
    style={{ backgroundColor: layout?.colors.footerBg || '#020617' }}
  >
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <div className="flex items-center mb-6">
          <img 
            src="https://bitrix24public.com/reque.bitrix24.com.br/docs/pub/d5a891e53c5cc6b73e422c414d1cc609/showFile?token=t4foj9na2t5x" 
            alt="Reque SST Logo" 
            className="h-14 w-auto"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-2">
          <p className="text-white font-bold text-sm">Reque Saúde e Segurança do Trabalho</p>
          <p className="text-reque-accent text-xs font-bold">CREA 69.308/PR | CRM 7.105</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            P. Grossa | Castro | Guarapuava | Ipiranga | Ivai
          </p>
        </div>
      </div>
      <div>
        <h4 className="text-reque-accent font-bold mb-6 uppercase text-xs tracking-widest">Contato</h4>
        <div className="space-y-6">
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-wider mb-2">E-mail</p>
            <p className="text-gray-400 text-lg font-bold flex items-center gap-2">
              <Mail className="w-4 h-4 text-reque-accent" /> {layout?.footer.email || "contato@requesst.com.br"}
            </p>
          </div>
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-wider mb-2">Telefone</p>
            <p className="text-gray-400 text-lg font-bold flex items-center gap-2">
              <Phone className="w-4 h-4 text-reque-accent" /> {layout?.footer.phone || "(42) 3026-4999"}
            </p>
          </div>
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-wider mb-2">Endereço</p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-reque-accent" /> {layout?.footer.address || "Ponta Grossa, PR"}
            </p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-reque-accent font-bold mb-6 uppercase text-xs tracking-widest">Redes</h4>
        <div className="flex gap-4">
          {layout?.footer.facebook && (
            <a href={layout.footer.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-reque-accent transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {layout?.footer.instagram && (
            <a href={layout.footer.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-reque-accent transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {layout?.footer.whatsapp && (
            <a href={layout.footer.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-reque-accent transition-colors">
              <MessageCircle className="w-6 h-6" />
            </a>
          )}
          {layout?.footer.linkedin && (
            <a href={layout.footer.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-reque-accent transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 text-center text-xs text-gray-500">
      © {new Date().getFullYear()} Reque SST. Todos os direitos reservados.
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'public' | 'admin-login' | 'admin-dashboard'>(() => {
    const saved = localStorage.getItem('reque_view');
    return (saved as any) || 'public';
  });
  const [adminTab, setAdminTab] = useState<'requests' | 'campaigns' | 'layout'>(() => {
    const saved = localStorage.getItem('reque_adminTab');
    return (saved as any) || 'requests';
  });
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(() => {
    const saved = localStorage.getItem('reque_selectedCampaigns');
    return saved ? JSON.parse(saved) : [];
  });
  const [requests, setRequests] = useState<LeadRequest[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [activeRequest, setActiveRequest] = useState<LeadRequest | null>(null);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(() => localStorage.getItem('reque_isFormOpen') === 'true');
  const [isSuccess, setIsSuccess] = useState(false);
  const [filter, setFilter] = useState<'Todos' | 'Calendário' | 'Complementar'>('Todos');
  const [loading, setLoading] = useState(true);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('reque_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('reque_adminTab', adminTab);
  }, [adminTab]);

  useEffect(() => {
    localStorage.setItem('reque_selectedCampaigns', JSON.stringify(selectedCampaigns));
  }, [selectedCampaigns]);

  useEffect(() => {
    localStorage.setItem('reque_isFormOpen', isFormOpen.toString());
  }, [isFormOpen]);
  
  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [cRes, rRes, lRes] = await Promise.all([
        fetch('/api/campaigns'),
        fetch('/api/requests'),
        fetch('/api/layout')
      ]);
      const cData = await cRes.json();
      const rData = await rRes.json();
      const lData = await lRes.json();
      setCampaigns(cData);
      setRequests(rData);
      setLayout(lData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (layout) {
      document.documentElement.style.setProperty('--reque-primary', layout.colors.primary);
      document.documentElement.style.setProperty('--reque-accent', layout.colors.accent);
      document.documentElement.style.setProperty('--reque-dark', layout.colors.dark);
      document.documentElement.style.setProperty('--reque-footer-bg', layout.colors.footerBg);
    }
  }, [layout]);

  const saveRequest = async (updated: LeadRequest) => {
    try {
      const res = await fetch(`/api/requests/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const saved = await res.json();
      setRequests(prev => prev.map(r => r.id === updated.id ? saved : r));
      setActiveRequest(saved);
    } catch (err) {
      console.error('Error saving request:', err);
      throw err;
    }
  };

  const toggleCampaign = (id: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmitLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newRequestData = {
      companyName: formData.get('companyName') as string,
      responsible: formData.get('responsible') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      employeeCount: Number(formData.get('employeeCount')),
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      notes: formData.get('notes') as string,
      selectedCampaigns: selectedCampaigns,
    };

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequestData)
      });
      const savedRequest = await res.json();
      setRequests(prev => [savedRequest, ...prev]);
      setIsSuccess(true);
      setSelectedCampaigns([]);
      // Clear form draft on success
      localStorage.removeItem('reque_lead_form');
    } catch (err) {
      console.error('Error submitting lead:', err);
      alert('Erro ao enviar solicitação. Tente novamente.');
    }
  };

  const updateRequestStatus = async (id: string, status: LeadRequest['status']) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updated = await res.json();
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
      if (activeRequest?.id === id) setActiveRequest(updated);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const saveBudget = async (id: string, budget: LeadRequest['budget']) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget })
      });
      const updated = await res.json();
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
      if (activeRequest?.id === id) setActiveRequest(updated);
    } catch (err) {
      console.error('Error saving budget:', err);
    }
  };

  const handleSaveCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const campaignData = {
      name: formData.get('name') as string,
      month: formData.get('month') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      price: formData.get('price') ? Number(formData.get('price')) : undefined,
      benefits: (formData.get('benefits') as string).split('\n').filter(b => b.trim()),
      category: formData.get('category') as any,
      active: activeCampaign?.active ?? true
    };

    try {
      if (activeCampaign && activeCampaign.id) {
        const res = await fetch(`/api/campaigns/${activeCampaign.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignData)
        });
        const updated = await res.json();
        setCampaigns(prev => prev.map(c => c.id === activeCampaign.id ? updated : c));
      } else {
        const res = await fetch('/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignData)
        });
        const saved = await res.json();
        setCampaigns(prev => [...prev, saved]);
      }
      localStorage.removeItem(`reque_campaign_draft_${activeCampaign?.id || 'new'}`);
      alert('Campanha salva com sucesso!');
      setActiveCampaign(null);
    } catch (err) {
      console.error('Error saving campaign:', err);
      alert('Erro ao salvar a campanha. Verifique os dados e tente novamente.');
    }
  };

  const toggleCampaignActive = async (campaign: Campaign) => {
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !campaign.active })
      });
      const updated = await res.json();
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? updated : c));
    } catch (err) {
      console.error('Error toggling campaign:', err);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta campanha?')) return;
    try {
      await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
  };

  const saveLayout = async (newLayout: Layout) => {
    try {
      const res = await fetch('/api/layout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLayout)
      });
      const updated = await res.json();
      setLayout(updated);
      alert('Layout salvo com sucesso!');
    } catch (err) {
      console.error('Error saving layout:', err);
    }
  };

  const filteredCampaigns = filter === 'Todos' 
    ? campaigns.filter(c => view === 'public' ? c.active : true) 
    : campaigns.filter(c => c.category === filter && (view === 'public' ? c.active : true));

  // --- Views ---

  const PublicView = () => (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-reque-primary text-white py-32 px-6 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={layout?.hero.imageUrl || "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920&auto=format&fit=crop"} 
            alt="Profissionais em reunião" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-reque-primary via-reque-primary/90 to-transparent" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-reque-accent/5 skew-x-12 transform translate-x-20" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tighter">
              {layout?.hero.title || "Catálogo de Ações e palestras para Parceiros"}
            </h1>
            <p className="text-xl text-gray-300 mb-10 font-light leading-relaxed">
              {layout?.hero.subtitle || "Explore nosso catálogo de campanhas de SST e escolha as melhores soluções para o bem-estar da sua equipe."}
            </p>
            <a 
              href="#catalogo"
              className="inline-flex items-center gap-2 bg-reque-accent text-reque-primary px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              {layout?.hero.buttonText || "Ver Catálogo"} <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalogo" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-4">{layout?.catalog.title || "Catálogo de Campanhas"}</h2>
            <p className="text-gray-500 max-w-lg">{layout?.catalog.subtitle || "Selecione uma ou mais campanhas para receber um orçamento personalizado."}</p>
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {(['Todos', 'Calendário', 'Complementar'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f ? 'bg-white shadow-sm text-reque-primary' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((campaign, idx) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`group relative bg-white border-2 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full ${selectedCampaigns.includes(campaign.id) ? 'border-reque-accent ring-4 ring-reque-accent/10' : 'border-gray-100 hover:border-reque-primary/20'}`}
            >
              {/* Campaign Image */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={campaign.imageUrl || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop'} 
                  alt={campaign.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-reque-primary/60 to-transparent opacity-60" />
                {campaign.month && (
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-white/90 backdrop-blur-sm text-reque-primary px-3 py-1.5 rounded-full shadow-lg">
                      {campaign.month}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-4 left-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-lg ${selectedCampaigns.includes(campaign.id) ? 'bg-reque-accent text-reque-primary' : 'bg-white text-reque-primary'}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-reque-primary transition-colors">{campaign.name}</h3>
                <div className="mb-4">
                  {campaign.price ? (
                    <span className="text-xl font-bold text-reque-primary">
                      R$ {campaign.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-reque-accent uppercase tracking-wider">
                      Consultar valor
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">{campaign.description}</p>
                
                <div className="space-y-2 mb-8">
                  {campaign.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-reque-accent" />
                      {benefit}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => toggleCampaign(campaign.id)}
                  className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${selectedCampaigns.includes(campaign.id) ? 'bg-reque-accent text-reque-primary' : 'bg-reque-primary text-white hover:bg-reque-secondary'}`}
                >
                  {selectedCampaigns.includes(campaign.id) ? <><Check className="w-5 h-5" /> Selecionado</> : 'Selecionar'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Selection Floating Bar */}
      <AnimatePresence>
        {selectedCampaigns.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-6 right-6 z-40"
          >
            <div className="max-w-3xl mx-auto bg-reque-primary text-white p-4 md:p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="bg-reque-accent text-reque-primary w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {selectedCampaigns.length}
                </div>
                <div>
                  <p className="font-bold">Campanhas selecionadas</p>
                  <p className="text-xs text-gray-400">Preencha o formulário abaixo para solicitar orçamento</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-reque-accent text-reque-primary px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Solicitar Agora
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-reque-primary/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-8 md:p-12"
            >
              <button 
                onClick={() => {
                  setIsFormOpen(false);
                  setIsSuccess(false);
                }}
                className="absolute right-8 top-8 text-gray-400 hover:text-reque-primary transition-colors"
              >
                <Plus className="w-8 h-8 rotate-45" />
              </button>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4">Solicitação Enviada!</h2>
                  <p className="text-xl text-gray-500 mb-10 max-w-md mx-auto">
                    Sua solicitação foi recebida com sucesso. Em breve nossa equipe entrará em contato com você.
                  </p>
                  <button 
                    onClick={() => {
                      setIsFormOpen(false);
                      setIsSuccess(false);
                    }}
                    className="bg-reque-primary text-white px-12 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                  >
                    Entendido
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-12">
                    <div className="bg-reque-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-reque-primary" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Solicitação de Orçamento</h2>
                    <p className="text-gray-500">Você selecionou <span className="text-reque-primary font-bold">{selectedCampaigns.length}</span> campanhas. Preencha os dados abaixo para receber sua proposta.</p>
                  </div>

                  <div className="mb-10 flex flex-wrap gap-2 justify-center">
                    {selectedCampaigns.map(cid => {
                      const c = campaigns.find(camp => camp.id === cid);
                      return (
                        <span key={cid} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200">
                          {c?.name}
                        </span>
                      );
                    })}
                  </div>

                  <form 
                    onSubmit={handleSubmitLead} 
                    className="space-y-8"
                    onChange={(e) => {
                      const form = e.currentTarget;
                      const data = {
                        companyName: (form.elements.namedItem('companyName') as HTMLInputElement).value,
                        responsible: (form.elements.namedItem('responsible') as HTMLInputElement).value,
                        email: (form.elements.namedItem('email') as HTMLInputElement).value,
                        phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
                        employeeCount: (form.elements.namedItem('employeeCount') as HTMLInputElement).value,
                        city: (form.elements.namedItem('city') as HTMLInputElement).value,
                        state: (form.elements.namedItem('state') as HTMLInputElement).value,
                        notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value,
                      };
                      localStorage.setItem('reque_lead_form', JSON.stringify(data));
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Empresa</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                          <input required name="companyName" type="text" placeholder="Nome da empresa" defaultValue={JSON.parse(localStorage.getItem('reque_lead_form') || '{}').companyName || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-reque-accent transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Responsável</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                          <input required name="responsible" type="text" placeholder="Nome do responsável" defaultValue={JSON.parse(localStorage.getItem('reque_lead_form') || '{}').responsible || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-reque-accent transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">E-mail Corporativo</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                          <input required name="email" type="email" placeholder="email@empresa.com.br" defaultValue={JSON.parse(localStorage.getItem('reque_lead_form') || '{}').email || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-reque-accent transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Telefone / WhatsApp</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                          <input required name="phone" type="tel" placeholder="(00) 00000-0000" defaultValue={JSON.parse(localStorage.getItem('reque_lead_form') || '{}').phone || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-reque-accent transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Nº de Colaboradores</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                          <input required name="employeeCount" type="number" placeholder="Ex: 50" defaultValue={JSON.parse(localStorage.getItem('reque_lead_form') || '{}').employeeCount || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-reque-accent transition-all" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Cidade</label>
                          <input required name="city" type="text" placeholder="Cidade" defaultValue={JSON.parse(localStorage.getItem('reque_lead_form') || '{}').city || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-reque-accent transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">UF</label>
                          <input required name="state" type="text" maxLength={2} placeholder="UF" defaultValue={JSON.parse(localStorage.getItem('reque_lead_form') || '{}').state || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-reque-accent transition-all" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Observações Adicionais</label>
                      <textarea name="notes" rows={4} placeholder="Conte-nos um pouco mais sobre sua necessidade..." defaultValue={JSON.parse(localStorage.getItem('reque_lead_form') || '{}').notes || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-reque-accent transition-all resize-none" />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-lg bg-reque-accent text-reque-primary hover:scale-[1.02]"
                    >
                      <Send className="w-6 h-6" /> Enviar Solicitação de Orçamento
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const AdminLogin = () => {
    const [pass, setPass] = useState('');
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (pass === 'RequeMKT') setView('admin-dashboard');
      else alert('Senha incorreta (Dica: RequeMKT)');
    };
    return (
      <div className="min-h-screen bg-reque-primary flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[40px] w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-reque-accent w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-reque-primary" />
            </div>
            <h2 className="text-3xl font-bold">Área Restrita</h2>
            <p className="text-gray-400 text-sm mt-2">Acesso exclusivo para equipe Reque</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Senha de Acesso</label>
              <input 
                autoFocus
                type="password" 
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent transition-all" 
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-reque-primary text-white py-4 rounded-2xl font-bold hover:bg-reque-secondary transition-all">
              Entrar no Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  };

  const LayoutEditor = ({ layout, onSave }: { layout: Layout; onSave: (l: Layout) => void }) => {
    const [localLayout, setLocalLayout] = useState<Layout>(() => {
      const saved = localStorage.getItem('reque_layout_draft');
      return saved ? JSON.parse(saved) : layout;
    });

    useEffect(() => {
      localStorage.setItem('reque_layout_draft', JSON.stringify(localLayout));
    }, [localLayout]);

    const handleSaveLayout = () => {
      onSave(localLayout);
      localStorage.removeItem('reque_layout_draft');
    };

    const handleChange = (section: keyof Layout, field: string, value: string) => {
      setLocalLayout(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value
        }
      }));
    };

    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Alteração do Layout</h3>
          <button 
            onClick={handleSaveLayout}
            className="bg-reque-accent text-reque-primary px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Salvar Alterações
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Hero Section */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-reque-accent/10 text-reque-accent rounded-xl flex items-center justify-center">
                <LayoutIcon className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold">Seção Hero (Topo)</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Título Principal</label>
                <input 
                  value={localLayout.hero.title}
                  onChange={(e) => handleChange('hero', 'title', e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Subtítulo</label>
                <textarea 
                  rows={3}
                  value={localLayout.hero.subtitle}
                  onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Texto do Botão</label>
                  <input 
                    value={localLayout.hero.buttonText}
                    onChange={(e) => handleChange('hero', 'buttonText', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">URL da Imagem de Fundo</label>
                  <input 
                    value={localLayout.hero.imageUrl}
                    onChange={(e) => handleChange('hero', 'imageUrl', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Catalog & Colors */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-reque-accent/10 text-reque-accent rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold">Seção do Catálogo</h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Título do Catálogo</label>
                  <input 
                    value={localLayout.catalog.title}
                    onChange={(e) => handleChange('catalog', 'title', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Subtítulo do Catálogo</label>
                  <input 
                    value={localLayout.catalog.subtitle}
                    onChange={(e) => handleChange('catalog', 'subtitle', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-reque-accent/10 text-reque-accent rounded-xl flex items-center justify-center">
                  <Palette className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold">Cores do Sistema</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Cor Primária</label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={localLayout.colors.primary}
                      onChange={(e) => handleChange('colors', 'primary', e.target.value)}
                      className="w-12 h-12 rounded-lg border-none cursor-pointer"
                    />
                    <input 
                      value={localLayout.colors.primary}
                      onChange={(e) => handleChange('colors', 'primary', e.target.value)}
                      className="flex-grow bg-gray-50 border-none rounded-xl py-2 px-3 text-xs font-mono focus:ring-2 focus:ring-reque-accent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Cor de Destaque</label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={localLayout.colors.accent}
                      onChange={(e) => handleChange('colors', 'accent', e.target.value)}
                      className="w-12 h-12 rounded-lg border-none cursor-pointer"
                    />
                    <input 
                      value={localLayout.colors.accent}
                      onChange={(e) => handleChange('colors', 'accent', e.target.value)}
                      className="flex-grow bg-gray-50 border-none rounded-xl py-2 px-3 text-xs font-mono focus:ring-2 focus:ring-reque-accent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Cor Escura</label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={localLayout.colors.dark}
                      onChange={(e) => handleChange('colors', 'dark', e.target.value)}
                      className="w-12 h-12 rounded-lg border-none cursor-pointer"
                    />
                    <input 
                      value={localLayout.colors.dark}
                      onChange={(e) => handleChange('colors', 'dark', e.target.value)}
                      className="flex-grow bg-gray-50 border-none rounded-xl py-2 px-3 text-xs font-mono focus:ring-2 focus:ring-reque-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Settings */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-reque-accent/10 text-reque-accent rounded-xl flex items-center justify-center">
                <LayoutIcon className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold">Configurações do Rodapé</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-reque-primary uppercase tracking-wider">Informações de Contato</h5>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">E-mail</label>
                  <input 
                    value={localLayout.footer.email}
                    onChange={(e) => handleChange('footer', 'email', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Telefone</label>
                  <input 
                    value={localLayout.footer.phone}
                    onChange={(e) => handleChange('footer', 'phone', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Endereço</label>
                  <textarea 
                    rows={2}
                    value={localLayout.footer.address}
                    onChange={(e) => handleChange('footer', 'address', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Cor de Fundo do Rodapé</label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={localLayout.colors.footerBg}
                      onChange={(e) => handleChange('colors', 'footerBg', e.target.value)}
                      className="w-12 h-12 rounded-lg border-none cursor-pointer"
                    />
                    <input 
                      value={localLayout.colors.footerBg}
                      onChange={(e) => handleChange('colors', 'footerBg', e.target.value)}
                      className="flex-grow bg-gray-50 border-none rounded-xl py-2 px-3 text-xs font-mono focus:ring-2 focus:ring-reque-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-reque-primary uppercase tracking-wider">Redes Sociais (Links)</h5>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Facebook</label>
                  <input 
                    value={localLayout.footer.facebook}
                    onChange={(e) => handleChange('footer', 'facebook', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Instagram</label>
                  <input 
                    value={localLayout.footer.instagram}
                    onChange={(e) => handleChange('footer', 'instagram', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">LinkedIn</label>
                  <input 
                    value={localLayout.footer.linkedin}
                    onChange={(e) => handleChange('footer', 'linkedin', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">WhatsApp</label>
                  <input 
                    value={localLayout.footer.whatsapp}
                    onChange={(e) => handleChange('footer', 'whatsapp', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminDashboard = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">Dashboard Administrativo</h2>
              <p className="text-gray-500">Gerencie leads, orçamentos e campanhas da Reque SST.</p>
            </div>
            <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
              <button 
                onClick={() => setAdminTab('requests')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${adminTab === 'requests' ? 'bg-reque-primary text-white shadow-lg' : 'text-gray-400 hover:text-reque-primary'}`}
              >
                <FileText className="w-4 h-4" /> Solicitações
              </button>
              <button 
                onClick={() => setAdminTab('campaigns')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${adminTab === 'campaigns' ? 'bg-reque-primary text-white shadow-lg' : 'text-gray-400 hover:text-reque-primary'}`}
              >
                <Settings className="w-4 h-4" /> Campanhas
              </button>
              <button 
                onClick={() => setAdminTab('layout')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${adminTab === 'layout' ? 'bg-reque-primary text-white shadow-lg' : 'text-gray-400 hover:text-reque-primary'}`}
              >
                <Palette className="w-4 h-4" /> Layout
              </button>
            </div>
          </div>

          {adminTab === 'requests' && (
            <>
              <div className="flex gap-8 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-grow">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Total de Leads</p>
                  <p className="text-3xl font-bold">{requests.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-grow">
                  <p className="text-[10px] uppercase font-bold text-reque-accent mb-1 tracking-widest">Novos Hoje</p>
                  <p className="text-3xl font-bold">{requests.filter(r => r.status === 'Novo').length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {requests.length === 0 ? (
                  <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-200">
                    <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Nenhuma solicitação recebida ainda.</p>
                  </div>
                ) : (
                  requests.map(request => (
                    <div 
                      key={request.id}
                      onClick={() => setActiveRequest(request)}
                      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-reque-accent transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                          request.status === 'Novo' ? 'bg-reque-accent/10 text-reque-accent' :
                          request.status === 'Fechado' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <Building2 className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">{request.companyName}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mt-1">
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {request.responsible}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(request.createdAt).toLocaleDateString('pt-BR')}</span>
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {request.selectedCampaigns.length} campanhas</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          request.status === 'Novo' ? 'bg-reque-accent text-reque-primary' :
                          request.status === 'Fechado' ? 'bg-green-500 text-white' :
                          request.status === 'Orçamento enviado' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {request.status}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {adminTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Gestão de Campanhas</h3>
                <button 
                  onClick={() => setActiveCampaign({ id: '', name: '', description: '', benefits: [], category: 'Calendário', active: true, imageUrl: '' })}
                  className="bg-reque-accent text-reque-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Plus className="w-5 h-5" /> Nova Campanha
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${campaign.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {campaign.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setActiveCampaign(campaign)} className="p-2 text-gray-400 hover:text-reque-primary transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteCampaign(campaign.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-1">{campaign.name}</h4>
                    <div className="mb-2">
                      {campaign.price ? (
                        <span className="text-sm font-bold text-reque-primary">R$ {campaign.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      ) : (
                        <span className="text-[10px] font-bold text-reque-accent uppercase">Consultar valor</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2">{campaign.description}</p>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{campaign.category}</span>
                      <button 
                        onClick={() => toggleCampaignActive(campaign)}
                        className={`text-xs font-bold ${campaign.active ? 'text-red-400' : 'text-green-500'}`}
                      >
                        {campaign.active ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'layout' && layout && (
            <LayoutEditor layout={layout} onSave={saveLayout} />
          )}
        </div>

        {/* Campaign Edit Modal */}
        <AnimatePresence>
          {activeCampaign && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveCampaign(null)}
                className="absolute inset-0 bg-reque-primary/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white w-full max-w-2xl p-8 md:p-12 rounded-[40px] shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold">{activeCampaign.id ? 'Editar Campanha' : 'Nova Campanha'}</h3>
                  <button onClick={() => setActiveCampaign(null)} className="text-gray-400 hover:text-reque-dark">
                    <Plus className="w-8 h-8 rotate-45" />
                  </button>
                </div>

                <form 
                  onSubmit={handleSaveCampaign} 
                  className="space-y-6"
                  onChange={(e) => {
                    const form = e.currentTarget;
                    const data = {
                      ...activeCampaign,
                      name: (form.elements.namedItem('name') as HTMLInputElement).value,
                      month: (form.elements.namedItem('month') as HTMLInputElement).value,
                      imageUrl: (form.elements.namedItem('imageUrl') as HTMLInputElement).value,
                      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
                      price: Number((form.elements.namedItem('price') as HTMLInputElement).value),
                      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
                      benefits: (form.elements.namedItem('benefits') as HTMLTextAreaElement).value.split('\n').filter(b => b.trim()),
                    };
                    localStorage.setItem(`reque_campaign_draft_${activeCampaign.id || 'new'}`, JSON.stringify(data));
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Nome da Campanha</label>
                      <input required name="name" defaultValue={JSON.parse(localStorage.getItem(`reque_campaign_draft_${activeCampaign.id || 'new'}`) || '{}').name || activeCampaign.name} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Mês (Opcional)</label>
                      <input name="month" defaultValue={JSON.parse(localStorage.getItem(`reque_campaign_draft_${activeCampaign.id || 'new'}`) || '{}').month || activeCampaign.month} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">URL da Imagem de Capa</label>
                    <input name="imageUrl" defaultValue={JSON.parse(localStorage.getItem(`reque_campaign_draft_${activeCampaign.id || 'new'}`) || '{}').imageUrl || activeCampaign.imageUrl} placeholder="https://exemplo.com/imagem.jpg" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Categoria</label>
                      <select name="category" defaultValue={JSON.parse(localStorage.getItem(`reque_campaign_draft_${activeCampaign.id || 'new'}`) || '{}').category || activeCampaign.category} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent">
                        <option value="Calendário">Calendário</option>
                        <option value="Complementar">Complementar</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Valor (Opcional)</label>
                      <input name="price" type="number" step="0.01" defaultValue={JSON.parse(localStorage.getItem(`reque_campaign_draft_${activeCampaign.id || 'new'}`) || '{}').price || activeCampaign.price} placeholder="Ex: 1500.00" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Descrição</label>
                    <textarea name="description" rows={3} defaultValue={JSON.parse(localStorage.getItem(`reque_campaign_draft_${activeCampaign.id || 'new'}`) || '{}').description || activeCampaign.description} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent resize-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Benefícios (um por linha)</label>
                    <textarea name="benefits" rows={4} defaultValue={(JSON.parse(localStorage.getItem(`reque_campaign_draft_${activeCampaign.id || 'new'}`) || '{}').benefits || activeCampaign.benefits).join('\n')} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-reque-accent resize-none" />
                  </div>

                  <button type="submit" className="w-full bg-reque-accent text-reque-primary py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg">
                    Salvar Campanha
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      {activeRequest && (
        <RequestDetailModal 
          request={activeRequest} 
          campaigns={campaigns} 
          onClose={() => setActiveRequest(null)}
          onSave={saveRequest}
        />
      )}
    </div>
  );
};

  const ProposalPrint = ({ request, campaigns }: { request: LeadRequest, campaigns: Campaign[] }) => {
    const total = ((request.budget?.items.reduce((acc, i) => acc + i.value, 0) || 0) +
                  (request.budget?.extras.reduce((acc, i) => acc + i.value, 0) || 0)) -
                  (request.budget?.discount || 0);
    
    return (
      <div className="hidden print:block p-12 bg-white text-black font-sans">
        <div className="flex justify-between items-start border-b-4 border-reque-primary pb-8 mb-12">
          <div>
            <div className="flex items-center mb-2">
              <img 
                src="https://bitrix24public.com/reque.bitrix24.com.br/docs/pub/d5a891e53c5cc6b73e422c414d1cc609/showFile?token=t4foj9na2t5x" 
                alt="Reque SST Logo" 
                className="h-16 w-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-sm text-gray-500">Saúde e Segurança do Trabalho</p>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-reque-primary mb-1">Proposta Comercial</h1>
            <p className="text-sm text-gray-500">#{request.id.toUpperCase()}</p>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-reque-accent mb-4">Dados do Cliente</h2>
            <div className="space-y-1">
              <p className="font-bold text-lg">{request.companyName}</p>
              <p className="text-sm text-gray-600">A/C: {request.responsible}</p>
              <p className="text-sm text-gray-600">{request.email}</p>
              <p className="text-sm text-gray-600">{request.phone}</p>
              <p className="text-sm text-gray-600">{request.city} - {request.state}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-reque-accent mb-4">Dados do Proponente</h2>
            <div className="space-y-1">
              <p className="font-bold text-lg">Reque SST</p>
              <p className="text-sm text-gray-600">CNPJ: 45.678.901/0001-23</p>
              <p className="text-sm text-gray-600">contato@requesst.com.br</p>
              <p className="text-sm text-gray-600">(42) 3026-4999</p>
              <p className="text-sm text-gray-600">Ponta Grossa, PR</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-reque-accent mb-4">Escopo da Proposta</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-reque-primary">
                <th className="py-3 text-sm font-bold uppercase">Item / Campanha</th>
                <th className="py-3 text-sm font-bold uppercase text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {request.selectedCampaigns.map(cid => {
                const campaign = campaigns.find(c => c.id === cid);
                const budgetItem = request.budget?.items.find(i => i.campaignId === cid);
                const val = budgetItem?.value || 0;
                return (
                  <tr key={cid} className="border-b border-gray-100">
                    <td className="py-4">
                      <p className="font-bold">{campaign?.name}</p>
                      <p className="text-xs text-gray-500">{campaign?.description}</p>
                      {budgetItem?.description && (
                        <p className="text-xs text-reque-primary mt-1 italic">Obs: {budgetItem.description}</p>
                      )}
                    </td>
                    <td className="py-4 text-right font-bold">R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                );
              })}
              {request.budget?.extras.map((extra, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-bold">{extra.description}</p>
                  </td>
                  <td className="py-4 text-right font-bold">R$ {extra.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {request.budget?.discount ? (
                <tr>
                  <td className="py-4 text-right text-gray-500 font-bold">Desconto:</td>
                  <td className="py-4 text-right text-red-500 font-bold">- R$ {request.budget.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ) : null}
              <tr className="bg-reque-primary text-white">
                <td className="py-4 px-4 font-bold text-xl">Investimento Total</td>
                <td className="py-4 px-4 text-right font-bold text-xl">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {request.budget?.proposal && (
          <div className="mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-reque-accent mb-4">Informações Adicionais</h2>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
              {request.budget.proposal}
            </div>
          </div>
        )}

        <div className="mt-20 pt-12 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-8">Esta proposta tem validade de 10 dias a partir da data de emissão.</p>
          <div className="flex justify-around">
            <div className="w-64 border-t border-black pt-2">
              <p className="text-xs font-bold uppercase">Reque SST</p>
            </div>
            <div className="w-64 border-t border-black pt-2">
              <p className="text-xs font-bold uppercase">{request.companyName}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RequestDetailModal = ({ 
    request, 
    campaigns, 
    onClose, 
    onSave 
  }: { 
    request: LeadRequest; 
    campaigns: Campaign[]; 
    onClose: () => void; 
    onSave: (updated: LeadRequest) => Promise<void>; 
  }) => {
    const [tempRequest, setTempRequest] = useState<LeadRequest>(() => {
      const saved = localStorage.getItem(`reque_request_draft_${request.id}`);
      return saved ? JSON.parse(saved) : {
        ...request,
        budget: request.budget || { items: [], extras: [], discount: 0, proposal: '' }
      };
    });

    useEffect(() => {
      localStorage.setItem(`reque_request_draft_${request.id}`, JSON.stringify(tempRequest));
    }, [tempRequest, request.id]);

    const [isSaving, setIsSaving] = useState(false);
    const [showCampaignSelector, setShowCampaignSelector] = useState(false);

    const handleSave = async () => {
      setIsSaving(true);
      try {
        await onSave(tempRequest);
        localStorage.removeItem(`reque_request_draft_${request.id}`);
        alert('Informações e orçamento salvos com sucesso!');
      } catch (err) {
        console.error('Error saving request:', err);
        alert('Erro ao salvar as alterações.');
      } finally {
        setIsSaving(false);
      }
    };

    const toggleCampaignInRequest = (campaignId: string) => {
      const isSelected = tempRequest.selectedCampaigns.includes(campaignId);
      let newSelected = [...tempRequest.selectedCampaigns];
      let newItems = [...(tempRequest.budget?.items || [])];

      if (isSelected) {
        newSelected = newSelected.filter(id => id !== campaignId);
        newItems = newItems.filter(item => item.campaignId !== campaignId);
      } else {
        newSelected.push(campaignId);
        newItems.push({ campaignId, value: 0, description: '' });
      }

      setTempRequest({
        ...tempRequest,
        selectedCampaigns: newSelected,
        budget: {
          ...tempRequest.budget!,
          items: newItems
        }
      });
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10">
        <ProposalPrint request={tempRequest} campaigns={campaigns} />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-reque-primary/80 backdrop-blur-sm print:hidden"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-6xl max-h-full overflow-y-auto rounded-[40px] shadow-2xl flex flex-col md:flex-row print:hidden"
        >
          {/* Sidebar Info */}
          <div className="w-full md:w-80 bg-gray-50 p-8 border-r border-gray-100 shrink-0">
            <div className="mb-8">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Status da Solicitação</p>
              <select 
                value={tempRequest.status}
                onChange={(e) => setTempRequest({ ...tempRequest, status: e.target.value as any })}
                className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm font-bold text-sm focus:ring-2 focus:ring-reque-accent"
              >
                <option value="Novo">Novo</option>
                <option value="Em análise">Em análise</option>
                <option value="Orçamento enviado">Orçamento enviado</option>
                <option value="Fechado">Fechado</option>
              </select>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Dados do Cliente</p>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-gray-400 ml-1">Empresa</label>
                    <input 
                      type="text"
                      value={tempRequest.companyName}
                      onChange={(e) => setTempRequest({ ...tempRequest, companyName: e.target.value })}
                      className="w-full bg-white border-none rounded-xl py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-reque-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-gray-400 ml-1">Responsável</label>
                    <input 
                      type="text"
                      value={tempRequest.responsible}
                      onChange={(e) => setTempRequest({ ...tempRequest, responsible: e.target.value })}
                      className="w-full bg-white border-none rounded-xl py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-reque-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-gray-400 ml-1">E-mail</label>
                    <input 
                      type="email"
                      value={tempRequest.email}
                      onChange={(e) => setTempRequest({ ...tempRequest, email: e.target.value })}
                      className="w-full bg-white border-none rounded-xl py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-reque-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-gray-400 ml-1">Telefone</label>
                    <input 
                      type="text"
                      value={tempRequest.phone}
                      onChange={(e) => setTempRequest({ ...tempRequest, phone: e.target.value })}
                      className="w-full bg-white border-none rounded-xl py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-reque-accent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-gray-400 ml-1">Cidade</label>
                      <input 
                        type="text"
                        value={tempRequest.city}
                        onChange={(e) => setTempRequest({ ...tempRequest, city: e.target.value })}
                        className="w-full bg-white border-none rounded-xl py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-reque-accent"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-gray-400 ml-1">Estado</label>
                      <input 
                        type="text"
                        value={tempRequest.state}
                        onChange={(e) => setTempRequest({ ...tempRequest, state: e.target.value })}
                        className="w-full bg-white border-none rounded-xl py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-reque-accent"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-gray-400 ml-1">Colaboradores</label>
                    <input 
                      type="number"
                      value={tempRequest.employeeCount}
                      onChange={(e) => setTempRequest({ ...tempRequest, employeeCount: Number(e.target.value) })}
                      className="w-full bg-white border-none rounded-xl py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-reque-accent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Observações do Lead</p>
                <textarea 
                  value={tempRequest.notes}
                  onChange={(e) => setTempRequest({ ...tempRequest, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-white border-none rounded-xl py-3 px-4 text-sm shadow-sm focus:ring-2 focus:ring-reque-accent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Main Content (Budgeting) */}
          <div className="flex-grow p-8 md:p-12">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-3xl font-bold">{tempRequest.companyName}</h3>
                <p className="text-gray-400 text-sm mt-1">Editando informações e orçamento</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-reque-dark transition-colors">
                <Plus className="w-8 h-8 rotate-45" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-reque-accent" /> Campanhas Selecionadas
                  </h4>
                  <button 
                    onClick={() => setShowCampaignSelector(!showCampaignSelector)}
                    className="text-xs font-bold text-reque-primary hover:text-reque-accent transition-colors flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" /> Gerenciar Campanhas
                  </button>
                </div>

                {showCampaignSelector && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-50 p-6 rounded-2xl mb-6 border border-gray-100"
                  >
                    <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Selecione as campanhas para este orçamento:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {campaigns.map(c => (
                        <button
                          key={c.id}
                          onClick={() => toggleCampaignInRequest(c.id)}
                          className={`text-left px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                            tempRequest.selectedCampaigns.includes(c.id)
                              ? 'bg-reque-primary text-white border-reque-primary shadow-md'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-reque-accent'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {tempRequest.selectedCampaigns.map(cid => {
                    const campaign = campaigns.find(c => c.id === cid);
                    const budgetItem = tempRequest.budget?.items.find(i => i.campaignId === cid);
                    return (
                      <div key={cid} className="flex flex-col gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{campaign?.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Valor Sugerido:</span>
                            <input 
                              type="number" 
                              placeholder="R$ 0,00"
                              value={budgetItem?.value || 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const newItems = [...(tempRequest.budget?.items || [])];
                                const idx = newItems.findIndex(i => i.campaignId === cid);
                                if (idx > -1) newItems[idx].value = val;
                                else newItems.push({ campaignId: cid, value: val });
                                setTempRequest({ ...tempRequest, budget: { ...tempRequest.budget!, items: newItems } });
                              }}
                              className="w-28 bg-white border-none rounded-lg py-1.5 px-3 text-sm font-bold focus:ring-2 focus:ring-reque-accent"
                            />
                          </div>
                        </div>
                        <input 
                          type="text"
                          placeholder="Observações ou detalhes desta campanha..."
                          value={budgetItem?.description || ''}
                          onChange={(e) => {
                            const desc = e.target.value;
                            const newItems = [...(tempRequest.budget?.items || [])];
                            const idx = newItems.findIndex(i => i.campaignId === cid);
                            if (idx > -1) newItems[idx].description = desc;
                            else newItems.push({ campaignId: cid, value: 0, description: desc });
                            setTempRequest({ ...tempRequest, budget: { ...tempRequest.budget!, items: newItems } });
                          }}
                          className="w-full bg-white border-none rounded-lg py-1.5 px-3 text-xs focus:ring-2 focus:ring-reque-accent"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-reque-accent" /> Serviços Extras
                </h4>
                <div className="space-y-3">
                  {tempRequest.budget?.extras.map((extra, eIdx) => (
                    <div key={eIdx} className="flex items-start gap-3">
                      <textarea 
                        rows={1}
                        value={extra.description}
                        onChange={(e) => {
                          const newExtras = [...(tempRequest.budget?.extras || [])];
                          newExtras[eIdx].description = e.target.value;
                          setTempRequest({ ...tempRequest, budget: { ...tempRequest.budget!, extras: newExtras } });
                        }}
                        placeholder="Descrição do serviço extra..."
                        className="flex-grow bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-reque-accent resize-none min-h-[44px]"
                      />
                      <input 
                        type="number" 
                        value={extra.value}
                        onChange={(e) => {
                          const newExtras = [...(tempRequest.budget?.extras || [])];
                          newExtras[eIdx].value = Number(e.target.value);
                          setTempRequest({ ...tempRequest, budget: { ...tempRequest.budget!, extras: newExtras } });
                        }}
                        className="w-28 bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-reque-accent"
                      />
                      <button 
                        onClick={() => {
                          const newExtras = (tempRequest.budget?.extras || []).filter((_, i) => i !== eIdx);
                          setTempRequest({ ...tempRequest, budget: { ...tempRequest.budget!, extras: newExtras } });
                        }}
                        className="text-red-400 hover:text-red-600 p-2 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      setTempRequest({ 
                        ...tempRequest, 
                        budget: { 
                          ...tempRequest.budget!, 
                          extras: [...(tempRequest.budget?.extras || []), { description: '', value: 0 }] 
                        } 
                      });
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-reque-accent hover:opacity-80 transition-opacity"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Serviço Extra
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-reque-accent" /> Dados do Proponente (Reque SST)
                </h4>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Empresa</p>
                    <p className="font-bold">Reque SST</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">CNPJ</p>
                    <p className="font-bold">45.678.901/0001-23</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Contato</p>
                    <p className="font-bold">contato@requesst.com.br</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Validade</p>
                    <p className="font-bold text-reque-accent">10 dias corridos</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Proposta Personalizada</p>
                    <textarea 
                      rows={4}
                      value={tempRequest.budget?.proposal || ''}
                      onChange={(e) => {
                        setTempRequest({ ...tempRequest, budget: { ...tempRequest.budget!, proposal: e.target.value } });
                      }}
                      placeholder="Escreva aqui os detalhes da proposta..."
                      className="w-full md:w-96 bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-reque-accent resize-none"
                    />
                  </div>
                  <div className="bg-reque-primary text-white p-8 rounded-[32px] w-full md:w-auto min-w-[240px] shadow-xl relative overflow-hidden">
                    <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
                    <p className="text-[10px] uppercase font-bold text-reque-accent mb-4 tracking-widest">Resumo do Orçamento</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="font-bold">R$ {(
                          (tempRequest.budget?.items.reduce((acc, i) => acc + i.value, 0) || 0) +
                          (tempRequest.budget?.extras.reduce((acc, i) => acc + i.value, 0) || 0)
                        ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-400">Desconto:</span>
                        <input 
                          type="number"
                          value={tempRequest.budget?.discount || 0}
                          onChange={(e) => {
                            setTempRequest({ ...tempRequest, budget: { ...tempRequest.budget!, discount: Number(e.target.value) } });
                          }}
                          className="w-20 bg-white/10 border-none rounded-lg py-1 px-2 text-xs font-bold text-right focus:ring-1 focus:ring-reque-accent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-reque-accent font-bold uppercase">Total</span>
                      <span className="text-3xl font-bold">
                        R$ {(
                          ((tempRequest.budget?.items.reduce((acc, i) => acc + i.value, 0) || 0) +
                          (tempRequest.budget?.extras.reduce((acc, i) => acc + i.value, 0) || 0)) -
                          (tempRequest.budget?.discount || 0)
                        ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  disabled={isSaving}
                  onClick={handleSave}
                  className="flex-grow bg-reque-accent text-reque-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-reque-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Check className="w-5 h-5" /> Salvar Todas as Alterações</>
                  )}
                </button>
                <button 
                  onClick={() => window.print()}
                  className="bg-reque-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-reque-secondary transition-all shadow-md"
                >
                  <FileText className="w-5 h-5" /> PDF
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="font-sans antialiased text-reque-dark">
      <Header 
        isAdminView={view !== 'public'} 
        onAdminClick={() => {
          if (view === 'public') setView('admin-login');
          else setView('public');
        }} 
      />
      
      <main>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-reque-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {view === 'public' && <PublicView />}
            {view === 'admin-login' && <AdminLogin />}
            {view === 'admin-dashboard' && <AdminDashboard />}
          </>
        )}
      </main>

      {view === 'public' && <Footer layout={layout} />}
    </div>
  );
}
