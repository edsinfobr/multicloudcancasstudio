import React, { useState, useEffect } from 'react';
import {
  FileSignature,
  FolderKanban,
  User,
  Briefcase,
  Calendar,
  Eye,
  EyeOff,
  X,
  Check,
  History,
  RotateCcw,
  Clock,
  Plus,
  Trash2,
  Search,
  Bookmark,
  Sparkles,
  AlertCircle,
  Tag
} from 'lucide-react';
import { DiagramState } from '../types';
import {
  getVersionSnapshots,
  saveVersionSnapshot,
  deleteVersionSnapshot,
  clearVersionSnapshots,
  VersionSnapshot
} from '../utils/storageUtils';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagram: DiagramState;
  setDiagram: React.Dispatch<React.SetStateAction<DiagramState>>;
  onRecordHistory: () => void;
  theme?: 'dark' | 'light';
  showToast?: (message: string) => void;
}

export const MetadataModal: React.FC<MetadataModalProps> = ({
  isOpen,
  onClose,
  diagram,
  setDiagram,
  onRecordHistory,
  theme = 'dark',
  showToast
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'metadata' | 'history'>('metadata');
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkpointNote, setCheckpointNote] = useState('');
  const [isCreatingCheckpoint, setIsCreatingCheckpoint] = useState(false);
  const [restoredId, setRestoredId] = useState<string | null>(null);

  const isLight = theme === 'light';

  // Load snapshots when modal opens or tab changes
  useEffect(() => {
    if (isOpen) {
      const list = getVersionSnapshots(diagram.id);
      setSnapshots(list);
    }
  }, [isOpen, diagram.id, activeTab]);

  // Metadata state
  const metadata = diagram.metadata || {
    project: diagram.title || 'Projeto Cloud Architecture',
    author: '',
    role: '',
    date: new Date().toLocaleDateString('pt-BR'),
    tags: [],
    showOnCanvas: false,
    x: 30,
    y: 30
  };

  const [project, setProject] = useState(metadata.project || diagram.title || '');
  const [author, setAuthor] = useState(metadata.author || '');
  const [role, setRole] = useState(metadata.role || '');
  const [date, setDate] = useState(metadata.date || new Date().toLocaleDateString('pt-BR'));
  const [tags, setTags] = useState<string[]>(metadata.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showOnCanvas, setShowOnCanvas] = useState(metadata.showOnCanvas === true);

  const PRESET_TAGS = ['Production', 'Staging', 'Development', 'Security', 'Compliance', 'Disaster Recovery', 'IaC'];

  const handleAddTag = (tagToAdd?: string) => {
    const value = (tagToAdd || tagInput).trim();
    if (value && !tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setTags([...tags, value]);
      if (!tagToAdd) setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSaveMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordHistory();

    const updatedDiagram: DiagramState = {
      ...diagram,
      title: project.trim() || diagram.title,
      metadata: {
        ...diagram.metadata,
        project: project.trim(),
        author: author.trim(),
        role: role.trim(),
        date: date.trim(),
        tags,
        showOnCanvas,
        x: diagram.metadata?.x ?? 30,
        y: diagram.metadata?.y ?? 30
      }
    };

    setDiagram(updatedDiagram);

    // Also record a snapshot when metadata is saved manually
    saveVersionSnapshot(updatedDiagram, 'manual', 'Atualização dos dados e tags');
    if (showToast) {
      showToast('Dados e tags da arquitetura atualizados!');
    }
    onClose();
  };

  const handleCreateCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedList = saveVersionSnapshot(
      diagram,
      'checkpoint',
      checkpointNote.trim() || 'Ponto de restauração manual'
    );
    setSnapshots(updatedList);
    setCheckpointNote('');
    setIsCreatingCheckpoint(false);
    if (showToast) {
      showToast('Novo ponto de restauração criado com sucesso!');
    }
  };

  const handleRestoreSnapshot = (snapshot: VersionSnapshot) => {
    onRecordHistory();
    setDiagram(snapshot.diagram);
    setRestoredId(snapshot.id);

    if (showToast) {
      showToast(`Versão "${snapshot.title}" (${new Date(snapshot.updatedAt).toLocaleTimeString('pt-BR')}) restaurada!`);
    }

    setTimeout(() => setRestoredId(null), 3000);
  };

  const handleDeleteSnapshot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteVersionSnapshot(id);
    setSnapshots(updated);
  };

  const handleClearAllSnapshots = () => {
    if (window.confirm('Tem certeza que deseja apagar todo o histórico de versões salvas?')) {
      const updated = clearVersionSnapshots(diagram.id);
      setSnapshots(updated);
      if (showToast) {
        showToast('Histórico de versões limpo!');
      }
    }
  };

  const filteredSnapshots = snapshots.filter((snap) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const formattedDate = new Date(snap.updatedAt).toLocaleString('pt-BR').toLowerCase();
    const noteText = snap.note?.toLowerCase() || '';
    const snapTags = (snap.diagram.metadata?.tags || []).join(' ').toLowerCase();
    return snap.title.toLowerCase().includes(term) || formattedDate.includes(term) || noteText.includes(term) || snapTags.includes(term);
  });

  const getTriggerBadge = (type: VersionSnapshot['triggerType']) => {
    switch (type) {
      case 'checkpoint':
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center space-x-1 ${
            isLight
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
          }`}>
            <Bookmark className="w-2.5 h-2.5" />
            <span>Ponto de Restauração</span>
          </span>
        );
      case 'manual':
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center space-x-1 ${
            isLight
              ? 'bg-purple-100 border-purple-300 text-purple-900'
              : 'bg-purple-500/20 border-purple-500/40 text-purple-300'
          }`}>
            <Sparkles className="w-2.5 h-2.5" />
            <span>Salvo Manual</span>
          </span>
        );
      case 'autosave':
      default:
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center space-x-1 ${
            isLight
              ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}>
            <Clock className="w-2.5 h-2.5" />
            <span>Auto-Salvo</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#12141A] border-white/15 text-slate-200'
      }`}>
        {/* Modal Header & Tabs */}
        <div className={`px-5 pt-4 pb-0 border-b flex flex-col ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                {activeTab === 'metadata' ? (
                  <FileSignature className="w-5 h-5 text-blue-500" />
                ) : (
                  <History className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div>
                <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {activeTab === 'metadata' ? 'Dados do Diagrama & Carimbo' : 'Histórico de Versões & Restauração'}
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {activeTab === 'metadata'
                    ? 'Identificação do projeto, autor, posição e carimbo impresso no canvas'
                    : 'Acompanhe auto-salvamentos, crie pontos de restauração e recupere estados anteriores'}
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

          {/* Navigation Tabs */}
          <div className="flex space-x-2">
            <button
              id="tab-btn-metadata"
              onClick={() => setActiveTab('metadata')}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'metadata'
                  ? 'border-blue-500 text-blue-500'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span>Dados do Carimbo</span>
            </button>

            <button
              id="tab-btn-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-500'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Histórico de Versões</span>
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                activeTab === 'history'
                  ? 'bg-blue-500/20 text-blue-500'
                  : isLight
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-white/10 text-slate-300'
              }`}>
                {snapshots.length}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        {activeTab === 'metadata' ? (
          /* TAB 1: METADATA FORM */
          <form onSubmit={handleSaveMetadata} className="p-5 space-y-4">
            {/* Projeto */}
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center space-x-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <FolderKanban className="w-3.5 h-3.5 text-blue-500" />
                <span>Projeto</span>
              </label>
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Ex: Infraestrutura E-commerce AWS"
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                    : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Autor */}
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center space-x-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <User className="w-3.5 h-3.5 text-emerald-500" />
                <span>Autor</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: João Silva"
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                    : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Cargo */}
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center space-x-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                <span>Cargo / Posição</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Arquiteto de Soluções Cloud"
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                    : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Data */}
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center space-x-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                <span>Data</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 30/07/2026"
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                    : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Tags / Categorias */}
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center justify-between ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <div className="flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-pink-500" />
                  <span>Tags & Categorias da Arquitetura</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">Ex: Production, Security, Staging</span>
              </label>

              {/* Active Tags Pills */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        isLight
                          ? 'bg-blue-50 border-blue-200 text-blue-900'
                          : 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                      }`}
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 p-0.5 rounded transition-colors"
                        title={`Remover tag ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Tag Input Field */}
              <div className="flex items-center space-x-2 mb-2">
                <input
                  id="input-architecture-tag"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Digite uma tag e pressione Enter (ex: Production)..."
                  className={`flex-1 border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                      : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  id="btn-add-architecture-tag"
                  onClick={() => handleAddTag()}
                  disabled={!tagInput.trim()}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1 ${
                    tagInput.trim()
                      ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-sm'
                      : 'opacity-50 cursor-not-allowed bg-slate-700/30 border-white/5 text-slate-400'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>

              {/* Preset Tag Suggestions */}
              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                <span className={`text-[10px] font-medium mr-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Sugeridos:</span>
                {PRESET_TAGS.map((preset) => {
                  const isSelected = tags.some((t) => t.toLowerCase() === preset.toLowerCase());
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => (isSelected ? handleRemoveTag(preset) : handleAddTag(preset))}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition-all ${
                        isSelected
                          ? isLight
                            ? 'bg-blue-600 border-blue-600 text-white font-bold'
                            : 'bg-blue-500 border-blue-400 text-white font-bold'
                          : isLight
                          ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                      }`}
                    >
                      {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Show on Canvas Toggle */}
            <div className={`pt-3 border-t flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="flex items-center space-x-2">
                {showOnCanvas ? (
                  <Eye className="w-4 h-4 text-blue-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                )}
                <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Exibir Carimbo no Canvas
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowOnCanvas(!showOnCanvas)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showOnCanvas ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showOnCanvas ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center space-x-1.5 transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Dados</span>
              </button>
            </div>
          </form>
        ) : (
          /* TAB 2: VERSION HISTORY */
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar flex flex-col">
            {/* Toolbar: Search & Create Checkpoint */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrar por data, título ou nota..."
                  className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                      : 'bg-black/40 border-white/10 text-slate-100 focus:border-blue-500'
                  }`}
                />
              </div>

              <button
                id="btn-create-checkpoint"
                type="button"
                onClick={() => setIsCreatingCheckpoint(!isCreatingCheckpoint)}
                className="px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 transition-all whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ponto de Restauração</span>
              </button>
            </div>

            {/* Create Checkpoint Form */}
            {isCreatingCheckpoint && (
              <form onSubmit={handleCreateCheckpoint} className={`p-3.5 rounded-xl border space-y-2.5 animate-in slide-in-from-top-2 duration-150 ${
                isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-amber-950/20 border-amber-500/30'
              }`}>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-500">
                  <Bookmark className="w-4 h-4" />
                  <span>Criar Novo Ponto de Restauração (Snapshot)</span>
                </div>
                <input
                  type="text"
                  value={checkpointNote}
                  onChange={(e) => setCheckpointNote(e.target.value)}
                  placeholder="Nome ou nota para este ponto (ex: Antes de refatorar banco)..."
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${
                    isLight
                      ? 'bg-white border-amber-300 text-slate-900 focus:border-amber-500'
                      : 'bg-black/60 border-amber-500/40 text-slate-100 focus:border-amber-400'
                  }`}
                  autoFocus
                />
                <div className="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCheckpoint(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs ${isLight ? 'text-slate-600 hover:bg-amber-100' : 'text-slate-300 hover:bg-white/10'}`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-sm"
                  >
                    Salvar Snapshot
                  </button>
                </div>
              </form>
            )}

            {/* Snapshots List */}
            {filteredSnapshots.length === 0 ? (
              <div className={`p-8 rounded-2xl border text-center space-y-3 my-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/10'
              }`}>
                <div className="w-10 h-10 mx-auto rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    {searchTerm ? 'Nenhum snapshot encontrado' : 'Nenhum histórico registrado'}
                  </h4>
                  <p className={`text-xs mt-1 max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    O sistema salva snapshots automaticamente a cada 30 segundos. Você também pode criar pontos de restauração manuais a qualquer momento.
                  </p>
                </div>
                {!searchTerm && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingCheckpoint(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Criar Primeiro Snapshot</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
                  <span>Exibindo {filteredSnapshots.length} snapshot(s)</span>
                  <button
                    type="button"
                    onClick={handleClearAllSnapshots}
                    className="hover:text-red-400 transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpar histórico</span>
                  </button>
                </div>

                {filteredSnapshots.map((snap) => {
                  const isJustRestored = restoredId === snap.id;
                  const formattedDate = new Date(snap.updatedAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });

                  const providers = Array.from(new Set(snap.diagram.nodes.map((n) => n.provider.toUpperCase()))).join(', ') || 'Nenhum';

                  return (
                    <div
                      key={snap.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isJustRestored
                          ? isLight
                            ? 'bg-emerald-50 border-emerald-400 shadow-sm ring-1 ring-emerald-400'
                            : 'bg-emerald-950/30 border-emerald-500/50 shadow-md ring-1 ring-emerald-500'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                          : 'bg-black/30 border-white/10 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      {/* Left Details */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          {getTriggerBadge(snap.triggerType)}
                          <span className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {snap.title || 'Arquitetura Sem Título'}
                          </span>
                        </div>

                        {snap.note && (
                          <p className={`text-xs italic ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                            "{snap.note}"
                          </p>
                        )}

                        <div className={`flex items-center space-x-3 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{formattedDate}</span>
                          </span>
                          <span>•</span>
                          <span>{snap.nodeCount} nós ({providers})</span>
                          <span>•</span>
                          <span>{snap.linkCount} conexões</span>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleRestoreSnapshot(snap)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-all ${
                            isJustRestored
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                              : isLight
                              ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-900'
                              : 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/40 text-blue-300'
                          }`}
                          title="Restaurar este diagrama exatamente como estava neste momento"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${isJustRestored ? 'animate-spin' : ''}`} />
                          <span>{isJustRestored ? 'Restaurado!' : 'Restaurar'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteSnapshot(snap.id, e)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isLight
                              ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 border-slate-200'
                              : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-white/10'
                          }`}
                          title="Excluir este snapshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

