
const fs = require('fs');
const files = ['src/LegalPage.jsx', 'src/components/CommunityGallery.jsx'];
files.forEach(file => {
  if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/\+\?/g, '←');
      fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Cleaned up more artifacts!');
