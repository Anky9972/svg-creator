import fs from 'fs';

// 1. Fix App.jsx
let app = fs.readFileSync('src/App.jsx', 'utf8');
if (!app.includes('import TopBar')) {
  app = app.replace("import Canvas from './components/Canvas';", "import TopBar from './components/TopBar';\nimport LeftSidebar from './components/LeftSidebar';\nimport RightSidebar from './components/RightSidebar';\nimport Canvas from './components/Canvas';");
}

const oldLayout = /<main className=\{`min-h-screen transition-colors duration-300`\} style=\{\{ backgroundColor:themeColors\.bg, color: themeColors\.text \}\}>\s*<h1 className="sr-only">Free Clip Path Editor Online & SVG Path Generator<\/h1>\s*<div className="flex h-screen relative">[\s\S]*?<\/div>\s*<\/main>/;

const newLayout = `<main className={\`h-screen flex flex-col transition-colors duration-300 font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden relative\`} style={{ backgroundColor: themeColors.bg, color: themeColors.text }}>
      <TopBar {...appCtx} />
      <div className="flex flex-1 overflow-hidden relative">
        <LeftSidebar {...appCtx} />
        <Canvas {...appCtx} />
        <RightSidebar {...appCtx} />
      </div>
    </main>`;

if (oldLayout.test(app)) {
  app = app.replace(oldLayout, newLayout);
}

fs.writeFileSync('src/App.jsx', app);

// 2. Fix TopBar.jsx
let topbar = fs.readFileSync('src/components/TopBar.jsx', 'utf8');

// Replace className with style
topbar = topbar.replace(
  /<header className=\{`h-16 flex items-center justify-between px-4 border-b z-40 relative \$\{themeColors\.sidebar\} \$\{themeColors\.border\} \$\{isFullscreen \? 'hidden' : ''\}`\}>/,
  "<header className={`h-16 flex items-center justify-between px-4 border-b z-40 relative ${isFullscreen ? 'hidden' : ''}`} style={{ backgroundColor: themeColors.sidebar, borderColor: themeColors.border }}>"
);

// Add Sun/Moon imports if not there
if (!topbar.includes('Sun, Moon')) {
  topbar = topbar.replace(
    "import { Undo2, Redo2, Maximize, Save, Image, Copy, Share2 } from 'lucide-react';",
    "import { Undo2, Redo2, Maximize, Save, Image, Copy, Share2, Sun, Moon } from 'lucide-react';"
  );
}

// Add the toggle theme button
if (!topbar.includes('toggleTheme')) {
  topbar = topbar.replace(
    `<h1 className={\`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500\`}>
          SVGCanvas
        </h1>`,
    `<h1 className={\`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500\`}>
          SVGCanvas
        </h1>
        <button onClick={toggleTheme} className={"ml-2 p-2 rounded-xl transition-all active:scale-95 " + themeColors.buttonBg + " hover:" + themeColors.buttonHover}>
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>`
  );
}

fs.writeFileSync('src/components/TopBar.jsx', topbar);

// 3. Fix LeftSidebar.jsx
let left = fs.readFileSync('src/components/LeftSidebar.jsx', 'utf8');
left = left.replace(
  /className=\{`\s*fixed lg:static inset-y-0 left-0 z-40\s*w-64 flex flex-col transition-transform duration-300 ease-in-out\s*\$\{sidebarOpen \? 'translate-x-0' : '-translate-x-full lg:translate-x-0'\}\s*\$\{isFullscreen \? 'lg:-translate-x-full lg:hidden' : ''\}\s*\$\{themeColors\.sidebar\} border-r \$\{themeColors\.border\} shadow-2xl lg:shadow-none h-full overflow-y-auto\s*`\}/,
  "className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0 ' : '-translate-x-full lg:translate-x-0 '} ${isFullscreen ? 'lg:-translate-x-full lg:hidden ' : ''} border-r shadow-2xl lg:shadow-none h-full overflow-y-auto`} style={{ backgroundColor: themeColors.sidebar, borderColor: themeColors.border }}"
);
fs.writeFileSync('src/components/LeftSidebar.jsx', left);

// 4. Fix RightSidebar.jsx
let right = fs.readFileSync('src/components/RightSidebar.jsx', 'utf8');
right = right.replace(
  /className=\{`\s*fixed lg:static inset-y-0 right-0 z-40\s*w-80 flex flex-col transition-transform duration-300 ease-in-out\s*\$\{isFullscreen \? 'lg:hidden' : ''\}\s*\$\{themeColors\.sidebar\} border-l \$\{themeColors\.border\} shadow-2xl lg:shadow-none h-full overflow-y-auto\s*`\}/,
  "className={`fixed lg:static inset-y-0 right-0 z-40 w-80 flex flex-col transition-transform duration-300 ease-in-out ${isFullscreen ? 'lg:hidden ' : ''} border-l shadow-2xl lg:shadow-none h-full overflow-y-auto`} style={{ backgroundColor: themeColors.sidebar, borderColor: themeColors.border }}"
);
fs.writeFileSync('src/components/RightSidebar.jsx', right);

console.log('Fixed everything!');
