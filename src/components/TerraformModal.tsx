import React, { useState } from 'react';
import { X, Copy, Download, Code, Sparkles, Check, FileCode, Terminal } from 'lucide-react';
import { DiagramState } from '../types';
import { generateTerraformCode, TerraformProjectFiles } from '../utils/terraformGenerator';

interface TerraformModalProps {
  diagram: DiagramState;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const TerraformModal: React.FC<TerraformModalProps> = ({ diagram, onClose, theme }) => {
  const isLight = theme === 'light';
  const files: TerraformProjectFiles = generateTerraformCode(diagram);
  type FileKey = keyof TerraformProjectFiles;

  const [activeTab, setActiveTab] = useState<FileKey>('main.tf');
  const [copied, setCopied] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  const activeContent = files[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([activeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeTab;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    Object.entries(files).forEach(([filename, content]) => {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleAiOptimize = async () => {
    setIsOptimizing(true);
    setAiSuggestions(null);
    try {
      const response = await fetch('/api/ai/review-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagram })
      });
      const data = await response.json();
      if (data.success && data.audit) {
        setAiSuggestions(
          `### AI Infrastructure & IaC Recommendations\n\n` +
          `**Security Score:** ${data.audit.securityScore}/10 | **HA Score:** ${data.audit.haScore}/10\n\n` +
          `**Security Audit:**\n` + data.audit.securityFindings.map((f: string) => `- ${f}`).join('\n') + `\n\n` +
          `**High Availability Tips:**\n` + data.audit.haRecommendations.map((r: string) => `- ${r}`).join('\n')
        );
      }
    } catch (err) {
      console.error('AI IaC Optimization failed:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 ${
      isLight ? 'bg-slate-900/60' : 'bg-black/80'
    }`}>
      <div className={`border rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#12141A] border-white/10 text-slate-200'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-slate-950' : 'text-slate-100'}`}>
                Terraform IaC Generator
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Production Hashicorp HCL code generated from visual architecture
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAiOptimize}
              disabled={isOptimizing}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isOptimizing ? 'Auditing Code...' : 'AI Security Audit'}</span>
            </button>

            <button
              onClick={handleDownloadAll}
              className={`flex items-center space-x-1.5 border px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
              }`}
            >
              <Download className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-sky-400'}`} />
              <span>Download All (.tf)</span>
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

        {/* File Tabs Header */}
        <div className={`px-6 py-2 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-black/40 border-white/10'
        }`}>
          <div className="flex space-x-1">
            {(Object.keys(files) as FileKey[]).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setActiveTab(fileName)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === fileName
                    ? isLight
                      ? 'bg-white text-emerald-800 border border-slate-300 shadow-sm font-bold'
                      : 'bg-white/10 text-emerald-400 border border-white/10'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{fileName}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md border transition-all ${
                isLight
                  ? 'text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-100 border-slate-300 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownloadSingle}
              className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md border transition-all ${
                isLight
                  ? 'text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-100 border-slate-300 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {activeTab}</span>
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className={`flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed custom-scrollbar ${
          isLight ? 'bg-slate-50 text-slate-900 border-t border-slate-200' : 'bg-[#0E1015] text-slate-200'
        }`}>
          {aiSuggestions && (
            <div className={`mb-4 p-4 rounded-xl whitespace-pre-wrap ${
              isLight ? 'bg-purple-50 border border-purple-200 text-purple-950 font-medium' : 'bg-purple-950/40 border border-purple-800/60 text-purple-200'
            }`}>
              {aiSuggestions}
            </div>
          )}

          <pre className="selection:bg-blue-600 selection:text-white">
            <code className={isLight ? 'text-slate-900 font-medium' : 'text-slate-200'}>{activeContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
