import React, { useState, useRef, useEffect } from 'react';
import { DiagramState, DiagramNode, DiagramContainer, CloudIconDefinition, CloudProvider } from './types';
import { STARTER_TEMPLATES } from './data/templates';
import { Navbar } from './components/Navbar';
import { SidebarCatalog } from './components/SidebarCatalog';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { TerraformModal } from './components/TerraformModal';
import { CostModal } from './components/CostModal';
import { AiPromptModal } from './components/AiPromptModal';
import { TemplateModal } from './components/TemplateModal';
import { SavedArchitecturesModal } from './components/SavedArchitecturesModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { MetadataModal } from './components/MetadataModal';
import { FeedbackModal } from './components/FeedbackModal';
import { VersionTabsBar } from './components/VersionTabsBar';
import { GoogleUser } from './services/googleDrive';
import { saveArchitectureToStorage, saveAutosaveDraft, getAutosaveDraft } from './utils/storageUtils';
import { exportArchitecturePdf } from './utils/exportUtils';
import { CheckCircle2 } from 'lucide-react';

// Helper to detect OS system theme preference (Dark or Light mode)
const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

// Helper to calculate next version tag (e.g., v1.0 -> v1.1, v1.1 -> v1.2)
const calculateNextVersionTag = (versionsList: DiagramState[], currentVer: string): string => {
  const match = (currentVer || 'v1.0').match(/v?(\d+)\.(\d+)/i);
  if (match) {
    const major = parseInt(match[1], 10);
    let minor = parseInt(match[2], 10) + 1;
    let candidate = `v${major}.${minor}`;
    while (versionsList.some((v) => v.version === candidate)) {
      minor++;
      candidate = `v${major}.${minor}`;
    }
    return candidate;
  }
  return `${currentVer || 'v1.0'}-v2`;
};

export default function App() {
  // Versions list state: maintains all version tabs for the current project
  const [versions, setVersions] = useState<DiagramState[]>(() => {
    try {
      const cached = localStorage.getItem('multicloud_studio_versions_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: DiagramState, idx: number) => ({
            ...item,
            version: item.version || `v1.${idx}`
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to load version tabs list from storage', err);
    }

    const draft = getAutosaveDraft();
    if (draft) {
      return [{ ...draft, version: draft.version || 'v1.0' }];
    }
    return [{ ...STARTER_TEMPLATES[0], version: 'v1.0' }];
  });

  const [activeVersionId, setActiveVersionId] = useState<string>(() => versions[0]?.id || `diag_${Date.now()}`);

  // Derived current active diagram
  const diagram = versions.find((v) => v.id === activeVersionId) || versions[0] || STARTER_TEMPLATES[0];

  // Custom setDiagram proxy to update the active version inside versions array
  const setDiagram: React.Dispatch<React.SetStateAction<DiagramState>> = (action) => {
    setVersions((prevVersions) => {
      return prevVersions.map((v) => {
        if (v.id === activeVersionId) {
          return typeof action === 'function' ? action(v) : action;
        }
        return v;
      });
    });
  };

  // Sync versions list to local storage
  useEffect(() => {
    try {
      localStorage.setItem('multicloud_studio_versions_v1', JSON.stringify(versions));
    } catch (err) {
      console.error('Failed to save versions list:', err);
    }
  }, [versions]);

  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<Date | null>(null);

  // Theme state: automatically detects OS system theme preference
  const [theme, setTheme] = useState<'dark' | 'light'>(getSystemTheme);
  const [isManualThemeOverride, setIsManualThemeOverride] = useState(false);

  // Version management handlers
  const handleSelectVersion = (id: string) => {
    setActiveVersionId(id);
    setSelectedNodeId(null);
    setSelectedContainerId(null);
    setSelectedLinkId(null);
  };

  const handleAddVersion = () => {
    recordHistory();
    const nextVerTag = calculateNextVersionTag(versions, diagram.version || 'v1.0');
    const newVersion: DiagramState = {
      id: `diag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: diagram.title || 'Nova Arquitetura',
      description: diagram.description || '',
      primaryProvider: diagram.primaryProvider || 'aws',
      nodes: [],
      containers: [],
      links: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: nextVerTag,
      metadata: diagram.metadata ? { ...diagram.metadata } : undefined
    };

    setVersions((prev) => [...prev, newVersion]);
    setActiveVersionId(newVersion.id);
    setSelectedNodeId(null);
    setSelectedContainerId(null);
    setSelectedLinkId(null);
    showToast(`Nova versão ${nextVerTag} criada com sucesso!`);
  };

  const handleDuplicateVersion = (targetId?: string) => {
    recordHistory();
    const source = versions.find((v) => v.id === (targetId || activeVersionId)) || diagram;
    const nextVerTag = calculateNextVersionTag(versions, source.version || 'v1.0');

    const duplicated: DiagramState = JSON.parse(JSON.stringify(source));
    duplicated.id = `diag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    duplicated.version = nextVerTag;
    duplicated.updatedAt = new Date().toISOString();

    setVersions((prev) => [...prev, duplicated]);
    setActiveVersionId(duplicated.id);
    setSelectedNodeId(null);
    setSelectedContainerId(null);
    setSelectedLinkId(null);
    showToast(`Versão ${source.version || 'v1.0'} duplicada como ${nextVerTag}!`);
  };

  const handleDeleteVersion = (targetId: string) => {
    if (versions.length <= 1) {
      showToast('O projeto deve ter pelo menos uma versão.');
      return;
    }
    recordHistory();
    const targetVer = versions.find((v) => v.id === targetId);
    const remaining = versions.filter((v) => v.id !== targetId);
    setVersions(remaining);
    if (activeVersionId === targetId) {
      setActiveVersionId(remaining[0].id);
    }
    showToast(`Versão ${targetVer?.version || ''} excluída com sucesso.`);
  };

  // Automatically follow OS color scheme (prefers-color-scheme)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!isManualThemeOverride) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (!isManualThemeOverride) {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    // Modern matchMedia listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
      return () => mediaQuery.removeListener(handleSystemThemeChange);
    }
  }, [isManualThemeOverride]);

  // Sync DOM classes, root color scheme, and body background when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#0a0b0e';
      document.body.style.color = '#cbd5e1';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f1f5f9';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  const toggleTheme = () => {
    setIsManualThemeOverride(true);
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auto-save mechanism: persists current diagram state to local storage every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      saveAutosaveDraft(diagram);
      setLastAutoSavedAt(new Date());
    }, 30000);

    return () => clearInterval(intervalId);
  }, [diagram]);

  // Google OAuth User State
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const cached = localStorage.getItem('cloudcraft_google_user');
      if (cached) {
        const parsed: GoogleUser = JSON.parse(cached);
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached google user state', e);
    }
    return null;
  });

  // Undo / Redo history state
  const [historyStack, setHistoryStack] = useState<DiagramState[]>([]);
  const [redoStack, setRedoStack] = useState<DiagramState[]>([]);

  // Selection states
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

  // Interaction & Canvas states
  const [isConnectingMode, setIsConnectingMode] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Modals
  const [aiModalMode, setAiModalMode] = useState<'generator' | 'audit' | null>(null);
  const [isTerraformModalOpen, setIsTerraformModalOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState(false);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Record history snapshot before mutation
  const recordHistory = () => {
    setHistoryStack((prev) => [...prev, diagram]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [diagram, ...prev]);
    setDiagram(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setHistoryStack((prev) => [...prev, diagram]);
    setDiagram(next);
  };

  const handleNewArchitecture = () => {
    recordHistory();
    const newArch: DiagramState = {
      id: `diag_${Date.now()}`,
      title: 'Nova Arquitetura Cloud',
      description: 'Especificação de arquitetura cloud personalizada.',
      primaryProvider: 'aws',
      nodes: [],
      containers: [],
      links: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDiagram(newArch);
    setSelectedNodeId(null);
    setSelectedContainerId(null);
    setSelectedLinkId(null);
    showToast('Nova arquitetura criada com sucesso!');
  };

  const handleSaveArchitecture = () => {
    saveAutosaveDraft(diagram);
    setLastAutoSavedAt(new Date());
    showToast(`Arquitetura "${diagram.title || 'Sem título'}" salva com sucesso!`);
  };

  const handleLoadSavedDiagram = (loadedDiagram: DiagramState) => {
    recordHistory();
    setDiagram(loadedDiagram);
    setSelectedNodeId(null);
    setSelectedContainerId(null);
    setSelectedLinkId(null);
    showToast(`Arquitetura "${loadedDiagram.title}" carregada com sucesso!`);
  };

  const handleClearCanvas = () => {
    recordHistory();
    setDiagram((prev) => ({
      ...prev,
      containers: [],
      nodes: [],
      links: [],
      updatedAt: new Date().toISOString()
    }));
    setSelectedNodeId(null);
    setSelectedContainerId(null);
    setSelectedLinkId(null);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.nodes && json.containers) {
          recordHistory();
          setDiagram(json);
          showToast('Projeto JSON importado com sucesso!');
        }
      } catch (err) {
        alert('Invalid MultiCloud Canvas Studio Project JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleAddNode = (icon: CloudIconDefinition) => {
    recordHistory();
    const newNode: DiagramNode = {
      id: `node_${Date.now()}`,
      name: icon.name,
      provider: icon.provider,
      category: icon.category,
      iconKey: icon.key,
      resourceType: icon.defaultResourceType,
      x: 300 + Math.random() * 100,
      y: 200 + Math.random() * 100,
      specs: { ...icon.defaultSpecs }
    };

    setDiagram((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    setSelectedNodeId(newNode.id);
  };

  const handleAddContainer = (type: 'vpc' | 'subnet' | 'resource_group' | 'compartment', provider: CloudProvider) => {
    recordHistory();
    let containerName = '';
    const pUpper = String(provider).toUpperCase();
    const tUpper = String(type).toUpperCase();

    if (type === 'vpc') {
      if (provider === 'azure') containerName = 'Azure VNet';
      else if (provider === 'oci') containerName = 'OCI VCN';
      else if (provider === 'gcp') containerName = 'GCP VPC Network';
      else containerName = 'AWS VPC';
    } else if (type === 'subnet') {
      const pLabel = provider === 'generic' ? '' : `${pUpper} `;
      containerName = `${pLabel}Subnet`;
    } else if (type === 'resource_group') {
      containerName = 'Azure Resource Group';
    } else if (type === 'compartment') {
      containerName = 'OCI Compartment';
    } else {
      containerName = `${pUpper} ${tUpper}`;
    }

    const newContainer: DiagramContainer = {
      id: `c_${Date.now()}`,
      name: containerName,
      provider,
      type,
      x: 100 + Math.random() * 50,
      y: 100 + Math.random() * 50,
      width: 500,
      height: 300,
      color: provider === 'aws' ? '#FF9900' : provider === 'azure' ? '#0078D4' : provider === 'gcp' ? '#4285F4' : provider === 'oci' ? '#F80000' : '#8B5CF6'
    };

    setDiagram((prev) => ({
      ...prev,
      containers: [...prev.containers, newContainer]
    }));
    setSelectedContainerId(newContainer.id);
  };

  return (
    <div className={`flex flex-col h-screen w-screen font-sans overflow-hidden select-none transition-colors ${
      theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#0A0B0E] text-slate-100'
    }`}>
      {/* Top Navbar */}
      <Navbar
        diagram={diagram}
        setDiagram={setDiagram}
        canvasRef={canvasRef}
        onOpenAiModal={() => setAiModalMode('generator')}
        onOpenAuditModal={() => setAiModalMode('audit')}
        onOpenTerraformModal={() => setIsTerraformModalOpen(true)}
        onOpenCostModal={() => setIsCostModalOpen(true)}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        onOpenMetadataModal={() => setIsMetadataModalOpen(true)}
        onNewArchitecture={handleNewArchitecture}
        onSaveArchitecture={handleSaveArchitecture}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        zoom={zoom}
        setZoom={setZoom}
        onResetZoom={() => setZoom(1.0)}
        canUndo={historyStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearCanvas={handleClearCanvas}
        onImportJson={handleImportJson}
        googleUser={googleUser}
        onOpenGoogleDriveModal={() => setIsGoogleDriveModalOpen(true)}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        lastAutoSavedAt={lastAutoSavedAt}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Sidebar Icon Palette */}
        <SidebarCatalog
          onAddNode={handleAddNode}
          onAddContainer={handleAddContainer}
          isConnectingMode={isConnectingMode}
          setIsConnectingMode={setIsConnectingMode}
          theme={theme}
        />

        {/* Center Diagramming Canvas */}
        <Canvas
          diagram={diagram}
          setDiagram={setDiagram}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          selectedContainerId={selectedContainerId}
          setSelectedContainerId={setSelectedContainerId}
          selectedLinkId={selectedLinkId}
          setSelectedLinkId={setSelectedLinkId}
          isConnectingMode={isConnectingMode}
          setIsConnectingMode={setIsConnectingMode}
          zoom={zoom}
          setZoom={setZoom}
          canvasRef={canvasRef}
          onRecordHistory={recordHistory}
          onOpenMetadataModal={() => setIsMetadataModalOpen(true)}
          theme={theme}
        />

        {/* Right Property Inspector */}
        <PropertyPanel
          diagram={diagram}
          setDiagram={setDiagram}
          selectedNodeId={selectedNodeId}
          selectedContainerId={selectedContainerId}
          selectedLinkId={selectedLinkId}
          setSelectedNodeId={setSelectedNodeId}
          setSelectedContainerId={setSelectedContainerId}
          setSelectedLinkId={setSelectedLinkId}
          onRecordHistory={recordHistory}
          theme={theme}
        />
      </div>

      {/* Version Tabs Bar (Bottom of screen above footer) */}
      <VersionTabsBar
        versions={versions}
        activeVersionId={activeVersionId}
        onSelectVersion={handleSelectVersion}
        onAddVersion={handleAddVersion}
        onDuplicateVersion={handleDuplicateVersion}
        onDeleteVersion={handleDeleteVersion}
        theme={theme}
      />

      {/* Application Footer */}
      <footer className={`h-7 border-t px-4 flex items-center justify-between text-[11px] select-none z-10 shrink-0 ${
        theme === 'dark' ? 'bg-[#0e1017] border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center space-x-1.5">
          <span>Desenvolvido e mantido por</span>
          <a
            href="https://github.com/edsinfobr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-500 hover:text-blue-400 hover:underline transition-colors flex items-center space-x-1"
          >
            <span>@edsinfobr</span>
          </a>
          <span className="text-slate-500 opacity-50 px-1">•</span>
          <span>© 2026 MultiCloud Canvas Studio. Todos os direitos reservados</span>
          <span className="text-slate-500 opacity-50 px-1">•</span>
          <button
            id="footer-btn-feedback"
            onClick={() => setIsFeedbackModalOpen(true)}
            className="font-semibold text-pink-500 hover:text-pink-400 hover:underline transition-colors flex items-center space-x-1"
          >
            <span>Feedback & Reportar Erros</span>
          </button>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-[10px] text-slate-500">
          <span>Cloud Architecture Designer & Estimator</span>
        </div>
      </footer>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#12141A] border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      {aiModalMode && (
        <AiPromptModal
          mode={aiModalMode}
          diagram={diagram}
          setDiagram={setDiagram}
          onClose={() => setAiModalMode(null)}
          onRecordHistory={recordHistory}
          theme={theme}
        />
      )}

      {isTerraformModalOpen && (
        <TerraformModal
          diagram={diagram}
          onClose={() => setIsTerraformModalOpen(false)}
          theme={theme}
        />
      )}

      {isCostModalOpen && (
        <CostModal
          diagram={diagram}
          setDiagram={setDiagram}
          onClose={() => setIsCostModalOpen(false)}
          theme={theme}
          onExportPdf={async () => {
            if (canvasRef.current) {
              await exportArchitecturePdf(canvasRef.current, diagram);
            }
          }}
        />
      )}

      {isTemplateModalOpen && (
        <TemplateModal
          setDiagram={setDiagram}
          onClose={() => setIsTemplateModalOpen(false)}
          onRecordHistory={recordHistory}
          theme={theme}
        />
      )}

      {isSavedModalOpen && (
        <SavedArchitecturesModal
          onLoadDiagram={handleLoadSavedDiagram}
          onNewDiagram={handleNewArchitecture}
          onClose={() => setIsSavedModalOpen(false)}
          theme={theme}
        />
      )}

      <GoogleDriveModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
        diagram={diagram}
        setDiagram={setDiagram}
        canvasRef={canvasRef}
        googleUser={googleUser}
        setGoogleUser={setGoogleUser}
      />

      <MetadataModal
        isOpen={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
        diagram={diagram}
        setDiagram={setDiagram}
        onRecordHistory={recordHistory}
        theme={theme}
        showToast={showToast}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        diagram={diagram}
        theme={theme}
      />
    </div>
  );
}

