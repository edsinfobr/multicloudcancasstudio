import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import { DiagramState, SecurityAuditResult } from '../types';

interface AiPromptModalProps {
  mode: 'generator' | 'audit';
  diagram: DiagramState;
  setDiagram: React.Dispatch<React.SetStateAction<DiagramState>>;
  onClose: () => void;
  onRecordHistory: () => void;
  theme?: 'dark' | 'light';
}

export const AiPromptModal: React.FC<AiPromptModalProps> = ({
  mode: initialMode,
  diagram,
  setDiagram,
  onClose,
  onRecordHistory,
  theme
}) => {
  const isLight = theme === 'light';
  const [mode, setMode] = useState<'generator' | 'audit'>(initialMode);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audit state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);

  const samplePrompts = [
    'AWS 3-Tier Web App with ALB, EC2 in Auto Scaling Group, RDS PostgreSQL Multi-AZ, Redis, and CloudFront',
    'GCP Serverless Microservices with Cloud Run, Cloud SQL, Vertex AI endpoint, and BigQuery Data Warehouse',
    'Azure Multi-Region Kubernetes (AKS) cluster with Application Gateway, Cosmos DB, and Azure OpenAI',
    'OCI Enterprise Workload with OKE Cluster, Autonomous Database, Object Storage, and Vault Secrets',
    'Hybrid Multi-Cloud Setup with AWS EC2 compute, Azure OpenAI GPT-4, and GCP BigQuery analytics'
  ];

  const handleGenerateArchitecture = async (customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: activePrompt })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate architecture');
      }

      const generated = data.diagram;
      onRecordHistory();

      setDiagram((prev) => ({
        ...prev,
        title: generated.title || prev.title,
        description: generated.description || prev.description,
        primaryProvider: generated.provider || prev.primaryProvider,
        containers: generated.containers && generated.containers.length > 0 ? generated.containers : prev.containers,
        nodes: generated.nodes || [],
        links: generated.links || [],
        updatedAt: new Date().toISOString()
      }));

      onClose();
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      setError(err.message || 'Error generating architecture diagram.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/review-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagram })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete security audit');
      }

      setAuditResult(data.audit);
    } catch (err: any) {
      console.error('Audit error:', err);
      setError(err.message || 'Audit execution failed.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 ${
      isLight ? 'bg-slate-900/60' : 'bg-black/80'
    }`}>
      <div className={`border rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh] transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#12141A] border-white/10 text-slate-200'
      }`}>
        {/* Header with Mode Switcher */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'
        }`}>
          <div className={`flex items-center space-x-2 p-1 rounded-lg border ${
            isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-black/40 border-white/5'
          }`}>
            <button
              onClick={() => setMode('generator')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 ${
                mode === 'generator'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                  : isLight
                  ? 'text-slate-700 hover:text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Prompt Generator</span>
            </button>

            <button
              onClick={() => {
                setMode('audit');
                if (!auditResult) handleRunAudit();
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 ${
                mode === 'audit'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                  : isLight
                  ? 'text-slate-700 hover:text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Security & HA Audit</span>
            </button>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {error && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
              isLight ? 'bg-red-50 border-red-200 text-red-700 font-medium' : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MODE 1: PROMPT GENERATOR */}
          {mode === 'generator' && (
            <>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  isLight ? 'text-slate-900' : 'text-slate-300'
                }`}>
                  Describe the Cloud Architecture you want to build
                </label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a fault-tolerant AWS web application with ALB, EC2 auto-scaling group, RDS Multi-AZ, S3 bucket for static assets, and CloudFront CDN..."
                  className={`w-full border focus:border-blue-500 rounded-xl p-3.5 text-xs outline-none leading-relaxed ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
                      : 'bg-black/40 border-white/10 text-slate-100 placeholder-slate-500'
                  }`}
                />
              </div>

              {/* Sample Presets */}
              <div>
                <span className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${
                  isLight ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  Or choose a quick architectural preset:
                </span>
                <div className="space-y-2">
                  {samplePrompts.map((sPrompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPrompt(sPrompt)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between group ${
                        isLight
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                          : 'bg-black/20 hover:bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      <span className="truncate pr-2 font-medium">{sPrompt}</span>
                      <Lightbulb className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isLight ? 'text-amber-600 group-hover:text-amber-700' : 'text-amber-400 group-hover:text-amber-300'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleGenerateArchitecture()}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>{isGenerating ? 'Designing Architecture Diagram with Gemini...' : 'Generate Diagram'}</span>
                </button>
              </div>
            </>
          )}

          {/* MODE 2: ARCHITECTURE SECURITY & HA AUDIT */}
          {mode === 'audit' && (
            <>
              {isAuditing ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-300">
                    Running Senior Cloud Architect Security & Availability Review...
                  </p>
                </div>
              ) : auditResult ? (
                <div className="space-y-5">
                  {/* Rating Scores */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">HA Score</span>
                      <span className="text-2xl font-black text-emerald-400 mt-1 block">
                        {auditResult.haScore} / 10
                      </span>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Security Score</span>
                      <span className="text-2xl font-black text-blue-400 mt-1 block">
                        {auditResult.securityScore} / 10
                      </span>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Cost Efficiency</span>
                      <span className="text-2xl font-black text-amber-400 mt-1 block">
                        {auditResult.costScore} / 10
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Audit Executive Summary
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{auditResult.summary}</p>
                  </div>

                  {/* Security Findings */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Security & Compliance Recommendations</span>
                    </div>
                    <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-300">
                      {auditResult.securityFindings.map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </div>

                  {/* High Availability Recommendations */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>High Availability & Fault Tolerance Improvements</span>
                    </div>
                    <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-300">
                      {auditResult.haRecommendations.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
