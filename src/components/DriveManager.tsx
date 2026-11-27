import React, { useState } from 'react';
import {
  RefreshCw,
  FileText,
  CheckCircle,
  Plus,
  Folder,
  Search,
  Cloud,
  ShieldCheck,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { DriveStatus } from '../types';

interface DriveManagerProps {
  driveStatus: DriveStatus;
  onRefreshDrive: () => Promise<void>;
  onAddCustomDoc: (
    name: string,
    category: string,
    content: string,
    authorName?: string,
    moduleLevel?: string,
    sourceType?: 'google_form' | 'drive_upload'
  ) => Promise<void>;
  onDeleteDoc?: (id: string) => Promise<void>;
  onResetDemo?: () => Promise<void>;
}

export const DriveManager: React.FC<DriveManagerProps> = ({
  driveStatus,
  onRefreshDrive,
  onAddCustomDoc,
  onDeleteDoc,
  onResetDemo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newCategory, setNewCategory] = useState('Nuevas Tecnologías');
  const [newModuleLevel, setNewModuleLevel] = useState('Módulo 1 y 2');
  const [newAuthor, setNewAuthor] = useState('');
  const [newContent, setNewContent] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSync = async () => {
    setIsSyncing(true);
    await onRefreshDrive();
    setTimeout(() => {
      setIsSyncing(false);
      setSuccessMsg('Base de datos sincronizada correctamente con Google Drive.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 600);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName || !newContent) return;
    setIsSyncing(true);
    await onAddCustomDoc(
      newDocName,
      newCategory,
      newContent,
      newAuthor || 'Docente EMAL',
      newModuleLevel,
      'drive_upload'
    );
    setIsSyncing(false);
    setShowAddModal(false);
    setNewDocName('');
    setNewAuthor('');
    setNewContent('');
    setSuccessMsg(`Documento "${newDocName}" agregado exitosamente a la base de conocimiento.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const filteredFiles = driveStatus.files.filter(
    f =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.folderCategory && f.folderCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.contentPreview && f.contentPreview.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-slate-900/90 rounded-2xl border border-slate-800 text-white shadow-xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex flex-wrap items-center gap-2">
              <span>Gestor de Google Drive (REG)</span>
              <span className="text-xs text-emerald-300 font-medium">
                · OAuth 2.0 Conectado
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              EMALBOT indexa automáticamente los archivos subidos a las carpetas de Google Drive o cargados desde el Formulario Escolar.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onResetDemo && (
            <button
              type="button"
              onClick={async () => {
                setIsSyncing(true);
                await onResetDemo();
                setIsSyncing(false);
                setSuccessMsg('Carpetas restauradas a los documentos base de la escuela.');
                setTimeout(() => setSuccessMsg(''), 3500);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Restaurar documentos iniciales de demostración"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Base</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Drive'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all"
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
          <span className="text-[11px] font-semibold text-slate-400 block">Cuenta Administradora</span>
          <div className="text-sm font-semibold text-sky-300 mt-1 truncate">
            {driveStatus.userEmail || 'roa@escuela2702emal.edu.ar'}
          </div>
          <span className="text-xs text-slate-500">Dominio: @escuela2702emal.edu.ar</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block">Estructura REG Drive</span>
          <div className="text-sm font-semibold text-emerald-300 mt-1 truncate flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>REG - Escuela N° 2702 EMAL</span>
          </div>
          <span className="text-xs text-slate-500">Secretaría y Formación Básica (Módulos 1 a 4)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block">Permisos de Carga</span>
          <div className="text-sm font-semibold text-amber-300 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>@escuela2702emal.edu.ar</span>
          </div>
          <span className="text-xs text-slate-500">Habilitado para docentes y Secretaría</span>
        </div>
      </div>

      {/* REG Drive Directory Hierarchy */}
      <div className="mb-8 p-5 bg-slate-950/80 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" />
              Estructura REG de Google Drive de la Escuela
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cada docente puede ingresar con su correo <strong className="text-sky-300 font-semibold">@escuela2702emal.edu.ar</strong> o cargar novedades vía Formulario Google.
            </p>
          </div>
          <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Estructura Activa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {driveStatus.folders?.map((folder, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-1">
                  <Folder className="w-4 h-4 fill-amber-400/20 shrink-0" />
                  <span className="truncate">{folder.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 mb-2">{folder.category}</div>
              </div>
              <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Acceso:</span>
                <span className="text-sky-300 font-mono font-medium">
                  {folder.allowedUsers.includes('@') ? '@escuela2702emal.edu.ar' : folder.allowedUsers}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & File List */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Materiales y Novedades Indexadas ({filteredFiles.length})
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por archivo, materia o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Documento y Extracto</th>
                <th className="px-4 py-3 font-semibold">Carpeta / Origen</th>
                <th className="px-4 py-3 font-semibold">Estado RAG</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2 font-medium text-slate-200">
                      <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate max-w-xs sm:max-w-md">{file.name}</span>
                    </div>
                    {file.contentPreview && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 pl-6">
                        {file.contentPreview}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300 align-top">
                    <div className="font-semibold">{file.folderCategory || 'General'}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {file.sourceType === 'google_form' ? 'Formulario Google' : 'Carga Drive'}
                      {file.authorName ? ` · ${file.authorName}` : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Indexado</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    {onDeleteDoc && (
                      <button
                        type="button"
                        onClick={() => onDeleteDoc(file.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Eliminar documento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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
              Ingresá el título y contenido del apunte o novedad (como el profesor a cargo o fechas de examen) para que el motor RAG de EMALBOT lo indexe de inmediato.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del Apunte o Documento:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Equipo_Docente_NTICx_2026.gdoc"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Materia / Carpeta:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Área Institucional">Área Institucional (Secretaría)</option>
                    <option value="Nuevas Tecnologías">Nuevas Tecnologías (Prof. Roa Nicolás)</option>
                    <option value="Matemáticas">Matemáticas (Prof. Zaneta Sebastián)</option>
                    <option value="Lengua">Lengua (Prof. Evans Erika)</option>
                    <option value="Inglés">Inglés</option>
                    <option value="Cs. Sociales">Cs. Sociales</option>
                    <option value="Cs. Naturales">Cs. Naturales (Prof. Mundaca Yamila)</option>
                    <option value="Ed. Física y Salud">Ed. Física y Salud</option>
                    <option value="EDI">EDI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Módulo:
                  </label>
                  <select
                    value={newModuleLevel}
                    onChange={(e) => setNewModuleLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="General">General / Secretaría</option>
                    <option value="Módulo 1">Módulo 1</option>
                    <option value="Módulo 2">Módulo 2</option>
                    <option value="Módulo 1 y 2">Módulo 1 y 2</option>
                    <option value="Módulo 3">Módulo 3</option>
                    <option value="Módulo 4">Módulo 4</option>
                    <option value="Módulos 1 a 4">Módulos 1 a 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cargado por (Docente o Secretaría):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Prof. Roa Nicolás / Secretaría EMAL"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contenido / Texto Explicativo:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escribí los datos exactos (ej: El profesor de Nuevas Tecnologías es el Prof. Roa Nicolás, Módulos 1 y 2)..."
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
