import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from './components/TopBar';
import Footer from './Footer';

export default function LegalPage({ type, themeColors }) {
  const getTitle = () => {
    switch (type) {
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      case 'contact': return 'Contact Us';
      case 'about': return 'About SVGCanvas';
      default: return 'Legal';
    }
  };

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return (
          <div className={`prose ${themeColors.text} max-w-none`}>
            <p>Your privacy is important to us. This privacy policy explains what data we collect and how we use it.</p>
            <h3 className={themeColors.text}>Data Collection</h3>
            <p>We only collect the data necessary to provide you with the best experience on SVGCanvas. Projects saved to the cloud are linked to your account, but we do not track or sell your personal data.</p>
          </div>
        );
      case 'terms':
        return (
          <div className={`prose ${themeColors.text} max-w-none`}>
            <p>By using SVGCanvas, you agree to these terms of service.</p>
            <h3 className={themeColors.text}>Usage and Licensing</h3>
            <p>SVGCanvas is provided "as is" without any warranties. The tool itself is open source under the <strong>MIT License</strong>.</p> 
            <p>You are free to use any generated SVG code or clip-paths in both personal and commercial projects without attribution.</p>
          </div>
        );
      case 'contact':
        return (
          <div className={`prose ${themeColors.text} max-w-none`}>
            <p>If you have any questions, feedback, or concerns, please reach out to us!</p>
            <p>GitHub: <strong>https://github.com/SVGCanvas/svg-creator</strong></p>
          </div>
        );
      case 'about':
        return (
          <div className={`prose ${themeColors.text} max-w-none`}>
            <p>SVGCanvas is a free, professional online tool for generating and editing SVG clip-paths.</p>
            <p>Built with love for developers and designers who need quick, precise, and visual shape generation.</p>
          </div>
        );
      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${themeColors.bg} ${themeColors.text}`}>
      {/* Simple Header for legal pages without all the editor tools */}
      <header className={`h-16 flex items-center justify-between px-4 border-b ${themeColors.sidebar} ${themeColors.border}`}>
        <Link to="/" className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500`}>
          ← Back to SVGCanvas
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className={`text-3xl font-bold mb-8 ${themeColors.text}`}>{getTitle()}</h1>
        <div className={`p-8 rounded-2xl border shadow-xl ${themeColors.sidebarSection} ${themeColors.border}`}>
          {getContent()}
        </div>
      </main>

      <Footer themeColors={themeColors} />
    </div>
  );
}
