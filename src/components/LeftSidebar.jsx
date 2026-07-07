import React from 'react';
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
        className={`absolute lg:static inset-y-0 left-0 z-40 w-80 flex flex-col transition-all duration-300 ease-in-out ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-80 lg:translate-x-0'} border-r shadow-2xl lg:shadow-none h-full overflow-y-auto`} style={{ backgroundColor: themeColors.sidebar, borderColor: themeColors.border }}
      >
      <div className="p-4 flex-1 space-y-6">
                  <div className="mb-5">
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Shape Presets</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(SHAPE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => loadPreset(key)}
                  className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-medium transition-all duration-200`}
                  aria-label={`Load ${preset.name} preset`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Undo/Redo Controls */}
                  <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Point Tools</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setAddMode(!addMode)
                  if (!addMode) {
                    setInsertAfterPoint(points[points.length - 1]?.id || null)
                  }
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  addMode 
                    ? 'bg-emerald-600 text-white' 
                    : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                }`}
              >
                {addMode ? 'Γ£ô Add Mode ON' : '+ Enable Add Mode'}
              </button>
              
              {addMode && (
                <>
                  <div className={`text-xs ${themeColors.textSecondary} mb-2`}>Insert Mode:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInsertMode('smart')}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        insertMode === 'smart' 
                          ? 'bg-emerald-600 text-white' 
                          : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                      }`}
                    >
                      ≡ƒÄ» Smart Edge
                    </button>
                    <button
                      onClick={() => setInsertMode('after')}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        insertMode === 'after' 
                          ? 'bg-emerald-600 text-white' 
                          : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                      }`}
                    >
                      Γ₧í∩╕Å After Point
                    </button>
                  </div>
                  
                  <div className="text-xs bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    {insertMode === 'smart' ? (
                      <>
                        <p className="font-semibold text-emerald-400 mb-1">Smart Edge Mode</p>
                        <p className="text-emerald-300/80">Click anywhere - point will be inserted on the nearest edge of the shape automatically!</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-emerald-400 mb-1">After Point Mode</p>
                        <p className="text-emerald-300/80">Click a point first, then click canvas to insert after it.</p>
                      </>
                    )}
                  </div>
                </>
              )}
              
              <button
                onClick={deletePoint}
                disabled={!selectedPoint || points.length <= 3}
                className={`w-full px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-semibold transition-all duration-200`}
              >
                Delete Selected Point
              </button>

              {selectedPoint && (
                <div className="flex gap-2">
                  <button
                    onClick={() => movePointOrder('up')}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-medium transition-all`}
                  >
                    Γåæ Move Up
                  </button>
                  <button
                    onClick={() => movePointOrder('down')}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-medium transition-all`}
                  >
                    Γåô Move Down
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Corner Rounding */}
                  <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Corner Rounding</h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>
                  Global Radius: <span className="text-amber-400 font-medium">{(globalRadius * 100).toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.3"
                  step="0.005"
                  value={globalRadius}
                  onChange={(e) => setGlobalRadius(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#252a36] rounded-full  cursor-pointer accent-amber-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={applyGlobalRadius}
                  className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs font-semibold transition-all duration-200"
                >
                  Apply to All
                </button>
                <button
                  onClick={resetAllRadii}
                  className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-medium transition-all`}
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

                  {/* Selected Point Properties */}
          {selectedPointData && (
            <div className="mb-5 p-4 bg-[#1a2332] rounded-xl border border-blue-500/30">
              <h2 className="text-xs font-semibold mb-3 text-blue-400 uppercase tracking-wider">
                Point #{points.findIndex(p => p.id === selectedPoint) + 1}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs ${themeColors.textSecondary} mb-1.5`}>X Position</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedPointData.x.toFixed(2)}
                      onChange={(e) => updatePoint('x', Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)))}
                      className={`w-full px-3 py-2 ${themeColors.inputBg} rounded-lg text-xs border ${themeColors.border} focus:border-blue-500 focus:outline-none transition-all`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs ${themeColors.textSecondary} mb-1.5`}>Y Position</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedPointData.y.toFixed(2)}
                      onChange={(e) => updatePoint('y', Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)))}
                      className={`w-full px-3 py-2 ${themeColors.inputBg} rounded-lg text-xs border ${themeColors.border} focus:border-blue-500 focus:outline-none transition-all`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>
                    Point Radius: <span className="text-purple-400 font-medium">{(selectedPointData.radius * 100).toFixed(0)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.3"
                    step="0.005"
                    value={selectedPointData.radius}
                    onChange={(e) => updatePoint('radius', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#252a36] rounded-full  cursor-pointer accent-purple-500"
                  />
                </div>
                
                <button
                  onClick={togglePointType}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    selectedPointData.type === 'smooth'
                      ? 'bg-purple-600 text-white'
                      : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                  }`}
                >
                  Type: {selectedPointData.type === 'smooth' ? 'ΓùÅ Smooth' : 'Γûá Corner'}
                </button>
              </div>
            </div>
          )}

          {!selectedPointData && !addMode && (
            <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
              <p className={`text-xs ${themeColors.textSecondary} text-center`}>
                Click a point to select and edit it
              </p>
            </div>
          )}
                  <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Transform</h2>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Scale</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => scaleShape(0.9)}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Scale down 10%"
                  >
                    90%
                  </button>
                  <button
                    onClick={() => scaleShape(0.95)}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Scale down 5%"
                  >
                    95%
                  </button>
                  <button
                    onClick={() => scaleShape(1.05)}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Scale up 5%"
                  >
                    105%
                  </button>
                  <button
                    onClick={() => scaleShape(1.1)}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Scale up 10%"
                  >
                    110%
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Rotate</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => rotateShape(-90)}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all flex items-center justify-center`}
                    title="Rotate 90┬░ counter-clockwise"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => rotateShape(-45)}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Rotate 45┬░ counter-clockwise"
                  >
                    -45┬░
                  </button>
                  <button
                    onClick={() => rotateShape(45)}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Rotate 45┬░ clockwise"
                  >
                    45┬░
                  </button>
                  <button
                    onClick={() => rotateShape(90)}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all flex items-center justify-center`}
                    title="Rotate 90┬░ clockwise"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Flip</label>
                <div className="flex gap-2">
                  <button
                    onClick={flipHorizontal}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2`}
                    title="Flip horizontally"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Horizontal
                  </button>
                  <button
                    onClick={flipVertical}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2`}
                    title="Flip vertically"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Vertical
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Customization */}
                  <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Snapping</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-xs cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={(e) => setSnapToGrid(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 ${themeColors.buttonBg} rounded-full peer-checked:bg-blue-600 transition-all duration-200`}></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span className={`${themeColors.text} group-hover:text-white transition-colors`}>Snap to Grid</span>
              </label>
              
              <label className="flex items-center gap-3 text-xs cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={snapToPoints}
                    onChange={(e) => setSnapToPoints(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 ${themeColors.buttonBg} rounded-full peer-checked:bg-blue-600 transition-all duration-200`}></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span className={`${themeColors.text} group-hover:text-white transition-colors`}>Snap to Points</span>
              </label>
              
              <label className="flex items-center gap-3 text-xs cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={snapToCenter}
                    onChange={(e) => setSnapToCenter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 ${themeColors.buttonBg} rounded-full peer-checked:bg-blue-600 transition-all duration-200`}></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span className={`${themeColors.text} group-hover:text-white transition-colors`}>Snap to Center</span>
              </label>
            </div>
          </div>

          {/* Code Format Options */}
                  <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Grid Settings</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-xs cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={(e) => setSnapToGrid(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Snap to grid"
                  />
                  <div className={`w-9 h-5 ${themeColors.buttonBg} rounded-full peer-checked:bg-blue-600 transition-all duration-200`}></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span className={`${themeColors.text} group-hover:text-white transition-colors`}>Snap to Grid</span>
              </label>
              
              <label className="flex items-center gap-3 text-xs cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showGridPoints}
                    onChange={(e) => setShowGridPoints(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 ${themeColors.buttonBg} rounded-full peer-checked:bg-blue-600 transition-all duration-200`}></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span className={`${themeColors.text} group-hover:text-white transition-colors`}>Show Grid Points</span>
              </label>
              
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Grid Divisions: <span className={themeColors.text}>{gridSize}×{gridSize}</span></label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setGridSize(prev => Math.max(MIN_GRID, prev - 5))}
                    className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-bold transition-all`}
                  >
                    -5
                  </button>
                  <button
                    onClick={() => setGridSize(prev => Math.max(MIN_GRID, prev - 1))}
                    className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-bold transition-all`}
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min={MIN_GRID}
                    max={MAX_GRID}
                    value={gridSize}
                    onChange={(e) => setGridSize(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-[#252a36] rounded-full  cursor-pointer accent-blue-500"
                  />
                  <button
                    onClick={() => setGridSize(prev => Math.min(MAX_GRID, prev + 1))}
                    className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-bold transition-all`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => setGridSize(prev => Math.min(MAX_GRID, prev + 5))}
                    className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-bold transition-all`}
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Points Mode */}
                  <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Zoom & Pan</h2>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Zoom: {(zoom * 100).toFixed(0)}%</label>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={zoomOut}
                    disabled={zoom <= 0.5}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} disabled:opacity-40 disabled:cursor-not-allowed border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.25"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-[#252a36] rounded-full  cursor-pointer accent-blue-500"
                  />
                  <button
                    onClick={zoomIn}
                    disabled={zoom >= 4}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} disabled:opacity-40 disabled:cursor-not-allowed border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                onClick={resetZoom}
                className={`w-full px-4 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
              >
                Reset View
              </button>
            </div>
          </div>

          {/* Snapping Options */}
                  <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Canvas Size</h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {Object.keys(ASPECT_RATIOS).map((key) => (
                    <button
                      key={key}
                      onClick={() => setAspectRatio(key)}
                      className={`px-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        aspectRatio === key 
                          ? 'bg-blue-600 text-white' 
                          : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="canvas-height" className={`block text-xs ${themeColors.textSecondary} mb-2`}>Height: <span className={themeColors.text}>{canvasHeight}px</span></label>
                <input
                  id="canvas-height"
                  type="range"
                  min="300"
                  max="800"
                  step="50"
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#252a36] rounded-full  cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Canvas height in pixels"
                />
              </div>
              
              <button
                onClick={toggleFullscreen}
                className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label={isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>

          {/* Grid Settings */}
                  <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>History</h2>
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`flex-1 px-4 py-2.5 ${themeColors.buttonBg} ${themeColors.buttonHover} disabled:opacity-40 disabled:cursor-not-allowed border ${themeColors.border} rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
                aria-label="Undo last action"
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`flex-1 px-4 py-2.5 ${themeColors.buttonBg} ${themeColors.buttonHover} disabled:opacity-40 disabled:cursor-not-allowed border ${themeColors.border} rounded-xl text-xs  font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
                aria-label="Redo last undone action"
                title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                </svg>
                Redo
              </button>
            </div>
          </div>

          {/* Save/Load & Export */}
                  {/* Keyboard Shortcuts */}
          <div className={`mt-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>⌘ Shortcuts</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Undo</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>Ctrl+Z</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Redo</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>Ctrl+Y</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Add Mode</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>A</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Snap Grid</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>S</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Show Grid</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>G</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Toggle Type</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>T</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Delete Point</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>Del</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Deselect</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>Esc</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Next Point</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>Tab</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Prev Point</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">Shift+Tab</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Move Point</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">Arrows</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Reorder</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">Ctrl+Up/Down</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Grid +/-</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">+ -</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Fullscreen</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">F</kbd>
              </div>
              <div className="flex justify-between items-center col-span-2">
                <span className="text-slate-500">Copy Code</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">Ctrl+C</kbd>
              </div>
            </div>
          </div>
      </div>
      </aside>

      <button 
        onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
        className={`absolute top-1/2 -translate-y-1/2 z-50 p-1.5 rounded-r-xl shadow-md border border-l-0 transition-all duration-300 ease-in-out ${themeColors.buttonBg} hover:${themeColors.buttonHover} ${themeColors.text} ${leftSidebarOpen ? 'left-80' : 'left-0'}`} 
        style={{ borderColor: themeColors.border }}
      >
        {leftSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </>
  );
}
