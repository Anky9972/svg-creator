# SVGCanvas - Professional SVG Clip-Path Editor

> **Create stunning SVG clip-paths with ease** — A professional, free, open-source online editor with visual drag-and-drop interface, live preview, and instant code generation.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-SVGCanvas-667eea?style=for-the-badge)](https://svgcanvas.netlify.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg)](https://tailwindcss.com/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://svgcanvas.netlify.app/)

---

## 🌟 Why SVGCanvas?

**SVGCanvas** is the ultimate free online SVG clip-path editor for web designers and developers. Create custom shapes, masks, and clip-paths with an intuitive visual interface — no coding required!

### ✨ Perfect For

- 🎨 **Web Designers** — Create unique shapes for hero sections, cards, and image galleries
- 💻 **Frontend Developers** — Generate production-ready SVG, CSS, and React code
- 📱 **UI/UX Designers** — Design custom avatars, profile pictures, and icons
- 🚀 **Rapid Prototyping** — Quickly experiment with different shape designs

### 🔥 What Makes SVGCanvas Special?

- ⚡ **Blazing Fast** — Built with React 19 + Vite 7 for instant feedback
- 🎯 **Drag & Drop** — Intuitive point manipulation with visual feedback
- 📦 **Export Anywhere** — SVG, PNG, CSS polygon, or React components
- 🌓 **Dark / Light Mode** — Beautiful themes for comfortable editing
- 📱 **Fully Responsive** — Collapsible sidebar, touch-enabled for any device
- 💾 **Save & Share** — Export projects or share via URL
- ♿ **Accessible** — Full keyboard navigation and screen reader support
- 🔍 **SEO Optimized** — Schema.org, Open Graph, Twitter Cards, PWA manifest

---

## 🎬 How It Works

1. **Choose a Shape** — Select from 15+ presets or start from scratch
2. **Customize** — Drag points, adjust corners, add/remove control points
3. **Preview** — See live preview with gradients, colors, or your images
4. **Export** — Download as SVG/PNG or copy code (SVG, CSS, React)
5. **Share** — Generate shareable link or save project as JSON

---

## 📊 Feature Comparison

| Feature | SVGCanvas | Other Tools |
|---------|:---------:|:-----------:|
| **Price** | ✅ 100% Free | Often paid |
| **Installation** | ✅ None — Web | Usually required |
| **Export Formats** | ✅ SVG, PNG, CSS, React | Limited |
| **Undo / Redo** | ✅ 50 actions | Limited or none |
| **Dark / Light Theme** | ✅ | Rare |
| **Mobile Support** | ✅ Touch + responsive | Desktop only |
| **Animation Preview** | ✅ Built-in | None |
| **Share Projects** | ✅ URL sharing | None |
| **PWA Support** | ✅ Installable | Rare |
| **Open Source** | ✅ MIT License | Proprietary |

---

## 📋 Features

### Core Editing
- **Visual Shape Editor** — Drag control points to create custom shapes
- **15 Shape Presets** — Rectangle, Rounded Rect, Notch, Hexagon, Star, Circle, Arrow, Pill, Triangle, Diamond, Heart, Shield, Badge, Pentagon, Octagon
- **Corner Rounding** — Apply global or per-point radius for smooth corners
- **Smart Point Insertion** — Automatically insert points on the nearest edge
- **Interactive Grid** — Configurable grid (4–50 divisions) with snap-to-grid

### Transform & Manipulation
- **Scale** — 90%, 95%, 105%, 110%
- **Rotate** — -90°, -45°, 45°, 90°
- **Flip** — Horizontal / Vertical
- **Point Reordering** — Change point sequence with Ctrl+↑/↓
- **Toggle Point Types** — Switch between Corner and Smooth

### Preview & Customization
- **Live Preview** — See your clip-path applied in real-time
- **Color Customization** — Choose custom colors for gradient and solid previews
- **Custom Image Upload** — Upload and preview with your own images
- **Multiple Aspect Ratios** — 1:1, 16:9, 4:3, 21:9, 9:16
- **Animation Preview** — Scale, rotate, and fade animations with play/pause

### Export & Project Management
- **SVG Export** — Download as standalone SVG file
- **PNG Export** — High-resolution raster image (1000×1000)
- **CSS Export** — `clip-path: polygon()` code
- **React Export** — Ready-to-use React component
- **Save / Load** — JSON project files for later editing
- **Share Link** — Generate shareable URL with encoded shape data

### User Experience
- **Responsive Design** — Collapsible sidebar with mobile hamburger menu
- **Dark / Light Theme** — Toggle with smooth transitions
- **Fullscreen Mode** — Expand the editor for detailed work
- **Undo / Redo** — 50-action history with Ctrl+Z / Ctrl+Y
- **Touch Support** — Drag points on mobile and tablet
- **Accessibility** — ARIA labels, keyboard navigation, screen reader support
- **Performance** — Memoized calculations, throttled updates, 60fps editing
- **Zoom & Pan** — Zoom slider with reset

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `A` | Toggle Add Mode |
| `S` | Toggle Snap to Grid |
| `G` | Toggle Grid Points |
| `T` | Toggle Point Type |
| `Delete` | Delete Selected Point |
| `Escape` | Deselect Point |
| `Tab` / `Shift+Tab` | Select Next / Previous Point |
| `Arrow Keys` | Move Selected Point |
| `Ctrl+↑/↓` | Reorder Point |
| `+` / `-` | Adjust Grid Size |
| `F` | Toggle Fullscreen |
| `Ctrl+C` | Copy Code |

---

## 🚀 Quick Start

Visit **[svgcanvas.netlify.app](https://svgcanvas.netlify.app/)** to start creating instantly — no installation required!

### 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/Anky9972/svg-creator.git
cd svg-creator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (auto-generates PNG assets)
npm run build

# Preview production build
npm run preview

# Regenerate PNG assets from SVGs
npm run generate-assets
```

---

## 🎯 Usage Guide

1. **Select a Shape Preset** or start with the default rectangle
2. **Drag Points** to modify the shape
3. **Add Points** using Add Mode (press `A`) — click on the canvas to insert
4. **Adjust Corners** using the Corner Rounding slider
5. **Toggle Point Types** between Corner and Smooth
6. **Copy the Code** and use it in your project

### Using the Generated Code

```html
<!-- Include the SVG in your HTML -->
<svg width="0" height="0">
  <defs>
    <clipPath id="customClip" clipPathUnits="objectBoundingBox">
      <path d="M0.1,0.1 L0.9,0.1 L0.9,0.9 L0.1,0.9 Z" />
    </clipPath>
  </defs>
</svg>

<!-- Apply to any element -->
<div style="clip-path: url(#customClip);">
  <img src="your-image.jpg" alt="Clipped image" />
</div>
```

```css
/* Or use CSS polygon directly */
.clipped {
  clip-path: polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%);
}
```

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite 7** | Build Tool & Dev Server |
| **TailwindCSS 4** | Utility-first Styling |
| **Sharp** | SVG → PNG Asset Generation |
| **SVG** | Vector Graphics Rendering |
| **Netlify** | Hosting & Deployment |

## 📁 Project Structure

```
svg-creator/
├── public/
│   ├── favicon.svg          # SVG favicon (source)
│   ├── favicon-32.png       # Generated 32×32 PNG favicon
│   ├── apple-touch-icon.png # Generated 180×180 Apple touch icon
│   ├── icon-192.png         # Generated 192×192 PWA icon
│   ├── icon-512.png         # Generated 512×512 PWA icon
│   ├── og-image.svg         # Open Graph image (source)
│   ├── og-image.png         # Generated 1200×630 social preview
│   ├── manifest.json        # PWA manifest
│   ├── robots.txt           # Crawler instructions
│   ├── sitemap.xml          # XML sitemap
│   ├── _redirects           # Netlify SPA fallback
│   └── _headers             # Netlify security headers
├── scripts/
│   └── generate-assets.mjs  # SVG → PNG asset pipeline
├── src/
│   ├── App.jsx              # Main application component (~2,500 lines)
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles & scrollbar
├── index.html               # HTML template with full SEO meta tags
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies & scripts
└── README.md                 # Documentation
```

---

## 🔍 SEO & PWA

SVGCanvas ships with comprehensive SEO out of the box:

- **Meta Tags** — Title, description, keywords, canonical URL
- **Open Graph** — Facebook / LinkedIn preview with PNG image (1200×630)
- **Twitter Cards** — `summary_large_image` with full metadata
- **Schema.org** — `WebApplication` JSON-LD with feature list, author, screenshots
- **PWA Manifest** — Installable as a progressive web app with multiple icon sizes
- **Sitemap & Robots** — XML sitemap and crawler instructions
- **Security Headers** — CSP, X-Frame-Options, HSTS via Netlify `_headers`
- **Noscript Fallback** — Keyword-rich content for JS-disabled crawlers

---

## ❓ FAQ

<details>
<summary><strong>What is SVGCanvas?</strong></summary>

A free online SVG clip-path editor that lets you create, customize, and export custom shapes with a visual drag-and-drop interface. No sign-up or coding required!
</details>

<details>
<summary><strong>How do I use clip-paths on my website?</strong></summary>

Copy the generated SVG code from SVGCanvas and paste it into your HTML. Apply it using `clip-path: url(#yourId)` in CSS. See the Usage Guide above for detailed examples.
</details>

<details>
<summary><strong>Is SVGCanvas really free?</strong></summary>

Yes — 100% free, no ads, no watermarks, no sign-up. Open source under the MIT license.
</details>

<details>
<summary><strong>Can I use it commercially?</strong></summary>

Absolutely! Use it for personal projects, client work, or commercial products. No attribution required (though appreciated!).
</details>

<details>
<summary><strong>What export formats are supported?</strong></summary>

SVG file, PNG (1000×1000), CSS `clip-path: polygon()`, React component, and JSON project file.
</details>

<details>
<summary><strong>Does it work on mobile?</strong></summary>

Yes! SVGCanvas has a fully responsive layout with collapsible sidebar and touch-enabled point dragging on phones and tablets.
</details>

<details>
<summary><strong>How do I save my work?</strong></summary>

Click "Save" to download a JSON file. Load it back anytime. Or use "Share Link" to generate a URL encoding your shape.
</details>

<details>
<summary><strong>Can I import existing SVG paths?</strong></summary>

Not yet — it's on the roadmap! Currently you can start with 15+ presets and customize from there.
</details>

<details>
<summary><strong>What browsers are supported?</strong></summary>

All modern browsers: Chrome, Firefox, Safari, Edge. Requires JavaScript.
</details>

<details>
<summary><strong>How do I report bugs or request features?</strong></summary>

Open an issue on the [GitHub repository](https://github.com/Anky9972/svg-creator/issues) or submit a pull request!
</details>

---

## 🤝 Contributing

Contributions are welcome! Help make **SVGCanvas** even better:

1. **Fork** the repository
2. **Create** a feature branch — `git checkout -b feature/amazing-feature`
3. **Commit** your changes — `git commit -m 'Add amazing feature'`
4. **Push** to the branch — `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### ✅ Completed Features

- [x] 15+ shape presets
- [x] Visual drag-and-drop editor with live preview
- [x] Export to SVG, PNG, CSS polygon, React components
- [x] Full undo/redo (50-action history)
- [x] Save / load / share projects
- [x] Transform tools (scale, rotate, flip)
- [x] Corner rounding (global & per-point)
- [x] Zoom & pan controls
- [x] Grid snapping & point snapping
- [x] Dark / light theme toggle
- [x] Animation preview (scale, rotate, fade)
- [x] Share link generation
- [x] Responsive mobile layout with sidebar overlay
- [x] PWA manifest & installable
- [x] SEO: Schema.org, Open Graph, Twitter Cards, sitemap
- [x] PNG asset generation pipeline

### 🚀 Roadmap

- [ ] Import existing SVG paths
- [ ] Gradient color picker for previews
- [ ] Custom shape library (save favorites)
- [ ] Collaborative editing
- [ ] Animation timeline editor
- [ ] Figma / Sketch export plugin
- [ ] Bezier curve control points
- [ ] Multi-shape composition

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anky9972**

- GitHub: [@Anky9972](https://github.com/Anky9972)
- Repository: [svg-creator](https://github.com/Anky9972/svg-creator)

---

## 🔗 Resources

- [MDN: CSS clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path)
- [SVG Path Reference](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
- [CSS-Tricks: Clipping & Masking](https://css-tricks.com/clipping-masking-css/)

## 🏷️ Keywords

`svg editor` · `clip-path generator` · `online svg tool` · `css clip-path` · `web design tools` · `free svg editor` · `shape maker` · `vector editor` · `clip-path creator` · `svg mask` · `polygon generator` · `svgcanvas` · `frontend tools` · `react svg editor` · `responsive design` · `pwa`

---

<div align="center">

### 🎨 [Try SVGCanvas Now!](https://svgcanvas.netlify.app/) 🎨

Made with ❤️ by [Anky9972](https://github.com/Anky9972)

**SVGCanvas** — Professional SVG Clip-Path Editor | Free & Open Source

⭐ Star this repo if SVGCanvas helped you create amazing clip-paths!

</div>
