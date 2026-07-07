import { useCallback } from 'react';
import { useEditor } from '../context/EditorContext';
import { generatePathString } from '../utils/geometry';

export const useExport = () => {
  const {
    history: { state: points },
    clipPathId,
    previewColors,
    globalRadius,
    exportBackground,
  } = useEditor();

  const getPathD = useCallback(() => {
    return generatePathString(points, globalRadius);
  }, [points, globalRadius]);

  const exportSVG = useCallback(() => {
    const path = getPathD();
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
  <defs>
    <clipPath id="${clipPathId}" clipPathUnits="objectBoundingBox">
      <path d="${path}" />
    </clipPath>
  </defs>
</svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${clipPathId}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [clipPathId, getPathD]);

  const exportPNGWithSize = useCallback(async (size = 1000) => {
    const path = getPathD();
    let defs = `
    <clipPath id="${clipPathId}-export" clipPathUnits="objectBoundingBox">
      <path d="${path}" />
    </clipPath>`;
    let rect = '';

    if (exportBackground.type === 'image' && exportBackground.value) {
      rect = `<image href="${exportBackground.value}" width="1" height="1" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipPathId}-export)" />`;
    } else if (exportBackground.type === 'solid') {
      rect = `<rect width="1" height="1" fill="${exportBackground.value || previewColors.solid}" clip-path="url(#${clipPathId}-export)" />`;
    } else {
      defs += `
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${previewColors.gradient1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${previewColors.gradient2};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>`;
      rect = `<rect width="1" height="1" fill="url(#grad)" clip-path="url(#${clipPathId}-export)" />`;
    }

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" width="${size}" height="${size}">
  <defs>${defs}
  </defs>
  ${rect}
</svg>`;
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${clipPathId}-${size}x${size}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);
      });
    };
    img.src = url;
  }, [clipPathId, getPathD, previewColors, exportBackground]);

  const exportWebP = useCallback(async (size = 1000) => {
    const path = getPathD();
    let defs = `
    <clipPath id="${clipPathId}-export" clipPathUnits="objectBoundingBox">
      <path d="${path}" />
    </clipPath>`;
    let rect = '';

    if (exportBackground.type === 'image' && exportBackground.value) {
      rect = `<image href="${exportBackground.value}" width="1" height="1" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipPathId}-export)" />`;
    } else if (exportBackground.type === 'solid') {
      rect = `<rect width="1" height="1" fill="${exportBackground.value || previewColors.solid}" clip-path="url(#${clipPathId}-export)" />`;
    } else {
      defs += `
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${previewColors.gradient1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${previewColors.gradient2};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>`;
      rect = `<rect width="1" height="1" fill="url(#grad)" clip-path="url(#${clipPathId}-export)" />`;
    }

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" width="${size}" height="${size}">
  <defs>${defs}
  </defs>
  ${rect}
</svg>`;
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const webpUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = webpUrl;
        link.download = `${clipPathId}-${size}x${size}-${Date.now()}.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(webpUrl);
        URL.revokeObjectURL(url);
      }, 'image/webp', 0.95);
    };
    img.src = url;
  }, [clipPathId, getPathD, previewColors]);

  return { exportSVG, exportPNGWithSize, exportWebP, getPathD };
};
