import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

const canvasProps = `    // Canvas specific
    getPointById: (id) => points.find(p => p.id === id),
    resetAllRadii: () => setPoints(prev => prev.map(p => ({ ...p, radius: 0 }))),
    togglePointType: (index) => setPoints(prev => prev.map((p, i) => i === index ? { ...p, isCurve: !p.isCurve } : p)),
    deletePoint: (index) => {
      removePoint(index);
      if (selectedPoint === index) setSelectedPoint(null);
      else if (selectedPoint > index) setSelectedPoint(selectedPoint - 1);
    },
    movePointOrder: (index, direction) => {
      const newPoints = [...points];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < newPoints.length) {
        [newPoints[index], newPoints[targetIndex]] = [newPoints[targetIndex], newPoints[index]];
        setPoints(newPoints);
        if (selectedPoint === index) setSelectedPoint(targetIndex);
        else if (selectedPoint === targetIndex) setSelectedPoint(index);
      }
    },
    setInsertAfterPoint, insertAfterPoint,
    handleMouseMove, handleTouchMove, handleMouseUp, handleCanvasClick,
    gridPoints, handleAddPoint, handlePointMouseDown, handlePointTouchStart,
`;

content = content.replace(
  "    updatePoint,",
  "    updatePoint,\n" + canvasProps
);

fs.writeFileSync('src/App.jsx', content);
console.log("Successfully added Canvas props to App.jsx");
