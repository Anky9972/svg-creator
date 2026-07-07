const fs = require('fs');
let content = fs.readFileSync('src/components/Sidebar.jsx', 'utf8');

// The replacements
const replacements = [
  {
    regex: /<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" \/>\s*<\/svg>/g,
    replace: '<Undo2 className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" \/>\s*<\/svg>/g,
    replace: '<Redo2 className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" \/>\s*<\/svg>/g,
    replace: '<Save className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M4 16l4\.586-4\.586a2 2 0 012\.828 0L16 16m-2-2l1\.586-1\.586a2 2 0 012\.828 0L20 14m-6-6h\.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" \/>\s*<\/svg>/g,
    replace: '<Image className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" \/>\s*<\/svg>/g,
    replace: '<Copy className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" \/>\s*<\/svg>/g,
    replace: '<ArrowUpDown className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M8\.684 13\.342C8\.886 12\.938 9 12\.482 9 12c0-\.482-\.114-\.938-\.316-1\.342m0 2\.684a3 3 0 110-2\.684m0 2\.684l6\.632 3\.316m-6\.632-6l6\.632-3\.316m0 0a3 3 0 105\.367-2\.684 3 3 0 00-5\.367 2\.684zm0 9\.316a3 3 0 105\.368 2\.684 3 3 0 00-5\.368-2\.684z" \/>\s*<\/svg>/g,
    replace: '<Share2 className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" \/>\s*<\/svg>/g,
    replace: '<Maximize className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M7 16a4 4 0 01-\.88-7\.903A5 5 0 1115\.9 6L16 6a5 5 0 011 9\.9M15 13l-3-3m0 0l-3 3m3-3v12" \/>\s*<\/svg>/g,
    replace: '<Upload className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">\s*<path d="M23\.953.*?<\/svg>/gs,
    replace: '<Twitter className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">\s*<path d="M20\.447.*?<\/svg>/gs,
    replace: '<Linkedin className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">\s*<path d="M24 12\.073.*?<\/svg>/gs,
    replace: '<Facebook className="w-4 h-4" />'
  },
  {
    regex: /<svg className="w-4 h-4" viewBox="0 0 24 24">[\s\S]*?<\/svg>/gs,
    replace: '<Chrome className="w-4 h-4" />'
  }
];

let replaced = 0;
for (const r of replacements) {
  content = content.replace(r.regex, () => {
    replaced++;
    return r.replace;
  });
}

// Add imports
if (replaced > 0 && !content.includes('lucide-react')) {
  const imports = "import { Undo2, Redo2, Save, Image, Copy, ArrowUpDown, Share2, Maximize, Upload, Twitter, Linkedin, Facebook, Chrome } from 'lucide-react';\n";
  content = imports + content;
}

// Write back
fs.writeFileSync('src/components/Sidebar.jsx', content);
console.log('Replaced ' + replaced + ' SVGs in Sidebar');
