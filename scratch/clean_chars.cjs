
const fs = require('fs');
const files = ['src/components/LeftSidebar.jsx', 'src/components/RightSidebar.jsx'];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/A-\{gridSize\}/g, 'x{gridSize}')
                   .replace(/I\"A1A\. Smooth/g, '○ Smooth')
                   .replace(/I\"AA Corner/g, '□ Corner')
                   .replace(/O~/g, '⌘')
                   .replace(/I\"ArA\^c  A\./g, '⌘');
  fs.writeFileSync(file, content, 'utf8');
});
console.log('Cleaned up remaining artifacts!');
