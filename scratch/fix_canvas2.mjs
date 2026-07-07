import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

const additionalProps = `    // Additional canvas props from full extraction
    showAnimation, setShowAnimation,
    exportBackground, setExportBackground,
    exportWebP: async () => {}, // mock if not implemented
    customImages, setCustomImages,
    previewColors: { ...previewColors, solid1: previewColors.solid || '#10b981', solid2: '#3b82f6' },
    codeFormat, setCodeFormat,
    scaleShape: (scale) => {
      // Basic implementation
      setPoints(prev => prev.map(p => ({ ...p, x: (p.x - 0.5) * scale + 0.5, y: (p.y - 0.5) * scale + 0.5 })));
    },
    rotateShape: (angle) => {
      const rad = (angle * Math.PI) / 180;
      setPoints(prev => prev.map(p => {
        const nx = (p.x - 0.5) * Math.cos(rad) - (p.y - 0.5) * Math.sin(rad) + 0.5;
        const ny = (p.x - 0.5) * Math.sin(rad) + (p.y - 0.5) * Math.cos(rad) + 0.5;
        return { ...p, x: nx, y: ny };
      }));
    },
    flipHorizontal: () => setPoints(prev => prev.map(p => ({ ...p, x: 1 - p.x }))),
    flipVertical: () => setPoints(prev => prev.map(p => ({ ...p, y: 1 - p.y }))),
    handleImageUpload: (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setCustomImages(prev => [url, ...prev].slice(0, 4));
      }
    },
    zoomIn: () => setZoom(z => Math.min(z + 0.1, 5)),
    zoomOut: () => setZoom(z => Math.max(z - 0.1, 0.1)),
    resetZoom: () => { setZoom(1); setPan({x:0,y:0}); },
    setZoom, setPan,
    applySnapping: () => {},
    shareOnTwitter: () => {},
    shareOnLinkedIn: () => {},
    shareOnFacebook: () => {},
    copyCodeFormat: () => {},
    saveProject: () => {},
    loadProject: () => {},
    generateCodeInFormat: () => pathD,
`;

content = content.replace(
  "    handlePointMouseDown, handlePointTouchStart,",
  "    handlePointMouseDown, handlePointTouchStart,\n" + additionalProps
);

fs.writeFileSync('src/App.jsx', content);
console.log("Successfully added all remaining Canvas props to App.jsx");
