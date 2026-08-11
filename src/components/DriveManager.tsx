import React, { useState } from 'react';
import { HardDrive, RefreshCw, FileText, CheckCircle, Plus, Folder, Search, Cloud, ExternalLink, ShieldCheck } from 'lucide-react';
import { DriveStatus } from '../types';

interface DriveManagerProps {
  driveStatus: DriveStatus;
  onRefreshDrive: () => void;
  onAddCustomDoc: (name: string, category: string, content: string) => Promise<void>;
}

export const DriveManager: React.FC<DriveManagerProps> = ({
  driveStatus,
  onRefreshDrive,
  onAddCustomDoc
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newCategory, setNewCategory] = useState('Matemáticas');
  const [newContent, setNewContent] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSync = async () => {
    setIsSyncing(true);
    await onRefreshDrive();
    setTimeout(() => {
      setIsSyncing(false);
      setSuccessMsg('Base de datos sincronizada correctamente con Google Drive.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1200);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName || !newContent) return;
    setIsSyncing(true);
    await onAddCustomDoc(newDocName, newCategory, newContent);
    setIsSyncing(false);
    setShowAddModal(false);
    setNewDocName('');
    setNewContent('');
    setSuccessMsg(`Documento "${newDocName}" agregado exitosamente a la base de conocimiento.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const filteredFiles = driveStatus.files.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.folderCategory && f.folderCategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-slate-900/90 rounded-2xl border border-slate-800 text-white shadow-xl">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Gestor de Google Drive
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> OAuth 2.0 Conectado
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              EMALBOT indexa los materiales docentes organizados en las carpetas de Google Drive de la escuela.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Drive'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Apunte / Material</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Account Info Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Cuenta Administradora:</span>
          <div className="text-sm font-semibold text-sky-300 mt-1 truncate">
            {driveStatus.userEmail || "roa@escuela2702emal.edu.ar"}
          </div>
          <span className="text-[10px] text-slate-400">Dominio: @escuela2702emal.edu.ar</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Estructura REG Drive:</span>
          <div className="text-sm font-semibold text-emerald-300 mt-1 truncate flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>REG - Escuela N° 2702 EMAL</span>
          </div>
          <span className="text-[10px] text-slate-400">Secretaría y Formación Básica (Módulos 1 a 4)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Permisos de Carga:</span>
          <div className="text-sm font-semibold text-amber-300 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>@escuela2702emal.edu.ar</span>
          </div>
          <span className="text-[10px] text-slate-400">Habilitado para todos los docentes</span>
        </div>
      </div>

      {/* REG Drive Directory Hierarchy */}
      <div className="mb-8 p-5 bg-slate-950/80 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Folder className="w-4.5 h-4.5 text-amber-400" />
              Estructura REG de Google Drive de la Escuela
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cada docente puede ingresar con su correo <strong className="text-sky-300 font-semibold">@escuela2702emal.edu.ar</strong> y subir material en su respectiva carpeta.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Estructura Creada
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {driveStatus.folders ? (
            driveStatus.folders.map((folder, idx) => (
              <div key={idx} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-1">
                    <Folder className="w-4 h-4 fill-amber-400/20" />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-2">
                    {folder.category}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Acceso:</span>
                  <span className="text-sky-300 font-mono font-medium">{folder.allowedUsers.includes('@') ? '@escuela2702emal.edu.ar' : folder.allowedUsers}</span>
                </div>
              </div>
            ))
          ) : (
            [
              { name: "SECRETARIA", cat: "Área Institucional" },
              { name: "MATEMATICAS", cat: "Matemáticas" },
              { name: "NUEVAS TECNOLOGIAS", cat: "Nuevas Tecnologías" },
              { name: "LENGUA", cat: "Lengua" },
              { name: "EDUCACION FISICA Y SALUD", cat: "Ed. Física" },
              { name: "CIENCIAS SOCIALES", cat: "Cs. Sociales" },
              { name: "CIENCIAS NATURALES", cat: "Cs. Naturales" },
              { name: "EDI PLATAFORMAS DIGITALES", cat: "EDI Plataformas" }
            ].map((f, i) => (
              <div key={i} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center space-x-2 text-xs text-amber-300 font-semibold">
                <Folder className="w-4 h-4 text-amber-400" />
                <span>{f.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Search & File List */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Materiales y Guías Docentes Sincronizadas
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por archivo o materia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre del Archivo</th>
                <th className="px-4 py-3 font-semibold">Carpeta / Categoría</th>
                <th className="px-4 py-3 font-semibold">Estado de Indexación</th>
                <th className="px-4 py-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-200 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="truncate max-w-xs sm:max-w-md">{file.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
                      {file.folderCategory || 'General'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Sincronizado</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-slate-500 text-[10px]">Listo para EMALBOT</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding custom note */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              Cargar Nuevo Material Pedagógico
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ingresá el título y contenido del apunte para que EMALBOT lo integre a las respuestas de los estudiantes.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Apunte o Documento:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Guia_Matematicas_Porcentajes_Modulo2.pdf"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Materia / Carpeta:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Área Institucional">Área Institucional</option>
                  <option value="Matemáticas">Matemáticas</option>
                  <option value="Nuevas Tecnologías">Nuevas Tecnologías</option>
                  <option value="Lengua">Lengua</option>
                  <option value="Educación Física y Salud">Educación Física y Salud</option>
                  <option value="Ciencias Sociales">Ciencias Sociales</option>
                  <option value="Ciencias Naturales">Ciencias Naturales</option>
                  <option value="EDI: Plataformas Digitales">EDI: Plataformas Digitales</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contenido / Texto Explicativo:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escribí los conceptos clave, ejemplos o ejercicios que el docente preparó..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold"
                >
                  Guardar e Indexar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
