import React from 'react';
import { X, LayoutTemplate, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { DiagramState } from '../types';
import { STARTER_TEMPLATES } from '../data/templates';

interface TemplateModalProps {
  setDiagram: React.Dispatch<React.SetStateAction<DiagramState>>;
  onClose: () => void;
  onRecordHistory: () => void;
  theme?: 'dark' | 'light';
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  setDiagram,
  onClose,
  onRecordHistory,
  theme
}) => {
  const isLight = theme === 'light';

  const handleSelectTemplate = (template: DiagramState) => {
    onRecordHistory();
    setDiagram((prev) => ({
      ...template,
      id: prev?.id || `diag_${Date.now()}`,
      version: prev?.version || 'v1.0',
      updatedAt: new Date().toISOString()
    }));
    onClose();
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 ${
      isLight ? 'bg-slate-900/60' : 'bg-black/80'
    }`}>
      <div className={`border rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#12141A] border-white/10 text-slate-200'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isLight ? 'bg-sky-100 text-sky-700' : 'bg-sky-500/20 text-sky-400'
            }`}>
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-slate-950' : 'text-slate-100'}`}>Starter Cloud Templates</h2>
              <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Load production-ready architecture patterns across AWS, Azure, GCP, OCI, and Hybrid setups
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-md transition-colors ${
              isLight ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' : 'hover:bg-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4 custom-scrollbar">
          {STARTER_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className={`border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-xl group flex flex-col justify-between ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-blue-500'
                  : 'bg-black/40 hover:bg-white/5 border-white/10 hover:border-blue-500/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      tmpl.primaryProvider === 'aws'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : tmpl.primaryProvider === 'azure'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : tmpl.primaryProvider === 'gcp'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {tmpl.primaryProvider}
                  </span>

                  <span className="text-[10px] font-mono text-slate-500">
                    {tmpl.nodes.length} Nodes • {tmpl.containers.length} Containers
                  </span>
                </div>

                <h3 className={`text-sm font-bold group-hover:text-blue-500 transition-colors ${
                  isLight ? 'text-slate-950' : 'text-slate-100'
                }`}>
                  {tmpl.title}
                </h3>

                <p className={`text-xs mt-1.5 leading-relaxed ${
                  isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                }`}>
                  {tmpl.description}
                </p>
              </div>

              <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-semibold ${
                isLight ? 'border-slate-200 text-blue-600 group-hover:text-blue-700' : 'border-white/10 text-blue-400 group-hover:text-blue-300'
              }`}>
                <span>Load Template to Canvas</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
