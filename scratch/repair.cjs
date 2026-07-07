const fs = require('fs');
const lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');

const brokenStart = lines.findIndex(l => l.includes("bg: '#f4f4f5',"));

const correctEnd = `    bg: '#f4f4f5',         // Zinc 100
    sidebar: '#ffffff',    // White
    card: '#ffffff',       // White
    border: '#e4e4e7',     // Zinc 200
    input: '#f4f4f5',      // Zinc 100
    text: '#09090b',       // Zinc 950
    textSecondary: 'text-zinc-600',
    textMuted: 'text-zinc-500',
    buttonBg: 'bg-zinc-100',
    buttonHover: 'hover:bg-zinc-200',
    sidebarSection: 'bg-zinc-50',
    cardBg: 'bg-white',
  };

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

  return (
    <main className={\`min-h-screen transition-colors duration-300\`} style={{ backgroundColor:themeColors.bg, color: themeColors.text }}>
      <h1 className="sr-only">Free Clip Path Editor Online & SVG Path Generator</h1>
      <div className="flex h-screen relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={\`fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl shadow-lg transition-all \${isFullscreen ? 'hidden' : ''}\`}
          style={{ backgroundColor: themeColors.sidebar, border: \`1px solid \${themeColors.border}\` }}
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>

        {/* Left Sidebar - Controls */}
        <Sidebar {...appCtx} />
        
        {/* Canvas Area */}
        <Canvas {...appCtx} />
      </div>
    </main>
  )
}

const AppWrapper = () => {
  return (
    <EditorProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/community" element={<CommunityGallery />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </EditorProvider>
  )
}

export default AppWrapper;
`;

const newLines = [
  ...lines.slice(0, brokenStart),
  correctEnd
];

fs.writeFileSync('src/App.jsx', newLines.join('\n'));
console.log('App.jsx repaired!');
