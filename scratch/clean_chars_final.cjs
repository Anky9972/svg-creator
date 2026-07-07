
const fs = require('fs');
const files = ['src/components/RightSidebar.jsx', 'src/components/LeftSidebar.jsx'];
files.forEach(file => {
  if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/I\"A.A\' /g, '✓ ')
                       .replace(/I\"A.A\+/g, '+')
                       .replace(/I\"A.A\-/g, '-')
                       .replace(/I\"AA\' /g, '✓ ')
                       .replace(/I\"AA\'/g, '✓');
      fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Cleaned up more artifacts!');
