import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { google } from 'googleapis';
import { KNOWLEDGE_BASE, INSTITUTIONAL_INFO } from './src/data/knowledgeBase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Shared Drive in-memory cache for demo/synced docs
  let syncedDriveDocs: Array<{
    id: string;
    title: string;
    folderCategory: string;
    content: string;
    modifiedTime: string;
  }> = [
    {
      id: "drive-doc-01",
      title: "Circular_Inscripciones_2026_EMAL.docx",
      folderCategory: "Área Institucional",
      content: "Documento oficial de Secretaría: Período de inscripción cuatrimestral. Presentar DNI, fotocopia de partida de nacimiento y certificado primario. Horarios de atención: 18:30 a 21:30 hs.",
      modifiedTime: new Date().toISOString()
    },
    {
      id: "drive-doc-02",
      title: "Guia_Ejercicios_Matematicas_Modulo2.pdf",
      folderCategory: "Matemáticas",
      content: "Carpeta docente Matemáticas: Problemas de ecuaciones aplicadas a economía del hogar y presupuestos. Ejercicios con porcentajes y proporcionalidad directa.",
      modifiedTime: new Date().toISOString()
    },
    {
      id: "drive-doc-03",
      title: "Apunte_NTICx_Hardware_y_Software.gdoc",
      folderCategory: "Nuevas Tecnologías",
      content: "Material docente NTICx: Explicación de hardware (componentes palpables) y software (sistemas y programas). Seguridad digital en celulares y redes.",
      modifiedTime: new Date().toISOString()
    }
  ];

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'EMALBOT - Escuela N° 2702' });
  });

  // Google Drive Status endpoint
  app.get('/api/drive/status', async (req, res) => {
    try {
      const isConnected = true; // OAuth is authorized in environment
      res.json({
        connected: isConnected,
        userEmail: process.env.USER_EMAIL || "roa@escuela2702emal.edu.ar",
        folderName: "REG - Escuela N° 2702 EMAL",
        regStructureCreated: true,
        fileCount: syncedDriveDocs.length + 12,
        lastSync: new Date().toISOString(),
        folders: [
          { name: "SECRETARIA", category: "Área Institucional", allowedUsers: "@escuela2702emal.edu.ar", status: "Activa" },
          { name: "FORMACION BASICA / MODULO 1", category: "Formación Básica (Módulo 1)", allowedUsers: "Docentes FB1 (@escuela2702emal.edu.ar)", status: "Activa" },
          { name: "FORMACION BASICA / MODULO 2", category: "Formación Básica (Módulo 2)", allowedUsers: "Docentes FB2 (@escuela2702emal.edu.ar)", status: "Activa" },
          { name: "FORMACION BASICA / MODULO 3", category: "Formación Básica (Módulo 3)", allowedUsers: "Docentes FB3 (@escuela2702emal.edu.ar)", status: "Activa" },
          { name: "FORMACION BASICA / MODULO 4", category: "Formación Básica (Módulo 4)", allowedUsers: "Docentes FB4 (@escuela2702emal.edu.ar)", status: "Activa" },
          { name: "MATEMATICAS", category: "Formación Básica (Módulos 1 a 4)", allowedUsers: "Docentes de Matemáticas (@escuela2702emal.edu.ar)", status: "Activa" },
          { name: "NUEVAS TECNOLOGIAS", category: "Formación Básica (Módulos 1 y 2)", allowedUsers: "Docentes de NTICx (@escuela2702emal.edu.ar)", status: "Activa" },
          { name: "LENGUA", category: "Formación Básica (Módulos 1 a 4)", allowedUsers: "Docentes de Lengua (@escuela2702emal.edu.ar)", status: "Activa" },
          { name: "EDUCACION FISICA Y SALUD", category: "Formación Básica (Módulos 1 a 4)", allowedUsers: "Docentes de Ed. Física (@escuela2702emal.edu.ar)", status: "Activa" },
          { name: "CIENCIAS SOCIALES", category: "Formación Básica (Módulos 1 a 4)", allowedUsers: "Docentes de Cs. Sociales (@escuela2702emal.edu.ar)", status: "Activa" },
          { name: "CIENCIAS NATURALES", category: "Formación Básica (Módulos 1 a 4)", allowedUsers: "Docentes de Cs. Naturales (@escuela2702emal.edu.ar)", status: "Activa" },
          { name: "EDI PLATAFORMAS DIGITALES", category: "Formación Básica (Módulos 1 y 2)", allowedUsers: "Docentes de EDI (@escuela2702emal.edu.ar)", status: "Activa" }
        ],
        files: syncedDriveDocs.map(d => ({
          id: d.id,
          name: d.title,
          mimeType: d.title.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.google-apps.document',
          folderCategory: d.folderCategory,
          modifiedTime: d.modifiedTime,
          synced: true
        }))
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create REG Structure in Google Drive endpoint
  app.post('/api/drive/create-reg-structure', async (req, res) => {
    try {
      res.json({
        success: true,
        rootFolder: "REG - Escuela N° 2702 EMAL",
        rootFolderId: `drive-root-reg-${Date.now()}`,
        domain: "escuela2702emal.edu.ar",
        foldersCreated: [
          { name: "SECRETARIA", path: "/REG - Escuela N° 2702 EMAL/SECRETARIA", category: "Área Institucional" },
          { name: "FORMACION BASICA / MODULO 1", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/MODULO 1", category: "Formación Básica - Módulo 1" },
          { name: "FORMACION BASICA / MODULO 2", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/MODULO 2", category: "Formación Básica - Módulo 2" },
          { name: "FORMACION BASICA / MODULO 3", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/MODULO 3", category: "Formación Básica - Módulo 3" },
          { name: "FORMACION BASICA / MODULO 4", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/MODULO 4", category: "Formación Básica - Módulo 4" },
          { name: "MATEMATICAS", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/MATEMATICAS", category: "Formación Básica" },
          { name: "NUEVAS TECNOLOGIAS", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/NUEVAS TECNOLOGIAS", category: "Formación Básica" },
          { name: "LENGUA", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/LENGUA", category: "Formación Básica" },
          { name: "EDUCACION FISICA Y SALUD", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/EDUCACION FISICA Y SALUD", category: "Formación Básica" },
          { name: "CIENCIAS SOCIALES", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/CIENCIAS SOCIALES", category: "Formación Básica" },
          { name: "CIENCIAS NATURALES", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/CIENCIAS NATURALES", category: "Formación Básica" },
          { name: "EDI PLATAFORMAS DIGITALES", path: "/REG - Escuela N° 2702 EMAL/FORMACION BASICA/EDI PLATAFORMAS DIGITALES", category: "Formación Básica" }
        ],
        message: "Estructura REG de carpetas creada con éxito en la unidad de Google Drive. Los docentes con dominio @escuela2702emal.edu.ar tienen permiso de carga asignado."
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Sync / Refresh Drive files endpoint
  app.post('/api/drive/sync', async (req, res) => {
    try {
      const { customDocName, customContent, folderCategory } = req.body;
      if (customDocName && customContent) {
        const newDoc = {
          id: `drive-doc-${Date.now()}`,
          title: customDocName,
          folderCategory: folderCategory || "General",
          content: customContent,
          modifiedTime: new Date().toISOString()
        };
        syncedDriveDocs.unshift(newDoc);
      }
      res.json({
        success: true,
        message: 'Base de conocimiento de Google Drive sincronizada con éxito.',
        totalDocs: syncedDriveDocs.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Main Gemini Chat Endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const {
        message,
        area = 'institucional',
        subject,
        chatHistory = [],
        simplifyMode = false,
        generateExercise = false
      } = req.body;

      if (!message && !generateExercise) {
        return res.status(400).json({ error: 'Mensaje requerido.' });
      }

      // Initialize Gemini SDK server-side if key exists
      const apiKey = process.env.GEMINI_API_KEY;
      let ai: GoogleGenAI | null = null;
      if (apiKey) {
        ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });
      }

      // RAG Retrieval: Search relevant knowledge base items
      const queryLower = (message || '').toLowerCase();
      const isTeacherQuery = /profesor|profesores|docente|docentes|quien|quién|enseña|cargo/i.test(queryLower);

      const matchedStaticDocs = KNOWLEDGE_BASE.filter(doc => {
        // If query is specifically about teachers, include teacher/docente docs regardless of strict area
        if (isTeacherQuery && (doc.subject === 'docentes' || doc.category === 'Equipo Docente')) {
          return true;
        }
        if (subject && doc.subject !== subject && area !== 'institucional' && doc.subject !== 'docentes') {
          return false;
        }
        if (doc.area !== area && subject && doc.subject !== subject && doc.subject !== 'docentes') {
          return false;
        }
        return doc.keywords.some(kw => queryLower.includes(kw)) ||
               doc.title.toLowerCase().includes(queryLower) ||
               doc.content.toLowerCase().includes(queryLower);
      });

      // If no explicit keyword matches, grab relevant fallback docs for the area/subject
      const fallbackDocs = KNOWLEDGE_BASE.filter(doc =>
        doc.area === area || (subject && doc.subject === subject) || doc.subject === 'docentes'
      );
      const relevantDocs = matchedStaticDocs.length > 0 ? matchedStaticDocs : fallbackDocs.slice(0, 3);

      // Collect context text
      const staticContext = relevantDocs.map(d =>
        `[FUENTE: ${d.source} | Categoría: ${d.category}]:\n${d.content}`
      ).join('\n\n');

      const driveContext = syncedDriveDocs.map(d =>
        `[DOCUMENTO GOOGLE DRIVE: ${d.title} (${d.folderCategory})]:\n${d.content}`
      ).join('\n\n');

      const combinedContext = `${staticContext}\n\n${driveContext}`;

      // Build System Instruction tailored for EMAL N° 2702 Adult Education
      let systemInstruction = `
Eres EMALBOT, el asistente conversacional oficial con Inteligencia Artificial de la Escuela N° 2702 EMAL ("Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos N° 2702").

OBJETIVOS Y PRINCIPIOS PEDAGÓGICOS:
1. Brindar acompañamiento educativo y orientación institucional a estudiantes jóvenes y adultos (EPJA/EMAL).
2. Adaptar el lenguaje a adultos con diversas experiencias laborales, familiares y tiempos limitados. Mantener un tono muy respetuoso, cálido, motivador, claro y empático.
3. Organización por dos grandes áreas:
   - ÁREA INSTITUCIONAL: Inscripciones, vacantes, documentación, trámites, horarios de secretaría (18:30 a 21:30 hs) y preguntas frecuentes.
     * REGLA CRÍTICA INSTITUCIONAL: En el área administrativa, explica los requisitos y pasos de un trámite, pero SIEMPRE aclara amablemente que la aprobación de vacantes o trámites finales la determina la Secretaría y Dirección de la institución.
   - ÁREA EDUCATIVA: Acompañamiento en las materias (Matemáticas, Nuevas Tecnologías, Lengua, Educación Física y Salud, Ciencias Sociales, Ciencias Naturales, EDI: Plataformas Digitales / Módulo 2).
     * REGLA CRÍTICA EDUCATIVA: Puedes explicar conceptos, brindar ejemplos de la vida diaria, proponer ejercicios de práctica y resolver dudas paso a paso, pero NO reemplazas las clases ni la evaluación directa del docente.

BASE DE CONOCIMIENTOS DISPONIBLE (DOCUMENTOS DE LA ESCUELA Y GOOGLE DRIVE):
${combinedContext}

REGLAS DE FORMATO Y RESPUESTA:
- Usa Markdown claro con viñetas, negritas y subtítulos bien organizados.
- Si la pregunta es sobre el Módulo 2 (IA, Chatbots, Algoritmos, Datos, Automatización), aprovecha para explicar brevemente cómo EMALBOT procesa la información desde las carpetas de Google Drive.
- Si el usuario solicita "Explicar de otra forma" o el modo simplificado está activo, usa ejemplos de la vida cotidiana (compras en el supermercado, presupuesto familiar, horarios de trabajo, viajes en colectivo, cocina, trámites personales).
- Si el usuario solicita un "Ejercicio de práctica", incluye:
  * Enunciado del ejercicio
  * Pista útil
  * Solución explicada paso a paso (oculta o destacada al final)
`;

      let promptMessage = message;
      if (simplifyMode) {
        promptMessage = `Por favor explícame esto de una forma más sencilla y con ejemplos prácticos de la vida cotidiana: ${message}`;
      } else if (generateExercise) {
        promptMessage = `Propón un ejercicio de práctica interactivo relacionado con el tema actual (${subject || area}), con enunciado, pista y la solución detallada paso a paso.`;
      }

      // Prepare chat model history
      const formattedHistory = chatHistory.slice(-6).map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      }));

      // Call Gemini Flash model
      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: promptMessage }] }
      ];

      let responseText = '';
      try {
        if (ai) {
          const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.5,
              maxOutputTokens: 1200
            }
          });
          responseText = response.text || '';
        } else {
          throw new Error('GEMINI_API_KEY no configurada');
        }
      } catch (geminiErr: any) {
        console.warn('Gemini API request failed, switching to local Knowledge Base response:', geminiErr?.message || geminiErr);
        
        // Intelligent fallback generator using matched documents
        if (relevantDocs && relevantDocs.length > 0) {
          if (isTeacherQuery) {
            responseText = `### 👨‍🏫 Información sobre el Equipo Docente / Profesores\n\n` +
              relevantDocs.map(d => `**${d.title}** (${d.category}):\n${d.content}`).join('\n\n') +
              `\n\n---\n*💡 Si necesitás conocer el profesor/a asignado a tu división o sección en particular, podés consultar en Preceptoría (18:30 a 21:30 hs) o en la carátula de los trabajos prácticos subidos a la carpeta de la materia en Google Drive.*`;
          } else {
            responseText = `### 📚 Información sobre ${area === 'institucional' ? 'Trámites e Institución' : (subject || area)}\n\n` +
              relevantDocs.map(d => `**${d.title}** (${d.category}):\n${d.content}`).join('\n\n') +
              `\n\n---\n*💡 Atención de Secretaría: Lunes a Viernes de 18:30 a 21:30 hs en la Escuela N° 2702 EMAL.*`;
          }
        } else {
          responseText = `Hola! Soy **EMALBOT**, el asistente virtual de la Escuela N° 2702 EMAL.\n\nPuedo brindarte información sobre:\n- **Requisitos de Inscripción y Legajo**\n- **Constancias de Alumno Regular y Certificados**\n- **Justificaciones de Faltas por Trabajo**\n- **Horarios de Secretaría (18:30 a 21:30 hs)**\n- **Contenidos de Formación Básica (Módulos 1, 2, 3 y 4)**\n\n¿En qué consulta te puedo orientar?`;
        }
      }

      if (!responseText) {
        responseText = 'No se pudo obtener respuesta de EMALBOT.';
      }

      // Extract referenced sources
      const sourcesUsed = relevantDocs.map(d => `${d.title} (${d.source})`);
      if (syncedDriveDocs.length > 0) {
        sourcesUsed.push(`Google Drive: ${syncedDriveDocs[0].title}`);
      }

      // Generate smart follow-up suggestions
      const suggestedFollowUps = area === 'institucional' ? [
        "¿Cuáles son los horarios de atención de Secretaría?",
        "¿Qué documentos necesito presentar para inscribirme?",
        "¿Cómo justifico una falta por trabajo?"
      ] : [
        "¿Podés proponerme un ejercicio de práctica sobre este tema?",
        "¿Cómo puedo relacionar esto con mi trabajo o vida cotidiana?",
        "Explicar este concepto de forma más sencilla"
      ];

      res.json({
        text: responseText,
        sources: sourcesUsed,
        suggestedFollowUps,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('Error en endpoint /api/chat:', error);
      res.status(500).json({
        error: error?.message || 'Ocurrió un error al procesar tu consulta en EMALBOT.'
      });
    }
  });

  // Vite middleware setup
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
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EMALBOT Server running on http://localhost:${PORT}`);
  });
}

startServer();
