import React from 'react';
import {
  Calculator,
  Cpu,
  BookOpen,
  HeartPulse,
  Globe2,
  Leaf,
  Laptop,
  Languages,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SubjectType } from '../types';

interface EducationalSectionProps {
  onSelectPrompt: (prompt: string, subject: SubjectType) => void;
  activeSubject?: SubjectType;
  setActiveSubject: (subject: SubjectType) => void;
}

export const EducationalSection: React.FC<EducationalSectionProps> = ({
  onSelectPrompt,
  activeSubject,
  setActiveSubject
}) => {
  const [selectedModule, setSelectedModule] = React.useState<string>('todos');

  // Exact 8 visible subjects requested by Escuela N° 2702 EMAL
  const subjects = [
    {
      id: 'nuevas_tecnologias' as SubjectType,
      title: 'Nuevas Tecnologías',
      teacher: 'Prof. Roa Nicolás',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-600',
      modules: ['Módulo 1', 'Módulo 2'],
      description: 'Hardware, software, almacenamiento en Google Drive, seguridad digital y prevención de phishing.',
      quickPrompts: [
        '¿Cuál es la diferencia entre Hardware y Software con ejemplos?',
        '¿Cómo protegerme del Phishing y usar contraseñas seguras?',
        '¿Para qué sirve Google Drive y qué enseña el Prof. Roa Nicolás?'
      ]
    },
    {
      id: 'matematicas' as SubjectType,
      title: 'Matemáticas',
      teacher: 'Prof. Zaneta Sebastián',
      icon: Calculator,
      color: 'from-amber-500 to-orange-600',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: '1° y 2° año de secundaria: números enteros, fracciones, porcentajes, regla de tres, ecuaciones y geometría.',
      quickPrompts: [
        'Explicar números enteros, regla de signos y operaciones combinadas',
        '¿Cómo resolver ecuaciones de primer grado con un ejemplo cotidiano?',
        '¿Cómo calcular porcentajes, regla de tres, perímetro y área?'
      ]
    },
    {
      id: 'lengua' as SubjectType,
      title: 'Lengua',
      teacher: 'Prof. Evans Erika',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: '1° y 2° año de secundaria: comprensión lectora, tipos de texto, nota formal, conectores y acentuación.',
      quickPrompts: [
        'Estrategias de comprensión lectora y tipos de texto (expositivo y argumentativo)',
        'Reglas de acentuación (agudas, graves y esdrújulas) con ejemplos',
        '¿Cómo redactar una nota formal y usar conectores textuales?'
      ]
    },
    {
      id: 'ingles' as SubjectType,
      title: 'Inglés',
      teacher: 'Equipo Docente EMAL',
      icon: Languages,
      color: 'from-sky-500 to-indigo-600',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: 'Saludos, presentación personal, verbo To Be y vocabulario básico laboral y tecnológico.',
      quickPrompts: [
        '¿Cómo se usa el verbo To Be (am, is, are) con ejemplos simples?',
        'Vocabulario básico de inglés usado en tecnología y trabajo',
        'Frases útiles para presentarse en inglés'
      ]
    },
    {
      id: 'ciencias_sociales' as SubjectType,
      title: 'Cs. Sociales',
      teacher: 'Equipo Docente EMAL',
      icon: Globe2,
      color: 'from-indigo-500 to-purple-600',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: 'Constitución Nacional, derechos laborales (Art. 14 bis), historia argentina y participación ciudadana.',
      quickPrompts: [
        '¿Qué derechos contempla el Artículo 14 bis de la Constitución?',
        '¿Cómo influyen las instituciones comunitarias en la democracia?',
        'Resumen de la evolución de los derechos de los trabajadores'
      ]
    },
    {
      id: 'ciencias_naturales' as SubjectType,
      title: 'Cs. Naturales',
      teacher: 'Prof. Mundaca Yamila',
      icon: Leaf,
      color: 'from-lime-500 to-green-600',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: '1° y 2° año de secundaria: la célula, niveles de organización, ecosistemas, estados de la materia y salud.',
      quickPrompts: [
        'Diferencia entre célula procariota y eucariota (animal y vegetal)',
        '¿Qué son los factores bióticos, abióticos y las cadenas tróficas?',
        'Estados de la materia, cambios de estado y mezclas homogéneas'
      ]
    },
    {
      id: 'educacion_fisica' as SubjectType,
      title: 'Ed. Física y Salud',
      teacher: 'Equipo Docente EMAL',
      icon: HeartPulse,
      color: 'from-rose-500 to-red-600',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: 'Ergonomía postural, pausas activas laborales, actividad física moderada e hidratación.',
      quickPrompts: [
        '¿Qué pausas activas hacer si trabajo muchas horas sentado?',
        '¿Cuál es la postura correcta para levantar peso sin dañar la espalda?',
        'Beneficios de la actividad física moderada en personas adultas'
      ]
    },
    {
      id: 'edi_plataformas' as SubjectType,
      title: 'EDI',
      teacher: 'Equipo Docente EMAL',
      icon: Laptop,
      color: 'from-violet-500 to-fuchsia-600',
      modules: ['Módulo 1', 'Módulo 2'],
      description: 'Plataformas digitales, algoritmos, dato vs. información e Inteligencia Artificial aplicada a EMALBOT.',
      quickPrompts: [
        '¿Qué es un algoritmo y cómo se aplica en EMALBOT?',
        'Diferencia entre dato e información con un ejemplo escolar',
        '¿Cómo busca EMALBOT información en Google Drive con RAG?'
      ]
    }
  ];

  const filteredSubjects =
    selectedModule === 'todos'
      ? subjects
      : subjects.filter(s => s.modules.includes(selectedModule));

  return (
    <div className="p-4 sm:p-6 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/80">
        <div>
          <div className="text-xs text-amber-300 font-semibold mb-1">
            Ciclo de Formación Básica · Módulos 1, 2, 3 y 4
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Materias de la Escuela N° 2702 EMAL
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Elegí una materia para repasar contenidos de 1° y 2° año de secundaria, consultar docentes o practicar ejercicios.
          </p>
        </div>

        {/* Module Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 overflow-x-auto self-start md:self-auto">
          {['todos', 'Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'].map((mod) => (
            <button
              key={mod}
              type="button"
              onClick={() => setSelectedModule(mod)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedModule === mod
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {mod === 'todos' ? 'Todos los Módulos' : mod}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 8 Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSubjects.map((sub) => {
          const Icon = sub.icon;
          const isSelected = activeSubject === sub.id;

          return (
            <div
              key={sub.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${sub.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {sub.modules.length === 2 ? 'Mód. 1 y 2' : 'Mód. 1 a 4'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-0.5">{sub.title}</h3>
                <p className="text-[11px] font-semibold text-sky-300 mb-2">{sub.teacher}</p>
                <p className="text-xs text-slate-400 leading-normal mb-3">{sub.description}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Consultas de muestra:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubject(sub.id);
                      onSelectPrompt(`Por favor proponé un ejercicio práctico de ${sub.title} con pista y solución.`, sub.id);
                    }}
                    className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40"
                  >
                    <Sparkles className="w-3 h-3" />
                    Ejercitar
                  </button>
                </div>

                {sub.quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveSubject(sub.id);
                      onSelectPrompt(prompt, sub.id);
                    }}
                    className="w-full text-left text-xs text-emerald-300 hover:text-white p-1.5 rounded bg-emerald-950/20 hover:bg-emerald-900/40 border border-emerald-900/30 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{prompt}</span>
                    <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
