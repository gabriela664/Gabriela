import { Campaign } from '../types';

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'janeiro-branco',
    name: 'Janeiro Branco',
    month: 'Janeiro',
    description: 'Foco na saúde mental e bem-estar emocional dos colaboradores.',
    benefits: ['Redução do absenteísmo', 'Melhora do clima organizacional', 'Prevenção de transtornos mentais'],
    category: 'Calendário',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'abril-verde',
    name: 'Abril Verde',
    month: 'Abril',
    description: 'Conscientização sobre segurança e saúde no trabalho.',
    benefits: ['Redução de acidentes', 'Conformidade legal', 'Cultura de prevenção'],
    category: 'Calendário',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'sipat',
    name: 'SIPAT',
    month: 'Variável',
    description: 'Semana Interna de Prevenção de Acidentes do Trabalho.',
    benefits: ['Engajamento da CIPA', 'Treinamentos práticos', 'Integração da equipe'],
    category: 'Calendário',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'setembro-amarelo',
    name: 'Setembro Amarelo',
    month: 'Setembro',
    description: 'Prevenção ao suicídio e valorização da vida.',
    benefits: ['Apoio psicológico', 'Quebra de tabus', 'Ambiente acolhedor'],
    category: 'Calendário',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'outubro-rosa',
    name: 'Outubro Rosa',
    month: 'Outubro',
    description: 'Conscientização sobre o câncer de mama.',
    benefits: ['Saúde da mulher', 'Diagnóstico precoce', 'Responsabilidade social'],
    category: 'Calendário',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1516589174184-c68526673fd6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'novembro-azul',
    name: 'Novembro Azul',
    month: 'Novembro',
    description: 'Conscientização sobre o câncer de próstata e saúde do homem.',
    benefits: ['Saúde do homem', 'Prevenção', 'Check-ups regulares'],
    category: 'Calendário',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1503945438517-f65904a52ce6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'dezembro-vermelho',
    name: 'Dezembro Vermelho',
    month: 'Dezembro',
    description: 'Mobilização nacional na luta contra o HIV/AIDS e outras ISTs.',
    benefits: ['Informação correta', 'Prevenção', 'Redução de preconceitos'],
    category: 'Calendário',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'saude-mental-nr1',
    name: 'Saúde Mental e Fatores Psicossociais (NR-1)',
    description: 'Gestão de riscos psicossociais conforme a nova NR-1.',
    benefits: ['Gestão de Burnout', 'Prevenção de assédio', 'Melhora da produtividade'],
    category: 'Complementar',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?q=80&w=800&auto=format&fit=crop'
  }
];
