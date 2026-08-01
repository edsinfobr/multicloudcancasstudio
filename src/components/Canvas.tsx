import React, { useState, useRef, useEffect } from 'react';
import { DiagramState, DiagramNode, DiagramContainer, DiagramLink } from '../types';
import { getIconByKey } from '../data/cloudIcons';
import { inferProtocolForLink } from '../utils/protocolInfer';
import { Trash2, Copy, Move, ZoomIn, ZoomOut, Maximize2, CheckSquare, Link as LinkIcon, Zap, X, ArrowRight, FolderPlus, FolderMinus, Boxes, Layers, FileSignature, Sparkles, Grid, Rows, Columns } from 'lucide-react';

interface CanvasProps {
  diagram: DiagramState;
  setDiagram: React.Dispatch<React.SetStateAction<DiagramState>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  selectedContainerId: string | null;
  setSelectedContainerId: (id: string | null) => void;
  selectedLinkId: string | null;
  setSelectedLinkId: (id: string | null) => void;
  isConnectingMode: boolean;
  setIsConnectingMode: (active: boolean) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onRecordHistory: () => void;
  onOpenMetadataModal?: () => void;
  theme?: 'dark' | 'light';
}

export const Canvas: React.FC<CanvasProps> = ({
  diagram,
  setDiagram,
  selectedNodeId,
  setSelectedNodeId,
  selectedContainerId,
  setSelectedContainerId,
  selectedLinkId,
  setSelectedLinkId,
  isConnectingMode,
  setIsConnectingMode,
  zoom,
  setZoom,
  canvasRef,
  onRecordHistory,
  onOpenMetadataModal,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [mouseCanvasPos, setMouseCanvasPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  type ResizeHandle = 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w';

  // Multi-selection state
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedContainerIds, setSelectedContainerIds] = useState<string[]>([]);

  // Node alignment helpers
  const handleAlignHorizontal = () => {
    if (selectedNodeIds.length < 2) return;
    onRecordHistory();
    const selectedNodes = diagram.nodes.filter((n) => selectedNodeIds.includes(n.id));
    if (selectedNodes.length === 0) return;

    // Calculate average Y position
    const avgY = selectedNodes.reduce((sum, n) => sum + n.y, 0) / selectedNodes.length;
    const targetY = snapToGrid ? Math.round(avgY / 20) * 20 : Math.round(avgY);

    setDiagram((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (selectedNodeIds.includes(n.id) ? { ...n, y: targetY } : n))
    }));
  };

  const handleAlignVertical = () => {
    if (selectedNodeIds.length < 2) return;
    onRecordHistory();
    const selectedNodes = diagram.nodes.filter((n) => selectedNodeIds.includes(n.id));
    if (selectedNodes.length === 0) return;

    // Calculate average X position
    const avgX = selectedNodes.reduce((sum, n) => sum + n.x, 0) / selectedNodes.length;
    const targetX = snapToGrid ? Math.round(avgX / 20) * 20 : Math.round(avgX);

    setDiagram((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (selectedNodeIds.includes(n.id) ? { ...n, x: targetX } : n))
    }));
  };

  const handleDistributeHorizontally = () => {
    if (selectedNodeIds.length < 3) return;
    onRecordHistory();
    const selectedNodes = [...diagram.nodes.filter((n) => selectedNodeIds.includes(n.id))].sort((a, b) => a.x - b.x);
    const minX = selectedNodes[0].x;
    const maxX = selectedNodes[selectedNodes.length - 1].x;
    const step = (maxX - minX) / (selectedNodes.length - 1);

    const newPositions = new Map<string, number>();
    selectedNodes.forEach((n, idx) => {
      let posX = minX + step * idx;
      if (snapToGrid) posX = Math.round(posX / 20) * 20;
      newPositions.set(n.id, Math.round(posX));
    });

    setDiagram((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (newPositions.has(n.id) ? { ...n, x: newPositions.get(n.id)! } : n))
    }));
  };

  const handleDistributeVertically = () => {
    if (selectedNodeIds.length < 3) return;
    onRecordHistory();
    const selectedNodes = [...diagram.nodes.filter((n) => selectedNodeIds.includes(n.id))].sort((a, b) => a.y - b.y);
    const minY = selectedNodes[0].y;
    const maxY = selectedNodes[selectedNodes.length - 1].y;
    const step = (maxY - minY) / (selectedNodes.length - 1);

    const newPositions = new Map<string, number>();
    selectedNodes.forEach((n, idx) => {
      let posY = minY + step * idx;
      if (snapToGrid) posY = Math.round(posY / 20) * 20;
      newPositions.set(n.id, Math.round(posY));
    });

    setDiagram((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (newPositions.has(n.id) ? { ...n, y: newPositions.get(n.id)! } : n))
    }));
  };

  // Stamp Drag State
  const [stampDragState, setStampDragState] = useState<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  // Sync external single-selection state with multi-selection set
  useEffect(() => {
    if (selectedNodeId && !selectedNodeIds.includes(selectedNodeId)) {
      setSelectedNodeIds([selectedNodeId]);
    } else if (!selectedNodeId && selectedNodeIds.length === 1) {
      setSelectedNodeIds([]);
    }
  }, [selectedNodeId]);

  useEffect(() => {
    if (selectedContainerId && !selectedContainerIds.includes(selectedContainerId)) {
      setSelectedContainerIds([selectedContainerId]);
    } else if (!selectedContainerId && selectedContainerIds.length === 1) {
      setSelectedContainerIds([]);
    }
  }, [selectedContainerId]);

  const updateSelection = (nodeIds: string[], containerIds: string[], linkId: string | null = null) => {
    setSelectedNodeIds(nodeIds);
    setSelectedContainerIds(containerIds);
    setSelectedNodeId(nodeIds[0] || null);
    setSelectedContainerId(containerIds[0] || null);
    setSelectedLinkId(linkId);
  };

  // Listen for Escape key to cancel connecting mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConnectingSourceId(null);
        setIsConnectingMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsConnectingMode]);

  // Marquee Rubberband Selection State
  const [marqueeState, setMarqueeState] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Multi-drag State
  const [multiDragState, setMultiDragState] = useState<{
    startX: number;
    startY: number;
    initialNodePositions: Map<string, { x: number; y: number }>;
    initialContainerPositions: Map<string, { x: number; y: number }>;
  } | null>(null);

  // Resize Container State
  const [resizeState, setResizeState] = useState<{
    containerId: string;
    handle: ResizeHandle;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialWidth: number;
    initialHeight: number;
  } | null>(null);

  const [dragOverPos, setDragOverPos] = useState<{ x: number; y: number } | null>(null);

  // Canvas Hand Panning State
  const [panState, setPanState] = useState<{
    startX: number;
    startY: number;
    startScrollLeft: number;
    startScrollTop: number;
    isPanning: boolean;
  } | null>(null);

  // Start Connection from Node
  const handleStartConnection = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setConnectingSourceId(nodeId);
    setIsConnectingMode(true);
    updateSelection([nodeId], []);
  };

  // Drag Over & Drop from Sidebar
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scrollLeft = canvasRef.current.scrollLeft;
      const scrollTop = canvasRef.current.scrollTop;
      const x = Math.round((e.clientX - rect.left + scrollLeft) / zoom - 48);
      const y = Math.round((e.clientY - rect.top + scrollTop) / zoom - 48);
      setDragOverPos({ x, y });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget && e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setDragOverPos(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (connectingSourceId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scrollLeft = canvasRef.current.scrollLeft;
      const scrollTop = canvasRef.current.scrollTop;
      const x = (e.clientX - rect.left + scrollLeft) / zoom;
      const y = (e.clientY - rect.top + scrollTop) / zoom;
      setMouseCanvasPos({ x, y });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverPos(null);
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scrollLeft = canvasRef.current.scrollLeft;
    const scrollTop = canvasRef.current.scrollTop;
    let x = Math.round((e.clientX - rect.left + scrollLeft) / zoom - 40);
    let y = Math.round((e.clientY - rect.top + scrollTop) / zoom - 40);

    if (snapToGrid) {
      x = Math.round(x / 20) * 20;
      y = Math.round(y / 20) * 20;
    }

    const iconDataStr = e.dataTransfer.getData('application/json');
    if (!iconDataStr) return;

    try {
      const icon = JSON.parse(iconDataStr);
      onRecordHistory();

      const newNode: DiagramNode = {
        id: `node_${Date.now()}`,
        name: icon.name,
        provider: icon.provider,
        category: icon.category,
        iconKey: icon.key,
        resourceType: icon.defaultResourceType,
        x,
        y,
        specs: { ...icon.defaultSpecs }
      };

      setDiagram((prev) => ({
        ...prev,
        nodes: [...prev.nodes, newNode]
      }));
      updateSelection([newNode.id], []);
    } catch (err) {
      console.error('Failed to drop node:', err);
    }
  };

  // Canvas Mouse Down for Hand Panning & Marquee Selection
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary left click

    const target = e.target as HTMLElement;
    const isBackgroundClick =
      target === canvasRef.current ||
      target.id === 'architecture-canvas-container' ||
      target.classList.contains('canvas-background') ||
      target.tagName === 'svg' ||
      target.tagName === 'path';

    if (isBackgroundClick) {
      if (!canvasRef.current) return;

      if (e.shiftKey || e.ctrlKey || e.metaKey) {
        // Shift / Ctrl + Drag: Marquee Selection Box
        const rect = canvasRef.current.getBoundingClientRect();
        const scrollLeft = canvasRef.current.scrollLeft;
        const scrollTop = canvasRef.current.scrollTop;

        const startX = (e.clientX - rect.left + scrollLeft) / zoom;
        const startY = (e.clientY - rect.top + scrollTop) / zoom;

        setMarqueeState({
          startX,
          startY,
          currentX: startX,
          currentY: startY
        });

        updateSelection([], [], null);
      } else {
        // Direct Drag: Hand Panning Canvas ("deslizar a prancheta de desenho com uma mão")
        setPanState({
          startX: e.clientX,
          startY: e.clientY,
          startScrollLeft: canvasRef.current.scrollLeft,
          startScrollTop: canvasRef.current.scrollTop,
          isPanning: false
        });
      }
    }
  };

  // Node Dragging Handlers
  const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();

    if (isConnectingMode) {
      if (!connectingSourceId) {
        setConnectingSourceId(nodeId);
      } else if (connectingSourceId !== nodeId) {
        onRecordHistory();
        const fromNode = diagram.nodes.find((n) => n.id === connectingSourceId);
        const toNode = diagram.nodes.find((n) => n.id === nodeId);
        const inferred = inferProtocolForLink(fromNode, toNode);

        const newLink: DiagramLink = {
          id: `link_${Date.now()}`,
          from: connectingSourceId,
          to: nodeId,
          label: inferred.label,
          style: inferred.style,
          color: inferred.color,
          protocol: inferred.protocol,
          arrowHead: 'end',
          strokeWidth: 2
        };
        setDiagram((prev) => ({
          ...prev,
          links: [...prev.links, newLink]
        }));
        setSelectedLinkId(newLink.id);
        setConnectingSourceId(null);
        setIsConnectingMode(false);
      }
      return;
    }

    let activeNodeIds = [...selectedNodeIds];
    let activeContainerIds = [...selectedContainerIds];

    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      if (activeNodeIds.includes(nodeId)) {
        activeNodeIds = activeNodeIds.filter((id) => id !== nodeId);
      } else {
        activeNodeIds.push(nodeId);
      }
    } else {
      if (!activeNodeIds.includes(nodeId)) {
        activeNodeIds = [nodeId];
        activeContainerIds = [];
      }
    }

    updateSelection(activeNodeIds, activeContainerIds, null);

    const nodePositions = new Map<string, { x: number; y: number }>();
    activeNodeIds.forEach((id) => {
      const node = diagram.nodes.find((n) => n.id === id);
      if (node) nodePositions.set(id, { x: node.x, y: node.y });
    });

    const containerPositions = new Map<string, { x: number; y: number }>();
    activeContainerIds.forEach((id) => {
      const c = diagram.containers.find((c) => c.id === id);
      if (c) containerPositions.set(id, { x: c.x, y: c.y });
    });

    setMultiDragState({
      startX: e.clientX,
      startY: e.clientY,
      initialNodePositions: nodePositions,
      initialContainerPositions: containerPositions
    });
  };

  // Container Dragging Handlers
  const handleMouseDownContainer = (e: React.MouseEvent, containerId: string) => {
    e.stopPropagation();

    let activeNodeIds = [...selectedNodeIds];
    let activeContainerIds = [...selectedContainerIds];

    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      if (activeContainerIds.includes(containerId)) {
        activeContainerIds = activeContainerIds.filter((id) => id !== containerId);
      } else {
        activeContainerIds.push(containerId);
      }
    } else {
      if (!activeContainerIds.includes(containerId)) {
        activeNodeIds = [];
        activeContainerIds = [containerId];
      }
    }

    updateSelection(activeNodeIds, activeContainerIds, null);

    const nodePositions = new Map<string, { x: number; y: number }>();
    activeNodeIds.forEach((id) => {
      const node = diagram.nodes.find((n) => n.id === id);
      if (node) nodePositions.set(id, { x: node.x, y: node.y });
    });

    // Automatically include nodes inside active containers so dragging a container moves its contents
    const activeContainers = diagram.containers.filter((c) => activeContainerIds.includes(c.id));
    diagram.nodes.forEach((node) => {
      const isInside = activeContainers.some(
        (c) =>
          node.x >= c.x - 10 &&
          node.x + 96 <= c.x + c.width + 10 &&
          node.y >= c.y - 10 &&
          node.y + 80 <= c.y + c.height + 10
      );
      if (isInside) {
        nodePositions.set(node.id, { x: node.x, y: node.y });
      }
    });

    const containerPositions = new Map<string, { x: number; y: number }>();
    activeContainerIds.forEach((id) => {
      const c = diagram.containers.find((c) => c.id === id);
      if (c) containerPositions.set(id, { x: c.x, y: c.y });
    });

    // Include nested child containers
    diagram.containers.forEach((childC) => {
      if (!activeContainerIds.includes(childC.id)) {
        const isChildInside = activeContainers.some(
          (parent) =>
            childC.x >= parent.x - 5 &&
            childC.x + childC.width <= parent.x + parent.width + 5 &&
            childC.y >= parent.y - 5 &&
            childC.y + childC.height <= parent.y + parent.height + 5
        );
        if (isChildInside) {
          containerPositions.set(childC.id, { x: childC.x, y: childC.y });
        }
      }
    });

    setMultiDragState({
      startX: e.clientX,
      startY: e.clientY,
      initialNodePositions: nodePositions,
      initialContainerPositions: containerPositions
    });
  };

  // Container Resizing Handler
  const handleMouseDownResize = (e: React.MouseEvent, containerId: string, handle: ResizeHandle) => {
    e.stopPropagation();
    e.preventDefault();

    updateSelection([], [containerId], null);

    const container = diagram.containers.find((c) => c.id === containerId);
    if (!container) return;

    setResizeState({
      containerId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialX: container.x,
      initialY: container.y,
      initialWidth: container.width,
      initialHeight: container.height
    });
  };

  // Stamp Drag Handler
  const handleMouseDownStamp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentX = diagram.metadata?.x ?? 30;
    const currentY = diagram.metadata?.y ?? 30;
    setStampDragState({
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentX,
      initialY: currentY
    });
  };

  // Global Pointer Move & Up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (marqueeState && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const scrollLeft = canvasRef.current.scrollLeft;
        const scrollTop = canvasRef.current.scrollTop;

        const currentX = (e.clientX - rect.left + scrollLeft) / zoom;
        const currentY = (e.clientY - rect.top + scrollTop) / zoom;

        setMarqueeState((prev) => (prev ? { ...prev, currentX, currentY } : null));

        const minX = Math.min(marqueeState.startX, currentX);
        const maxX = Math.max(marqueeState.startX, currentX);
        const minY = Math.min(marqueeState.startY, currentY);
        const maxY = Math.max(marqueeState.startY, currentY);

        const matchedNodeIds = diagram.nodes
          .filter((node) => node.x + 96 >= minX && node.x <= maxX && node.y + 80 >= minY && node.y <= maxY)
          .map((node) => node.id);

        const matchedContainerIds = diagram.containers
          .filter((c) => c.x + c.width >= minX && c.x <= maxX && c.y + c.height >= minY && c.y <= maxY)
          .map((c) => c.id);

        updateSelection(matchedNodeIds, matchedContainerIds);
      } else if (multiDragState) {
        const deltaX = (e.clientX - multiDragState.startX) / zoom;
        const deltaY = (e.clientY - multiDragState.startY) / zoom;

        const gridSize = snapToGrid ? 20 : 1;
        const snappedDeltaX = Math.round(deltaX / gridSize) * gridSize;
        const snappedDeltaY = Math.round(deltaY / gridSize) * gridSize;

        setDiagram((prev) => ({
          ...prev,
          nodes: prev.nodes.map((n) => {
            const init = multiDragState.initialNodePositions.get(n.id);
            return init ? { ...n, x: init.x + snappedDeltaX, y: init.y + snappedDeltaY } : n;
          }),
          containers: prev.containers.map((c) => {
            const init = multiDragState.initialContainerPositions.get(c.id);
            return init ? { ...c, x: init.x + snappedDeltaX, y: init.y + snappedDeltaY } : c;
          })
        }));
      } else if (resizeState) {
        const deltaX = (e.clientX - resizeState.startX) / zoom;
        const deltaY = (e.clientY - resizeState.startY) / zoom;

        const { handle, initialX, initialY, initialWidth, initialHeight, containerId } = resizeState;

        let newX = initialX;
        let newY = initialY;
        let newWidth = initialWidth;
        let newHeight = initialHeight;

        if (handle.includes('e')) newWidth = Math.max(120, Math.round((initialWidth + deltaX) / 10) * 10);
        if (handle.includes('s')) newHeight = Math.max(80, Math.round((initialHeight + deltaY) / 10) * 10);
        if (handle.includes('w')) {
          const calcWidth = Math.max(120, Math.round((initialWidth - deltaX) / 10) * 10);
          newX = initialX + (initialWidth - calcWidth);
          newWidth = calcWidth;
        }
        if (handle.includes('n')) {
          const calcHeight = Math.max(80, Math.round((initialHeight - deltaY) / 10) * 10);
          newY = initialY + (initialHeight - calcHeight);
          newHeight = calcHeight;
        }

        setDiagram((prev) => ({
          ...prev,
          containers: prev.containers.map((c) =>
            c.id === containerId ? { ...c, x: newX, y: newY, width: newWidth, height: newHeight } : c
          )
        }));
      } else if (stampDragState) {
        const deltaX = (e.clientX - stampDragState.startX) / zoom;
        const deltaY = (e.clientY - stampDragState.startY) / zoom;

        const newX = Math.max(0, Math.round(stampDragState.initialX + deltaX));
        const newY = Math.max(0, Math.round(stampDragState.initialY + deltaY));

        setDiagram((prev) => ({
          ...prev,
          metadata: {
            ...prev.metadata,
            x: newX,
            y: newY
          }
        }));
      } else if (panState && canvasRef.current) {
        const deltaX = e.clientX - panState.startX;
        const deltaY = e.clientY - panState.startY;

        if (!panState.isPanning && (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2)) {
          setPanState((prev) => (prev ? { ...prev, isPanning: true } : null));
        }

        canvasRef.current.scrollLeft = panState.startScrollLeft - deltaX;
        canvasRef.current.scrollTop = panState.startScrollTop - deltaY;
      }
    };

    const handleMouseUp = () => {
      if (multiDragState || resizeState || stampDragState) {
        onRecordHistory();
      }
      if (panState && !panState.isPanning) {
        // Simple click on background deselects items
        updateSelection([], [], null);
      }
      setMultiDragState(null);
      setResizeState(null);
      setMarqueeState(null);
      setStampDragState(null);
      setPanState(null);
    };

    if (marqueeState || multiDragState || resizeState || stampDragState || panState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [marqueeState, multiDragState, resizeState, stampDragState, panState, zoom, diagram, setDiagram, onRecordHistory, updateSelection]);

  // Wheel Zoom Listener over Canvas
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      setZoom((prevZoom) => {
        const step = 0.08;
        const nextZoom = delta < 0 ? prevZoom + step : prevZoom - step;
        return Math.min(2.5, Math.max(0.3, Math.round(nextZoom * 100) / 100));
      });
    };

    canvasEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvasEl.removeEventListener('wheel', handleWheel);
    };
  }, [canvasRef, setZoom]);

  // Keyboard Shortcuts (Delete, Ctrl+D, Ctrl+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      // Ctrl+A / Cmd+A -> Select All
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleSelectAll();
        return;
      }

      // Ctrl+D / Cmd+D -> Duplicate Selected
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        handleDuplicateSelected();
        return;
      }

      // Delete / Backspace -> Delete Selected
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, selectedContainerIds, selectedLinkId, diagram]);

  // Duplication Logic
  const handleDuplicateSelected = () => {
    if (selectedNodeIds.length === 0 && selectedContainerIds.length === 0) return;

    onRecordHistory();

    const nodeIdMap = new Map<string, string>();
    const newNodes: DiagramNode[] = [];
    const newContainers: DiagramContainer[] = [];
    const newLinks: DiagramLink[] = [];
    const timestamp = Date.now();

    diagram.nodes.forEach((node, idx) => {
      if (selectedNodeIds.includes(node.id)) {
        const newId = `node_${timestamp}_${idx}`;
        nodeIdMap.set(node.id, newId);
        newNodes.push({
          ...node,
          id: newId,
          name: `${node.name} (Cópia)`,
          x: node.x + 30,
          y: node.y + 30,
          specs: { ...node.specs }
        });
      }
    });

    diagram.containers.forEach((container, idx) => {
      if (selectedContainerIds.includes(container.id)) {
        const newId = `c_${timestamp}_${idx}`;
        newContainers.push({
          ...container,
          id: newId,
          name: `${container.name} (Cópia)`,
          x: container.x + 30,
          y: container.y + 30
        });
      }
    });

    diagram.links.forEach((link, idx) => {
      const newFrom = nodeIdMap.get(link.from);
      const newTo = nodeIdMap.get(link.to);
      if (newFrom && newTo) {
        newLinks.push({
          ...link,
          id: `link_${timestamp}_${idx}`,
          from: newFrom,
          to: newTo
        });
      }
    });

    setDiagram((prev) => ({
      ...prev,
      nodes: [...prev.nodes, ...newNodes],
      containers: [...prev.containers, ...newContainers],
      links: [...prev.links, ...newLinks],
      updatedAt: new Date().toISOString()
    }));

    updateSelection(
      newNodes.map((n) => n.id),
      newContainers.map((c) => c.id)
    );
  };

  // Delete Selected Logic
  const handleDeleteSelected = () => {
    if (selectedNodeIds.length === 0 && selectedContainerIds.length === 0 && !selectedLinkId) return;

    onRecordHistory();

    setDiagram((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => !selectedNodeIds.includes(n.id)),
      containers: prev.containers.filter((c) => !selectedContainerIds.includes(c.id)),
      links: prev.links.filter(
        (l) =>
          l.id !== selectedLinkId &&
          !selectedNodeIds.includes(l.from) &&
          !selectedNodeIds.includes(l.to)
      ),
      updatedAt: new Date().toISOString()
    }));

    updateSelection([], [], null);
  };

  // Grouping capability
  const handleGroup = () => {
    const totalSelected = selectedNodeIds.length + selectedContainerIds.length;
    if (totalSelected < 1) return;

    onRecordHistory();

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const targetNodes = diagram.nodes.filter((n) => selectedNodeIds.includes(n.id));
    const targetContainers = diagram.containers.filter((c) => selectedContainerIds.includes(c.id));

    targetNodes.forEach((node) => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + 96);
      maxY = Math.max(maxY, node.y + 80);
    });

    targetContainers.forEach((c) => {
      minX = Math.min(minX, c.x);
      minY = Math.min(minY, c.y);
      maxX = Math.max(maxX, c.x + c.width);
      maxY = Math.max(maxY, c.y + c.height);
    });

    if (minX === Infinity || !isFinite(minX)) return;

    const paddingX = 24;
    const paddingTop = 40;
    const paddingBottom = 24;

    const groupProvider = targetNodes[0]?.provider || targetContainers[0]?.provider || diagram.primaryProvider || 'generic';

    const groupContainer: DiagramContainer = {
      id: `group_${Date.now()}`,
      name: `Grupo (${targetNodes.length + targetContainers.length} componentes)`,
      provider: groupProvider,
      type: 'custom',
      x: Math.max(10, Math.round((minX - paddingX) / 10) * 10),
      y: Math.max(10, Math.round((minY - paddingTop) / 10) * 10),
      width: Math.max(200, Math.round((maxX - minX + paddingX * 2) / 10) * 10),
      height: Math.max(130, Math.round((maxY - minY + paddingTop + paddingBottom) / 10) * 10),
      color: '#6366F1',
      borderStyle: 'solid'
    };

    setDiagram((prev) => ({
      ...prev,
      containers: [...prev.containers, groupContainer]
    }));

    updateSelection([], [groupContainer.id], null);
  };

  // Ungrouping capability
  const handleUngroup = () => {
    if (selectedContainerIds.length === 0) return;

    onRecordHistory();

    const containersToRemove = diagram.containers.filter((c) => selectedContainerIds.includes(c.id));
    const nodesInside: string[] = [];

    diagram.nodes.forEach((node) => {
      containersToRemove.forEach((c) => {
        if (
          node.x >= c.x - 10 &&
          node.x + 96 <= c.x + c.width + 10 &&
          node.y >= c.y - 10 &&
          node.y + 80 <= c.y + c.height + 10
        ) {
          if (!nodesInside.includes(node.id)) {
            nodesInside.push(node.id);
          }
        }
      });
    });

    setDiagram((prev) => ({
      ...prev,
      containers: prev.containers.filter((c) => !selectedContainerIds.includes(c.id))
    }));

    updateSelection(nodesInside, [], null);
  };

  // Select All
  const handleSelectAll = () => {
    const allNodeIds = diagram.nodes.map((n) => n.id);
    const allContainerIds = diagram.containers.map((c) => c.id);
    updateSelection(allNodeIds, allContainerIds, null);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
        return;
      }

      if (e.key === 'Escape') {
        setConnectingSourceId(null);
        setIsConnectingMode(false);
      }

      // Group shortcut: Ctrl+G or Cmd+G
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g' && !e.shiftKey) {
        e.preventDefault();
        handleGroup();
      }

      // Ungroup shortcut: Ctrl+Shift+G or Cmd+Shift+G
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g' && e.shiftKey) {
        e.preventDefault();
        handleUngroup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, selectedContainerIds, diagram]);

  return (
    <div
      id="architecture-canvas-container"
      ref={canvasRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      className={`relative flex-1 overflow-auto select-none custom-scrollbar canvas-background transition-colors ${
        isConnectingMode || connectingSourceId
          ? 'cursor-crosshair'
          : panState?.isPanning
          ? 'cursor-grabbing'
          : 'cursor-grab'
      } ${
        isLight ? 'bg-[#F8FAFC]' : 'bg-[#0E1015]'
      }`}
      style={{
        backgroundImage: isLight
          ? 'radial-gradient(circle, #CBD5E1 1.2px, transparent 1.2px)'
          : 'radial-gradient(circle, #252a33 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Active Connection Banner */}
      {(isConnectingMode || connectingSourceId) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-blue-950/95 border border-blue-500/80 text-blue-200 px-4 py-2 rounded-xl shadow-2xl flex items-center space-x-3 backdrop-blur-md animate-bounce-short">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-semibold">
            {connectingSourceId ? (
              <>
                Ligar a partir de <strong className="text-white font-bold">{diagram.nodes.find((n) => n.id === connectingSourceId)?.name}</strong>: Clique no componente de destino (ex: EC2, Banco de Dados).
              </>
            ) : (
              <>Clique no <strong>primeiro componente</strong> (ex: Load Balancer) para iniciar a ligação.</>
            )}
          </span>
          <button
            onClick={() => {
              setConnectingSourceId(null);
              setIsConnectingMode(false);
            }}
            className="ml-2 bg-white/10 hover:bg-white/20 p-1 px-2 rounded-md text-xs font-medium text-slate-200 flex items-center space-x-1 border border-white/10"
            title="Cancelar Conexão (Esc)"
          >
            <X className="w-3.5 h-3.5 text-red-400" />
            <span>Cancelar</span>
          </button>
        </div>
      )}

      {/* Floating Selection Toolbar */}
      {(selectedNodeIds.length > 0 || selectedContainerIds.length > 0 || selectedLinkId) && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 border backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-2xl flex items-center space-x-3 text-xs ${
          isLight
            ? 'bg-white/95 border-slate-300 text-slate-800'
            : 'bg-[#12141A]/95 border-white/20 text-slate-200'
        }`}>
          <div className={`flex items-center space-x-1.5 font-semibold border-r pr-3 ${
            isLight ? 'text-slate-700 border-slate-300' : 'text-slate-300 border-white/10'
          }`}>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              {selectedNodeIds.length + selectedContainerIds.length || (selectedLinkId ? 1 : 0)} selecionado(s)
            </span>
          </div>

          {/* Quick Connect Action when 1 node selected */}
          {selectedNodeIds.length === 1 && !connectingSourceId && (
            <button
              onClick={(e) => handleStartConnection(e, selectedNodeIds[0])}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/70 text-indigo-200 border border-indigo-500/50 transition-all font-semibold"
              title="Ligar este componente a outro"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Conectar a...</span>
            </button>
          )}

          {/* Grouping / Agrupar */}
          {(selectedNodeIds.length + selectedContainerIds.length >= 1) && (
            <button
              onClick={handleGroup}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-200 border border-indigo-500/40 transition-all font-semibold"
              title="Agrupar componentes selecionados em um novo container (Ctrl+G)"
            >
              <FolderPlus className="w-3.5 h-3.5 text-indigo-300" />
              <span>Agrupar</span>
              <span className="text-[10px] text-indigo-300/80 font-mono ml-1">Ctrl+G</span>
            </button>
          )}

          {/* Ungrouping / Desagrupar */}
          {selectedContainerIds.length >= 1 && (
            <button
              onClick={handleUngroup}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 transition-all font-semibold"
              title="Desagrupar container selecionado (Ctrl+Shift+G)"
            >
              <FolderMinus className="w-3.5 h-3.5 text-amber-300" />
              <span>Desagrupar</span>
              <span className="text-[10px] text-amber-300/80 font-mono ml-1">Ctrl+Shift+G</span>
            </button>
          )}

          {/* Auto-Align Nodes Horizontally & Vertically */}
          {selectedNodeIds.length >= 2 && (
            <div className={`flex items-center space-x-1 pl-1 border-l ${
              isLight ? 'border-slate-300' : 'border-white/10'
            }`}>
              <button
                type="button"
                id="btn-align-horizontal"
                onClick={handleAlignHorizontal}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition-all text-xs font-semibold shadow-sm ${
                  isLight
                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-blue-500/15 hover:bg-blue-500/30 text-blue-300 border-blue-500/30'
                }`}
                title="Alinhar Nós Horizontalmente (Ajusta todos para o mesmo eixo Y)"
              >
                <Rows className="w-3.5 h-3.5 text-blue-400" />
                <span>Alinhar Horiz.</span>
              </button>

              <button
                type="button"
                id="btn-align-vertical"
                onClick={handleAlignVertical}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition-all text-xs font-semibold shadow-sm ${
                  isLight
                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-blue-500/15 hover:bg-blue-500/30 text-blue-300 border-blue-500/30'
                }`}
                title="Alinhar Nós Verticalmente (Ajusta todos para o mesmo eixo X)"
              >
                <Columns className="w-3.5 h-3.5 text-blue-400" />
                <span>Alinhar Vert.</span>
              </button>

              {selectedNodeIds.length >= 3 && (
                <>
                  <button
                    type="button"
                    id="btn-distribute-horizontal"
                    onClick={handleDistributeHorizontally}
                    className={`px-2 py-1 rounded-lg border transition-all text-[11px] font-medium ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    }`}
                    title="Espaçar Nós Horizontalmente com distâncias iguais"
                  >
                    Espaçar H
                  </button>
                  <button
                    type="button"
                    id="btn-distribute-vertical"
                    onClick={handleDistributeVertically}
                    className={`px-2 py-1 rounded-lg border transition-all text-[11px] font-medium ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    }`}
                    title="Espaçar Nós Verticalmente com distâncias iguais"
                  >
                    Espaçar V
                  </button>
                </>
              )}
            </div>
          )}

          {/* Duplicar */}
          {(selectedNodeIds.length > 0 || selectedContainerIds.length > 0) && (
            <button
              onClick={handleDuplicateSelected}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30 transition-all font-medium"
              title="Duplicar selecionados (Ctrl+D)"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicar</span>
              <span className="text-[10px] text-blue-400/80 font-mono ml-1">Ctrl+D</span>
            </button>
          )}

          {/* Excluir */}
          <button
            onClick={handleDeleteSelected}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 transition-all font-medium"
            title="Excluir selecionados (Delete)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir</span>
          </button>

          {/* Selecionar Todos */}
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all text-xs font-medium"
            title="Selecionar Todos (Ctrl+A)"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Todos</span>
            <span className="text-[10px] text-slate-500 font-mono ml-1">Ctrl+A</span>
          </button>
        </div>
      )}

      {/* Floating Zoom Controls Overlay */}
      <div className={`absolute bottom-5 right-5 z-30 border backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-2xl flex items-center space-x-2 text-xs ${
        isLight
          ? 'bg-white/95 border-slate-300 text-slate-800'
          : 'bg-[#12141A]/90 border-white/15 text-slate-200'
      }`}>
        <button
          type="button"
          id="btn-toggle-snap-grid"
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center space-x-1.5 transition-all shadow-sm ${
            snapToGrid
              ? (isLight ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-500/25 text-blue-300 border-blue-500/50')
              : (isLight ? 'bg-slate-100 text-slate-500 border-slate-300 hover:text-slate-800' : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200')
          }`}
          title={snapToGrid ? 'Snap to Grid ATIVADO (Atrair para a grade de 20px)' : 'Snap to Grid DESATIVADO'}
        >
          <Grid className={`w-3.5 h-3.5 ${snapToGrid ? (isLight ? 'text-white' : 'text-blue-400') : 'text-slate-400'}`} />
          <span>Grade: {snapToGrid ? 'ON' : 'OFF'}</span>
        </button>

        <div className={`w-[1px] h-4 my-auto ${isLight ? 'bg-slate-300' : 'bg-white/10'}`} />

        <button
          onClick={() => setZoom((z) => Math.max(0.3, Math.round((z - 0.1) * 10) / 10))}
          className={`p-1 rounded-md transition-colors font-bold ${
            isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-300'
          }`}
          title="Diminuir Zoom (Mouse wheel)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => setZoom(1.0)}
          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
            isLight ? 'hover:bg-slate-100 text-amber-600' : 'hover:bg-white/10 text-amber-400'
          }`}
          title="Resetar Zoom (100%)"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={() => setZoom((z) => Math.min(2.5, Math.round((z + 0.1) * 10) / 10))}
          className={`p-1 rounded-md transition-colors font-bold ${
            isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-300'
          }`}
          title="Aumentar Zoom (Mouse wheel)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className={`w-[1px] h-4 my-auto ${isLight ? 'bg-slate-300' : 'bg-white/10'}`} />

        <button
          onClick={() => setZoom(1.0)}
          className={`p-1 rounded-md transition-colors text-[10px] uppercase font-semibold flex items-center space-x-1 ${
            isLight ? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900' : 'hover:bg-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title="Ajustar Tamanho Original"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Zoom Canvas Wrapper */}
      <div
        className="relative origin-top-left transition-transform duration-75 canvas-background"
        style={{
          transform: `scale(${zoom})`,
          width: '2400px',
          height: '1600px',
          backgroundImage: snapToGrid
            ? isLight
              ? 'radial-gradient(circle, rgba(148, 163, 184, 0.4) 1px, transparent 1px)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)'
            : 'none',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Marquee Selection Rectangle Box */}
        {marqueeState && (
          <div
            className="absolute border-2 border-blue-400 bg-blue-500/20 rounded-lg pointer-events-none z-40 transition-none"
            style={{
              left: `${Math.min(marqueeState.startX, marqueeState.currentX)}px`,
              top: `${Math.min(marqueeState.startY, marqueeState.currentY)}px`,
              width: `${Math.abs(marqueeState.currentX - marqueeState.startX)}px`,
              height: `${Math.abs(marqueeState.currentY - marqueeState.startY)}px`
            }}
          />
        )}

        {/* SVG Overlay for Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker
              id="arrow-head"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
            <marker
              id="arrow-selected"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
            </marker>
          </defs>

          {/* Live Line Preview while connecting */}
          {connectingSourceId && mouseCanvasPos && (() => {
            const srcNode = diagram.nodes.find((n) => n.id === connectingSourceId);
            if (!srcNode) return null;
            const x1 = srcNode.x + 48;
            const y1 = srcNode.y + 40;
            const x2 = mouseCanvasPos.x;
            const y2 = mouseCanvasPos.y;
            return (
              <g className="pointer-events-none">
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <circle cx={x2} cy={y2} r="6" fill="#38BDF8" className="animate-ping" />
                <circle cx={x2} cy={y2} r="4" fill="#38BDF8" />
              </g>
            );
          })()}

          {/* Render Links / Connectors */}
          {diagram.links.map((link) => {
            const fromNode = diagram.nodes.find((n) => n.id === link.from);
            const toNode = diagram.nodes.find((n) => n.id === link.to);
            if (!fromNode || !toNode) return null;

            const isSelected = selectedLinkId === link.id;

            const x1 = fromNode.x + 40;
            const y1 = fromNode.y + 40;
            const x2 = toNode.x + 40;
            const y2 = toNode.y + 40;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const cx1 = x1 + dx * 0.5;
            const cy1 = y1;
            const cx2 = x1 + dx * 0.5;
            const cy2 = y2;

            const pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            const strokeColor = isSelected ? '#F59E0B' : (link.color || '#38BDF8');
            const baseWidth = link.strokeWidth || 2;
            const strokeWidth = isSelected ? baseWidth + 1 : baseWidth;

            const dashArray = 
              link.style === 'dashed' ? '6 6' :
              link.style === 'dotted' ? '2 4' : undefined;

            const arrowMode = link.arrowHead || 'end';
            const showEndArrow = arrowMode === 'end' || arrowMode === 'both';
            const showStartArrow = arrowMode === 'start' || arrowMode === 'both';

            const markerEnd = showEndArrow
              ? (isSelected ? 'url(#arrow-selected)' : 'url(#arrow-head)')
              : undefined;

            const markerStart = showStartArrow
              ? (isSelected ? 'url(#arrow-selected)' : 'url(#arrow-head)')
              : undefined;

            return (
              <g
                key={link.id}
                className="pointer-events-auto cursor-pointer"
                style={{ color: strokeColor }}
                onClick={(e) => {
                  e.stopPropagation();
                  updateSelection([], [], link.id);
                }}
              >
                <path d={pathD} stroke="transparent" strokeWidth="16" fill="none" />
                <path
                  d={pathD}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  fill="none"
                  markerEnd={markerEnd}
                  markerStart={markerStart}
                  className="transition-all hover:stroke-amber-400"
                />

                {link.label && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-42"
                      y="-11"
                      width="84"
                      height="22"
                      rx="6"
                      fill={isLight ? '#FFFFFF' : '#0F172A'}
                      stroke={isSelected ? '#F59E0B' : (link.color || (isLight ? '#94A3B8' : '#334155'))}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="3.5"
                      fill={isLight ? '#0F172A' : '#E2E8F0'}
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {link.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Render Containers (VPCs / Subnets / Compartments) */}
        {diagram.containers.map((c) => {
          const isSelected = selectedContainerIds.includes(c.id);
          const isEditing = editingId === c.id;

          const handleSaveContainerName = () => {
            if (editingName.trim()) {
              onRecordHistory();
              setDiagram((prev) => ({
                ...prev,
                containers: prev.containers.map((item) => (item.id === c.id ? { ...item, name: editingName.trim() } : item))
              }));
            }
            setEditingId(null);
          };

          return (
            <div
              key={c.id}
              id={`container-${c.id}`}
              onMouseDown={(e) => handleMouseDownContainer(e, c.id)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingId(c.id);
                setEditingName(c.name);
              }}
              style={{
                left: `${c.x}px`,
                top: `${c.y}px`,
                width: `${c.width}px`,
                height: `${c.height}px`,
                borderColor: c.color || '#3B82F6',
                backgroundColor: c.color 
                  ? `${c.color}${isLight ? '12' : '15'}` 
                  : (isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(18, 20, 26, 0.3)')
              }}
              className={`absolute rounded-xl border-2 transition-all p-3 z-0 ${
                c.borderStyle === 'solid' ? 'border-solid' : c.borderStyle === 'dotted' ? 'border-dotted' : 'border-dashed'
              } ${
                isSelected 
                  ? 'ring-2 ring-amber-400 shadow-2xl z-10 ' + (isLight ? 'bg-white/90' : 'bg-[#12141A]/70')
                  : (isLight ? 'hover:border-blue-500 shadow-sm' : 'hover:border-slate-300')
              }`}
            >
              {/* Container Label Header */}
              <div
                className={`flex items-center space-x-2 px-2.5 py-1 rounded border text-xs font-bold w-max ${
                  isLight ? 'bg-white border-slate-200 text-slate-950 shadow-sm' : 'bg-[#12141A]/90 border-white/10 text-slate-200'
                }`}
                style={{ borderColor: `${c.color || '#3B82F6'}60`, color: c.color || (isLight ? '#1D4ED8' : '#60A5FA') }}
              >
                <span className="uppercase text-[10px] tracking-wider font-extrabold">{c.type}</span>
                {isEditing ? (
                  <input
                    type="text"
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleSaveContainerName}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveContainerName();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`border rounded px-1 text-xs outline-none w-32 ${
                      isLight ? 'bg-slate-100 border-blue-500 text-slate-950 font-bold' : 'bg-black/60 border-blue-500 text-slate-100'
                    }`}
                  />
                ) : (
                  <span className={isLight ? 'text-slate-950 font-bold' : 'text-slate-200'}>{c.name}</span>
                )}
              </div>

              {/* Quick Ungroup Action Button on Selected Container */}
              {isSelected && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUngroup();
                  }}
                  className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 flex items-center space-x-1 shadow-md transition-all hover:scale-105"
                  title="Desagrupar este container (Ctrl+Shift+G)"
                >
                  <FolderMinus className="w-3 h-3 text-amber-300" />
                  <span>Desagrupar</span>
                </button>
              )}

              {/* Resize Handles for Selected Container */}
              {isSelected && (
                <>
                  <div
                    onMouseDown={(e) => handleMouseDownResize(e, c.id, 'nw')}
                    className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border-2 border-[#12141A] rounded-full cursor-nwse-resize z-20 hover:scale-125 transition-transform shadow-md"
                    title="Redimensionar Canto Superior Esquerdo"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownResize(e, c.id, 'ne')}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border-2 border-[#12141A] rounded-full cursor-nesw-resize z-20 hover:scale-125 transition-transform shadow-md"
                    title="Redimensionar Canto Superior Direito"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownResize(e, c.id, 'se')}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border-2 border-[#12141A] rounded-full cursor-nwse-resize z-20 hover:scale-125 transition-transform shadow-md"
                    title="Redimensionar Canto Inferior Direito"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownResize(e, c.id, 'sw')}
                    className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border-2 border-[#12141A] rounded-full cursor-nesw-resize z-20 hover:scale-125 transition-transform shadow-md"
                    title="Redimensionar Canto Inferior Esquerdo"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownResize(e, c.id, 'n')}
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-amber-400 border-2 border-[#12141A] rounded-full cursor-ns-resize z-20 hover:scale-125 transition-transform shadow-md"
                    title="Redimensionar Altura Superior"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownResize(e, c.id, 's')}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-amber-400 border-2 border-[#12141A] rounded-full cursor-ns-resize z-20 hover:scale-125 transition-transform shadow-md"
                    title="Redimensionar Altura Inferior"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownResize(e, c.id, 'w')}
                    className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3.5 h-3.5 bg-amber-400 border-2 border-[#12141A] rounded-full cursor-ew-resize z-20 hover:scale-125 transition-transform shadow-md"
                    title="Redimensionar Largura Esquerda"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownResize(e, c.id, 'e')}
                    className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3.5 h-3.5 bg-amber-400 border-2 border-[#12141A] rounded-full cursor-ew-resize z-20 hover:scale-125 transition-transform shadow-md"
                    title="Redimensionar Largura Direita"
                  />
                </>
              )}
            </div>
          );
        })}

        {/* Render Resource Nodes */}
        {diagram.nodes.map((node) => {
          const iconDef = getIconByKey(node.iconKey);
          const isSelected = selectedNodeIds.includes(node.id);
          const isConnectingSource = connectingSourceId === node.id;
          const isEditing = editingId === node.id;

          const handleSaveNodeName = () => {
            if (editingName.trim()) {
              onRecordHistory();
              setDiagram((prev) => ({
                ...prev,
                nodes: prev.nodes.map((item) => (item.id === node.id ? { ...item, name: editingName.trim() } : item))
              }));
            }
            setEditingId(null);
          };

          return (
            <div
              key={node.id}
              id={`node-${node.id}`}
              onMouseDown={(e) => handleMouseDownNode(e, node.id)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingId(node.id);
                setEditingName(node.name);
              }}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`
              }}
              className={`absolute w-24 flex flex-col items-center justify-center p-2 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-150 z-20 shadow-lg group ${
                isConnectingSource
                  ? 'ring-4 ring-blue-500 border-blue-400 scale-105'
                  : isSelected
                  ? 'ring-2 ring-amber-400 border-amber-400 shadow-amber-500/20 ' + (isLight ? 'bg-amber-50' : 'bg-[#1a1d26]')
                  : isLight
                  ? 'bg-white border-slate-300 hover:border-blue-500 hover:shadow-xl hover:scale-105 text-slate-900'
                  : 'bg-[#12141A] border-white/10 hover:border-blue-500/80 hover:bg-[#1a1d26] hover:scale-105 text-slate-100'
              }`}
            >
              {/* Provider Badge Pill */}
              <span
                className="text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-full mb-1"
                style={{
                  backgroundColor: `${iconDef?.brandColor || '#3B82F6'}20`,
                  color: iconDef?.brandColor || (isLight ? '#1D4ED8' : '#60A5FA')
                }}
              >
                {node.provider}
              </span>

              {/* Icon SVG */}
              <div
                className="w-10 h-10 flex items-center justify-center p-1"
                dangerouslySetInnerHTML={{ __html: iconDef?.svg || '' }}
              />

              {/* Node Title & Specs Badge */}
              {isEditing ? (
                <input
                  type="text"
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={handleSaveNodeName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveNodeName();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`border rounded px-1 text-xs text-center outline-none w-full mt-1 ${
                    isLight ? 'bg-slate-100 border-blue-500 text-slate-950 font-bold' : 'bg-black/60 border-blue-500 text-slate-100'
                  }`}
                />
              ) : (
                <span className={`text-xs font-bold text-center leading-tight mt-1 line-clamp-2 w-full break-words ${
                  isLight ? 'text-slate-950' : 'text-slate-100'
                }`}>
                  {node.name}
                </span>
              )}

              {node.specs.instanceType && (
                <span className={`text-[9px] font-mono font-bold mt-0.5 px-1 py-0.2 rounded ${
                  isLight ? 'bg-slate-100 text-slate-900 border border-slate-300' : 'bg-black/40 text-slate-400'
                }`}>
                  {node.specs.instanceType}
                </span>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md">
                  <Move className="w-3 h-3" />
                </div>
              )}

              {/* Quick Connection Action Button (shown when hovered or selected) */}
              {(isSelected || hoveredNodeId === node.id || isConnectingSource) && !isConnectingSource && (
                <button
                  type="button"
                  onClick={(e) => handleStartConnection(e, node.id)}
                  className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-600 hover:bg-blue-500 text-white border border-blue-300 shadow-lg flex items-center space-x-1 transition-transform hover:scale-110 whitespace-nowrap"
                  title="Criar conexão a partir deste componente"
                >
                  <Zap className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                  <span>Ligar</span>
                </button>
              )}

              {/* Target Highlight Overlay when connecting */}
              {connectingSourceId && connectingSourceId !== node.id && hoveredNodeId === node.id && (
                <div className="absolute inset-0 rounded-xl ring-4 ring-emerald-400 bg-emerald-500/25 flex flex-col items-center justify-center z-30 backdrop-blur-[1px] animate-pulse">
                  <span className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow-md flex items-center space-x-1 whitespace-nowrap">
                    <ArrowRight className="w-3 h-3" />
                    <span>Ligar Aqui</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Visual Drag-and-Drop Ghosting Node Preview on Canvas */}
        {dragOverPos && (
          <div
            style={{
              left: `${dragOverPos.x}px`,
              top: `${dragOverPos.y}px`
            }}
            className={`absolute w-24 h-24 flex flex-col items-center justify-center p-2 rounded-xl border-2 border-dashed border-blue-500 bg-blue-500/15 backdrop-blur-md z-30 pointer-events-none shadow-2xl transition-transform animate-pulse ${
              isLight ? 'text-blue-900 border-blue-600 bg-blue-500/20' : 'text-blue-300'
            }`}
          >
            <div className="w-8 h-8 rounded-full border border-blue-400/60 bg-blue-500/20 flex items-center justify-center mb-1">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-400 text-center">
              Soltar para Adicionar
            </span>
            <span className="text-[8px] font-mono text-blue-300/80 mt-0.5">
              X: {dragOverPos.x} Y: {dragOverPos.y}
            </span>
          </div>
        )}

        {/* Render Diagram Metadata Stamp Block */}
        {diagram.metadata?.showOnCanvas === true && (
          <div
            id="diagram-metadata-stamp"
            onMouseDown={handleMouseDownStamp}
            onDoubleClick={() => onOpenMetadataModal && onOpenMetadataModal()}
            style={{
              left: `${diagram.metadata?.x ?? 30}px`,
              top: `${diagram.metadata?.y ?? 30}px`
            }}
            className={`absolute z-20 min-w-[280px] border-2 rounded-xl p-3.5 shadow-2xl backdrop-blur-md cursor-grab active:cursor-grabbing transition-all group select-none ${
              isLight
                ? 'bg-white/95 border-blue-500/50 hover:border-blue-600 text-slate-800 hover:shadow-blue-500/10'
                : 'bg-[#12141A]/95 border-blue-500/40 hover:border-blue-400 text-slate-200 hover:shadow-blue-500/10'
            }`}
          >
            <div className={`flex items-center justify-between pb-2 mb-2 border-b ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`p-1 rounded border ${
                  isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-600/30 text-blue-400 border-blue-500/30'
                }`}>
                  <FileSignature className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-blue-700' : 'text-blue-400'
                }`}>
                  Carimbo do Diagrama
                </span>
              </div>
              {onOpenMetadataModal && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenMetadataModal();
                  }}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-all ${
                    isLight
                      ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300'
                      : 'opacity-80 group-hover:opacity-100 bg-blue-600/20 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30'
                  }`}
                  title="Editar Dados (Autor, Cargo, Data, Projeto)"
                >
                  Editar
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div className={`col-span-2 pb-1 border-b ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                <span className={`block text-[9px] uppercase font-bold tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>Projeto</span>
                <span className={`font-bold truncate block ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {diagram.metadata?.project || diagram.title || 'Projeto Cloud'}
                </span>
              </div>

              <div>
                <span className={`block text-[9px] uppercase font-bold tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>Autor</span>
                <span className={`font-bold truncate block ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>
                  {diagram.metadata?.author || '—'}
                </span>
              </div>

              <div>
                <span className={`block text-[9px] uppercase font-bold tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>Cargo</span>
                <span className={`font-bold truncate block ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>
                  {diagram.metadata?.role || '—'}
                </span>
              </div>

              <div className={`col-span-2 pt-1 border-t ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                <span className={`block text-[9px] uppercase font-bold tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>Data</span>
                <span className={`font-bold truncate block ${isLight ? 'text-slate-950' : 'text-slate-300'}`}>
                  {diagram.metadata?.date || new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>

              {diagram.metadata?.tags && diagram.metadata.tags.length > 0 && (
                <div className={`col-span-2 pt-1.5 border-t flex flex-wrap gap-1 ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                  {diagram.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${
                        isLight
                          ? 'bg-blue-50 border-blue-200 text-blue-800'
                          : 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
