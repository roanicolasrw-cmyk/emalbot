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
    content: `**MATRÍCULA 2027 — INSCRIPCIONES ABIERTAS (Escuela N° 2702 EMAL)**

**1. Preinscripción Online:**
Completar el formulario digital: [Formulario de Preinscripción Matrícula 2027](https://docs.google.com/forms/d/e/1FAIpQLScIxCNeBE2veAN4dWndcrJONM8sUaOh7UMfgRuNc7j6NOUsgw/viewform?usp=sf_link)

**2. Documentación a presentar (mayores de 18 años):**
- Fotocopia de DNI (frente y dorso).
- Certificado de estudios primarios completos o analítico parcial / pase de secundaria anterior.
- Fotocopia de Partida de Nacimiento.
- 2 fotos carnet 4x4.

**3. Lugar y Horario de entrega:**
En **Güemes 710**, de **Lunes a Viernes de 19:15 a 22:00 hs** (Atención general de Secretaría hasta las 22:15 hs).`
  },
  {
    id: 'doc-horarios-sec',
    title: 'Horarios de Atención de Secretaría y Clases',
    category: 'Horarios · Secretaría',
    source: 'Reglamento Interno Escuela N° 2702 EMAL',
    keywords: ['horarios', 'secretaria', 'preceptoria', 'turno noche', 'vespertino', 'tolerancia', 'trabajo'],
    content: `**Horarios de la Escuela N° 2702 EMAL (Güemes 710):**

- **Secretaría y Preceptoría:** Lunes a Viernes de **19:15 a 22:15 hs**.
- **Turno de Cursada:** Turno Noche de **19:15 a 22:15 hs**.
- **Tolerancia por trabajo:** Presentando constancia laboral en Secretaría se contempla el ingreso adecuado a tu jornada de trabajo.`
  },
  {
    id: 'doc-tramites-cert',
    title: 'Constancias de Alumno Regular y Certificados',
    category: 'Trámites · Certificados',
    source: 'Secretaría EMAL',
    keywords: ['constancia', 'alumno regular', 'certificado', 'examen', 'equivalencias', 'pase', 'trabajo', 'inasistencias'],
    content: `**Trámites de Secretaría (Lunes a Viernes de 19:15 a 22:15 hs):**

- **Constancia de Alumno Regular:** Se solicita en Secretaría con **24 a 48 hs de anticipación**. Válida para trabajo, asignaciones y boleto educativo.
- **Certificado de Examen:** Se entrega el mismo día en que se rinde una evaluación para justificar la jornada laboral.
- **Pases / Equivalencias:** Presentar el analítico parcial legalizado en Secretaría.`
  },
  {
    id: 'doc-docentes-nomina',
    title: 'Equipo Docente y Profesores por Materia',
    category: 'Equipo Docente',
    source: 'Nómina Oficial EMAL N° 2702',
    keywords: ['profesor', 'profesora', 'profesores', 'docente', 'docentes', 'quien', 'enseña', 'nomina'],
    content: `**Nómina de Profesores — Escuela N° 2702 EMAL:**

- **Nuevas Tecnologías (Módulos 1 y 2):** Prof. Roa Nicolás
- **Matemáticas (Módulos 1 a 4):** Prof. Zaneta Sebastián
- **Lengua (Módulos 1 a 4):** Prof. Evans Erika
- **Cs. Naturales (Módulos 1 a 4):** Prof. Mundaca Yamila
- **Inglés (Módulos 1 a 4):** Equipo Docente de Inglés
- **Cs. Sociales (Módulos 1 a 4):** Equipo Docente de Cs. Sociales
- **Ed. Física y Salud (Módulos 1 a 4):** Equipo Docente de Ed. Física
- **EDI - Plataformas Digitales (Módulos 1 y 2):** Equipo Docente de EDI`
  },
  {
    id: 'doc-matematicas',
    title: 'Matemáticas (Módulos 1 y 2) · Prof. Zaneta Sebastián',
    category: 'Matemáticas',
    source: 'Diseño Curricular Modular EPJA Chubut (Anexo I)',
    keywords: ['matematicas', 'matematica', 'modulo 1', 'modulo 2', 'zaneta', 'enteros', 'ecuaciones', 'porcentajes', 'fracciones', 'geometria', 'estadistica'],
    content: `**Matemáticas — Ciclo de Formación Básica (Prof. Zaneta Sebastián):**

- **Módulo 1 (Ciudadanía / Naturaleza y Desarrollo):**
  * **Números Enteros:** Operaciones y propiedades, regla de signos (\`+ · + = +\`, \`- · - = +\`, \`+ · - = -\`) y jerarquía de operaciones combinadas.
  * **Números Racionales:** Fracciones, expresiones decimales y porcentajes aplicados a compras y descuentos cotidianos.
  * **Álgebra y Ecuaciones:** Ecuaciones de 1er grado con una incógnita (\`2x + 10 = 50\`).
  * **Geometría y Proporcionalidad:** Perímetro y área de figuras planas; ejes cartesianos.

- **Módulo 2 (Identidad / Diversidad y Salud):**
  * **Geometría y Cuerpos:** Figuras planas y cuerpos en el espacio.
  * **Sistema Sexagesimal:** Unidades angulares y temporales.
  * **Ejes Cartesianos y Funciones:** Ubicación de puntos y análisis de datos de salud y trabajo.
  * **Estadística Descriptiva:** Tablas y gráficos estadísticos (barras, circulares, líneas).`
  },
  {
    id: 'doc-nticx',
    title: 'Nuevas Tecnologías (Módulos 1 y 2) · Prof. Roa Nicolás',
    category: 'Nuevas Tecnologías',
    source: 'Diseño Curricular Modular EPJA Chubut (Anexo I)',
    keywords: ['nuevas tecnologias', 'nticx', 'modulo 1', 'modulo 2', 'roa', 'hardware', 'software', 'drive', 'phishing', 'ofimatica', 'redes', 'inteligencia artificial', 'ia', 'ciudades inteligentes', 'smart cities', 'big data'],
    content: `**Educación en Nuevas Tecnologías — Ciclo Básico (Prof. Roa Nicolás):**

- **Módulo 1 (Ciudadanía / Naturaleza y Desarrollo):**
  * **Alfabetización Digital:** Hardware (CPU, memoria RAM, periféricos de entrada y salida) y Software (sistemas operativos y aplicaciones).
  * **Software de Oficina:** Procesadores de texto (notas, cartas, tablas), Planillas de cálculo (fórmulas y gráficos) y Presentaciones.
  * **Almacenamiento en la Nube:** Google Drive institucional para apuntes sin saturar el celular.
  * **Seguridad Digital:** Contraseñas seguras y prevención de estafas por Phishing.

- **Módulo 2 (Identidad / Diversidad y Salud):**
  * **Inteligencia Artificial (IA):** Modelos conversacionales y **desarrollo activo de los estudiantes de EMAL** (participación en la creación, ajuste y validación de **EMALBOT** con arquitectura RAG).
  * **Ciudades Inteligentes (Smart Cities):** Conectividad, sensores urbanos, movilidad sustentable y energía.
  * **Big Data:** Procesamiento de grandes volúmenes de datos para tomar decisiones comunitarias.
  * **Comunicación y Redes:** Búsqueda crítica en Internet y seguridad en redes sociales.`
  },
  {
    id: 'doc-lengua',
    title: 'Lengua y Literatura (Módulos 1 y 2) · Prof. Evans Erika',
    category: 'Lengua',
    source: 'Diseño Curricular Modular EPJA Chubut (Anexo I)',
    keywords: ['lengua', 'literatura', 'modulo 1', 'modulo 2', 'evans', 'acentuacion', 'agudas', 'graves', 'esdrujulas', 'nota formal', 'mapuche'],
    content: `**Lengua y Literatura — Ciclo de Formación Básica (Prof. Evans Erika):**

- **Módulo 1 (Ciudadanía / Emancipación):**
  * **La Palabra y la Ciudadanía:** La lengua como instrumento de derechos y expresión social.
  * **Tipos de Texto:** Narrativo, explicativo, argumentativo e informativo.
  * **Redacción Formal:** Estructura oficial de la **Nota Formal** (lugar, fecha, destinatario, cuerpo claro, saludo y firma con DNI).
  * **Normativa y Acentuación:** Reglas de tilde (agudas con N/S/vocal; graves sin N/S/vocal; esdrújulas siempre).
  * **Literatura Latinoamericana:** Autores vinculados a problemáticas sociales.

- **Módulo 2 (Identidad / Diversidad y Género):**
  * **Análisis Crítico:** Detección de lenguaje discriminatorio en medios y publicidad.
  * **Identidad Cultural:** La lengua como factor de pertenencia y aproximación a la cultura mapuche.
  * **Debate:** Espacios de diálogo sobre diversidad, género y derechos humanos.`
  },
  {
    id: 'doc-cs-naturales',
    title: 'Ciencias Naturales (Módulos 1 y 2) · Prof. Mundaca Yamila',
    category: 'Cs. Naturales',
    source: 'Diseño Curricular Modular EPJA Chubut (Anexo I)',
    keywords: ['cs naturales', 'ciencias naturales', 'modulo 1', 'modulo 2', 'mundaca', 'celula', 'ecosistema', 'materia', 'salud sexual', 'esi', 'nutricion'],
    content: `**Ciencias Naturales — Ciclo de Formación Básica (Prof. Mundaca Yamila):**

- **Módulo 1 (Ciudadanía / Naturaleza y Desarrollo):**
  * **Seres Vivos:** Niveles de organización y características biológicas.
  * **Materia y Energía en Ecosistemas:** Cadenas tróficas, organismos autótrofos/heterótrofos y ecosistemas patagónicos.
  * **Materia y Mezclas:** Estados de la materia (sólido, líquido, gaseoso) y mezclas homogéneas y heterogéneas.

- **Módulo 2 (Identidad / Salud e Inequidad):**
  * **Desarrollo Humano:** Crecimiento y maduración biológica.
  * **Salud Sexual y Reproductiva (ESI):** Prevención de ITS, métodos anticonceptivos y derechos de salud.
  * **Prevención de Adicciones:** Identificación de riesgos y cuidados comunitarios.
  * **Nutrición y Salud:** Nutrientes esenciales y hábitos saludables.`
  },
  {
    id: 'doc-cs-sociales',
    title: 'Ciencias Sociales (Módulos 1 y 2)',
    category: 'Cs. Sociales',
    source: 'Diseño Curricular Modular EPJA Chubut (Anexo I)',
    keywords: ['cs sociales', 'ciencias sociales', 'modulo 1', 'modulo 2', 'art 14 bis', 'estado', 'democracia', 'genero', 'trabajo'],
    content: `**Ciencias Sociales — Ciclo de Formación Básica (Equipo Docente):**

- **Módulo 1 (Ciudadanía / Emancipación):**
  * **Estado y Sociedad:** Modelos de Estado (Bienestar, Liberal, Neoliberal).
  * **Democracia vs. Autoritarismo:** Dictaduras latinoamericanas y construcción democrática.
  * **Derechos Laborales:** Artículo 14 bis de la Constitución Nacional y redes de trabajo solidario.

- **Módulo 2 (Identidad / Diversidad y Género):**
  * **Historia y Territorio:** Rol de la mujer en los movimientos sociales y nuevas organizaciones laborales.
  * **Diversidad:** Reconocimiento de derechos colectivos y comunidades originarias.`
  },
  {
    id: 'doc-ingles',
    title: 'Lenguas Extranjera Inglés (Módulos 1 y 2)',
    category: 'Inglés',
    source: 'Diseño Curricular Modular EPJA Chubut (Anexo I)',
    keywords: ['ingles', 'english', 'modulo 1', 'modulo 2', 'to be', 'saludos', 'presente simple', 'pasado simple'],
    content: `**Lenguas Extranjera Inglés — Ciclo de Formación Básica (Equipo Docente):**

- **Módulo 1 (Ciudadanía):**
  * **Identidad Global:** Países, nacionalidades y saludos cotidianos formales e informales.
  * **Gramática:** Verbo To Be en presente simple.
  * **Comprensión:** Señalética, avisos públicos y mensajes breves.

- **Módulo 2 (Identidad y Diversidad):**
  * **Estructura:** Sustantivos, adjetivos, Presente Simple y Pasado Simple en situaciones reales.`
  },
  {
    id: 'doc-ed-fisica',
    title: 'Actividad Física y Salud (Módulos 1 y 2)',
    category: 'Ed. Física y Salud',
    source: 'Diseño Curricular Modular EPJA Chubut (Anexo I)',
    keywords: ['ed fisica', 'educacion fisica', 'salud', 'modulo 1', 'modulo 2', 'ergonomia', 'sedentarismo', 'entrenamiento'],
    content: `**Actividad Física y Salud — Ciclo de Formación Básica (Equipo Docente):**

- **Módulo 1:** Hábitos saludables, combate del sedentarismo y ergonomía laboral (posturas de estudio y trabajo).
- **Módulo 2:** Prácticas corporales inclusivas, hidratación, adaptación al esfuerzo y pausas activas.`
  },
  {
    id: 'doc-edi-plataformas',
    title: 'EDI: Plataformas Digitales (Módulos 1 y 2)',
    category: 'EDI',
    source: 'Escuela N° 2702 EMAL',
    keywords: ['edi', 'plataformas digitales', 'modulo 1', 'modulo 2', 'algoritmo', 'datos', 'rag', 'ia', 'emalbot'],
    content: `**EDI Plataformas Digitales — Módulos 1 y 2 (Equipo Docente):**

- **Módulo 1:** Proyecto EMALBOT, asistentes conversacionales, lógica algorítmica y diferencia entre dato e información.
- **Módulo 2:** Procesamiento de documentos de Google Drive institucional con arquitectura RAG.`
  }
];

function normalize(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
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

  const isSimplifyReq = simplifyMode || /simpl|sencill|facil|no entendi|con peras|mas simple|ejemplo cotidiano|no me quedo claro|podes repetir|explicar este concepto/i.test(normQuery);
  const isExerciseReq = generateExercise || /ejercicio|practica/i.test(normQuery);

  // Infer previous topic from chatHistory if query is a follow-up or simplification
  let inferredSubject: string | undefined = subject;
  if (chatHistory && chatHistory.length > 0) {
    let isHistIa = false;
    let isHistHwSw = false;
    let isHistPhishing = false;
    const reversed = [...chatHistory].reverse();
    for (const h of reversed) {
      const hNorm = normalize(h.content || '');
      if (/inteligencia artificial|\bia\b/i.test(hNorm)) {
        isHistIa = true;
      }
      if (/hardware|software/i.test(hNorm)) {
        isHistHwSw = true;
      }
      if (/phishing|estafa/i.test(hNorm)) {
        isHistPhishing = true;
      }
      if (/inteligencia artificial|\bia\b|nticx|tecnolog|hardware|software|drive|phishing|roa|smart cities|big data/i.test(hNorm)) {
        if (!inferredSubject || inferredSubject === 'inscripciones') inferredSubject = 'nuevas_tecnologias';
        break;
      }
      if (/matematica|ecuacion|porcentaje|fraccion|regla de tres|zaneta|geometria|signos|entero/i.test(hNorm)) {
        if (!inferredSubject || inferredSubject === 'inscripciones') inferredSubject = 'matematicas';
        break;
      }
      if (/lengua|literatura|acentuaci|aguda|grave|esdrujula|tilde|nota formal|evans/i.test(hNorm)) {
        if (!inferredSubject || inferredSubject === 'inscripciones') inferredSubject = 'lengua';
        break;
      }
      if (/natural|biolog|celula|procariota|eucariota|ecosistema|mundaca|salud sexual|esi|nutricion/i.test(hNorm)) {
        if (!inferredSubject || inferredSubject === 'inscripciones') inferredSubject = 'ciencias_naturales';
        break;
      }
      if (/social|constitucion|art 14|derecho laboral|democracia/i.test(hNorm)) {
        if (!inferredSubject || inferredSubject === 'inscripciones') inferredSubject = 'ciencias_sociales';
        break;
      }
      if (/ingles|english|to be/i.test(hNorm)) {
        if (!inferredSubject || inferredSubject === 'inscripciones') inferredSubject = 'ingles';
        break;
      }
      if (/ed fisica|educacion fisica|salud|ergonomia/i.test(hNorm)) {
        if (!inferredSubject || inferredSubject === 'inscripciones') inferredSubject = 'educacion_fisica';
        break;
      }
      if (/edi|plataforma|algoritmo/i.test(hNorm)) {
        if (!inferredSubject || inferredSubject === 'inscripciones') inferredSubject = 'edi_plataformas';
        break;
      }
      if (/matricula|inscripcion|requisito|inscribir|anotar/i.test(hNorm)) {
        if (!inferredSubject) inferredSubject = 'inscripciones';
        break;
      }
    }
  }

  // Thematic detection
  const directNticx = /tecnolog|nticx|hardware|software|periferico|computadora|drive|nube|phishing|contraseñ|roa|inteligencia artificial|\bia\b|ciudades inteligentes|smart cities|big data/i.test(normQuery);
  const directMath = /matematica|ecuacion|porcentaje|regla de tres|fraccion|perimetro|area|geometria|signos|entero|zaneta/i.test(normQuery);
  const directLengua = /lengua|literatura|lectura|comprension|acentuaci|aguda|grave|esdrujula|tilde|nota formal|conector|paratexto|evans/i.test(normQuery);
  const directCsNat = /natural|biolog|celula|procariota|eucariota|ecosistema|biotico|abiotico|materia|estado|mezcla|mundaca/i.test(normQuery);
  const directCsSoc = /social|constitucion|art 14|derecho laboral|democracia/i.test(normQuery);
  const directIngles = /ingles|english|to be|saludo/i.test(normQuery);
  const directEdFis = /ed fisica|educacion fisica|salud|ergonomia|postura|pausa activa/i.test(normQuery);
  const directEdi = /edi|plataforma|algoritmo/i.test(normQuery);
  const directTeachers = /quienes son los profesores|quienes son los docentes|nomina de profesores|nomina docente|profesores de la escuela|equipo docente/i.test(normQuery);
  const directHorarios = /horario|atencion|cuando atiende|abierto|turno/i.test(normQuery);
  const directTramites = /constancia|alumno regular|certificado|pase|equivalencia|tramite|justificativo/i.test(normQuery);
  const directMatricula = /matricula|inscripcion|inscribir|requisito|anotar|vacante|guemes/i.test(normQuery);
  const isGreeting = /^(hola|buenas|buen dia|buenas tardes|buenas noches|que tal|saludos|quien sos)/i.test(normQuery);

  const isNticx = directNticx || ((isSimplifyReq || isExerciseReq) && inferredSubject === 'nuevas_tecnologias');
  const isMath = directMath || ((isSimplifyReq || isExerciseReq) && inferredSubject === 'matematicas');
  const isLengua = directLengua || ((isSimplifyReq || isExerciseReq) && inferredSubject === 'lengua');
  const isCsNat = directCsNat || ((isSimplifyReq || isExerciseReq) && inferredSubject === 'ciencias_naturales');
  const isCsSoc = directCsSoc || ((isSimplifyReq || isExerciseReq) && inferredSubject === 'ciencias_sociales');
  const isIngles = directIngles || ((isSimplifyReq || isExerciseReq) && inferredSubject === 'ingles');
  const isEdFis = directEdFis || ((isSimplifyReq || isExerciseReq) && inferredSubject === 'educacion_fisica');
  const isEdi = directEdi || ((isSimplifyReq || isExerciseReq) && inferredSubject === 'edi_plataformas');

  const isIaQuery = /inteligencia artificial|\bia\b/i.test(normQuery) || ((isSimplifyReq || isExerciseReq) && isHistIa);
  const isHwSwQuery = /hardware|software/i.test(normQuery) || ((isSimplifyReq || isExerciseReq) && isHistHwSw);
  const isPhishingQuery = /phishing|contraseñ|estafa|seguridad digital/i.test(normQuery) || ((isSimplifyReq || isExerciseReq) && isHistPhishing);

  // Document selection
  let selectedDoc: SyncedDoc;
  if (directTeachers) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-docentes-nomina')!;
  } else if (isMath) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-matematicas')!;
  } else if (isNticx) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-nticx')!;
  } else if (isLengua) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-lengua')!;
  } else if (isCsNat) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-cs-naturales')!;
  } else if (isCsSoc) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-cs-sociales')!;
  } else if (isIngles) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-ingles')!;
  } else if (isEdFis) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-ed-fisica')!;
  } else if (isEdi) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-edi-plataformas')!;
  } else if (directHorarios) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-horarios-sec')!;
  } else if (directTramites) {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-tramites-cert')!;
  } else {
    selectedDoc = KNOWLEDGE_DOCUMENTS.find(d => d.id === 'doc-mat-2027')!;
  }

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
      const systemInstruction = `
Eres EMALBOT, el asistente pedagógico y virtual oficial de la Escuela Municipal de Aprendizaje Laboral N° 2702 (EMAL), Güemes 710.
EMAL es una escuela nocturna de Educación de Jóvenes y Adultos (EPJA) con turno de 19:15 a 22:15 hs.

PERSONALIDAD Y TONO DE EMALBOT (PARTE FUNDAMENTAL):
- Muy amigable, cálido, cercano, empático y paciente. Hablas con voseo argentino natural y afectuoso ("Hola", "Te cuento", "Fijate", "Podés", "Preguntame con confianza").
- Rol pedagógico de acompañamiento: Explicas con mucha claridad y ejemplos de la vida real o laboral, valorando el gran esfuerzo de las personas adultas que estudian trabajando o criando a su familia.
- Si consultan sobre qué es la Inteligencia Artificial (IA): explícala de forma simple y accesible, y cuenta con entusiasmo que en la escuela (en Nuevas Tecnologías con el Prof. Roa Nicolás, Módulo 2) los propios estudiantes formaron parte del desarrollo de EMALBOT con arquitectura RAG para consultar el Drive escolar.
- Si el usuario pide "una explicación más simple", "más fácil" o dice que no entendió: mantente ESTRICTAMENTE en el tema anterior que venían hablando (NO cambies de tema, NO hables de inscripciones ni secretaría a menos que ese fuera el tema). Usa una analogía visual cotidiana bien amigable ("Pensalo de esta forma...").
- No recites el programa completo en listas frías: responde de manera conversacional, amena y pedagógica.

DOCUMENTO OFICIAL RELEVANTE PARA ESTA CONSULTA:
[${selectedDoc.title} | ${selectedDoc.source}]
${selectedDoc.content}
`;

      let promptMsg = rawQuery;
      if (isExerciseReq) {
        promptMsg = `Proponé un ejercicio práctico breve, amigable y puntual de ${selectedDoc.category} con enunciado de la vida diaria, pista útil y solución paso a paso comentada.`;
      } else if (isSimplifyReq) {
        promptMsg = `Explicá de forma súper simple, amigable y con una analogía visual de la vida cotidiana el concepto sobre el que venimos hablando (${selectedDoc.category}): ${rawQuery}`;
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
          maxOutputTokens: 750
        }
      });

      if (response && response.text) {
        finalReply = response.text.trim();
        generationMode = 'gemini-api';
      }
    } catch (aiErr) {
      console.warn('Gemini API call failed, using high-precision local RAG:', aiErr);
    }
  }

  // Friendly Pedagogical Synthesizer (runs when Gemini API is unavailable or fails)
  if (!finalReply) {
    generationMode = 'rag-local-synthesizer';

    if (isGreeting && !isNticx && !isMath && !isLengua && !isCsNat && !directMatricula) {
      finalReply = `¡Hola! 👋 ¡Qué alegría saludarte! Soy **EMALBOT**, el asistente virtual y pedagógico de la **Escuela Municipal de Aprendizaje Laboral N° 2702 (EMAL)**.

Estoy acá para acompañarte en tu trayectoria escolar y ayudarte con:
- 💡 **Explicaciones pedagógicas** claras y amigables sobre tus materias (**Nuevas Tecnologías, Matemáticas, Lengua, Cs. Naturales, etc.**).
- ✏️ **Ejercicios prácticos** y conceptos con ejemplos cotidianos.
- 📋 **Trámites de Secretaría e Inscripciones para Matrícula 2027**.
- 🕒 **Horarios de atención** (Lunes a Viernes de 19:15 a 22:15 hs en Güemes 710).

¿Sobre qué tema te gustaría consultar hoy? ¡Preguntame con confianza!`;
    } else if (isExerciseReq) {
      if (isMath) {
        finalReply = `### ✏️ ¡Vamos a practicar Matemáticas juntos! (Prof. Zaneta Sebastián)\n\n` +
          `¡Hola! Practicar con situaciones de todos los días es la mejor manera de aprender:\n\n` +
          `**Enunciado:**\nFuiste a hacer una compra y un producto tiene un precio de **$12.000**, pero por abonar en efectivo te ofrecen un **15% de descuento**. ¿Cuánto terminás pagando en caja?\n\n` +
          `💡 **Pista amigable:**\nPrimero calculá el valor del descuento multiplicando \`12.000 × 15\` y luego dividí por \`100\`. Después, a los \`$12.000\` iniciales, restale ese valor.\n\n` +
          `---\n**Paso a paso para resolver:**\n1. Descuento obtenido: \`(12.000 × 15) / 100 = $1.800\`.\n2. Total a pagar: \`$12.000 - $1.800 = $10.200\`.\n\n` +
          `¡Excelente! Si querés intentar otro o cambiar los números, avisame y lo resolvemos juntos.`;
      } else if (isLengua) {
        finalReply = `### ✏️ ¡Actividad de práctica de Lengua! (Prof. Evans Erika)\n\n` +
          `¡Hola! Te propongo un ejercicio bien puntual y útil sobre **reglas de acentuación**:\n\n` +
          `**Enunciado:**\nClasificá las siguientes tres palabras según la sílaba donde se acentúan (**Aguda, Grave o Esdrújula**):\n1. *canción*\n2. *árbol*\n3. *matemática*\n\n` +
          `---\n**Solución comentada:**\n1. **Canción:** Es **Aguda** porque se acentúa en la última sílaba (*can-ción*) y lleva tilde porque termina en **N**.\n2. **Árbol:** Es **Grave** porque se acentúa en la penúltima sílaba (*ár-bol*) y lleva tilde porque termina en **L** (no termina en N, S ni vocal).\n3. **Matemática:** Es **Esdrújula** (*ma-te-má-ti-ca*) y las esdrújulas **siempre** llevan tilde sin excepción.\n\n` +
          `¿Cómo te fue con este ejercicio? Si querés, podés pedirme que redactemos una nota formal juntos.`;
      } else if (isNticx) {
        finalReply = `### ✏️ ¡Desafío de Nuevas Tecnologías! (Prof. Roa Nicolás)\n\n` +
          `¡Hola! Vamos con una pregunta práctica para poner en juego lo que aprendemos en clase:\n\n` +
          `**Situación:**\nEn una **Ciudad Inteligente (Smart City)**, ¿cómo se complementan el **Big Data** y la **Inteligencia Artificial (IA)** para mejorar la vida de los vecinos?\n\n` +
          `💡 **Pista:** Pensá en los semáforos, el tránsito o el consumo de energía eléctrica.\n\n` +
          `---\n**Solución comentada:**\n- **Big Data:** Son los millones de datos que registran las cámaras y sensores urbanos a cada minuto (flujo de autos, horarios pico, consumo de luz).\n- **Inteligencia Artificial (IA):** Es el sistema inteligente que analiza esos datos en tiempo real y toma decisiones automáticas: por ejemplo, alargar la luz verde en avenidas congestionadas para que no haya embotellamientos o regular la iluminación pública para ahorrar energía.\n\n` +
          `¡En EMAL aprendemos esto en Módulo 2 para entender la tecnología que ya nos rodea!`;
      } else {
        finalReply = `### ✏️ Ejercicio de Práctica: Ciencias Naturales (Prof. Mundaca Yamila)\n\n` +
          `¡Hola! Un repaso rápido sobre la unidad de los seres vivos:\n\n` +
          `**Enunciado:**\nMencioná al menos una diferencia fundamental entre una **célula vegetal** y una **célula animal**.\n\n` +
          `---\n**Solución comentada:**\nLa **célula vegetal** posee una **pared celular rígida** (que le da estructura firme a la planta) y **cloroplastos** (que contienen clorofila para realizar la fotosíntesis). La célula animal no tiene pared rígida ni cloroplastos.\n\n` +
          `¡Muy bien! Recordá que podés pedirme que te lo explique de forma aún más sencilla si te queda alguna duda.`;
      }
    } else if (isIaQuery) {
      if (isSimplifyReq) {
        finalReply = `¡Hola! Claro que sí, te lo explico de forma súper simple y con un ejemplo de todos los días: 😊

Pensá en la **Inteligencia Artificial (IA)** como un **compañero de estudio incansable**:

Imaginate que tenés que buscar un dato en una biblioteca gigante con 500 libros de apuntes. Si tuvieras que buscarlo vos solo, tardarías días leyendo página por página.

En cambio, un asistente con **Inteligencia Artificial** (como **EMALBOT**) puede leer todas esas páginas en un solo segundo, encontrar el párrafo exacto que necesitás y explicártelo con palabras claras, amables y en tu propio idioma.

💡 **El orgullo de nuestra escuela:**
En la **Escuela N° 2702 EMAL**, en la materia **Nuevas Tecnologías** (Módulo 2 con el **Prof. Roa Nicolás**), ¡los propios estudiantes no solo usamos la IA, sino que formamos parte de su desarrollo! Aprendemos cómo conectar la inteligencia artificial con las carpetas de Google Drive de la escuela para que este asistente responda a las dudas de toda la comunidad.

¿Se entendió bien la idea o querés que lo veamos con otro ejemplo de la vida diaria?`;
      } else {
        finalReply = `¡Hola! Qué excelente pregunta. Te cuento con mucho gusto y de forma bien clara:

La **Inteligencia Artificial (IA)** es una rama de la informática que permite a las computadoras procesar información, aprender de ejemplos y ayudarnos a realizar tareas que antes solo hacíamos las personas (como comprender textos, responder consultas, resumir apuntes o traducir idiomas).

💡 **¿Cómo la vivimos en la Escuela N° 2702 EMAL?**
En nuestra escuela, en la materia **Nuevas Tecnologías** (Módulo 2, a cargo del **Prof. Roa Nicolás**), la IA no es una teoría lejana de película, ¡es una práctica real de los estudiantes!
- **Desarrollo de EMALBOT:** Los propios estudiantes participaron activamente en la creación, prueba y ajuste de este asistente virtual.
- **Arquitectura RAG:** Aprendemos cómo la IA se conecta con las carpetas de Google Drive oficiales de la institución para consultar documentos reales y brindar respuestas seguras y precisas.
- **Formación con futuro:** Buscamos que cada estudiante de EMAL adquiera habilidades digitales sólidas para el trabajo, el estudio y la vida cotidiana.

¿Te gustaría que te cuente un ejemplo de cómo funciona en el día a día o que te proponga un ejercicio para practicar?`;
      }
    } else if (isHwSwQuery) {
      if (isSimplifyReq) {
        finalReply = `¡Hola! Te lo explico con la regla más fácil del mundo:

- 🖥️ **Hardware:** Es todo lo que podés **tocar físicamente** con las manos (el celular, la pantalla, el teclado, el chip interno o el cargador).
- 📱 **Software:** Es lo que **no se puede tocar**, pero hace que el equipo funcione (WhatsApp, Facebook, Google Drive, los juegos o el sistema operativo).

**Analogía simple:** Pensá en un libro: las hojas de papel y la tinta son el *hardware*, y el cuento o la historia escrita en las hojas es el *software*. ¡Uno no sirve sin el otro!

En Nuevas Tecnologías (Módulo 1 con el Prof. Roa Nicolás) aprendemos a cuidar ambos para trabajar tranquilos. 😊`;
      } else {
        finalReply = `¡Hola! Te cuento con mucho gusto la diferencia entre ambos conceptos:

En la materia **Nuevas Tecnologías** (Módulo 1, Prof. Roa Nicolás), trabajamos los dos componentes fundamentales de cualquier computadora o celular:

1. **Hardware (la parte física):**
   Es todo lo tangible que podemos ver y tocar. Se divide en:
   - *Unidad Central (CPU y memoria RAM)*: El cerebro del equipo.
   - *Periféricos de Entrada*: Teclado, mouse, micrófono, cámara.
   - *Periféricos de Salida*: Pantalla, parlantes, impresora.
   - *Almacenamiento*: Disco rígido, memorias pendrive.

2. **Software (la parte lógica):**
   Son los programas e instrucciones que le dicen al hardware qué hacer:
   - *Sistemas Operativos*: Android en celulares, Windows o Linux en PC.
   - *Aplicaciones de Ofimática*: Procesadores de texto, planillas de cálculo y presentaciones.
   - *Nube y Navegadores*: Google Drive institucional y navegadores web.

¿Te gustaría que hagamos un breve ejercicio para identificar hardware y software de tu celular?`;
      }
    } else if (isPhishingQuery) {
      finalReply = `¡Hola! Este es un tema súper importante para cuidar tu seguridad y la de tu familia:

El **Phishing** es una técnica de engaño donde delincuentes digitales se hacen pasar por personas o entidades de confianza (como tu banco, Mercado Pago, Correo Argentino o la propia escuela) mediante mensajes de WhatsApp, correos o enlaces falsos, con el objetivo de robarte contraseñas o dinero.

🛡️ **Consejos clave que enseñamos en EMAL (Prof. Roa Nicolás):**
1. **Nunca compartas códigos por SMS ni contraseñas:** Ninguna institución te va a pedir tu clave por teléfono o mensaje.
2. **Revisá los enlaces con atención:** Si te llega un link raro o sospechoso, no hagas clic.
3. **Contraseñas seguras:** Usá combinaciones de letras, números y símbolos, y no uses la misma para todo.

¡Cuidar nuestra identidad digital es un derecho y una herramienta fundamental que aprendemos en clase!`;
    } else if (/quien es el profesor de nuevas tecnologias|quien ensena nuevas tecnologias|profesor de nuevas tecnologias/i.test(normQuery)) {
      finalReply = `¡Hola! Te cuento: el profesor de **Nuevas Tecnologías** (Módulos 1 y 2) es el **Prof. Roa Nicolás**.

📚 **Lo que aprendemos en su materia:**
- **Módulo 1:** Alfabetización digital (Hardware y Software), programas de oficina (procesadores de texto, planillas de cálculo y presentaciones), uso de Google Drive institucional y seguridad digital para evitar fraudes como el Phishing.
- **Módulo 2:** **Inteligencia Artificial (IA)** (con desarrollo activo de los propios estudiantes en el proyecto **EMALBOT**), **Ciudades Inteligentes (Smart Cities)**, **Big Data** y comunicación digital en red.

Es una materia pensada para que adquieras herramientas tecnológicas prácticas para tu trabajo y tu día a día. ¿Querés que profundicemos en algún tema en particular?`;
    } else if (/quien es el profesor de matematicas|quien ensena matematicas|profesor de matematicas/i.test(normQuery)) {
      finalReply = `¡Hola! El profesor a cargo de **Matemáticas** (Módulos 1 a 4) es el **Prof. Zaneta Sebastián**.

📐 **Contenidos principales de la materia:**
- **Números Enteros:** Operaciones, propiedades y regla de los signos (\`+ · + = +\`, \`- · - = +\`, \`+ · - = -\`).
- **Números Racionales:** Fracciones, decimales y porcentajes aplicados a compras, recibos de sueldo y descuentos diarios.
- **Álgebra:** Ecuaciones de 1er grado con una incógnita (\`2x + 10 = 50\`).
- **Geometría y Estadística:** Cálculo de perímetro y área, uso de regla y escuadra, e interpretación de tablas y gráficos.

El profe siempre busca que la matemática se entienda a partir de situaciones reales de la vida cotidiana. ¿Te gustaría que practiquemos algún tema?`;
    } else if (/quien es la profesora de lengua|profesora de lengua|quien ensena lengua/i.test(normQuery)) {
      finalReply = `¡Hola! La profesora de **Lengua y Literatura** (Módulos 1 a 4) es la **Prof. Evans Erika**.

📖 **Contenidos principales de su materia:**
- **Comprensión y Producción de Textos:** Ideas principales, resúmenes y tipos de texto (narrativo, expositivo, argumentativo).
- **Herramientas de Comunicación:** Redacción formal de notas para presentar en el trabajo o la escuela (con fecha, destinatario, cuerpo claro y firma).
- **Normativa:** Reglas prácticas de acentuación (palabras agudas, graves y esdrújulas) y signos de puntuación.
- **Identidad y Literatura:** Literatura latinoamericana y aproximación a los saberes de la cultura mapuche y la diversidad cultural de nuestra región.

¿Te gustaría que repasemos algún concepto de acentuación o redacción?`;
    } else if (/quien es la profesora de ciencias naturales|profesora de cs naturales|quien ensena ciencias naturales/i.test(normQuery)) {
      finalReply = `¡Hola! La profesora de **Ciencias Naturales** (Módulos 1 a 4) es la **Prof. Mundaca Yamila**.

🌱 **Contenidos principales de la materia:**
- **Biología y Seres Vivos:** Estructura de la célula (vegetal y animal), niveles de organización biológica y cadenas tróficas.
- **Medio Ambiente:** Ecosistemas de la Patagonia, factores bióticos y abióticos, y cuidado ambiental.
- **Física y Química básica:** Estados de la materia (sólido, líquido, gaseoso) y mezclas homogéneas y heterogéneas.
- **Salud Comunitaria:** Salud Sexual y Reproductiva (ESI), prevención de adicciones y pautas de nutrición saludable.

La materia se enfoca en el cuidado de la salud personal y el respeto por nuestro entorno natural. ¿Tenés alguna duda puntual sobre estos temas?`;
    } else if (directTeachers) {
      finalReply = `¡Hola! Te comparto con orgullo el **Equipo Docente** de la **Escuela N° 2702 EMAL**:

- 💻 **Nuevas Tecnologías (Módulos 1 y 2):** Prof. Roa Nicolás
- 📐 **Matemáticas (Módulos 1 a 4):** Prof. Zaneta Sebastián
- 📚 **Lengua y Literatura (Módulos 1 a 4):** Prof. Evans Erika
- 🌱 **Ciencias Naturales (Módulos 1 a 4):** Prof. Mundaca Yamila
- 🌍 **Inglés (Módulos 1 a 4):** Equipo Docente de Inglés
- 🏛️ **Ciencias Sociales (Módulos 1 a 4):** Equipo Docente de Cs. Sociales
- 🏃 **Educación Física y Salud (Módulos 1 a 4):** Equipo Docente de Ed. Física
- 🌐 **EDI - Plataformas Digitales (Módulos 1 y 2):** Equipo Docente de EDI

Podés consultarme sobre el programa de cualquiera de estas materias o pedirme explicaciones sencillas sobre sus contenidos.`;
    } else if (isMath) {
      if (isSimplifyReq) {
        finalReply = `¡Hola! Te explico las matemáticas que vemos en EMAL con un ejemplo simple del día a día:

Pensá en una **ecuación** (\`2x + 10 = 50\`) como una balanza en equilibrio o la cuenta del almacén:
- Sabés que compraste 2 paquetes de galletitas iguales (\`2x\`) y un paquete de fideos que costó $10.
- Si en total pagaste $50, para saber cuánto costó cada paquete de galletitas solo tenés que restarle los $10 al total ($40) y dividirlo por 2. ¡Cada paquete costó $20 (\`x = 20\`)!

De la misma manera trabajamos con **porcentajes**: calcular un 10% de descuento es simplemente correr la coma un lugar o dividir por 10.

El **Prof. Zaneta Sebastián** siempre enseña la matemática conectada con la vida real y el bolsillo de cada familia. ¿Querés que veamos otro ejemplo?`;
      } else {
        finalReply = `¡Hola! En la Escuela N° 2702 EMAL, el **Prof. Zaneta Sebastián** acompaña a los estudiantes en **Matemáticas** con un enfoque muy claro y práctico para la vida diaria:

- **Módulo 1:** Números enteros (operaciones combinadas y regla de signos), números racionales (fracciones y porcentajes cotidianos), ecuaciones sencillas de primer grado (\`2x + 10 = 50\`) y geometría (perímetros y áreas).
- **Módulo 2:** Figuras y cuerpos geométricos, sistema sexagesimal (ángulos y tiempo), ejes cartesianos y estadística básica (lectura de gráficos y tablas de datos).

¿Te gustaría que resolvamos un ejercicio juntos o que te explique algún tema puntual de forma sencilla?`;
      }
    } else if (isNticx) {
      if (isSimplifyReq) {
        finalReply = `¡Hola! Te resumo **Nuevas Tecnologías** (Prof. Roa Nicolás) en tres ideas bien prácticas:

1. **Tu celu o PC (Hardware y Software):** Aprendés a usar el teclado, la pantalla y los programas de oficina para armar una nota de trabajo, una planilla de gastos o un currículum prolijo.
2. **Tu información segura en la nube:** Usamos Google Drive institucional para que tus fotos y apuntes queden guardados en Internet sin llenarte la memoria del celular, y aprendés a no caer en estafas por WhatsApp (Phishing).
3. **Inteligencia Artificial real (EMALBOT):** ¡La creamos y probamos en la propia escuela! Es como tener un compañero que te ayuda a estudiar y buscar información al instante.

¿Sobre cuál de estos tres puntos te gustaría que charlemos un ratito más?`;
      } else {
        finalReply = `¡Hola! En la materia **Nuevas Tecnologías** (Ciclo Básico, con el **Prof. Roa Nicolás**), trabajamos herramientas digitales esenciales para el trabajo y el estudio:

- **Módulo 1:** Alfabetización digital (Hardware y Software), ofimática completa (procesador de textos, planillas de cálculo y presentaciones), almacenamiento seguro en Google Drive institucional y prevención de engaños digitales (Phishing).
- **Módulo 2:** **Inteligencia Artificial** (con el proyecto EMALBOT desarrollado y validado en la escuela), **Ciudades Inteligentes (Smart Cities)**, **Big Data** y comunicación en redes.

Es una de las materias más participativas del secundario de adultos. ¿Qué tema te interesa conocer más a fondo?`;
      }
    } else if (isLengua) {
      if (isSimplifyReq) {
        finalReply = `¡Hola! En **Lengua** (Prof. Evans Erika) vemos cosas súper útiles para el trabajo y la vida diaria:

- **Para que nunca dudes de una tilde:**
  * Si la palabra suena con fuerza al final y termina en N, S o Vocal, lleva tilde (como *canción* o *papá*).
  * Si suena con fuerza en el medio y NO termina en N, S ni vocal, lleva tilde (como *árbol* o *fácil*).
  * Si suena con fuerza antes, ¡siempre lleva tilde! (como *médico* o *música*).
- **Para hacer trámites formales:**
  Aprendemos a escribir una **Nota Formal** para pedir permisos en el trabajo o certificados en la escuela con encabezado claro, saludo respetuoso y firma.

¿Querés que practiquemos con alguna palabra o que armemos el borrador de una nota?`;
      } else {
        finalReply = `¡Hola! En **Lengua y Literatura** (Ciclo Básico, con la **Prof. Evans Erika**), trabajamos la palabra como herramienta de expresión y ejercicio de derechos:

- **Módulo 1:** Comprensión lectora de textos reales, redacción de notas formales con estructura oficial, reglas de acentuación (agudas, graves, esdrújulas) y lectura de literatura latinoamericana con mirada social.
- **Módulo 2:** Análisis crítico de medios y publicidad, detección de discursos discriminatorios, diversidad de género y revalorización de la cultura mapuche y la identidad regional.

¿Te gustaría que revisemos algún tema de acentuación o redacción formal?`;
      }
    } else if (isCsNat) {
      if (isSimplifyReq) {
        finalReply = `¡Hola! En **Ciencias Naturales** (Prof. Mundaca Yamila) aprendemos cómo funciona la vida y nuestro propio cuerpo:

- Pensá en la **célula** como un pequeño ladrillo vivo: cada parte de nuestro cuerpo está formada por millones de estos ladrillos que respiran, se nutren y trabajan en equipo.
- Vemos los **ecosistemas de nuestra Patagonia**, aprendiendo a cuidar el agua, la tierra y los seres vivos que comparten la región con nosotros.
- Charlamos sobre **salud, prevención de adicciones y nutrición**, para que sepamos qué nutrientes necesita nuestro cuerpo para estar con energía.

¿Te gustaría que profundicemos en la célula o en algún tema de salud comunitaria?`;
      } else {
        finalReply = `¡Hola! En **Ciencias Naturales** (Ciclo Básico, con la **Prof. Mundaca Yamila**), los contenidos abarcan la biología, la ecología y la salud integral:

- **Módulo 1:** Características de los seres vivos, niveles de organización celular, cadenas tróficas y ecosistemas patagónicos, y estados de la materia.
- **Módulo 2:** Procesos de desarrollo humano, Educación Sexual Integral (ESI), prevención de adicciones y pautas de nutrición saludable.

Es una materia pensada para comprender nuestro entorno y cuidar nuestro bienestar. ¿Tenés alguna consulta puntual sobre el programa?`;
      }
    } else if (directHorarios) {
      finalReply = `¡Hola! Te comparto con gusto los **Horarios Oficiales** de la **Escuela N° 2702 EMAL** (Güemes 710):

- 🏫 **Atención de Secretaría y Preceptoría:** Lunes a Viernes de **19:15 a 22:15 hs**.
- 🌙 **Horario de Cursada (Turno Noche):** Lunes a Viernes de **19:15 a 22:15 hs**.
- 💼 **Tolerancia por razones laborales:** Sabemos que muchos estudiantes trabajan; presentando tu constancia laboral en Secretaría, se contempla el ingreso adecuado a tu horario de salida del trabajo.

¡Las puertas de la escuela están siempre abiertas para acompañarte!`;
    } else if (directTramites) {
      finalReply = `¡Hola! Te cuento cómo realizar los trámites más frecuentes en Secretaría (Lunes a Viernes de 19:15 a 22:15 hs):

- 📄 **Constancia de Alumno Regular:** Se solicita en Secretaría con **24 a 48 hs de anticipación**. Te sirve para presentar en tu trabajo, asignaciones familiares o boleto educativo.
- 📝 **Certificado de Examen:** Se entrega en el momento en que rendís una evaluación para que puedas justificar la jornada laboral ante tu empleador.
- 🔄 **Pases y Equivalencias:** Si venís de otra escuela secundaria de adultos, presentá tu analítico parcial legalizado en Secretaría para reconocer las materias aprobadas.

¿Necesitás gestionar alguno de estos documentos en estos días?`;
    } else {
      if (isSimplifyReq) {
        finalReply = `¡Hola! Anotarte en la **Escuela N° 2702 EMAL** es súper fácil y son solo dos pasos:

1. **Desde tu celular:** Completás este formulario online con tus datos básicos: [Formulario de Preinscripción Matrícula 2027](https://docs.google.com/forms/d/e/1FAIpQLScIxCNeBE2veAN4dWndcrJONM8sUaOh7UMfgRuNc7j6NOUsgw/viewform?usp=sf_link).
2. **De manera presencial:** Llevás fotocopia de tu DNI, partida de nacimiento, certificado de estudios primarios (o pase de secundaria) y 2 fotos a la escuela (**Güemes 710**) de **Lunes a Viernes de 19:15 a 22:00 hs**.

¡Es gratuito y pensado para personas adultas que quieren terminar su secundario! Te esperamos con los brazos abiertos.`;
      } else {
        finalReply = `¡Hola! ¡Qué gran decisión dar este paso! Te doy la bienvenida a la información de **Matrícula 2027** para terminar tus estudios secundarios en la **Escuela Municipal de Aprendizaje Laboral N° 2702 (EMAL)**:

📋 **Paso 1 · Preinscripción Online:**
Completá el formulario digital desde tu celular o computadora:
👉 [Formulario de Preinscripción Matrícula 2027](https://docs.google.com/forms/d/e/1FAIpQLScIxCNeBE2veAN4dWndcrJONM8sUaOh7UMfgRuNc7j6NOUsgw/viewform?usp=sf_link)

📁 **Paso 2 · Documentación a presentar (mayores de 18 años):**
- Fotocopia de DNI (frente y dorso).
- Certificado de estudios primarios completos o analítico parcial / pase de secundaria anterior.
- Fotocopia de Partida de Nacimiento.
- 2 fotos carnet 4x4.

📍 **Lugar y Horarios de entrega:**
En la sede de la escuela: **Güemes 710**, de **Lunes a Viernes de 19:15 a 22:00 hs** (Atención general de Secretaría hasta las 22:15 hs).

¡En EMAL te acompañamos en cada etapa de tu aprendizaje! ¿Tenés alguna duda sobre los requisitos?`;
      }
    }
  }

  const sourcesUsed = [`${selectedDoc.title} (${selectedDoc.source})`];

  const suggestedFollowUps = (isMath || isNticx || isLengua || isCsNat || isCsSoc || isIngles || isEdFis || isEdi)
    ? [
        `¿Podés proponerme un ejercicio de práctica de ${selectedDoc.category}?`,
        'Explicar este concepto de forma más sencilla',
        '¿Quién es el profesor a cargo de esta materia?'
      ]
    : [
        '¿Cuáles son los requisitos para Matrícula 2027?',
        '¿En qué horario atiende Secretaría?',
        '¿Cómo solicito una constancia de alumno regular?'
      ];

  const processingMs = Math.max(8, Date.now() - startTime);

  return res.status(200).json({
    text: finalReply,
    sources: sourcesUsed,
    suggestedFollowUps,
    ragTrace: {
      keywords: [selectedDoc.category.toLowerCase()],
      totalDocsScanned: KNOWLEDGE_DOCUMENTS.length,
      driveDocsScanned: 1,
      matchedDocuments: [{
        id: selectedDoc.id,
        title: selectedDoc.title,
        sourceType: 'knowledge_base' as const,
        category: selectedDoc.category,
        score: 100,
        matchedTerms: [selectedDoc.category.toLowerCase()],
        excerpt: selectedDoc.content.slice(0, 160) + '...'
      }],
      generationMode,
      processingMs
    },
    timestamp: new Date().toISOString()
  });
}
