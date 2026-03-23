import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cookieParser from "cookie-parser";
import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config manually to avoid ESM issues
const configPath = path.join(__dirname, "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Initialize Firebase Admin
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
    console.log("Firebase Admin initialized successfully");
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

const db = admin.firestore();
if (firebaseConfig.firestoreDatabaseId) {
  db.settings({ databaseId: firebaseConfig.firestoreDatabaseId });
}

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
    subtitle: "Selecione uma ou mais campanhas para receber um orçamento personalizado.",
    buttonText: "Selecionar",
    buttonSelectedText: "Selecionado"
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authMiddleware = (req: any, res: any, next: any) => {
    const session = req.cookies.reque_session;
    if (session === "authorized") {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  // API Routes
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const emailLower = email?.toLowerCase();
    
    if (emailLower === "gabriela@reque.com.br" && password === "RequeMKT") {
      // Ensure user exists in Firestore for other parts of the app
      try {
        await db.collection("users").doc(emailLower).set({
          email: emailLower,
          role: "admin",
          isSuperAdmin: true,
          displayName: "Gabriela Reque",
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.error("Error syncing super admin to firestore:", e);
      }

      res.cookie("reque_session", "authorized", { 
        httpOnly: true, 
        secure: true, 
        sameSite: "none", // Required for AI Studio Iframe
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      res.json({ success: true, user: { email: emailLower, role: "admin", isSuperAdmin: true } });
    } else {
      // Check other users
      try {
        const userDoc = await db.collection("users").doc(emailLower || "none").get();
        const userData = userDoc.data();
        if (userDoc.exists && userData?.password === password && userData?.role === "admin") {
          res.cookie("reque_session", "authorized", { 
            httpOnly: true, 
            secure: true, 
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000
          });
          res.json({ success: true, user: userData });
        } else {
          res.status(401).json({ error: "Credenciais inválidas" });
        }
      } catch (e) {
        res.status(401).json({ error: "Erro na autenticação" });
      }
    }
  });

  app.get("/api/auth/check", (req, res) => {
    const session = req.cookies.reque_session;
    if (session === "authorized") {
      res.json({ authenticated: true, user: { email: "gabriela@reque.com.br", role: "admin", isSuperAdmin: true } });
    } else {
      res.json({ authenticated: false });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("reque_session");
    res.json({ success: true });
  });

  app.get("/api/campaigns", async (req, res) => {
    try {
      const snapshot = await db.collection("campaigns").get();
      const campaigns = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/layout", async (req, res) => {
    try {
      const doc = await db.collection("layout").doc("settings").get();
      if (doc.exists) {
        res.json(doc.data());
      } else {
        res.json(DEFAULT_LAYOUT);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch layout" });
    }
  });

  app.put("/api/layout", authMiddleware, async (req, res) => {
    try {
      await db.collection("layout").doc("settings").set(req.body, { merge: true });
      res.json(req.body);
    } catch (error) {
      res.status(500).json({ error: "Failed to update layout" });
    }
  });

  app.post("/api/campaigns", authMiddleware, async (req, res) => {
    try {
      const docRef = await db.collection("campaigns").add(req.body);
      res.json({ ...req.body, id: docRef.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  app.put("/api/campaigns/:id", authMiddleware, async (req, res) => {
    try {
      await db.collection("campaigns").doc(req.params.id).set(req.body, { merge: true });
      res.json({ ...req.body, id: req.params.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", authMiddleware, async (req, res) => {
    try {
      await db.collection("campaigns").doc(req.params.id).delete();
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  });

  app.get("/api/requests", authMiddleware, async (req, res) => {
    try {
      const snapshot = await db.collection("requests").orderBy("createdAt", "desc").get();
      const requests = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const newRequest = { 
        ...req.body, 
        createdAt: new Date().toISOString(),
        status: 'Novo'
      };
      const docRef = await db.collection("requests").add(newRequest);
      res.json({ ...newRequest, id: docRef.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to create request" });
    }
  });

  app.put("/api/requests/:id", authMiddleware, async (req, res) => {
    try {
      await db.collection("requests").doc(req.params.id).set(req.body, { merge: true });
      res.json({ ...req.body, id: req.params.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  app.get("/api/users", authMiddleware, async (req: any, res: any) => {
    try {
      const snapshot = await db.collection("users").orderBy("email").get();
      const users = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", authMiddleware, async (req: any, res: any) => {
    try {
      const { email, password, role } = req.body;
      const emailLower = email.toLowerCase();
      const userData = {
        email: emailLower,
        password,
        role: role || 'admin',
        createdAt: new Date().toISOString()
      };
      await db.collection("users").doc(emailLower).set(userData);
      res.json(userData);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.delete("/api/users/:id", authMiddleware, async (req: any, res: any) => {
    try {
      await db.collection("users").doc(req.params.id).delete();
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
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
