// Calculate distance from point to line segment
export function distanceToLineSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  }

  let t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));

  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;

  return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
}

// Find the nearest edge index for inserting a new point
export function findNearestEdgeIndex(points, px, py) {
  let minDist = Infinity;
  let nearestIndex = 0;

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const dist = distanceToLineSegment(px, py, p1.x, p1.y, p2.x, p2.y);

    if (dist < minDist) {
      minDist = dist;
      nearestIndex = i;
    }
  }

  return nearestIndex;
}

// Generate rounded corner path segment
export function generateRoundedCorner(prev, current, next, radius) {
  if (radius === 0) {
    return `L ${current.x.toFixed(3)}, ${current.y.toFixed(3)}`;
  }

  const v1 = { x: prev.x - current.x, y: prev.y - current.y };
  const v2 = { x: next.x - current.x, y: next.y - current.y };

  const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  if (len1 === 0 || len2 === 0) {
    return `L ${current.x.toFixed(3)}, ${current.y.toFixed(3)}`;
  }

  const n1 = { x: v1.x / len1, y: v1.y / len1 };
  const n2 = { x: v2.x / len2, y: v2.y / len2 };

  const maxRadius = Math.min(len1, len2) * 0.4;
  const actualRadius = Math.min(radius, maxRadius);

  const startPoint = {
    x: current.x + n1.x * actualRadius,
    y: current.y + n1.y * actualRadius
  };
  const endPoint = {
    x: current.x + n2.x * actualRadius,
    y: current.y + n2.y * actualRadius
  };

  return `L ${startPoint.x.toFixed(3)}, ${startPoint.y.toFixed(3)} Q ${current.x.toFixed(3)}, ${current.y.toFixed(3)} ${endPoint.x.toFixed(3)}, ${endPoint.y.toFixed(3)}`;
}

// Generate path string with rounded corners and bezier curves
export function generatePathString(points, globalRadius) {
  if (points.length < 3) return '';

  let path = '';
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const current = points[i];
    const next = points[(i + 1) % n];

    // Calculate effective positions including bezier handles
    const getPointPos = (p) => ({ x: p.x, y: p.y });
    const getHandleOut = (p) => {
      if (p.type === 'bezier' && p.handleOut) {
        return { x: p.x + p.handleOut.x, y: p.y + p.handleOut.y };
      }
      return getPointPos(p);
    };
    const getHandleIn = (p) => {
      if (p.type === 'bezier' && p.handleIn) {
        return { x: p.x + p.handleIn.x, y: p.y + p.handleIn.y };
      }
      return getPointPos(p);
    };

    if (i === 0) {
      if (current.type !== 'bezier' && (current.radius + globalRadius) > 0) {
        const radius = current.radius + globalRadius;
        const v = { x: prev.x - current.x, y: prev.y - current.y };
        const len = Math.sqrt(v.x * v.x + v.y * v.y);
        if (len > 0) {
          const maxRadius = Math.min(len * 0.4, radius);
          const startX = current.x + (v.x / len) * maxRadius;
          const startY = current.y + (v.y / len) * maxRadius;
          path = `M ${startX.toFixed(3)}, ${startY.toFixed(3)}`;
        } else {
          path = `M ${current.x.toFixed(3)}, ${current.y.toFixed(3)}`;
        }
      } else {
        path = `M ${current.x.toFixed(3)}, ${current.y.toFixed(3)}`;
      }
    }

    if (current.type === 'bezier') {
      // If current is bezier, the curve TO current uses prev's handleOut and current's handleIn
      if (i > 0) {
        const prevOut = getHandleOut(prev);
        const currIn = getHandleIn(current);
        path += ` C ${prevOut.x.toFixed(3)},${prevOut.y.toFixed(3)} ${currIn.x.toFixed(3)},${currIn.y.toFixed(3)} ${current.x.toFixed(3)},${current.y.toFixed(3)}`;
      }
    } else {
      const radius = current.radius + globalRadius;
      if (radius > 0) {
        // If coming from a bezier, we should draw the C curve first, then start the corner radius
        if (i > 0 && prev.type === 'bezier') {
           const prevOut = getHandleOut(prev);
           // Fallback to regular curve to current point first
           path += ` C ${prevOut.x.toFixed(3)},${prevOut.y.toFixed(3)} ${current.x.toFixed(3)},${current.y.toFixed(3)} ${current.x.toFixed(3)},${current.y.toFixed(3)}`;
        } else {
           path += ' ' + generateRoundedCorner(prev, current, next, radius);
        }
      } else {
        if (i > 0) {
          if (prev.type === 'bezier') {
            const prevOut = getHandleOut(prev);
            path += ` C ${prevOut.x.toFixed(3)},${prevOut.y.toFixed(3)} ${current.x.toFixed(3)},${current.y.toFixed(3)} ${current.x.toFixed(3)},${current.y.toFixed(3)}`;
          } else {
            path += ` L ${current.x.toFixed(3)}, ${current.y.toFixed(3)}`;
          }
        }
      }
    }
  }

  // Close the path, connecting the last point to the first
  const first = points[0];
  const last = points[n - 1];
  
  if (first.type === 'bezier') {
    const lastOut = getHandleOut(last);
    const firstIn = getHandleIn(first);
    path += ` C ${lastOut.x.toFixed(3)},${lastOut.y.toFixed(3)} ${firstIn.x.toFixed(3)},${firstIn.y.toFixed(3)} ${first.x.toFixed(3)},${first.y.toFixed(3)}`;
  } else {
    // If the first point had a corner radius, the 'M' point was shifted, so 'Z' closes it naturally to the start of the arc
    // If the last point was a bezier, we need a curve back to the start
    if (last.type === 'bezier') {
      const lastOut = getHandleOut(last);
      // Determine where the first point starts (might be shifted by radius)
      let startX = first.x;
      let startY = first.y;
      const radius = first.radius + globalRadius;
      if (first.type !== 'bezier' && radius > 0) {
        const v = { x: last.x - first.x, y: last.y - first.y };
        const len = Math.sqrt(v.x * v.x + v.y * v.y);
        if (len > 0) {
          const maxRadius = Math.min(len * 0.4, radius);
          startX = first.x + (v.x / len) * maxRadius;
          startY = first.y + (v.y / len) * maxRadius;
        }
      }
      path += ` C ${lastOut.x.toFixed(3)},${lastOut.y.toFixed(3)} ${startX.toFixed(3)},${startY.toFixed(3)} ${startX.toFixed(3)},${startY.toFixed(3)}`;
    }
  }

  path += ' Z';
  return path;
}
