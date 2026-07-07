
const fs = require('fs');
const files = ['src/components/LeftSidebar.jsx', 'src/components/RightSidebar.jsx'];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/A-\{gridSize\}/g, 'x{gridSize}')
                   .replace(/O~ Shortcuts/g, '⌘ Shortcuts')
                   .replace(/I\"A1A\. Smooth/g, '○ Smooth')
                   .replace(/I\"AA Corner/g, '□ Corner')
                   .replace(/I\"ArAA\. Copied/g, '✓ Copied')
                   .replace(/I\"ArA\\\^c  A\./g, '⌘')
                   .replace(/O~/g, '⌘');
  fs.writeFileSync(file, content, 'utf8');
});
console.log('Cleaned up remaining artifacts!');
