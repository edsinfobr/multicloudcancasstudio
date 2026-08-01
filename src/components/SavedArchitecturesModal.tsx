import React, { useEffect, useState } from 'react';
import { FolderOpen, Trash2, Calendar, HardDrive, Plus, X, ArrowRight, Layers } from 'lucide-react';
import { DiagramState } from '../types';
import { getSavedArchitectures, deleteSavedArchitecture, SavedArchitectureItem } from '../utils/storageUtils';

interface SavedArchitecturesModalProps {
  onLoadDiagram: (diagram: DiagramState) => void;
  onNewDiagram: () => void;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const SavedArchitecturesModal: React.FC<SavedArchitecturesModalProps> = ({
  onLoadDiagram,
  onNewDiagram,
  onClose,
  theme
}) => {
  const isLight = theme === 'light';
  const [items, setItems] = useState<SavedArchitectureItem[]>([]);

  useEffect(() => {
    setItems(getSavedArchitectures());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta arquitetura salva?')) {
      const updated = deleteSavedArchitecture(id);
      setItems(updated);
    }
  };

  const handleSelect = (item: SavedArchitectureItem) => {
    onLoadDiagram(item.diagram);
    onClose();
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 ${
      isLight ? 'bg-slate-900/60' : 'bg-black/80'
    }`}>
      <div className={`border rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#12141A] border-white/10 text-slate-200'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-600/20 text-blue-400'
            }`}>
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-sm font-bold tracking-wide ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Minhas Arquiteturas Salvas
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Gerencie e recarregue seus projetos de arquitetura salvos
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onNewDiagram();
                onClose();
              }}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Arquitetura</span>
            </button>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-md transition-colors ${
                isLight ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' : 'hover:bg-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {items.length === 0 ? (
            <div className={`py-16 text-center space-y-3 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              <HardDrive className={`w-10 h-10 mx-auto ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
              <p className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Nenhuma arquitetura salva localmente ainda.</p>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
                Clique no menu "Arquitetura &gt; Salvar Arquitetura" no topo para salvar sua especificação atual.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-blue-500'
                      : 'bg-black/40 hover:bg-white/5 border-white/10 hover:border-blue-500/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border flex items-center space-x-1 ${
                        isLight
                          ? 'bg-blue-100 text-blue-800 border-blue-200 font-bold'
                          : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                      }`}>
                        <Layers className="w-3 h-3" />
                        <span>{item.nodeCount} Recursos</span>
                      </span>

                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        title="Excluir Arquitetura"
                        className={`p-1 rounded transition-colors ${
                          isLight ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className={`text-sm font-bold group-hover:text-blue-500 transition-colors truncate ${
                      isLight ? 'text-slate-950' : 'text-slate-100'
                    }`}>
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className={`text-xs mt-1 line-clamp-2 ${
                        isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                      }`}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className={`mt-4 pt-2.5 border-t flex items-center justify-between text-[11px] ${
                    isLight ? 'border-slate-200 text-slate-500' : 'border-white/5 text-slate-500'
                  }`}>
                    <span className="flex items-center space-x-1">
                      <Calendar className={`w-3 h-3 ${isLight ? 'text-slate-500' : 'text-slate-600'}`} />
                      <span>{new Date(item.updatedAt).toLocaleDateString()} {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>

                    <span className={`font-semibold flex items-center space-x-1 ${
                      isLight ? 'text-blue-600 group-hover:text-blue-700' : 'text-blue-400 group-hover:text-blue-300'
                    }`}>
                      <span>Abrir</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
