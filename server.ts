import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Base de datos en memoria para documentos sincronizados de Drive (se inicia vacía)
let syncedDriveDocs: Array<{
  id: string;
  title: string;
  folderCategory: string;
  content: string;
  modifiedTime: string;
}> = [];

// Rutas de API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', school: 'Escuela N° 2702 EMAL' });
});

app.get('/api/drive/status', (req, res) => {
  res.json({
    connected: !!process.env.GEMINI_API_KEY,
    userEmail: process.env.USER_EMAIL || "usuario@escuela2702emal.edu.ar",
    folderName: "REG - Escuela N° 2702 EMAL",
    fileCount: syncedDriveDocs.length,
    folders: [
      { name: "SECRETARIA", category: "Área Institucional" },
      { name: "MATEMATICAS", category: "Formación Básica" },
      { name: "NUEVAS TECNOLOGIAS", category: "Formación Básica" },
      { name: "LENGUA", category: "Formación Básica" },
      { name: "CIENCIAS SOCIALES", category: "Formación Básica" },
      { name: "CIENCIAS NATURALES", category: "Formación Básica" }
    ],
    files: syncedDriveDocs.map(d => ({
      id: d.id,
      name: d.title,
      folderCategory: d.folderCategory,
      synced: true
    }))
  });
});

app.post('/api/drive/sync', (req, res) => {
  const { customDocName, customContent, folderCategory } = req.body;
  if (customDocName && customContent) {
    syncedDriveDocs.unshift({
      id: `drive-${Date.now()}`,
      title: customDocName,
      folderCategory: folderCategory || "General",
      content: customContent,
      modifiedTime: new Date().toISOString()
    });
  }
  res.json({ success: true, total: syncedDriveDocs.length });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, area, subject, chatHistory = [] } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'Falta GEMINI_API_KEY' });

    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // RAG: Filtro de documentos de Drive
    const context = syncedDriveDocs
      .filter(d => !subject || d.folderCategory.toLowerCase().includes(subject.toLowerCase()))
      .map(d => `[DOCUMENTO: ${d.title}]\n${d.content}`)
      .join('\n\n');

    const systemInstruction = `
Eres EMALBOT, asistente de la Escuela N° 2702 EMAL.
REGLA DE ORO: Responde ÚNICAMENTE usando el contexto de Google Drive proporcionado abajo.
Si el contexto está vacío o no contiene la respuesta, di: "Lo siento, no tengo esa información en mis archivos actuales de la escuela. Por favor, consulta en Secretaría (18:30 a 21:30 hs)."

CONTEXTO DE DRIVE:
${context || 'NO HAY DOCUMENTOS CARGADOS.'}
`;

    const chat = model.startChat({
      history: chatHistory.slice(-4).map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      systemInstruction
    });

    const result = await chat.sendMessage(message);
    res.json({
      text: result.response.text(),
      sources: syncedDriveDocs.map(d => d.title).slice(0, 2),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en la consulta' });
  }
});

// Configuración para Desarrollo y Producción
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }
}

setupServer();

export default app;

if (process.env.NODE_ENV !== 'production' && fileURLToPath(import.meta.url) === process.argv[1]) {
  app.listen(3000, () => console.log('EMALBOT: http://localhost:3000'));
}
