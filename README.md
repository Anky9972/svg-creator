# SVG ClipPath Creator

A modern, interactive tool for creating custom SVG clip-path masks with an intuitive visual editor.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.x-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg)

## Features

- **Visual Shape Editor** - Drag control points to create custom shapes
- **8 Shape Presets** - Rectangle, Rounded Rect, Notch, Hexagon, Star, Circle, Arrow, Pill
- **Corner Rounding** - Apply global or per-point radius for smooth corners
- **Smart Point Insertion** - Automatically insert points on the nearest edge
- **Interactive Grid** - Configurable grid (4-50 divisions) with snap-to-grid functionality
- **Live Preview** - See your clip-path applied to gradients, solid colors, and images in real-time
- **Multiple Aspect Ratios** - 1:1, 16:9, 4:3, 21:9, 9:16
- **Fullscreen Mode** - Expand the editor for detailed work
- **Code Export** - Copy generated SVG code with one click
- **Keyboard Shortcuts** - Full keyboard navigation support

## Demo

Create stunning clip-path masks for:
- Profile pictures and avatars
- Image galleries
- Hero sections
- Card designs
- Creative layouts

## Installation

```bash
# Clone the repository
git clone https://github.com/Anky9972/svg-creator.git

# Navigate to project directory
cd svg-creator

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

1. **Select a Shape Preset** or start with the default rectangle
2. **Drag Points** to modify the shape
3. **Add Points** using Add Mode (press `A`) - click on the canvas to add new points
4. **Adjust Corners** using the Corner Rounding slider
5. **Toggle Point Types** between Corner and Smooth for different effects
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

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `A` | Toggle Add Mode |
| `S` | Toggle Snap to Grid |
| `G` | Toggle Grid Points |
| `T` | Toggle Point Type (Corner/Smooth) |
| `Delete` | Delete Selected Point |
| `Escape` | Deselect Point |
| `Tab` | Select Next Point |
| `Shift+Tab` | Select Previous Point |
| `Arrow Keys` | Move Selected Point |
| `Ctrl+↑/↓` | Reorder Point |
| `+` / `-` | Adjust Grid Size |
| `F` | Toggle Fullscreen |
| `Ctrl+C` | Copy SVG Code |

## Tech Stack

- **React 19** - UI Framework
- **Vite 7** - Build Tool
- **TailwindCSS 4** - Styling
- **SVG** - Vector Graphics

## Project Structure

```
svg-creator/
├── src/
│   ├── App.jsx        # Main application component
│   ├── main.jsx       # React entry point
│   └── index.css      # Global styles
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
├── package.json       # Dependencies
└── README.md          # Documentation
```

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contributions

- [ ] Export to CSS `clip-path: polygon()` format
- [ ] Save/load shapes to local storage
- [ ] More shape presets
- [ ] Undo/redo functionality
- [ ] Import existing SVG paths
- [ ] Animation preview
- [ ] Dark/light theme toggle

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Anky9972**

- GitHub: [@Anky9972](https://github.com/Anky9972)

## Acknowledgments

- Inspired by tools like Clippy and SVG path editors
- Built with modern React and Vite

---

If you find this project useful, please consider giving it a ⭐ on GitHub!
