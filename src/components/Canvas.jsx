import React from 'react';
import KeyframeGenerator from './KeyframeGenerator';
import { ASPECT_RATIOS } from '../utils/shapePresets';
import Footer from '../Footer';

export default function Canvas(props) {
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
    applyGlobalRadius, applySnapping, generateShareLink, shareOnTwitter, shareOnLinkedIn, shareOnFacebook, copyCodeFormat,
    saveProject, loadProject
} = props;

  const ar = ASPECT_RATIOS[aspectRatio];

  return (
            <section className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-auto ${themeColors.mainBg} ${isFullscreen ? 'p-4!' : ''}`} aria-label="Main Editor Canvas">
              <div className={`mx-auto ${isFullscreen ? 'max-w-full h-full' : 'max-w-5xl'}`}>
                {/* Canvas Container */}
                <div 
                  ref={canvasContainerRef}
                  className={`${themeColors.cardBg} rounded-2xl p-3 sm:p-5 mb-6 sm:mb-8 border ${themeColors.border} ${isFullscreen ? 'h-full flex flex-col' : ''}`}
                >
                  <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-2">
                    <h2 className={`text-sm font-semibold ${themeColors.text}`}>
                      Editor Canvas 
                      <span className={`ml-2 ${themeColors.textSecondary} font-normal`}>({aspectRatio})</span>
                    </h2>
                    <div className="flex gap-5 text-xs">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className={themeColors.textSecondary}>Corner</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                        <span className={themeColors.textSecondary}>Smooth</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-slate-400">Selected</span>
                      </span>
                      {addMode && insertMode === 'after' && (
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                          <span className="text-slate-400">Insert After</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className={`relative bg-[#0a0b0f] rounded-xl overflow-hidden border-2 border-[#252a36] mx-auto ${isFullscreen ? 'flex-1' : ''}`}
                    style={{ 
                      aspectRatio: `${ar.width}/${ar.height}`,
                      maxHeight: isFullscreen ? 'calc(100vh - 120px)' : `${canvasHeight}px`,
                      width: isFullscreen ? 'auto' : '100%',
                      maxWidth: '100%'
                    }}
                  >
                    <svg
                      ref={svgRef}
                      viewBox="0 0 1 1"
                      className={`w-full h-full ${addMode ? 'cursor-crosshair' : 'cursor-default'}`}
                      preserveAspectRatio="xMidYMid meet"
                      onClick={handleCanvasClick}
                      role="application"
                      aria-label="SVGCanvas editor canvas. Use arrow keys to move selected point, Tab to select next point."
                    >
                      {/* Background */}
                      <rect width="1" height="1" fill="#0a0a0f" />
                      
                      {/* Grid lines */}
                      {Array.from({ length: gridSize + 1 }).map((_, i) => (
                        <g key={`grid-${i}`}>
                          <line
                            x1={i / gridSize}
                            y1="0"
                            x2={i / gridSize}
                            y2="1"
                            stroke={i % 5 === 0 ? '#2d3748' : '#1a202c'}
                            strokeWidth={i % 5 === 0 ? '0.003' : '0.001'}
                          />
                          <line
                            x1="0"
                            y1={i / gridSize}
                            x2="1"
                            y2={i / gridSize}
                            stroke={i % 5 === 0 ? '#2d3748' : '#1a202c'}
                            strokeWidth={i % 5 === 0 ? '0.003' : '0.001'}
                          />
                        </g>
                      ))}
                      
                      {/* Center lines */}
                      <line x1="0.5" y1="0" x2="0.5" y2="1" stroke="#3b82f6" strokeWidth="0.002" opacity="0.3" />
                      <line x1="0" y1="0.5" x2="1" y2="0.5" stroke="#3b82f6" strokeWidth="0.002" opacity="0.3" />
                      
                      {/* Grid intersection points */}
                      {showGridPoints && gridPoints.map((gp, idx) => (
                        <circle
                          key={`gp-${idx}`}
                          cx={gp.x}
                          cy={gp.y}
                          r={gp.isMajor ? '0.012' : gp.isEdge ? '0.008' : '0.006'}
                          fill={gp.isMajor ? '#4a5568' : '#2d3748'}
                          className={addMode ? 'cursor-pointer hover:fill-green-400 transition-colors duration-150' : ''}
                          style={{ pointerEvents: addMode ? 'auto' : 'none' }}
                          onClick={(e) => {
                            if (addMode) {
                              e.stopPropagation()
                              handleAddPoint(gp.x, gp.y)
                            }
                          }}
                        />
                      ))}
                      
                      {/* Shape fill */}
                      <path
                        d={pathD}
                        fill="rgba(59, 130, 246, 0.15)"
                        stroke="none"
                      />
                      
                      {/* Shape outline */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="0.005"
                      />
                      
                      {/* Edge highlight when in smart add mode */}
                      {addMode && insertMode === 'smart' && (
                        points.map((point, index) => {
                          const nextPoint = points[(index + 1) % points.length]
                          return (
                            <line
                              key={`edge-${index}`}
                              x1={point.x}
                              y1={point.y}
                              x2={nextPoint.x}
                              y2={nextPoint.y}
                              stroke="#22c55e"
                              strokeWidth="0.008"
                              opacity="0.4"
                              strokeLinecap="round"
                            />
                          )
                        })
                      )}
                      
                      {/* Connection lines between points (dashed) */}
                      {points.map((point, index) => {
                        const nextPoint = points[(index + 1) % points.length]
                        return (
                          <line
                            key={`conn-${index}`}
                            x1={point.x}
                            y1={point.y}
                            x2={nextPoint.x}
                            y2={nextPoint.y}
                            stroke="#60a5fa"
                            strokeWidth="0.002"
                            strokeDasharray="0.01 0.006"
                            opacity="0.5"
                          />
                        )
                      })}
                      
                      {/* Points */}
                      {points.map((point, index) => {
                        const isSelected = selectedPoint === point.id
                        const isInsertPoint = insertAfterPoint === point.id && insertMode === 'after'
                        const radius = point.radius + globalRadius
                        
                        return (
                          <g key={point.id}>
                            {/* Radius indicator circle */}
                            {radius > 0 && (
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r={Math.min(radius, 0.15)}
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="0.002"
                                strokeDasharray="0.008 0.004"
                                opacity="0.6"
                              />
                            )}
                            
                            {/* Point number badge */}
                            <g transform={`translate(${point.x + 0.025}, ${point.y - 0.03})`}>
                              <rect
                                x="-0.012"
                                y="-0.016"
                                width="0.024"
                                height="0.022"
                                rx="0.004"
                                fill="#1f2937"
                                stroke="#4b5563"
                                strokeWidth="0.001"
                              />
                              <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#9ca3af"
                                fontSize="0.022"
                                fontFamily="system-ui"
                                y="0.002"
                              >
                                {index + 1}
                              </text>
                            </g>
                            
                            {/* Point outer glow for selected */}
                            {isSelected && (
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="0.035"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="0.004"
                                opacity="0.5"
                              />
                            )}
                            
                            {/* Insert indicator */}
                            {addMode && isInsertPoint && (
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="0.04"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="0.003"
                                strokeDasharray="0.008 0.004"
                              />
                            )}
                            
                            {/* Main point handle */}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="0.022"
                              fill={
                                isSelected 
                                  ? '#3b82f6' 
                                  : point.type === 'smooth' 
                                    ? '#a855f7' 
                                    : point.type === 'bezier'
                                      ? '#10b981'
                                      : '#ef4444'
                              }
                              stroke="#fff"
                              strokeWidth="0.004"
                              className="cursor-move transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              onMouseDown={(e) => handlePointMouseDown(e, point.id)}
                              onTouchStart={(e) => handlePointTouchStart(e, point.id)}
                              tabIndex={0}
                              role="button"
                              aria-label={`Point ${index + 1}: ${point.type === 'smooth' ? 'Smooth' : 'Corner'} point at position ${point.x.toFixed(2)}, ${point.y.toFixed(2)}`}
                            />
    
                            {/* Bezier Handles */}
                            {isSelected && point.type === 'bezier' && (
                              <>
                                {point.handleIn && (
                                  <g>
                                    <line
                                      x1={point.x} y1={point.y}
                                      x2={point.x + point.handleIn.x} y2={point.y + point.handleIn.y}
                                      stroke="#10b981" strokeWidth="0.003" strokeDasharray="0.01 0.005"
                                    />
                                    <circle
                                      cx={point.x + point.handleIn.x} cy={point.y + point.handleIn.y}
                                      r="0.015" fill="#fff" stroke="#10b981" strokeWidth="0.004"
                                      className="cursor-pointer"
                                      onMouseDown={(e) => handlePointMouseDown(e, point.id, 'handleIn')}
                                      onTouchStart={(e) => handlePointTouchStart(e, point.id, 'handleIn')}
                                    />
                                  </g>
                                )}
                                {point.handleOut && (
                                  <g>
                                    <line
                                      x1={point.x} y1={point.y}
                                      x2={point.x + point.handleOut.x} y2={point.y + point.handleOut.y}
                                      stroke="#10b981" strokeWidth="0.003" strokeDasharray="0.01 0.005"
                                    />
                                    <circle
                                      cx={point.x + point.handleOut.x} cy={point.y + point.handleOut.y}
                                      r="0.015" fill="#fff" stroke="#10b981" strokeWidth="0.004"
                                      className="cursor-pointer"
                                      onMouseDown={(e) => handlePointMouseDown(e, point.id, 'handleOut')}
                                      onTouchStart={(e) => handlePointTouchStart(e, point.id, 'handleOut')}
                                    />
                                  </g>
                                )}
                              </>
                            )}
                            
                            {/* Corner/Smooth indicator inside point */}
                            {point.type === 'smooth' ? (
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="0.008"
                                fill="#fff"
                                pointerEvents="none"
                              />
                            ) : (
                              <rect
                                x={point.x - 0.006}
                                y={point.y - 0.006}
                                width="0.012"
                                height="0.012"
                                fill="#fff"
                                pointerEvents="none"
                              />
                            )}
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                  
                  {/* Coordinate labels */}
                  <div className="mt-3 flex justify-between text-xs text-slate-600 px-1">
                    <span className="font-mono">0,0</span>
                    <span className="text-slate-500">
                      {gridSize}×{gridSize} grid {snapToGrid && '• Snap ON'}
                      {addMode && ` • ${insertMode === 'smart' ? 'Smart Edge' : 'After Point'} mode`}
                    </span>
                    <span className="font-mono">1,1</span>
                  </div>
                </div>
    
                {/* Preview Section */}
                {!isFullscreen && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8">
                      {/* Live Preview */}
                      <div className={`${themeColors.cardBg} rounded-2xl p-4 sm:p-5 border ${themeColors.border}`}>
                        <h2 className={`text-sm font-semibold mb-4 ${themeColors.text}`}>Live Preview</h2>
                        
                        <svg width="0" height="0">
                          <defs>
                            <clipPath id="livePreview" clipPathUnits="objectBoundingBox">
                              <path d={pathD} />
                            </clipPath>
                          </defs>
                        </svg>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className={`text-xs ${themeColors.textSecondary} mb-2`}>Solid 1</p>
                            <div
                              className="aspect-square rounded-xl"
                              style={{ 
                                clipPath: 'url(#livePreview)',
                                backgroundColor: previewColors.solid1
                              }}
                            />
                          </div>
                          <div>
                            <p className={`text-xs ${themeColors.textSecondary} mb-2`}>Solid 2</p>
                            <div
                              className="aspect-square rounded-xl"
                              style={{ 
                                clipPath: 'url(#livePreview)',
                                backgroundColor: previewColors.solid2
                              }}
                            />
                          </div>
                          {customImages.map((img, idx) => (
                            <div key={idx}>
                              <p className={`text-xs ${themeColors.textSecondary} mb-2`}>Image {idx + 1}</p>
                              <div
                                className="aspect-square bg-cover bg-center rounded-xl"
                                style={{ 
                                  clipPath: 'url(#livePreview)',
                                  backgroundImage: `url(${img})`
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
    
                      {/* Code Output */}
                      <div className={`${themeColors.cardBg} rounded-2xl p-4 sm:p-5 border ${themeColors.border}`}>
                        <div className="flex justify-between items-center mb-4">
                          <h2 className={`text-sm font-semibold ${themeColors.text}`}>Generated Code ({codeFormat.toUpperCase()})</h2>
                          <button
                            onClick={copyCode}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                              copied 
                                ? 'bg-emerald-600' 
                                : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                            }`}
                          >
                            {copied ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className={`${themeColors.inputBg} rounded-xl p-4 overflow-auto text-xs max-h-80 border ${themeColors.border}`}>
                          <code className="text-emerald-400 whitespace-pre-wrap break-all font-mono">
                            {generateCodeInFormat()}
                          </code>
                        </pre>
                        <KeyframeGenerator points={props.points} globalRadius={props.globalRadius} />
                      </div>
                    </div>
    
                    {/* Animation Preview */}
                    <div className={`${themeColors.cardBg} rounded-2xl p-4 sm:p-5 border ${themeColors.border} mb-6 sm:mb-8`}>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-sm font-semibold ${themeColors.text}`}>Animation Preview</h2>
                        <button
                          onClick={() => setShowAnimation(!showAnimation)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            showAnimation 
                              ? 'bg-purple-600 text-white' 
                              : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                          }`}
                        >
                          {showAnimation ? '⏸ Pause' : '▶ Play'}
                        </button>
                      </div>
                      
                      <svg width="0" height="0">
                        <defs>
                          <clipPath id="animPreview" clipPathUnits="objectBoundingBox">
                            <path d={pathD} />
                          </clipPath>
                        </defs>
                      </svg>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className={`text-xs ${themeColors.textSecondary} mb-2 text-center`}>Scale</p>
                          <div
                            className={`aspect-square rounded-xl ${showAnimation ? 'animate-pulse' : ''}`}
                            style={{ 
                              clipPath: 'url(#animPreview)',
                              backgroundColor: '#ec4899', // Pink
                              animation: showAnimation ? 'scale-anim 2s ease-in-out infinite' : 'none'
                            }}
                          />
                        </div>
                        <div>
                          <p className={`text-xs ${themeColors.textSecondary} mb-2 text-center`}>Rotate</p>
                          <div
                            className="aspect-square rounded-xl"
                            style={{ 
                              clipPath: 'url(#animPreview)',
                              backgroundColor: '#0ea5e9', // Sky blue
                              animation: showAnimation ? 'rotate-anim 3s linear infinite' : 'none'
                            }}
                          />
                        </div>
                        <div>
                          <p className={`text-xs ${themeColors.textSecondary} mb-2 text-center`}>Fade</p>
                          <div
                            className="aspect-square rounded-xl"
                            style={{ 
                              clipPath: 'url(#animPreview)',
                              backgroundColor: '#10b981', // Emerald
                              animation: showAnimation ? 'fade-anim 2s ease-in-out infinite' : 'none'
                            }}
                          />
                        </div>
                      </div>
                      
                      <style>{`
                        @keyframes scale-anim {
                          0%, 100% { transform: scale(1); }
                          50% { transform: scale(1.1); }
                        }
                        @keyframes rotate-anim {
                          from { transform: rotate(0deg); }
                          to { transform: rotate(360deg); }
                        }
                        @keyframes fade-anim {
                          0%, 100% { opacity: 1; }
                          50% { opacity: 0.5; }
                        }
                      `}</style>
                    </div>
    
                    {/* Path Data */}
                    <div className={`${themeColors.cardBg} rounded-2xl p-4 sm:p-5 border ${themeColors.border}`}>
                      <h2 className={`text-sm font-semibold mb-3 ${themeColors.text}`}>Raw Path Data</h2>
                      <div className={`${themeColors.inputBg} rounded-xl p-4 overflow-x-auto border ${themeColors.border}`}>
                        <code className="text-xs text-blue-400 break-all font-mono">{pathD}</code>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Footer themeColors={themeColors} />
            </section>
  );
}
