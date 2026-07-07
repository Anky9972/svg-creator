
const fs = require('fs');
const files = ['src/components/LeftSidebar.jsx', 'src/components/RightSidebar.jsx', 'scratch/build_sidebars.mjs'];
files.forEach(file => {
  if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/ΓêÆ5/g, '-5')
                       .replace(/ΓêÆ/g, '-')
                       .replace(/├ù/g, '×')
                       .replace(/Γî¿∩╕Å/g, '⌘')
                       .replace(/Γçº/g, 'Shift+')
                       .replace(/ΓåæΓåôΓåÉΓåÆ/g, 'Arrows')
                       .replace(/ΓåæΓåô/g, 'Up/Down')
                       .replace(/I\"AA\+5/g, '-5')
                       .replace(/I\"AA\+/g, '-')
                       .replace(/\"oA1/g, '×')
                       .replace(/I\"A1A\. Smooth/g, '○ Smooth')
                       .replace(/I\"AA Corner/g, '□ Corner')
                       .replace(/I\"ArA\\\^c  A\./g, '⌘')
                       .replace(/I\"A.A\+/g, '-');
      fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Fixed Unicode chars');
