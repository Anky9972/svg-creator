import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useHistory } from '../hooks/useHistory';
import { SHAPE_PRESETS, GRID_DIVISIONS } from '../utils/shapePresets';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const EditorContext = createContext(null);

export const EditorProvider = ({ children }) => {
  // 1. History and Points
  const history = useHistory(SHAPE_PRESETS.rectangle.points);
  
  // 2. State from App.jsx
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [clipPathId, setClipPathId] = useState('customClip');
  const [copied, setCopied] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(GRID_DIVISIONS);
  const [showGridPoints, setShowGridPoints] = useState(true);
  const [globalRadius, setGlobalRadius] = useState(0);
  const [addMode, setAddMode] = useState(false);
  const [insertMode, setInsertMode] = useState('smart');
  const [insertAfterPoint, setInsertAfterPoint] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(500);
  const [previewColors, setPreviewColors] = useState({
    solid1: '#3b82f6',
    solid2: '#8b5cf6',
    solid3: '#10b981',
  });
  const [customImages, setCustomImages] = useState([
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
  ]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState('dark');
  const [snapToPoints, setSnapToPoints] = useState(false);
  const [snapToCenter, setSnapToCenter] = useState(false);
  const [codeFormat, setCodeFormat] = useState('svg');
  const [exportBackground, setExportBackground] = useState({ type: 'solid', value: null });
  const [showAnimation, setShowAnimation] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Firebase Auth State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. Refs
  const svgRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const isDragging = useRef(false);
  const dragTarget = useRef('point'); // 'point', 'handleIn', 'handleOut'
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastUpdateRef = useRef(Date.now());

  // Value object
  const value = {
    // History
    history,
    
    // State
    selectedPoint, setSelectedPoint,
    clipPathId, setClipPathId,
    copied, setCopied,
    snapToGrid, setSnapToGrid,
    gridSize, setGridSize,
    showGridPoints, setShowGridPoints,
    globalRadius, setGlobalRadius,
    addMode, setAddMode,
    insertMode, setInsertMode,
    insertAfterPoint, setInsertAfterPoint,
    aspectRatio, setAspectRatio,
    isFullscreen, setIsFullscreen,
    canvasHeight, setCanvasHeight,
    previewColors, setPreviewColors,
    customImages, setCustomImages,
    zoom, setZoom,
    pan, setPan,
    theme, setTheme,
    snapToPoints, setSnapToPoints,
    snapToCenter, setSnapToCenter,
    codeFormat, setCodeFormat,
    exportBackground, setExportBackground,
    showAnimation, setShowAnimation,
    sidebarOpen, setSidebarOpen,
    searchQuery, setSearchQuery,
    user, authLoading,

    // Refs
    svgRef,
    canvasContainerRef,
    isDragging,
    dragTarget,
    dragOffset,
    lastUpdateRef,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
