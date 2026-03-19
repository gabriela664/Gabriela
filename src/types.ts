export interface Campaign {
  id: string;
  name: string;
  month?: string;
  description: string;
  benefits: string[];
  category: 'Calendário' | 'Complementar';
  active: boolean;
  imageUrl: string;
  price?: number;
}

export interface LeadRequest {
  id: string;
  companyName: string;
  responsible: string;
  phone: string;
  email: string;
  employeeCount: number;
  city: string;
  state: string;
  notes: string;
  selectedCampaigns: string[]; // IDs
  status: 'Novo' | 'Em análise' | 'Orçamento enviado' | 'Fechado';
  createdAt: string;
  budget?: {
    items: { campaignId: string; value: number; description?: string }[];
    extras: { description: string; value: number }[];
    discount: number;
    proposal: string;
  };
}

export interface Layout {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    imageUrl: string;
  };
  colors: {
    primary: string;
    accent: string;
    dark: string;
    footerBg: string;
  };
  catalog: {
    title: string;
    subtitle: string;
  };
  footer: {
    email: string;
    phone: string;
    address: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    whatsapp: string;
  };
}
