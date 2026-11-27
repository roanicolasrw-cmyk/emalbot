import { KnowledgeDocument } from '../types';

export const INSTITUTIONAL_INFO = {
  schoolName: 'Escuela N° 2702 EMAL',
  fullTitle: 'Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos N° 2702',
  shift: 'Turno Vespertino / Noche (19:15 hs a 22:15 hs)',
  secretariaHours: 'Lunes a Viernes de 19:15 hs a 22:15 hs',
  motto: 'Acompañamiento educativo y formación autónoma para adultos',
  disclaimer:
    'EMALBOT brinda información de orientación y acompañamiento. No toma decisiones administrativas finales (como adjudicación de vacantes) ni reemplaza las evaluaciones o explicaciones docentes.'
};

export const KNOWLEDGE_BASE: KnowledgeDocument[] = [
  // --- ÁREA INSTITUCIONAL ---
  {
    id: 'inst-01',
    title: 'MATRÍCULA 2027 - Inscripciones y Requisitos - Escuela N° 2702 EMAL',
    area: 'institucional',
    subject: 'inscripciones',
    category: 'Matrícula 2027 · Inscripciones',
    content: `MATRÍCULA 2027 - INSCRIPCIONES ABIERTAS (Escuela N° 2702 EMAL):
Estamos en etapa prioritaria de cierre de año recibiendo inscripciones para el Ciclo Lectivo 2027.

**Paso 1 · Preinscripción Online:**
Completá el formulario digital aquí: [Formulario de Preinscripción Matrícula 2027](https://docs.google.com/forms/d/e/1FAIpQLScIxCNeBE2veAN4dWndcrJONM8sUaOh7UMfgRuNc7j6NOUsgw/viewform?usp=sf_link)

**Paso 2 · Documentación presencial (para mayores de 18 años):**
1. Fotocopia de DNI (frente y dorso).
2. Certificado de Estudios Primarios completos (o Pase / Analítico parcial de escuela secundaria anterior si corresponde).
3. Fotocopia de Partida de Nacimiento.
4. 2 Fotos carnet 4x4.

**Dónde y cuándo presentar la documentación:**
Luego de completar la preinscripción, llevar la documentación de manera presencial a **Güemes 710**, de **19:15 a 22:00 hs** (Lunes a Viernes). Atención general de Secretaría: Lunes a Viernes de 19:15 a 22:15 hs.`,
    source: 'Circular Prioritaria Matrícula 2027 · Secretaría EMAL',
    keywords: [
      'matricula',
      'matricula 2027',
      '2027',
      'requisitos',
      'inscripcion',
      'inscripciones',
      'preinscripcion',
      'formulario',
      'enlace',
      'link',
      'guemes',
      'guemes 710',
      'inscribirme',
      'documentos',
      'dni',
      'certificado primario',
      'edad',
      'adultos'
    ]
  },
  {
    id: 'inst-02',
    title: 'Criterios de Vacantes y Adjudicación - Matrícula 2027',
    area: 'institucional',
    subject: 'vacantes',
    category: 'Vacantes',
    content: `Información sobre Vacantes en Escuela N° 2702 EMAL:
Las vacantes se asignan priorizando:
1. Estudiantes regulares con continuidad en la institución.
2. Adultos residentes en la zona de influencia de la escuela.
3. Personas con responsabilidades laborales o familiares que requieran el turno vespertino/noche.
4. Orden de presentación de documentación completa en Secretaría (19:15 a 22:15 hs).

IMPORTANTE: EMALBOT orienta sobre los requisitos y el procedimiento, pero LA ADJUDICACIÓN DEFINITIVA DE LA VACANTE ES RESPONSABILIDAD EXCLUSIVA DE LA DIRECCIÓN Y SECRETARÍA DE LA ESCUELA.`,
    source: 'Reglamento Interno EMAL',
    keywords: ['vacantes', 'cupo', 'prioridad', 'adjudicacion', 'secretaria', 'direccion']
  },
  {
    id: 'inst-03',
    title: 'Trámites, Certificados y Solicitudes en Secretaría',
    area: 'institucional',
    subject: 'tramites',
    category: 'Trámites',
    content: `Trámites habituales en Secretaría de Escuela N° 2702 EMAL (Horario: Lunes a Viernes de 19:15 a 22:15 hs):
- **Constancia de Alumno Regular**: Se solicita con 24/48 hs de anticipación en Secretaría. Útil para presentar en trabajos, asignaciones o boleto educativo.
- **Certificado de Examen**: Se emite el día que el estudiante rinde una evaluación o examen para presentar como justificación laboral.
- **Pases y Equivalencias**: Para estudiantes que provienen de otras escuelas de adultos (EPJA / EEMPA / CENS). Debe presentarse el Analítico Parcial legalizado.
- **Justificación de Inasistencias por Trabajo o Enfermedad**: Presentar certificado médico o constancia laboral dentro de las 72 hs de ocurrida la falta.`,
    source: 'Guía de Trámites Escolares EMAL',
    keywords: ['tramites', 'certificado', 'alumno regular', 'examen', 'justificativo', 'trabajo', 'pase']
  },
  {
    id: 'inst-04',
    title: 'Horarios de Secretaría y Clases - Escuela N° 2702 EMAL',
    area: 'institucional',
    subject: 'horarios',
    category: 'Horarios',
    content: `Horarios Oficiales de la Escuela N° 2702 EMAL:
- **Atención de Secretaría y Preceptoría**: Lunes a Viernes de 19:15 hs a 22:15 hs.
- **Turno Vespertino / Noche**: Lunes a Viernes de 19:15 hs a 22:15 hs.
- **Inscripciones Matrícula 2027**: Atención en Secretaría durante todo el horario de 19:15 a 22:15 hs.`,
    source: 'Organigrama Horario EMAL',
    keywords: ['horarios', 'horario', 'secretaria', 'clases', 'turno noche', 'vespertino', '19:15', '22:15']
  },
  {
    id: 'inst-05',
    title: 'Preguntas Frecuentes de Estudiantes Nuevos y Regulares',
    area: 'institucional',
    subject: 'secretaria',
    category: 'Preguntas Frecuentes',
    content: `Preguntas Frecuentes - EMAL N° 2702:
Q: ¿Puedo cursar si trabajo por turnos rotativos?
A: Sí, la modalidad de educación de adultos (EMAL) contempla la flexibilidad horaria con acompañamiento de módulos, materiales en Google Drive y tutorías. Comunicá tu situación al preceptor en el horario de 19:15 a 22:15 hs.

Q: ¿Cuánto dura el plan de estudios?
A: El plan está estructurado por Módulos. Según tu nivel de ingreso (certificados previos o equivalencias), podés completar el nivel secundario en 2 o 3 años.

Q: ¿Qué pasa si me ausento por motivos laborales?
A: Siempre avisá a tu preceptor/a y presentá la constancia laboral. Podés continuar con los trabajos prácticos subidos a Google Drive.`,
    source: 'FAQ Comunidad Educativa EMAL',
    keywords: ['faq', 'preguntas frecuentes', 'trabajo rotativo', 'duracion', 'inasistencias', 'modulos']
  },
  {
    id: 'inst-06',
    title: 'Equipo Docente y Profesores por Materia - Escuela N° 2702 EMAL',
    area: 'institucional',
    subject: 'docentes',
    category: 'Equipo Docente',
    content: `Nómina de Profesores y Espacios Curriculares - Escuela N° 2702 EMAL:
- **Nuevas Tecnologías (Módulos 1 y 2)**: Prof. **Roa Nicolás**
- **Matemáticas (Módulos 1 a 4)**: Prof. **Zaneta Sebastián**
- **Lengua (Módulos 1 a 4)**: Prof. **Evans Erika**
- **Cs. Naturales (Módulos 1 a 4)**: Prof. **Mundaca Yamila**
- **Inglés (Módulos 1 a 4)**: Equipo Docente de Inglés (@escuela2702emal.edu.ar)
- **Cs. Sociales (Módulos 1 a 4)**: Equipo Docente de Cs. Sociales (@escuela2702emal.edu.ar)
- **Ed. Física y Salud (Módulos 1 a 4)**: Equipo Docente de Ed. Física y Salud (@escuela2702emal.edu.ar)
- **EDI (Módulos 1 y 2)**: Equipo Docente de EDI (@escuela2702emal.edu.ar)

Para consultas sobre comisiones o mesas, acercarse a Secretaría de Lunes a Viernes de 19:15 a 22:15 hs.`,
    source: 'Nómina Oficial de Docentes EMAL N° 2702',
    keywords: [
      'profesor',
      'profesora',
      'profesores',
      'docente',
      'docentes',
      'quien es el profesor',
      'quien enseña',
      'roa',
      'nicolas',
      'zaneta',
      'sebastian',
      'evans',
      'erika',
      'mundaca',
      'yamila'
    ]
  },

  // --- ÁREA EDUCATIVA (1° y 2° año secundaria / Formación Básica) ---
  {
    id: 'edu-mat-01',
    title: 'Matemáticas (1° y 2° Año Secundaria): Números Enteros, Fracciones y Porcentajes',
    area: 'educativa',
    subject: 'matematicas',
    category: 'Matemáticas',
    content: `Matemáticas - Ciclo Básico (1° y 2° Año de Secundaria · Prof. Zaneta Sebastián):
1. **Números Enteros (Z)**:
   - Incluyen positivos (+), negativos (-) y el cero (0). Se usan para temperaturas bajo cero, alturas sobre/bajo el nivel del mar y saldos bancarios o deudas.
   - Regla de signos en multiplicación y división: signos iguales dan positivo (+ · + = + y - · - = +); signos distintos dan negativo (+ · - = -).
   - Jerarquía en operaciones combinadas: 1) Paréntesis, 2) Potencias y raíces, 3) Multiplicaciones y divisiones, 4) Sumas y restas.

2. **Fracciones, Decimales y Porcentajes**:
   - Una fracción a/b indica partes de un entero (ej: 1/2 = 0,5 = 50%; 1/4 = 0,25 = 25%).
   - Para calcular el porcentaje de un descuento (ej: 15% sobre $8.000): (8000 × 15) / 100 = $1.200 de descuento. Total a pagar: $6.800.

3. **Regla de Tres Simple Directa**:
   - Si 3 paquetes de yerba cuestan $6.000, ¿cuánto cuestan 5 paquetes?
   - Cálculo: (5 × 6000) / 3 = $10.000.`,
    source: 'Material 1° y 2° Año Matemáticas · Prof. Zaneta Sebastián',
    keywords: [
      'matematicas',
      'matematica',
      'zaneta',
      'sebastian',
      'enteros',
      'fracciones',
      'porcentajes',
      'regla de tres',
      '1er ano',
      '2do ano',
      'secundaria',
      'operaciones combinadas'
    ]
  },
  {
    id: 'edu-mat-02',
    title: 'Matemáticas (1° y 2° Año Secundaria): Ecuaciones de Primer Grado y Geometría',
    area: 'educativa',
    subject: 'matematicas',
    category: 'Matemáticas',
    content: `Matemáticas - Ecuaciones y Geometría (Prof. Zaneta Sebastián):
1. **Ecuaciones de Primer Grado**:
   - Una ecuación es una igualdad con un valor desconocido llamado incógnita (x).
   - Regla de pasaje de términos: lo que suma pasa restando; lo que resta pasa sumando; lo que multiplica pasa dividiendo.
   - Ejemplo paso a paso: 2x + 10 = 50 -> 2x = 50 - 10 -> 2x = 40 -> x = 40 / 2 -> x = 20.
   - Aplicación cotidiana: Si cobraste $50 en total con un viático fijo de $10 y $2 por hora, trabajaste 20 horas.

2. **Perímetro y Área de Figuras Planas (Geometría Básica)**:
   - **Perímetro**: Es la suma de todos los lados de una figura (contorno, por ejemplo para cercar un terreno).
   - **Área del Rectángulo**: Base × Altura (ej: habitación de 4 m × 3 m = 12 m² de piso).
   - **Área del Triángulo**: (Base × Altura) / 2.`,
    source: 'Guía Ecuaciones y Geometría · Prof. Zaneta Sebastián',
    keywords: ['ecuaciones', 'incognita', 'geometria', 'perimetro', 'area', 'rectangulo', 'triangulo', 'matematicas']
  },
  {
    id: 'edu-nt-01',
    title: 'Nuevas Tecnologías (Módulos 1 y 2): Hardware, Software, Nube y Seguridad Digital',
    area: 'educativa',
    subject: 'nuevas_tecnologias',
    category: 'Nuevas Tecnologías',
    content: `Nuevas Tecnologías - Módulos 1 y 2 (Prof. Roa Nicolás):
1. **Hardware vs. Software**:
   - **Hardware**: Es la parte física y tangible de la computadora o celular (procesador CPU, memoria RAM, disco SSD, pantalla, teclado, mouse, impresora). Se divide en periféricos de entrada (teclado, micrófono) y de salida (monitor, parlantes).
   - **Software**: Son los programas, aplicaciones y sistemas operativos que permiten que el hardware funcione (Android, Windows, Google Chrome, WhatsApp, Google Docs).

2. **Almacenamiento en la Nube (Google Drive)**:
   - Permite guardar apuntes, fotos y planillas en internet para acceder desde cualquier celular o PC sin ocupar memoria física del teléfono.
   - En la Escuela N° 2702 EMAL las materias organizan sus materiales en carpetas compartidas de Drive.

3. **Ciudadanía Digital y Ciberseguridad**:
   - Usar contraseñas fuertes (mínimo 8 caracteres mezclando letras, números y símbolos) y activar la verificación en dos pasos (2FA).
   - **Phishing**: Estafas por mensajes o correos falsos que piden claves bancarias o códigos de WhatsApp. Nunca compartir códigos de verificación.`,
    source: 'Guía NTICx Módulos 1 y 2 · Prof. Roa Nicolás',
    keywords: [
      'nuevas tecnologias',
      'nticx',
      'roa',
      'nicolas',
      'hardware',
      'software',
      'perifericos',
      'nube',
      'drive',
      'seguridad digital',
      'phishing',
      'contrasenas'
    ]
  },
  {
    id: 'edu-lengua-01',
    title: 'Lengua (1° y 2° Año Secundaria): Comprensión Lectora, Tipos de Texto y Cohesión',
    area: 'educativa',
    subject: 'lengua',
    category: 'Lengua',
    content: `Lengua - Ciclo Básico (1° y 2° Año de Secundaria · Prof. Evans Erika):
1. **Estrategias de Comprensión Lectora**:
   - **Paratexto**: Observar título, subtítulos, imágenes y fuente antes de leer para anticipar el tema.
   - **Ideas Principales y Secundarias**: La idea principal resume de qué trata el párrafo; las secundarias aportan ejemplos o detalles.
   - **Resumen**: Redactar con palabras propias las ideas centrales respetando el sentido original del texto.

2. **Tipos de Texto más frecuentes**:
   - **Texto Expositivo / Explicativo**: Informa y explica un tema de estudio de forma objetiva (ej: manuales escolares, enciclopedias).
   - **Texto Argumentativo**: Defiende una opinión o postura mediante razones y ejemplos (ej: notas de opinión, cartas de reclamo).
   - **Texto Instructivo**: Indica pasos ordenados para hacer algo (ej: recetas, manuales, formularios).
   - **Nota Formal**: Incluye Lugar y Fecha, Destinatario/Cargo, Saludo de cortesía, Motivo claro, Despedida y Firma con DNI.

3. **Cohesión Textual (Conectores)**:
   - De adición: *además, también, asimismo*.
   - De oposición: *sin embargo, pero, no obstante*.
   - De causa y consecuencia: *porque, debido a que, por lo tanto, en consecuencia*.`,
    source: 'Material 1° y 2° Año Lengua · Prof. Evans Erika',
    keywords: [
      'lengua',
      'evans',
      'erika',
      'comprension lectora',
      'tipos de texto',
      'expositivo',
      'argumentativo',
      'nota formal',
      'conectores',
      'cohesion',
      'resumen',
      '1er ano',
      '2do ano'
    ]
  },
  {
    id: 'edu-lengua-02',
    title: 'Lengua (1° y 2° Año Secundaria): Clases de Palabras y Reglas de Acentuación',
    area: 'educativa',
    subject: 'lengua',
    category: 'Lengua',
    content: `Lengua - Gramática y Ortografía Básica (Prof. Evans Erika):
1. **Clases de Palabras Principales**:
   - **Sustantivos**: Nombran personas, lugares, objetos o ideas (propios como *Argentina*, comunes como *escuela*, *libro*).
   - **Adjetivos**: Describen o califican al sustantivo (ej: *tarde fría*, *nota formal*).
   - **Verbos**: Expresan acciones, procesos o estados y varían en tiempo (pasado, presente, futuro) y persona (ej: *estudió, aprende, trabajaremos*).

2. **Reglas Generales de Acentuación (Tilde)**:
   - **Agudas**: Sílaba tónica en la última sílaba. Llevan tilde cuando terminan en **N, S o Vocal** (ej: *canción, interés, café*).
   - **Graves (llanas)**: Sílaba tónica en la penúltima sílaba. Llevan tilde cuando **NO** terminan en N, S ni Vocal (ej: *árbol, lápiz, fácil*).
   - **Esdrújulas**: Sílaba tónica en la antepenúltima sílaba. **Siempre** llevan tilde (ej: *matemática, célula, teléfono*).`,
    source: 'Guía Ortografía y Clases de Palabras · Prof. Evans Erika',
    keywords: ['acentuacion', 'tilde', 'agudas', 'graves', 'esdrujulas', 'sustantivo', 'adjetivo', 'verbo', 'lengua']
  },
  {
    id: 'edu-ing-01',
    title: 'Inglés (Formación Básica): Saludos, Verbo To Be y Vocabulario Cotidiano',
    area: 'educativa',
    subject: 'ingles',
    category: 'Inglés',
    content: `Inglés - Nivel Inicial y Básico (Formación Básica EMAL):
1. **Saludos y Presentación Personal**:
   - *Hello / Good evening* (Hola / Buenas noches).
   - *My name is... / I am a student at EMAL 2702* (Mi nombre es... / Soy estudiante de EMAL 2702).
   - *How are you? — I am fine, thank you* (¿Cómo estás? — Estoy bien, gracias).

2. **Verbo "To Be" (Ser o Estar) en Presente**:
   - *I am* (Yo soy/estoy) · *You are* (Vos sos/estás) · *He / She / It is* (Él/Ella/Eso es/está) · *We / They are* (Nosotros/Ellos son/están).
   - Ejemplo: *She is a teacher* (Ella es profesora) · *We are in class* (Nosotros estamos en clase).

3. **Inglés en la Tecnología y la Vida Diaria**:
   - Palabras frecuentes en celulares y trabajos: *Password* (contraseña), *Save* (guardar), *Send* (enviar), *Open / Closed* (abierto / cerrado), *Schedule* (horario).`,
    source: 'Cartilla de Inglés · Formación Básica EMAL',
    keywords: ['ingles', 'english', 'to be', 'saludos', 'vocabulario', 'presentacion', 'basico']
  },
  {
    id: 'edu-cs-01',
    title: 'Cs. Sociales: Constitución Nacional, Derechos Laborales y Ciudadanía',
    area: 'educativa',
    subject: 'ciencias_sociales',
    category: 'Cs. Sociales',
    content: `Cs. Sociales y Formación Ciudadana (Formación Básica EMAL):
- **Derechos de los Trabajadores (Art. 14 bis de la Constitución Nacional)**:
  - Condiciones dignas y equitativas de labor, jornada limitada, descanso y vacaciones pagadas.
  - Salario mínimo vital y móvil, protección contra el despido arbitrario, igual remuneración por igual tarea.
  - Derecho a la seguridad social (jubilaciones, pensiones, obra social y asignaciones familiares).
- **Historia y Participación Democrática**:
  - La democracia y el voto universal, secreto y obligatorio.
  - El rol de las instituciones educativas y barriales en la inclusión social.`,
    source: 'Módulo de Cs. Sociales · EMAL N° 2702',
    keywords: ['ciencias sociales', 'cs sociales', 'constitucion', 'derechos laborales', 'art 14 bis', 'democracia', 'historia']
  },
  {
    id: 'edu-cn-01',
    title: 'Cs. Naturales (1° y 2° Año Secundaria): La Célula, Niveles de Organización y Ecosistemas',
    area: 'educativa',
    subject: 'ciencias_naturales',
    category: 'Cs. Naturales',
    content: `Cs. Naturales - Biología y Ambiente (1° y 2° Año de Secundaria · Prof. Mundaca Yamila):
1. **La Célula (Unidad de la Vida)**:
   - Todos los seres vivos están formados por células (nutrición, relación y reproducción).
   - **Célula Procariota**: Más simple, sin núcleo definido (bacterias).
   - **Célula Eucariota**: Con núcleo definido que protege el ADN. Se divide en **célula animal** y **célula vegetal** (esta última posee pared celular y cloroplastos para realizar fotosíntesis).

2. **Niveles de Organización Biológica**:
   - Célula -> Tejido -> Órgano -> Sistema de órganos -> Organismo -> Población -> Comunidad -> Ecosistema.

3. **Ecosistemas y Cadenas Tróficas**:
   - **Factores Bióticos**: Seres vivos (plantas, animales, hongos, bacterias).
   - **Factores Abióticos**: Elementos sin vida (agua, suelo, luz solar, viento, temperatura).
   - **Cadenas Alimentarias**: Productores (plantas) -> Consumidores (herbívoros y carnívoros) -> Descomponedores (hongos y bacterias que reciclan nutrientes).`,
    source: 'Material 1° y 2° Año Cs. Naturales · Prof. Mundaca Yamila',
    keywords: [
      'ciencias naturales',
      'cs naturales',
      'mundaca',
      'yamila',
      'celula',
      'procariota',
      'eucariota',
      'fotosintesis',
      'ecosistema',
      'bioticos',
      'abioticos',
      'cadena trofica',
      '1er ano',
      '2do ano'
    ]
  },
  {
    id: 'edu-cn-02',
    title: 'Cs. Naturales (1° y 2° Año Secundaria): Materia, Estados, Mezclas y Salud',
    area: 'educativa',
    subject: 'ciencias_naturales',
    category: 'Cs. Naturales',
    content: `Cs. Naturales - Fisicoquímica y Salud (Prof. Mundaca Yamila):
1. **Estados de la Materia y Cambios de Estado**:
   - **Sólido**: Forma y volumen propios (hielo).
   - **Líquido**: Volumen propio, adapta su forma al recipiente (agua).
   - **Gaseoso**: Sin forma ni volumen fijo, ocupa todo el espacio (vapor de agua).
   - Cambios principales: Fusión (sólido a líquido), Vaporización/Ebullición (líquido a gas), Condensación (gas a líquido) y Solidificación (líquido a sólido).

2. **Mezclas Homogéneas y Heterogéneas**:
   - **Homogénea (solución)**: Se ve una sola fase, no se distinguen los componentes a simple vista (ej: agua con sal o azúcar disuelta).
   - **Heterogénea**: Se distinguen dos o más fases (ej: agua con aceite, ensalada).

3. **Prevención Primaria de la Salud**:
   - Agua potable, lavado de manos, vacunación, higiene alimentaria y separación de residuos.`,
    source: 'Guía Materia y Salud · Prof. Mundaca Yamila',
    keywords: ['estados de la materia', 'solido', 'liquido', 'gaseoso', 'mezclas', 'homogenea', 'heterogenea', 'salud', 'cs naturales']
  },
  {
    id: 'edu-ef-01',
    title: 'Ed. Física y Salud: Ergonomía Laboral, Pausas Activas y Bienestar',
    area: 'educativa',
    subject: 'educacion_fisica',
    category: 'Ed. Física y Salud',
    content: `Ed. Física y Salud para Jóvenes y Adultos:
- **Ergonomía Postural y Laboral**:
  - Al permanecer sentado frente a una computadora o mesa: apoyar ambos pies en el suelo y mantener la espalda recta.
  - Al levantar peso del suelo: flexionar las rodillas y acercar la carga al cuerpo (nunca doblar la cintura con piernas estiradas).
- **Pausas Activas**: Movilidad suave de cuello, hombros y muñecas cada 60-90 minutos de estudio o trabajo.
- **Hábitos Saludables**: Hidratación con agua segura, descanso de 7 a 8 horas y caminata o actividad aeróbica de 30 minutos diarios.`,
    source: 'Cartilla de Ed. Física y Salud · EMAL N° 2702',
    keywords: ['salud', 'educacion fisica', 'ed fisica', 'ergonomia', 'postura', 'pausas activas', 'ejercicio', 'bienestar']
  },
  {
    id: 'edu-edi-01',
    title: 'EDI: Plataformas Digitales y Módulo 2 (IA, Algoritmos y RAG)',
    area: 'educativa',
    subject: 'edi_plataformas',
    category: 'EDI',
    content: `Espacio de Definición Institucional (EDI) - Módulos 1 y 2:
- **¿Qué es EMALBOT?**: Es el asistente conversacional de la Escuela N° 2702 EMAL.
- **Conceptos Clave**:
  1. **Algoritmo**: Secuencia ordenada de pasos finitos para resolver un problema (como los pasos para despejar una ecuación o completar un trámite).
  2. **Dato vs. Información**: Un dato aislado ("19:15") cobra sentido como información dentro de su contexto ("19:15 a 22:15 hs es el horario de Secretaría de la Escuela N° 2702 EMAL").
  3. **Base de Conocimiento y Motor RAG**: Antes de responder, el sistema busca en las carpetas de Google Drive cargadas por los docentes y Secretaría mediante Formulario de Google, evitando inventar respuestas.`,
    source: 'Proyecto Pedagógico EDI · Escuela N° 2702 EMAL',
    keywords: ['edi', 'plataformas digitales', 'modulo 2', 'inteligencia artificial', 'chatbot', 'algoritmo', 'datos', 'rag', 'emalbot']
  }
];
