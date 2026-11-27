import React from 'react';
import { Calculator, Cpu, BookOpen, HeartPulse, Globe2, Leaf, Laptop, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
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

  const subjects = [
    {
    {
      id: 'matematicas' as SubjectType,
      title: 'Matemáticas',
      teacher: 'Prof. SEBASTIAN ZANETA',
      icon: Calculator,
      color: 'from-amber-500 to-orange-600',
      badge: 'Formación Básica',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: 'Ecuaciones de 1er grado, porcentajes, regla de tres, problemas prácticos y economía familiar.',
      quickPrompts: [
        'Explicar el procedimiento para resolver ecuaciones de primer grado con un ejemplo',
        '¿Cómo se calcula el porcentaje de descuento en una compra?',
        'Generar un problema práctico de regla de tres aplicado al presupuesto del hogar'
      ]
    },
    {
      id: 'nuevas_tecnologias' as SubjectType,
      title: 'Nuevas Tecnologías (NTICx)',
      teacher: 'Prof. ROA NICOLAS',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-600',
      badge: 'Módulo 2 Project Lead',
      modules: ['Módulo 1', 'Módulo 2'],
      description: 'Proyecto EMALBOT, hardware, software, seguridad en redes sociales, almacenamiento en Google Drive y ciudadanía digital.',
      quickPrompts: [
        '¿Cómo funciona el proyecto EMALBOT desarrollado por los alumnos del Módulo 2?',
        '¿Cuál es la diferencia entre Hardware y Software con ejemplos cotidianos?',
        '¿Cómo protegerme del Phishing y estafas virtuales en el celular?'
      ]
    },
    {
      id: 'lengua' as SubjectType,
      title: 'Lengua y Literatura',
      teacher: 'Prof. ERIKA EVANS',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Formación Básica',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: 'Comprensión lectora, redacción de notas formales, conectores textuales y ortografía.',
      quickPrompts: [
        '¿Cómo es la estructura para redactar una nota formal a la escuela o mi trabajo?',
        '¿Cuáles son los principales conectores para unir párrafos?',
        'Estrategias para la comprensión lectora de textos explicativos'
      ]
    },
    {
      id: 'educacion_fisica' as SubjectType,
      title: 'Educación Física y Salud',
      teacher: 'Equipo Docente Ed. Física',
      icon: HeartPulse,
      color: 'from-rose-500 to-red-600',
      badge: 'Formación Básica',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: 'Ergonomía postural, pausas activas para trabajadores, hábitos saludables e hidratación.',
      quickPrompts: [
        '¿Qué ejercicios de pausas activas puedo hacer si trabajo muchas horas sentado?',
        '¿Cuál es la postura correcta para levantar objetos pesados sin dañar la espalda?',
        'Beneficios de la actividad física moderada en personas adultas'
      ]
    },
    {
      id: 'ciencias_sociales' as SubjectType,
      title: 'Ciencias Sociales',
      teacher: 'Equipo Docente Cs. Sociales',
      icon: Globe2,
      color: 'from-indigo-500 to-purple-600',
      badge: 'Formación Básica',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: 'Historia argentina contemporánea, Artículo 14 bis (derechos laborales) y Constitución Nacional.',
      quickPrompts: [
        '¿Qué derechos contempla el Artículo 14 bis de la Constitución Argentina?',
        '¿Cómo influyen las instituciones comunitarias en la vida democrática?',
        'Resumen de la evolución de los derechos de los trabajadores'
      ]
    },
    {
      id: 'ciencias_naturales' as SubjectType,
      title: 'Ciencias Naturales',
      teacher: 'Prof. YAMILA MUNDACA',
      icon: Leaf,
      color: 'from-lime-500 to-green-600',
      badge: 'Formación Básica',
      modules: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'],
      description: 'Ecosistemas locales, cuidado del agua en la Patagonia, reciclaje y prevención de la salud.',
      quickPrompts: [
        '¿Cuáles son los componentes bióticos y abióticos de un ecosistema?',
        'Importancia del uso responsable del agua en nuestra región',
        'Diferencia entre prevención primaria de la salud y tratamiento'
      ]
    },
    {
      id: 'edi_plataformas' as SubjectType,
      title: 'EDI: Plataformas Digitales',
      teacher: 'Prof. ROA NICOLAS',
      icon: Laptop,
      color: 'from-violet-500 to-fuchsia-600',
      badge: 'Formación Básica',
      modules: ['Módulo 1', 'Módulo 2'],
      description: 'Entorno de Google Classroom, uso de EMALBOT, conceptos de datos, algoritmos e Inteligencia Artificial.',
      quickPrompts: [
        '¿Qué es un algoritmo y cómo se aplica en un chatbot como EMALBOT?',
        'Diferencia entre dato e información con un ejemplo de la escuela',
        '¿Cómo consulta EMALBOT las carpetas de Google Drive de los docentes?'
      ]
    }
  ];

  const filteredSubjects = selectedModule === 'todos'
    ? subjects
    : subjects.filter(s => s.modules.includes(selectedModule));

  return (
    <div className="p-4 sm:p-6 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm mb-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
              Ciclo de Formación Básica
            </span>
            <span className="text-xs text-slate-400">• Módulos 1, 2, 3 y 4</span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Materias de Formación Básica
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Elegí una materia para consultar conceptos, resolver dudas del módulo o generar ejercicios de práctica.
          </p>
        </div>

        {/* Module Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 overflow-x-auto self-start md:self-auto">
          {['todos', 'Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'].map((mod) => (
            <button
              key={mod}
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

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                    {sub.badge}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-0.5">
                  {sub.title}
                </h3>

                {sub.teacher && (
                  <span className="text-[10px] font-bold text-sky-400 block mb-1.5">
                    Docente: {sub.teacher}
                  </span>
                )}

                {/* Modules tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {sub.modules.map(m => (
                    <span key={m} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-medium">
                      {m}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-400 leading-normal mb-3">
                  {sub.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Preguntas o ejercicios:
                  </span>
                  <button
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
                    onClick={() => {
                      setActiveSubject(sub.id);
                      onSelectPrompt(prompt, sub.id);
                    }}
                    className="w-full text-left text-xs text-emerald-300 hover:text-white p-1.5 rounded bg-emerald-950/20 hover:bg-emerald-900/40 border border-emerald-900/30 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">• {prompt}</span>
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
