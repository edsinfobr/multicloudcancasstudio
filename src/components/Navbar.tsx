import React, { useState } from 'react';
import { 
  Sparkles, 
  Code, 
  DollarSign, 
  Download, 
  Upload, 
  FileText, 
  LayoutTemplate, 
  Undo2, 
  Redo2, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ShieldCheck,
  Plus,
  Save,
  FolderOpen,
  ChevronDown,
  Image,
  Layers,
  HardDrive,
  LogIn,
  LogOut,
  Cloud,
  UserCheck,
  FileSignature,
  Sun,
  Moon,
  MessageSquarePlus,
  GitBranch,
  Tag
} from 'lucide-react';
import { DiagramState, CloudProvider } from '../types';
import { exportCanvasToPng, exportCanvasToJpg, exportCanvasToSvg, exportArchitecturePdf, exportProjectToJson } from '../utils/exportUtils';
import { GoogleUser } from '../services/googleDrive';

interface NavbarProps {
  diagram: DiagramState;
  setDiagram: React.Dispatch<React.SetStateAction<DiagramState>>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onOpenAiModal: () => void;
  onOpenAuditModal: () => void;
  onOpenTerraformModal: () => void;
  onOpenCostModal: () => void;
  onOpenTemplateModal: () => void;
  onOpenMetadataModal: () => void;
  onNewArchitecture: () => void;
  onSaveArchitecture: () => void;
  onOpenSavedModal: () => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  onResetZoom: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClearCanvas: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  googleUser: GoogleUser | null;
  onOpenGoogleDriveModal: () => void;
  onOpenFeedbackModal?: () => void;
  lastAutoSavedAt?: Date | null;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  diagram,
  setDiagram,
  canvasRef,
  onOpenAiModal,
  onOpenAuditModal,
  onOpenTerraformModal,
  onOpenCostModal,
  onOpenTemplateModal,
  onOpenMetadataModal,
  onNewArchitecture,
  onSaveArchitecture,
  onOpenSavedModal,
  zoom,
  setZoom,
  onResetZoom,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearCanvas,
  onImportJson,
  googleUser,
  onOpenGoogleDriveModal,
  onOpenFeedbackModal,
  lastAutoSavedAt,
  theme = 'dark',
  onToggleTheme
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiagram((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiagram((prev) => ({ ...prev, version: e.target.value }));
  };

  const handleExportPng = async () => {
    setIsMenuOpen(false);
    setIsExportOpen(false);
    if (canvasRef.current) {
      await exportCanvasToPng(canvasRef.current, `${diagram.title.toLowerCase().replace(/\s+/g, '-')}.png`);
    }
  };

  const handleExportJpg = async () => {
    setIsMenuOpen(false);
    setIsExportOpen(false);
    if (canvasRef.current) {
      await exportCanvasToJpg(canvasRef.current, `${diagram.title.toLowerCase().replace(/\s+/g, '-')}.jpg`);
    }
  };

  const handleExportSvg = async () => {
    setIsMenuOpen(false);
    setIsExportOpen(false);
    if (canvasRef.current) {
      await exportCanvasToSvg(canvasRef.current, `${diagram.title.toLowerCase().replace(/\s+/g, '-')}.svg`);
    }
  };

  const handleExportPdf = async () => {
    setIsMenuOpen(false);
    setIsExportOpen(false);
    if (canvasRef.current) {
      await exportArchitecturePdf(canvasRef.current, diagram);
    }
  };

  const handleExportJson = () => {
    setIsMenuOpen(false);
    setIsExportOpen(false);
    exportProjectToJson(diagram);
  };

  return (
    <header id="main-navbar" className={`border-b z-30 select-none shadow-md transition-colors ${
      theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#12141A] border-white/10 text-slate-200'
    }`}>
      {/* ROW 1: TOP BRAND HEADER (App Name & Logo prominently positioned above buttons) */}
      <div className={`px-4 py-2 border-b flex items-center justify-between gap-4 ${
        theme === 'light' ? 'border-slate-200 bg-slate-50/60' : 'border-white/5 bg-[#0e1017]'
      }`}>
        {/* Left: App Logo & Prominent App Title */}
        <div className="flex items-center space-x-3">
          {/* Custom MultiCloud Canvas Studio Logo */}
          <div className="relative group flex items-center justify-center shrink-0">
            <div className={`absolute -inset-1 rounded-xl opacity-75 blur-sm transition duration-500 group-hover:opacity-100 ${
              theme === 'light' 
                ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400' 
                : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500'
            }`} />
            <div className={`relative w-9 h-9 rounded-xl border flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${
              theme === 'light' 
                ? 'bg-gradient-to-br from-white to-blue-50 border-blue-300' 
                : 'bg-gradient-to-br from-[#181c28] to-[#0d1017] border-blue-500/40'
            }`}>
              <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                <path d="M4 12H32M4 24H32M12 4V32M24 4V32" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 2" />
                <path
                  d="M10 21C8.34315 21 7 19.6569 7 18C7 16.5818 7.98592 15.3934 9.31752 15.0847C9.72893 12.7214 11.7826 11 14.25 11C15.6888 11 16.9818 11.6033 17.8926 12.5638C18.6666 11.6111 19.8398 11 21.1667 11C23.3758 11 25.1667 12.7909 25.1667 15C26.7315 15 28 16.2685 28 17.8333C28 19.3981 26.7315 20.6667 25.1667 20.6667H10Z"
                  fill="url(#cloudGrad)"
                  fillOpacity="0.25"
                  stroke="url(#cloudGrad)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="18" r="2.2" fill="#FF9900" />
                <circle cx="15" cy="13" r="2.2" fill="#0078D4" />
                <circle cx="21" cy="13" r="2.2" fill="#34A853" />
                <circle cx="25" cy="18" r="2.2" fill="#C74634" />
                <path d="M10 18L15 13L21 13L25 18" stroke="url(#nodeLineGrad)" strokeWidth="1.2" strokeLinecap="round" />
                <defs>
                  <linearGradient id="cloudGrad" x1="7" y1="11" x2="28" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6" />
                    <stop offset="0.5" stopColor="#6366F1" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                  <linearGradient id="nodeLineGrad" x1="10" y1="18" x2="25" y2="18" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF9900" />
                    <stop offset="0.33" stopColor="#0078D4" />
                    <stop offset="0.66" stopColor="#34A853" />
                    <stop offset="1" stopColor="#C74634" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* App Name Highlighted ("Em Destaque") */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h1 className={`text-base md:text-lg font-black tracking-tight ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent'
              }`}>
                MultiCloud Canvas Studio
              </h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm tracking-wider uppercase">
                STUDIO
              </span>
            </div>
            <span className={`text-[10px] font-medium hidden lg:inline ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Modelador de Arquitetura Multi-Nuvem, Estimativas de Custos e IaC Terraform
            </span>
          </div>
        </div>

        {/* Center: Architecture Title & Version Badge (Centered on top row with App Name) */}
        <div className="flex-1 flex items-center justify-center max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-2">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-xl border transition-all ${
            theme === 'light'
              ? 'bg-white/90 border-slate-300 shadow-sm hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-400/20'
              : 'bg-[#181c28] border-white/15 shadow-inner hover:border-blue-500/50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20'
          }`}>
            <Tag className={`w-3.5 h-3.5 shrink-0 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />

            {/* Architecture Title Input */}
            <input
              id="top-center-architecture-title"
              type="text"
              value={diagram.title || ''}
              onChange={handleTitleChange}
              className={`text-xs sm:text-sm font-bold bg-transparent border-none outline-none text-center w-28 sm:w-48 md:w-60 lg:w-72 truncate ${
                theme === 'light'
                  ? 'text-slate-900 placeholder-slate-400'
                  : 'text-white placeholder-slate-500'
              }`}
              placeholder="Nome da Arquitetura"
              title="Clique para editar o nome da arquitetura"
            />

            <span className={`text-xs ${theme === 'light' ? 'text-slate-300' : 'text-white/20'}`}>|</span>

            {/* Version Badge & Input */}
            <div className="flex items-center space-x-1 shrink-0" title="Versão atual da arquitetura">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <input
                id="top-center-architecture-version"
                type="text"
                value={diagram.version || 'v1.0'}
                onChange={handleVersionChange}
                className={`text-xs font-mono font-black px-2 py-0.5 rounded-md outline-none border transition-colors w-16 text-center ${
                  theme === 'light'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-indigo-500'
                    : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 focus:border-indigo-400'
                }`}
                placeholder="v1.0"
                title="Clique para alterar a versão (ex: v1.0, v2.0)"
              />
            </div>
          </div>
        </div>

        {/* Right: Auto-Save Status, Drive Status, Theme & Feedback Shortcuts */}
        <div className="flex items-center space-x-2 shrink-0">
          {lastAutoSavedAt && (
            <div
              id="autosave-status-badge"
              className={`flex items-center space-x-1.5 text-[10px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full border transition-all ${
                theme === 'light'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}
              title="Salvo automaticamente a cada 30 segundos no armazenamento local"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden xl:inline">
                Auto-salvo {lastAutoSavedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="xl:hidden">Auto-salvo</span>
            </div>
          )}

          {/* Google Drive Integration Shortcut */}
          <button
            id="btn-google-drive"
            onClick={onOpenGoogleDriveModal}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm transition-all border ${
              googleUser
                ? theme === 'light' ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950' : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                : theme === 'light' ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-950' : 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/40 text-blue-300'
            }`}
            title={googleUser ? `Google Drive (${googleUser.email})` : 'Conectar e Salvar no Google Drive'}
          >
            {googleUser?.picture ? (
              <img src={googleUser.picture} alt={googleUser.name} className="w-4 h-4 rounded-full border border-emerald-500" />
            ) : (
              <HardDrive className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span className="hidden sm:inline">
              {googleUser ? 'Google Drive' : 'Entrar com Google'}
            </span>
          </button>

          {/* Theme Mode Switcher */}
          {onToggleTheme && (
            <button
              id="btn-toggle-theme"
              onClick={onToggleTheme}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                theme === 'light'
                  ? 'bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-950 shadow-sm'
                  : 'bg-indigo-950/40 hover:bg-indigo-900/60 border-indigo-500/40 text-indigo-300'
              }`}
              title={theme === 'light' ? 'Modo Claro Ativo (Clique para Modo Escuro)' : 'Modo Escuro Ativo (Clique para Modo Claro)'}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden md:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">Modo Escuro</span>
                </>
              )}
            </button>
          )}

          {/* Feedback Button */}
          {onOpenFeedbackModal && (
            <button
              id="btn-open-feedback"
              onClick={onOpenFeedbackModal}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                theme === 'light'
                  ? 'bg-pink-50 hover:bg-pink-100 border-pink-300 text-pink-900'
                  : 'bg-pink-600/20 hover:bg-pink-600/30 border-pink-500/30 text-pink-300'
              }`}
              title="Enviar Feedback, Sugestões ou Reportar Erros"
            >
              <MessageSquarePlus className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-pink-700' : 'text-pink-400'}`} />
              <span className="hidden lg:inline">Feedback</span>
            </button>
          )}
        </div>
      </div>

      {/* ROW 2: CONTROLS & ACTION BUTTONS TOOLBAR */}
      <div className="px-4 py-1.5 flex items-center justify-between gap-3 overflow-x-auto min-h-[42px]">
        {/* Left Controls: Architecture Dropdown, Title Input & Stamps */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* Main Architecture Dropdown Menu */}
          <div className="relative">
            <button
              id="btn-architecture-menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all border ${
                theme === 'light'
                  ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-900'
                  : 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-300'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`} />
              <span>Arquitetura</span>
              <ChevronDown className={`w-3 h-3 transform transition-transform ${isMenuOpen ? 'rotate-180' : ''} ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`} />
            </button>

            {isMenuOpen && (
              <div className={`absolute left-0 mt-2 w-56 border rounded-xl shadow-2xl z-50 overflow-hidden py-1 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#12141A] border-white/10'
              }`}>
                <button
                  id="menu-btn-new-arch"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNewArchitecture();
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 group transition-colors ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Plus className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className={`font-semibold block ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>Nova Arquitetura</span>
                    <span className={`text-[10px] ${theme === 'light' ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>Criar um novo diagrama do zero</span>
                  </div>
                </button>

                <button
                  id="menu-btn-save-arch"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSaveArchitecture();
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 group transition-colors ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Save className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className={`font-semibold block ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>Salvar Arquitetura</span>
                    <span className={`text-[10px] ${theme === 'light' ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>Salvar modelo no armazenamento local</span>
                  </div>
                </button>

                <button
                  id="menu-btn-saved-list"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSavedModal();
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 group transition-colors ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <FolderOpen className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className={`font-semibold block ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>Minhas Arquiteturas</span>
                    <span className={`text-[10px] ${theme === 'light' ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>Ver e carregar projetos salvos</span>
                  </div>
                </button>

                <button
                  id="menu-btn-metadata-stamp"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenMetadataModal();
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 group transition-colors ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <FileSignature className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className={`font-semibold block ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>Dados do Diagrama</span>
                    <span className={`text-[10px] ${theme === 'light' ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>Autor, Data, Cargo e Projeto</span>
                  </div>
                </button>

                <div className={`h-px my-1 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />

                <div className={`px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  theme === 'light' ? 'text-slate-900 font-bold' : 'text-slate-500'
                }`}>
                  Exportar / Downloads
                </div>

                <button
                  id="menu-btn-export-png"
                  onClick={handleExportPng}
                  className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center space-x-2.5 transition-colors ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100 font-medium' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Image className="w-3.5 h-3.5 text-blue-500" />
                  <span>Exportar imagem PNG</span>
                </button>

                <button
                  id="menu-btn-export-pdf"
                  onClick={handleExportPdf}
                  className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center space-x-2.5 transition-colors ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100 font-medium' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-red-500" />
                  <span>Exportar Relatório PDF</span>
                </button>

                <button
                  id="menu-btn-export-svg"
                  onClick={handleExportSvg}
                  className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center space-x-2.5 transition-colors ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100 font-medium' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Exportar Vetor SVG</span>
                </button>

                <div className={`h-px my-1 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />

                <button
                  id="menu-btn-export-json"
                  onClick={handleExportJson}
                  className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center space-x-2.5 transition-colors ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100 font-medium' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  <span>Baixar Projeto JSON</span>
                </button>

                <button
                  id="menu-btn-import-json"
                  onClick={() => {
                    setIsMenuOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center space-x-2.5 transition-colors ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100 font-medium' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-sky-500" />
                  <span>Importar Projeto JSON</span>
                </button>
              </div>
            )}
          </div>

          <div className={`h-5 w-[1px] ${theme === 'light' ? 'bg-slate-300' : 'bg-white/10'}`} />

          <button
            id="btn-open-carimbo"
            onClick={onOpenMetadataModal}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all border ${
              theme === 'light'
                ? 'bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-900'
                : 'bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/30 text-purple-300'
            }`}
            title="Editar Autor, Cargo, Data e Projeto"
          >
            <FileSignature className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`} />
            <span className="hidden md:inline">Carimbo</span>
          </button>

          {/* Cloud Provider Badges */}
          <div className={`hidden lg:flex items-center space-x-1 p-1 rounded-md border ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'
          }`}>
            {(['aws', 'azure', 'gcp', 'oci'] as CloudProvider[]).map((p) => {
              const active = diagram.nodes.some((n) => n.provider === p);
              return (
                <span
                  key={p}
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded transition-all ${
                    active
                      ? p === 'aws'
                        ? theme === 'light' ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : p === 'azure'
                        ? theme === 'light' ? 'bg-sky-100 text-sky-950 border border-sky-300' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : p === 'gcp'
                        ? theme === 'light' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : theme === 'light' ? 'bg-red-100 text-red-950 border border-red-300' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : theme === 'light' ? 'text-slate-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  {p}
                </span>
              );
            })}
          </div>
        </div>

        {/* Center Tools: AI & Analysis Features */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            id="btn-ai-prompt"
            onClick={onOpenAiModal}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Generator</span>
          </button>

          <button
            id="btn-ai-audit"
            onClick={onOpenAuditModal}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all border ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-950'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden md:inline">Security & HA Audit</span>
            <span className="md:hidden">Audit</span>
          </button>

          <button
            id="btn-templates"
            onClick={onOpenTemplateModal}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all border ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-950'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-sky-500" />
            <span>Templates</span>
          </button>

          <div className={`h-5 w-[1px] ${theme === 'light' ? 'bg-slate-300' : 'bg-white/10'}`} />

          <button
            id="btn-terraform-iac"
            onClick={onOpenTerraformModal}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all border ${
              theme === 'light'
                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <Code className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`} />
            <span className="hidden md:inline">Export Terraform</span>
            <span className="md:hidden">Terraform</span>
          </button>

          <button
            id="btn-cost-calculator"
            onClick={onOpenCostModal}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all border ${
              theme === 'light'
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950 font-bold'
                : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
            }`}
          >
            <DollarSign className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">Cost Calculator</span>
            <span className="sm:hidden">Custos</span>
          </button>

          <button
            id="btn-report-pdf"
            onClick={handleExportPdf}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all border shadow-sm ${
              theme === 'light'
                ? 'bg-red-50 hover:bg-red-100 border-red-300 text-red-950 font-bold'
                : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-300'
            }`}
            title="Gerar Relatório Completo da Arquitetura e Custos em PDF"
          >
            <FileText className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-red-700' : 'text-red-400'}`} />
            <span className="hidden sm:inline">Report PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>

        {/* Right Tools: Canvas Actions, Zoom, Export */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Undo / Redo / Clear */}
          <div className={`flex items-center rounded-md p-0.5 border ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'
          }`}>
            <button
              id="btn-undo"
              disabled={!canUndo}
              onClick={onUndo}
              title="Undo (Ctrl+Z)"
              className={`p-1.5 rounded disabled:opacity-30 disabled:hover:bg-transparent ${
                theme === 'light' ? 'hover:bg-slate-200 text-slate-800' : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-redo"
              disabled={!canRedo}
              onClick={onRedo}
              title="Redo (Ctrl+Y)"
              className={`p-1.5 rounded disabled:opacity-30 disabled:hover:bg-transparent ${
                theme === 'light' ? 'hover:bg-slate-200 text-slate-800' : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-clear-canvas"
              onClick={onClearCanvas}
              title="Clear Canvas"
              className="p-1.5 hover:bg-red-500/20 rounded text-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className={`flex items-center rounded-md p-0.5 border text-xs ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'
          }`}>
            <button
              id="btn-zoom-out"
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
              className={`p-1.5 rounded ${theme === 'light' ? 'hover:bg-slate-200 text-slate-800' : 'hover:bg-white/10 text-slate-300'}`}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className={`px-1.5 font-mono text-[11px] min-w-[2.2rem] text-center font-bold ${
              theme === 'light' ? 'text-slate-950' : 'text-white'
            }`}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              id="btn-zoom-in"
              onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
              className={`p-1.5 rounded ${theme === 'light' ? 'hover:bg-slate-200 text-slate-800' : 'hover:bg-white/10 text-slate-300'}`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-reset-zoom"
              onClick={onResetZoom}
              title="Fit to Screen"
              className={`p-1.5 rounded ${theme === 'light' ? 'hover:bg-slate-200 text-slate-800' : 'hover:bg-white/10 text-slate-300'}`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export Code Menu Dropdown */}
          <div className="relative">
            <button
              id="btn-export-dropdown"
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Code</span>
            </button>

            {isExportOpen && (
              <div className={`absolute right-0 mt-2 w-52 border rounded-lg shadow-2xl z-50 overflow-hidden py-1 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#12141A] border-white/10'
              }`}>
                <button
                  id="btn-export-google-drive"
                  onClick={() => {
                    setIsExportOpen(false);
                    onOpenGoogleDriveModal();
                  }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 font-bold ${
                    theme === 'light' ? 'text-blue-900 hover:bg-blue-50' : 'text-blue-300 hover:bg-blue-600/20'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                  <span>Salvar no Google Drive</span>
                </button>
                <div className={`h-px my-1 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
                <button
                  id="btn-export-png"
                  onClick={handleExportPng}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 font-medium ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Image className="w-3.5 h-3.5 text-blue-500" />
                  <span>Exportar PNG (Transparente)</span>
                </button>
                <button
                  id="btn-export-jpg"
                  onClick={handleExportJpg}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 font-medium ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Image className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Exportar JPG (Transparente)</span>
                </button>
                <button
                  id="btn-export-svg"
                  onClick={handleExportSvg}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 font-medium ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Exportar SVG</span>
                </button>
                <button
                  id="btn-export-pdf"
                  onClick={handleExportPdf}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 font-medium ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-red-500" />
                  <span>Exportar PDF</span>
                </button>
                <div className={`h-px my-1 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
                <button
                  id="menu-btn-export-json"
                  onClick={handleExportJson}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 font-medium ${
                    theme === 'light' ? 'text-slate-900 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  <span>Salvar JSON Local</span>
                </button>
              </div>
            )}
          </div>

          {/* Load Project JSON Button */}
          <input
            id="input-import-json"
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={onImportJson}
            className="hidden"
          />
          <button
            id="btn-import-project"
            onClick={() => fileInputRef.current?.click()}
            title="Import Project JSON"
            className={`p-1.5 border rounded-md transition-all ${
              theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

