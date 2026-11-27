import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  FileSpreadsheet,
  FolderOpen,
  Search,
  Printer,
  Copy,
  Check,
  Download,
  Play,
  ArrowRight,
  Database,
  Cpu,
  MessageSquare,
  CheckCircle2,
  Send,
  Volume2,
  VolumeX,
  RefreshCw,
  BookOpen,
  Building2,
  FileText
} from 'lucide-react';
import { DriveStatus, RagTraceInfo } from '../types';
import { generateLocalRagResponse } from '../utils/localRag';

interface StandDemoSectionProps {
  driveStatus: DriveStatus;
  onAddCustomDoc: (
    name: string,
    category: string,
    content: string,
    authorName?: string,
    moduleLevel?: string,
    sourceType?: 'google_form' | 'drive_upload'
  ) => Promise<void>;
  onRefreshDrive: () => Promise<void>;
}

interface LiveDemoResponse {
  text: string;
  sources: string[];
  ragTrace?: RagTraceInfo;
}

const SUMMARY_FOR_AI = `PROYECTO: EMALBOT — Asistente Educativo e Institucional con Inteligencia Artificial y Arquitectura RAG
INSTITUCIÓN: Escuela N° 2702 EMAL (Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos N° 2702)

RESUMEN DEL SISTEMA PARA PRESENTACIÓN / STAND (PASO A PASO):

1. OBJETIVO DEL PROYECTO Y PRIORIDAD ACTUAL:
EMALBOT acompaña a estudiantes jóvenes y adultos en el turno vespertino/noche.
- PRIORIDAD ACTUAL: MATRÍCULA 2027 - INSCRIPCIONES ABIERTAS (cierre de año lectivo).
- HORARIO DE SECRETARÍA: Lunes a Viernes de 19:15 a 22:15 hs.
- ÁREA INSTITUCIONAL: Inscripciones Matrícula 2027, legajo, constancias, vacantes y horarios (Secretaría).
- ÁREA EDUCATIVA (8 materias):
  * Nuevas Tecnologías (Prof. Roa Nicolás · Módulos 1 y 2)
  * Matemáticas (Prof. Zaneta Sebastián · Módulos 1 a 4)
  * Lengua (Prof. Evans Erika · Módulos 1 a 4)
  * Inglés (Módulos 1 a 4)
  * Cs. Sociales (Módulos 1 a 4)
  * Cs. Naturales (Prof. Mundaca Yamila · Módulos 1 a 4)
  * Ed. Física y Salud (Módulos 1 a 4)
  * EDI (Módulos 1 y 2)

2. FLUJO DEL SISTEMA (PASO 1 A PASO 5):

PASO 1 — CARGA DE DATOS EN GOOGLE DRIVE MEDIANTE FORMULARIO DE GOOGLE:
- Los profesores (como Roa Nicolás, Zaneta Sebastián, Evans Erika, Mundaca Yamila) y el personal de Secretaría completan un Formulario de Google simple con el nombre del docente, materia, módulo, título y contenido o novedad.
- La información se almacena automáticamente en la unidad compartida de Google Drive institucional ("REG - Escuela N° 2702 EMAL").

PASO 2 — CONSULTA DEL ESTUDIANTE:
- El estudiante escribe o dicta por voz una pregunta desde su celular o computadora (ej: "¿Quién es el profesor de Nuevas Tecnologías?" o "¿Qué documentos necesito para Matrícula 2027?").

PASO 3 — RECUPERACIÓN INTELIGENTE CON MOTOR RAG (Retrieval-Augmented Generation):
- El motor RAG normaliza la consulta, extrae palabras clave, escanea las carpetas de Google Drive de la escuela y calcula un puntaje de relevancia (priorizando las cargas recientes del Formulario de Google).

PASO 4 — GENERACIÓN AUMENTADA CON IA:
- El sistema envía los fragmentos recuperados del Drive al modelo de IA (Gemini) para redactar una respuesta clara para adultos. Si no hay conexión externa, un sintetizador RAG local construye la respuesta directamente desde los documentos oficiales recuperados.

PASO 5 — RESPUESTA VERIFICADA Y ACCESIBILIDAD:
- Muestra el archivo exacto de Drive consultado, permite ver el proceso RAG en vivo, simplificar explicaciones, generar ejercicios y escuchar la respuesta en voz alta.`;

export const StandDemoSection: React.FC<StandDemoSectionProps> = ({
  driveStatus,
  onAddCustomDoc
}) => {
  const [subTab, setSubTab] = useState<'demo' | 'a4' | 'summary'>('demo');

  // Google Form Simulator State (Paso 1) - Real teacher default (Prof. Roa Nicolás)
  const [formAuthor, setFormAuthor] = useState('Prof. Roa Nicolás');
  const [formCategory, setFormCategory] = useState('Nuevas Tecnologías');
  const [formModule, setFormModule] = useState('Módulo 1 y 2');
  const [formTitle, setFormTitle] = useState('Docente_Nuevas_Tecnologias_Roa_Nicolas.gdoc');
  const [formContent, setFormContent] = useState(
    'El profesor de Nuevas Tecnologías (Módulos 1 y 2) es el Prof. Roa Nicolás. Contenidos: Hardware y Software, Google Drive institucional, seguridad digital (Phishing), Inteligencia Artificial (desarrollada con participación activa de los estudiantes en proyectos como EMALBOT), Ciudades Inteligentes (Smart Cities) y Big Data.'
  );
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSavedNotice, setFormSavedNotice] = useState<string | null>(null);

  // Live RAG Query Tester State (Paso 2 & 3)
  const [demoQuery, setDemoQuery] = useState('¿Quién es el profesor de Nuevas Tecnologías?');
  const [isQuerying, setIsQuerying] = useState(false);
  const [demoResponse, setDemoResponse] = useState<LiveDemoResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Copy summary state
  const [copiedSummary, setCopiedSummary] = useState(false);

  const applyPreset = (
    preset: 'roa' | 'zaneta' | 'evans' | 'mundaca' | 'secretaria'
  ) => {
    setFormSavedNotice(null);
    if (preset === 'roa') {
      setFormAuthor('Prof. Roa Nicolás');
      setFormCategory('Nuevas Tecnologías');
      setFormModule('Módulo 1 y 2');
      setFormTitle('Docente_Nuevas_Tecnologias_Roa_Nicolas.gdoc');
      setFormContent(
        'El profesor de Nuevas Tecnologías (Módulos 1 y 2) es el Prof. Roa Nicolás. Contenidos: Hardware y Software, Google Drive institucional, seguridad digital (Phishing), Inteligencia Artificial (desarrollada con participación activa de los estudiantes en proyectos como EMALBOT), Ciudades Inteligentes (Smart Cities) y Big Data.'
      );
      setDemoQuery('¿Quién es el profesor de Nuevas Tecnologías?');
    } else if (preset === 'zaneta') {
      setFormAuthor('Prof. Zaneta Sebastián');
      setFormCategory('Matemáticas');
      setFormModule('Módulo 1 y 2');
      setFormTitle('Matematicas_1y2_Zaneta_Sebastian.gdoc');
      setFormContent(
        'El profesor de Matemáticas es el Prof. Zaneta Sebastián. Contenidos de 1° y 2° año de secundaria: números enteros y regla de signos, fracciones y porcentajes de descuento, regla de tres simple, ecuaciones de primer grado (2x + 10 = 50) y cálculo de perímetro y área.'
      );
      setDemoQuery('¿Quién es el profesor de Matemáticas y qué temas se ven en 1° y 2° año?');
    } else if (preset === 'evans') {
      setFormAuthor('Prof. Evans Erika');
      setFormCategory('Lengua');
      setFormModule('Módulo 1 y 2');
      setFormTitle('Lengua_1y2_Evans_Erika.gdoc');
      setFormContent(
        'La profesora de Lengua es la Prof. Evans Erika. Contenidos de 1° y 2° año de secundaria: comprensión lectora (ideas principales y resumen), tipos de texto (expositivo, argumentativo y nota formal), conectores de cohesión y reglas de acentuación (agudas, graves y esdrújulas).'
      );
      setDemoQuery('¿Quién es la profesora de Lengua y qué temas incluye el programa?');
    } else if (preset === 'mundaca') {
      setFormAuthor('Prof. Mundaca Yamila');
      setFormCategory('Cs. Naturales');
      setFormModule('Módulo 1 y 2');
      setFormTitle('CsNaturales_1y2_Mundaca_Yamila.gdoc');
      setFormContent(
        'La profesora de Cs. Naturales es la Prof. Mundaca Yamila. Contenidos de 1° y 2° año de secundaria: la célula (procariota, eucariota animal y vegetal), niveles de organización biológica, ecosistemas (factores bióticos y abióticos), estados de la materia y prevención de la salud.'
      );
      setDemoQuery('¿Quién es la profesora de Cs. Naturales y qué temas vemos?');
    } else {
      setFormAuthor('Secretaría EMAL');
      setFormCategory('Área Institucional');
      setFormModule('General');
      setFormTitle('Matricula_2027_Inscripciones_Secretaria.gdoc');
      setFormContent(
        'MATRÍCULA 2027 - INSCRIPCIONES ABIERTAS: 1) Completar preinscripción online en https://docs.google.com/forms/d/e/1FAIpQLScIxCNeBE2veAN4dWndcrJONM8sUaOh7UMfgRuNc7j6NOUsgw/viewform?usp=sf_link. 2) Luego llevar la documentación de manera presencial (fotocopia de DNI, certificado de estudios primarios o pase, partida de nacimiento y 2 fotos 4x4) en Güemes 710, de 19:15 a 22:00 hs.'
      );
      setDemoQuery('¿Dónde entrego la documentación para Matrícula 2027 y cuál es el enlace de preinscripción?');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;
    setIsSubmittingForm(true);
    setFormSavedNotice(null);
    await onAddCustomDoc(
      formTitle.trim(),
      formCategory,
      formContent.trim(),
      formAuthor.trim(),
      formModule,
      'google_form'
    );
    setIsSubmittingForm(false);
    setFormSavedNotice(
      `Guardado en Google Drive (/REG - Escuela N° 2702 EMAL/${formCategory}) e indexado en el motor RAG.`
    );
  };

  const handleRunLiveRag = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const q = (customQ ?? demoQuery).trim();
    if (!q || isQuerying) return;

    setIsQuerying(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          area: formCategory === 'Área Institucional' ? 'institucional' : 'educativa',
          chatHistory: []
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDemoResponse({
          text: data.text,
          sources: data.sources || [],
          ragTrace: data.ragTrace
        });
        setIsQuerying(false);
        return;
      }
    } catch (err) {
      console.warn('Fallback a RAG Local en StandDemoSection:', err);
    }

    const localResult = generateLocalRagResponse(
      q,
      formCategory === 'Área Institucional' ? 'institucional' : 'educativa',
      undefined,
      driveStatus.files
    );
    setDemoResponse({
      text: localResult.text,
      sources: localResult.sources,
      ragTrace: localResult.ragTrace
    });
    setIsQuerying(false);
  };

  const handleSpeakResponse = () => {
    if (!demoResponse || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = demoResponse.text.replace(/[*#_\-`]/g, '');
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'es-AR';
    u.rate = 0.95;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const handlePrintA4 = () => {
    window.print();
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(SUMMARY_FOR_AI);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 3000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([SUMMARY_FOR_AI], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EMALBOT_Resumen_Sistema_Stand.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner + Sub-view Selector (Hidden on Print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white p-1.5 flex items-center justify-center border border-slate-200 shrink-0">
            <img
              src="/assets/aistudio/Logo_educativo_azul_EMALBOT_b5d3d995.png"
              alt="Logo oficial de EMALBOT"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Muestra y Stand en Vivo: EMALBOT
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Carga real vía Formulario Google hacia Drive con los docentes de EMAL, búsqueda RAG en vivo, láminas A4 imprimibles y resumen para Android Studio u otra IA.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setSubTab('demo')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              subTab === 'demo'
                ? 'bg-sky-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Demo en Vivo (Paso 1 y 2)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('a4')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              subTab === 'a4'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Hojas A4 para Imprimir</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('summary')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              subTab === 'summary'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resumen &amp; Android Studio</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: REAL LIVE STAND DEMONSTRATION */}
      {subTab === 'demo' && (
        <div className="no-print space-y-6">
          {/* Real Teacher Presets Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className="text-xs text-slate-300">
              <strong className="text-white block">Ejemplos reales de carga docente y Secretaría para demostrar en el stand:</strong>
              <span>Elegí un profesor o Secretaría para rellenar el formulario con datos reales de la escuela y probar el motor RAG.</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('roa')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-sky-300 whitespace-nowrap"
              >
                Nuevas Tecnologías · Prof. Roa Nicolás
              </button>
              <button
                type="button"
                onClick={() => applyPreset('zaneta')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-300 whitespace-nowrap"
              >
                Matemáticas · Prof. Zaneta Sebastián
              </button>
              <button
                type="button"
                onClick={() => applyPreset('evans')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-emerald-300 whitespace-nowrap"
              >
                Lengua · Prof. Evans Erika
              </button>
              <button
                type="button"
                onClick={() => applyPreset('mundaca')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-lime-300 whitespace-nowrap"
              >
                Cs. Naturales · Prof. Mundaca Yamila
              </button>
              <button
                type="button"
                onClick={() => applyPreset('secretaria')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-violet-300 whitespace-nowrap"
              >
                Secretaría · Matrícula 2027 (19:15 a 22:15)
              </button>
            </div>
          </div>

          {/* 2-Column Live Pipeline: Step 1 (Google Form -> Drive) | Step 2 (RAG Query -> Answer) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* LEFT COLUMN: PASO 1 - GOOGLE FORM TO GOOGLE DRIVE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 block">
                        Paso 1 · Carga de Datos
                      </span>
                      <h3 className="text-base font-bold text-white">
                        Formulario Google Escolar → Google Drive
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-emerald-300">
                    {driveStatus.files.length} archivos en Drive
                  </span>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <strong className="text-white block mb-0.5">
                      Formulario de Carga Docente y Secretaría (@escuela2702emal.edu.ar)
                    </strong>
                    <span>
                      Lo que enviás acá se guarda en la carpeta <code className="text-sky-300">REG - Escuela N° 2702 EMAL</code> del Drive y queda disponible para EMALBOT.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Materia o Área (Carpeta Drive)
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                      >
                        <option value="Área Institucional">Secretaría (Matrícula 2027)</option>
                        <option value="Nuevas Tecnologías">Nuevas Tecnologías (Mód. 1 y 2)</option>
                        <option value="Matemáticas">Matemáticas (Mód. 1 a 4)</option>
                        <option value="Lengua">Lengua (Mód. 1 a 4)</option>
                        <option value="Inglés">Inglés (Mód. 1 a 4)</option>
                        <option value="Cs. Sociales">Cs. Sociales (Mód. 1 a 4)</option>
                        <option value="Cs. Naturales">Cs. Naturales (Mód. 1 a 4)</option>
                        <option value="Ed. Física y Salud">Ed. Física y Salud (Mód. 1 a 4)</option>
                        <option value="EDI">EDI (Mód. 1 y 2)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Módulo / Ciclo
                      </label>
                      <select
                        value={formModule}
                        onChange={(e) => setFormModule(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                      >
                        <option value="General">General / Secretaría</option>
                        <option value="Módulo 1">Módulo 1</option>
                        <option value="Módulo 2">Módulo 2</option>
                        <option value="Módulo 1 y 2">Módulo 1 y 2</option>
                        <option value="Módulo 3">Módulo 3</option>
                        <option value="Módulo 4">Módulo 4</option>
                        <option value="Módulos 1 a 4">Módulos 1 a 4</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Docente o Responsable
                      </label>
                      <input
                        type="text"
                        required
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        placeholder="Ej: Prof. Roa Nicolás"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nombre del Archivo en Drive
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ej: Apunte_NTICx_Roa.gdoc"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Contenido / Dato Oficial a Guardar en Drive
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isSubmittingForm
                        ? 'Guardando en Google Drive...'
                        : 'Enviar Formulario y Guardar en Google Drive'}
                    </span>
                  </button>
                </form>

                {formSavedNotice && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">¡Paso 1 completado en vivo!</strong>
                      <span>{formSavedNotice} Ahora ejecutá el Paso 2 a la derecha para comprobar cómo lo encuentra EMALBOT.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mini Drive Feed showing real stored files */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                    Últimos documentos en Drive (REG):
                  </span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {driveStatus.files.slice(0, 5).map((f) => (
                    <div
                      key={f.id}
                      className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] flex items-center justify-between gap-2"
                    >
                      <span className="text-slate-200 font-medium truncate">{f.name}</span>
                      <span className="text-slate-400 whitespace-nowrap shrink-0">
                        {f.folderCategory}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PASO 2 & 3 - REAL RAG QUERY & TRACE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-300">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 block">
                      Paso 2 y 3 · Consulta + Motor RAG
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Prueba Real de Recuperación y Respuesta
                    </h3>
                  </div>
                </div>
              </div>

              <form onSubmit={(e) => handleRunLiveRag(e)} className="space-y-3 mb-4">
                <label className="block text-xs font-semibold text-slate-300">
                  Pregunta del estudiante al stand:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={demoQuery}
                    onChange={(e) => setDemoQuery(e.target.value)}
                    placeholder="Escribí una consulta sobre lo cargado en el Paso 1..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={isQuerying || !demoQuery.trim()}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-50"
                  >
                    {isQuerying ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span>Consultar RAG</span>
                  </button>
                </div>
              </form>

              {!demoResponse && !isQuerying && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
                  <Database className="w-8 h-8 text-sky-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-200 mb-1">
                    Listo para ejecutar una consulta real
                  </p>
                  <p className="text-xs max-w-sm">
                    Elegí uno de los ejemplos de docentes o Secretaría arriba, enviá el formulario y presioná <strong>Consultar RAG</strong> para ver la búsqueda en vivo.
                  </p>
                </div>
              )}

              {isQuerying && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-sky-300">
                  <RefreshCw className="w-6 h-6 animate-spin mb-2" />
                  <span>Escaneando carpetas de Google Drive y calculando relevancia RAG...</span>
                </div>
              )}

              {demoResponse && !isQuerying && (
                <div className="flex-1 space-y-4 overflow-y-auto">
                  {demoResponse.ragTrace && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300">
                          Proceso Interno del Motor RAG
                        </span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-400">
                          {demoResponse.ragTrace.processingMs} ms · {demoResponse.ragTrace.totalDocsScanned} docs analizados
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300">
                        <span className="text-slate-400 font-semibold">Palabras clave detectadas: </span>
                        <span className="font-mono text-sky-300">
                          {demoResponse.ragTrace.keywords.join(', ') || 'consulta general'}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] text-slate-400 font-semibold block">
                          Documentos recuperados desde Drive / Base Escolar:
                        </span>
                        {demoResponse.ragTrace.matchedDocuments.slice(0, 3).map((m, idx) => (
                          <div
                            key={m.id}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-white truncate">
                                #{idx + 1} · {m.title}
                              </span>
                              <span className="font-mono tabular-nums text-emerald-400 font-semibold shrink-0">
                                Score {m.score}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {m.sourceType === 'google_form_drive'
                                ? 'Formulario Google -> Drive'
                                : m.sourceType === 'drive'
                                ? 'Google Drive REG'
                                : 'Base Institucional'}{' '}
                              · {m.category}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-sky-300">
                        Respuesta Generada por EMALBOT
                      </span>
                      <button
                        type="button"
                        onClick={handleSpeakResponse}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-200 flex items-center gap-1"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-sky-400" />
                            <span>Detener voz</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                            <span>Escuchar</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="prose prose-invert prose-xs max-w-none text-xs leading-relaxed">
                      <ReactMarkdown>{demoResponse.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: PRINTABLE A4 SHEETS */}
      {subTab === 'a4' && (
        <div className="space-y-6">
          <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Láminas A4 Listas para Imprimir en la Muestra
              </h3>
              <p className="text-xs text-slate-400">
                Incluyen Matrícula 2027, horario de Secretaría (19:15 a 22:15 hs de lunes a viernes) y las materias con sus docentes.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrintA4}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Hojas A4 / Guardar PDF</span>
            </button>
          </div>

          <div className="a4-print-container space-y-8 max-w-[210mm] mx-auto">
            {/* ==================== HOJA A4 N° 1 ==================== */}
            <section className="a4-sheet bg-white text-slate-900 rounded-xl border border-slate-300 p-8 sm:p-10 shadow-xl">
              <div className="flex items-center justify-between pb-6 mb-6 border-b-2 border-sky-700">
                <div className="flex items-center gap-4">
                  <img
                    src="/assets/aistudio/Logo_educativo_azul_EMALBOT_b5d3d995.png"
                    alt="Logo EMALBOT"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-contain"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-sky-700">
                      Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos
                    </p>
                    <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                      EMALBOT — Asistente Educativo con IA
                    </h1>
                    <p className="text-sm font-semibold text-slate-600">
                      Escuela N° 2702 EMAL · Matrícula 2027 · Lunes a Viernes de 19:15 a 22:15 hs
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-slate-500 shrink-0">
                  Lámina 1 de 3 · Hoja A4
                </div>
              </div>

              <div className="space-y-6 text-sm leading-relaxed text-slate-800">
                <div className="p-5 rounded-xl bg-sky-50 border border-sky-200">
                  <h2 className="text-base font-bold text-sky-900 mb-2">
                    ¿Qué es EMALBOT y por qué lo creamos?
                  </h2>
                  <p>
                    Muchos estudiantes jóvenes y adultos trabajan, tienen responsabilidades familiares o cursan en horarios rotativos. EMALBOT es un <strong>asistente conversacional inteligente disponible las 24 horas</strong> desde el celular o la computadora para acompañar la <strong>Matrícula 2027 (Inscripciones)</strong> y las materias escolares sin reemplazar el rol humano del docente ni de Secretaría.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-xl border border-slate-300 bg-slate-50">
                    <div className="flex items-center gap-2 text-sky-800 font-bold text-base mb-2">
                      <Building2 className="w-5 h-5" />
                      <span>1. Área Institucional (Secretaría)</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                      <li><strong>Matrícula 2027 (Preinscripción Online + Presencial):</strong> Completar el Formulario de Google de preinscripción y luego llevar presencialmente: DNI, certificado primario o pase, partida de nacimiento y 2 fotos 4x4.</li>
                      <li><strong>Entrega de Documentación:</strong> En <strong>Güemes 710</strong> de <strong>19:15 a 22:00 hs</strong> (Lunes a Viernes).</li>
                      <li><strong>Certificados y Trámites:</strong> Constancia de alumno regular, certificado de examen y justificaciones laborales (Secretaría 19:15 a 22:15 hs).</li>
                      <li><strong>Límite Institucional:</strong> Orienta sobre pasos y requisitos; la adjudicación final de vacantes corresponde a Secretaría y Dirección.</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-300 bg-slate-50">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-base mb-2">
                      <BookOpen className="w-5 h-5" />
                      <span>2. Área Educativa (8 Materias)</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                      <li><strong>Nuevas Tecnologías:</strong> Prof. Roa Nicolás (Módulos 1 y 2)</li>
                      <li><strong>Matemáticas:</strong> Prof. Zaneta Sebastián (Módulos 1 a 4)</li>
                      <li><strong>Lengua:</strong> Prof. Evans Erika (Módulos 1 a 4)</li>
                      <li><strong>Cs. Naturales:</strong> Prof. Mundaca Yamila (Módulos 1 a 4)</li>
                      <li><strong>Inglés · Cs. Sociales · Ed. Física y Salud</strong> (Módulos 1 a 4)</li>
                      <li><strong>EDI</strong> (Módulos 1 y 2)</li>
                    </ul>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-300 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    Principio Pedagógico Central
                  </h3>
                  <p className="text-xs text-slate-700">
                    EMALBOT <strong>no inventa respuestas</strong> ni reemplaza las clases presenciales. Toda la información que responde surge exclusivamente de los documentos oficiales cargados por los docentes y Secretaría en Google Drive.
                  </p>
                </div>
              </div>
            </section>

            {/* ==================== HOJA A4 N° 2 ==================== */}
            <section className="a4-sheet bg-white text-slate-900 rounded-xl border border-slate-300 p-8 sm:p-10 shadow-xl">
              <div className="flex items-center justify-between pb-5 mb-6 border-b-2 border-sky-700">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/aistudio/Logo_educativo_azul_EMALBOT_b5d3d995.png"
                    alt="Logo EMALBOT"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-contain"
                  />
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      ¿Cómo Funciona el Sistema Paso a Paso? (Google Forms + Drive + RAG)
                    </h2>
                    <p className="text-xs font-semibold text-slate-600">
                      Arquitectura del flujo de información · Escuela N° 2702 EMAL
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-slate-500 shrink-0">
                  Lámina 2 de 3 · Hoja A4
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div className="p-4 rounded-xl border border-violet-300 bg-violet-50/70">
                  <div className="flex items-center gap-2 font-bold text-violet-900 text-sm mb-1">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>PASO 1 · Carga de Datos en Google Drive mediante Formulario de Google</span>
                  </div>
                  <p className="text-slate-800">
                    Los docentes de cada materia (Roa Nicolás, Zaneta Sebastián, Evans Erika, Mundaca Yamila) y Secretaría completan un <strong>Formulario de Google</strong> simple con contenidos de 1° y 2° año, docentes, o avisos de Matrícula 2027. Esa información se guarda automáticamente dentro de las carpetas de Google Drive (<strong>REG - Escuela N° 2702 EMAL</strong>).
                  </p>
                </div>

                <div className="flex justify-center text-slate-400">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                <div className="p-4 rounded-xl border border-sky-300 bg-sky-50/70">
                  <div className="flex items-center gap-2 font-bold text-sky-900 text-sm mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>PASO 2 · Consulta del Estudiante (Texto o Voz)</span>
                  </div>
                  <p className="text-slate-800">
                    El estudiante ingresa a EMALBOT y realiza una pregunta en lenguaje natural, por ejemplo: <em>"¿Quién es el profesor de Nuevas Tecnologías?"</em>, <em>"¿En qué horario atiende Secretaría?"</em> o <em>"Explicame ecuaciones de Matemáticas"</em>.
                  </p>
                </div>

                <div className="flex justify-center text-slate-400">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/70">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-1">
                    <Database className="w-4 h-4" />
                    <span>PASO 3 · Búsqueda y Recuperación con Motor RAG</span>
                  </div>
                  <p className="text-slate-800">
                    El sistema ejecuta <strong>RAG (Generación Aumentada por Recuperación)</strong>: extrae las palabras clave de la pregunta, recorre las carpetas de Google Drive de la escuela, calcula un puntaje de relevancia priorizando los archivos recientes del Formulario de Google y recupera los fragmentos exactos.
                  </p>
                </div>

                <div className="flex justify-center text-slate-400">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-indigo-300 bg-indigo-50/70">
                    <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm mb-1">
                      <Cpu className="w-4 h-4" />
                      <span>PASO 4 · Síntesis con IA Contextual</span>
                    </div>
                    <p className="text-slate-800">
                      La Inteligencia Artificial redacta una respuesta clara y empática usando únicamente los fragmentos recuperados del Drive. Si no hay conexión externa, el sintetizador RAG local responde igualmente con la información oficial.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-300 bg-slate-50">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>PASO 5 · Respuesta Verificada y Voz</span>
                    </div>
                    <p className="text-slate-800">
                      EMALBOT muestra la respuesta citando la fuente de Google Drive, permite inspeccionar el proceso RAG en vivo y ofrece lectura en voz alta y ejercicios de práctica.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ==================== HOJA A4 N° 3 ==================== */}
            <section className="a4-sheet bg-white text-slate-900 rounded-xl border border-slate-300 p-8 sm:p-10 shadow-xl">
              <div className="flex items-center justify-between pb-5 mb-6 border-b-2 border-sky-700">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/aistudio/Logo_educativo_azul_EMALBOT_b5d3d995.png"
                    alt="Logo EMALBOT"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-contain"
                  />
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Guión de Demostración en el Stand y Ficha Técnica
                    </h2>
                    <p className="text-xs font-semibold text-slate-600">
                      Guía práctica para expositores · Muestra Escuela N° 2702 EMAL
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-slate-500 shrink-0">
                  Lámina 3 de 3 · Hoja A4
                </div>
              </div>

              <div className="space-y-5 text-xs leading-relaxed">
                <div className="p-5 rounded-xl border border-slate-300 bg-slate-50">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">
                    Cómo realizar la demostración en vivo en 3 minutos
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2.5 text-slate-800">
                    <li>
                      <strong>Presentar Matrícula 2027 (30 seg):</strong> Mostrar el cartel inicial de <em>MATRÍCULA 2027 - INSCRIPCIONES ABIERTAS</em> y el horario de Secretaría (Lunes a Viernes de 19:15 a 22:15 hs).
                    </li>
                    <li>
                      <strong>Mostrar el Paso 1 en vivo (1 min):</strong> Entrar a <em>"Muestra Stand &amp; A4"</em>, elegir un docente real (ej. Prof. Roa Nicolás, Prof. Zaneta Sebastián, Prof. Evans Erika o Prof. Mundaca Yamila) y enviar el formulario para guardarlo en Google Drive.
                    </li>
                    <li>
                      <strong>Mostrar el Paso 2 y el Motor RAG (1 min):</strong> Presionar <em>"Consultar RAG"</em> y mostrar cómo extrae palabras clave, recupera el archivo cargado y responde al instante citando la fuente.
                    </li>
                    <li>
                      <strong>Mostrar Accesibilidad (30 seg):</strong> Presionar <em>"Escuchar"</em> para oír la respuesta en voz alta.
                    </li>
                  </ol>
                </div>

                <div className="p-5 rounded-xl border border-sky-200 bg-sky-50/60">
                  <h3 className="text-sm font-bold text-sky-900 mb-2">
                    Preguntas recomendadas para que pruebe el público
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-800">
                    <li>"¿Cuáles son los requisitos para Matrícula 2027 y en qué horario atiende Secretaría?"</li>
                    <li>"¿Quién es el profesor de Nuevas Tecnologías?" (Prof. Roa Nicolás)</li>
                    <li>"Explicame números enteros y ecuaciones de Matemáticas 1° y 2° año" (Prof. Zaneta Sebastián)</li>
                    <li>"¿Qué temas se ven en Lengua (Prof. Evans Erika) y Cs. Naturales (Prof. Mundaca Yamila)?"</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl border border-slate-300 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    Ficha Técnica del Proyecto
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <strong>Interfaz Web:</strong> React + TypeScript + Tailwind CSS
                    </div>
                    <div>
                      <strong>Servidor Backend:</strong> Node.js + Express + API REST
                    </div>
                    <div>
                      <strong>Fuente de Datos:</strong> Google Forms + Google Drive (REG)
                    </div>
                    <div>
                      <strong>Inteligencia Artificial:</strong> Motor RAG + Gemini IA + Voz Web
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SUMMARY TO PASTE INTO ANOTHER AI + ANDROID STUDIO DOWNLOAD */}
      {subTab === 'summary' && (
        <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">
                Resumen Estructurado para Otra IA y Archivo Android Studio
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Descargá el archivo listo para Android Studio (.kt) o copiá el resumen para otra IA.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href="/EMALBOT_Android_Studio_Demo.kt"
                download="EMALBOT_Android_Studio_Demo.kt"
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Android Studio (.kt)</span>
              </a>
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar .TXT</span>
              </button>
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Resumen</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <pre className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {SUMMARY_FOR_AI}
          </pre>
        </div>
      )}
    </div>
  );
};
