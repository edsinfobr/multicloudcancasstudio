import React, { useState, useEffect } from 'react';
import { DiagramState } from '../types';
import { 
  GoogleUser, 
  DriveFileItem, 
  authenticateWithGoogle, 
  uploadToGoogleDrive, 
  listDriveDiagrams, 
  downloadDriveFileContent 
} from '../services/googleDrive';
import { exportCanvasToBlob } from '../utils/exportUtils';
import { 
  Cloud, 
  HardDrive, 
  LogOut, 
  LogIn, 
  FileJson, 
  Image as ImageIcon, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FolderOpen, 
  X, 
  UploadCloud, 
  RefreshCw,
  UserCheck
} from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagram: DiagramState;
  setDiagram: React.Dispatch<React.SetStateAction<DiagramState>>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  googleUser: GoogleUser | null;
  setGoogleUser: (user: GoogleUser | null) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  diagram,
  setDiagram,
  canvasRef,
  googleUser,
  setGoogleUser
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'open'>('save');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string; link?: string } | null>(null);
  
  const [saveFormat, setSaveFormat] = useState<'json' | 'png'>('json');
  const [customFileName, setCustomFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCustomFileName(`MultiCloudCanvas_${diagram.title.replace(/\s+/g, '_')}`);
      setStatusMessage(null);
      if (googleUser && activeTab === 'open') {
        fetchFiles();
      }
    }
  }, [isOpen, diagram.title, googleUser, activeTab]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setIsAuthenticating(true);
    setStatusMessage(null);
    try {
      const user = await authenticateWithGoogle();
      setGoogleUser(user);
      setStatusMessage({
        type: 'success',
        text: `Conectado com sucesso como ${user.email}!`
      });
    } catch (err: any) {
      console.error('Google Login Error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Falha ao autenticar com a conta Google. Tente novamente.'
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cloudcraft_google_user');
    setGoogleUser(null);
    setStatusMessage({
      type: 'info',
      text: 'Você se desconectou da conta Google.'
    });
  };

  const handleSaveToDrive = async () => {
    if (!googleUser) {
      await handleLogin();
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const cleanTitle = (customFileName || 'MultiCloudCanvas_Architecture').replace(/[/\\?%*:|"<>]/g, '_');

      if (saveFormat === 'json') {
        const fileName = `${cleanTitle}.json`;
        const jsonContent = JSON.stringify(diagram, null, 2);

        const savedFile = await uploadToGoogleDrive({
          fileName,
          content: jsonContent,
          mimeType: 'application/json',
          accessToken: googleUser.accessToken
        });

        setStatusMessage({
          type: 'success',
          text: `Projeto "${fileName}" salvo com sucesso no Google Drive!`,
          link: savedFile.webViewLink
        });
      } else {
        // PNG export
        if (!canvasRef.current) {
          throw new Error('Canvas ref não está disponível para captura');
        }

        const blob = await exportCanvasToBlob(canvasRef.current);
        if (!blob) {
          throw new Error('Erro ao gerar imagem do diagrama');
        }

        const fileName = `${cleanTitle}.png`;
        const savedFile = await uploadToGoogleDrive({
          fileName,
          content: blob,
          mimeType: 'image/png',
          accessToken: googleUser.accessToken
        });

        setStatusMessage({
          type: 'success',
          text: `Imagem "${fileName}" salva com sucesso no Google Drive!`,
          link: savedFile.webViewLink
        });
      }
    } catch (err: any) {
      console.error('Save to Drive Error:', err);
      if (err.message?.includes('401') || err.message?.includes('invalid credentials')) {
        handleLogout();
        setStatusMessage({
          type: 'error',
          text: 'Sua sessão do Google expirou. Por favor, conecte-se novamente.'
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: err.message || 'Erro ao salvar o arquivo no Google Drive'
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const fetchFiles = async () => {
    if (!googleUser) return;
    setIsLoadingFiles(true);
    setStatusMessage(null);
    try {
      const files = await listDriveDiagrams(googleUser.accessToken);
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Fetch Drive Files Error:', err);
      setStatusMessage({
        type: 'error',
        text: 'Não foi possível carregar seus arquivos do Google Drive.'
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleOpenDiagramFile = async (file: DriveFileItem) => {
    if (!googleUser) return;
    setIsLoadingFiles(true);
    setStatusMessage(null);

    try {
      const content = await downloadDriveFileContent(file.id, googleUser.accessToken);
      const parsedDiagram: DiagramState = JSON.parse(content);

      if (!parsedDiagram.nodes || !Array.isArray(parsedDiagram.nodes)) {
        throw new Error('Arquivo do Google Drive não contém um formato de diagrama MultiCloud Canvas Studio válido.');
      }

      setDiagram(parsedDiagram);
      setStatusMessage({
        type: 'success',
        text: `Diagrama "${file.name}" carregado do Google Drive!`
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Open Drive File Error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Erro ao abrir o arquivo do Google Drive'
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#12141A] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Google Drive Integration</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                  OAuth 2.0
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Salve e acesse seus diagramas diretamente na sua conta do Google Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Auth Banner */}
        <div className="px-4 py-3 bg-black/40 border-b border-white/5 flex items-center justify-between">
          {googleUser ? (
            <div className="flex items-center space-x-3 min-w-0">
              {googleUser.picture ? (
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-8 h-8 rounded-full border border-blue-500/50 flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                  {googleUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 truncate">
                <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
                  <span className="truncate">{googleUser.name}</span>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">{googleUser.email}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Nenhuma conta do Google conectada.</span>
            </div>
          )}

          <div>
            {googleUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 text-xs transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Desconectar</span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isAuthenticating}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Conectando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Entrar com Google</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-black/20 px-4 pt-2">
          <button
            onClick={() => setActiveTab('save')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 text-xs font-semibold transition-all ${
              activeTab === 'save'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Salvar no Google Drive</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('open');
              if (googleUser) fetchFiles();
            }}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 text-xs font-semibold transition-all ${
              activeTab === 'open'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Abrir do Drive</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Notifications / Status Alerts */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start justify-between space-x-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  : 'bg-blue-950/40 border-blue-500/40 text-blue-200'
              }`}
            >
              <div className="flex items-start space-x-2 min-w-0">
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-medium leading-relaxed">{statusMessage.text}</p>
                  {statusMessage.link && (
                    <a
                      href={statusMessage.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 mt-2 px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 font-semibold rounded-lg text-xs transition-all shadow-sm"
                    >
                      <span>Abrir no Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'save' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nome do Arquivo
                </label>
                <input
                  type="text"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  placeholder="Nome do arquivo..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Formato do Arquivo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSaveFormat('json')}
                    className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                      saveFormat === 'json'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg ring-1 ring-blue-500/50'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <FileJson className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <div className="text-left min-w-0">
                      <div className="text-xs font-bold text-white">Projeto JSON</div>
                      <div className="text-[10px] text-slate-400 truncate">Estado completo editável</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaveFormat('png')}
                    className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                      saveFormat === 'png'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg ring-1 ring-blue-500/50'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <ImageIcon className="w-6 h-6 text-sky-400 flex-shrink-0" />
                    <div className="text-left min-w-0">
                      <div className="text-xs font-bold text-white">Imagem PNG</div>
                      <div className="text-[10px] text-slate-400 truncate">Visualização gráfica HD</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveToDrive}
                  disabled={isUploading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enviando para o Google Drive...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 text-blue-200" />
                      <span>Salvar Agora no Google Drive</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'open' && (
            <div className="space-y-3">
              {!googleUser ? (
                <div className="text-center py-8 bg-black/30 rounded-xl border border-white/5 p-4 space-y-3">
                  <Cloud className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    Conecte sua conta do Google para visualizar e importar seus diagramas salvos no Google Drive.
                  </p>
                  <button
                    onClick={handleLogin}
                    disabled={isAuthenticating}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Conectar Conta Google</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Arquivos JSON de diagrama salvos no seu Drive:</span>
                    <button
                      onClick={fetchFiles}
                      disabled={isLoadingFiles}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-all flex items-center space-x-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                      <span className="text-[11px]">Atualizar</span>
                    </button>
                  </div>

                  {isLoadingFiles ? (
                    <div className="py-8 flex flex-col items-center justify-center text-xs text-slate-400 space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                      <span>Buscando arquivos no Google Drive...</span>
                    </div>
                  ) : driveFiles.length === 0 ? (
                    <div className="text-center py-8 bg-black/30 rounded-xl border border-white/5 p-4 space-y-2">
                      <FolderOpen className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">Nenhum diagrama MultiCloud Canvas Studio encontrado no seu Google Drive.</p>
                      <p className="text-[11px] text-slate-500">Salve um novo diagrama para visualizar aqui.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {driveFiles.map((file) => (
                        <div
                          key={file.id}
                          className="p-3 bg-black/40 hover:bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-xl flex items-center justify-between transition-all group"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <FileJson className="w-5 h-5 text-amber-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-300">
                                {file.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Modificado em: {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Desconhecido'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-lg transition-all"
                                title="Visualizar no Drive"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}

                            <button
                              onClick={() => handleOpenDiagramFile(file)}
                              className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 rounded-lg text-xs font-semibold transition-all shadow-sm"
                            >
                              Carregar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
