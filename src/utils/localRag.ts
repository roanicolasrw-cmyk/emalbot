import { KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { AreaType, SubjectType, DriveFileItem, RagTraceInfo, RagMatchedDocTrace } from '../types';

const STOP_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'en',
  'y', 'o', 'u', 'e', 'que', 'quien', 'quienes', 'cual', 'cuales', 'como', 'donde',
  'cuando', 'cuanto', 'por', 'para', 'con', 'sin', 'sobre', 'entre', 'es', 'son', 'era',
  'fue', 'fueron', 'ser', 'estar', 'esta', 'estan', 'hay', 'tiene', 'tienen', 'puedo',
  'puede', 'pueden', 'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'me', 'te', 'se', 'nos',
  'lo', 'le', 'les', 'si', 'no', 'mas', 'muy', 'ya', 'acerca', 'favor', 'hola',
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

export interface LocalRagResult {
  text: string;
  sources: string[];
  suggestedFollowUps: string[];
  ragTrace: RagTraceInfo;
}

export function generateLocalRagResponse(
  rawQuery: string,
  area: AreaType = 'institucional',
  subject?: SubjectType,
  driveFiles: DriveFileItem[] = [],
  simplifyMode = false,
  generateExercise = false
): LocalRagResult {
  const startTime = Date.now();
  const query = rawQuery || (subject ? `${subject} consulta` : 'informacion institucional');
  const normQuery = normalizeText(query);
  const queryTerms = extractQueryTerms(query);
  const isTeacherQuery = /profesor|profesora|profesores|docente|docentes|quien|enseña|cargo|dicta|titular/i.test(normQuery);

  interface Candidate {
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

  const candidates: Candidate[] = [];

  // 1) Evaluate dynamic Drive / Form files
  for (const doc of driveFiles) {
    const normTitle = normalizeText(doc.name);
    const normCat = normalizeText(doc.folderCategory || '');
    const normContent = normalizeText(doc.contentPreview || '');
    const normAuthor = normalizeText(doc.authorName || '');
    const normMod = normalizeText(doc.moduleLevel || '');
    const combined = `${normTitle} ${normCat} ${normContent} ${normAuthor} ${normMod}`;

    const matchedTerms: string[] = [];
    let score = 0;

    for (const term of queryTerms) {
      if (normTitle.includes(term)) {
        score += 15;
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
      score += 20;
    }

    if (isTeacherQuery && /profesor|profesora|docente|titular|a cargo/i.test(combined)) {
      score += 25;
    }

    if (matchedTerms.length > 0) {
      score += doc.sourceType === 'google_form' ? 25 : 12;
    }

    if (score > 0) {
      candidates.push({
        id: doc.id,
        title: doc.name,
        category: doc.folderCategory || 'General',
        content: doc.contentPreview || '',
        sourceLabel: doc.sourceType === 'google_form'
          ? `Formulario Google -> Drive (${doc.folderCategory || 'General'})`
          : `Google Drive (${doc.folderCategory || 'General'})`,
        sourceType: doc.sourceType === 'google_form' ? 'google_form_drive' : 'drive',
        authorName: doc.authorName,
        moduleLevel: doc.moduleLevel,
        score,
        matchedTerms: Array.from(new Set(matchedTerms))
      });
    }
  }

  // 2) Evaluate static Knowledge Base
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
      score += 15;
    }

    if (isTeacherQuery && (doc.subject === 'docentes' || doc.category === 'Equipo Docente')) {
      score += 15;
    }

    if (subject && doc.subject === subject) {
      score += 8;
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

  let responseText = '';

  if (generateExercise) {
    const baseDoc = topMatched[0];
    if (subject === 'matematicas') {
      responseText = `### ✏️ Ejercicio de Práctica: Matemáticas (Ciclo Básico)\n\n` +
        `**Enunciado:**\nUna persona compra materiales por $24.000 y el comercio le realiza un 15% de descuento por pago al contado. Además, abona un envío fijo de $2.500. ¿Cuánto paga en total?\n\n` +
        `**Pista útil:**\nCalculá primero el 15% de descuento multiplicando \`(24.000 × 15) / 100\`, restalo al total y luego sumá el valor del envío.\n\n` +
        `**Solución paso a paso:**\n1. Descuento del 15%: \`(24.000 × 15) / 100 = $3.600\`.\n2. Subtotal con descuento: \`$24.000 - $3.600 = $20.400\`.\n3. Total con envío: \`$20.400 + $2.500 = $22.900\`.`;
    } else if (subject === 'lengua') {
      responseText = `### ✏️ Ejercicio de Práctica: Lengua y Comunicación\n\n` +
        `**Enunciado:**\nIdentificá a qué clase corresponden las siguientes palabras según su acentuación (Aguda, Grave o Esdrújula) y justificá si llevan tilde:\n` +
        `1. *canción*\n2. *árbol*\n3. *escuela*\n4. *matemática*\n\n` +
        `**Pista útil:**\nFijate en qué sílaba suena más fuerte (última, penúltima o antepenúltima) y en qué letra termina.\n\n` +
        `**Solución paso a paso:**\n` +
        `1. **Canción**: Aguda (sílaba tónica en la última *-ción*), lleva tilde porque termina en N.\n` +
        `2. **Árbol**: Grave (sílaba tónica en *ár-*), lleva tilde porque NO termina en N, S ni vocal (termina en L).\n` +
        `3. **Escuela**: Grave (sílaba tónica en *-cue-*), no lleva tilde porque termina en vocal.\n` +
        `4. **Matemática**: Esdrújula (sílaba tónica en *-má-*), siempre lleva tilde.`;
    } else if (subject === 'nuevas_tecnologias') {
      responseText = `### ✏️ Ejercicio de Práctica: Nuevas Tecnologías\n\n` +
        `**Enunciado:**\nClasificá los siguientes elementos en **Hardware** o **Software**, y si es hardware indicá si es periférico de entrada o salida:\n` +
        `1. Memoria RAM de 8 GB\n2. Teclado USB\n3. Google Chrome\n4. Monitor LED 24"\n5. Sistema Operativo Android\n\n` +
        `**Solución paso a paso:**\n` +
        `1. **Memoria RAM**: Hardware (componente interno de procesamiento/almacenamiento temporal).\n` +
        `2. **Teclado USB**: Hardware (periférico de entrada de datos).\n` +
        `3. **Google Chrome**: Software (aplicación/navegador web).\n` +
        `4. **Monitor LED**: Hardware (periférico de salida de información visual).\n` +
        `5. **Android**: Software (sistema operativo del dispositivo).`;
    } else {
      responseText = `### ✏️ Ejercicio de Práctica (${baseDoc ? baseDoc.category : 'Formación Básica'})\n\n` +
        `**Enunciado:**\nA partir de los contenidos de *${baseDoc ? baseDoc.title : 'la materia'}*, analizá la siguiente situación y respondé con tus palabras:\n` +
        `> ¿Por qué es importante organizar la información y fundamentar las respuestas en el ámbito laboral y de estudio?\n\n` +
        `**Pista:** Pensá en cómo la claridad evita malentendidos y permite resolver trámites con mayor rapidez.\n\n` +
        `**Solución guía:** La información estructurada permite comunicar con precisión, defender los derechos del trabajador (Art. 14 bis) y agilizar gestiones en Secretaría o en el empleo.`;
    }
  } else if (topMatched.length > 0) {
    const primary = topMatched[0];
    const heading = isTeacherQuery
      ? '👨‍🏫 Nómina del Equipo Docente (Escuela N° 2702 EMAL)'
      : `📋 ${primary.title}`;

    responseText = `### ${heading}\n\n${primary.content}\n`;

    if (simplifyMode) {
      responseText += `\n**En resumen simple:**\nEsta información es oficial de la Escuela N° 2702 EMAL. Podés acercarte a Secretaría y Preceptoría de **Lunes a Viernes de 19:15 a 22:15 hs** en Güemes 710 para consultar lo que necesites.\n`;
    }

    if (topMatched.length > 1 && topMatched[1].matchedTerms.length > 0 && topMatched[1].id !== primary.id) {
      responseText += `\n---\n**Información complementaria (${topMatched[1].category}):**\n${topMatched[1].content}\n`;
    }

    responseText += `\n---\n*ℹ️ Secretaría Escuela N° 2702 EMAL · Atención de Lunes a Viernes de 19:15 a 22:15 hs.*`;
  } else {
    responseText = `¡Hola! Soy **EMALBOT**, el asistente virtual de la **Escuela N° 2702 EMAL**.\n\n` +
      `Puedo ayudarte con información sobre:\n` +
      `- **MATRÍCULA 2027**: Requisitos, documentación y preinscripción online.\n` +
      `- **Horarios de Secretaría**: Lunes a Viernes de 19:15 a 22:15 hs.\n` +
      `- **Equipo Docente**: Profesores de Nuevas Tecnologías, Matemáticas, Lengua y Cs. Naturales.\n` +
      `- **Materias de 1° y 2° año**: Explicaciones paso a paso y ejercicios de práctica.\n\n` +
      `¿Qué te gustaría consultar?`;
  }

  const sourcesUsed = topMatched.map(d => `${d.title} (${d.sourceLabel})`);

  const suggestedFollowUps = area === 'institucional'
    ? [
        '¿Cuáles son los requisitos para Matrícula 2027?',
        '¿En qué horario atiende Secretaría?',
        '¿Cómo solicito una constancia de alumno regular?'
      ]
    : [
        'Explicar números enteros y ecuaciones de 1° y 2° año',
        '¿Quiénes son los profesores a cargo de las materias?',
        '¿Cuáles son las reglas de acentuación en Lengua?'
      ];

  const processingMs = Math.max(8, Date.now() - startTime);

  const matchedDocsTrace: RagMatchedDocTrace[] = topMatched.map(d => ({
    id: d.id,
    title: d.title,
    sourceType: d.sourceType,
    category: d.category,
    score: d.score,
    matchedTerms: d.matchedTerms,
    excerpt: buildRelevantExcerpt(d.content, queryTerms)
  }));

  return {
    text: responseText,
    sources: sourcesUsed,
    suggestedFollowUps,
    ragTrace: {
      keywords: queryTerms,
      totalDocsScanned: driveFiles.length + KNOWLEDGE_BASE.length,
      driveDocsScanned: driveFiles.length,
      matchedDocuments: matchedDocsTrace,
      generationMode: 'rag-local-synthesizer',
      processingMs
    }
  };
}
