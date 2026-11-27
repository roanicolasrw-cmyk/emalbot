import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Volume2,
  VolumeX,
  RefreshCw,
  FileText,
  Sparkles,
  Bot,
  User,
  CornerDownLeft,
  BookOpen,
  Building2,
  Mic,
  MicOff,
  Workflow,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ChatMessage, AreaType, SubjectType } from '../types';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, simplify?: boolean, exercise?: boolean) => void;
  isLoading: boolean;
  activeArea: AreaType;
  setActiveArea: (area: AreaType) => void;
  activeSubject?: SubjectType;
  setActiveSubject: (subject: SubjectType) => void;
  suggestedFollowUps?: string[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeArea,
  setActiveArea,
  activeSubject,
  suggestedFollowUps = []
}) => {
  const [inputText, setInputText] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMessageId === id) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const cleanedText = text.replace(new RegExp('[*#_\\\\-`]', 'g'), '');
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'es-AR';
      utterance.rate = 0.95;

      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);

      setSpeakingMessageId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-AR';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const formatSubjectName = (sub?: SubjectType) => {
    switch (sub) {
      case 'inscripciones': return 'Matrícula 2027 · Inscripciones';
      case 'vacantes': return 'Vacantes';
      case 'tramites': return 'Trámites y Certificados';
      case 'horarios': return 'Horarios (19:15 a 22:15 hs)';
      case 'secretaria': return 'Secretaría FAQ';
      case 'docentes': return 'Equipo Docente';
      case 'matematicas': return 'Matemáticas (Prof. Zaneta Sebastián)';
      case 'nuevas_tecnologias': return 'Nuevas Tecnologías (Prof. Roa Nicolás)';
      case 'lengua': return 'Lengua (Prof. Evans Erika)';
      case 'ingles': return 'Inglés';
      case 'educacion_fisica': return 'Ed. Física y Salud';
      case 'ciencias_sociales': return 'Cs. Sociales';
      case 'ciencias_naturales': return 'Cs. Naturales (Prof. Mundaca Yamila)';
      case 'edi_plataformas': return 'EDI';
      default: return activeArea === 'institucional' ? 'Secretaría' : 'General';
    }
  };

  return (
    <div className="flex flex-col h-[680px] bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Top Context Sub-Header */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-medium">Área Activa:</span>
          <button
            type="button"
            onClick={() => setActiveArea('institucional')}
            className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
              activeArea === 'institucional'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3 h-3" /> Institucional
          </button>
          <button
            type="button"
            onClick={() => setActiveArea('educativa')}
            className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
              activeArea === 'educativa'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3 h-3" /> Educativa
          </button>
        </div>

        <div className="text-slate-400 text-[11px] font-medium hidden sm:flex items-center gap-1.5">
          <span>Tema: {formatSubjectName(activeSubject)}</span>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-20 h-20 rounded-2xl bg-white p-1.5 flex items-center justify-center mb-4 shadow-xl ring-2 ring-sky-500/30 overflow-hidden">
              {!logoError ? (
                <img
                  src="/assets/aistudio/Logo_educativo_azul_EMALBOT_b5d3d995.png"
                  alt="EMALBOT Asistente Educativo"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Bot className="w-10 h-10 text-sky-600" />
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              ¡Hola! Soy EMALBOT
            </h3>
            <p className="text-xs max-w-md text-slate-400 mb-6 leading-relaxed">
              Tu asistente de la <strong className="text-sky-300">Escuela N° 2702 EMAL</strong>. Consultá sobre <strong>Matrícula 2027</strong> (Secretaría 19:15 a 22:15 hs) o repasá contenidos de Matemáticas, Lengua, Nuevas Tecnologías y Cs. Naturales.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left w-full max-w-lg">
              <button
                type="button"
                onClick={() => onSendMessage('¿Cuáles son los requisitos para Matrícula 2027?')}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition-all text-xs text-sky-200 flex items-center justify-between"
              >
                <span>Requisitos Matrícula 2027</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onSendMessage('¿Quién es el profesor de Nuevas Tecnologías?')}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition-all text-xs text-sky-200 flex items-center justify-between"
              >
                <span>Profesor de Nuevas Tecnologías</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveArea('educativa');
                  onSendMessage('Explicar números enteros, ecuaciones y porcentajes de Matemáticas 1° y 2° año');
                }}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-xs text-emerald-200 flex items-center justify-between"
              >
                <span>Matemáticas 1° y 2° año</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveArea('educativa');
                  onSendMessage('¿Qué temas vemos en Cs. Naturales (la célula y ecosistemas) y en Lengua (comprensión lectora y acentuación)?');
                }}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs text-indigo-200 flex items-center justify-between"
              >
                <span>Cs. Naturales y Lengua</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              </button>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-white p-0.5 flex items-center justify-center shrink-0 shadow-md overflow-hidden border border-slate-200">
                  {!logoError ? (
                    <img
                      src="/assets/aistudio/Logo_educativo_azul_EMALBOT_b5d3d995.png"
                      alt="EMALBOT"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Bot className="w-4 h-4 text-sky-600" />
                  )}
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80 text-[11px]">
                    <span className="font-bold text-sky-400">
                      EMALBOT · {formatSubjectName(msg.subject)}
                    </span>
                    <span className="text-slate-500 font-mono tabular-nums">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                <div className="prose prose-invert prose-xs max-w-none space-y-2">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Sources Bar */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                    <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-slate-300">Fuentes RAG:</span>
                    <span className="text-slate-400">
                      {msg.sources.slice(0, 3).join(' · ')}
                    </span>
                  </div>
                )}

                {/* Expandable Live RAG Inspector */}
                {msg.role === 'model' && msg.ragTrace && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)
                      }
                      className="text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5"
                    >
                      <Workflow className="w-3.5 h-3.5" />
                      <span>
                        Ver Proceso RAG en Vivo ({msg.ragTrace.matchedDocuments.length} documentos recuperados · {msg.ragTrace.processingMs} ms)
                      </span>
                      {expandedTraceId === msg.id ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {expandedTraceId === msg.id && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-[11px] text-slate-300">
                        <div>
                          <span className="text-slate-400 font-semibold">1. Palabras clave extraídas: </span>
                          <span className="font-mono text-sky-300">
                            {msg.ragTrace.keywords.length > 0 ? msg.ragTrace.keywords.join(', ') : '(consulta general)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold">2. Documentos escaneados: </span>
                          <span className="font-mono tabular-nums text-emerald-300">
                            {msg.ragTrace.driveDocsScanned} en Drive + {msg.ragTrace.totalDocsScanned - msg.ragTrace.driveDocsScanned} en Base Institucional
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">3. Coincidencias recuperadas por relevancia:</span>
                          {msg.ragTrace.matchedDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-2 rounded-lg bg-slate-950 border border-slate-800"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-white truncate">{doc.title}</span>
                                <span className="font-mono tabular-nums text-amber-300 shrink-0">
                                  Puntaje: {doc.score}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {doc.sourceType === 'google_form_drive'
                                  ? 'Formulario Google -> Drive'
                                  : doc.sourceType === 'drive'
                                  ? 'Google Drive REG'
                                  : 'Base Institucional'}{' '}
                                · {doc.category}
                              </div>
                              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                                {doc.excerpt}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons for Model Responses */}
                {msg.role === 'model' && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] flex-wrap">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 font-medium ${
                          speakingMessageId === msg.id
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Escuchar respuesta en voz alta"
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-sky-400" />
                            <span>Detener</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Escuchar</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onSendMessage(
                            'Explicá la respuesta anterior de forma más sencilla con ejemplos de la vida diaria',
                            true
                          )
                        }
                        className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                        title="Re-explicar en términos más simples"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-400" />
                        <span>Explicar más simple</span>
                      </button>

                      {activeArea === 'educativa' && (
                        <button
                          type="button"
                          onClick={() =>
                            onSendMessage(
                              'Proponé un ejercicio práctico breve sobre este tema para practicar',
                              false,
                              true
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 transition-all flex items-center gap-1 font-semibold"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>Ejercicio de práctica</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 border border-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/assets/aistudio/Logo_educativo_azul_EMALBOT_b5d3d995.png"
                alt="EMALBOT cargando"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>EMALBOT está consultando las carpetas de Google Drive (RAG)...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-ups bar */}
      {suggestedFollowUps.length > 0 && !isLoading && (
        <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap">
            Sugerencias:
          </span>
          {suggestedFollowUps.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const isSimplify = /sencill|simpl|facil/i.test(sug);
                const isEx = /ejercicio|practica/i.test(sug);
                onSendMessage(sug, isSimplify, isEx);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-300 hover:text-white whitespace-nowrap transition-colors text-[11px]"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Escribir por voz"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeArea === 'institucional'
                ? 'Escribí tu consulta de Matrícula 2027, trámites o secretaría (19:15 a 22:15 hs)...'
                : 'Escribí tu duda sobre Matemáticas, Lengua, Nuevas Tecnologías, Cs. Naturales...'
            }
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
