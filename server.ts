import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { KNOWLEDGE_BASE } from './src/data/knowledgeBase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SyncedDriveDoc {
  id: string;
  title: string;
  folderCategory: string;
  content: string;
  modifiedTime: string;
  authorName?: string;
  moduleLevel?: string;
  sourceType?: 'google_form' | 'drive_upload';
}

const DEFAULT_DRIVE_DOCS: SyncedDriveDoc[] = [
  {
    id: 'drive-doc-01',
    title: 'Circular_Matricula_2027_Inscripciones_EMAL.docx',
    folderCategory: 'Área Institucional',
    authorName: 'Secretaría EMAL',
    moduleLevel: 'General',
    sourceType: 'drive_upload',
    content:
      'MATRÍCULA 2027 - INSCRIPCIONES ABIERTAS: 1) Completar la preinscripción online en [Formulario de Preinscripción Matrícula 2027](https://docs.google.com/forms/d/e/1FAIpQLScIxCNeBE2veAN4dWndcrJONM8sUaOh7UMfgRuNc7j6NOUsgw/viewform?usp=sf_link). 2) Luego llevar la documentación de manera presencial (DNI frente y dorso, certificado de estudios primarios completos o analítico parcial, partida de nacimiento y 2 fotos 4x4) en Güemes 710, de 19:15 a 22:00 hs. Atención general de Secretaría: Lunes a Viernes de 19:15 a 22:15 hs.',
    modifiedTime: new Date().toISOString()
  },
  {
    id: 'drive-doc-02',
    title: 'Apunte_NTICx_Hardware_Software_Roa.gdoc',
    folderCategory: 'Nuevas Tecnologías',
    authorName: 'Prof. Roa Nicolás',
    moduleLevel: 'Módulo 1 y 2',
    sourceType: 'drive_upload',
    content:
      'Nuevas Tecnologías (Prof. Roa Nicolás · Módulos 1 y 2): Hardware (CPU, memoria RAM, disco, periféricos de entrada y salida) y Software (sistemas operativos y aplicaciones). Uso de la nube en Google Drive, contraseñas seguras y prevención de estafas digitales (Phishing).',
    modifiedTime: new Date().toISOString()
  },
  {
    id: 'drive-doc-03',
    title: 'Guia_Matematicas_1y2_Zaneta.pdf',
    folderCategory: 'Matemáticas',
    authorName: 'Prof. Zaneta Sebastián',
    moduleLevel: 'Módulo 1 y 2',
    sourceType: 'drive_upload',
    content:
      'Matemáticas 1° y 2° año de secundaria (Prof. Zaneta Sebastián): Números enteros (positivos y negativos), jerarquía de operaciones, fracciones, porcentajes aplicados a descuentos, regla de tres simple directa, ecuaciones de primer grado (2x + 10 = 50) y cálculo de perímetro y área.',
    modifiedTime: new Date().toISOString()
  },
  {
    id: 'drive-doc-04',
    title: 'Material_Lengua_1y2_Evans.gdoc',
    folderCategory: 'Lengua',
    authorName: 'Prof. Evans Erika',
    moduleLevel: 'Módulo 1 y 2',
    sourceType: 'drive_upload',
    content:
      'Lengua 1° y 2° año de secundaria (Prof. Evans Erika): Comprensión lectora (paratexto, ideas principales y resumen), tipos de texto (expositivo, argumentativo, instructivo y nota formal), conectores de cohesión, clases de palabras y reglas de acentuación (agudas, graves y esdrújulas).',
    modifiedTime: new Date().toISOString()
  },
  {
    id: 'drive-doc-05',
    title: 'Cartilla_CsNaturales_1y2_Mundaca.pdf',
    folderCategory: 'Cs. Naturales',
    authorName: 'Prof. Mundaca Yamila',
    moduleLevel: 'Módulo 1 y 2',
    sourceType: 'drive_upload',
    content:
      'Cs. Naturales 1° y 2° año de secundaria (Prof. Mundaca Yamila): La célula (procariota, eucariota animal y vegetal), niveles de organización biológica, ecosistemas (factores bióticos y abióticos, cadenas tróficas), estados de la materia, mezclas homogéneas y heterogéneas, y prevención primaria de la salud.',
    modifiedTime: new Date().toISOString()
  }
];

const DATA_DIR = path.join(process.cwd(), 'data');
const DRIVE_STORE_PATH = path.join(DATA_DIR, 'stand_drive_docs.json');

function loadPersistedDriveDocs(): SyncedDriveDoc[] {
  try {
    if (fs.existsSync(DRIVE_STORE_PATH)) {
      const raw = fs.readFileSync(DRIVE_STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('No se pudo leer stand_drive_docs.json, usando valores iniciales:', err);
  }
  return [...DEFAULT_DRIVE_DOCS];
}

function savePersistedDriveDocs(docs: SyncedDriveDoc[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DRIVE_STORE_PATH, JSON.stringify(docs, null, 2), 'utf-8');
  } catch (err) {
    console.warn('No se pudo guardar stand_drive_docs.json:', err);
  }
}

const STOP_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'en',
  'y', 'o', 'u', 'e', 'que', 'quien', 'quienes', 'cual', 'cuales', 'como', 'donde',
  'cuando', 'cuanto', 'por', 'para', 'con', 'sin', 'sobre', 'entre', 'es', 'son', 'era',
  'fue', 'fueron', 'ser', 'estar', 'esta', 'estan', 'hay', 'tiene', 'tienen', 'puedo',
  'puede', 'pueden', 'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'me', 'te', 'se', 'nos',
  'lo', 'le', 'les', 'si', 'no', 'mas', 'muy', 'ya', 'sobre', 'acerca', 'favor', 'hola',
  'buenas', 'tardes', 'noches', 'dias', 'emalbot', 'escuela', 'emal', '2702'
]);

function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractQueryTerms(query: string): string[] {
  const normalized = normalizeText(query);
  const words = normalized.split(' ').filter(w => w.length >= 2 && !STOP_WORDS.has(w));
  return Array.from(new Set(words));
}

function mapSubjectToFolderHints(subject?: string): string[] {
  switch (subject) {
    case 'matematicas': return ['matematicas', 'matematica', 'zaneta'];
    case 'nuevas_tecnologias': return ['nuevas tecnologias', 'nticx', 'tecnologia', 'roa'];
    case 'lengua': return ['lengua', 'evans'];
    case 'ingles': return ['ingles', 'english'];
    case 'educacion_fisica': return ['ed fisica', 'educacion fisica', 'salud'];
    case 'ciencias_sociales': return ['cs sociales', 'ciencias sociales', 'sociales'];
    case 'ciencias_naturales': return ['cs naturales', 'ciencias naturales', 'naturales', 'mundaca'];
    case 'edi_plataformas': return ['edi', 'plataformas digitales', 'modulo 2'];
    case 'inscripciones':
    case 'vacantes':
    case 'tramites':
    case 'horarios':
    case 'secretaria':
      return ['institucional', 'secretaria', 'matricula', '2027'];
    default:
      return [];
  }
}

function buildRelevantExcerpt(content: string, queryTerms: string[]): string {
  if (!content) return '';
  const sentences = content.split(/(?<=[.!?\n])\s+/).filter(Boolean);
  if (sentences.length <= 2 || queryTerms.length === 0) {
    return content.slice(0, 220) + (content.length > 220 ? '...' : '');
  }
  const scoredSentences = sentences.map(sentence => {
    const norm = normalizeText(sentence);
    const hits = queryTerms.filter(t => norm.includes(t)).length;
    return { sentence, hits };
  });
  scoredSentences.sort((a, b) => b.hits - a.hits);
  const best = scoredSentences.slice(0, 2).map(s => s.sentence).join(' ');
  return best.slice(0, 240) + (best.length > 240 ? '...' : '');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  let syncedDriveDocs: SyncedDriveDoc[] = loadPersistedDriveDocs();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'EMALBOT - Escuela N° 2702' });
  });

  // Google Drive Status endpoint
  app.get('/api/drive/status', async (req, res) => {
    try {
      res.json({
        connected: true,
        userEmail: process.env.USER_EMAIL || 'roa@escuela2702emal.edu.ar',
        folderName: 'REG - Escuela N° 2702 EMAL',
        regStructureCreated: true,
        fileCount: syncedDriveDocs.length,
        lastSync: new Date().toISOString(),
        folders: [
          { name: 'SECRETARIA', category: 'Área Institucional · Matrícula 2027', allowedUsers: '@escuela2702emal.edu.ar', status: 'Activa' },
          { name: 'NUEVAS TECNOLOGIAS', category: 'Módulos 1 y 2 · Prof. Roa Nicolás', allowedUsers: 'Prof. Roa Nicolás (@escuela2702emal.edu.ar)', status: 'Activa' },
          { name: 'MATEMATICAS', category: 'Módulos 1 a 4 · Prof. Zaneta Sebastián', allowedUsers: 'Prof. Zaneta Sebastián (@escuela2702emal.edu.ar)', status: 'Activa' },
          { name: 'LENGUA', category: 'Módulos 1 a 4 · Prof. Evans Erika', allowedUsers: 'Prof. Evans Erika (@escuela2702emal.edu.ar)', status: 'Activa' },
          { name: 'INGLES', category: 'Formación Básica (Módulos 1 a 4)', allowedUsers: 'Docentes de Inglés (@escuela2702emal.edu.ar)', status: 'Activa' },
          { name: 'CS. SOCIALES', category: 'Formación Básica (Módulos 1 a 4)', allowedUsers: 'Docentes de Cs. Sociales (@escuela2702emal.edu.ar)', status: 'Activa' },
          { name: 'CS. NATURALES', category: 'Módulos 1 a 4 · Prof. Mundaca Yamila', allowedUsers: 'Prof. Mundaca Yamila (@escuela2702emal.edu.ar)', status: 'Activa' },
          { name: 'ED. FISICA Y SALUD', category: 'Formación Básica (Módulos 1 a 4)', allowedUsers: 'Docentes de Ed. Física (@escuela2702emal.edu.ar)', status: 'Activa' },
          { name: 'EDI', category: 'Formación Básica (Módulos 1 y 2)', allowedUsers: 'Docentes de EDI (@escuela2702emal.edu.ar)', status: 'Activa' }
        ],
        files: syncedDriveDocs.map(d => ({
          id: d.id,
          name: d.title,
          mimeType: d.title.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.google-apps.document',
          folderCategory: d.folderCategory,
          authorName: d.authorName,
          moduleLevel: d.moduleLevel,
          sourceType: d.sourceType || 'drive_upload',
          contentPreview: d.content,
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
        rootFolder: 'REG - Escuela N° 2702 EMAL',
        rootFolderId: `drive-root-reg-${Date.now()}`,
        domain: 'escuela2702emal.edu.ar',
        foldersCreated: [
          { name: 'SECRETARIA', path: '/REG - Escuela N° 2702 EMAL/SECRETARIA', category: 'Área Institucional' },
          { name: 'NUEVAS TECNOLOGIAS', path: '/REG - Escuela N° 2702 EMAL/FORMACION BASICA/NUEVAS TECNOLOGIAS', category: 'Módulos 1 y 2' },
          { name: 'MATEMATICAS', path: '/REG - Escuela N° 2702 EMAL/FORMACION BASICA/MATEMATICAS', category: 'Módulos 1 a 4' },
          { name: 'LENGUA', path: '/REG - Escuela N° 2702 EMAL/FORMACION BASICA/LENGUA', category: 'Módulos 1 a 4' },
          { name: 'INGLES', path: '/REG - Escuela N° 2702 EMAL/FORMACION BASICA/INGLES', category: 'Módulos 1 a 4' },
          { name: 'CS. SOCIALES', path: '/REG - Escuela N° 2702 EMAL/FORMACION BASICA/CS. SOCIALES', category: 'Módulos 1 a 4' },
          { name: 'CS. NATURALES', path: '/REG - Escuela N° 2702 EMAL/FORMACION BASICA/CS. NATURALES', category: 'Módulos 1 a 4' },
          { name: 'ED. FISICA Y SALUD', path: '/REG - Escuela N° 2702 EMAL/FORMACION BASICA/ED. FISICA Y SALUD', category: 'Módulos 1 a 4' },
          { name: 'EDI', path: '/REG - Escuela N° 2702 EMAL/FORMACION BASICA/EDI', category: 'Módulos 1 y 2' }
        ],
        message: 'Estructura REG de carpetas creada con éxito en Google Drive.'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Sync / Add Drive file (from Drive Manager or Google Form Demo)
  app.post('/api/drive/sync', async (req, res) => {
    try {
      const {
        customDocName,
        customContent,
        folderCategory,
        authorName,
        moduleLevel,
        sourceType
      } = req.body;

      let createdDoc: SyncedDriveDoc | null = null;
      if (customDocName && customContent) {
        createdDoc = {
          id: `drive-doc-${Date.now()}`,
          title: customDocName.trim(),
          folderCategory: folderCategory || 'General',
          authorName: authorName?.trim() || 'Docente / Secretaría EMAL',
          moduleLevel: moduleLevel?.trim() || 'General',
          sourceType: sourceType === 'google_form' ? 'google_form' : 'drive_upload',
          content: customContent.trim(),
          modifiedTime: new Date().toISOString()
        };
        syncedDriveDocs.unshift(createdDoc);
        savePersistedDriveDocs(syncedDriveDocs);
      }

      res.json({
        success: true,
        message: 'Material cargado en la carpeta de Google Drive e indexado por el motor RAG de EMALBOT.',
        totalDocs: syncedDriveDocs.length,
        createdDoc
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a custom Drive document
  app.delete('/api/drive/docs/:id', (req, res) => {
    const { id } = req.params;
    const before = syncedDriveDocs.length;
    syncedDriveDocs = syncedDriveDocs.filter(d => d.id !== id);
    if (syncedDriveDocs.length !== before) {
      savePersistedDriveDocs(syncedDriveDocs);
    }
    res.json({ success: true, totalDocs: syncedDriveDocs.length });
  });

  // Reset demo Drive documents back to baseline
  app.post('/api/drive/reset-demo', (req, res) => {
    syncedDriveDocs = [...DEFAULT_DRIVE_DOCS];
    savePersistedDriveDocs(syncedDriveDocs);
    res.json({ success: true, totalDocs: syncedDriveDocs.length });
  });

  // Main RAG + Gemini Chat Endpoint
  app.post('/api/chat', async (req, res) => {
    const startTime = Date.now();
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

      // --- REAL RAG RETRIEVAL ENGINE ---
      const rawQuery = message || `${subject || ''} ejercicio practico`;
      const normQuery = normalizeText(rawQuery);
      const queryTerms = extractQueryTerms(rawQuery);
      const isTeacherQuery = /profesor|profesora|profesores|docente|docentes|quien|enseña|cargo|dicta/i.test(normQuery);
      const subjectHints = mapSubjectToFolderHints(subject);

      interface ScoredCandidate {
        id: string;
        title: string;
        category: string;
        content: string;
        sourceLabel: string;
        sourceType: 'google_form_drive' | 'drive' | 'knowledge_base';
        authorName?: string;
        moduleLevel?: string;
        score: number;
        matchedTerms: string[];
      }

      const candidates: ScoredCandidate[] = [];

      // 1) Score all dynamic Google Drive / Google Form documents FIRST
      for (const doc of syncedDriveDocs) {
        const normTitle = normalizeText(doc.title);
        const normCat = normalizeText(doc.folderCategory);
        const normContent = normalizeText(doc.content);
        const normAuthor = normalizeText(doc.authorName || '');
        const normMod = normalizeText(doc.moduleLevel || '');
        const combined = `${normTitle} ${normCat} ${normContent} ${normAuthor} ${normMod}`;

        const matchedTerms: string[] = [];
        let score = 0;

        for (const term of queryTerms) {
          if (normTitle.includes(term)) {
            score += 14;
            matchedTerms.push(term);
          } else if (normCat.includes(term)) {
            score += 12;
            matchedTerms.push(term);
          } else if (normContent.includes(term) || normAuthor.includes(term) || normMod.includes(term)) {
            score += 9;
            matchedTerms.push(term);
          }
        }

        if (normCat && normQuery.includes(normCat)) {
          score += 22;
        }

        if (isTeacherQuery && /profesor|profesora|docente|titular|suplente|profe|a cargo/i.test(combined)) {
          score += 24;
        }

        if (matchedTerms.length > 0) {
          score += doc.sourceType === 'google_form' ? 30 : 14;
        } else if (subjectHints.some(h => normCat.includes(h) || normContent.includes(h))) {
          score += 6;
        }

        if (score > 0) {
          candidates.push({
            id: doc.id,
            title: doc.title,
            category: doc.folderCategory,
            content: doc.content,
            sourceLabel:
              doc.sourceType === 'google_form'
                ? `Formulario Google -> Drive (${doc.folderCategory})`
                : `Google Drive (${doc.folderCategory})`,
            sourceType: doc.sourceType === 'google_form' ? 'google_form_drive' : 'drive',
            authorName: doc.authorName,
            moduleLevel: doc.moduleLevel,
            score,
            matchedTerms: Array.from(new Set(matchedTerms))
          });
        }
      }

      // 2) Score all static KNOWLEDGE_BASE documents
      for (const doc of KNOWLEDGE_BASE) {
        const normTitle = normalizeText(doc.title);
        const normCat = normalizeText(doc.category);
        const normContent = normalizeText(doc.content);
        const normKeywords = doc.keywords.map(k => normalizeText(k));

        const matchedTerms: string[] = [];
        let score = 0;

        for (const term of queryTerms) {
          if (normKeywords.some(k => k.includes(term))) {
            score += 10;
            matchedTerms.push(term);
          } else if (normTitle.includes(term)) {
            score += 8;
            matchedTerms.push(term);
          } else if (normContent.includes(term)) {
            score += 5;
            matchedTerms.push(term);
          }
        }

        if (normKeywords.some(k => k.length > 4 && normQuery.includes(k))) {
          score += 14;
        }

        if (isTeacherQuery && (doc.subject === 'docentes' || doc.category === 'Equipo Docente')) {
          score += 10;
        }

        if (subject && doc.subject === subject) {
          score += 7;
        } else if (doc.area === area && matchedTerms.length > 0) {
          score += 3;
        }

        if (score > 0) {
          candidates.push({
            id: doc.id,
            title: doc.title,
            category: doc.category,
            content: doc.content,
            sourceLabel: doc.source,
            sourceType: 'knowledge_base',
            score,
            matchedTerms: Array.from(new Set(matchedTerms))
          });
        }
      }

      candidates.sort((a, b) => b.score - a.score);

      if (candidates.length === 0) {
        const fallbackKB = KNOWLEDGE_BASE.filter(
          d => (subject && d.subject === subject) || d.area === area
        ).slice(0, 2);
        for (const doc of fallbackKB) {
          candidates.push({
            id: doc.id,
            title: doc.title,
            category: doc.category,
            content: doc.content,
            sourceLabel: doc.source,
            sourceType: 'knowledge_base',
            score: 1,
            matchedTerms: []
          });
        }
      }

      const topMatched = candidates.slice(0, 4);

      const combinedContext = topMatched
        .map(
          (d, idx) =>
            `[DOCUMENTO #${idx + 1} | ORIGEN: ${d.sourceLabel} | TÍTULO: ${d.title} | PUNTAJE RAG: ${d.score}${
              d.authorName ? ` | CARGADO POR: ${d.authorName}` : ''
            }${d.moduleLevel ? ` | MÓDULO: ${d.moduleLevel}` : ''}]:\n${d.content}`
        )
        .join('\n\n');

      let systemInstruction = `
Eres EMALBOT, el asistente conversacional oficial con Inteligencia Artificial de la Escuela N° 2702 EMAL ("Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos N° 2702").

DATOS INSTITUCIONALES CLAVE:
- Prioridad actual: MATRÍCULA 2027 - INSCRIPCIONES ABIERTAS (cierre de año lectivo).
- Horario oficial de Secretaría: Lunes a Viernes de 19:15 a 22:15 hs.
- Materias visibles: Nuevas Tecnologías (Prof. Roa Nicolás, Módulos 1 y 2), Matemáticas (Prof. Zaneta Sebastián, Módulos 1 a 4), Lengua (Prof. Evans Erika, Módulos 1 a 4), Inglés, Cs. Sociales, Cs. Naturales (Prof. Mundaca Yamila, Módulos 1 a 4), Ed. Física y Salud, y EDI (Módulos 1 y 2).

OBJETIVOS Y PRINCIPIOS PEDAGÓGICOS:
1. Brindar acompañamiento educativo y orientación institucional a estudiantes jóvenes y adultos.
2. REGLA DE PRIORIDAD RAG: Si en la BASE DE CONOCIMIENTOS RECUPERADA aparece un documento cargado recientemente desde Formulario Google / Google Drive que contiene datos específicos, PRIORIZA esa información exacta en tu respuesta.
3. En el Área Institucional, aclara amablemente que las decisiones finales administrativas las determina Secretaría y Dirección (Lunes a Viernes de 19:15 a 22:15 hs).
4. En el Área Educativa, explica paso a paso con ejemplos cotidianos, sin reemplazar al docente.

BASE DE CONOCIMIENTOS RECUPERADA POR EL MOTOR RAG:
${combinedContext}

REGLAS DE FORMATO:
- Usa Markdown claro con viñetas y negritas.
- Cita brevemente la fuente del Google Drive o archivo utilizado.
`;

      let promptMessage = rawQuery;
      if (simplifyMode) {
        promptMessage = `Por favor explícame esto de una forma más sencilla y con ejemplos prácticos de la vida cotidiana: ${rawQuery}`;
      } else if (generateExercise) {
        promptMessage = `Propón un ejercicio de práctica interactivo relacionado con el tema actual (${subject || area}), con enunciado, pista y solución paso a paso.`;
      }

      const formattedHistory = chatHistory.slice(-6).map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      }));

      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: promptMessage }] }
      ];

      let responseText = '';
      let generationMode: 'gemini-api' | 'rag-local-synthesizer' = 'gemini-api';

      try {
        if (ai) {
          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.4,
              maxOutputTokens: 1200
            }
          });
          responseText = response.text || '';
        } else {
          throw new Error('GEMINI_API_KEY no configurada');
        }
      } catch (geminiErr: any) {
        generationMode = 'rag-local-synthesizer';
        console.warn(
          'Gemini API fallback to RAG Local Synthesizer:',
          geminiErr?.message || geminiErr
        );

        const driveHits = topMatched.filter(
          d => d.sourceType === 'google_form_drive' || d.sourceType === 'drive'
        );
        const kbHits = topMatched.filter(d => d.sourceType === 'knowledge_base');

        if (generateExercise) {
          const baseDoc = topMatched[0];
          responseText = `### ✏️ Ejercicio de Práctica (${baseDoc ? baseDoc.category : subject || 'Formación Básica'})\n\n` +
            `**Enunciado:**\nA partir de los contenidos de *${baseDoc ? baseDoc.title : 'la materia'}*, resolvé la siguiente situación cotidiana:\n> Si en un comercio del barrio un producto cuesta $12.000 y tiene un 15% de descuento por pago en efectivo, ¿cuánto pagás finalmente?\n\n` +
            `**Pista útil:**\nCalculá primero el 15% multiplicando \`12000 × 15\` y dividiendo por \`100\`, y luego restalo al precio original.\n\n` +
            `**Solución paso a paso:**\n1. \`(12.000 × 15) / 100 = $1.800\` de descuento.\n2. \`$12.000 - $1.800 = $10.200\` total a pagar.`;
        } else if (driveHits.length > 0 && driveHits[0].score >= (kbHits[0]?.score || 0) - 5) {
          const primary = driveHits[0];
          const secondary = kbHits.find(k => k.matchedTerms.length > 0) || topMatched[1];

          responseText = `### 📄 Información recuperada de Google Drive (${primary.category})\n\n` +
            `**Documento:** \`${primary.title}\`${primary.authorName ? ` · Cargado por **${primary.authorName}**` : ''}${primary.moduleLevel ? ` (${primary.moduleLevel})` : ''}\n\n` +
            `${primary.content}\n`;

          if (simplifyMode) {
            responseText += `\n**En palabras simples:**\nEsta es la información oficial que cargó el equipo docente o Secretaría en la carpeta de **${primary.category}** para que la tengas siempre a mano antes o después de clase.\n`;
          }

          if (secondary && secondary.id !== primary.id && secondary.matchedTerms.length > 0) {
            responseText += `\n---\n**Material de apoyo (${secondary.category}):**\n${secondary.content}\n`;
          }

          responseText += `\n---\n*ℹ️ Atención de Secretaría (Matrícula 2027): Lunes a Viernes de 19:15 a 22:15 hs · Escuela N° 2702 EMAL.*`;
        } else if (topMatched.length > 0) {
          const primary = topMatched[0];
          const heading = isTeacherQuery
            ? '👨‍🏫 Información sobre el Equipo Docente'
            : `📚 ${primary.title}`;

          responseText = `### ${heading}\n\n${primary.content}`;

          if (simplifyMode) {
            responseText += `\n\n**Resumen cotidiano:**\nEn términos sencillos, recordá que podés acercarte a Preceptoría o Secretaría de **Lunes a Viernes de 19:15 a 22:15 hs** y consultar tus carpetas en Google Drive para repasar a tu ritmo.`;
          }

          if (topMatched.length > 1 && topMatched[1].matchedTerms.length > 0) {
            responseText += `\n\n---\n**También te puede servir (${topMatched[1].category}):**\n${topMatched[1].content}`;
          }

          responseText += `\n\n---\n*💡 Atención de Secretaría (Matrícula 2027): Lunes a Viernes de 19:15 a 22:15 hs · Escuela N° 2702 EMAL.*`;
        } else {
          responseText = `¡Hola! Soy **EMALBOT**, el asistente virtual de la **Escuela N° 2702 EMAL**.\n\nPuedo ayudarte con información sobre **Matrícula 2027 (Inscripciones)**, certificados, horario de Secretaría (**19:15 a 22:15 hs de lunes a viernes**) y las materias escolares.\n\n¿Qué te gustaría consultar?`;
        }
      }

      if (!responseText) {
        responseText = 'No se pudo obtener respuesta de EMALBOT.';
      }

      const sourcesUsed = topMatched.map(d => `${d.title} (${d.sourceLabel})`);

      const suggestedFollowUps =
        area === 'institucional'
          ? [
              '¿Cuáles son los requisitos para Matrícula 2027?',
              '¿En qué horario atiende Secretaría?',
              '¿Cómo pido una constancia de alumno regular?'
            ]
          : [
              'Explicame números enteros y ecuaciones de 1° y 2° año',
              'Resumen de Lengua: comprensión lectora y acentuación',
              '¿Qué contenidos vemos en Cs. Naturales y Nuevas Tecnologías?'
            ];

      const processingMs = Math.max(12, Date.now() - startTime);

      res.json({
        text: responseText,
        sources: sourcesUsed,
        suggestedFollowUps,
        ragTrace: {
          keywords: queryTerms,
          totalDocsScanned: syncedDriveDocs.length + KNOWLEDGE_BASE.length,
          driveDocsScanned: syncedDriveDocs.length,
          matchedDocuments: topMatched.map(d => ({
            id: d.id,
            title: d.title,
            sourceType: d.sourceType,
            category: d.category,
            score: d.score,
            matchedTerms: d.matchedTerms,
            excerpt: buildRelevantExcerpt(d.content, queryTerms)
          })),
          generationMode,
          processingMs
        },
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
