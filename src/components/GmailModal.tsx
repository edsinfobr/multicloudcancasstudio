import React, { useState, useEffect } from 'react';
import { DiagramState } from '../types';
import { GoogleUser, authenticateWithGoogle } from '../services/googleDrive';
import { sendGmailEmail, createGmailDraft } from '../services/gmail';
import { calculateTotalCost } from '../utils/costCalculator';
import { generateTerraformCode } from '../utils/terraformGenerator';
import { Mail, Send, FileText, CheckCircle2, AlertCircle, Loader2, Paperclip, Lock, UserCheck, ShieldAlert } from 'lucide-react';

interface GmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagram: DiagramState;
  googleUser: GoogleUser | null;
  onGoogleUserChange: (user: GoogleUser | null) => void;
  theme?: 'dark' | 'light';
}

export const GmailModal: React.FC<GmailModalProps> = ({
  isOpen,
  onClose,
  diagram,
  googleUser,
  onGoogleUserChange,
  theme = 'dark'
}) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [includeTerraform, setIncludeTerraform] = useState(true);
  const [includeJsonAttachment, setIncludeJsonAttachment] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pre-fill email defaults when diagram changes
  useEffect(() => {
    if (diagram) {
      const costs = calculateTotalCost(diagram.nodes || []);
      setSubject(`[MultiCloud Canvas Studio] Arquitetura: ${diagram.title || 'Sem Título'} (${diagram.version || 'v1.0'})`);
      setCustomMessage(`Olá,\n\nSegue em anexo a especificação da arquitetura de nuvem "${diagram.title || 'Sem Título'}" (${diagram.version || 'v1.0'}).\n\nPrincipais detalhes:\n- Provedor Principal: ${(diagram.primaryProvider || 'AWS').toUpperCase()}\n- Total de Recursos: ${diagram.nodes?.length || 0}\n- Estimativa Mensal: $${costs.totalMonthly.toFixed(2)}/mês\n\nAtenciosamente,\nEquipe MultiCloud Canvas Studio`);
    }
  }, [diagram, isOpen]);

  if (!isOpen) return null;

  const totalCost = calculateTotalCost(diagram.nodes || []).totalMonthly;
  const tfFiles = generateTerraformCode(diagram);
  const mainTfCode = tfFiles['main.tf'] || '';

  // Authenticate user with Google if not logged in
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const user = await authenticateWithGoogle();
      onGoogleUserChange(user);
      setStatusMessage({ type: 'success', text: `Autenticado com sucesso como ${user.email}!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Falha na autenticação com o Google.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate HTML Email Body
  const generateEmailHtml = () => {
    const nodeRows = (diagram.nodes || []).map((node) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${node.label}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-transform: uppercase;">${node.provider}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${node.category || 'Geral'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #16a34a; font-weight: bold;">$${(node.costEstimate?.monthlyCost || 0).toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #1e293b;">
        <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #1e3a8a; font-size: 22px;">☁️ MultiCloud Canvas Studio</h2>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Relatório de Arquitetura de Nuvem</p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #0f172a;">${diagram.title || 'Sem Título'}</h3>
          <p style="margin: 0 0 12px 0; color: #475569; font-size: 14px;">${diagram.description || 'Especificação de infraestrutura em nuvem.'}</p>
          <div style="display: flex; gap: 16px; font-size: 13px; font-weight: 600;">
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px;">Versão: ${diagram.version || 'v1.0'}</span>
            <span style="background-color: #f1f5f9; color: #334155; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">Provedor: ${diagram.primaryProvider || 'AWS'}</span>
            <span style="background-color: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px;">Estimativa: $${totalCost.toFixed(2)}/mês</span>
          </div>
        </div>

        ${customMessage ? `<div style="white-space: pre-line; margin-bottom: 20px; padding: 12px; border-left: 4px solid #3b82f6; background-color: #eff6ff; font-size: 14px; color: #1e3a8a;">${customMessage}</div>` : ''}

        <h4 style="margin: 16px 0 8px 0; font-size: 15px; color: #334155;">Componentes da Infraestrutura (${diagram.nodes?.length || 0} recursos):</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 8px; border-bottom: 2px solid #cbd5e1;">Recurso</th>
              <th style="padding: 8px; border-bottom: 2px solid #cbd5e1;">Provedor</th>
              <th style="padding: 8px; border-bottom: 2px solid #cbd5e1;">Categoria</th>
              <th style="padding: 8px; border-bottom: 2px solid #cbd5e1; text-align: right;">Custo Estimado</th>
            </tr>
          </thead>
          <tbody>
            ${nodeRows || '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #94a3b8;">Nenhum componente adicionado.</td></tr>'}
          </tbody>
        </table>

        ${includeTerraform ? `
          <h4 style="margin: 16px 0 8px 0; font-size: 15px; color: #334155;">Código Terraform (IaC) Preview:</h4>
          <pre style="background-color: #0f172a; color: #38bdf8; padding: 14px; border-radius: 8px; font-size: 11px; font-family: monospace; overflow-x: auto; max-height: 200px;">${mainTfCode.substring(0, 1500)}${mainTfCode.length > 1500 ? '\n... (código completo no anexo)' : ''}</pre>
        ` : ''}

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
          Enviado através do <strong>MultiCloud Canvas Studio</strong> • Design & Documentação de Infraestrutura Cloud
        </div>
      </div>
    `;
  };

  // Submit trigger - opens explicit confirmation dialog per Workspace Integration rules
  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !recipient.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Por favor, informe um e-mail de destino válido.' });
      return;
    }
    if (!googleUser) {
      setStatusMessage({ type: 'error', text: 'Você precisa estar autenticado no Google para enviar e-mails.' });
      return;
    }

    setShowConfirmationDialog(true);
  };

  // Confirmed Send Execution via Gmail API
  const handleConfirmSendEmail = async () => {
    setShowConfirmationDialog(false);
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const htmlBody = generateEmailHtml();
      const attachmentFileName = includeJsonAttachment
        ? `${(diagram.title || 'arquitetura').toLowerCase().replace(/\s+/g, '_')}_${diagram.version || 'v1'}.json`
        : undefined;

      const attachmentContent = includeJsonAttachment
        ? JSON.stringify(diagram, null, 2)
        : undefined;

      await sendGmailEmail({
        to: recipient,
        subject: subject,
        bodyText: customMessage,
        bodyHtml: htmlBody,
        accessToken: googleUser!.accessToken,
        attachmentFileName,
        attachmentContent,
        attachmentMimeType: 'application/json'
      });

      setStatusMessage({
        type: 'success',
        text: `E-mail enviado com sucesso via Gmail para ${recipient}!`
      });
      setRecipient('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Erro ao enviar e-mail via Gmail API.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save as Draft option
  const handleCreateDraft = async () => {
    if (!googleUser) {
      setStatusMessage({ type: 'error', text: 'Faça login com o Google para criar um rascunho.' });
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const htmlBody = generateEmailHtml();
      await createGmailDraft({
        to: recipient || googleUser.email,
        subject,
        bodyText: customMessage,
        bodyHtml: htmlBody,
        accessToken: googleUser.accessToken
      });

      setStatusMessage({
        type: 'success',
        text: `Rascunho criado no seu Gmail com sucesso!`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Erro ao criar rascunho no Gmail.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          theme === 'dark' ? 'bg-[#12151e] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'bg-[#181c28] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Enviar Arquitetura por Gmail</h2>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Compartilhe a especificação, estimativas e código IaC via Google Gmail API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {/* Status Message Alert */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/15 border-red-500/30 text-red-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* User Google Auth Card */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            googleUser
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
              : theme === 'dark'
                ? 'bg-white/5 border-white/10'
                : 'bg-slate-100 border-slate-200'
          }`}>
            {googleUser ? (
              <div className="flex items-center space-x-3">
                {googleUser.picture ? (
                  <img src={googleUser.picture} alt="Avatar" className="w-10 h-10 rounded-full border border-blue-400/40" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {googleUser.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-300">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Conectado como {googleUser.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{googleUser.email}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-amber-400" />
                <span className="text-xs text-slate-300">Conecte sua conta do Google para enviar e-mails via Gmail</span>
              </div>
            )}

            {!googleUser && (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>Entrar com Google</span>
              </button>
            )}
          </div>

          {/* Form */}
          <form id="gmail-send-form" onSubmit={handleInitiateSend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">Destinatário (E-mail):</label>
              <input
                type="email"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="exemplo@empresa.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-black/30 border-white/15 focus:border-blue-500 text-white'
                    : 'bg-white border-slate-300 focus:border-blue-600 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Assunto:</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-black/30 border-white/15 focus:border-blue-500 text-white'
                    : 'bg-white border-slate-300 focus:border-blue-600 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Mensagem / Observações:</label>
              <textarea
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all font-sans ${
                  theme === 'dark'
                    ? 'bg-black/30 border-white/15 focus:border-blue-500 text-white'
                    : 'bg-white border-slate-300 focus:border-blue-600 text-slate-900'
                }`}
              />
            </div>

            {/* Options */}
            <div className={`p-3.5 rounded-xl border space-y-2.5 text-xs ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-bold flex items-center space-x-2 text-slate-300">
                <Paperclip className="w-4 h-4 text-blue-400" />
                <span>Conteúdo incluído no E-mail:</span>
              </div>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTerraform}
                  onChange={(e) => setIncludeTerraform(e.target.checked)}
                  className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                <span>Incluir preview do código Terraform (IaC) no corpo do e-mail</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeJsonAttachment}
                  onChange={(e) => setIncludeJsonAttachment(e.target.checked)}
                  className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                <span>Anexar arquivo JSON de especificação da arquitetura (.json)</span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          theme === 'dark' ? 'bg-[#181c28] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={handleCreateDraft}
            disabled={isLoading || !googleUser}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-2 ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                : 'bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Salvar como Rascunho</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancelar
            </button>

            <button
              type="submit"
              form="gmail-send-form"
              disabled={isLoading || !googleUser}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-bold shadow-lg shadow-red-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Enviar via Gmail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Explicit Confirmation Modal per Google Workspace guidelines */}
      {showConfirmationDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
            theme === 'dark' ? 'bg-[#181c28] border-red-500/30 text-white' : 'bg-white border-red-200 text-slate-900'
          }`}>
            <div className="flex items-center space-x-3 text-red-400">
              <ShieldAlert className="w-7 h-7 shrink-0" />
              <h3 className="text-base font-bold">Confirmar envio de e-mail</h3>
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              Você está prestes a enviar uma mensagem oficial do Gmail para <strong>{recipient}</strong> em nome da sua conta ({googleUser?.email}).
            </p>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-[11px] space-y-1 font-mono text-slate-300">
              <div><strong>Assunto:</strong> {subject}</div>
              <div><strong>Anexo:</strong> {includeJsonAttachment ? 'Sim (.json)' : 'Não'}</div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmationDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSendEmail}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30"
              >
                Confirmar e Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
