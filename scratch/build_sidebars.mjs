import fs from 'fs';

let original = fs.readFileSync('scratch/original_app.jsx', 'utf16le');

const lines = original.split(/\r?\n/);

const blocks = {
  shapePresets: lines.slice(1478, 1495).join('\n'),
  history: lines.slice(1495, 1526).join('\n'),
  projectExport: lines.slice(1526, 1675).join('\n'),
  transform: lines.slice(1675, 1780).join('\n'),
  previewColors: lines.slice(1780, 1815).join('\n'),
  customImages: lines.slice(1815, 1838).join('\n'),
  zoomPan: lines.slice(1838, 1881).join('\n'),
  snapping: lines.slice(1881, 1930).join('\n'),
  codeFormat: lines.slice(1930, 1968).join('\n'),
  share: lines.slice(1968, 2019).join('\n'),
  canvasSize: lines.slice(2019, 2071).join('\n'),
  gridSettings: lines.slice(2071, 2145).join('\n'),
  pointTools: lines.slice(2145, 2235).join('\n'),
  cornerRounding: lines.slice(2235, 2271).join('\n'),
  selectedPointProps: lines.slice(2271, 2342).join('\n'),
  clipPathId: lines.slice(2343, 2369).join('\n'),
  shortcuts: lines.slice(2370, 2436).join('\n'),
};

const leftSidebarJSX = `import React from 'react';
import { ASPECT_RATIOS, SHAPE_PRESETS } from '../utils/shapePresets';
import { Grid, Crosshair, ArrowUpDown, ChevronLeft, ChevronRight, Upload, Trash2, Link as LinkIcon } from 'lucide-react';

const MIN_GRID = 4;
const MAX_GRID = 50;
const GRID_DIVISIONS = 20;

export default function LeftSidebar(props) {
  const {
    themeColors, isFullscreen, toggleFullscreen, leftSidebarOpen, setLeftSidebarOpen,
    aspectRatio, setAspectRatio, handlePresetShape: loadPreset,
    snapToGrid, setSnapToGrid, snapToCenter, setSnapToCenter,
    showGrid: showGridPoints, setShowGrid: setShowGridPoints, gridSize, setGridSize,
    addMode, setAddMode, insertMode, setInsertMode,
    scaleShape, rotateShape, flipHorizontal, flipVertical,
    zoomIn, zoomOut, resetZoom, zoom, setZoom, pan, setPan,
    undo, redo, canUndo, canRedo,
    deletePoint, movePointOrder, togglePointType, toggleSymmetric, updatePoint,
    selectedPointData, points, selectedPoint,
    globalRadius, applyGlobalRadius, setGlobalRadius, resetAllRadii,
    snapToPoints, setSnapToPoints,
    canvasHeight, setCanvasHeight
  } = props;

  if (isFullscreen) return null;

  return (
    <>
      {/* Mobile overlay */}
      {!isFullscreen && leftSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setLeftSidebarOpen(false)}
        />
      )}

      <aside 
        className={\`absolute lg:static inset-y-0 left-0 z-40 w-80 flex flex-col transition-all duration-300 ease-in-out \${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-80 lg:translate-x-0'} border-r shadow-2xl lg:shadow-none h-full overflow-y-auto\`} style={{ backgroundColor: themeColors.sidebar, borderColor: themeColors.border }}
      >
      <div className="p-4 flex-1 space-y-6">
        ${blocks.shapePresets}
        ${blocks.pointTools}
        ${blocks.cornerRounding}
        ${blocks.selectedPointProps}
        ${blocks.transform}
        ${blocks.snapping}
        ${blocks.gridSettings}
        ${blocks.zoomPan}
        ${blocks.canvasSize}
        ${blocks.history}
        ${blocks.shortcuts}
      </div>
      </aside>

      <button 
        onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
        className={\`absolute top-1/2 -translate-y-1/2 z-50 p-1.5 rounded-r-xl shadow-md border border-l-0 transition-all duration-300 ease-in-out \${themeColors.buttonBg} hover:\${themeColors.buttonHover} \${themeColors.text} \${leftSidebarOpen ? 'left-80' : 'left-0'}\`} 
        style={{ borderColor: themeColors.border }}
      >
        {leftSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </>
  );
}
`;

const rightSidebarJSX = `import React from 'react';
import { ChevronLeft, ChevronRight, Upload, Trash2, Link as LinkIcon } from 'lucide-react';

export default function RightSidebar(props) {
  const {
    themeColors, isFullscreen, rightSidebarOpen, setRightSidebarOpen,
    fillColor, setFillColor,
    customBgColor, setCustomBgColor,
    previewColors, setPreviewColors, customImages, handleImageUpload, setCustomImages,
    saveProject, loadProject, exportSVG, exportPNGWithSize, exportWebP,
    codeFormat, setCodeFormat, generateShareLink, shareOnTwitter, shareOnLinkedIn, shareOnFacebook,
    clipPathId, setClipPathId, copyCode, copied
  } = props;

  if (isFullscreen) return null;

  return (
    <>
      {/* Mobile overlay */}
      {!isFullscreen && rightSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setRightSidebarOpen(false)}
        />
      )}

      <button 
        onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
        className={\`absolute top-1/2 -translate-y-1/2 z-50 p-1.5 rounded-l-xl shadow-md border border-r-0 transition-all duration-300 ease-in-out \${themeColors.buttonBg} hover:\${themeColors.buttonHover} \${themeColors.text} \${rightSidebarOpen ? 'right-80' : 'right-0'}\`} 
        style={{ borderColor: themeColors.border }}
      >
        {rightSidebarOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      <aside 
        className={\`absolute lg:static inset-y-0 right-0 z-40 w-80 flex flex-col transition-all duration-300 ease-in-out \${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:-mr-80 lg:translate-x-0'} border-l shadow-2xl lg:shadow-none h-full overflow-y-auto\`} style={{ backgroundColor: themeColors.sidebar, borderColor: themeColors.border }}
      >
        <div className="p-4 flex-1 space-y-6">
          ${blocks.previewColors}
          ${blocks.customImages}
          ${blocks.projectExport}
          ${blocks.codeFormat}
          ${blocks.share}
          ${blocks.clipPathId}
        </div>
      </aside>
    </>
  );
}
`;

fs.writeFileSync('src/components/LeftSidebar.jsx', leftSidebarJSX, 'utf8');
fs.writeFileSync('src/components/RightSidebar.jsx', rightSidebarJSX, 'utf8');
console.log('Restored sidebar blocks successfully.');
