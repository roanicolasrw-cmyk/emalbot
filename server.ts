import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Base de datos en memoria para documentos sincronizados de Drive
let syncedDriveDocs: Array<{
  id: string;
  title: string;
  folderCategory: string;
  content: string;
  modifiedTime: string;
}> = [
  {
    id: "drive-demo-1",
    title: "Guía Docente: Trabajo Práctico N° 1 - Matemáticas",
    folderCategory: "Matemáticas",
    content: "Material subido por el Prof. Martínez para Módulo 2. Consigna: Resolver la ecuación 2x + 10 = 50 y calcular el 15% de descuento sobre $12.000. Fecha límite de entrega: 25 de Mayo.",
    modifiedTime: new Date().toISOString()
  },
  {
    id: "drive-demo-2",
    title: "Circular de Secretaría: Exámenes y Fechas de Mesas",
    folderCategory: "Área Institucional",
    content: "Comunicado Oficial: Las inscripciones para exámenes libres y equivalencias se realizarán del 1 al 10 del próximo mes en Secretaría (18:30 a 21:30 hs). Requisito: Presentar DNI y Ficha escolar.",
    modifiedTime: new Date().toISOString()
  }
];

// Rutas de API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', school: 'Escuela N° 2702 EMAL' });
});

app.get('/api/drive/status', (req, res) => {
  res.json({
    connected: true,
    userEmail: process.env.USER_EMAIL || "docentes@escuela2702emal.edu.ar",
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

    // Incluimos la totalidad de los documentos subidos a Drive para RAG
    const context = syncedDriveDocs
      .map(d => `[DOCUMENTO EN GOOGLE DRIVE: ${d.title} | CATEGORÍA: ${d.folderCategory}]\n${d.content}`)
      .join('\n\n------------------------\n\n');

    const systemInstruction = `
Eres EMALBOT, el asistente virtual oficial de la Escuela N° 2702 EMAL (Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos).
REGLA DE ORO DE RAG: Responde priorizando la información cargada en el Google Drive de la escuela que se proporciona abajo.
Si hay información relevante en los documentos de Drive sobre la consulta del alumno, responde con esa información exacta citando el documento o materia.
Si no encuentras información exacta en los documentos, brinda una orientación amable como asistente institucional y recuerda consultar en Secretaría (18:30 a 21:30 hs).

DOCUMENTOS INDEXADOS DE GOOGLE DRIVE:
${context || 'NO HAY DOCUMENTOS CARGADOS.'}
`;

    if (apiKey) {
      try {
        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const chat = model.startChat({
          history: chatHistory.slice(-4).map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
          })),
          systemInstruction
        });

        const result = await chat.sendMessage(message);
        return res.json({
          text: result.response.text(),
          sources: syncedDriveDocs.map(d => d.title).slice(0, 3),
          timestamp: new Date().toISOString()
        });
      } catch (geminiError) {
        console.warn('Fallback RAG local debido a error en Gemini API:', geminiError);
      }
    }

    // Fallback RAG Local para demostraciones o entornos sin API Key
    const messageLower = message.toLowerCase();
    const matchedDoc = syncedDriveDocs.find(d =>
      messageLower.split(/\s+/).some(term => term.length > 3 && (d.content.toLowerCase().includes(term) || d.title.toLowerCase().includes(term)))
    ) || syncedDriveDocs[0];

    let replyText = "";
    if (matchedDoc) {
      replyText = `*(Respuesta EMALBOT via RAG - Base de Google Drive)*\n\nSegún lo cargado en el documento **"${matchedDoc.title}"** (${matchedDoc.folderCategory}):\n\n${matchedDoc.content}\n\n*Recuerda que para trámites administrativos o dudas específicas, la Secretaría atiende de Lunes a Viernes de 18:30 a 21:30 hs.*`;
    } else {
      replyText = `Lo siento, no encuentro esa información exacta en los documentos de Google Drive indexados. Por favor, consulta en Secretaría (18:30 a 21:30 hs).`;
    }

    return res.json({
      text: replyText,
      sources: syncedDriveDocs.map(d => d.title).slice(0, 3),
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Error en /api/chat:', err);
    res.status(500).json({ error: 'Error procesando la consulta' });
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
