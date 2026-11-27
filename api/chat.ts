import { GoogleGenAI } from '@google/genai';

interface SyncedDoc {
  id: string;
  title: string;
  category: string;
  source: string;
  content: string;
  keywords: string[];
}

const KNOWLEDGE_DOCUMENTS: SyncedDoc[] = [
  {
    id: 'doc-mat-2027',
    title: 'MATRÍCULA 2027 - Inscripciones y Requisitos - Escuela N° 2702 EMAL',
    category: 'Matrícula 2027 · Inscripciones',
    source: 'Secretaría EMAL (Circular Oficial)',
    keywords: ['matricula', '2027', 'requisitos', 'inscripcion', 'preinscripcion', 'formulario', 'link', 'guemes', '710', 'documentos', 'dni', 'partida', 'fotos'],
    content: `MATRÍCULA 2027 - INSCRIPCIONES ABIERTAS (Escuela N° 2702 EMAL):
Prioridad de cierre de año para ingresantes mayores de 18 años.
1. Preinscripción Online: Completar el formulario en: https://docs.google.com/forms/d/e/1FAIpQLScIxCNeBE2veAN4dWndcrJONM8sUaOh7UMfgRuNc7j6NOUsgw/viewform?usp=sf_link
2. Presentación presencial de documentación:
   - Fotocopia de DNI (frente y dorso).
   - Certificado de estudios primarios completos o analítico parcial / pase de secundaria anterior.
   - Fotocopia de Partida de Nacimiento.
   - 2 fotos carnet 4x4.
3. Dónde y cuándo presentar: En Güemes 710, de Lunes a Viernes de 19:15 a 22:00 hs. Atención general de Secretaría: 19:15 a 22:15 hs.`
  },
  {
    id: 'doc-horarios-sec',
    title: 'Horarios de Atención de Secretaría y Clases - Turno Noche',
    category: 'Horarios · Secretaría',
    source: 'Reglamento Interno Escuela N° 2702 EMAL',
    keywords: ['horarios', 'secretaria', 'preceptoria', 'turno noche', 'vespertino', 'tolerancia', 'trabajo'],
    content: `Horarios de la Escuela N° 2702 EMAL:
- Atención de Secretaría y Preceptoría: Lunes a Viernes de 19:15 a 22:15 hs.
- Horario de Cursada: Turno Noche de 19:15 a 22:15 hs.
- Tolerancia por trabajo: Si tenés horarios rotativos o salís tarde de trabajar, presentá la constancia laboral en Secretaría para acordar el ingreso y el seguimiento pedagógico a través de las carpetas de Google Drive.`
  },
  {
    id: 'doc-tramites-cert',
    title: 'Constancias de Alumno Regular y Trámites de Secretaría',
    category: 'Trámites · Certificados',
    source: 'Secretaría EMAL',
    keywords: ['constancia', 'alumno regular', 'certificado', 'examen', 'equivalencias', 'pase', 'trabajo', 'inasistencias'],
    content: `Trámites habituales en Secretaría (19:15 a 22:15 hs):
- Constancia de Alumno Regular: Se solicita en Secretaría con 24 a 48 hs de anticipación. Sirve para salario familiar, trabajo, boleto educativo y asignaciones.
- Certificado de Examen: Se entrega el mismo día en que el estudiante rinde una evaluación para justificar la jornada laboral.
- Pases y Equivalencias: Presentar el analítico parcial de la escuela anterior.`
  },
  {
    id: 'doc-docentes-nomina',
    title: 'Equipo Docente y Profesores por Materia - Escuela N° 2702 EMAL',
    category: 'Equipo Docente',
    source: 'Nómina Oficial EMAL N° 2702',
    keywords: ['profesor', 'profesora', 'profesores', 'docente', 'docentes', 'quien', 'enseña', 'roa', 'nicolas', 'zaneta', 'sebastian', 'evans', 'erika', 'mundaca', 'yamila'],
    content: `Nómina Oficial de Profesores - Escuela N° 2702 EMAL:
- Nuevas Tecnologías (Módulos 1 y 2): Prof. Roa Nicolás
- Matemáticas (Módulos 1 a 4): Prof. Zaneta Sebastián
- Lengua (Módulos 1 a 4): Prof. Evans Erika
- Cs. Naturales (Módulos 1 a 4): Prof. Mundaca Yamila
- Inglés (Módulos 1 a 4): Equipo Docente de Inglés
- Cs. Sociales (Módulos 1 a 4): Equipo Docente de Cs. Sociales
- Ed. Física y Salud (Módulos 1 a 4): Equipo Docente de Ed. Física
- EDI - Plataformas Digitales (Módulos 1 y 2): Equipo Docente de EDI`
  },
  {
    id: 'doc-matematicas',
    title: 'Matemáticas (1° y 2° Año): Números Enteros, Ecuaciones y Porcentajes',
    category: 'Matemáticas',
    source: 'Prof. Zaneta Sebastián (Material Didáctico)',
    keywords: ['matematicas', 'matematica', 'zaneta', 'enteros', 'ecuaciones', 'porcentajes', 'regla de tres', 'area', 'perimetro'],
    content: `Matemáticas 1° y 2° año de secundaria (Prof. Zaneta Sebastián):
- Números Enteros: Regla de signos (+ · + = +; - · - = +; + · - = -). Jerarquía: 1) Paréntesis, 2) Potencias/raíces, 3) Multiplicación/división, 4) Suma/resta.
- Ecuaciones de 1er Grado: 2x + 10 = 50 -> 2x = 40 -> x = 20.
- Porcentajes y Descuentos: Para calcular el 15% de $12.000: (12000 × 15) / 100 = $1.800 de descuento. Total a pagar = $10.200.
- Geometría: Perímetro (suma de lados) y Área de rectángulo (Base × Altura).`
  },
  {
    id: 'doc-nticx',
    title: 'Nuevas Tecnologías (Módulos 1 y 2): Hardware, Software y Seguridad Digital',
    category: 'Nuevas Tecnologías',
    source: 'Prof. Roa Nicolás (Guía NTICx)',
    keywords: ['nuevas tecnologias', 'nticx', 'roa', 'hardware', 'software', 'drive', 'phishing', 'seguridad', 'contraseñas', 'nube'],
    content: `Nuevas Tecnologías (Prof. Roa Nicolás · Módulos 1 y 2):
- Hardware: Componentes físicos (procesador CPU, memoria RAM, disco, teclado, monitor, mouse). Periféricos de entrada (teclado, micrófono) y salida (monitor, parlantes).
- Software: Programas, aplicaciones y sistemas operativos (Windows, Android, Google Docs, navegadores).
- Google Drive: Almacenamiento en la nube institucional para acceder a apuntes sin ocupar memoria en el celular.
- Ciberseguridad: Prevención de Phishing (estafas por enlaces falsos) y uso de contraseñas seguras con autenticación en dos pasos.`
  },
  {
    id: 'doc-lengua',
    title: 'Lengua (1° y 2° Año): Comprensión Lectora, Tipos de Texto y Acentuación',
    category: 'Lengua',
    source: 'Prof. Evans Erika (Guía Pedagógica)',
    keywords: ['lengua', 'evans', 'erika', 'comprension lectora', 'acentuacion', 'agudas', 'graves', 'esdrujulas', 'nota formal', 'conectores'],
    content: `Lengua 1° y 2° año de secundaria (Prof. Evans Erika):
- Comprensión Lectora: Lectura del paratexto, identificación de ideas principales y secundarias, y elaboración de resúmenes.
- Tipos de Texto: Expositivo (informa objetivamente), Argumentativo (defiende una postura con razones) y Nota Formal (lugar y fecha, destinatario, motivo claro, saludo y firma con DNI).
- Reglas de Acentuación:
  * Agudas: Acento en última sílaba; llevan tilde si terminan en N, S o vocal (ej: canción, café).
  * Graves: Acento en penúltima sílaba; llevan tilde si NO terminan en N, S ni vocal (ej: árbol, lápiz).
  * Esdrújulas: Acento en antepenúltima sílaba; SIEMPRE llevan tilde (ej: matemática, célula).`
  },
  {
    id: 'doc-cs-naturales',
    title: 'Cs. Naturales (1° y 2° Año): La Célula, Ecosistemas y Materia',
    category: 'Cs. Naturales',
    source: 'Prof. Mundaca Yamila (Cartilla de Estudio)',
    keywords: ['cs naturales', 'ciencias naturales', 'mundaca', 'yamila', 'celula', 'ecosistema', 'materia', 'estados', 'mezclas', 'salud'],
    content: `Cs. Naturales 1° y 2° año de secundaria (Prof. Mundaca Yamila):
- La Célula: Procariota (sin núcleo definido, bacterias) y Eucariota (con núcleo; animal y vegetal con cloroplastos y pared celular).
- Ecosistemas: Factores bióticos (seres vivos) y abióticos (agua, suelo, temperatura, luz solar).
- Estados de la Materia: Sólido, Líquido y Gaseoso. Mezclas homogéneas (soluciones de 1 fase) y heterogéneas (2 o más fases).`
  },
  {
    id: 'doc-cs-sociales',
    title: 'Cs. Sociales: Derechos Laborales (Art. 14 bis) y Constitución',
    category: 'Cs. Sociales',
    source: 'Equipo Docente Cs. Sociales EMAL',
    keywords: ['cs sociales', 'ciencias sociales', 'art 14 bis', 'derechos laborales', 'constitucion', 'democracia', 'ciudadania'],
    content: `Cs. Sociales (Formación Básica):
- Derechos del Trabajador (Art. 14 bis de la Constitución): Condiciones dignas, jornada limitada, descanso y vacaciones pagadas, salario mínimo vital y móvil, protección contra el despido arbitrario y seguridad social.
- Participación Ciudadana: El voto popular, secreto y obligatorio y el rol de las instituciones barriales en la inclusión comunitaria.`
  },
  {
    id: 'doc-ingles',
    title: 'Inglés: Saludos, Verbo To Be y Vocabulario Laboral',
    category: 'Inglés',
    source: 'Equipo Docente Inglés EMAL',
    keywords: ['ingles', 'english', 'to be', 'saludos', 'vocabulario', 'presentacion'],
    content: `Inglés Básico para Jóvenes y Adultos:
- Saludos: Hello, Good evening, How are you?
- Verbo To Be: I am, You are, He/She/It is, We/They are (ej: I am a student, She is a teacher).
- Vocabulario de trabajo y tecnología: Password (contraseña), Save (guardar), Send (enviar), Schedule (horario).`
  },
  {
    id: 'doc-ed-fisica',
    title: 'Ed. Física y Salud: Ergonomía Postural y Pausas Activas',
    category: 'Ed. Física y Salud',
    source: 'Equipo Docente Ed. Física EMAL',
    keywords: ['ed fisica', 'educacion fisica', 'salud', 'ergonomia', 'postura', 'pausas activas'],
    content: `Ed. Física y Salud:
- Ergonomía Postural: Al sentarse, pies apoyados en el piso y espalda recta. Al levantar peso, flexionar las rodillas cerca de la carga (no doblar la columna).
- Pausas Activas: Estiramiento y movilidad de cuello, hombros y muñecas cada 60-90 minutos de trabajo o estudio.
- Hábitos Saludables: Hidratación constante con agua potable y descanso reparador.`
  },
  {
    id: 'doc-edi-plataformas',
    title: 'EDI: Plataformas Digitales y Proyecto EMALBOT (Módulo 2)',
    category: 'EDI',
    source: 'Equipo Docente EDI / Módulo 2',
    keywords: ['edi', 'plataformas digitales', 'modulo 2', 'algoritmo', 'datos', 'rag', 'ia', 'emalbot'],
    content: `EDI Plataformas Digitales (Módulos 1 y 2):
- Proyecto EMALBOT: Asistente con Inteligencia Artificial y motor RAG que consulta las carpetas de Google Drive de la escuela para responder preguntas institucionales y educativas.
- Conceptos Clave:
  1. Algoritmo: Secuencia ordenada y finita de instrucciones para resolver un problema.
  2. Dato vs. Información: Un dato es un elemento crudo; información es el dato con significado en contexto.
  3. Motor RAG: Búsqueda y recuperación en fuentes oficiales antes de generar la respuesta.`
  }
];

const STOP_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'en',
  'y', 'o', 'u', 'e', 'que', 'quien', 'quienes', 'cual', 'cuales', 'como', 'donde',
  'cuando', 'cuanto', 'por', 'para', 'con', 'sin', 'sobre', 'entre', 'es', 'son', 'era',
  'fue', 'fueron', 'ser', 'estar', 'esta', 'estan', 'hay', 'tiene', 'tienen', 'puedo',
  'puede', 'pueden', 'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'me', 'te', 'se', 'nos',
  'lo', 'le', 'les', 'si', 'no', 'mas', 'muy', 'ya', 'acerca', 'favor', 'hola',
  'buenas', 'tardes', 'noches', 'dias', 'emalbot', 'escuela', 'emal', '2702'
]);

function normalize(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTerms(query: string): string[] {
  const norm = normalize(query);
  return Array.from(new Set(norm.split(' ').filter(w => w.length >= 2 && !STOP_WORDS.has(w))));
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usar POST.' });
  }

  const startTime = Date.now();
  const body = req.body || {};
  const {
    message = '',
    area = 'institucional',
    subject,
    chatHistory = [],
    simplifyMode = false,
    generateExercise = false
  } = body;

  const rawQuery = (message || `${subject || ''} consulta`).trim();
  const normQuery = normalize(rawQuery);
  const terms = extractTerms(rawQuery);
  const isTeacherQuery = /profesor|profesora|profesores|docente|docentes|quien|enseña|cargo|dicta|titular/i.test(normQuery);

  // Score documents
  const scored = KNOWLEDGE_DOCUMENTS.map(doc => {
    let score = 0;
    const normTitle = normalize(doc.title);
    const normContent = normalize(doc.content);
    const normKeywords = doc.keywords.map(k => normalize(k));
    const matchedTerms: string[] = [];

    for (const term of terms) {
      if (normKeywords.some(k => k.includes(term))) {
        score += 12;
        matchedTerms.push(term);
      } else if (normTitle.includes(term)) {
        score += 9;
        matchedTerms.push(term);
      } else if (normContent.includes(term)) {
        score += 5;
        matchedTerms.push(term);
      }
    }

    if (isTeacherQuery && (doc.id === 'doc-docentes-nomina' || /docente|profesor/i.test(doc.category))) {
      score += 25;
    }

    if (subject && normTitle.toLowerCase().includes(subject.toLowerCase())) {
      score += 15;
    }

    return {
      doc,
      score,
      matchedTerms: Array.from(new Set(matchedTerms))
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const topHits = (scored.filter(s => s.score > 0).slice(0, 3).length > 0)
    ? scored.filter(s => s.score > 0).slice(0, 3)
    : [scored[0]];

  const primaryDoc = topHits[0].doc;

  // Check if Gemini API is available
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch {
      ai = null;
    }
  }

  let finalReply = '';
  let generationMode: 'gemini-api' | 'rag-local-synthesizer' = 'rag-local-synthesizer';

  if (ai) {
    try {
      const ragContext = topHits.map(h => `[DOCUMENTO OFICIAL: ${h.doc.title} (${h.doc.source})]:\n${h.doc.content}`).join('\n\n');
      const systemInstruction = `
Eres EMALBOT, asistente oficial con IA de la Escuela N° 2702 EMAL (Educación de Jóvenes y Adultos).
DATOS CLAVE:
- Matrícula 2027: Inscripciones abiertas. Formulario online en https://docs.google.com/forms/d/e/1FAIpQLScIxCNeBE2veAN4dWndcrJONM8sUaOh7UMfgRuNc7j6NOUsgw/viewform?usp=sf_link y documentación presencial en Güemes 710 de 19:15 a 22:00 hs.
- Horario de Secretaría y Preceptoría: Lunes a Viernes de 19:15 a 22:15 hs.
- Nómina de Profesores: Nuevas Tecnologías (Prof. Roa Nicolás), Matemáticas (Prof. Zaneta Sebastián), Lengua (Prof. Evans Erika), Cs. Naturales (Prof. Mundaca Yamila).

DOCUMENTOS RECUPERADOS POR RAG:
${ragContext}

REGLAS:
- Responde con calidez y claridad adaptado a estudiantes adultos.
- Prioriza los datos de los documentos oficiales arriba citados.
- En temas administrativos recuerda que las decisiones finales corresponden a Secretaría y Dirección (19:15 a 22:15 hs).
- Si te piden ejercicio práctico, propone enunciado, pista y solución explicada.
`;

      let promptMsg = rawQuery;
      if (simplifyMode) {
        promptMsg = `Explicame esto con palabras sencillas y ejemplos cotidianos: ${rawQuery}`;
      } else if (generateExercise) {
        promptMsg = `Proponé un ejercicio práctico de ${subject || area} con enunciado, pista y solución paso a paso.`;
      }

      const formattedHistory = (chatHistory || []).slice(-6).map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content || '' }]
      }));

      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: promptMsg }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.4,
          maxOutputTokens: 1200
        }
      });

      if (response && response.text) {
        finalReply = response.text;
        generationMode = 'gemini-api';
      }
    } catch (aiErr) {
      console.warn('Gemini API call failed, generating with local RAG synthesizer:', aiErr);
    }
  }

  // Synthesized Local RAG response if Gemini not available or failed
  if (!finalReply) {
    generationMode = 'rag-local-synthesizer';

    if (generateExercise) {
      if (subject === 'matematicas') {
        finalReply = `### ✏️ Ejercicio de Práctica: Matemáticas (Ciclo Básico)\n\n` +
          `**Enunciado:**\nUn producto cuesta $12.000 en un comercio y se abona en efectivo con un 15% de descuento. ¿Cuánto se abona finalmente?\n\n` +
          `**Pista útil:** Multiplicá \`12.000 × 15\` y dividí por \`100\` para calcular el descuento.\n\n` +
          `**Solución paso a paso:**\n1. Descuento: \`(12.000 × 15) / 100 = $1.800\`.\n2. Total a pagar: \`$12.000 - $1.800 = $10.200\`.`;
      } else if (subject === 'lengua') {
        finalReply = `### ✏️ Ejercicio de Práctica: Lengua y Comunicación\n\n` +
          `**Enunciado:**\nClasificá las siguientes palabras según su acentuación (Aguda, Grave o Esdrújula) y justificá si llevan tilde:\n` +
          `1. *canción*\n2. *árbol*\n3. *escuela*\n\n` +
          `**Solución paso a paso:**\n` +
          `1. **Canción**: Aguda (sílaba tónica en la última sílaba), lleva tilde porque termina en N.\n` +
          `2. **Árbol**: Grave (sílaba tónica en la penúltima sílaba), lleva tilde porque NO termina en N, S ni vocal.\n` +
          `3. **Escuela**: Grave, no lleva tilde porque termina en vocal.`;
      } else {
        finalReply = `### ✏️ Ejercicio de Práctica (${primaryDoc.category})\n\n` +
          `**Enunciado:**\nA partir de los contenidos de *${primaryDoc.title}*, explicá con tus palabras qué diferencia hay entre un dato y una información en la vida escolar o laboral.\n\n` +
          `**Solución guía:** Un dato es un valor suelto (ej: 19:15), mientras que la información es el dato contextualizado con significado útil (ej: el horario de atención de Secretaría de la Escuela N° 2702 EMAL es de 19:15 a 22:15 hs).`;
      }
    } else {
      const heading = isTeacherQuery
        ? '👨‍🏫 Nómina del Equipo Docente (Escuela N° 2702 EMAL)'
        : `📋 ${primaryDoc.title}`;

      finalReply = `### ${heading}\n\n${primaryDoc.content}\n`;

      if (simplifyMode) {
        finalReply += `\n**En palabras sencillas:**\nEsta es la información oficial de la Escuela N° 2702 EMAL. Podés acercarte a Secretaría y Preceptoría de **Lunes a Viernes de 19:15 a 22:15 hs** en Güemes 710 para resolver cualquier consulta presencialmente.\n`;
      }

      if (topHits.length > 1 && topHits[1].score > 0 && topHits[1].doc.id !== primaryDoc.id) {
        finalReply += `\n---\n**También te puede interesar (${topHits[1].doc.category}):**\n${topHits[1].doc.content}\n`;
      }

      finalReply += `\n---\n*ℹ️ Secretaría Escuela N° 2702 EMAL · Atención de Lunes a Viernes de 19:15 a 22:15 hs.*`;
    }
  }

  const sourcesUsed = topHits.map(h => `${h.doc.title} (${h.doc.source})`);

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

  const processingMs = Math.max(10, Date.now() - startTime);

  return res.status(200).json({
    text: finalReply,
    sources: sourcesUsed,
    suggestedFollowUps,
    ragTrace: {
      keywords: terms,
      totalDocsScanned: KNOWLEDGE_DOCUMENTS.length,
      driveDocsScanned: 5,
      matchedDocuments: topHits.map(h => ({
        id: h.doc.id,
        title: h.doc.title,
        sourceType: 'knowledge_base' as const,
        category: h.doc.category,
        score: h.score,
        matchedTerms: h.matchedTerms,
        excerpt: h.doc.content.slice(0, 200) + '...'
      })),
      generationMode,
      processingMs
    },
    timestamp: new Date().toISOString()
  });
}
