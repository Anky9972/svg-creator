import React from 'react'
import { Link } from 'react-router-dom'

const Footer = ({ themeColors }) => {
  return (
    <footer className={`mt-12 py-8 border-t ${themeColors.border} ${themeColors.bg}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className={`text-lg font-bold mb-2 ${themeColors.text}`}>SVGCanvas</h3>
            <p className={`text-sm ${themeColors.textSecondary} max-w-sm mb-4`}>
              A professional, free online SVG clip-path editor and generator.
              Create, edit, and export custom shapes with a visual drag-and-drop interface.
            </p>
          </div>
          
          <div>
            <h4 className={`text-sm font-semibold mb-4 ${themeColors.text}`}>Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path" target="_blank" rel="noopener noreferrer" className={`text-sm hover:text-blue-500 transition-colors ${themeColors.textSecondary}`}>
                  MDN Web Docs: clip-path
                </a>
              </li>
              <li>
                <a href="https://developer.mozilla.org/en-US/docs/Web/SVG" target="_blank" rel="noopener noreferrer" className={`text-sm hover:text-blue-500 transition-colors ${themeColors.textSecondary}`}>
                  SVG Reference
                </a>
              </li>
              <li>
                <Link to="/about" className={`text-sm hover:text-blue-500 transition-colors ${themeColors.textSecondary}`}>
                  About SVGCanvas
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-sm font-semibold mb-4 ${themeColors.text}`}>Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className={`text-sm hover:text-blue-500 transition-colors ${themeColors.textSecondary}`}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={`text-sm hover:text-blue-500 transition-colors ${themeColors.textSecondary}`}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`text-sm hover:text-blue-500 transition-colors ${themeColors.textSecondary}`}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={`mt-8 pt-8 border-t ${themeColors.border} flex flex-col md:flex-row justify-between items-center`}>
          <p className={`text-sm ${themeColors.textSecondary}`}>
            &copy; {new Date().getFullYear()} SVGCanvas by Anky9972. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex gap-4 text-sm">
            <Link to="/" className={`hover:text-blue-500 transition-colors ${themeColors.textSecondary}`}>Editor</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
