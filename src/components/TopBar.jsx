import React from 'react';
import { Undo2, Redo2, Maximize, Save, Image, Copy, Share2, Sun, Moon, Menu, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopBar(props) {
  const {
    themeColors, theme, toggleTheme,
    leftSidebarOpen, setLeftSidebarOpen, rightSidebarOpen, setRightSidebarOpen,
    user, authLoading, email, setEmail, password, setPassword,
    isSignUp, setIsSignUp, handleEmailAuth, authError, logout, loginWithGoogle,
    saveProjectToCloud, undo, redo, canUndo, canRedo,
    toggleFullscreen, isFullscreen, exportSVG, exportPNGWithSize,
    generateShareLink, copyCode, copied
  } = props;

  return (
    <header className={`h-16 flex items-center justify-between px-4 border-b z-50 relative ${isFullscreen ? 'hidden' : ''}`} style={{ backgroundColor: themeColors.sidebar, borderColor: themeColors.border }}>
      <div className="flex items-center gap-4">
        <h1 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hidden sm:block`}>
          SVGCanvas
        </h1>
        <button onClick={toggleTheme} className={`ml-2 p-2 rounded-xl transition-all active:scale-95 ${themeColors.buttonBg} hover:${themeColors.buttonHover}`}>
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
        
        {/* History */}
        <div className="flex gap-1 ml-4 border-l pl-4" style={{ borderColor: themeColors.border }}>
          <button onClick={undo} disabled={!canUndo} className={`p-2 rounded-lg transition-all ${canUndo ? themeColors.buttonBg + ' hover:' + themeColors.buttonHover + ' ' + themeColors.text : 'opacity-50 cursor-not-allowed ' + themeColors.textSecondary} active:scale-95 active:shadow-inner`} title="Undo (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={!canRedo} className={`p-2 rounded-lg transition-all ${canRedo ? themeColors.buttonBg + ' hover:' + themeColors.buttonHover + ' ' + themeColors.text : 'opacity-50 cursor-not-allowed ' + themeColors.textSecondary} active:scale-95 active:shadow-inner`} title="Redo (Ctrl+Y)">
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Export Options */}
        <button onClick={exportSVG} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${themeColors.buttonBg} hover:${themeColors.buttonHover} ${themeColors.text} active:scale-95 active:shadow-inner`} title="Download SVG">
          <Save className="w-4 h-4" />
          <span className="hidden md:inline">SVG</span>
        </button>
        <button onClick={() => exportPNGWithSize()} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${themeColors.buttonBg} hover:${themeColors.buttonHover} ${themeColors.text} active:scale-95 active:shadow-inner`} title="Download PNG">
          <Image className="w-4 h-4" />
          <span className="hidden md:inline">PNG</span>
        </button>
        <button onClick={copyCode} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${copied ? 'bg-emerald-600 text-white' : themeColors.buttonBg + ' hover:' + themeColors.buttonHover + ' ' + themeColors.text} active:scale-95 active:shadow-inner`} title="Copy SVG Code">
          <Copy className="w-4 h-4" />
          <span className="hidden md:inline">{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <div className="w-px h-6 bg-slate-700 mx-2"></div>

        {/* Cloud & User */}
        {!authLoading && !user && (
          <div className="flex items-center gap-2 group relative">
            <button className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all bg-blue-600 hover:bg-blue-500 text-white active:scale-95 active:shadow-inner`}>
              Login to Save
            </button>
            <div className={`absolute top-full right-0 mt-2 p-4 w-64 rounded-xl shadow-2xl border hidden group-hover:block ${themeColors.sidebarSection} ${themeColors.border} z-50`}>
              <form onSubmit={handleEmailAuth} className="mb-4">
                <div className="space-y-3">
                  <div>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={`w-full px-3 py-2 ${themeColors.inputBg} rounded-lg text-xs border ${themeColors.border} focus:border-blue-500 focus:outline-none`} required />
                  </div>
                  <div>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className={`w-full px-3 py-2 ${themeColors.inputBg} rounded-lg text-xs border ${themeColors.border} focus:border-blue-500 focus:outline-none`} required />
                  </div>
                  {authError && <p className="text-red-400 text-xs">{authError}</p>}
                  <button type="submit" className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors">
                    {isSignUp ? 'Sign Up' : 'Login'}
                  </button>
                </div>
                <div className="mt-2 text-center">
                  <button type="button" onClick={() => setIsSignUp(!isSignUp)} className={`text-xs ${themeColors.textSecondary} hover:text-blue-400`}>
                    {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${themeColors.border}`}></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className={`px-2 ${themeColors.sidebarSection} ${themeColors.textSecondary}`}>Or continue with</span>
                </div>
              </div>
              <button onClick={loginWithGoogle} className="w-full mb-2 px-3 py-2 bg-white text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 active:scale-95">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Sign in with Google
              </button>
            </div>
          </div>
        )}
        
        {user && (
          <div className="flex items-center gap-2">
            <button onClick={saveProjectToCloud} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold active:scale-95">Save Cloud</button>
            <Link to="/community" className={`px-3 py-1.5 ${themeColors.buttonBg} hover:${themeColors.buttonHover} ${themeColors.text} rounded-lg text-xs font-semibold active:scale-95`}>My Projects</Link>
            <button onClick={logout} className={`px-3 py-1.5 ${themeColors.buttonBg} hover:${themeColors.buttonHover} text-red-400 rounded-lg text-xs font-semibold active:scale-95`}>Logout</button>
          </div>
        )}

        <div className="w-px h-6 bg-slate-700 mx-2"></div>

        <button onClick={toggleFullscreen} className={`p-2 rounded-lg transition-all ${themeColors.buttonBg} hover:${themeColors.buttonHover} ${themeColors.text} active:scale-95 active:shadow-inner`} title="Fullscreen (F)">
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
