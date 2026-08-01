import React, { useState, useRef, useEffect } from 'react';
import { Search, Box, Layers, ArrowRightLeft, Shield, Server, Database, Cpu, Cloud, Globe, Sparkles, Network, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { CLOUD_ICONS } from '../data/cloudIcons';
import { CloudProvider, ServiceCategory, CloudIconDefinition, DiagramContainer } from '../types';

interface SidebarCatalogProps {
  onAddNode: (icon: CloudIconDefinition) => void;
  onAddContainer: (type: 'vpc' | 'subnet' | 'resource_group' | 'compartment', provider: CloudProvider) => void;
  isConnectingMode: boolean;
  setIsConnectingMode: (active: boolean) => void;
  theme?: 'dark' | 'light';
}

export const SidebarCatalog: React.FC<SidebarCatalogProps> = ({
  onAddNode,
  onAddContainer,
  isConnectingMode,
  setIsConnectingMode,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const [draggingIconKey, setDraggingIconKey] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, icon: CloudIconDefinition) => {
    e.dataTransfer.setData('application/json', JSON.stringify(icon));
    e.dataTransfer.effectAllowed = 'copy';
    setDraggingIconKey(icon.key);

    // Create custom ghost drag preview element
    const ghost = document.createElement('div');
    ghost.style.position = 'fixed';
    ghost.style.top = '-1000px';
    ghost.style.left = '-1000px';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '99999';
    ghost.className = `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl border-2 border-dashed shadow-2xl backdrop-blur-md opacity-90 ${
      isLight 
        ? 'bg-white/95 border-blue-500 text-slate-900 shadow-blue-500/30' 
        : 'bg-[#12141A]/95 border-blue-400 text-slate-100 shadow-blue-500/40'
    }`;
    
    ghost.innerHTML = `
      <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        ${icon.svg}
      </div>
      <div style="display: flex; flex-direction: column;">
        <span style="font-size: 12px; font-weight: 800; color: ${isLight ? '#0f172a' : '#f8fafc'};">${icon.name}</span>
        <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: ${icon.brandColor || '#3b82f6'};">${icon.provider}</span>
      </div>
    `;
    
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 45, 25);

    setTimeout(() => {
      if (ghost.parentNode) {
        ghost.parentNode.removeChild(ghost);
      }
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggingIconKey(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNetworkDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getVpcButtonText = () => {
    switch (selectedProvider) {
      case 'aws': return 'Add AWS VPC';
      case 'azure': return 'Add Azure VNet';
      case 'gcp': return 'Add GCP VPC';
      case 'oci': return 'Add OCI VCN';
      default: return 'Add VPC / VNet';
    }
  };

  const filteredIcons = CLOUD_ICONS.filter((icon) => {
    const matchesProvider = selectedProvider === 'all' || icon.provider === selectedProvider || icon.provider === 'generic';
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          icon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          icon.key.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProvider && matchesCategory && matchesSearch;
  });

  if (isCollapsed) {
    return (
      <aside
        id="sidebar-catalog-collapsed"
        className={`w-12 border-r flex flex-col items-center py-4 select-none transition-all duration-200 z-20 ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#12141A] border-white/10 text-slate-300'
        }`}
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className={`p-2 rounded-xl transition-all shadow-md border ${
            isLight
              ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300'
              : 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border-blue-500/30'
          }`}
          title="Expandir Canvas Tools & Catálogo (clique para abrir para a direita)"
        >
          <ChevronRight className="w-5 h-5 text-blue-500" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <Box className={`w-4 h-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`} />
          <span
            className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
              isLight ? 'text-slate-800' : 'text-slate-400'
            }`}
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Canvas Tools & Catálogo
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside id="sidebar-catalog" className={`w-80 border-r flex flex-col h-full z-20 shadow-xl select-none transition-colors ${
      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#12141A] border-white/10 text-slate-300'
    }`}>
      {/* Quick Action Tools: Containers & Connector */}
      <div className={`p-3 border-b space-y-2 ${
        isLight ? 'border-slate-200 bg-slate-100/70' : 'border-white/10 bg-black/20'
      }`}>
        <div className="flex items-center justify-between px-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${
            isLight ? 'text-slate-900' : 'text-slate-500'
          }`}>
            Canvas Tools & Boundaries
          </span>
          <button
            onClick={() => setIsCollapsed(true)}
            className={`p-1.5 rounded-lg border transition-all ${
              isLight
                ? 'hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="Recolher Canvas Tools para a esquerda"
          >
            <ChevronLeft className="w-4 h-4 text-blue-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-toggle-connector"
            onClick={() => setIsConnectingMode(!isConnectingMode)}
            className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-md text-xs font-semibold border transition-all ${
              isConnectingMode
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                : isLight
                ? 'bg-white border-slate-300 hover:bg-slate-50 text-slate-900 font-bold'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-500" />
            <span>{isConnectingMode ? 'Connecting Mode' : 'Connect Nodes'}</span>
          </button>

          {/* VPC / VNet / VCN Boundary Selector Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="btn-add-vpc"
              onClick={() => {
                if (selectedProvider === 'all' || selectedProvider === 'generic') {
                  setIsNetworkDropdownOpen(!isNetworkDropdownOpen);
                } else {
                  onAddContainer('vpc', selectedProvider);
                }
              }}
              className={`w-full flex items-center justify-between border px-2.5 py-2 rounded-md text-xs font-semibold transition-all ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-1.5 truncate">
                <Layers className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span className="truncate">{getVpcButtonText()}</span>
              </div>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-150 shrink-0 ${
                  isLight ? 'text-slate-700' : 'text-slate-400'
                } ${isNetworkDropdownOpen ? 'rotate-180' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNetworkDropdownOpen(!isNetworkDropdownOpen);
                }}
              />
            </button>

            {/* Network Provider Dropdown Popover */}
            {isNetworkDropdownOpen && (
              <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-2xl z-50 py-1 divide-y ${
                isLight ? 'bg-white border-slate-300 divide-slate-200' : 'bg-[#1A1D24] border-white/15 divide-white/5'
              }`}>
                <div className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  Selecione a Rede (Network Boundary)
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onAddContainer('vpc', 'aws');
                      setIsNetworkDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs transition-colors ${
                      isLight ? 'hover:bg-slate-100 text-slate-900' : 'hover:bg-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                      <span className={`font-semibold ${isLight ? 'text-amber-950' : 'text-amber-300'}`}>AWS VPC</span>
                    </div>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>Virtual Private Cloud</span>
                  </button>

                  <button
                    onClick={() => {
                      onAddContainer('vpc', 'azure');
                      setIsNetworkDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs transition-colors ${
                      isLight ? 'hover:bg-slate-100 text-slate-900' : 'hover:bg-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
                      <span className={`font-semibold ${isLight ? 'text-sky-950' : 'text-sky-300'}`}>Azure VNet</span>
                    </div>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>Virtual Network</span>
                  </button>

                  <button
                    onClick={() => {
                      onAddContainer('vpc', 'gcp');
                      setIsNetworkDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs transition-colors ${
                      isLight ? 'hover:bg-slate-100 text-slate-900' : 'hover:bg-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span className={`font-semibold ${isLight ? 'text-emerald-950' : 'text-emerald-300'}`}>GCP VPC</span>
                    </div>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>GCP VPC Network</span>
                  </button>

                  <button
                    onClick={() => {
                      onAddContainer('vpc', 'oci');
                      setIsNetworkDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs transition-colors ${
                      isLight ? 'hover:bg-slate-100 text-slate-900' : 'hover:bg-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                      <span className={`font-semibold ${isLight ? 'text-red-950' : 'text-red-300'}`}>OCI VCN</span>
                    </div>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>Virtual Cloud Network</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            id="btn-add-subnet"
            onClick={() => onAddContainer('subnet', selectedProvider === 'all' ? 'aws' : selectedProvider)}
            className={`flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-emerald-500" />
            <span>Subnet</span>
          </button>

          <button
            id="btn-add-compartment"
            onClick={() => onAddContainer('compartment', 'oci')}
            className={`flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-red-500" />
            <span>Compartment</span>
          </button>
        </div>
      </div>

      {/* Cloud Provider Tabs */}
      <div className={`p-3 border-b ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-[#12141A]'}`}>
        <div className={`flex items-center justify-between space-x-0.5 p-1 rounded-md border overflow-x-auto ${
          isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-black/40 border-white/5'
        }`}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'generic', label: 'Comuns', color: isLight ? 'text-purple-900' : 'text-purple-400' },
            { id: 'aws', label: 'AWS', color: isLight ? 'text-amber-900' : 'text-amber-400' },
            { id: 'azure', label: 'Azure', color: isLight ? 'text-sky-900' : 'text-sky-400' },
            { id: 'gcp', label: 'GCP', color: isLight ? 'text-emerald-900' : 'text-emerald-400' },
            { id: 'oci', label: 'OCI', color: isLight ? 'text-red-900' : 'text-red-400' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-provider-${tab.id}`}
              onClick={() => setSelectedProvider(tab.id as any)}
              className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded transition-all text-center whitespace-nowrap ${
                selectedProvider === tab.id
                  ? isLight
                    ? 'bg-white text-slate-950 shadow border border-slate-300'
                    : 'bg-white/10 text-white shadow-sm border border-white/10'
                  : isLight
                  ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/80'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className={tab.color || ''}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative mt-2.5">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`} />
          <input
            id="input-search-icons"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search icons (e.g. EC2, BigQuery, AKS)..."
            className={`w-full border rounded-md pl-8 pr-3 py-1.5 text-xs outline-none transition-colors ${
              isLight
                ? 'bg-white border-slate-300 focus:border-blue-600 text-slate-950 placeholder-slate-500 font-medium'
                : 'bg-black/40 border-white/10 focus:border-blue-500 text-slate-200 placeholder-slate-500'
            }`}
          />
        </div>
      </div>

      {/* Service Category Quick Filter Pills */}
      <div className={`px-3 py-2 border-b flex items-center space-x-1.5 overflow-x-auto no-scrollbar ${
        isLight ? 'border-slate-200' : 'border-white/5'
      }`}>
        {[
          { id: 'all', label: 'All' },
          { id: 'compute', label: 'Compute' },
          { id: 'storage', label: 'Storage' },
          { id: 'database', label: 'Database' },
          { id: 'networking', label: 'Network' },
          { id: 'security', label: 'Security' },
          { id: 'devops', label: 'DevOps' },
          { id: 'ai', label: 'AI/ML' },
          { id: 'container', label: 'Containers' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`whitespace-nowrap px-2.5 py-0.5 text-[10px] font-semibold rounded-full border transition-all ${
              selectedCategory === cat.id
                ? isLight
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                : isLight
                ? 'bg-white border-slate-300 text-slate-800 font-medium hover:text-slate-950 hover:bg-slate-100'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Icons Catalog Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {filteredIcons.length === 0 ? (
          <div className={`text-center py-12 text-xs font-medium ${isLight ? 'text-slate-700' : 'text-slate-500'}`}>
            No cloud services found matching "{searchTerm}"
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredIcons.map((icon) => (
              <div
                key={icon.key}
                id={`icon-card-${icon.key}`}
                onClick={() => onAddNode(icon)}
                draggable
                onDragStart={(e) => handleDragStart(e, icon)}
                onDragEnd={handleDragEnd}
                className={`group relative border rounded-lg p-2.5 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
                  draggingIconKey === icon.key
                    ? 'opacity-40 border-dashed border-blue-500 scale-95 bg-blue-500/10 ring-2 ring-blue-500/30'
                    : isLight
                    ? 'bg-white border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-slate-900'
                    : 'bg-white/5 border-white/5 hover:border-blue-500/50 hover:bg-white/10 text-slate-200'
                }`}
              >
                {/* Provider Badge */}
                <span
                  className="absolute top-2 right-2 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded opacity-90 group-hover:opacity-100"
                  style={{ backgroundColor: `${icon.brandColor}20`, color: icon.brandColor }}
                >
                  {icon.provider}
                </span>

                {/* SVG Icon */}
                <div
                  className="w-10 h-10 my-1 flex items-center justify-center p-1 rounded group-hover:scale-105 transition-transform"
                  dangerouslySetInnerHTML={{ __html: icon.svg }}
                />

                {/* Label */}
                <div className="w-full mt-1">
                  <span className={`block text-xs font-bold truncate ${
                    isLight ? 'text-slate-950 group-hover:text-blue-700' : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {icon.name}
                  </span>
                  <span className={`block text-[10px] truncate mt-0.5 ${
                    isLight ? 'text-slate-700 font-medium' : 'text-slate-500'
                  }`}>
                    {icon.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className={`p-3 border-t text-[10px] flex items-center justify-between ${
        isLight ? 'bg-slate-100 border-slate-200 text-slate-800 font-medium' : 'bg-black/40 border-white/10 text-slate-500'
      }`}>
        <span>Click or Drag to canvas</span>
        <span className="text-blue-600 font-bold">{filteredIcons.length} Services</span>
      </div>
    </aside>
  );
};
