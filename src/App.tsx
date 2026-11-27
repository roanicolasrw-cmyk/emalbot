import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InstitutionalSection } from './components/InstitutionalSection';
import { EducationalSection } from './components/EducationalSection';
import { ChatArea } from './components/ChatArea';
import { DriveManager } from './components/DriveManager';
import { Module2Lab } from './components/Module2Lab';
import { StandDemoSection } from './components/StandDemoSection';
import { ChatMessage, AreaType, SubjectType, DriveStatus } from './types';
import { GraduationCap, Megaphone, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'drive' | 'stand' | 'lab'>('chat');
  const [activeArea, setActiveArea] = useState<AreaType>('institucional');
  const [activeSubject, setActiveSubject] = useState<SubjectType>('inscripciones');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([
    '¿Cuáles son los requisitos para Matrícula 2027?',
    '¿En qué horario atiende la Secretaría de la Escuela N° 2702 EMAL?',
    '¿Quiénes son los profesores de Nuevas Tecnologías, Matemáticas, Lengua y Cs. Naturales?'
  ]);

  const [driveStatus, setDriveStatus] = useState<DriveStatus>({
    connected: true,
    userEmail: 'roa@escuela2702emal.edu.ar',
    folderName: 'REG - Escuela N° 2702 EMAL',
    fileCount: 5,
    lastSync: new Date().toISOString(),
    files: []
  });

  const fetchDriveStatus = async () => {
    try {
      const res = await fetch('/api/drive/status');
      if (res.ok) {
        const data = await res.json();
        setDriveStatus(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (e) {
      console.error('Error al consultar estado de Drive:', e);
    }
  };

  useEffect(() => {
    fetchDriveStatus();
  }, []);

  const handleSendMessage = async (text: string, simplify = false, exercise = false) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
      area: activeArea,
      subject: activeSubject
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          area: activeArea,
          subject: activeSubject,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content })),
          simplifyMode: simplify,
          generateExercise: exercise
        })
      });

      if (!res.ok) {
        throw new Error('Ocurrió un error al consultar a EMALBOT');
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'model',
        content: data.text,
        timestamp: new Date(),
        area: activeArea,
        subject: activeSubject,
        sources: data.sources || [],
        ragTrace: data.ragTrace,
        isSimplerExplanation: simplify
      };

      setMessages(prev => [...prev, aiMsg]);
      if (data.suggestedFollowUps) {
        setSuggestedFollowUps(data.suggestedFollowUps);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'model',
        content:
          'Hubo un inconveniente al conectar con EMALBOT. Por favor verificá la conexión e intentalo nuevamente.',
        timestamp: new Date(),
        area: activeArea,
        subject: activeSubject
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPromptFromCards = (promptText: string, subject: SubjectType) => {
    setActiveTab('chat');
    setActiveSubject(subject);
    handleSendMessage(promptText);
  };

  const handleAddCustomDriveDoc = async (
    name: string,
    category: string,
    content: string,
    authorName?: string,
    moduleLevel?: string,
    sourceType: 'google_form' | 'drive_upload' = 'drive_upload'
  ) => {
    try {
      const res = await fetch('/api/drive/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customDocName: name,
          folderCategory: category,
          customContent: content,
          authorName,
          moduleLevel,
          sourceType
        })
      });

      if (res.ok) {
        await fetchDriveStatus();
      }
    } catch (e) {
      console.error('Error al agregar documento a Drive:', e);
    }
  };

  const handleDeleteDriveDoc = async (id: string) => {
    try {
      const res = await fetch(`/api/drive/docs/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchDriveStatus();
      }
    } catch (e) {
      console.error('Error al eliminar documento:', e);
    }
  };

  const handleResetDemo = async () => {
    try {
      const res = await fetch('/api/drive/reset-demo', { method: 'POST' });
      if (res.ok) {
        await fetchDriveStatus();
      }
    } catch (e) {
      console.error('Error al restaurar demo:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeArea={activeArea}
        setActiveArea={setActiveArea}
        driveConnected={driveStatus.connected}
        driveFileCount={driveStatus.files.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'chat' && (
          <div className="space-y-6">
            {/* Priority Home Banner: MATRÍCULA 2027 INSCRIPCIONES */}
            <section
              aria-label="Inscripciones Matrícula 2027"
              className="rounded-2xl bg-gradient-to-r from-sky-900/90 via-blue-900/80 to-slate-900 border border-sky-500/40 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                    Prioridad Cierre de Año · Escuela N° 2702 EMAL
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    MATRÍCULA 2027 — INSCRIPCIONES ABIERTAS
                  </h2>
                  <p className="text-xs sm:text-sm text-sky-100/90 mt-1">
                    Completá la preinscripción online y luego llevá la documentación de manera presencial en <strong>Güemes 710 de 19:15 a 22:00 hs</strong> (Lunes a Viernes).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScIxCNeBE2veAN4dWndcrJONM8sUaOh7UMfgRuNc7j6NOUsgw/viewform?usp=sf_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <span>Preinscripción Online</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setActiveArea('institucional');
                    setActiveSubject('inscripciones');
                    handleSendMessage('¿Cuáles son los requisitos y dónde presento la documentación para Matrícula 2027?');
                  }}
                  className="px-4 py-3 rounded-xl bg-sky-950/90 hover:bg-sky-900 border border-sky-400/40 text-sky-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <span>Consultar Requisitos</span>
                </button>
              </div>
            </section>

            {activeArea === 'institucional' ? (
              <InstitutionalSection
                onSelectPrompt={handleSelectPromptFromCards}
                activeSubject={activeSubject}
                setActiveSubject={setActiveSubject}
              />
            ) : (
              <EducationalSection
                onSelectPrompt={handleSelectPromptFromCards}
                activeSubject={activeSubject}
                setActiveSubject={setActiveSubject}
              />
            )}

            <ChatArea
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              activeArea={activeArea}
              setActiveArea={setActiveArea}
              activeSubject={activeSubject}
              setActiveSubject={setActiveSubject}
              suggestedFollowUps={suggestedFollowUps}
            />
          </div>
        )}

        {activeTab === 'drive' && (
          <DriveManager
            driveStatus={driveStatus}
            onRefreshDrive={fetchDriveStatus}
            onAddCustomDoc={handleAddCustomDriveDoc}
            onDeleteDoc={handleDeleteDriveDoc}
            onResetDemo={handleResetDemo}
          />
        )}

        {activeTab === 'stand' && (
          <StandDemoSection
            driveStatus={driveStatus}
            onAddCustomDoc={handleAddCustomDriveDoc}
            onRefreshDrive={fetchDriveStatus}
          />
        )}

        {activeTab === 'lab' && <Module2Lab />}
      </main>

      {/* Footer (Hidden when printing A4 sheets) */}
      <footer className="no-print bg-slate-900/80 border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">
              Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos N° 2702
            </span>
          </div>
          <p className="text-slate-500">
            EMALBOT · Secretaría Lunes a Viernes de 19:15 a 22:15 hs
          </p>
        </div>
      </footer>
    </div>
  );
}
