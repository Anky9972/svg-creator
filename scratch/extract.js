const fs = require('fs');

const original = fs.readFileSync('scratch/original_app.jsx', 'utf8');

function extractBlock(marker) {
  const lines = original.split('\n');
  const startLine = lines.findIndex(l => l.includes(marker));
  if (startLine === -1) return '';
  
  let depth = 0;
  let started = false;
  let block = '';
  
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];
    block += line + '\n';
    
    depth += (line.match(/<div|<button|<label|<h2/g) || []).length;
    depth -= (line.match(/<\/div>|<\/button>|<\/label>|<\/h2>/g) || []).length;
    
    // Simplistic depth matching might fail if self-closing tags or other elements are used,
    // let's just use exact line ranges based on manual inspection or regex
  }
}
