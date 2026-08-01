import { DiagramState } from '../types';

const STORAGE_KEY = 'cloudcraft_saved_architectures_v1';
const AUTOSAVE_DRAFT_KEY = 'cloudcraft_autosave_draft_v1';
const VERSION_SNAPSHOTS_KEY = 'cloudcraft_version_snapshots_v1';

export interface SavedArchitectureItem {
  id: string;
  title: string;
  description?: string;
  updatedAt: string;
  nodeCount: number;
  diagram: DiagramState;
}

export interface VersionSnapshot {
  id: string;
  diagramId: string;
  title: string;
  updatedAt: string;
  nodeCount: number;
  linkCount: number;
  triggerType: 'autosave' | 'manual' | 'checkpoint';
  note?: string;
  diagram: DiagramState;
}

export const getAutosaveDraft = (): DiagramState | null => {
  try {
    const raw = localStorage.getItem(AUTOSAVE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.nodes)) {
      return parsed as DiagramState;
    }
    return null;
  } catch (err) {
    console.error('Failed to load autosave draft:', err);
    return null;
  }
};

export const getVersionSnapshots = (diagramId?: string): VersionSnapshot[] => {
  try {
    const raw = localStorage.getItem(VERSION_SNAPSHOTS_KEY);
    if (!raw) return [];
    const list: VersionSnapshot[] = JSON.parse(raw);
    if (diagramId) {
      return list.filter((item) => !item.diagramId || item.diagramId === diagramId);
    }
    return list;
  } catch (err) {
    console.error('Failed to load version snapshots:', err);
    return [];
  }
};

export const saveVersionSnapshot = (
  diagram: DiagramState,
  triggerType: 'autosave' | 'manual' | 'checkpoint' = 'autosave',
  note?: string
): VersionSnapshot[] => {
  try {
    const snapshots = getVersionSnapshots();
    const diagramId = diagram.id || 'default_diagram';
    const nowISO = new Date().toISOString();

    // Check if latest snapshot is virtually identical to avoid duplicate flooding
    if (snapshots.length > 0) {
      const latest = snapshots[0];
      const sameNodes = latest.nodeCount === diagram.nodes.length;
      const sameLinks = latest.linkCount === diagram.links.length;
      const sameTitle = latest.title === diagram.title;
      const timeDiffMs = new Date(nowISO).getTime() - new Date(latest.updatedAt).getTime();

      if (sameNodes && sameLinks && sameTitle && timeDiffMs < 10000 && triggerType === 'autosave') {
        return snapshots;
      }
    }

    const newSnapshot: VersionSnapshot = {
      id: `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      diagramId,
      title: diagram.title || 'Arquitetura Sem Título',
      updatedAt: nowISO,
      nodeCount: diagram.nodes.length,
      linkCount: diagram.links.length,
      triggerType,
      note,
      diagram: JSON.parse(JSON.stringify(diagram))
    };

    // Keep up to 40 most recent snapshots
    const updatedSnapshots = [newSnapshot, ...snapshots].slice(0, 40);
    localStorage.setItem(VERSION_SNAPSHOTS_KEY, JSON.stringify(updatedSnapshots));
    return updatedSnapshots;
  } catch (err) {
    console.error('Failed to save version snapshot:', err);
    return getVersionSnapshots();
  }
};

export const deleteVersionSnapshot = (snapshotId: string): VersionSnapshot[] => {
  try {
    const snapshots = getVersionSnapshots();
    const updated = snapshots.filter((item) => item.id !== snapshotId);
    localStorage.setItem(VERSION_SNAPSHOTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete version snapshot:', err);
    return getVersionSnapshots();
  }
};

export const clearVersionSnapshots = (diagramId?: string): VersionSnapshot[] => {
  try {
    if (!diagramId) {
      localStorage.removeItem(VERSION_SNAPSHOTS_KEY);
      return [];
    } else {
      const snapshots = getVersionSnapshots();
      const updated = snapshots.filter((item) => item.diagramId && item.diagramId !== diagramId);
      localStorage.setItem(VERSION_SNAPSHOTS_KEY, JSON.stringify(updated));
      return updated;
    }
  } catch (err) {
    console.error('Failed to clear version snapshots:', err);
    return getVersionSnapshots();
  }
};

export const saveAutosaveDraft = (diagram: DiagramState): void => {
  try {
    const timestampedDiagram: DiagramState = {
      ...diagram,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(AUTOSAVE_DRAFT_KEY, JSON.stringify(timestampedDiagram));
    saveArchitectureToStorage(timestampedDiagram);
    saveVersionSnapshot(timestampedDiagram, 'autosave');
  } catch (err) {
    console.error('Failed to autosave draft:', err);
  }
};

export const getSavedArchitectures = (): SavedArchitectureItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved architectures:', err);
    return [];
  }
};

export const saveArchitectureToStorage = (diagram: DiagramState): SavedArchitectureItem[] => {
  try {
    const list = getSavedArchitectures();
    const existingIndex = list.findIndex((item) => item.id === diagram.id);
    
    const newItem: SavedArchitectureItem = {
      id: diagram.id || `diag_${Date.now()}`,
      title: diagram.title || 'Arquitetura Sem Título',
      description: diagram.description,
      updatedAt: new Date().toISOString(),
      nodeCount: diagram.nodes.length,
      diagram: {
        ...diagram,
        id: diagram.id || `diag_${Date.now()}`,
        updatedAt: new Date().toISOString()
      }
    };

    let updatedList: SavedArchitectureItem[];
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = newItem;
    } else {
      updatedList = [newItem, ...list];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (err) {
    console.error('Failed to save architecture:', err);
    return getSavedArchitectures();
  }
};

export const deleteSavedArchitecture = (id: string): SavedArchitectureItem[] => {
  try {
    const list = getSavedArchitectures();
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete architecture:', err);
    return getSavedArchitectures();
  }
};

