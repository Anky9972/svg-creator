const fs = require('fs');
const lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');

const asideStart = lines.findIndex(l => l.includes('<aside className='));
const asideEnd = lines.findIndex(l => l.includes('</aside>'));
const asideLines = lines.slice(asideStart, asideEnd + 1);

const sectionStart = lines.findIndex(l => l.includes('<section className='));
const sectionEnd = lines.findIndex(l => l.includes('</section>'));
const sectionLines = lines.slice(sectionStart, sectionEnd + 1);

const sidebarCode = `import React from 'react';
import { Link } from 'react-router-dom';
import { SHAPE_PRESETS, MIN_GRID, MAX_GRID } from '../utils/shapePresets';
import { loginWithGoogle, logout, saveProjectToCloud, loginWithEmail, signUpWithEmail } from '../utils/firebase';

export default function Sidebar(props) {
  const {
    themeColors, theme, toggleTheme, sidebarOpen, setSidebarOpen, isFullscreen,
    authLoading, user, clipPathId, points, globalRadius, aspectRatio,
    searchQuery, setSearchQuery, loadPreset, handleCloudSave, handleEmailAuth,
    email, setEmail, password, setPassword, isSignUp, setIsSignUp, authError,
    getPointById, selectedPoint, setSelectedPoint,
    undo, redo, canUndo, canRedo, resetAllRadii, togglePointType, toggleSymmetric, deletePoint, movePointOrder, updatePoint,
    addMode, setAddMode, snapToGrid, setSnapToGrid, showGridPoints, setShowGridPoints,
    gridSize, setGridSize, copyCode, copied,
    insertMode, setInsertMode, setClipPathId,
    canvasHeight, setCanvasHeight, setAspectRatio
  } = props;

  const selectedPointData = selectedPoint !== null ? getPointById(selectedPoint) : null;

  return (
    ${asideLines.join('\n    ')}
  );
}
`;

const canvasCode = `import React from 'react';
import KeyframeGenerator from './KeyframeGenerator';

export default function Canvas(props) {
  const {
    themeColors, theme, isFullscreen, canvasHeight,
    svgRef, canvasContainerRef, handleMouseMove, handleTouchMove, handleMouseUp, handleCanvasClick,
    gridSize, showGridPoints, gridPoints, addMode, insertMode, handleAddPoint,
    points, pathD, globalRadius, selectedPoint, insertAfterPoint,
    handlePointMouseDown, handlePointTouchStart, toggleFullscreen,
    showAnimation, setShowAnimation,
    generateCodeInFormat, exportBackground, setExportBackground,
    exportSVG, exportPNGWithSize, exportWebP, customImages, setCustomImages, previewColors,
    codeFormat, setCodeFormat, copyCode, copied
  } = props;

  return (
    ${sectionLines.join('\n    ')}
  );
}
`;

fs.writeFileSync('src/components/Sidebar.jsx', sidebarCode);
fs.writeFileSync('src/components/Canvas.jsx', canvasCode);

// Also rewrite App.jsx to use these components
const newAppLines = [
  ...lines.slice(0, asideStart),
  '        <Sidebar {...sidebarProps} />',
  '        <Canvas {...canvasProps} />',
  ...lines.slice(sectionEnd + 1)
];

// Wait, I shouldn't rewrite App.jsx automatically yet, let me just generate the components.
console.log('Generated Sidebar.jsx and Canvas.jsx');
