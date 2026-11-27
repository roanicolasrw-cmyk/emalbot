import React, { useState } from 'react';
import { Bot, BookOpen, Building2, HardDrive, Presentation, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'drive' | 'stand' | 'lab';
  setActiveTab: (tab: 'chat' | 'drive' | 'stand' | 'lab') => void;
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
  driveFileCount
}) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Brand Zone with Official EMALBOT Logo */}
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm border border-slate-200 shrink-0 overflow-hidden">
              {!logoError ? (
                <img
                  src="/assets/aistudio/Logo_educativo_azul_EMALBOT_b5d3d995.png"
                  alt="Logo oficial de EMALBOT - Asistente Educativo"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Bot className="w-6 h-6 text-sky-600" />
              )}
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block leading-tight whitespace-nowrap">
                EMALBOT
              </span>
              <span className="text-xs text-slate-400 font-medium block whitespace-nowrap">
                Escuela N° 2702 EMAL · Asistente Educativo
              </span>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => {
                setActiveTab('chat');
                setActiveArea('institucional');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'chat' && activeArea === 'institucional'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Institucional</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('chat');
                setActiveArea('educativa');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'chat' && activeArea === 'educativa'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Educativa</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('drive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'drive'
                  ? 'bg-slate-800 text-sky-300 border border-sky-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Drive ({driveFileCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('lab')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'lab'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-300" />
              <span>Módulo 2: Lab IA</span>
            </button>
          </nav>

          {/* Primary Action: Stand Demo */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('stand')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 border ${
                activeTab === 'stand'
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-sky-600 hover:bg-sky-500 text-white border-sky-500'
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span>Muestra y Stand</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
