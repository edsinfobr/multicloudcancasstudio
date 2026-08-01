import React, { useState, useEffect } from 'react';
import { DiagramState, DiagramNode, DiagramContainer, DiagramLink, CloudProvider } from '../types';
import { inferProtocolForLink } from '../utils/protocolInfer';
import { CLOUD_ICONS } from '../data/cloudIcons';
import { Trash2, Copy, Sliders, Info, Shield, Server, HardDrive, Cpu, Layers, ArrowRight, RefreshCw, Zap, FolderMinus, FolderPlus, FileSignature, FolderKanban, User, Briefcase, Calendar, ChevronRight, ChevronLeft, Search, Sparkles, Check, Rows, Columns } from 'lucide-react';

interface PropertyPanelProps {
  diagram: DiagramState;
  setDiagram: React.Dispatch<React.SetStateAction<DiagramState>>;
  selectedNodeId: string | null;
  selectedContainerId: string | null;
  selectedLinkId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedContainerId: (id: string | null) => void;
  setSelectedLinkId: (id: string | null) => void;
  onRecordHistory: () => void;
  theme?: 'dark' | 'light';
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  diagram,
  setDiagram,
  selectedNodeId,
  selectedContainerId,
  selectedLinkId,
  setSelectedNodeId,
  setSelectedContainerId,
  setSelectedLinkId,
  onRecordHistory,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const [iconProviderFilter, setIconProviderFilter] = useState<CloudProvider | 'all'>('all');

  const selectedNode = diagram.nodes.find((n) => n.id === selectedNodeId);
  const selectedContainer = diagram.containers.find((c) => c.id === selectedContainerId);
  const selectedLink = diagram.links.find((l) => l.id === selectedLinkId);

  useEffect(() => {
    if (selectedNode) {
      setIconProviderFilter(selectedNode.provider);
    }
  }, [selectedNodeId, selectedNode?.provider]);

  const currentIconDef = selectedNode
    ? CLOUD_ICONS.find((i) => i.key === selectedNode.iconKey) ||
      CLOUD_ICONS.find((i) => i.key === 'generic_server')
    : null;

  const filteredIcons = selectedNode
    ? CLOUD_ICONS.filter((icon) => {
        const matchesProvider =
          iconProviderFilter === 'all' ? true : icon.provider === iconProviderFilter;
        const term = iconSearchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          icon.name.toLowerCase().includes(term) ||
          icon.key.toLowerCase().includes(term) ||
          icon.category.toLowerCase().includes(term) ||
          icon.description.toLowerCase().includes(term);
        return matchesProvider && matchesSearch;
      })
    : [];

  if (isCollapsed) {
    return (
      <aside
        id="property-inspector-collapsed"
        className={`w-12 border-l flex flex-col items-center py-4 select-none transition-all duration-200 z-20 ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#12141A] border-white/10 text-slate-300'
        }`}
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className={`p-2 rounded-xl transition-all shadow-md border ${
            isLight
              ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300'
              : 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border-blue-500/30'
          }`}
          title="Expandir detalhes do recurso (clique para abrir para a esquerda)"
        >
          <ChevronLeft className="w-5 h-5 text-blue-500" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <Sliders className={`w-4 h-4 ${isLight ? 'text-slate-700' : 'text-slate-400'}`} />
          <span
            className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
              isLight ? 'text-slate-900' : 'text-slate-400'
            }`}
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Detalhes dos Recursos
          </span>
        </div>
      </aside>
    );
  }

  if (!selectedNode && !selectedContainer && !selectedLink) {
    const metadata = diagram.metadata || {
      project: diagram.title || '',
      author: '',
      role: '',
      date: new Date().toLocaleDateString('pt-BR'),
      showOnCanvas: false
    };

    const updateMetadata = (key: string, value: any) => {
      onRecordHistory();
      setDiagram((prev) => ({
        ...prev,
        title: key === 'project' && value ? value : prev.title,
        metadata: {
          ...prev.metadata,
          [key]: value
        }
      }));
    };

    return (
      <aside className={`w-80 border-l p-4 text-xs flex flex-col h-full overflow-y-auto select-none space-y-4 transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#12141A] border-white/10 text-slate-300'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg border ${
              isLight ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
            }`}>
              <FileSignature className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className={`font-bold text-sm ${isLight ? 'text-slate-950' : 'text-slate-100'}`}>Carimbo do Diagrama</h3>
              <p className={`text-[10px] ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>Dados de identificação da arquitetura</p>
            </div>
          </div>

          <button
            onClick={() => setIsCollapsed(true)}
            className={`p-1.5 rounded-lg border transition-all ${
              isLight
                ? 'hover:bg-slate-100 text-slate-800 border-slate-300'
                : 'hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="Recolher detalhes do recurso para a direita"
          >
            <ChevronRight className="w-4 h-4 text-blue-500" />
          </button>
        </div>

        <div className="space-y-3.5">
          {/* Projeto */}
          <div>
            <label className={`block text-[11px] font-bold mb-1 flex items-center space-x-1.5 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
              <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
              <span>Projeto</span>
            </label>
            <input
              type="text"
              value={metadata.project ?? diagram.title ?? ''}
              onChange={(e) => updateMetadata('project', e.target.value)}
              placeholder="Nome do Projeto..."
              className={`w-full border focus:border-blue-600 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none transition-colors ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-950 placeholder-slate-500' : 'bg-black/40 border-white/10 text-slate-100'
              }`}
            />
          </div>

          {/* Autor */}
          <div>
            <label className={`block text-[11px] font-bold mb-1 flex items-center space-x-1.5 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Autor</span>
            </label>
            <input
              type="text"
              value={metadata.author ?? ''}
              onChange={(e) => updateMetadata('author', e.target.value)}
              placeholder="Nome do Autor..."
              className={`w-full border focus:border-blue-600 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none transition-colors ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-950 placeholder-slate-500' : 'bg-black/40 border-white/10 text-slate-100'
              }`}
            />
          </div>

          {/* Cargo */}
          <div>
            <label className={`block text-[11px] font-bold mb-1 flex items-center space-x-1.5 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              <span>Cargo / Posição</span>
            </label>
            <input
              type="text"
              value={metadata.role ?? ''}
              onChange={(e) => updateMetadata('role', e.target.value)}
              placeholder="Ex: Arquiteto de Soluções"
              className={`w-full border focus:border-blue-600 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none transition-colors ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-950 placeholder-slate-500' : 'bg-black/40 border-white/10 text-slate-100'
              }`}
            />
          </div>

          {/* Data */}
          <div>
            <label className={`block text-[11px] font-bold mb-1 flex items-center space-x-1.5 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Data</span>
            </label>
            <input
              type="text"
              value={metadata.date ?? new Date().toLocaleDateString('pt-BR')}
              onChange={(e) => updateMetadata('date', e.target.value)}
              placeholder="Ex: 28/07/2026"
              className={`w-full border focus:border-blue-600 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none transition-colors ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-950 placeholder-slate-500' : 'bg-black/40 border-white/10 text-slate-100'
              }`}
            />
          </div>

          {/* Toggle Display on Canvas */}
          <div className={`pt-2 border-t flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <span className={`text-xs font-bold ${isLight ? 'text-slate-950' : 'text-slate-300'}`}>Exibir Carimbo no Canvas</span>
            <button
              type="button"
              onClick={() => updateMetadata('showOnCanvas', metadata.showOnCanvas === true ? false : true)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                metadata.showOnCanvas === true ? 'bg-blue-600' : isLight ? 'bg-slate-300' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  metadata.showOnCanvas === true ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        <div className={`pt-4 border-t text-center text-[11px] leading-relaxed ${
          isLight ? 'border-slate-200 text-slate-700 font-medium' : 'border-white/10 text-slate-500'
        }`}>
          <Info className={`w-4 h-4 mx-auto mb-1 ${isLight ? 'text-slate-700' : 'text-slate-600'}`} />
          <span>Selecione qualquer nó, VPC ou conexão no canvas para inspecionar e alterar suas propriedades.</span>
        </div>
      </aside>
    );
  }

  // Handle Node Property Updates
  const updateNode = (updater: (node: DiagramNode) => DiagramNode) => {
    if (!selectedNodeId) return;
    onRecordHistory();
    setDiagram((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === selectedNodeId ? updater(n) : n))
    }));
  };

  // Handle Container Property Updates
  const updateContainer = (updater: (container: DiagramContainer) => DiagramContainer) => {
    if (!selectedContainerId) return;
    onRecordHistory();
    setDiagram((prev) => ({
      ...prev,
      containers: prev.containers.map((c) => (c.id === selectedContainerId ? updater(c) : c))
    }));
  };

  // Handle Link Property Updates
  const updateLink = (updater: (link: DiagramLink) => DiagramLink) => {
    if (!selectedLinkId) return;
    onRecordHistory();
    setDiagram((prev) => ({
      ...prev,
      links: prev.links.map((l) => (l.id === selectedLinkId ? updater(l) : l))
    }));
  };

  const handleDuplicate = () => {
    if (!selectedNodeId && !selectedContainerId) return;
    onRecordHistory();
    const timestamp = Date.now();
    if (selectedNodeId) {
      const node = diagram.nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        const newNode: DiagramNode = {
          ...node,
          id: `node_${timestamp}`,
          name: `${node.name} (Cópia)`,
          x: node.x + 30,
          y: node.y + 30,
          specs: { ...node.specs }
        };
        setDiagram((prev) => ({
          ...prev,
          nodes: [...prev.nodes, newNode]
        }));
        setSelectedNodeId(newNode.id);
      }
    } else if (selectedContainerId) {
      const container = diagram.containers.find((c) => c.id === selectedContainerId);
      if (container) {
        const newContainer: DiagramContainer = {
          ...container,
          id: `c_${timestamp}`,
          name: `${container.name} (Cópia)`,
          x: container.x + 30,
          y: container.y + 30
        };
        setDiagram((prev) => ({
          ...prev,
          containers: [...prev.containers, newContainer]
        }));
        setSelectedContainerId(newContainer.id);
      }
    }
  };

  const handleDelete = () => {
    onRecordHistory();
    if (selectedNodeId) {
      setDiagram((prev) => ({
        ...prev,
        nodes: prev.nodes.filter((n) => n.id !== selectedNodeId),
        links: prev.links.filter((l) => l.from !== selectedNodeId && l.to !== selectedNodeId)
      }));
      setSelectedNodeId(null);
    } else if (selectedContainerId) {
      setDiagram((prev) => ({
        ...prev,
        containers: prev.containers.filter((c) => c.id !== selectedContainerId)
      }));
      setSelectedContainerId(null);
    } else if (selectedLinkId) {
      setDiagram((prev) => ({
        ...prev,
        links: prev.links.filter((l) => l.id !== selectedLinkId)
      }));
      setSelectedLinkId(null);
    }
  };

  return (
    <aside id="property-inspector-panel" className={`w-80 border-l flex flex-col h-full z-20 shadow-xl select-none transition-colors ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#12141A] border-white/10 text-slate-200'
    }`}>
      {/* Inspector Header */}
      <div className={`p-3.5 border-b flex items-center justify-between ${
        isLight ? 'border-slate-200 bg-slate-100/80' : 'border-white/10 bg-black/20'
      }`}>
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-950' : 'text-slate-300'}`}>
            {selectedNode ? 'Resource Inspector' : selectedContainer ? 'Container Inspector' : 'Link Inspector'}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {(selectedNode || selectedContainer) && (
            <button
              onClick={handleDuplicate}
              title="Duplicar Item (Ctrl+D)"
              className="p-1.5 hover:bg-blue-500/20 text-blue-600 rounded-md transition-colors flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleDelete}
            title="Excluir Item (Delete)"
            className="p-1.5 hover:bg-red-500/20 text-red-600 rounded-md transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            title="Recolher detalhes do recurso para a direita"
            className={`p-1.5 rounded-md transition-colors ml-1 ${
              isLight ? 'hover:bg-slate-200 text-slate-800' : 'hover:bg-white/10 text-slate-300'
            }`}
          >
            <ChevronRight className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* ================= NODE INSPECTOR ================= */}
        {selectedNode && (
          <>
            {/* Resource Name */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                Resource Name
              </label>
              <input
                type="text"
                value={selectedNode.name}
                onChange={(e) => updateNode((n) => ({ ...n, name: e.target.value }))}
                className={`w-full border rounded-md px-3 py-1.5 text-xs font-semibold outline-none ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Quick Actions / Clone Button for Node */}
            <div className={`p-2.5 rounded-xl border space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Ações Rápidas
                </span>
                <span className="text-[9px] text-slate-400 font-mono">Offset: +30px</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-clone-node"
                  onClick={handleDuplicate}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 shadow-sm ${
                    isLight
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                      : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500'
                  }`}
                  title="Clonar Nó - Cria uma cópia idêntica do nó selecionado posicionada ligeiramente deslocada"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Clonar Nó</span>
                </button>

                <button
                  type="button"
                  id="btn-delete-node"
                  onClick={handleDelete}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 shadow-sm ${
                    isLight
                      ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                  }`}
                  title="Excluir Nó"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir</span>
                </button>

                {diagram.nodes.length > 1 && (
                  <div className="col-span-2 pt-2 border-t flex items-center justify-between gap-2 border-white/10">
                    <button
                      type="button"
                      id="btn-prop-align-h"
                      onClick={() => {
                        onRecordHistory();
                        const avgY = Math.round(diagram.nodes.reduce((s, n) => s + n.y, 0) / diagram.nodes.length / 20) * 20;
                        updateNode((n) => ({ ...n, y: avgY }));
                      }}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center space-x-1.5 shadow-sm ${
                        isLight
                          ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                      title="Alinhar este nó ao eixo horizontal médio dos outros componentes"
                    >
                      <Rows className="w-3.5 h-3.5 text-blue-400" />
                      <span>Alinhar Horiz.</span>
                    </button>

                    <button
                      type="button"
                      id="btn-prop-align-v"
                      onClick={() => {
                        onRecordHistory();
                        const avgX = Math.round(diagram.nodes.reduce((s, n) => s + n.x, 0) / diagram.nodes.length / 20) * 20;
                        updateNode((n) => ({ ...n, x: avgX }));
                      }}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center space-x-1.5 shadow-sm ${
                        isLight
                          ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                      title="Alinhar este nó ao eixo vertical médio dos outros componentes"
                    >
                      <Columns className="w-3.5 h-3.5 text-blue-400" />
                      <span>Alinhar Vert.</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Provider & Category Badges */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Cloud Provider
                </label>
                <select
                  value={selectedNode.provider}
                  onChange={(e) => updateNode((n) => ({ ...n, provider: e.target.value as CloudProvider }))}
                  className={`w-full border rounded-md px-2.5 py-1.5 text-xs outline-none uppercase font-bold ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                  }`}
                >
                  <option value="aws">AWS</option>
                  <option value="azure">Azure</option>
                  <option value="gcp">GCP</option>
                  <option value="oci">OCI</option>
                  <option value="generic">Generic</option>
                </select>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Category
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedNode.category}
                  className={`w-full border rounded-md px-2.5 py-1.5 text-xs outline-none uppercase font-bold ${
                    isLight ? 'bg-slate-200/80 border-slate-300 text-slate-800' : 'bg-black/20 border-white/5 text-slate-500'
                  }`}
                />
              </div>
            </div>

            {/* Icon Selector / Architecture Symbol Swap */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Icon Selector</span>
                </div>
                <span className="text-[9px] text-blue-500 font-mono font-bold uppercase">
                  {selectedNode.provider} Icons
                </span>
              </label>

              {/* Current Selected Icon Box with Swap trigger button */}
              <div className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                isLight ? 'bg-slate-50 border-slate-300 hover:border-blue-400' : 'bg-black/40 border-white/10 hover:border-blue-500/50'
              }`}>
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div 
                    className="w-8 h-8 rounded-lg p-1 flex-shrink-0 flex items-center justify-center border bg-slate-900/10"
                    style={{ borderColor: `${currentIconDef?.brandColor || '#3b82f6'}40` }}
                    dangerouslySetInnerHTML={{ __html: currentIconDef?.svg || '' }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      {currentIconDef?.name || selectedNode.iconKey}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 truncate">
                      {currentIconDef?.category || selectedNode.category} • {currentIconDef?.key}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-open-icon-selector"
                  onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border flex items-center space-x-1.5 transition-all shadow-sm flex-shrink-0 ml-2 ${
                    isIconSelectorOpen
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : isLight
                      ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800'
                      : 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-300'
                  }`}
                  title="Trocar ícone por outro do mesmo provedor ou do catálogo"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isIconSelectorOpen ? 'animate-spin-once' : ''}`} />
                  <span>{isIconSelectorOpen ? 'Fechar' : 'Alterar'}</span>
                </button>
              </div>

              {/* Expandable Icon Selector Grid */}
              {isIconSelectorOpen && (
                <div className={`mt-2 p-2.5 rounded-xl border text-xs space-y-2 shadow-inner transition-all ${
                  isLight ? 'bg-slate-100/90 border-slate-300' : 'bg-black/60 border-white/10'
                }`}>
                  {/* Search & Provider Filter Bar */}
                  <div className="flex items-center space-x-1.5">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
                      <input
                        id="input-search-node-icon"
                        type="text"
                        value={iconSearchTerm}
                        onChange={(e) => setIconSearchTerm(e.target.value)}
                        placeholder="Buscar ícone (ex: ec2, s3, database)..."
                        className={`w-full pl-7 pr-2 py-1 rounded-lg border text-[11px] outline-none transition-colors ${
                          isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-[#12141A] border-white/10 text-slate-100 focus:border-blue-500'
                        }`}
                      />
                    </div>

                    <select
                      value={iconProviderFilter}
                      onChange={(e) => setIconProviderFilter(e.target.value as CloudProvider | 'all')}
                      className={`border rounded-lg px-2 py-1 text-[11px] font-bold outline-none uppercase ${
                        isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-[#12141A] border-white/10 text-slate-200'
                      }`}
                      title="Filtrar ícones por provedor"
                    >
                      <option value={selectedNode.provider}>{selectedNode.provider.toUpperCase()}</option>
                      <option value="all">TODOS</option>
                      <option value="aws">AWS</option>
                      <option value="azure">AZURE</option>
                      <option value="gcp">GCP</option>
                      <option value="oci">OCI</option>
                      <option value="generic">GENERIC</option>
                    </select>
                  </div>

                  {/* Helper count notice */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
                    <span>Ícones ({filteredIcons.length} disponíveis)</span>
                    {iconProviderFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setIconProviderFilter('all')}
                        className="text-blue-500 hover:underline text-[10px] font-semibold"
                      >
                        Ver todos
                      </button>
                    )}
                  </div>

                  {/* Grid of Approved Icons */}
                  <div className="grid grid-cols-3 gap-1.5 max-h-56 overflow-y-auto custom-scrollbar p-0.5">
                    {filteredIcons.map((icon) => {
                      const isSelectedIcon = icon.key === selectedNode.iconKey;
                      return (
                        <button
                          key={icon.key}
                          type="button"
                          onClick={() => {
                            updateNode((n) => ({
                              ...n,
                              iconKey: icon.key,
                              category: icon.category,
                              resourceType: icon.defaultResourceType || n.resourceType
                            }));
                          }}
                          title={`${icon.name} (${icon.provider.toUpperCase()}) - ${icon.description}`}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all group relative ${
                            isSelectedIcon
                              ? 'ring-2 ring-blue-500 border-blue-500 ' + (isLight ? 'bg-blue-50/80' : 'bg-blue-500/20')
                              : isLight
                              ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 hover:shadow-sm'
                              : 'bg-[#12141A] hover:bg-white/5 border-white/5 hover:border-blue-500/50'
                          }`}
                        >
                          <div
                            className="w-7 h-7 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"
                            dangerouslySetInnerHTML={{ __html: icon.svg }}
                          />
                          <span className={`text-[10px] font-bold line-clamp-1 w-full leading-tight ${
                            isSelectedIcon ? 'text-blue-600 font-extrabold' : isLight ? 'text-slate-800' : 'text-slate-200'
                          }`}>
                            {icon.name.replace(/^(AWS|Azure|GCP|OCI)\s+/, '')}
                          </span>
                          <span
                            className="text-[8px] font-mono font-bold uppercase mt-0.5 px-1 rounded"
                            style={{
                              backgroundColor: `${icon.brandColor || '#3b82f6'}15`,
                              color: icon.brandColor || '#3b82f6'
                            }}
                          >
                            {icon.category}
                          </span>

                          {isSelectedIcon && (
                            <div className="absolute -top-1 -right-1 bg-blue-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}

                    {filteredIcons.length === 0 && (
                      <div className="col-span-3 py-6 text-center text-slate-400 text-xs">
                        Nenhum ícone encontrado para a busca "{iconSearchTerm}".
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Instance Sizing / Machine Type */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                Instance Type / Tier
              </label>
              <input
                type="text"
                value={selectedNode.specs.instanceType || ''}
                placeholder="e.g. t3.medium, Standard_D2s_v3, e2-standard-2"
                onChange={(e) => updateNode((n) => ({ ...n, specs: { ...n.specs, instanceType: e.target.value } }))}
                className={`w-full border rounded-md px-3 py-1.5 text-xs font-mono font-semibold outline-none ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Count & Storage */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Instance Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={selectedNode.specs.count || 1}
                  onChange={(e) => updateNode((n) => ({ ...n, specs: { ...n.specs, count: parseInt(e.target.value) || 1 } }))}
                  className={`w-full border rounded-md px-3 py-1.5 text-xs font-semibold outline-none ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Storage (GB)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={selectedNode.specs.storageGb || 0}
                  onChange={(e) => updateNode((n) => ({ ...n, specs: { ...n.specs, storageGb: parseInt(e.target.value) || 0 } }))}
                  className={`w-full border rounded-md px-3 py-1.5 text-xs font-semibold outline-none ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Region */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                Deployment Region
              </label>
              <input
                type="text"
                value={selectedNode.specs.region || ''}
                placeholder="e.g. us-east-1, eastus, us-central1, us-ashburn-1"
                onChange={(e) => updateNode((n) => ({ ...n, specs: { ...n.specs, region: e.target.value } }))}
                className={`w-full border rounded-md px-3 py-1.5 text-xs font-semibold outline-none ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Terraform Resource Type */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                Terraform Resource Type
              </label>
              <input
                type="text"
                value={selectedNode.resourceType}
                onChange={(e) => updateNode((n) => ({ ...n, resourceType: e.target.value }))}
                className={`w-full border rounded-md px-3 py-1.5 text-xs font-mono outline-none ${
                  isLight ? 'bg-slate-100 border-slate-300 text-emerald-900 font-bold' : 'bg-black/40 border-white/10 text-emerald-400'
                }`}
              />
            </div>
          </>
        )}

        {/* ================= CONTAINER INSPECTOR ================= */}
        {selectedContainer && (
          <>
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                Nome da Rede / Container
              </label>
              <input
                type="text"
                value={selectedContainer.name}
                onChange={(e) => updateContainer((c) => ({ ...c, name: e.target.value }))}
                className={`w-full border rounded-md px-3 py-1.5 text-xs font-semibold outline-none ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                Tipo de Container / Escopo
              </label>
              <select
                value={selectedContainer.type}
                onChange={(e) => updateContainer((c) => ({ ...c, type: e.target.value as any }))}
                className={`w-full border rounded-md px-2.5 py-1.5 text-xs outline-none font-bold ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                }`}
              >
                <option value="vpc">Rede Principal (VPC / VNet)</option>
                <option value="subnet">Sub-rede (Subnet)</option>
                <option value="resource_group">Grupo de Recursos (Resource Group)</option>
                <option value="compartment">Compartimento (OCI Compartment)</option>
                <option value="custom">Container Personalizado</option>
              </select>
            </div>

            {/* Container / Subnet Theme Colors */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                Cor da Rede / Sub-rede
              </label>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {[
                  { name: 'VPC Azul', hex: '#3B82F6', tag: 'VPC' },
                  { name: 'Pública', hex: '#10B981', tag: 'Pub' },
                  { name: 'Privada', hex: '#F59E0B', tag: 'Priv' },
                  { name: 'Isolada', hex: '#EF4444', tag: 'Iso' },
                  { name: 'Azure', hex: '#0EA5E9', tag: 'Az' },
                  { name: 'Roxo', hex: '#8B5CF6', tag: 'OCI' },
                  { name: 'On-Prem', hex: '#64748B', tag: 'OnP' },
                  { name: 'Pink', hex: '#EC4899', tag: 'App' }
                ].map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => updateContainer((c) => ({ ...c, color: preset.hex }))}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all ${
                      (selectedContainer.color || '#3B82F6') === preset.hex
                        ? isLight
                          ? 'border-slate-800 bg-slate-200 shadow-md'
                          : 'border-white bg-white/10 shadow-md'
                        : isLight
                        ? 'border-slate-200 bg-slate-100 hover:bg-slate-200/80'
                        : 'border-white/5 bg-black/30 hover:bg-white/5'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/30 mb-0.5"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className={`text-[9px] font-bold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>{preset.tag}</span>
                  </button>
                ))}
              </div>

              {/* Color picker custom */}
              <div className={`flex items-center space-x-2 p-1.5 rounded-md border ${
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-black/30 border-white/10'
              }`}>
                <input
                  type="color"
                  value={selectedContainer.color || '#3B82F6'}
                  onChange={(e) => updateContainer((c) => ({ ...c, color: e.target.value }))}
                  className="w-7 h-7 bg-transparent cursor-pointer rounded overflow-hidden"
                />
                <span className={`text-xs font-mono uppercase ${isLight ? 'text-slate-950 font-bold' : 'text-slate-300'}`}>
                  {selectedContainer.color || '#3B82F6'}
                </span>
                <span className={`text-[10px] ml-auto font-medium ${isLight ? 'text-slate-700' : 'text-slate-500'}`}>Cor Personalizada</span>
              </div>
            </div>

            {/* Border Style */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                Estilo do Contorno
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'dashed', label: 'Tracejada', icon: '╌ ╌ ╌' },
                  { id: 'solid', label: 'Sólida', icon: '──────' },
                  { id: 'dotted', label: 'Pontilhada', icon: '• • • •' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => updateContainer((c) => ({ ...c, borderStyle: st.id as any }))}
                    className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md border text-xs font-semibold transition-all ${
                      (selectedContainer.borderStyle || 'dashed') === st.id
                        ? isLight
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                          : 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-sm'
                        : isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-800 hover:text-slate-950 hover:bg-slate-200'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] font-mono opacity-80 mb-0.5">{st.icon}</span>
                    <span className="text-[11px]">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Largura (px)
                </label>
                <input
                  type="number"
                  step="20"
                  value={selectedContainer.width}
                  onChange={(e) => updateContainer((c) => ({ ...c, width: parseInt(e.target.value) || 200 }))}
                  className={`w-full border rounded-md px-3 py-1.5 text-xs font-semibold outline-none ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Altura (px)
                </label>
                <input
                  type="number"
                  step="20"
                  value={selectedContainer.height}
                  onChange={(e) => updateContainer((c) => ({ ...c, height: parseInt(e.target.value) || 150 }))}
                  className={`w-full border rounded-md px-3 py-1.5 text-xs font-semibold outline-none ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            <div className={`pt-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <button
                type="button"
                onClick={() => {
                  onRecordHistory();
                  setDiagram((prev) => ({
                    ...prev,
                    containers: prev.containers.filter((c) => c.id !== selectedContainer.id)
                  }));
                  setSelectedContainerId(null);
                }}
                className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm border ${
                  isLight
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-400'
                    : 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border-amber-500/30'
                }`}
              >
                <FolderMinus className="w-3.5 h-3.5 text-amber-600" />
                <span>Desagrupar Container</span>
              </button>
            </div>
          </>
        )}

        {/* ================= LINK INSPECTOR ================= */}
        {selectedLink && (() => {
          const fromNode = diagram.nodes.find((n) => n.id === selectedLink.from);
          const toNode = diagram.nodes.find((n) => n.id === selectedLink.to);
          const inferred = inferProtocolForLink(fromNode, toNode);

          const applyPreset = (preset: { label: string; protocol: any; style: any; color: string }) => {
            updateLink((l) => ({
              ...l,
              label: preset.label,
              protocol: preset.protocol,
              style: preset.style,
              color: preset.color
            }));
          };

          return (
            <>
              {/* Connection Endpoints Header */}
              <div className={`border rounded-xl p-3 text-xs space-y-2 ${
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/10'
              }`}>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span className={isLight ? 'text-slate-950 font-bold' : 'text-slate-400'}>Conexão Ativa</span>
                  <span className="text-blue-600 font-mono font-bold">{selectedLink.protocol || 'TCP'}</span>
                </div>

                <div className={`flex items-center justify-between space-x-2 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  <div className={`flex-1 min-w-0 p-1.5 rounded-lg border truncate text-center ${
                    isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'
                  }`}>
                    <span className="font-bold text-[11px] block truncate">{fromNode?.name || 'Origem'}</span>
                    <span className={`text-[9px] uppercase font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{fromNode?.category || 'componente'}</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0" />

                  <div className={`flex-1 min-w-0 p-1.5 rounded-lg border truncate text-center ${
                    isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'
                  }`}>
                    <span className="font-bold text-[11px] block truncate">{toNode?.name || 'Destino'}</span>
                    <span className={`text-[9px] uppercase font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{toNode?.category || 'componente'}</span>
                  </div>
                </div>

                {/* Auto Re-infer protocol button */}
                <button
                  type="button"
                  onClick={() => applyPreset(inferred)}
                  className={`w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 border rounded-lg text-[11px] font-bold transition-all ${
                    isLight
                      ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-900'
                      : 'bg-blue-600/20 hover:bg-blue-600/40 border-blue-500/40 text-blue-300'
                  }`}
                >
                  <RefreshCw className="w-3 h-3 text-blue-600" />
                  <span>Sugerir Protocolo Recomendado</span>
                </button>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Rótulo do Protocolo / Porta
                </label>
                <input
                  type="text"
                  value={selectedLink.label || ''}
                  placeholder="ex: HTTPS / 443, Consulta SQL, gRPC"
                  onChange={(e) => updateLink((l) => ({ ...l, label: e.target.value }))}
                  className={`w-full border rounded-md px-3 py-1.5 text-xs font-semibold outline-none ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-950 focus:border-blue-600' : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                  }`}
                />

                {/* Protocol Quick Presets Grid */}
                <label className={`block text-[10px] font-bold uppercase tracking-wider mt-3 mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Selecione o Protocolo
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'HTTPS / 443', protocol: 'HTTPS', style: 'solid', color: '#0EA5E9', desc: 'Web Seguro' },
                    { label: 'HTTP / 8080', protocol: 'HTTP', style: 'solid', color: '#10B981', desc: 'Backend Proxy' },
                    { label: 'gRPC / 50051', protocol: 'gRPC', style: 'solid', color: '#10B981', desc: 'Microserviços' },
                    { label: 'SQL / 5432', protocol: 'SQL', style: 'solid', color: '#2563EB', desc: 'PostgreSQL / SQL' },
                    { label: 'SQL / 3306', protocol: 'SQL', style: 'solid', color: '#2563EB', desc: 'MySQL / Aurora' },
                    { label: 'Redis / 6379', protocol: 'TCP', style: 'solid', color: '#DC2626', desc: 'Cache Memória' },
                    { label: 'Kafka / 9092', protocol: 'TCP', style: 'dashed', color: '#EC4899', desc: 'Event Stream' },
                    { label: 'AMQP / 5672', protocol: 'TCP', style: 'dashed', color: '#EC4899', desc: 'Fila Mensagens' },
                    { label: 'NFS / 2049', protocol: 'TCP', style: 'solid', color: '#0284C7', desc: 'Storage EFS' },
                    { label: 'Peering / IPsec', protocol: 'Peering', style: 'dashed', color: '#8B5CF6', desc: 'Rede / VPN' }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPreset(p as any)}
                      className={`flex flex-col items-start p-2 rounded-lg border transition-all text-left ${
                        selectedLink.label === p.label
                          ? isLight
                            ? 'bg-blue-100 border-blue-500 text-blue-900 shadow-md ring-1 ring-blue-400 font-bold'
                            : 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-md ring-1 ring-blue-500/50'
                          : isLight
                          ? 'bg-slate-100 border-slate-200 hover:border-slate-400 text-slate-800 hover:bg-slate-200/70 font-semibold'
                          : 'bg-black/30 border-white/5 hover:border-white/20 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-mono text-[10px] font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>{p.label}</span>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      </div>
                      <span className={`text-[9px] mt-0.5 ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Style (Solid, Dashed, Dotted) */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Estilo da Linha
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'solid', label: 'Sólida', icon: '──────' },
                    { id: 'dashed', label: 'Tracejada', icon: ' ╌ ╌ ╌ ' },
                    { id: 'dotted', label: 'Pontilhada', icon: ' • • • • ' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => updateLink((l) => ({ ...l, style: st.id as any }))}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-md border text-xs font-semibold transition-all ${
                        (selectedLink.style || 'solid') === st.id
                          ? isLight
                            ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                            : 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-sm'
                          : isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-800 hover:text-slate-950 hover:bg-slate-200'
                          : 'bg-black/30 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-[10px] font-mono mb-0.5 opacity-80">{st.icon}</span>
                      <span className="text-[11px]">{st.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrow Head Direction */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Direção das Setas
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'end', label: 'Seta no Fim ( ──► )' },
                    { id: 'both', label: 'Ambas Pontas ( ◄──► )' },
                    { id: 'start', label: 'Seta no Início ( ◄── )' },
                    { id: 'none', label: 'Sem Setas ( ────── )' }
                  ].map((arrow) => (
                    <button
                      key={arrow.id}
                      type="button"
                      onClick={() => updateLink((l) => ({ ...l, arrowHead: arrow.id as any }))}
                      className={`py-1.5 px-2 rounded-md border text-center text-xs font-bold transition-all ${
                        (selectedLink.arrowHead || 'end') === arrow.id
                          ? isLight
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                            : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-800 hover:text-slate-950 hover:bg-slate-200'
                          : 'bg-black/30 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      {arrow.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stroke Thickness */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Espessura da Linha
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { width: 1, label: 'Fina (1px)' },
                    { width: 2, label: 'Normal (2px)' },
                    { width: 4, label: 'Grossa (4px)' }
                  ].map((th) => (
                    <button
                      key={th.width}
                      type="button"
                      onClick={() => updateLink((l) => ({ ...l, strokeWidth: th.width }))}
                      className={`py-1.5 px-2 rounded-md border text-center text-xs font-bold transition-all ${
                        (selectedLink.strokeWidth || 2) === th.width
                          ? isLight
                            ? 'bg-blue-600 border-blue-600 text-white font-bold'
                            : 'bg-blue-600/30 border-blue-500 text-blue-300'
                          : isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-800 hover:text-slate-950 hover:bg-slate-200'
                          : 'bg-black/30 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Color Selector */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-950' : 'text-slate-400'}`}>
                  Cor da Conexão
                </label>
                <div className="flex items-center space-x-1.5">
                  {[
                    { name: 'Sky', hex: '#38BDF8' },
                    { name: 'Emerald', hex: '#34D399' },
                    { name: 'Amber', hex: '#FBBF24' },
                    { name: 'Rose', hex: '#F87171' },
                    { name: 'Purple', hex: '#A78BFA' },
                    { name: 'Gray', hex: '#9CA3AF' }
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => updateLink((l) => ({ ...l, color: c.hex }))}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                        (selectedLink.color || '#38BDF8') === c.hex
                          ? isLight ? 'border-slate-800 scale-110 shadow-md' : 'border-white scale-110 shadow-md'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={selectedLink.color || '#38BDF8'}
                    onChange={(e) => updateLink((l) => ({ ...l, color: e.target.value }))}
                    className="w-7 h-7 bg-transparent cursor-pointer rounded overflow-hidden"
                    title="Cor personalizada"
                  />
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </aside>
  );
};
