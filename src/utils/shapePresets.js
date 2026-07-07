export const SHAPE_PRESETS = {
  rectangle: {
    name: 'Rectangle',
    points: [
      { id: 1, x: 0.1, y: 0.1, type: 'corner', radius: 0 },
      { id: 2, x: 0.9, y: 0.1, type: 'corner', radius: 0 },
      { id: 3, x: 0.9, y: 0.9, type: 'corner', radius: 0 },
      { id: 4, x: 0.1, y: 0.9, type: 'corner', radius: 0 },
    ],
  },
  roundedRect: {
    name: 'Rounded Rect',
    points: [
      { id: 1, x: 0.1, y: 0.1, type: 'corner', radius: 0.08 },
      { id: 2, x: 0.9, y: 0.1, type: 'corner', radius: 0.08 },
      { id: 3, x: 0.9, y: 0.9, type: 'corner', radius: 0.08 },
      { id: 4, x: 0.1, y: 0.9, type: 'corner', radius: 0.08 },
    ],
  },
  notch: {
    name: 'Notch',
    points: [
      { id: 1, x: 0.05, y: 0.02, type: 'corner', radius: 0.03 },
      { id: 2, x: 0.32, y: 0.02, type: 'corner', radius: 0.02 },
      { id: 3, x: 0.38, y: 0.11, type: 'smooth', radius: 0.02 },
      { id: 4, x: 0.62, y: 0.11, type: 'smooth', radius: 0.02 },
      { id: 5, x: 0.68, y: 0.02, type: 'corner', radius: 0.02 },
      { id: 6, x: 0.95, y: 0.02, type: 'corner', radius: 0.03 },
      { id: 7, x: 0.95, y: 0.98, type: 'corner', radius: 0.03 },
      { id: 8, x: 0.05, y: 0.98, type: 'corner', radius: 0.03 },
    ],
  },
  hexagon: {
    name: 'Hexagon',
    points: [
      { id: 1, x: 0.5, y: 0.05, type: 'corner', radius: 0 },
      { id: 2, x: 0.93, y: 0.27, type: 'corner', radius: 0 },
      { id: 3, x: 0.93, y: 0.73, type: 'corner', radius: 0 },
      { id: 4, x: 0.5, y: 0.95, type: 'corner', radius: 0 },
      { id: 5, x: 0.07, y: 0.73, type: 'corner', radius: 0 },
      { id: 6, x: 0.07, y: 0.27, type: 'corner', radius: 0 },
    ],
  },
  star: {
    name: 'Star',
    points: [
      { id: 1, x: 0.5, y: 0.05, type: 'corner', radius: 0 },
      { id: 2, x: 0.62, y: 0.35, type: 'corner', radius: 0 },
      { id: 3, x: 0.95, y: 0.39, type: 'corner', radius: 0 },
      { id: 4, x: 0.7, y: 0.6, type: 'corner', radius: 0 },
      { id: 5, x: 0.79, y: 0.95, type: 'corner', radius: 0 },
      { id: 6, x: 0.5, y: 0.75, type: 'corner', radius: 0 },
      { id: 7, x: 0.21, y: 0.95, type: 'corner', radius: 0 },
      { id: 8, x: 0.3, y: 0.6, type: 'corner', radius: 0 },
      { id: 9, x: 0.05, y: 0.39, type: 'corner', radius: 0 },
      { id: 10, x: 0.38, y: 0.35, type: 'corner', radius: 0 },
    ],
  },
  circle: {
    name: 'Circle',
    points: [
      { id: 1, x: 0.5, y: 0.1, type: 'smooth', radius: 0.25 },
      { id: 2, x: 0.9, y: 0.5, type: 'smooth', radius: 0.25 },
      { id: 3, x: 0.5, y: 0.9, type: 'smooth', radius: 0.25 },
      { id: 4, x: 0.1, y: 0.5, type: 'smooth', radius: 0.25 },
    ],
  },
  arrow: {
    name: 'Arrow',
    points: [
      { id: 1, x: 0.5, y: 0.1, type: 'corner', radius: 0 },
      { id: 2, x: 0.9, y: 0.5, type: 'corner', radius: 0 },
      { id: 3, x: 0.65, y: 0.5, type: 'corner', radius: 0 },
      { id: 4, x: 0.65, y: 0.9, type: 'corner', radius: 0 },
      { id: 5, x: 0.35, y: 0.9, type: 'corner', radius: 0 },
      { id: 6, x: 0.35, y: 0.5, type: 'corner', radius: 0 },
      { id: 7, x: 0.1, y: 0.5, type: 'corner', radius: 0 },
    ],
  },
  pill: {
    name: 'Pill',
    points: [
      { id: 1, x: 0.3, y: 0.3, type: 'smooth', radius: 0.2 },
      { id: 2, x: 0.7, y: 0.3, type: 'smooth', radius: 0.2 },
      { id: 3, x: 0.7, y: 0.7, type: 'smooth', radius: 0.2 },
      { id: 4, x: 0.3, y: 0.7, type: 'smooth', radius: 0.2 },
    ],
  },
  triangle: {
    name: 'Triangle',
    points: [
      { id: 1, x: 0.5, y: 0.1, type: 'corner', radius: 0 },
      { id: 2, x: 0.9, y: 0.9, type: 'corner', radius: 0 },
      { id: 3, x: 0.1, y: 0.9, type: 'corner', radius: 0 },
    ],
  },
  diamond: {
    name: 'Diamond',
    points: [
      { id: 1, x: 0.5, y: 0.05, type: 'corner', radius: 0 },
      { id: 2, x: 0.95, y: 0.5, type: 'corner', radius: 0 },
      { id: 3, x: 0.5, y: 0.95, type: 'corner', radius: 0 },
      { id: 4, x: 0.05, y: 0.5, type: 'corner', radius: 0 },
    ],
  },
  heart: {
    name: 'Heart',
    points: [
      { id: 1, x: 0.5, y: 0.3, type: 'smooth', radius: 0 },
      { id: 2, x: 0.7, y: 0.1, type: 'smooth', radius: 0.15 },
      { id: 3, x: 0.9, y: 0.25, type: 'smooth', radius: 0.1 },
      { id: 4, x: 0.85, y: 0.45, type: 'smooth', radius: 0.05 },
      { id: 5, x: 0.5, y: 0.95, type: 'corner', radius: 0 },
      { id: 6, x: 0.15, y: 0.45, type: 'smooth', radius: 0.05 },
      { id: 7, x: 0.1, y: 0.25, type: 'smooth', radius: 0.1 },
      { id: 8, x: 0.3, y: 0.1, type: 'smooth', radius: 0.15 },
    ],
  },
  shield: {
    name: 'Shield',
    points: [
      { id: 1, x: 0.5, y: 0.05, type: 'corner', radius: 0 },
      { id: 2, x: 0.95, y: 0.05, type: 'corner', radius: 0.05 },
      { id: 3, x: 0.95, y: 0.45, type: 'smooth', radius: 0.05 },
      { id: 4, x: 0.85, y: 0.65, type: 'smooth', radius: 0.05 },
      { id: 5, x: 0.5, y: 0.95, type: 'corner', radius: 0 },
      { id: 6, x: 0.15, y: 0.65, type: 'smooth', radius: 0.05 },
      { id: 7, x: 0.05, y: 0.45, type: 'smooth', radius: 0.05 },
      { id: 8, x: 0.05, y: 0.05, type: 'corner', radius: 0.05 },
    ],
  },
  badge: {
    name: 'Badge',
    points: [
      { id: 1, x: 0.5, y: 0.05, type: 'corner', radius: 0.04 },
      { id: 2, x: 0.65, y: 0.12, type: 'corner', radius: 0.03 },
      { id: 3, x: 0.88, y: 0.12, type: 'corner', radius: 0.04 },
      { id: 4, x: 0.95, y: 0.27, type: 'corner', radius: 0.03 },
      { id: 5, x: 0.95, y: 0.5, type: 'corner', radius: 0.03 },
      { id: 6, x: 0.88, y: 0.73, type: 'corner', radius: 0.03 },
      { id: 7, x: 0.65, y: 0.88, type: 'corner', radius: 0.03 },
      { id: 8, x: 0.5, y: 0.95, type: 'corner', radius: 0.04 },
      { id: 9, x: 0.35, y: 0.88, type: 'corner', radius: 0.03 },
      { id: 10, x: 0.12, y: 0.73, type: 'corner', radius: 0.03 },
      { id: 11, x: 0.05, y: 0.5, type: 'corner', radius: 0.03 },
      { id: 12, x: 0.05, y: 0.27, type: 'corner', radius: 0.03 },
      { id: 13, x: 0.12, y: 0.12, type: 'corner', radius: 0.04 },
      { id: 14, x: 0.35, y: 0.12, type: 'corner', radius: 0.03 },
    ],
  },
  Pentagon: {
    name: 'Pentagon',
    points: [
      { id: 1, x: 0.5, y: 0.05, type: 'corner', radius: 0 },
      { id: 2, x: 0.95, y: 0.35, type: 'corner', radius: 0 },
      { id: 3, x: 0.78, y: 0.95, type: 'corner', radius: 0 },
      { id: 4, x: 0.22, y: 0.95, type: 'corner', radius: 0 },
      { id: 5, x: 0.05, y: 0.35, type: 'corner', radius: 0 },
    ],
  },
  octagon: {
    name: 'Octagon',
    points: [
      { id: 1, x: 0.3, y: 0.05, type: 'corner', radius: 0 },
      { id: 2, x: 0.7, y: 0.05, type: 'corner', radius: 0 },
      { id: 3, x: 0.95, y: 0.3, type: 'corner', radius: 0 },
      { id: 4, x: 0.95, y: 0.7, type: 'corner', radius: 0 },
      { id: 5, x: 0.7, y: 0.95, type: 'corner', radius: 0 },
      { id: 6, x: 0.3, y: 0.95, type: 'corner', radius: 0 },
      { id: 7, x: 0.05, y: 0.7, type: 'corner', radius: 0 },
      { id: 8, x: 0.05, y: 0.3, type: 'corner', radius: 0 },
    ],
  },
};

export const GRID_DIVISIONS = 20;
export const MIN_GRID = 4;
export const MAX_GRID = 50;

export const ASPECT_RATIOS = {
  '1:1': { width: 1, height: 1, label: '1:1' },
  '16:9': { width: 16, height: 9, label: '16:9' },
  '4:3': { width: 4, height: 3, label: '4:3' },
  '21:9': { width: 21, height: 9, label: '21:9' },
  '9:16': { width: 9, height: 16, label: '9:16' },
};
