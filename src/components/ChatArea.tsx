import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Send, Volume2, VolumeX, RefreshCw, FileText, Sparkles, Bot, User, CornerDownLeft, HelpCircle, BookOpen, Building2, Mic, MicOff, Check } from 'lucide-react';
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
  setActiveSubject,
  suggestedFollowUps = []
}) => {
  const [inputText, setInputText] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech Synthesis
  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMessageId === id) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
        return;
      }

      window.speechSynthesis.cancel();
      // Clean markdown tags for clear voice reading
      const cleanedText = text.replace(/[*#_\-\`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'es-AR';
      utterance.rate = 0.95;

      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);

      setSpeakingMessageId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech Recognition for Voice Input
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta entrada por voz directa. Podés escribir tu consulta en la casilla.');
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
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
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
      case 'inscripciones': return 'Inscripciones';
      case 'vacantes': return 'Vacantes';
      case 'tramites': return 'Trámites y Certificados';
      case 'horarios': return 'Horarios';
      case 'secretaria': return 'Secretaría FAQ';
      case 'matematicas': return 'Matemáticas';
      case 'nuevas_tecnologias': return 'NTICx / Tecnologías';
      case 'lengua': return 'Lengua';
      case 'educacion_fisica': return 'Educación Física y Salud';
      case 'ciencias_sociales': return 'Ciencias Sociales';
      case 'ciencias_naturales': return 'Ciencias Naturales';
      case 'edi_plataformas': return 'EDI: Plataformas / Módulo 2';
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
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Módulo: {formatSubjectName(activeSubject)}</span>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-20 h-20 rounded-2xl bg-slate-950 p-2 flex items-center justify-center mb-4 shadow-xl shadow-sky-500/20 ring-4 ring-sky-500/20">
              <img src="/logo.png" alt="EMALBOT Logo" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              ¡Hola! Soy EMALBOT
            </h3>
            <p className="text-xs max-w-md text-slate-400 mb-6 leading-relaxed">
              Tu asistente conversacional de la <strong className="text-sky-300">Escuela N° 2702 EMAL</strong>. Estoy preparado para responder dudas sobre inscripciones, trámites y acompañarte en las materias escolares.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left w-full max-w-lg">
              <button
                onClick={() => onSendMessage('¿Cuáles son los requisitos de inscripción para adultos?')}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition-all text-xs text-sky-200 flex items-center justify-between"
              >
                <span>📋 Requisitos de inscripción</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-sky-400" />
              </button>

              <button
                onClick={() => onSendMessage('¿Cómo pido un certificado de alumno regular para el trabajo?')}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition-all text-xs text-sky-200 flex items-center justify-between"
              >
                <span>📜 Certificados laborales</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-sky-400" />
              </button>

              <button
                onClick={() => {
                  setActiveArea('educativa');
                  onSendMessage('Explicar cómo resolver ecuaciones de primer grado con un ejemplo de compras');
                }}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-xs text-emerald-200 flex items-center justify-between"
              >
                <span>📐 Ecuaciones sencillas</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  setActiveArea('educativa');
                  onSendMessage('¿Qué es un algoritmo y cómo funciona EMALBOT?');
                }}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs text-indigo-200 flex items-center justify-between"
              >
                <span>Explorar Módulo 2: Tecnologías</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400" />
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
                <div className="w-8 h-8 rounded-xl bg-slate-950 p-1 flex items-center justify-center shrink-0 shadow-md border border-sky-500/30">
                  <img src="/logo.png" alt="EMALBOT" className="w-full h-full object-contain" />
                </div>
              )}

              <div className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-100 rounded-tl-none'
              }`}>
                
                {/* Subject badge for AI messages */}
                {msg.role === 'model' && (
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80 text-[10px]">
                    <span className="font-bold text-sky-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      EMALBOT • {formatSubjectName(msg.subject)}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {/* Message Body Content */}
                <div className="prose prose-invert prose-xs max-w-none space-y-2">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Sources Bar */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                    <FileText className="w-3 h-3 text-emerald-400" />
                    <span className="font-semibold text-slate-300">Fuentes respaldadas:</span>
                    {msg.sources.map((s, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-300 truncate max-w-[200px]">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons for Model Responses */}
                {msg.role === 'model' && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] flex-wrap">
                    <div className="flex items-center space-x-2">
                      <button
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
                            <VolumeX className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
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
                        onClick={() => onSendMessage(`Explicá la respuesta anterior de forma más sencilla con ejemplos de la vida diaria`, true)}
                        className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                        title="Re-explicar en términos más simples"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-400" />
                        <span>Explicar más simple</span>
                      </button>

                      {activeArea === 'educativa' && (
                        <button
                          onClick={() => onSendMessage(`Proponé un ejercicio práctico breve sobre este tema para practicar`, false, true)}
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

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-sky-600/30 flex items-center justify-center text-sky-400 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>EMALBOT está consultando los materiales de la escuela...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-ups bar */}
      {suggestedFollowUps.length > 0 && !isLoading && (
        <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap">Sugerencias:</span>
          {suggestedFollowUps.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(sug)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-300 hover:text-white whitespace-nowrap transition-colors text-[11px]"
            >
              • {sug}
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
                ? "Escribí tu consulta de inscripciones, trámites o secretaría..."
                : "Escribí tu duda sobre la materia o pedí una explicación..."
            }
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-sky-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
