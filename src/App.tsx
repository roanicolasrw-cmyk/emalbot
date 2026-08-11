import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InstitutionalSection } from './components/InstitutionalSection';
import { EducationalSection } from './components/EducationalSection';
import { ChatArea } from './components/ChatArea';
import { DriveManager } from './components/DriveManager';
import { Module2Lab } from './components/Module2Lab';
import { ChatMessage, AreaType, SubjectType, DriveStatus } from './types';
import { GraduationCap, Heart, Sparkles, Building2, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'drive' | 'lab'>('chat');
  const [activeArea, setActiveArea] = useState<AreaType>('institucional');
  const [activeSubject, setActiveSubject] = useState<SubjectType>('inscripciones');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([
    "¿Cuáles son los requisitos de inscripción para mayores de 18 años?",
    "¿Qué documentos necesito para armar mi legajo?",
    "¿En qué horario atiende la Secretaría de la Escuela N° 2702 EMAL?"
  ]);

  const [driveStatus, setDriveStatus] = useState<DriveStatus>({
    connected: false,
    userEmail: "",
    folderName: "Google Drive - Escuela N° 2702 EMAL",
    fileCount: 0,
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
        isSimplerExplanation: simplify
      };

      setMessages(prev => [...prev, aiMsg]);
      if (data.suggestedFollowUps) {
        setSuggestedFollowUps(data.suggestedFollowUps);
      }
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'model',
        content: 'Hubo un inconveniente al conectar con EMALBOT. Por favor verificá la conexión e intentalo nuevamente.',
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

  const handleAddCustomDriveDoc = async (name: string, category: string, content: string) => {
    try {
      const res = await fetch('/api/drive/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customDocName: name,
          folderCategory: category,
          customContent: content
        })
      });

      if (res.ok) {
        await fetchDriveStatus();
      }
    } catch (e) {
      console.error('Error al agregar documento a Drive:', e);
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
        
        {/* Render Active View Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            
            {/* Context Quick Cards Section (Institucional vs Educativa) */}
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

            {/* Conversational Chat Interface */}
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
          />
        )}

        {activeTab === 'lab' && (
          <Module2Lab />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos N° 2702</span>
          </div>
          <p className="text-slate-500">
            EMALBOT • Herramienta de orientación y acompañamiento autónomo
          </p>
        </div>
      </footer>

    </div>
  );
}
