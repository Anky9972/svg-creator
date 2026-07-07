const fs = require('fs');

['src/components/Sidebar.jsx', 'src/components/Canvas.jsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let replaced = 0;
  
  // Find standard string classNames for buttons
  content = content.replace(/(className=["'](?:[^"']*?)hover:(?:bg|text)[^"']*?)(["'])/g, (match, p1, p2) => {
    if (!p1.includes('active:scale-95') && !p1.includes('active:scale-90')) {
      replaced++;
      return p1 + ' active:scale-95 active:shadow-inner' + p2;
    }
    return match;
  });

  // Find template literal classNames for buttons
  content = content.replace(/(className=\{`(?:[^`]*?)hover:(?:bg|text)[^`]*?)(`\})/g, (match, p1, p2) => {
    if (!p1.includes('active:scale-95') && !p1.includes('active:scale-90')) {
      replaced++;
      return p1 + ' active:scale-95 active:shadow-inner' + p2;
    }
    return match;
  });

  // Specifically target themeColors.buttonHover
  content = content.replace(/(className=\{`(?:[^`]*?)\$\{themeColors\.buttonHover\}[^`]*?)(`\})/g, (match, p1, p2) => {
    if (!p1.includes('active:scale-95') && !p1.includes('active:scale-90')) {
      replaced++;
      return p1 + ' active:scale-95 active:shadow-inner' + p2;
    }
    return match;
  });

  if (replaced > 0) {
    fs.writeFileSync(file, content);
    console.log(file + ' updated with ' + replaced + ' button animations.');
  }
});
