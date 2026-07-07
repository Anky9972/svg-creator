import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add Router imports
content = content.replace(
  "import { useState, useCallback, useRef, useEffect, useMemo } from 'react'",
  "import { useState, useCallback, useRef, useEffect, useMemo } from 'react'\nimport { Routes, Route } from 'react-router-dom'\nimport TopBar from './components/TopBar'\nimport LeftSidebar from './components/LeftSidebar'\nimport RightSidebar from './components/RightSidebar'\nimport Canvas from './components/Canvas'\nimport LegalPage from './LegalPage'\nimport CommunityGallery from './components/CommunityGallery'"
);

// 2. Change sidebarOpen to left/right
content = content.replace(
  "const [sidebarOpen, setSidebarOpen] = useState(false)",
  "const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)\n  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)"
);

// 3. Find where return ( starts
const returnIndex = content.search(/  return \(\r?\n    <main className={`min-h-screen/);
if (returnIndex === -1) {
  console.log("Could not find return statement");
  process.exit(1);
}

// 4. Create the replacement block
const newReturn = `  // Context for extracted components
  const appCtx = {
    themeColors, theme, toggleTheme,
    leftSidebarOpen, setLeftSidebarOpen, rightSidebarOpen, setRightSidebarOpen,
    isFullscreen, toggleFullscreen,
    user, authLoading, email, setEmail, password, setPassword,
    isSignUp, setIsSignUp, handleEmailAuth, authError, logout, loginWithGoogle,
    saveProjectToCloud: handleCloudSave, undo, redo, canUndo, canRedo,
    exportSVG, exportPNGWithSize, generateShareLink, copyCode, copied,
    aspectRatio, setAspectRatio, handlePresetShape: loadPreset,
    snapToGrid, setSnapToGrid, snapToCenter, setSnapToCenter,
    showGrid: showGridPoints, setShowGrid: setShowGridPoints, gridSize, setGridSize,
    addMode, setAddMode, insertMode, setInsertMode,
    fillColor: previewColors.solid, setFillColor: (c) => setPreviewColors({...previewColors, solid: c}),
    customBgColor: exportBackground.value, setCustomBgColor: (c) => setExportBackground({type: 'solid', value: c}),
    globalRadius, applyGlobalRadius, setGlobalRadius,
    selectedPointData: selectedPoint !== null ? points[selectedPoint] : null,
    updateSelectedPoint: (e) => {
      if (selectedPoint === null) return;
      const val = parseFloat(e.target.value);
      if (!isNaN(val)) {
        setPoints(prev => prev.map((p, i) => i === selectedPoint ? { ...p, [e.target.name]: val } : p));
      }
    },
    deleteSelectedPoint: () => {
      if (selectedPoint !== null) {
        removePoint(selectedPoint);
        setSelectedPoint(null);
      }
    },
    toggleSymmetric: () => {
      if (selectedPoint !== null) {
        setPoints(prev => prev.map((p, i) => i === selectedPoint ? { ...p, symmetric: !p.symmetric } : p));
      }
    },
    clipPathId, setClipPathId,
    // Provide canvas specific ones
    points, setPoints, selectedPoint, setSelectedPoint,
    svgRef, canvasContainerRef, isDragging, dragOffset, lastUpdateRef,
    zoom, pan, pathD, generatePathString,
    updatePoint, insertPoint,
    canvasHeight,
    // Add missing explicitly expected values for sidebars
    showGridPoints,
  };

  return (
    <Routes>
      <Route path="/" element={
        <main className="h-screen flex flex-col transition-colors duration-300 font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden relative" style={{ backgroundColor: themeColors.bg, color: themeColors.text }}>
          <TopBar {...appCtx} />
          <div className="flex flex-1 overflow-hidden relative">
            <LeftSidebar {...appCtx} />
            <Canvas {...appCtx} />
            <RightSidebar {...appCtx} />
          </div>
        </main>
      } />
      <Route path="/community" element={<CommunityGallery themeColors={themeColors} theme={theme} />} />
      <Route path="/privacy" element={<LegalPage type="privacy" themeColors={themeColors} />} />
      <Route path="/terms" element={<LegalPage type="terms" themeColors={themeColors} />} />
      <Route path="/contact" element={<LegalPage type="contact" themeColors={themeColors} />} />
      <Route path="/about" element={<LegalPage type="about" themeColors={themeColors} />} />
    </Routes>
  );
}

export default App;
`;

// Combine the content up to the return, and then our new return
content = content.substring(0, returnIndex) + newReturn;

fs.writeFileSync('src/App.jsx', content);
console.log("Successfully updated App.jsx");
