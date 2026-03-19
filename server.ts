import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "data.json");

const DEFAULT_LAYOUT = {
  hero: {
    title: "Catálogo de Ações e palestras para Parceiros",
    subtitle: "Explore nosso catálogo de campanhas de SST e escolha as melhores soluções para o bem-estar da sua equipe.",
    buttonText: "Ver Catálogo",
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920&auto=format&fit=crop"
  },
  colors: {
    primary: "#0f172a",
    accent: "#fbbf24",
    dark: "#020617",
    footerBg: "#020617"
  },
  catalog: {
    title: "Catálogo de Campanhas",
    subtitle: "Selecione uma ou mais campanhas para receber um orçamento personalizado."
  },
  footer: {
    email: "contato@requesst.com.br",
    phone: "(11) 3456-7890",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    facebook: "https://facebook.com/requesst",
    instagram: "https://instagram.com/requesst",
    linkedin: "https://linkedin.com/company/requesst",
    whatsapp: "https://wa.me/551134567890"
  }
};

// Initial Data Helper
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    return {
      campaigns: data.campaigns || [],
      requests: data.requests || [],
      layout: {
        ...DEFAULT_LAYOUT,
        ...data.layout,
        hero: { ...DEFAULT_LAYOUT.hero, ...data.layout?.hero },
        colors: { ...DEFAULT_LAYOUT.colors, ...data.layout?.colors },
        catalog: { ...DEFAULT_LAYOUT.catalog, ...data.layout?.catalog },
        footer: { ...DEFAULT_LAYOUT.footer, ...data.layout?.footer }
      }
    };
  }
  return {
    campaigns: [
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
    ],
    requests: [],
    layout: DEFAULT_LAYOUT
  };
}

let { campaigns, requests, layout } = loadData();

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ campaigns, requests, layout }, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/campaigns", (req, res) => {
    res.json(campaigns);
  });

  app.get("/api/layout", (req, res) => {
    res.json(layout);
  });

  app.put("/api/layout", (req, res) => {
    layout = { ...layout, ...req.body };
    saveData();
    res.json(layout);
  });

  app.post("/api/campaigns", (req, res) => {
    const newCampaign = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    campaigns.push(newCampaign);
    saveData();
    res.json(newCampaign);
  });

  app.put("/api/campaigns/:id", (req, res) => {
    const { id } = req.params;
    campaigns = campaigns.map(c => c.id === id ? { ...c, ...req.body } : c);
    saveData();
    res.json(campaigns.find(c => c.id === id));
  });

  app.delete("/api/campaigns/:id", (req, res) => {
    const { id } = req.params;
    campaigns = campaigns.filter(c => c.id !== id);
    saveData();
    res.sendStatus(204);
  });

  app.get("/api/requests", (req, res) => {
    res.json(requests);
  });

  app.post("/api/requests", (req, res) => {
    const newRequest = { 
      ...req.body, 
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'Novo'
    };
    requests.unshift(newRequest);
    saveData();
    res.json(newRequest);
  });

  app.put("/api/requests/:id", (req, res) => {
    const { id } = req.params;
    requests = requests.map(r => r.id === id ? { ...r, ...req.body } : r);
    saveData();
    res.json(requests.find(r => r.id === id));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
