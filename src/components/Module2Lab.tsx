import React, { useState } from 'react';
import { Cpu, Database, Binary, Sparkles, Workflow, Play, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';

export const Module2Lab: React.FC = () => {
  const [testPrompt, setTestPrompt] = useState('¿Qué necesito para inscribirme en la escuela?');
  const [includeDriveContext, setIncludeDriveContext] = useState(true);
  const [simulatedResult, setSimulatedResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const concepts = [
    {
      title: '1. Algoritmo',
      icon: Binary,
      color: 'from-blue-500 to-cyan-500',
      definition: 'Conjunto ordenado de instrucciones finitas para resolver un problema o completar una tarea.',
      example: 'Como las reglas de un trámite o los pasos ordenados para resolver una ecuación de primer grado.'
    },
    {
      title: '2. Dato vs Información',
      icon: Database,
      color: 'from-emerald-500 to-teal-500',
      definition: 'El dato es un elemento crudo sin significado por sí solo (ej: "18:30"). La información es el dato procesado con significado dentro de un contexto.',
      example: '"18:30" (dato) ➔ "18:30 hs es el horario de ingreso a clases del turno vespertino en la EMAL N° 2702" (información).'
    },
    {
      title: '3. Modelo de IA Conversacional',
      icon: Cpu,
      color: 'from-purple-500 to-indigo-500',
      definition: 'Sistema computacional entrenado para reconocer patrones en el lenguaje humano y generar respuestas coherentes.',
      example: 'EMALBOT utiliza el modelo Gemini 3.6 de Google para razonar y redactar explicaciones adaptadas a adultos.'
    },
    {
      title: '4. Base de Conocimiento (RAG)',
      icon: Workflow,
      color: 'from-amber-500 to-orange-500',
      definition: 'Retrieval-Augmented Generation: Técnica que busca información real en carpetas de Google Drive antes de responder.',
      example: 'En lugar de adivinar, EMALBOT lee la circular oficial de Secretaría o la carpeta docente de Matemáticas.'
    }
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulatedResult(null);

    setTimeout(() => {
      setIsSimulating(false);
      if (includeDriveContext) {
        setSimulatedResult(`[PROMPT CONTEXTUALIZADO CON DRIVE CONTEXT]
Sistema: EMALBOT (Escuela N° 2702 EMAL)
Documento leído: Drive/Institucional/Circular_Inscripciones_2026.docx

Respuesta simulada:
Para inscribirte en la Escuela N° 2702 EMAL necesitás presentar:
1. DNI (original y fotocopia)
2. Certificado de Primaria completa (o Analítico Parcial de secundaria previa)
3. 2 fotos carnet 4x4
4. Folio transparente oficio.
Horario de atención: Lunes a Viernes de 18:30 a 21:30 hs.
(Nota: La vacante definitiva es confirmada por Secretaría).`);
      } else {
        setSimulatedResult(`[PROMPT SIN CONTEXTO DE DRIVE]
Respuesta simulada genérica:
Para inscribirte en una escuela generalmente necesitás documento de identidad y certificados de estudios anteriores. Consulta en la secretaría local los horarios específicos.`);
      }
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-slate-900/90 rounded-2xl border border-slate-800 text-white shadow-xl mb-8">
      
      {/* Title Header */}
      <div className="flex items-center space-x-3.5 pb-6 border-b border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-6 h-6 text-amber-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Laboratorio del Módulo 2: ¿Cómo funciona EMALBOT?
          </h2>
          <p className="text-xs text-slate-400">
            Espacio pedagógico para explorar los conceptos de Inteligencia Artificial, Algoritmos, Datos y Automatización en la educación de adultos.
          </p>
        </div>
      </div>

      {/* Concept Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {concepts.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${c.color} flex items-center justify-center text-white mb-3 shadow-sm`}>
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{c.title}</h3>
              <p className="text-xs text-slate-300 leading-normal mb-2">{c.definition}</p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-amber-400 block mb-0.5">Ejemplo EMAL:</strong>
                {c.example}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Architecture Flow Diagram */}
      <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 my-6">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-indigo-400" />
          Flujo de Procesamiento de EMALBOT
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-xs">
          
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-sky-400 uppercase block mb-1">Paso 1</span>
            <strong className="text-white block">Consulta del Estudiante</strong>
            <span className="text-[10px] text-slate-400">Plantea la duda vía chat</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-600">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Paso 2</span>
            <strong className="text-white block">Búsqueda en Google Drive</strong>
            <span className="text-[10px] text-slate-400">Lee apuntes docentes y circulares</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-600">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">Paso 3</span>
            <strong className="text-white block">Modelo IA Gemini 3.6</strong>
            <span className="text-[10px] text-slate-400">Genera la respuesta contextualizada</span>
          </div>

        </div>
      </div>

      {/* Interactive Sandbox for Prompt Engineering */}
      <div className="p-5 rounded-xl bg-indigo-950/30 border border-indigo-900/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-300" />
          <h3 className="text-sm font-bold text-indigo-200">
            Experimento Interactivo: El Impacto de los Datos de Google Drive
          </h3>
        </div>
        <p className="text-xs text-indigo-300/80 mb-4">
          Comprobá la diferencia entre realizarle una consulta a la IA con o sin la base de conocimientos oficial de la Escuela N° 2702 EMAL.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-indigo-200 mb-1">Pregunta de prueba:</label>
            <input
              type="text"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-indigo-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-xs text-indigo-200 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDriveContext}
                onChange={(e) => setIncludeDriveContext(e.target.checked)}
                className="rounded border-indigo-800 bg-slate-950 text-emerald-500 focus:ring-0"
              />
              <span>Inyectar contexto de carpetas Google Drive (Recomendado)</span>
            </label>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="ml-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimulating ? 'Procesando...' : 'Probar Algoritmo'}</span>
            </button>
          </div>

          {simulatedResult && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-indigo-900/80 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
              {simulatedResult}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
