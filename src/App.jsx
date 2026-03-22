import { useState, useCallback, useRef, useEffect, useMemo } from 'react'

// Custom hook for undo/redo functionality
const useHistory = (initialState) => {
  const [history, setHistory] = useState([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const state = history[currentIndex]

  const setState = useCallback((newState) => {
    // Handle function updaters (like React's setState)
    const resolvedState = typeof newState === 'function' ? newState(state) : newState
    
    const newHistory = history.slice(0, currentIndex + 1)
    newHistory.push(resolvedState)
    // Limit history to 50 states to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift()
      setHistory(newHistory)
      setCurrentIndex(currentIndex)
    } else {
      setHistory(newHistory)
      setCurrentIndex(currentIndex + 1)
    }
  }, [history, currentIndex, state])

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, history.length])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const reset = useCallback((resetState) => {
    setHistory([resetState])
    setCurrentIndex(0)
  }, [])

  return { state, setState, undo, redo, canUndo, canRedo, reset }
}

// Shape presets with normalized coordinates (0-1)
const SHAPE_PRESETS = {
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
}

const GRID_DIVISIONS = 20
const MIN_GRID = 4
const MAX_GRID = 50

// Canvas aspect ratio presets
const ASPECT_RATIOS = {
  '1:1': { width: 1, height: 1, label: '1:1' },
  '16:9': { width: 16, height: 9, label: '16:9' },
  '4:3': { width: 4, height: 3, label: '4:3' },
  '21:9': { width: 21, height: 9, label: '21:9' },
  '9:16': { width: 9, height: 16, label: '9:16' },
}

// Utility: Calculate distance from point to line segment
function distanceToLineSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSq = dx * dx + dy * dy
  
  if (lengthSq === 0) {
    // Line segment is a point
    return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2)
  }
  
  // Calculate projection parameter t
  let t = ((px - x1) * dx + (py - y1) * dy) / lengthSq
  t = Math.max(0, Math.min(1, t))
  
  // Calculate closest point on segment
  const closestX = x1 + t * dx
  const closestY = y1 + t * dy
  
  // Return distance
  return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2)
}

// Find the nearest edge index for inserting a new point
function findNearestEdgeIndex(points, px, py) {
  let minDist = Infinity
  let nearestIndex = 0
  
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i]
    const p2 = points[(i + 1) % points.length]
    const dist = distanceToLineSegment(px, py, p1.x, p1.y, p2.x, p2.y)
    
    if (dist < minDist) {
      minDist = dist
      nearestIndex = i
    }
  }
  
  return nearestIndex
}

function App() {
  // Use history hook for undo/redo functionality
  const { state: points, setState: setPoints, undo, redo, canUndo, canRedo, reset: resetHistory } = useHistory(SHAPE_PRESETS.rectangle.points)
  
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [clipPathId, setClipPathId] = useState('customClip')
  const [copied, setCopied] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(GRID_DIVISIONS)
  const [showGridPoints, setShowGridPoints] = useState(true)
  const [globalRadius, setGlobalRadius] = useState(0)
  const [addMode, setAddMode] = useState(false)
  const [insertMode, setInsertMode] = useState('smart') // 'smart' or 'after'
  const [insertAfterPoint, setInsertAfterPoint] = useState(null)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [canvasHeight, setCanvasHeight] = useState(500)
  const [previewColors, setPreviewColors] = useState({
    gradient1: '#667eea',
    gradient2: '#764ba2',
    solid: '#10b981',
  })
  const [customImages, setCustomImages] = useState([
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
  ])
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [theme, setTheme] = useState('dark') // 'dark' or 'light'
  const [snapToPoints, setSnapToPoints] = useState(false)
  const [snapToCenter, setSnapToCenter] = useState(false)
  const [codeFormat, setCodeFormat] = useState('svg') // 'svg', 'css', 'react'
  const [showAnimation, setShowAnimation] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const svgRef = useRef(null)
  const canvasContainerRef = useRef(null)
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const lastUpdateRef = useRef(Date.now())

  // Get SVG coordinates from mouse event (fixes cursor mismatch)
  const getSvgCoordinates = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    
    const rect = svg.getBoundingClientRect()
    const svgWidth = rect.width
    const svgHeight = rect.height
    
    // Since viewBox is "0 0 1 1" and preserveAspectRatio is "xMidYMid meet"
    // we need to calculate the actual content area
    const viewBoxAspect = 1 // viewBox is 1:1
    const containerAspect = svgWidth / svgHeight
    
    let contentWidth, contentHeight, offsetX, offsetY
    
    if (containerAspect > viewBoxAspect) {
      // Container is wider than viewBox - content is centered horizontally
      contentHeight = svgHeight
      contentWidth = svgHeight * viewBoxAspect
      offsetX = (svgWidth - contentWidth) / 2
      offsetY = 0
    } else {
      // Container is taller than viewBox - content is centered vertically
      contentWidth = svgWidth
      contentHeight = svgWidth / viewBoxAspect
      offsetX = 0
      offsetY = (svgHeight - contentHeight) / 2
    }
    
    // Calculate position relative to actual SVG content area
    let x = (e.clientX - rect.left - offsetX) / contentWidth
    let y = (e.clientY - rect.top - offsetY) / contentHeight
    
    return { x, y }
  }, [])

  // Snap value to grid
  const snapValue = useCallback((value) => {
    if (!snapToGrid) return value
    const step = 1 / gridSize
    return Math.round(value / step) * step
  }, [snapToGrid, gridSize])

  // Load preset
  const loadPreset = (presetKey) => {
    const preset = SHAPE_PRESETS[presetKey]
    setPoints([...preset.points.map(p => ({...p}))])
    resetHistory([...preset.points.map(p => ({...p}))])
    setSelectedPoint(null)
    setAddMode(false)
    setInsertAfterPoint(null)
    setGlobalRadius(0)
  }

  // Get point by ID
  const getPointById = (id) => {
    if (!Array.isArray(points)) {
      console.error('points is not an array:', points)
      return null
    }
    return points.find(p => p.id === id)
  }

  // Generate rounded corner path segment
  const generateRoundedCorner = (prev, current, next, radius) => {
    if (radius === 0) {
      return `L ${current.x.toFixed(3)}, ${current.y.toFixed(3)}`
    }

    const v1 = { x: prev.x - current.x, y: prev.y - current.y }
    const v2 = { x: next.x - current.x, y: next.y - current.y }
    
    const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y)
    const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y)
    
    if (len1 === 0 || len2 === 0) {
      return `L ${current.x.toFixed(3)}, ${current.y.toFixed(3)}`
    }
    
    const n1 = { x: v1.x / len1, y: v1.y / len1 }
    const n2 = { x: v2.x / len2, y: v2.y / len2 }
    
    const maxRadius = Math.min(len1, len2) * 0.4
    const actualRadius = Math.min(radius, maxRadius)
    
    const startPoint = {
      x: current.x + n1.x * actualRadius,
      y: current.y + n1.y * actualRadius
    }
    const endPoint = {
      x: current.x + n2.x * actualRadius,
      y: current.y + n2.y * actualRadius
    }
    
    return `L ${startPoint.x.toFixed(3)}, ${startPoint.y.toFixed(3)} Q ${current.x.toFixed(3)}, ${current.y.toFixed(3)} ${endPoint.x.toFixed(3)}, ${endPoint.y.toFixed(3)}`
  }

  // Generate path string with rounded corners (memoized for performance)
  const generatePath = useCallback(() => {
    if (points.length < 3) return ''
    
    let path = ''
    const n = points.length
    
    for (let i = 0; i < n; i++) {
      const prev = points[(i - 1 + n) % n]
      const current = points[i]
      const next = points[(i + 1) % n]
      
      const radius = current.radius + globalRadius
      
      if (i === 0) {
        if (radius > 0) {
          const v = { x: prev.x - current.x, y: prev.y - current.y }
          const len = Math.sqrt(v.x * v.x + v.y * v.y)
          if (len > 0) {
            const maxRadius = Math.min(len * 0.4, radius)
            const startX = current.x + (v.x / len) * maxRadius
            const startY = current.y + (v.y / len) * maxRadius
            path = `M ${startX.toFixed(3)}, ${startY.toFixed(3)}`
          } else {
            path = `M ${current.x.toFixed(3)}, ${current.y.toFixed(3)}`
          }
        } else {
          path = `M ${current.x.toFixed(3)}, ${current.y.toFixed(3)}`
        }
      }
      
      if (radius > 0) {
        path += ' ' + generateRoundedCorner(prev, current, next, radius)
      } else {
        if (i > 0) {
          path += ` L ${current.x.toFixed(3)}, ${current.y.toFixed(3)}`
        }
      }
    }
    
    path += ' Z'
    return path
  }, [points, globalRadius])

  // Memoize path generation
  const pathD = useMemo(() => generatePath(), [generatePath])

  // Handle point drag (mouse and touch support)
  const handlePointMouseDown = (e, pointId) => {
    e.stopPropagation()
    if (addMode && insertMode === 'after') {
      setInsertAfterPoint(pointId)
      setSelectedPoint(pointId)
      return
    }
    
    // Calculate offset between cursor and point center for smooth dragging
    const point = points.find(p => p.id === pointId)
    if (point) {
      const coords = getSvgCoordinates(e)
      dragOffset.current = {
        x: coords.x - point.x,
        y: coords.y - point.y
      }
    }
    
    isDragging.current = true
    setSelectedPoint(pointId)
  }

  // Handle touch start for mobile support
  const handlePointTouchStart = (e, pointId) => {
    e.preventDefault()
    handlePointMouseDown(e.touches[0], pointId)
  }

  // Smart point insertion - finds nearest edge and inserts point there
  const addPointSmart = (x, y) => {
    const newId = Math.max(...points.map(p => p.id), 0) + 1
    const newPoint = {
      id: newId,
      x: x,
      y: y,
      type: 'corner',
      radius: 0
    }
    
    // Find the nearest edge
    const nearestIndex = findNearestEdgeIndex(points, x, y)
    
    // Insert after the point at nearestIndex
    const newPoints = [...points]
    newPoints.splice(nearestIndex + 1, 0, newPoint)
    setPoints(newPoints)
    setSelectedPoint(newId)
  }

  // Handle adding point after a selected point
  const addPointAfter = (x, y) => {
    const newId = Math.max(...points.map(p => p.id), 0) + 1
    const newPoint = {
      id: newId,
      x: x,
      y: y,
      type: 'corner',
      radius: 0
    }
    
    if (insertAfterPoint !== null) {
      const index = points.findIndex(p => p.id === insertAfterPoint)
      const newPoints = [...points]
      newPoints.splice(index + 1, 0, newPoint)
      setPoints(newPoints)
      setInsertAfterPoint(newId)
    } else {
      setPoints([...points, newPoint])
      setInsertAfterPoint(newId)
    }
    setSelectedPoint(newId)
  }

  // Handle grid/canvas click for adding points
  const handleAddPoint = (x, y) => {
    if (!addMode) return
    
    if (insertMode === 'smart') {
      addPointSmart(x, y)
    } else {
      addPointAfter(x, y)
    }
  }

  // Handle canvas click for adding points anywhere
  const handleCanvasClick = (e) => {
    if (!addMode) return
    
    const coords = getSvgCoordinates(e)
    let x = Math.max(0, Math.min(1, coords.x))
    let y = Math.max(0, Math.min(1, coords.y))
    
    x = snapValue(x)
    y = snapValue(y)
    
    handleAddPoint(x, y)
  }

  // Handle mouse move on canvas (with performance throttling)
  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current || selectedPoint === null) return
    
    // Throttle updates for performance (max 60fps)
    const now = Date.now()
    if (now - lastUpdateRef.current < 16) return
    lastUpdateRef.current = now
    
    const coords = getSvgCoordinates(e)
    
    // Apply offset for smooth dragging (cursor stays at grab point)
    let x = coords.x - dragOffset.current.x
    let y = coords.y - dragOffset.current.y
    
    x = Math.max(0, Math.min(1, x))
    y = Math.max(0, Math.min(1, y))
    
    x = snapValue(x)
    y = snapValue(y)
    
    setPoints(prev => prev.map(p => 
      p.id === selectedPoint ? { ...p, x, y } : p
    ))
  }, [selectedPoint, snapValue, getSvgCoordinates, setPoints])

  // Handle touch move for mobile
  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      handleMouseMove(e.touches[0])
    }
  }, [handleMouseMove])

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      canvasContainerRef.current?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Add event listeners for both mouse and touch
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove])

  // Select next/previous point
  const selectNextPoint = useCallback((direction) => {
    if (points.length === 0) return
    if (selectedPoint === null) {
      setSelectedPoint(points[0].id)
      return
    }
    const currentIndex = points.findIndex(p => p.id === selectedPoint)
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % points.length 
      : (currentIndex - 1 + points.length) % points.length
    setSelectedPoint(points[newIndex].id)
  }, [points, selectedPoint])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      
      switch (e.key.toLowerCase()) {
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
          }
          break
        case 'y':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            redo()
          }
          break
        case 'delete':
        case 'backspace':
          if (selectedPoint && points.length > 3) {
            e.preventDefault()
            deletePoint()
          }
          break
        case 'a':
          e.preventDefault()
          setAddMode(prev => !prev)
          break
        case 's':
          e.preventDefault()
          setSnapToGrid(prev => !prev)
          break
        case 'g':
          e.preventDefault()
          setShowGridPoints(prev => !prev)
          break
        case 't':
          if (selectedPoint) {
            e.preventDefault()
            togglePointType()
          }
          break
        case 'escape':
          setSelectedPoint(null)
          setAddMode(false)
          break
        case 'tab':
          e.preventDefault()
          selectNextPoint(e.shiftKey ? 'prev' : 'next')
          break
        case 'arrowup':
          if (selectedPoint && e.ctrlKey) {
            e.preventDefault()
            movePointOrder('up')
          } else if (selectedPoint) {
            e.preventDefault()
            const step = snapToGrid ? 1/gridSize : 0.01
            updatePoint('y', Math.max(0, getPointById(selectedPoint).y - step))
          }
          break
        case 'arrowdown':
          if (selectedPoint && e.ctrlKey) {
            e.preventDefault()
            movePointOrder('down')
          } else if (selectedPoint) {
            e.preventDefault()
            const step = snapToGrid ? 1/gridSize : 0.01
            updatePoint('y', Math.min(1, getPointById(selectedPoint).y + step))
          }
          break
        case 'arrowleft':
          if (selectedPoint) {
            e.preventDefault()
            const step = snapToGrid ? 1/gridSize : 0.01
            updatePoint('x', Math.max(0, getPointById(selectedPoint).x - step))
          }
          break
        case 'arrowright':
          if (selectedPoint) {
            e.preventDefault()
            const step = snapToGrid ? 1/gridSize : 0.01
            updatePoint('x', Math.min(1, getPointById(selectedPoint).x + step))
          }
          break
        case '=':
        case '+':
          e.preventDefault()
          setGridSize(prev => Math.min(MAX_GRID, prev + 1))
          break
        case '-':
          e.preventDefault()
          setGridSize(prev => Math.max(MIN_GRID, prev - 1))
          break
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            copyCode()
          }
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPoint, points, snapToGrid, gridSize, selectNextPoint, undo, redo])

  // Delete selected point
  const deletePoint = () => {
    if (selectedPoint !== null && points.length > 3) {
      setPoints(points.filter(p => p.id !== selectedPoint))
      setSelectedPoint(null)
      if (insertAfterPoint === selectedPoint) {
        setInsertAfterPoint(null)
      }
    }
  }

  // Update selected point properties
  const updatePoint = (property, value) => {
    if (selectedPoint !== null) {
      setPoints(prev => prev.map(p => 
        p.id === selectedPoint ? { ...p, [property]: value } : p
      ))
    }
  }

  // Apply global radius to all points
  const applyGlobalRadius = () => {
    setPoints(prev => prev.map(p => ({ ...p, radius: globalRadius })))
  }

  // Reset all radii to 0
  const resetAllRadii = () => {
    setPoints(prev => prev.map(p => ({ ...p, radius: 0 })))
    setGlobalRadius(0)
  }

  // Toggle point type
  const togglePointType = () => {
    if (selectedPoint !== null) {
      setPoints(prev => prev.map(p => 
        p.id === selectedPoint 
          ? { ...p, type: p.type === 'corner' ? 'smooth' : 'corner' } 
          : p
      ))
    }
  }

  // Move point in order
  const movePointOrder = (direction) => {
    if (selectedPoint === null) return
    const index = points.findIndex(p => p.id === selectedPoint)
    if (index === -1) return
    
    const newIndex = direction === 'up' 
      ? (index - 1 + points.length) % points.length 
      : (index + 1) % points.length
    
    const newPoints = [...points]
    const [removed] = newPoints.splice(index, 1)
    newPoints.splice(newIndex, 0, removed)
    setPoints(newPoints)
  }

  // Generate SVG code
  const generateSvgCode = () => {
    const path = generatePath()
    return `<svg width="0" height="0">
  <defs>
    <clipPath id="${clipPathId}" clipPathUnits="objectBoundingBox">
      <path d="${path}" />
    </clipPath>
  </defs>
</svg>

/* CSS Usage */
.clipped-element {
  clip-path: url(#${clipPathId});
}`
  }

  // Copy to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCodeInFormat())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Save project to JSON file
  const saveProject = () => {
    const projectData = {
      version: '1.0',
      points,
      clipPathId,
      globalRadius,
      aspectRatio,
      gridSize,
      snapToGrid,
      showGridPoints,
      canvasHeight,
      savedAt: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(projectData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `clippath-${clipPathId}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Load project from JSON file
  const loadProject = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result)
        
        // Validate and load data
        if (projectData.points && Array.isArray(projectData.points)) {
          setPoints(projectData.points)
          resetHistory(projectData.points)
        }
        if (projectData.clipPathId) setClipPathId(projectData.clipPathId)
        if (projectData.globalRadius !== undefined) setGlobalRadius(projectData.globalRadius)
        if (projectData.aspectRatio) setAspectRatio(projectData.aspectRatio)
        if (projectData.gridSize) setGridSize(projectData.gridSize)
        if (projectData.snapToGrid !== undefined) setSnapToGrid(projectData.snapToGrid)
        if (projectData.showGridPoints !== undefined) setShowGridPoints(projectData.showGridPoints)
        if (projectData.canvasHeight) setCanvasHeight(projectData.canvasHeight)
        
        setSelectedPoint(null)
        setAddMode(false)
      } catch (err) {
        console.error('Failed to load project:', err)
        alert('Failed to load project. Please check if the file is valid.')
      }
    }
    reader.readAsText(file)
    
    // Reset input so same file can be loaded again
    event.target.value = ''
  }

  // Export as SVG file
  const exportSVG = () => {
    const path = pathD
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <clipPath id="${clipPathId}" clipPathUnits="objectBoundingBox">
      <path d="${path}" />
    </clipPath>
  </defs>
  
  <!-- Example usage with a rectangle -->
  <rect width="500" height="500" fill="url(#gradient)" clip-path="url(#${clipPathId})" transform="scale(500)" />
  
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>`
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${clipPathId}-${Date.now()}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Export as PNG file
  const exportPNG = async () => {
    const path = pathD
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" width="1000" height="1000">
  <defs>
    <clipPath id="${clipPathId}-export" clipPathUnits="objectBoundingBox">
      <path d="${path}" />
    </clipPath>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1" height="1" fill="url(#grad)" clip-path="url(#${clipPathId}-export)" />
</svg>`
    
    const canvas = document.createElement('canvas')
    canvas.width = 1000
    canvas.height = 1000
    const ctx = canvas.getContext('2d')
    
    const img = new Image()
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        const pngUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = `${clipPathId}-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(pngUrl)
        URL.revokeObjectURL(url)
      })
    }
    
    img.src = url
  }

  // Transform functions
  const scaleShape = (factor) => {
    const centerX = 0.5
    const centerY = 0.5
    
    const scaledPoints = points.map(p => ({
      ...p,
      x: centerX + (p.x - centerX) * factor,
      y: centerY + (p.y - centerY) * factor
    }))
    
    // Check if all points are within bounds
    const allInBounds = scaledPoints.every(p => 
      p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1
    )
    
    if (allInBounds) {
      setPoints(scaledPoints)
    } else {
      alert('Cannot scale: shape would exceed canvas bounds')
    }
  }

  const rotateShape = (degrees) => {
    const centerX = 0.5
    const centerY = 0.5
    const angle = (degrees * Math.PI) / 180
    
    const rotatedPoints = points.map(p => ({
      ...p,
      x: centerX + (p.x - centerX) * Math.cos(angle) - (p.y - centerY) * Math.sin(angle),
      y: centerY + (p.x - centerX) * Math.sin(angle) + (p.y - centerY) * Math.cos(angle)
    }))
    
    setPoints(rotatedPoints)
  }

  const flipHorizontal = () => {
    const flippedPoints = points.map(p => ({
      ...p,
      x: 1 - p.x
    }))
    setPoints(flippedPoints)
  }

  const flipVertical = () => {
    const flippedPoints = points.map(p => ({
      ...p,
      y: 1 - p.y
    }))
    setPoints(flippedPoints)
  }

  // Handle custom image upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomImages(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    }
    
    // Reset input
    event.target.value = ''
  }

  // Zoom controls
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 4))
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const resetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Theme toggle
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Apply snapping logic
  const applySnapping = useCallback((x, y) => {
    let snappedX = x
    let snappedY = y
    const snapDistance = 0.02

    // Snap to grid
    if (snapToGrid) {
      const step = 1 / gridSize
      snappedX = Math.round(x / step) * step
      snappedY = Math.round(y / step) * step
    }

    // Snap to other points
    if (snapToPoints) {
      for (const point of points) {
        if (Math.abs(point.x - x) < snapDistance) snappedX = point.x
        if (Math.abs(point.y - y) < snapDistance) snappedY = point.y
      }
    }

    // Snap to center
    if (snapToCenter) {
      if (Math.abs(0.5 - x) < snapDistance) snappedX = 0.5
      if (Math.abs(0.5 - y) < snapDistance) snappedY = 0.5
    }

    return { x: snappedX, y: snappedY }
  }, [snapToGrid, snapToPoints, snapToCenter, gridSize, points])

  // Generate code in different formats
  const generateCodeInFormat = useCallback(() => {
    const path = pathD
    
    switch (codeFormat) {
      case 'svg':
        return `<svg width="0" height="0">
  <defs>
    <clipPath id="${clipPathId}" clipPathUnits="objectBoundingBox">
      <path d="${path}" />
    </clipPath>
  </defs>
</svg>

/* CSS Usage */
.clipped-element {
  clip-path: url(#${clipPathId});
}`
      
      case 'css':
        // Convert SVG path to CSS polygon (approximation)
        const polygonPoints = points.map(p => 
          `${(p.x * 100).toFixed(1)}% ${(p.y * 100).toFixed(1)}%`
        ).join(', ')
        return `/* CSS Polygon (approximation) */
.clipped-element {
  clip-path: polygon(${polygonPoints});
}`
      
      case 'react':
        return `// React Component
import React from 'react';

export const ClipPathSVG = () => (
  <svg width="0" height="0">
    <defs>
      <clipPath id="${clipPathId}" clipPathUnits="objectBoundingBox">
        <path d="${path}" />
      </clipPath>
    </defs>
  </svg>
);

// Usage in styled component or inline style
const StyledDiv = styled.div\`
  clip-path: url(#${clipPathId});
\`;

// Or with inline style
<div style={{ clipPath: 'url(#${clipPathId})' }}>
  {/* Your content */}
</div>`
      
      default:
        return generateSvgCode()
    }
  }, [codeFormat, pathD, clipPathId, points])

  // Generate shareable link
  const generateShareLink = () => {
    const data = {
      points,
      clipPathId,
      globalRadius,
      aspectRatio
    }
    const encoded = btoa(JSON.stringify(data))
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Share on social media
  const shareOnTwitter = () => {
    const data = {
      points,
      clipPathId,
      globalRadius,
      aspectRatio
    }
    const encoded = btoa(JSON.stringify(data))
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`
    const text = `Check out my custom SVG clip-path design!`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank')
  }

  const shareOnLinkedIn = () => {
    const data = {
      points,
      clipPathId,
      globalRadius,
      aspectRatio
    }
    const encoded = btoa(JSON.stringify(data))
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedInUrl, '_blank')
  }

  const shareOnFacebook = () => {
    const data = {
      points,
      clipPathId,
      globalRadius,
      aspectRatio
    }
    const encoded = btoa(JSON.stringify(data))
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank')
  }

  // Export as WebP
  const exportWebP = async (size = 1000) => {
    const path = pathD
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" width="${size}" height="${size}">
  <defs>
    <clipPath id="${clipPathId}-export" clipPathUnits="objectBoundingBox">
      <path d="${path}" />
    </clipPath>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${previewColors.gradient1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${previewColors.gradient2};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1" height="1" fill="url(#grad)" clip-path="url(#${clipPathId}-export)" />
</svg>`
    
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    
    const img = new Image()
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        const webpUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = webpUrl
        link.download = `${clipPathId}-${size}x${size}-${Date.now()}.webp`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(webpUrl)
        URL.revokeObjectURL(url)
      }, 'image/webp', 0.95)
    }
    
    img.src = url
  }

  // Export PNG with custom size
  const exportPNGWithSize = async (size = 1000) => {
    const path = pathD
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" width="${size}" height="${size}">
  <defs>
    <clipPath id="${clipPathId}-export" clipPathUnits="objectBoundingBox">
      <path d="${path}" />
    </clipPath>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${previewColors.gradient1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${previewColors.gradient2};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1" height="1" fill="url(#grad)" clip-path="url(#${clipPathId}-export)" />
</svg>`
    
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    
    const img = new Image()
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        const pngUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = `${clipPathId}-${size}x${size}-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(pngUrl)
        URL.revokeObjectURL(url)
      })
    }
    
    img.src = url
  }

  // Copy code in specific format
  const copyCodeFormat = async (format) => {
    const path = pathD
    let code = ''
    
    switch (format) {
      case 'svg':
        code = `<svg width="0" height="0">
  <defs>
    <clipPath id="${clipPathId}" clipPathUnits="objectBoundingBox">
      <path d="${path}" />
    </clipPath>
  </defs>
</svg>`
        break
      case 'css':
        code = `.clipped-element {
  clip-path: url(#${clipPathId});
}`
        break
      case 'polygon':
        const polygonPoints = points.map(p => 
          `${(p.x * 100).toFixed(1)}% ${(p.y * 100).toFixed(1)}%`
        ).join(', ')
        code = `.clipped-element {
  clip-path: polygon(${polygonPoints});
}`
        break
      case 'react':
        code = `export const ClipPathSVG = () => (
  <svg width="0" height="0">
    <defs>
      <clipPath id="${clipPathId}" clipPathUnits="objectBoundingBox">
        <path d="${path}" />
      </clipPath>
    </defs>
  </svg>
)`
        break
      case 'path':
        code = path
        break
      default:
        code = generateCodeInFormat()
    }
    
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Load from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const dataParam = urlParams.get('data')
    if (dataParam) {
      try {
        const decoded = JSON.parse(atob(dataParam))
        if (decoded.points) {
          setPoints(decoded.points)
          resetHistory(decoded.points)
        }
        if (decoded.clipPathId) setClipPathId(decoded.clipPathId)
        if (decoded.globalRadius !== undefined) setGlobalRadius(decoded.globalRadius)
        if (decoded.aspectRatio) setAspectRatio(decoded.aspectRatio)
      } catch (err) {
        console.error('Failed to load shared data:', err)
      }
    }
  }, [])

  const selectedPointData = selectedPoint !== null ? getPointById(selectedPoint) : null

  // Generate grid intersection points (memoized for performance)
  const gridPoints = useMemo(() => {
    const points = []
    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        points.push({
          x: i / gridSize,
          y: j / gridSize,
          isEdge: i === 0 || i === gridSize || j === 0 || j === gridSize,
          isMajor: i % 5 === 0 && j % 5 === 0
        })
      }
    }
    return points
  }, [gridSize])

  // Calculate canvas dimensions based on aspect ratio
  const ar = ASPECT_RATIOS[aspectRatio]
  const aspectRatioValue = ar.width / ar.height

  // Theme colors
  const themeColors = theme === 'dark' ? {
    bg: '#0f1117',
    sidebar: '#161922',
    card: '#1c2029',
    border: '#252a36',
    input: '#252a36',
    text: 'white',
    textMuted: 'slate-400'
  } : {
    bg: '#f8fafc',
    sidebar: '#ffffff',
    card: '#f1f5f9',
    border: '#e2e8f0',
    input: '#ffffff',
    text: '#0f172a',
    textMuted: 'slate-600'
  }

  return (
    <main className={`min-h-screen transition-colors duration-300`} style={{ backgroundColor:themeColors.bg, color: themeColors.text }}>
      <h1 className="sr-only">Free Clip Path Editor Online & SVG Path Generator</h1>
      <div className="flex h-screen relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl shadow-lg transition-all ${isFullscreen ? 'hidden' : ''}`}
          style={{ backgroundColor: themeColors.sidebar, border: `1px solid ${themeColors.border}` }}
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>

        {/* Left Sidebar - Controls */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 p-4 sm:p-5 overflow-y-auto shrink-0 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isFullscreen ? 'hidden' : ''}`} style={{ backgroundColor: themeColors.sidebar, borderRight: `1px solid ${themeColors.border}` }} aria-label="Editor Controls">
          <header className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{theme === 'dark' ? '🌙' : '☀️'} SVGCanvas</h2>
              <p className={`text-${themeColors.textMuted} text-xs mt-1`}>Create stunning clip-path masks</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-opacity-80 transition-all"
                style={{ backgroundColor: themeColors.card }}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-opacity-80 transition-all lg:hidden"
                style={{ backgroundColor: themeColors.card }}
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>
          </header>
          
          {/* Shape Presets */}
          <div className="mb-5">
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Shape Presets</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(SHAPE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => loadPreset(key)}
                  className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-medium transition-all duration-200`}
                  aria-label={`Load ${preset.name} preset`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Undo/Redo Controls */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>History</h2>
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`flex-1 px-4 py-2.5 ${themeColors.buttonBg} ${themeColors.buttonHover} disabled:opacity-40 disabled:cursor-not-allowed border ${themeColors.border} rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
                aria-label="Undo last action"
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`flex-1 px-4 py-2.5 ${themeColors.buttonBg} ${themeColors.buttonHover} disabled:opacity-40 disabled:cursor-not-allowed border ${themeColors.border} rounded-xl text-xs  font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
                aria-label="Redo last undone action"
                title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                </svg>
                Redo
              </button>
            </div>
          </div>

          {/* Save/Load & Export */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Project & Export</h2>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={saveProject}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Save project as JSON"
                  title="Save project configuration"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save
                </button>
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".json"
                    onChange={loadProject}
                    className="hidden"
                  />
                  <div className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    role="button"
                    aria-label="Load project from JSON"
                    title="Load project configuration"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Load
                  </div>
                </label>
              </div>

              <div className={`text-xs ${themeColors.textSecondary} font-semibold mt-3 mb-1`}>Export as Image</div>
              <div className="flex gap-2">
                <button
                  onClick={exportSVG}
                  className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Export as SVG file"
                  title="Download as SVG"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  SVG
                </button>
                <button
                  onClick={() => exportPNGWithSize(1000)}
                  className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Export as PNG file"
                  title="Download as PNG (1000x1000)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  PNG
                </button>
                <button
                  onClick={() => exportWebP(1000)}
                  className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Export as WebP file"
                  title="Download as WebP (1000x1000)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  WebP
                </button>
              </div>

              <div className={`text-xs ${themeColors.textSecondary} mt-2 mb-1`}>Export Sizes (PNG/WebP)</div>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => exportPNGWithSize(512)}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Export PNG 512x512"
                >
                  512px
                </button>
                <button
                  onClick={() => exportPNGWithSize(1024)}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Export PNG 1024x1024"
                >
                  1024px
                </button>
                <button
                  onClick={() => exportPNGWithSize(2048)}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Export PNG 2048x2048"
                >
                  2K
                </button>
                <button
                  onClick={() => exportPNGWithSize(4096)}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Export PNG 4096x4096"
                >
                  4K
                </button>
              </div>

              <div className={`text-xs ${themeColors.textSecondary} font-semibold mt-3 mb-1`}>Copy Code</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => copyCodeFormat('svg')}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Copy SVG clip-path code"
                >
                  SVG
                </button>
                <button
                  onClick={() => copyCodeFormat('css')}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Copy CSS clip-path code"
                >
                  CSS
                </button>
                <button
                  onClick={() => copyCodeFormat('react')}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Copy React component"
                >
                  React
                </button>
                <button
                  onClick={() => copyCodeFormat('polygon')}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all`}
                  title="Copy CSS polygon"
                >
                  Polygon
                </button>
                <button
                  onClick={() => copyCodeFormat('path')}
                  className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded text-xs transition-all col-span-2`}
                  title="Copy path data only"
                >
                  {copied ? '✓ Copied!' : 'Path Data'}
                </button>
              </div>

              <p className={`text-xs ${themeColors.textSecondary} text-center mt-2`}>Export images or copy code snippets</p>
            </div>
          </div>

          {/* Transform Tools */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Transform</h2>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Scale</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => scaleShape(0.9)}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Scale down 10%"
                  >
                    90%
                  </button>
                  <button
                    onClick={() => scaleShape(0.95)}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Scale down 5%"
                  >
                    95%
                  </button>
                  <button
                    onClick={() => scaleShape(1.05)}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Scale up 5%"
                  >
                    105%
                  </button>
                  <button
                    onClick={() => scaleShape(1.1)}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Scale up 10%"
                  >
                    110%
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Rotate</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => rotateShape(-90)}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all flex items-center justify-center`}
                    title="Rotate 90° counter-clockwise"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => rotateShape(-45)}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Rotate 45° counter-clockwise"
                  >
                    -45°
                  </button>
                  <button
                    onClick={() => rotateShape(45)}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                    title="Rotate 45° clockwise"
                  >
                    45°
                  </button>
                  <button
                    onClick={() => rotateShape(90)}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all flex items-center justify-center`}
                    title="Rotate 90° clockwise"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Flip</label>
                <div className="flex gap-2">
                  <button
                    onClick={flipHorizontal}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2`}
                    title="Flip horizontally"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Horizontal
                  </button>
                  <button
                    onClick={flipVertical}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2`}
                    title="Flip vertically"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Vertical
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Customization */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Preview Colors</h2>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Gradient Start</label>
                <input
                  type="color"
                  value={previewColors.gradient1}
                  onChange={(e) => setPreviewColors(prev => ({ ...prev, gradient1: e.target.value }))}
                  className={`w-full h-10 rounded-lg cursor-pointer ${themeColors.buttonBg} border ${themeColors.border}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Gradient End</label>
                <input
                  type="color"
                  value={previewColors.gradient2}
                  onChange={(e) => setPreviewColors(prev => ({ ...prev, gradient2: e.target.value }))}
                  className={`w-full h-10 rounded-lg cursor-pointer ${themeColors.buttonBg} border ${themeColors.border}`}
                />
              </div>
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Solid Color</label>
                <input
                  type="color"
                  value={previewColors.solid}
                  onChange={(e) => setPreviewColors(prev => ({ ...prev, solid: e.target.value }))}
                  className={`w-full h-10 rounded-lg cursor-pointer ${themeColors.buttonBg} border ${themeColors.border}`}
                />
              </div>
            </div>
          </div>

          {/* Custom Image Upload */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Custom Images</h2>
            
            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className={`px-4 py-2.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Image
                </div>
              </label>
              <p className={`text-xs ${themeColors.textSecondary} text-center`}>Upload custom images for preview</p>
            </div>
          </div>

          {/* Zoom & Pan Controls */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Zoom & Pan</h2>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Zoom: {(zoom * 100).toFixed(0)}%</label>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={zoomOut}
                    disabled={zoom <= 0.5}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} disabled:opacity-40 disabled:cursor-not-allowed border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.25"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-[#252a36] rounded-full appearance-none cursor-pointer accent-blue-500"
                  />
                  <button
                    onClick={zoomIn}
                    disabled={zoom >= 4}
                    className={`px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} disabled:opacity-40 disabled:cursor-not-allowed border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                onClick={resetZoom}
                className={`w-full px-4 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-semibold transition-all`}
              >
                Reset View
              </button>
            </div>
          </div>

          {/* Snapping Options */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Snapping</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-xs cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={(e) => setSnapToGrid(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 ${themeColors.buttonBg} rounded-full peer-checked:bg-blue-600 transition-all duration-200`}></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span className={`${themeColors.text} group-hover:text-white transition-colors`}>Snap to Grid</span>
              </label>
              
              <label className="flex items-center gap-3 text-xs cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={snapToPoints}
                    onChange={(e) => setSnapToPoints(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 ${themeColors.buttonBg} rounded-full peer-checked:bg-blue-600 transition-all duration-200`}></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span className={`${themeColors.text} group-hover:text-white transition-colors`}>Snap to Points</span>
              </label>
              
              <label className="flex items-center gap-3 text-xs cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={snapToCenter}
                    onChange={(e) => setSnapToCenter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 ${themeColors.buttonBg} rounded-full peer-checked:bg-blue-600 transition-all duration-200`}></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span className={`${themeColors.text} group-hover:text-white transition-colors`}>Snap to Center</span>
              </label>
            </div>
          </div>

          {/* Code Format Options */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Code Format</h2>
            
            <div className="space-y-2">
              <button
                onClick={() => setCodeFormat('svg')}
                className={`w-full px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  codeFormat === 'svg' 
                    ? 'bg-blue-600 text-white' 
                    : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                }`}
              >
                SVG Clip-Path
              </button>
              <button
                onClick={() => setCodeFormat('css')}
                className={`w-full px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  codeFormat === 'css' 
                    ? 'bg-blue-600 text-white' 
                    : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                }`}
              >
                CSS Polygon
              </button>
              <button
                onClick={() => setCodeFormat('react')}
                className={`w-full px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  codeFormat === 'react' 
                    ? 'bg-blue-600 text-white' 
                    : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                }`}
              >
                React Component
              </button>
            </div>
          </div>

          {/* Share Link */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Share</h2>
            
            <div className="space-y-2">
              <button
                onClick={generateShareLink}
                className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {copied ? '✓ Link Copied!' : 'Copy Share Link'}
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={shareOnTwitter}
                  className="px-3 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1"
                  title="Share on Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="hidden sm:inline">Twitter</span>
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="px-3 py-2 bg-[#0077B5] hover:bg-[#006399] rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1"
                  title="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="hidden sm:inline">LinkedIn</span>
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="px-3 py-2 bg-[#1877F2] hover:bg-[#166fe5] rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1"
                  title="Share on Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="hidden sm:inline">Facebook</span>
                </button>
              </div>
            </div>
            <p className={`text-xs ${themeColors.textSecondary} text-center mt-2`}>Share your design with others</p>
          </div>

          {/* Canvas Settings */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Canvas Size</h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {Object.keys(ASPECT_RATIOS).map((key) => (
                    <button
                      key={key}
                      onClick={() => setAspectRatio(key)}
                      className={`px-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        aspectRatio === key 
                          ? 'bg-blue-600 text-white' 
                          : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="canvas-height" className={`block text-xs ${themeColors.textSecondary} mb-2`}>Height: <span className={themeColors.text}>{canvasHeight}px</span></label>
                <input
                  id="canvas-height"
                  type="range"
                  min="300"
                  max="800"
                  step="50"
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#252a36] rounded-full appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Canvas height in pixels"
                />
              </div>
              
              <button
                onClick={toggleFullscreen}
                className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label={isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>

          {/* Grid Settings */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Grid Settings</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-xs cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={(e) => setSnapToGrid(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Snap to grid"
                  />
                  <div className={`w-9 h-5 ${themeColors.buttonBg} rounded-full peer-checked:bg-blue-600 transition-all duration-200`}></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span className={`${themeColors.text} group-hover:text-white transition-colors`}>Snap to Grid</span>
              </label>
              
              <label className="flex items-center gap-3 text-xs cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showGridPoints}
                    onChange={(e) => setShowGridPoints(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 ${themeColors.buttonBg} rounded-full peer-checked:bg-blue-600 transition-all duration-200`}></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span className={`${themeColors.text} group-hover:text-white transition-colors`}>Show Grid Points</span>
              </label>
              
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>Grid Divisions: <span className={themeColors.text}>{gridSize}×{gridSize}</span></label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setGridSize(prev => Math.max(MIN_GRID, prev - 5))}
                    className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-bold transition-all`}
                  >
                    −5
                  </button>
                  <button
                    onClick={() => setGridSize(prev => Math.max(MIN_GRID, prev - 1))}
                    className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-bold transition-all`}
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min={MIN_GRID}
                    max={MAX_GRID}
                    value={gridSize}
                    onChange={(e) => setGridSize(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-[#252a36] rounded-full appearance-none cursor-pointer accent-blue-500"
                  />
                  <button
                    onClick={() => setGridSize(prev => Math.min(MAX_GRID, prev + 1))}
                    className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-bold transition-all`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => setGridSize(prev => Math.min(MAX_GRID, prev + 5))}
                    className={`px-2 py-1.5 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-bold transition-all`}
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Points Mode */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Point Tools</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setAddMode(!addMode)
                  if (!addMode) {
                    setInsertAfterPoint(points[points.length - 1]?.id || null)
                  }
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  addMode 
                    ? 'bg-emerald-600 text-white' 
                    : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                }`}
              >
                {addMode ? '✓ Add Mode ON' : '+ Enable Add Mode'}
              </button>
              
              {addMode && (
                <>
                  <div className={`text-xs ${themeColors.textSecondary} mb-2`}>Insert Mode:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInsertMode('smart')}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        insertMode === 'smart' 
                          ? 'bg-emerald-600 text-white' 
                          : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                      }`}
                    >
                      🎯 Smart Edge
                    </button>
                    <button
                      onClick={() => setInsertMode('after')}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        insertMode === 'after' 
                          ? 'bg-emerald-600 text-white' 
                          : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                      }`}
                    >
                      ➡️ After Point
                    </button>
                  </div>
                  
                  <div className="text-xs bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    {insertMode === 'smart' ? (
                      <>
                        <p className="font-semibold text-emerald-400 mb-1">Smart Edge Mode</p>
                        <p className="text-emerald-300/80">Click anywhere - point will be inserted on the nearest edge of the shape automatically!</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-emerald-400 mb-1">After Point Mode</p>
                        <p className="text-emerald-300/80">Click a point first, then click canvas to insert after it.</p>
                      </>
                    )}
                  </div>
                </>
              )}
              
              <button
                onClick={deletePoint}
                disabled={!selectedPoint || points.length <= 3}
                className={`w-full px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-semibold transition-all duration-200`}
              >
                Delete Selected Point
              </button>

              {selectedPoint && (
                <div className="flex gap-2">
                  <button
                    onClick={() => movePointOrder('up')}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-medium transition-all`}
                  >
                    ↑ Move Up
                  </button>
                  <button
                    onClick={() => movePointOrder('down')}
                    className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-medium transition-all`}
                  >
                    ↓ Move Down
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Corner Rounding */}
          <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>Corner Rounding</h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>
                  Global Radius: <span className="text-amber-400 font-medium">{(globalRadius * 100).toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.3"
                  step="0.005"
                  value={globalRadius}
                  onChange={(e) => setGlobalRadius(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#252a36] rounded-full appearance-none cursor-pointer accent-amber-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={applyGlobalRadius}
                  className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs font-semibold transition-all duration-200"
                >
                  Apply to All
                </button>
                <button
                  onClick={resetAllRadii}
                  className={`flex-1 px-3 py-2 ${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border} rounded-lg text-xs font-medium transition-all`}
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          {/* Selected Point Properties */}
          {selectedPointData && (
            <div className="mb-5 p-4 bg-[#1a2332] rounded-xl border border-blue-500/30">
              <h2 className="text-xs font-semibold mb-3 text-blue-400 uppercase tracking-wider">
                Point #{points.findIndex(p => p.id === selectedPoint) + 1}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs ${themeColors.textSecondary} mb-1.5`}>X Position</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedPointData.x.toFixed(2)}
                      onChange={(e) => updatePoint('x', Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)))}
                      className={`w-full px-3 py-2 ${themeColors.inputBg} rounded-lg text-xs border ${themeColors.border} focus:border-blue-500 focus:outline-none transition-all`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs ${themeColors.textSecondary} mb-1.5`}>Y Position</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedPointData.y.toFixed(2)}
                      onChange={(e) => updatePoint('y', Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)))}
                      className={`w-full px-3 py-2 ${themeColors.inputBg} rounded-lg text-xs border ${themeColors.border} focus:border-blue-500 focus:outline-none transition-all`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-xs ${themeColors.textSecondary} mb-2`}>
                    Point Radius: <span className="text-purple-400 font-medium">{(selectedPointData.radius * 100).toFixed(0)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.3"
                    step="0.005"
                    value={selectedPointData.radius}
                    onChange={(e) => updatePoint('radius', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#252a36] rounded-full appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
                
                <button
                  onClick={togglePointType}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    selectedPointData.type === 'smooth'
                      ? 'bg-purple-600 text-white'
                      : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                  }`}
                >
                  Type: {selectedPointData.type === 'smooth' ? '● Smooth' : '■ Corner'}
                </button>
              </div>
            </div>
          )}

          {!selectedPointData && !addMode && (
            <div className={`mb-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
              <p className={`text-xs ${themeColors.textSecondary} text-center`}>
                Click a point to select and edit it
              </p>
            </div>
          )}

          {/* ClipPath ID */}
          <div className="mb-5">
            <label htmlFor="clippath-id" className={`block text-xs ${themeColors.textSecondary} mb-2`}>ClipPath ID</label>
            <input
              id="clippath-id"
              type="text"
              value={clipPathId}
              onChange={(e) => setClipPathId(e.target.value.replace(/\s/g, ''))}
              className={`w-full px-4 py-2.5 ${themeColors.inputBg} rounded-xl text-sm border ${themeColors.border} focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              placeholder="customClip"
              aria-label="ClipPath ID for SVG element"
            />
          </div>

          {/* Copy Button */}
          <button
            onClick={copyCode}
            className={`w-full px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              copied 
                ? 'bg-emerald-600' 
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
            aria-label={copied ? 'SVG code copied to clipboard' : 'Copy SVG code to clipboard'}
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy SVG Code'}
          </button>

          {/* Keyboard Shortcuts */}
          <div className={`mt-5 p-4 ${themeColors.sidebarSection} rounded-xl border ${themeColors.border}`}>
            <h2 className={`text-xs font-semibold mb-3 ${themeColors.textSecondary} uppercase tracking-wider`}>⌨️ Shortcuts</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Undo</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>Ctrl+Z</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Redo</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>Ctrl+Y</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Add Mode</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>A</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Snap Grid</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>S</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Show Grid</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>G</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Toggle Type</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>T</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Delete Point</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>Del</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Deselect</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>Esc</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeColors.textSecondary}>Next Point</span>
                <kbd className={`${themeColors.buttonBg} px-2 py-0.5 rounded-md ${themeColors.text} font-mono text-[10px]`}>Tab</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Prev Point</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">⇧Tab</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Move Point</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">↑↓←→</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Reorder</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">Ctrl+↑↓</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Grid +/-</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">+ -</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Fullscreen</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">F</kbd>
              </div>
              <div className="flex justify-between items-center col-span-2">
                <span className="text-slate-500">Copy Code</span>
                <kbd className="bg-[#252a36] px-2 py-0.5 rounded-md text-slate-300 font-mono text-[10px]">Ctrl+C</kbd>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Canvas */}
        <section className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-auto ${themeColors.mainBg} ${isFullscreen ? 'p-4!' : ''}`} aria-label="Main Editor Canvas">
          <div className={`mx-auto ${isFullscreen ? 'max-w-full h-full' : 'max-w-5xl'}`}>
            {/* Canvas Container */}
            <div 
              ref={canvasContainerRef}
              className={`${themeColors.cardBg} rounded-2xl p-3 sm:p-5 mb-6 sm:mb-8 border ${themeColors.border} ${isFullscreen ? 'h-full flex flex-col' : ''}`}
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-2">
                <h2 className={`text-sm font-semibold ${themeColors.text}`}>
                  Editor Canvas 
                  <span className={`ml-2 ${themeColors.textSecondary} font-normal`}>({aspectRatio})</span>
                </h2>
                <div className="flex gap-5 text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className={themeColors.textSecondary}>Corner</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    <span className={themeColors.textSecondary}>Smooth</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-slate-400">Selected</span>
                  </span>
                  {addMode && insertMode === 'after' && (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-slate-400">Insert After</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div 
                className={`relative bg-[#0a0b0f] rounded-xl overflow-hidden border-2 border-[#252a36] mx-auto ${isFullscreen ? 'flex-1' : ''}`}
                style={{ 
                  aspectRatio: `${ar.width}/${ar.height}`,
                  maxHeight: isFullscreen ? 'calc(100vh - 120px)' : `${canvasHeight}px`,
                  width: isFullscreen ? 'auto' : '100%',
                  maxWidth: '100%'
                }}
              >
                <svg
                  ref={svgRef}
                  viewBox="0 0 1 1"
                  className={`w-full h-full ${addMode ? 'cursor-crosshair' : 'cursor-default'}`}
                  preserveAspectRatio="xMidYMid meet"
                  onClick={handleCanvasClick}
                  role="application"
                  aria-label="SVGCanvas editor canvas. Use arrow keys to move selected point, Tab to select next point."
                >
                  {/* Background */}
                  <rect width="1" height="1" fill="#0a0a0f" />
                  
                  {/* Grid lines */}
                  {Array.from({ length: gridSize + 1 }).map((_, i) => (
                    <g key={`grid-${i}`}>
                      <line
                        x1={i / gridSize}
                        y1="0"
                        x2={i / gridSize}
                        y2="1"
                        stroke={i % 5 === 0 ? '#2d3748' : '#1a202c'}
                        strokeWidth={i % 5 === 0 ? '0.003' : '0.001'}
                      />
                      <line
                        x1="0"
                        y1={i / gridSize}
                        x2="1"
                        y2={i / gridSize}
                        stroke={i % 5 === 0 ? '#2d3748' : '#1a202c'}
                        strokeWidth={i % 5 === 0 ? '0.003' : '0.001'}
                      />
                    </g>
                  ))}
                  
                  {/* Center lines */}
                  <line x1="0.5" y1="0" x2="0.5" y2="1" stroke="#3b82f6" strokeWidth="0.002" opacity="0.3" />
                  <line x1="0" y1="0.5" x2="1" y2="0.5" stroke="#3b82f6" strokeWidth="0.002" opacity="0.3" />
                  
                  {/* Grid intersection points */}
                  {showGridPoints && gridPoints.map((gp, idx) => (
                    <circle
                      key={`gp-${idx}`}
                      cx={gp.x}
                      cy={gp.y}
                      r={gp.isMajor ? '0.012' : gp.isEdge ? '0.008' : '0.006'}
                      fill={gp.isMajor ? '#4a5568' : '#2d3748'}
                      className={addMode ? 'cursor-pointer hover:fill-green-400 transition-colors duration-150' : ''}
                      style={{ pointerEvents: addMode ? 'auto' : 'none' }}
                      onClick={(e) => {
                        if (addMode) {
                          e.stopPropagation()
                          handleAddPoint(gp.x, gp.y)
                        }
                      }}
                    />
                  ))}
                  
                  {/* Shape fill */}
                  <path
                    d={pathD}
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="none"
                  />
                  
                  {/* Shape outline */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="0.005"
                  />
                  
                  {/* Edge highlight when in smart add mode */}
                  {addMode && insertMode === 'smart' && (
                    points.map((point, index) => {
                      const nextPoint = points[(index + 1) % points.length]
                      return (
                        <line
                          key={`edge-${index}`}
                          x1={point.x}
                          y1={point.y}
                          x2={nextPoint.x}
                          y2={nextPoint.y}
                          stroke="#22c55e"
                          strokeWidth="0.008"
                          opacity="0.4"
                          strokeLinecap="round"
                        />
                      )
                    })
                  )}
                  
                  {/* Connection lines between points (dashed) */}
                  {points.map((point, index) => {
                    const nextPoint = points[(index + 1) % points.length]
                    return (
                      <line
                        key={`conn-${index}`}
                        x1={point.x}
                        y1={point.y}
                        x2={nextPoint.x}
                        y2={nextPoint.y}
                        stroke="#60a5fa"
                        strokeWidth="0.002"
                        strokeDasharray="0.01 0.006"
                        opacity="0.5"
                      />
                    )
                  })}
                  
                  {/* Points */}
                  {points.map((point, index) => {
                    const isSelected = selectedPoint === point.id
                    const isInsertPoint = insertAfterPoint === point.id && insertMode === 'after'
                    const radius = point.radius + globalRadius
                    
                    return (
                      <g key={point.id}>
                        {/* Radius indicator circle */}
                        {radius > 0 && (
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={Math.min(radius, 0.15)}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="0.002"
                            strokeDasharray="0.008 0.004"
                            opacity="0.6"
                          />
                        )}
                        
                        {/* Point number badge */}
                        <g transform={`translate(${point.x + 0.025}, ${point.y - 0.03})`}>
                          <rect
                            x="-0.012"
                            y="-0.016"
                            width="0.024"
                            height="0.022"
                            rx="0.004"
                            fill="#1f2937"
                            stroke="#4b5563"
                            strokeWidth="0.001"
                          />
                          <text
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#9ca3af"
                            fontSize="0.022"
                            fontFamily="system-ui"
                            y="0.002"
                          >
                            {index + 1}
                          </text>
                        </g>
                        
                        {/* Point outer glow for selected */}
                        {isSelected && (
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="0.035"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="0.004"
                            opacity="0.5"
                          />
                        )}
                        
                        {/* Insert indicator */}
                        {addMode && isInsertPoint && (
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="0.04"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="0.003"
                            strokeDasharray="0.008 0.004"
                          />
                        )}
                        
                        {/* Main point handle */}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="0.022"
                          fill={
                            isSelected 
                              ? '#3b82f6' 
                              : point.type === 'smooth' 
                                ? '#a855f7' 
                                : '#ef4444'
                          }
                          stroke="#fff"
                          strokeWidth="0.004"
                          className="cursor-move transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onMouseDown={(e) => handlePointMouseDown(e, point.id)}
                          onTouchStart={(e) => handlePointTouchStart(e, point.id)}
                          tabIndex={0}
                          role="button"
                          aria-label={`Point ${index + 1}: ${point.type === 'smooth' ? 'Smooth' : 'Corner'} point at position ${point.x.toFixed(2)}, ${point.y.toFixed(2)}`}
                        />
                        
                        {/* Corner/Smooth indicator inside point */}
                        {point.type === 'smooth' ? (
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="0.008"
                            fill="#fff"
                            pointerEvents="none"
                          />
                        ) : (
                          <rect
                            x={point.x - 0.006}
                            y={point.y - 0.006}
                            width="0.012"
                            height="0.012"
                            fill="#fff"
                            pointerEvents="none"
                          />
                        )}
                      </g>
                    )
                  })}
                </svg>
              </div>
              
              {/* Coordinate labels */}
              <div className="mt-3 flex justify-between text-xs text-slate-600 px-1">
                <span className="font-mono">0,0</span>
                <span className="text-slate-500">
                  {gridSize}×{gridSize} grid {snapToGrid && '• Snap ON'}
                  {addMode && ` • ${insertMode === 'smart' ? 'Smart Edge' : 'After Point'} mode`}
                </span>
                <span className="font-mono">1,1</span>
              </div>
            </div>

            {/* Preview Section */}
            {!isFullscreen && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8">
                  {/* Live Preview */}
                  <div className={`${themeColors.cardBg} rounded-2xl p-4 sm:p-5 border ${themeColors.border}`}>
                    <h2 className={`text-sm font-semibold mb-4 ${themeColors.text}`}>Live Preview</h2>
                    
                    <svg width="0" height="0">
                      <defs>
                        <clipPath id="livePreview" clipPathUnits="objectBoundingBox">
                          <path d={pathD} />
                        </clipPath>
                      </defs>
                    </svg>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-xs ${themeColors.textSecondary} mb-2`}>Gradient</p>
                        <div
                          className="aspect-square rounded-xl"
                          style={{ 
                            clipPath: 'url(#livePreview)',
                            background: `linear-gradient(135deg, ${previewColors.gradient1} 0%, ${previewColors.gradient2} 100%)`
                          }}
                        />
                      </div>
                      <div>
                        <p className={`text-xs ${themeColors.textSecondary} mb-2`}>Solid</p>
                        <div
                          className="aspect-square rounded-xl"
                          style={{ 
                            clipPath: 'url(#livePreview)',
                            backgroundColor: previewColors.solid
                          }}
                        />
                      </div>
                      {customImages.map((img, idx) => (
                        <div key={idx}>
                          <p className={`text-xs ${themeColors.textSecondary} mb-2`}>Image {idx + 1}</p>
                          <div
                            className="aspect-square bg-cover bg-center rounded-xl"
                            style={{ 
                              clipPath: 'url(#livePreview)',
                              backgroundImage: `url(${img})`
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Code Output */}
                  <div className={`${themeColors.cardBg} rounded-2xl p-4 sm:p-5 border ${themeColors.border}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className={`text-sm font-semibold ${themeColors.text}`}>Generated Code ({codeFormat.toUpperCase()})</h2>
                      <button
                        onClick={copyCode}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          copied 
                            ? 'bg-emerald-600' 
                            : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                        }`}
                      >
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className={`${themeColors.inputBg} rounded-xl p-4 overflow-auto text-xs max-h-80 border ${themeColors.border}`}>
                      <code className="text-emerald-400 whitespace-pre-wrap break-all font-mono">
                        {generateCodeInFormat()}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Animation Preview */}
                <div className={`${themeColors.cardBg} rounded-2xl p-4 sm:p-5 border ${themeColors.border} mb-6 sm:mb-8`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-sm font-semibold ${themeColors.text}`}>Animation Preview</h2>
                    <button
                      onClick={() => setShowAnimation(!showAnimation)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        showAnimation 
                          ? 'bg-purple-600 text-white' 
                          : `${themeColors.buttonBg} ${themeColors.buttonHover} border ${themeColors.border}`
                      }`}
                    >
                      {showAnimation ? '⏸ Pause' : '▶ Play'}
                    </button>
                  </div>
                  
                  <svg width="0" height="0">
                    <defs>
                      <clipPath id="animPreview" clipPathUnits="objectBoundingBox">
                        <path d={pathD} />
                      </clipPath>
                    </defs>
                  </svg>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className={`text-xs ${themeColors.textSecondary} mb-2 text-center`}>Scale</p>
                      <div
                        className={`aspect-square rounded-xl ${showAnimation ? 'animate-pulse' : ''}`}
                        style={{ 
                          clipPath: 'url(#animPreview)',
                          background: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`,
                          animation: showAnimation ? 'scale-anim 2s ease-in-out infinite' : 'none'
                        }}
                      />
                    </div>
                    <div>
                      <p className={`text-xs ${themeColors.textSecondary} mb-2 text-center`}>Rotate</p>
                      <div
                        className="aspect-square rounded-xl"
                        style={{ 
                          clipPath: 'url(#animPreview)',
                          background: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`,
                          animation: showAnimation ? 'rotate-anim 3s linear infinite' : 'none'
                        }}
                      />
                    </div>
                    <div>
                      <p className={`text-xs ${themeColors.textSecondary} mb-2 text-center`}>Fade</p>
                      <div
                        className="aspect-square rounded-xl"
                        style={{ 
                          clipPath: 'url(#animPreview)',
                          background: `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`,
                          animation: showAnimation ? 'fade-anim 2s ease-in-out infinite' : 'none'
                        }}
                      />
                    </div>
                  </div>
                  
                  <style>{`
                    @keyframes scale-anim {
                      0%, 100% { transform: scale(1); }
                      50% { transform: scale(1.1); }
                    }
                    @keyframes rotate-anim {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                    @keyframes fade-anim {
                      0%, 100% { opacity: 1; }
                      50% { opacity: 0.5; }
                    }
                  `}</style>
                </div>

                {/* Path Data */}
                <div className={`${themeColors.cardBg} rounded-2xl p-4 sm:p-5 border ${themeColors.border}`}>
                  <h2 className={`text-sm font-semibold mb-3 ${themeColors.text}`}>Raw Path Data</h2>
                  <div className={`${themeColors.inputBg} rounded-xl p-4 overflow-x-auto border ${themeColors.border}`}>
                    <code className="text-xs text-blue-400 break-all font-mono">{pathD}</code>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
