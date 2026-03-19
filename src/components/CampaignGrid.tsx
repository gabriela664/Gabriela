import React, { useState } from 'react';
import { Calendar, Info, Check, Plus } from 'lucide-react';

/**
 * Interface for the Campaign data structure
 */
export interface Campaign {
  id: string;
  title: string;
  category_name: string; // Ex: "Saúde Mental", "Segurança"
  month_reference: string; // Ex: "Maio", "Setembro"
  description_short: string; // Um resumo de 2 linhas
  cover_image_url: string; // URL de uma imagem real
  is_customizable: boolean; // Se a campanha permite personalização
}

/**
 * Props for the CampaignCard component
 */
interface CampaignCardProps {
  campaign: Campaign;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

/**
 * Individual Campaign Card Component
 */
const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, isSelected, onToggle }) => {
  // Color mapping based on category
  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('saúde') || cat.includes('mental')) return 'bg-blue-500';
    if (cat.includes('segurança')) return 'bg-red-500';
    if (cat.includes('prevenção')) return 'bg-emerald-500';
    return 'bg-reque-accent'; // Default brand color
  };

  return (
    <div 
      className={`group relative flex flex-col h-full bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 overflow-hidden ${
        isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}
    >
      {/* Header: Image & Badge */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={campaign.cover_image_url} 
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
        
        {/* Category Badge */}
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg ${getCategoryColor(campaign.category_name)}`}>
          {campaign.category_name}
        </span>

        {/* Customizable Indicator */}
        {campaign.is_customizable && (
          <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-reque-primary px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tight">
            Personalizável
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-grow p-6">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{campaign.month_reference}</span>
        </div>
        
        <h3 className="text-xl font-bold text-reque-primary mb-3 leading-tight">
          {campaign.title}
        </h3>
        
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
          {campaign.description_short}
        </p>
      </div>

      {/* Footer: Actions */}
      <div className="p-6 pt-0 flex gap-3">
        <button 
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Saiba mais action logic
          }}
        >
          <Info className="w-4 h-4" />
          Saiba Mais
        </button>
        
        <button 
          onClick={() => onToggle(campaign.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            isSelected 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'border border-emerald-500 text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" />
              Selecionado
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Selecionar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * Main Campaign Grid Component
 */
const CampaignGrid: React.FC = () => {
  // State for selected campaigns
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);

  // Toggle selection logic
  const handleToggle = (id: string) => {
    setSelectedCampaignIds(prev => 
      prev.includes(id) 
        ? prev.filter(cid => cid !== id) 
        : [...prev, id]
    );
  };

  // Mock Data
  const campaigns: Campaign[] = [
    {
      id: '1',
      title: 'Janeiro Branco: Saúde Mental',
      category_name: 'Saúde Mental',
      month_reference: 'Janeiro',
      description_short: 'Foco no bem-estar emocional e psicológico dos colaboradores, promovendo um ambiente de trabalho mais saudável e produtivo.',
      cover_image_url: 'https://picsum.photos/seed/mentalhealth/600/400',
      is_customizable: true
    },
    {
      id: '2',
      title: 'Abril Verde: Segurança no Trabalho',
      category_name: 'Segurança',
      month_reference: 'Abril',
      description_short: 'Conscientização sobre a prevenção de acidentes e doenças ocupacionais, reforçando a cultura de segurança em todos os níveis.',
      cover_image_url: 'https://picsum.photos/seed/safety/600/400',
      is_customizable: false
    },
    {
      id: '3',
      title: 'Maio Amarelo: Trânsito Seguro',
      category_name: 'Prevenção',
      month_reference: 'Maio',
      description_short: 'Ações voltadas para a segurança no trânsito, essencial para colaboradores que realizam deslocamentos ou operam frotas.',
      cover_image_url: 'https://picsum.photos/seed/traffic/600/400',
      is_customizable: true
    },
    {
      id: '4',
      title: 'Setembro Amarelo: Valorização da Vida',
      category_name: 'Saúde Mental',
      month_reference: 'Setembro',
      description_short: 'Campanha mundial de prevenção ao suicídio e promoção da saúde mental, com foco em acolhimento e escuta ativa.',
      cover_image_url: 'https://picsum.photos/seed/life/600/400',
      is_customizable: true
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-reque-primary mb-2">
            Catálogo de Campanhas
          </h2>
          <p className="text-gray-500 max-w-2xl">
            Selecione as campanhas que deseja incluir no seu plano anual de SST. 
            Nossa equipe entrará em contato para personalizar cada detalhe.
          </p>
        </div>
        
        {/* Selection Summary */}
        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Selecionadas</p>
            <p className="text-2xl font-bold text-emerald-700">{selectedCampaignIds.length}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
            <Check className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {campaigns.map(campaign => (
          <CampaignCard 
            key={campaign.id}
            campaign={campaign}
            isSelected={selectedCampaignIds.includes(campaign.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Floating Action Button (Mobile) or Footer Action */}
      {selectedCampaignIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4 md:hidden">
          <button className="w-full bg-reque-accent text-reque-primary py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-3 animate-bounce">
            Solicitar Orçamento ({selectedCampaignIds.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignGrid;
