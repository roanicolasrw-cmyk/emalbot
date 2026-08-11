import { KnowledgeDocument } from '../types';

export const INSTITUTIONAL_INFO = {
  schoolName: "Escuela N° 2702 EMAL",
  fullTitle: "Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos N° 2702",
  shift: "Turno Vespertino / Noche (18:30 hs a 22:15 hs)",
  secretariaHours: "Lunes a Viernes de 18:30 hs a 21:30 hs",
  motto: "Acompañamiento educativo y formación autónoma para adultos",
  disclaimer: "EMALBOT brinda información de orientación y acompañamiento. No toma decisiones administrativas finales (como adjudicación de vacantes) ni reemplaza las evaluaciones o explicaciones docentes."
};

export const KNOWLEDGE_BASE: KnowledgeDocument[] = [
  // --- ÁREA INSTITUCIONAL ---
  {
    id: "inst-01",
    title: "Requisitos de Inscripción y Documentación - Escuela N° 2702 EMAL",
    area: "institucional",
    subject: "inscripciones",
    category: "Inscripciones",
    content: `Requisitos generales para inscripción de nuevos estudiantes en la Escuela N° 2702 EMAL:
1. Ser mayor de 18 años (o cumplir los 18 años durante el ciclo lectivo vigente).
2. Fotocopia de DNI (frente y dorso).
3. Certificado de Estudios Primarios completos (o Pase / Analítico incompleto de escuela secundaria anterior si corresponde).
4. Partida de Nacimiento (fotocopia).
5. 2 Fotos carnet 4x4.
6. Ficha de salud y planilla de inscripción completa (se retira en Fotocopiadora/Secretaría).
7. Folio transparente tamaño oficio.

Período de inscripción: Las inscripciones ordinarias se realizan habitualmente en Diciembre y Febrero/Marzo. Existen inscripciones extraordinarias a mitad de año para el segundo cuatrimestre según disponibilidad.`,
    source: "Manual Institucional de Secretaría EMAL",
    keywords: ["requisitos", "inscripcion", "documentos", "dni", "certificado primario", "edad", "adultos"]
  },
  {
    id: "inst-02",
    title: "Criterios de Vacantes y Adjudicación",
    area: "institucional",
    subject: "vacantes",
    category: "Vacantes",
    content: `Información sobre Vacantes en Escuela EMAL N° 2702:
Las vacantes se asignan priorizando:
1. Estudiantes regulares con continuidad en la institución.
2. Adultos residentes en la zona de influencia de la escuela.
3. Personas con responsabilidades laborales o familiares que requieran el turno vespertino/noche.
4. Orden de presentación de documentación completa.

IMPORTANTE: EMALBOT orienta sobre los requisitos y el procedimiento, pero LA ADJUDICACIÓN DEFINITIVA DE LA VACANTE ES RESPONSABILIDAD EXCLUSIVA DE LA DIRECCIÓN Y SECRETARÍA DE LA ESCUELA.`,
    source: "Reglamento Interno EMAL",
    keywords: ["vacantes", "cupo", "prioridad", "adjudicacion", "secretaria", "direccion"]
  },
  {
    id: "inst-03",
    title: "Trámites, Certificados y Solicitudes en Secretaría",
    area: "institucional",
    subject: "tramites",
    category: "Trámites",
    content: `Trámites habituales en Secretaría de Escuela N° 2702 EMAL:
- **Constancia de Alumno Regular**: Se solicita con 24/48hs de anticipación en Secretaría o mediante el formulario escolar. Útil para presentar en trabajos, asignaciones o boleto educativo.
- **Certificado de Examen**: Se emite el día que el estudiante rinde una evaluación o examen para presentar como justificación laboral.
- **Pases y Equivalencias**: Para estudiantes que provienen de otras escuelas de adultos (EPJA / EEMPA / CENS). Debe presentarse el Analítico Parcial legalizado.
- **Justificación de Inasistencias por Trabajo o Enfermedad**: Presentar certificado médico o constancia laboral dentro de las 72hs de ocurrida la falta.`,
    source: "Guía de Trámites Escolares EMAL",
    keywords: ["tramites", "certificado", "alumno regular", "examen", "justificativo", "trabajo", "pase"]
  },
  {
    id: "inst-04",
    title: "Horarios de Clase y Atención de Secretaría",
    area: "institucional",
    subject: "horarios",
    category: "Horarios",
    content: `Horarios de Escuela N° 2702 EMAL:
- **Atención de Secretaría y Preceptoría**: Lunes a Viernes de 18:30 hs a 21:30 hs.
- **Horario de Clases Presenciales**: Lunes a Viernes de 18:30 hs a 22:15 hs.
- **Recreos**: Primer recreo 19:50 hs - Segundo recreo 21:10 hs.
- **Días de consulta tutorías**: Según cada espacio curricular (consultar cartelera en patio o entorno digital).`,
    source: "Organigrama Horario EMAL 2026",
    keywords: ["horarios", "secretaria", "clases", "turno noche", "vespertino", "recreo"]
  },
  {
    id: "inst-05",
    title: "Preguntas Frecuentes de Estudiantes Nuevos y Regulares",
    area: "institucional",
    subject: "secretaria",
    category: "Preguntas Frecuentes",
    content: `Preguntas Frecuentes - EMAL N° 2702:
Q: ¿Puedo cursar si trabajo por turnos rotativos?
A: Sí, la modalidad de educación de adultos (EMAL) contempla la flexibilidad horaria con acompañamiento de módulos, materiales en Google Drive y tutorías. Comunicá tu situación al preceptor.

Q: ¿Cuánto dura el plan de estudios?
A: El plan está estructurado por Módulos Cuatrimestrales. Según tu nivel de ingreso (certificados previos o equivalencias), podés completar el nivel secundario en 2 o 3 años.

Q: ¿Qué pasa si me ausento por motivos laborales?
A: Siempre avisá a tu preceptor/a y presentá la constancia laboral. Podés continuar con los trabajos prácticos subidos a la plataforma digital y Google Drive.`,
    source: "FAQ Comunidad Educativa EMAL",
    keywords: ["faq", "preguntas frecuentes", "trabajo rotativo", "duracion", "inasistencias", "modulos"]
  },
  {
    id: "inst-06",
    title: "Equipo Docente y Profesores por Materia - Escuela N° 2702 EMAL",
    area: "institucional",
    subject: "docentes",
    category: "Equipo Docente",
    content: `Equipo Docente y Profesores por Materia - Escuela N° 2702 EMAL:
- **Nuevas Tecnologías (NTICx)**: Profesores del Equipo de NTICx y Plataformas Digitales (@escuela2702emal.edu.ar). Espacio curricular dictado en Módulos 1 y 2.
- **Matemáticas**: Profesores del Departamento de Matemáticas (Módulos 1, 2, 3 y 4).
- **Lengua y Literatura**: Profesores del Departamento de Lengua (Módulos 1, 2, 3 y 4).
- **Educación Física y Salud**: Profesores del Área de Ed. Física y Salud (Módulos 1, 2, 3 y 4).
- **Ciencias Sociales**: Profesores del Departamento de Cs. Sociales (Módulos 1, 2, 3 y 4).
- **Ciencias Naturales**: Profesores del Área de Cs. Naturales (Módulos 1, 2, 3 y 4).
- **EDI Plataformas Digitales**: Profesores del Espacio EDI (Módulos 1 y 2).

Para consultar el profesor a cargo de tu comisión o comisión específica, podés consultar en Preceptoría y Secretaría durante el horario del turno noche (18:30 a 21:30 hs) o revisar la carátula de los trabajos prácticos subidos a la carpeta de Google Drive de la materia.`,
    source: "Nómina Institucional de Docentes EMAL",
    keywords: ["profesor", "profesores", "docente", "docentes", "quien es el profesor", "profesor de nuevas tecnologias", "quien era el profesor", "quien enseña", "equipo docente"]
  },

  // --- ÁREA EDUCATIVA ---
  {
    id: "edu-mat-01",
    title: "Matemáticas: Ecuaciones de Primer Grado y Porcentajes",
    area: "educativa",
    subject: "matematicas",
    category: "Matemáticas",
    content: `Contenidos de Matemáticas para Educación de Adultos:
1. **Ecuaciones de Primer Grado**: Una ecuación es una igualdad donde hay un valor desconocido (incógnita 'x').
   - Regla de pasaje: Lo que está sumando pasa restando; lo que multiplica pasa dividiendo.
   - Ejemplo práctico: 2x + 10 = 50 ➔ 2x = 50 - 10 ➔ 2x = 40 ➔ x = 40 / 2 ➔ x = 20.
   - Aplicación cotidiana: Calcular cuántas horas trabajaste si cobraste $50 con un viático fijo de $10 y $2 por hora.

2. **Porcentajes y Regla de Tres Simple**:
   - Para calcular un descuento del 15% sobre $8000: (8000 * 15) / 100 = $1200 de descuento.
   - Total a pagar: $8000 - $1200 = $6800.`,
    source: "Carpeta de Matemáticas - Módulo 2 EMAL",
    keywords: ["matematicas", "ecuaciones", "porcentajes", "regla de tres", "ejercicios", "incognita"]
  },
  {
    id: "edu-nt-01",
    title: "Nuevas Tecnologías: Conceptos Básicos, Equipo Docente y Ciudadanía Digital",
    area: "educativa",
    subject: "nuevas_tecnologias",
    category: "Nuevas Tecnologías",
    content: `Nuevas Tecnologías de la Información y la Comunicación (NTICx) - Módulos 1 y 2:
- **Equipo Docente / Profesores**: Profesores del Equipo de NTICx y Plataformas Digitales (@escuela2702emal.edu.ar). Acompañan las clases presenciales del turno noche y la carga de guías en la carpeta de Google Drive.
- **Hardware vs Software**:
  - Hardware: La parte física que podés tocar (teclado, pantalla, procesador, memoria RAM, celular).
  - Software: Los programas, aplicaciones y sistemas operativos que no se pueden tocar físicamente (WhatsApp, Android, Windows, navegador Web).
- **Ciudadanía Digital y Seguridad**:
  - Protección de datos personales y contraseñas seguras (usar letras, números y símbolos).
  - Identificación de Phishing (estafas virtuales por correo o SMS): Nunca compartir claves ni bancarias.
  - La nube (Cloud Computing): Almacenar archivos en Google Drive para acceder desde cualquier dispositivo.`,
    source: "Módulo NTICx - Equipo Docente EMAL N° 2702",
    keywords: ["nuevas tecnologias", "profesor", "docente", "profesores", "profesor de nuevas tecnologias", "quien es el profesor", "hardware", "software", "seguridad digital", "phishing", "nube", "drive"]
  },
  {
    id: "edu-lengua-01",
    title: "Lengua: Comprensión Lector, Redacción Formal y Cohesión",
    area: "educativa",
    subject: "lengua",
    category: "Lengua y Literatura",
    content: `Herramientas de Lengua y Comunicación para Adultos:
- **Redacción de Notas Formales**: Estructura de una nota dirigida a una autoridad o institución:
  1. Lugar y Fecha (ej: Comodoro Rivadavia, 11 de Agosto de 2026).
  2. Destinatario y Cargo (ej: A la Sra. Directora de la Escuela N° 2702 EMAL).
  3. Encabezado de cortesía (De mi mayor consideración:).
  4. Cuerpo de la nota: Explicación clara y respetuosa del motivo o solicitud.
  5. Salida de cortesía y Firma / Aclaración / DNI / Teléfono.
- **Conectores y Cohesión**: Usar conectores para unir ideas (sin embargo, por lo tanto, además, en consecuencia, debido a que).`,
    source: "Guía de Lengua y Redacción EMAL",
    keywords: ["lengua", "comprension", "nota formal", "carta", "conectores", "redaccion"]
  },
  {
    id: "edu-ef-01",
    title: "Educación Física y Salud: Ergonomía, Hábitos Saludables y Bienestar",
    area: "educativa",
    subject: "educacion_fisica",
    category: "Educación Física y Salud",
    content: `Educación Física y Promoción de la Salud para Adultos:
- **Ergonomía Laboral y Postural**:
  - Mantener la espalda recta al estar sentado frente a pantallas o mesas de trabajo.
  - Al levantar peso del suelo: flexionar las rodillas y mantener la carga cerca del cuerpo (no doblar la columna).
- **Pausas Activas**: Estiramientos sencillos de cuello, hombros y columna cada 1 o 2 horas de estudio o trabajo sedentario.
- **Hábitos Saludables**: Hidratación continua (agua), descanso reparador (7 a 8 horas), y actividad física aeróbica moderada al menos 30 minutos al día.`,
    source: "Cartilla de Salud y Ed. Física EMAL",
    keywords: ["salud", "educacion fisica", "ergonomia", "postura", "pausas activas", "ejercicio", "bienestar"]
  },
  {
    id: "edu-cs-01",
    title: "Ciencias Sociales: Historia Argentina, Constitución y Derechos",
    area: "educativa",
    subject: "ciencias_sociales",
    category: "Ciencias Sociales",
    content: `Ciencias Sociales y Formación Ética y Ciudadana:
- **Derechos de los Trabajadores en Argentina (Art. 14 bis de la Constitución Nacional)**:
  - Condición digna y equitativa de labor, jornada limitada, descanso y vacaciones pagadas.
  - Salario mínimo vital y móvil, protección contra el despido arbitrario, estabilidad del empleado público.
  - Salario familiar y previsión social (jubilaciones y pensiones).
- **Participación Ciudadana y Democracia**:
  - El voto popular, secreto y obligatorio.
  - El rol de las instituciones comunitarias y la memoria colectiva.`,
    source: "Módulo de Ciencias Sociales - EMAL",
    keywords: ["ciencias sociales", "constitucion", "derechos laborales", "art 14 bis", "democracia", "historia"]
  },
  {
    id: "edu-cn-01",
    title: "Ciencias Naturales: Ecosistemas, Salud Ambiental y Biología",
    area: "educativa",
    subject: "ciencias_naturales",
    category: "Ciencias Naturales",
    content: `Ciencias Naturales y Conciencia Ambiental:
- **El Ecosistema Local**: Interacción entre componentes bióticos (seres vivos: plantas, animales, microorganismos) y abióticos (agua, suelo, aire, temperatura).
- **Cuidado del Agua y Residuos**:
  - Separación de residuos (reciclables vs orgánicos).
  - Uso responsable del agua en la región patagónica.
- **Conceptos de Salud y Enfermedad**:
  - Prevención primaria: Vacunación, agua potable, higiene de alimentos.
  - Funcionamiento de los sistemas del cuerpo humano (respiratorio, circulatorio, digestivo).`,
    source: "Módulo de Ciencias Naturales EMAL",
    keywords: ["ciencias naturales", "ecosistema", "medio ambiente", "salud", "biologia", "reciclaje"]
  },
  {
    id: "edu-edi-01",
    title: "EDI: Plataformas Digitales y Módulo 2 (Inteligencia Artificial y Chatbots)",
    area: "educativa",
    subject: "edi_plataformas",
    category: "EDI: Plataformas Digitales",
    content: `Espacio de Definición Institucional (EDI) - Plataformas Digitales y Módulo 2:
- **¿Qué es EMALBOT?**: Es un asistente conversacional desarrollado para acompañar a la comunidad de la Escuela N° 2702.
- **Conceptos Clave del Módulo 2**:
  1. **Algoritmo**: Conjunto ordenado de instrucciones finitas para resolver un problema (como una receta de cocina o el paso a paso de un trámite).
  2. **Dato e Información**: Los datos son elementos crudos (ej: "18:30"); la información es el dato procesado con significado (ej: "Horario de ingreso a la escuela: 18:30 hs").
  3. **Inteligencia Artificial y Modelo de Lenguaje**: Un programa entrenado con grandes volúmenes de texto para reconocer patrones, comprender lenguaje humano y generar respuestas coherentes.
  4. **Base de Conocimiento / RAG**: El chatbot no inventa respuestas; consulta carpetas de Google Drive con materiales elaborados por docentes de la escuela para brindar respuestas veraces y contextualizadas.
  5. **Automatización Acompañada**: La tecnología facilita el acceso 24/7 a la información, promoviendo el aprendizaje autónomo de los adultos sin sustituir la relación humana con docentes y preceptores.`,
    source: "Proyecto Pedagógico Módulo 2 - Escuela N° 2702 EMAL",
    keywords: ["edi", "plataformas digitales", "modulo 2", "inteligencia artificial", "chatbot", "algoritmo", "datos", "emalbot"]
  }
];
