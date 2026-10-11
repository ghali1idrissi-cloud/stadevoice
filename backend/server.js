require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
}

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Santé du serveur
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Points d'Intérêt
app.get('/api/pois', async (req, res) => {
  try {
    const pois = await prisma.pointOfInterest.findMany({ orderBy: { category: 'asc' } });
    res.json(pois);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// Objets Perdus / Trouvés (Lecture)
app.get('/api/items', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status: status.toUpperCase() } : {};
    const items = await prisma.lostItem.findMany({ where: filter, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// Objets Perdus / Trouvés (Création)
app.post('/api/items', async (req, res) => {
  try {
    const { title, description, status, location, contactInfo } = req.body;
    const newItem = await prisma.lostItem.create({
      data: { title, description, status, location, contactInfo },
    });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// ROUTE DU CHATBOT (GEMINI 3.8 FLASH)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'FR' } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message requis' });
    }

    if (genAI) {
      const modelNames = ['gemini-3.8-flash', 'gemini-3-flash', 'gemini-2.5-flash'];
      const systemPrompt = `Tu es l'assistant vocal officiel "StadeVoice" pour la Coupe du Monde 2030 au Grand Stade de Casablanca. Réponds impérativement en langue: ${language}. Sois concis, chaleureux et direct (1 à 2 phrases max car l'utilisateur est sur smartphone).`;

      for (const mName of modelNames) {
        try {
          console.log(`📡 Tentative avec [${mName}]...`);
          const model = genAI.getGenerativeModel({ model: mName });
          const result = await model.generateContent(`${systemPrompt}\n\nSupporter: ${message}`);
          const response = await result.response;
          const answer = response.text();

          console.log(`✅ Réponse réussie avec [${mName}] !`);
          return res.json({ answer, response: answer });
        } catch (err) {
          console.log(`⚠️ Échec [${mName}] : ${err.message || err}`);
        }
      }
    }

    // Réponse de secours
    return res.json({ 
      answer: "Je suis l'assistant officiel de StadeVoice. Posez-moi vos questions sur le stade, les boissons, les toilettes ou les sorties !" 
    });

  } catch (error) {
    console.error("Erreur serveur chat:", error);
    res.status(500).json({ error: "Erreur interne" });
  }
});

// Match
app.get('/api/match', (req, res) => {
  res.json({
    homeTeam: { name: "Maroc", flag: "🇲🇦", score: 2 },
    awayTeam: { name: "Espagne", flag: "🇪🇸", score: 1 },
    minute: 67,
    stage: "Groupe A",
    events: [
      { minute: 12, type: 'GOAL', team: 'MAR', player: 'A. Hakimi' },
      { minute: 34, type: 'GOAL', team: 'ESP', player: 'L. Yamal' },
      { minute: 61, type: 'GOAL', team: 'MAR', player: 'Y. En-Nesyri' }
    ]
  });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  res.json([
    { id: 1, type: 'GOAL', message: "But ! Maroc 2 - Espagne 1 (61')", priority: 'high' },
    { id: 2, type: 'INFO', message: "La mi-temps approche. Les buvettes sont ouvertes.", priority: 'medium' },
    { id: 3, type: 'WEATHER', message: "Pensez à boire de l'eau. Points d'eau gratuits disponibles.", priority: 'low' }
  ]);
});

// Météo
app.get('/api/weather', (req, res) => {
  res.json({ temperature: 28, condition: 'sunny', humidity: 45, wind: 12 });
});

// Statistiques
app.get('/api/stats', async (req, res) => {
  try {
    const [lost, found, pois] = await Promise.all([
      prisma.lostItem.count({ where: { status: 'LOST' } }),
      prisma.lostItem.count({ where: { status: 'FOUND' } }),
      prisma.pointOfInterest.count()
    ]);
    res.json({ totalLostItems: lost, totalFoundItems: found, totalPois: pois });
  } catch (err) {
    res.json({ totalLostItems: 4, totalFoundItems: 2, totalPois: 8 });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur StadeVoice opérationnel sur le port ${PORT}`);
  console.log(`🔑 Clé Gemini configurée : ${genAI ? 'OUI ✅' : 'NON ❌'}`);
});