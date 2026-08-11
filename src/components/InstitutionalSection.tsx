import React from 'react';
import { UserCheck, FileText, Clock, HelpCircle, AlertCircle, Building, CheckCircle2, ChevronRight } from 'lucide-react';
import { SubjectType } from '../types';

interface InstitutionalSectionProps {
  onSelectPrompt: (prompt: string, subject: SubjectType) => void;
  activeSubject?: SubjectType;
  setActiveSubject: (subject: SubjectType) => void;
}

export const InstitutionalSection: React.FC<InstitutionalSectionProps> = ({
  onSelectPrompt,
  activeSubject,
  setActiveSubject
}) => {
  const cards = [
    {
      id: 'inscripciones' as SubjectType,
      title: 'Inscripciones y Requisitos',
      icon: UserCheck,
      color: 'from-blue-500 to-sky-600',
      badge: 'Matrícula 2026',
      description: 'Documentación necesaria, plazos de inscripción y condiciones de ingreso para adultos.',
      quickPrompts: [
        '¿Cuáles son los requisitos de inscripción para mayores de 18 años?',
        '¿Qué documentación debo presentar en mi legajo?',
        '¿Cuándo abren las inscripciones para el próximo cuatrimestre?'
      ]
    },
    {
      id: 'vacantes' as SubjectType,
      title: 'Vacantes y Prioridades',
      icon: CheckCircle2,
      color: 'from-indigo-500 to-blue-600',
      badge: 'Asignación',
      description: 'Criterios institucionales de asignación de cupos y prioridades de orden de ingreso.',
      quickPrompts: [
        '¿Cómo se asignan las vacantes en la Escuela N° 2702 EMAL?',
        '¿Tienen prioridad los adultos con certificado laboral?',
        '¿Quién decide la adjudicación definitiva de las vacantes?'
      ]
    },
    {
      id: 'tramites' as SubjectType,
      title: 'Trámites y Certificados',
      icon: FileText,
      color: 'from-sky-500 to-teal-600',
      badge: 'Secretaría',
      description: 'Constancias de alumno regular, certificados de examen, pases y equivalencias.',
      quickPrompts: [
        '¿Cómo pido una constancia de alumno regular para mi trabajo?',
        '¿Cómo justifico una falta si tuve que rendir un examen?',
        '¿Cómo tramito el pase si cursé en otra escuela de adultos?'
      ]
    },
    {
      id: 'horarios' as SubjectType,
      title: 'Horarios de Atención y Clases',
      icon: Clock,
      color: 'from-teal-500 to-emerald-600',
      badge: 'Turno Noche',
      description: 'Horarios de clases (18:30 a 22:15 hs) y atención presencial de Secretaría.',
      quickPrompts: [
        '¿En qué horario atiende Secretaría y Preceptoría?',
        '¿Cuáles son los horarios de cursada del turno vespertino?',
        '¿Hay tolerancia horaria si salgo tarde de trabajar?'
      ]
    },
    {
      id: 'secretaria' as SubjectType,
      title: 'Preguntas Frecuentes',
      icon: HelpCircle,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Estudiantes',
      description: 'Respuestas a dudas comunes de ingresantes y alumnos regulares.',
      quickPrompts: [
        '¿Puedo cursar si trabajo por turnos rotativos?',
        '¿Cuánto dura el plan de estudios por módulos?',
        '¿Cómo recupero las clases si me ausento por motivos personales?'
      ]
    }
  ];

  return (
    <div className="p-4 sm:p-6 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm mb-6">
      
      {/* Disclaimer Bar */}
      <div className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 text-amber-200 text-xs leading-relaxed">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-amber-300">Aviso Institucional: </strong>
          EMALBOT brinda orientación sobre requisitos y procedimientos generales. Las decisiones finales sobre vacantes, inscripciones y certificados corresponden a la Dirección y Secretaría de la Escuela N° 2702 EMAL.
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-400" />
            Área Institucional - Consultas de Secretaría
          </h2>
          <p className="text-xs text-slate-400">
            Seleccioná un tema o elegí una consulta frecuente para realizarle a EMALBOT.
          </p>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeSubject === card.id;

          return (
            <div
              key={card.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-normal mb-3">
                  {card.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Consultas sugeridas:
                </span>
                {card.quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveSubject(card.id);
                      onSelectPrompt(prompt, card.id);
                    }}
                    className="w-full text-left text-xs text-sky-300 hover:text-white p-1.5 rounded bg-sky-950/30 hover:bg-sky-900/50 border border-sky-900/40 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">• {prompt}</span>
                    <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
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
