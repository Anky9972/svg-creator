const fs = require('fs');
const lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');

const asideStart = lines.findIndex(l => l.includes('<aside className='));
const asideEnd = lines.findIndex(l => l.includes('</aside>'));

const sectionStart = lines.findIndex(l => l.includes('<section className='));
const sectionEnd = lines.findIndex(l => l.includes('</section>'));

// We must construct the ctx object to pass to Sidebar and Canvas
const ctxProps = `
  const appCtx = {
    themeColors, theme, toggleTheme, sidebarOpen, setSidebarOpen, isFullscreen,
    authLoading, user, clipPathId, points, globalRadius, aspectRatio,
    searchQuery, setSearchQuery, loadPreset, handleCloudSave, handleEmailAuth,
    email, setEmail, password, setPassword, isSignUp, setIsSignUp, authError,
    getPointById, selectedPoint, setSelectedPoint,
    undo, redo, canUndo, canRedo, resetAllRadii, togglePointType, toggleSymmetric, deletePoint, movePointOrder, updatePoint,
    addMode, setAddMode, snapToGrid, setSnapToGrid, showGridPoints, setShowGridPoints,
    gridSize, setGridSize, copyCode, copied,
    insertMode, setInsertMode, setClipPathId,
    canvasHeight, setCanvasHeight, setAspectRatio,
    svgRef, canvasContainerRef, handleMouseMove, handleTouchMove, handleMouseUp, handleCanvasClick,
    gridPoints, handleAddPoint,
    pathD, insertAfterPoint,
    handlePointMouseDown, handlePointTouchStart, toggleFullscreen,
    showAnimation, setShowAnimation,
    generateCodeInFormat, exportBackground, setExportBackground,
    exportSVG, exportPNGWithSize, exportWebP, customImages, setCustomImages, previewColors,
    codeFormat, setCodeFormat
  };
`;

const newLines = [
  "import Sidebar from './components/Sidebar';",
  "import Canvas from './components/Canvas';",
  ...lines.slice(0, asideStart),
  ctxProps,
  "        <Sidebar {...appCtx} />",
  "        <Canvas {...appCtx} />",
  ...lines.slice(sectionEnd + 1)
];

// Clean up duplicate imports later if any, but this is fine.
fs.writeFileSync('src/App.jsx', newLines.join('\n'));
console.log('App.jsx updated!');
