import React from 'react';
import { Bot, GraduationCap, Sparkles, BookOpen, Building2, HardDrive } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'drive' | 'lab';
  setActiveTab: (tab: 'chat' | 'drive' | 'lab') => void;
  activeArea: 'institucional' | 'educativa';
  setActiveArea: (area: 'institucional' | 'educativa') => void;
  driveConnected: boolean;
  driveFileCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeArea,
  setActiveArea,
  driveConnected,
  driveFileCount
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & School Name */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 flex items-center justify-center shadow-md shadow-sky-500/20 ring-2 ring-sky-500/30 overflow-hidden shrink-0">
              <img src="/logo.png" alt="EMALBOT Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent">
                  EMALBOT
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                Escuela N° 2702 EMAL • Educación de Jóvenes y Adultos
              </p>
            </div>
          </div>

          {/* Center Area Selector (Institucional vs Educativa) */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 self-start md:self-auto">
            <button
              onClick={() => {
                setActiveTab('chat');
                setActiveArea('institucional');
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'chat' && activeArea === 'institucional'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Área Institucional</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('chat');
                setActiveArea('educativa');
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'chat' && activeArea === 'educativa'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Área Educativa</span>
            </button>
          </div>

          {/* Right Action Navigation (Drive Sync & Lab) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('drive')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                activeTab === 'drive'
                  ? 'bg-slate-800 border-sky-500/50 text-sky-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
              }`}
              title="Gestor de Google Drive"
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Google Drive</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {driveFileCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('lab')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                activeTab === 'lab'
                  ? 'bg-indigo-900/60 border-indigo-500 text-indigo-200'
                  : 'bg-indigo-950/40 border-indigo-800/60 text-indigo-300 hover:bg-indigo-900/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Módulo 2: Tecnologías Digitales</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
