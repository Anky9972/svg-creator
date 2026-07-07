import React from 'react';
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
        className={`absolute top-1/2 -translate-y-1/2 z-50 p-1.5 rounded-l-xl shadow-md border border-r-0 transition-all duration-300 ease-in-out ${themeColors.buttonBg} hover:${themeColors.buttonHover} ${themeColors.text} ${rightSidebarOpen ? 'right-80' : 'right-0'}`} 
        style={{ borderColor: themeColors.border }}
      >
        {rightSidebarOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      <aside 
        className={`absolute lg:static inset-y-0 right-0 z-40 w-80 flex flex-col transition-all duration-300 ease-in-out ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:-mr-80 lg:translate-x-0'} border-l shadow-2xl lg:shadow-none h-full overflow-y-auto`} style={{ backgroundColor: themeColors.sidebar, borderColor: themeColors.border }}
      >
        <div className="p-4 flex-1 space-y-6">
                    <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Preview Colors</h2>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Gradient Start</label>
                <input
                  type="color"
                  value={previewColors.gradient1}
                  onChange={(e) => setPreviewColors(prev => ({ ...prev, gradient1: e.target.value }))}
                  className={`w-full h-10 rounded-lg cursor-pointer ${themeColors.buttonBg} border ${themeColors.border}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Gradient End</label>
                <input
                  type="color"
                  value={previewColors.gradient2}
                  onChange={(e) => setPreviewColors(prev => ({ ...prev, gradient2: e.target.value }))}
                  className={`w-full h-10 rounded-lg cursor-pointer ${themeColors.buttonBg} border ${themeColors.border}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Solid Color</label>
                <input
                  type="color"
                  value={previewColors.solid}
                  onChange={(e) => setPreviewColors(prev => ({ ...prev, solid: e.target.value }))}
                  className={`w-full h-10 rounded-lg cursor-pointer ${themeColors.buttonBg} border ${themeColors.border}`}
                />
              </div>
            </div>
          </div>

          {/* Custom Image Upload */}
                    <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Custom Images</h2>
            
            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className={`px-4 py-2.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Image
                </div>
              </label>
              <p className={`text-xs ${themeColors.textSecondary} text-center`}>Upload custom images for preview</p>
            </div>
          </div>

          {/* Zoom & Pan Controls */}
                    <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Project & Export</h2>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={saveProject}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Save project as JSON"
                  title="Save project configuration"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save
                </button>
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".json"
                    onChange={loadProject}
                    className="hidden"
                  />
                  <div className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    role="button"
                    aria-label="Load project from JSON"
                    title="Load project configuration"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Load
                  </div>
                </label>
              </div>

              <div className={`text-xs ${themeColors.textSecondary} font-semibold mt-3 mb-1`}>Export as Image</div>
              <div className="flex gap-2">
                <button
                  onClick={exportSVG}
                  className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Export as SVG file"
                  title="Download as SVG"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  SVG
                </button>
                <button
                  onClick={() => exportPNGWithSize(1000)}
                  className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Export as PNG file"
                  title="Download as PNG (1000x1000)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  PNG
                </button>
                <button
                  onClick={() => exportWebP(1000)}
                  className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Export as WebP file"
                  title="Download as WebP (1000x1000)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  WebP
                </button>
              </div>

              <div className={`text-xs ${themeColors.textSecondary} mt-2 mb-1`}>Export Sizes (PNG/WebP)</div>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => exportPNGWithSize(512)}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Export PNG 512x512"
                >
                  512px
                </button>
                <button
                  onClick={() => exportPNGWithSize(1024)}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Export PNG 1024x1024"
                >
                  1024px
                </button>
                <button
                  onClick={() => exportPNGWithSize(2048)}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Export PNG 2048x2048"
                >
                  2K
                </button>
                <button
                  onClick={() => exportPNGWithSize(4096)}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Export PNG 4096x4096"
                >
                  4K
                </button>
              </div>

              <div className={`text-xs ${themeColors.textSecondary} font-semibold mt-3 mb-1`}>Copy Code</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => copyCodeFormat('svg')}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Copy SVG clip-path code"
                >
                  SVG
                </button>
                <button
                  onClick={() => copyCodeFormat('css')}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Copy CSS clip-path code"
                >
                  CSS
                </button>
                <button
                  onClick={() => copyCodeFormat('react')}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Copy React component"
                >
                  React
                </button>
                <button
                  onClick={() => copyCodeFormat('polygon')}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Copy CSS polygon"
                >
                  Polygon
                </button>
                <button
                  onClick={() => copyCodeFormat('path')}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all col-span-2`}
                  title="Copy path data only"
                >
                  {copied ? '✓ Copied!' : 'Path Data'}
                </button>
              </div>

              <p className={`text-xs ${themeColors.textSecondary} text-center mt-2`}>Export images or copy code snippets</p>
            </div>
          </div>

          {/* Transform Tools */}
                    <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Code Format</h2>
            
            <div className="space-y-2">
              <button
                onClick={() => setCodeFormat('svg')}
                className={`w-full px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  codeFormat === 'svg' 
                    ? 'bg-blue-600 text-white' 
                    : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                }`}
              >
                SVG Clip-Path
              </button>
              <button
                onClick={() => setCodeFormat('css')}
                className={`w-full px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  codeFormat === 'css' 
                    ? 'bg-blue-600 text-white' 
                    : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                }`}
              >
                CSS Polygon
              </button>
              <button
                onClick={() => setCodeFormat('react')}
                className={`w-full px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  codeFormat === 'react' 
                    ? 'bg-blue-600 text-white' 
                    : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                }`}
              >
                React Component
              </button>
            </div>
          </div>

          {/* Share Link */}
                    <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Share</h2>
            
            <div className="space-y-2">
              <button
                onClick={generateShareLink}
                className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {copied ? '✓ Link Copied!' : 'Copy Share Link'}
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={shareOnTwitter}
                  className="px-3 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1"
                  title="Share on Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="hidden sm:inline">Twitter</span>
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="px-3 py-2 bg-[#0077B5] hover:bg-[#006399] rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1"
                  title="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="hidden sm:inline">LinkedIn</span>
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="px-3 py-2 bg-[#1877F2] hover:bg-[#166fe5] rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1"
                  title="Share on Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="hidden sm:inline">Facebook</span>
                </button>
              </div>
            </div>
            <p className={`text-xs ${themeColors.textSecondary} text-center mt-2`}>Share your design with others</p>
          </div>

          {/* Canvas Settings */}
                    {/* ClipPath ID */}
          <div className="mb-5">
            <label htmlFor="clippath-id" className={`block text-xs ${themeColors.textSecondary} mb-2`}>ClipPath ID</label>
            <input
              id="clippath-id"
              type="text"
              value={clipPathId}
              onChange={(e) => setClipPathId(e.target.value.replace(/\s/g, ''))}
              className={`w-full px-4 py-2.5 ${themeColors.inputBg} rounded-xl text-sm border ${themeColors.border} focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              placeholder="customClip"
              aria-label="ClipPath ID for SVG element"
            />
          </div>

          {/* Copy Button */}
          <button
            onClick={copyCode}
            className={`w-full px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              copied 
                ? 'bg-emerald-600' 
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
            aria-label={copied ? 'SVG code copied to clipboard' : 'Copy SVG code to clipboard'}
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy SVG Code'}
          </button>
        </div>
      </aside>
    </>
  );
}
