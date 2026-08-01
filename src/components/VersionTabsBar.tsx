import React from 'react';
import { DiagramState } from '../types';
import { GitBranch, Plus, Copy, X, Layers } from 'lucide-react';

interface VersionTabsBarProps {
  versions: DiagramState[];
  activeVersionId: string;
  onSelectVersion: (id: string) => void;
  onAddVersion: () => void;
  onDuplicateVersion: (id: string) => void;
  onDeleteVersion: (id: string) => void;
  theme?: 'dark' | 'light';
}

export const VersionTabsBar: React.FC<VersionTabsBarProps> = ({
  versions,
  activeVersionId,
  onSelectVersion,
  onAddVersion,
  onDuplicateVersion,
  onDeleteVersion,
  theme = 'dark'
}) => {
  return (
    <div
      id="version-tabs-bar"
      className={`border-t px-3 py-1 flex items-center justify-between gap-3 text-xs select-none shrink-0 z-20 overflow-x-auto transition-colors ${
        theme === 'dark'
          ? 'bg-[#0f1118] border-white/10 text-slate-300'
          : 'bg-white border-slate-200 text-slate-700 shadow-inner'
      }`}
    >
      {/* Left: Tab list containing all version tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 no-scrollbar flex-1">
        <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
          <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Versões:</span>
        </div>

        {versions.map((ver, idx) => {
          const isActive = ver.id === activeVersionId;
          const displayVer = ver.version || `v1.${idx}`;

          return (
            <div
              key={ver.id}
              id={`version-tab-${ver.id}`}
              onClick={() => onSelectVersion(ver.id)}
              className={`group relative flex items-center space-x-2 px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                isActive
                  ? theme === 'light'
                    ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-sm ring-1 ring-blue-400/30 font-bold'
                    : 'bg-blue-600/25 border-blue-500/60 text-blue-100 shadow-md ring-1 ring-blue-500/40 font-bold'
                  : theme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400'
              }`}
            >
              {/* Active Pulsing Indicator */}
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  isActive ? 'bg-blue-500 animate-pulse' : 'bg-slate-500/40'
                }`}
              />

              {/* Version Badge */}
              <span
                className={`text-[11px] font-mono px-1.5 py-0.2 rounded transition-colors ${
                  isActive
                    ? theme === 'light'
                      ? 'bg-blue-200 text-blue-900 font-extrabold'
                      : 'bg-blue-500/30 text-blue-300 font-extrabold border border-blue-400/30'
                    : 'bg-slate-200/60 dark:bg-white/10 text-slate-500 font-medium'
                }`}
              >
                {displayVer}
              </span>

              {/* Version Title Snippet */}
              <span className="truncate max-w-[120px] text-xs">
                {ver.title || 'Sem título'}
              </span>

              {/* Resource Count Badge */}
              <span className="text-[10px] opacity-60 font-mono">
                ({ver.nodes?.length || 0})
              </span>

              {/* Actions on hover */}
              <div className="flex items-center space-x-0.5 ml-1">
                {/* Duplicate version button */}
                <button
                  id={`btn-dup-tab-${ver.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateVersion(ver.id);
                  }}
                  title={`Duplicar versão ${displayVer}`}
                  className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                    theme === 'light'
                      ? 'hover:bg-blue-200 text-blue-700'
                      : 'hover:bg-blue-500/20 text-blue-300'
                  }`}
                >
                  <Copy className="w-3 h-3" />
                </button>

                {/* Delete version button (only if more than 1 version exists) */}
                {versions.length > 1 && (
                  <button
                    id={`btn-del-tab-${ver.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteVersion(ver.id);
                    }}
                    title={`Excluir versão ${displayVer}`}
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                      theme === 'light'
                        ? 'hover:bg-red-200 text-red-700'
                        : 'hover:bg-red-500/20 text-red-400'
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add New Version button */}
        <button
          id="btn-add-version-tab"
          onClick={onAddVersion}
          className={`flex items-center space-x-1 px-3 py-1 rounded-lg border border-dashed text-xs font-semibold transition-all shrink-0 ${
            theme === 'light'
              ? 'bg-blue-50/60 hover:bg-blue-100 border-blue-300 text-blue-800'
              : 'bg-blue-600/15 hover:bg-blue-600/25 border-blue-500/40 text-blue-300'
          }`}
          title="Criar nova versão da arquitetura"
        >
          <Plus className="w-3.5 h-3.5 text-blue-500" />
          <span>Nova Versão</span>
        </button>
      </div>

      {/* Right: Quick Action for Duplicating Current Active Version */}
      <div className="flex items-center space-x-2 shrink-0">
        <button
          id="btn-duplicate-active-version"
          onClick={() => onDuplicateVersion(activeVersionId)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
            theme === 'light'
              ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-300 text-indigo-950 shadow-sm'
              : 'bg-indigo-600/20 hover:bg-indigo-600/30 border-indigo-500/30 text-indigo-300'
          }`}
          title="Duplicar a versão atual para criar uma nova variação"
        >
          <Copy className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Duplicar Versão</span>
        </button>
      </div>
    </div>
  );
};
