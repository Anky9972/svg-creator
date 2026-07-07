import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

// Find where isSignUp is defined to add exportBackground
content = content.replace(
  "const [isSignUp, setIsSignUp] = useState(false)",
  "const [isSignUp, setIsSignUp] = useState(false)\n  const [exportBackground, setExportBackground] = useState({ type: 'solid', value: '#1e293b' })"
);

fs.writeFileSync('src/App.jsx', content);
console.log("Successfully added exportBackground to App.jsx");
