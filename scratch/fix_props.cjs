const fs = require('fs');

const appCtxStr = `
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
    codeFormat, setCodeFormat,
    scaleShape, rotateShape, flipHorizontal, flipVertical, handleImageUpload, zoomIn, zoomOut, resetZoom, zoom, setZoom, pan, setPan,
    snapToPoints, setSnapToPoints, snapToCenter, setSnapToCenter,
    applySnapping, generateShareLink, shareOnTwitter, shareOnLinkedIn, shareOnFacebook, copyCodeFormat,
    saveProject, loadProject
`;

const sidebarFile = 'src/components/Sidebar.jsx';
let sidebarContent = fs.readFileSync(sidebarFile, 'utf8');

const destructStartSidebar = sidebarContent.indexOf('const {');
const destructEndSidebar = sidebarContent.indexOf('} = props;', destructStartSidebar);
sidebarContent = sidebarContent.substring(0, destructStartSidebar) + 'const {' + appCtxStr + '} = props;' + sidebarContent.substring(destructEndSidebar + 10);
fs.writeFileSync(sidebarFile, sidebarContent);

const canvasFile = 'src/components/Canvas.jsx';
let canvasContent = fs.readFileSync(canvasFile, 'utf8');

const destructStartCanvas = canvasContent.indexOf('const {');
const destructEndCanvas = canvasContent.indexOf('} = props;', destructStartCanvas);
canvasContent = canvasContent.substring(0, destructStartCanvas) + 'const {' + appCtxStr + '} = props;' + canvasContent.substring(destructEndCanvas + 10);
fs.writeFileSync(canvasFile, canvasContent);

console.log('Props fixed!');
