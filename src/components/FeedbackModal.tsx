import React, { useState } from 'react';
import { Mail, MessageSquare, Bug, Lightbulb, Sparkles, Heart, Copy, Check, ExternalLink, X, Send } from 'lucide-react';
import { DiagramState } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagram?: DiagramState;
  theme?: 'dark' | 'light';
}

type FeedbackType = 'bug' | 'feature' | 'tip' | 'compliment';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  diagram,
  theme = 'dark'
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<FeedbackType>('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [includeTechInfo, setIncludeTechInfo] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const targetEmail = 'edsinfobr@gmail.com';

  const feedbackTypes = [
    {
      id: 'bug',
      label: 'Relatar Erro / Bug',
      icon: Bug,
      color: 'text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20',
      defaultSubject: '[MultiCloud Canvas Bug] '
    },
    {
      id: 'feature',
      label: 'Sugestão de Recurso',
      icon: Lightbulb,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20',
      defaultSubject: '[MultiCloud Canvas Sugestão] '
    },
    {
      id: 'tip',
      label: 'Dica ou Melhoria',
      icon: Sparkles,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20',
      defaultSubject: '[MultiCloud Canvas Dica] '
    },
    {
      id: 'compliment',
      label: 'Elogio / Feedback',
      icon: Heart,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20',
      defaultSubject: '[MultiCloud Canvas Feedback] '
    }
  ];

  const handleSelectType = (newType: FeedbackType) => {
    setType(newType);
    const item = feedbackTypes.find((t) => t.id === newType);
    if (item && (!subject || feedbackTypes.some((t) => subject.startsWith(t.defaultSubject)))) {
      setSubject(item.defaultSubject);
    }
  };

  const getFullBodyText = () => {
    let text = message.trim() || '(Sua mensagem aqui)';

    if (userName.trim()) {
      text += `\n\n---\nEnviado por: ${userName.trim()}`;
    }

    if (includeTechInfo && diagram) {
      const providers = Array.from(new Set(diagram.nodes.map((n) => n.provider.toUpperCase()))).join(', ') || 'Nenhum';
      text += `\n\n=== Informações Técnicas da Arquitetura ===\n`;
      text += `Projeto: ${diagram.title || 'Untitled'}\n`;
      text += `Provedor Principal: ${diagram.primaryProvider.toUpperCase()}\n`;
      text += `Total de Componentes: ${diagram.nodes.length}\n`;
      text += `Total de Conexões: ${diagram.links.length}\n`;
      text += `Provedores Presentes: ${providers}\n`;
      text += `Navegador: ${navigator.userAgent}\n`;
      text += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
    }

    return text;
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSubject = subject.trim() || `[MultiCloud Canvas Feedback] ${type.toUpperCase()}`;
    const bodyText = getFullBodyText();

    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyFormattedText = () => {
    const finalSubject = subject.trim() || `[MultiCloud Canvas Feedback] ${type.toUpperCase()}`;
    const fullText = `Para: ${targetEmail}\nAssunto: ${finalSubject}\n\n${getFullBodyText()}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleCopyEmailAddress = () => {
    navigator.clipboard.writeText(targetEmail).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    });
  };

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#12141A] border-white/15 text-slate-200'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-white/10'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-xl border border-blue-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Enviar Feedback / Reportar Erro
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Envie suas dúvidas, erros, sugestões ou elogios diretamente ao mantenedor.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSendEmail} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Target Email Box */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            isLight ? 'bg-blue-50/60 border-blue-200' : 'bg-blue-950/30 border-blue-500/20'
          }`}>
            <div className="flex items-center space-x-2 text-xs">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                Destinatário: <strong className={isLight ? 'text-blue-950' : 'text-blue-300'}>{targetEmail}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyEmailAddress}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center space-x-1 border transition-colors ${
                isLight
                  ? 'bg-white hover:bg-blue-100 border-blue-300 text-blue-900'
                  : 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-300'
              }`}
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar E-mail</span>
                </>
              )}
            </button>
          </div>

          {/* Type Selection */}
          <div>
            <label className={`block text-xs font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Tipo de Mensagem
            </label>
            <div className="grid grid-cols-2 gap-2">
              {feedbackTypes.map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectType(t.id as FeedbackType)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                      isSelected
                        ? isLight
                          ? 'bg-blue-100 border-blue-500 text-blue-950 shadow-sm ring-1 ring-blue-500'
                          : 'bg-blue-600/30 border-blue-400 text-white shadow-md ring-1 ring-blue-400'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? (isLight ? 'text-blue-700' : 'text-blue-300') : 'text-slate-400'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Name */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Seu Nome / Identificação <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ex: João Silva ou @edsinfobr"
              className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                  : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Subject */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Assunto do E-mail
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto do e-mail"
              className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                  : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Message Area */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Mensagem / Descrição Detalhada
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva o erro ocorrido, sua sugestão de nova funcionalidade ou feedback para a plataforma..."
              className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors custom-scrollbar ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                  : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Include Tech Info Checkbox */}
          {diagram && (
            <label className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-colors ${
              isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-black/20 border-white/10 hover:bg-white/5'
            }`}>
              <input
                type="checkbox"
                checked={includeTechInfo}
                onChange={(e) => setIncludeTechInfo(e.target.checked)}
                className="mt-0.5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className={`font-semibold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Anexar resumo técnico do projeto no e-mail
                </span>
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Inclui título da arquitetura ("{diagram.title}"), nº de nós, conexões e versão do navegador para diagnóstico.
                </span>
              </div>
            </label>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleCopyFormattedText}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border transition-colors ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copiar Conteúdo</span>
                </>
              )}
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Enviar por E-mail</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
