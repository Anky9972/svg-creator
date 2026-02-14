import { useState, useCallback, useRef, useEffect } from 'react'

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
  const [points, setPoints] = useState(SHAPE_PRESETS.rectangle.points)
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
  const svgRef = useRef(null)
  const canvasContainerRef = useRef(null)
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

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
    setSelectedPoint(null)
    setAddMode(false)
    setInsertAfterPoint(null)
    setGlobalRadius(0)
  }

  // Get point by ID
  const getPointById = (id) => points.find(p => p.id === id)

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

  // Generate path string with rounded corners
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

  // Handle point drag
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

  // Handle mouse move on canvas
  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current || selectedPoint === null) return
    
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
  }, [selectedPoint, snapValue, getSvgCoordinates])

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

  // Add event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

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
  }, [selectedPoint, points, snapToGrid, gridSize, selectNextPoint])

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
      await navigator.clipboard.writeText(generateSvgCode())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const pathD = generatePath()
  const selectedPointData = selectedPoint !== null ? getPointById(selectedPoint) : null

  // Generate grid intersection points
  const gridPoints = []
  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      gridPoints.push({
        x: i / gridSize,
        y: j / gridSize,
        isEdge: i === 0 || i === gridSize || j === 0 || j === gridSize,
        isMajor: i % 5 === 0 && j % 5 === 0
      })
    }
  }

  // Calculate canvas dimensions based on aspect ratio
  const ar = ASPECT_RATIOS[aspectRatio]
  const aspectRatioValue = ar.width / ar.height

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Left Sidebar - Controls */}
        <div className={`w-80 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700 shrink-0 ${isFullscreen ? 'hidden' : ''}`}>
          <h1 className="text-xl font-bold mb-1">SVG ClipPath Creator</h1>
          <p className="text-gray-400 text-xs mb-4">Create custom clip-path masks</p>
          
          {/* Shape Presets */}
          <div className="mb-4">
            <h2 className="text-sm font-semibold mb-2 text-gray-300">Shape Presets</h2>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(SHAPE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => loadPreset(key)}
                  className="px-2 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Settings */}
          <div className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <h2 className="text-sm font-semibold mb-2 text-gray-300">Canvas Size</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-1">
                  {Object.keys(ASPECT_RATIOS).map((key) => (
                    <button
                      key={key}
                      onClick={() => setAspectRatio(key)}
                      className={`px-1 py-1.5 rounded text-xs transition-colors ${
                        aspectRatio === key 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Height: {canvasHeight}px</label>
                <input
                  type="range"
                  min="300"
                  max="800"
                  step="50"
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              
              <button
                onClick={toggleFullscreen}
                className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>

          {/* Grid Settings */}
          <div className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <h2 className="text-sm font-semibold mb-2 text-gray-300">Grid Settings</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={snapToGrid}
                  onChange={(e) => setSnapToGrid(e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-blue-500"
                />
                <span>Snap to Grid</span>
              </label>
              
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGridPoints}
                  onChange={(e) => setShowGridPoints(e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-blue-500"
                />
                <span>Show Grid Points</span>
              </label>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Grid Divisions: {gridSize}×{gridSize}</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGridSize(prev => Math.max(MIN_GRID, prev - 5))}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold"
                  >
                    −5
                  </button>
                  <button
                    onClick={() => setGridSize(prev => Math.max(MIN_GRID, prev - 1))}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min={MIN_GRID}
                    max={MAX_GRID}
                    value={gridSize}
                    onChange={(e) => setGridSize(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <button
                    onClick={() => setGridSize(prev => Math.min(MAX_GRID, prev + 1))}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setGridSize(prev => Math.min(MAX_GRID, prev + 5))}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Points Mode */}
          <div className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <h2 className="text-sm font-semibold mb-2 text-gray-300">Point Tools</h2>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setAddMode(!addMode)
                  if (!addMode) {
                    setInsertAfterPoint(points[points.length - 1]?.id || null)
                  }
                }}
                className={`w-full px-3 py-2 rounded text-xs font-medium transition-colors ${
                  addMode 
                    ? 'bg-green-600 hover:bg-green-500 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {addMode ? '✓ Add Mode ON' : '+ Enable Add Mode'}
              </button>
              
              {addMode && (
                <>
                  <div className="text-xs text-gray-400 mb-2">Insert Mode:</div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setInsertMode('smart')}
                      className={`px-2 py-1.5 rounded text-xs transition-colors ${
                        insertMode === 'smart' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      🎯 Smart Edge
                    </button>
                    <button
                      onClick={() => setInsertMode('after')}
                      className={`px-2 py-1.5 rounded text-xs transition-colors ${
                        insertMode === 'after' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      ➡️ After Point
                    </button>
                  </div>
                  
                  <div className="text-xs bg-green-900/30 p-2 rounded border border-green-800">
                    {insertMode === 'smart' ? (
                      <>
                        <p className="font-medium text-green-400 mb-1">Smart Edge Mode</p>
                        <p className="text-green-300">Click anywhere - point will be inserted on the nearest edge of the shape automatically!</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-green-400 mb-1">After Point Mode</p>
                        <p className="text-green-300">Click a point first, then click canvas to insert after it.</p>
                      </>
                    )}
                  </div>
                </>
              )}
              
              <button
                onClick={deletePoint}
                disabled={!selectedPoint || points.length <= 3}
                className="w-full px-3 py-2 bg-red-600/80 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded text-xs font-medium transition-colors"
              >
                Delete Selected Point
              </button>

              {selectedPoint && (
                <div className="flex gap-1">
                  <button
                    onClick={() => movePointOrder('up')}
                    className="flex-1 px-2 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                  >
                    ↑ Move Up
                  </button>
                  <button
                    onClick={() => movePointOrder('down')}
                    className="flex-1 px-2 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                  >
                    ↓ Move Down
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Corner Rounding */}
          <div className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <h2 className="text-sm font-semibold mb-2 text-gray-300">Corner Rounding</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Global Radius: {(globalRadius * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.3"
                  step="0.005"
                  value={globalRadius}
                  onChange={(e) => setGlobalRadius(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={applyGlobalRadius}
                  className="flex-1 px-2 py-1.5 bg-amber-600 hover:bg-amber-500 rounded text-xs font-medium transition-colors"
                >
                  Apply to All
                </button>
                <button
                  onClick={resetAllRadii}
                  className="flex-1 px-2 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          {/* Selected Point Properties */}
          {selectedPointData && (
            <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/50">
              <h2 className="text-sm font-semibold mb-2 text-blue-400">
                Point #{points.findIndex(p => p.id === selectedPoint) + 1}
              </h2>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">X Position</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedPointData.x.toFixed(2)}
                      onChange={(e) => updatePoint('x', Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)))}
                      className="w-full px-2 py-1.5 bg-gray-700 rounded text-xs border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Y Position</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedPointData.y.toFixed(2)}
                      onChange={(e) => updatePoint('y', Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)))}
                      className="w-full px-2 py-1.5 bg-gray-700 rounded text-xs border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Point Radius: {(selectedPointData.radius * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.3"
                    step="0.005"
                    value={selectedPointData.radius}
                    onChange={(e) => updatePoint('radius', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
                
                <button
                  onClick={togglePointType}
                  className={`w-full px-3 py-2 rounded text-xs font-medium transition-colors ${
                    selectedPointData.type === 'smooth'
                      ? 'bg-purple-600 hover:bg-purple-500'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Type: {selectedPointData.type === 'smooth' ? '● Smooth' : '■ Corner'}
                </button>
              </div>
            </div>
          )}

          {!selectedPointData && !addMode && (
            <div className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                Click a point to select and edit it
              </p>
            </div>
          )}

          {/* ClipPath ID */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">ClipPath ID</label>
            <input
              type="text"
              value={clipPathId}
              onChange={(e) => setClipPathId(e.target.value.replace(/\s/g, ''))}
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="customClip"
            />
          </div>

          {/* Copy Button */}
          <button
            onClick={copyCode}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy SVG Code'}
          </button>

          {/* Keyboard Shortcuts */}
          <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <h2 className="text-sm font-semibold mb-2 text-gray-300">⌨️ Keyboard Shortcuts</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Add Mode</span>
                <kbd className="bg-gray-700 px-1.5 rounded">A</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Snap Grid</span>
                <kbd className="bg-gray-700 px-1.5 rounded">S</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Show Grid</span>
                <kbd className="bg-gray-700 px-1.5 rounded">G</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Toggle Type</span>
                <kbd className="bg-gray-700 px-1.5 rounded">T</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delete Point</span>
                <kbd className="bg-gray-700 px-1.5 rounded">Del</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deselect</span>
                <kbd className="bg-gray-700 px-1.5 rounded">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Next Point</span>
                <kbd className="bg-gray-700 px-1.5 rounded">Tab</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Prev Point</span>
                <kbd className="bg-gray-700 px-1.5 rounded">⇧Tab</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Move Point</span>
                <kbd className="bg-gray-700 px-1.5 rounded">↑↓←→</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reorder</span>
                <kbd className="bg-gray-700 px-1.5 rounded">Ctrl+↑↓</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Grid +/-</span>
                <kbd className="bg-gray-700 px-1.5 rounded">+ -</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fullscreen</span>
                <kbd className="bg-gray-700 px-1.5 rounded">F</kbd>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-gray-500">Copy Code</span>
                <kbd className="bg-gray-700 px-1.5 rounded">Ctrl+C</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className={`flex-1 p-6 overflow-auto bg-gray-900 ${isFullscreen ? 'p-4' : ''}`}>
          <div className={`mx-auto ${isFullscreen ? 'max-w-full h-full' : 'max-w-5xl'}`}>
            {/* Canvas Container */}
            <div 
              ref={canvasContainerRef}
              className={`bg-gray-800 rounded-xl p-4 mb-6 ${isFullscreen ? 'h-full flex flex-col' : ''}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-gray-300">
                  Editor Canvas 
                  <span className="ml-2 text-gray-500 font-normal">({aspectRatio})</span>
                </h2>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span> Corner
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span> Smooth
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span> Selected
                  </span>
                  {addMode && insertMode === 'after' && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span> Insert After
                    </span>
                  )}
                </div>
              </div>
              
              <div 
                className={`relative bg-gray-950 rounded-lg overflow-hidden border-2 border-gray-700 mx-auto ${isFullscreen ? 'flex-1' : ''}`}
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
                          className="cursor-move transition-colors duration-150"
                          onMouseDown={(e) => handlePointMouseDown(e, point.id)}
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
              <div className="mt-2 flex justify-between text-xs text-gray-500 px-1">
                <span>0,0</span>
                <span className="text-gray-400">
                  {gridSize}×{gridSize} grid {snapToGrid && '• Snap ON'}
                  {addMode && ` • ${insertMode === 'smart' ? 'Smart Edge' : 'After Point'} mode`}
                </span>
                <span>1,1</span>
              </div>
            </div>

            {/* Preview Section */}
            {!isFullscreen && (
              <>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Live Preview */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h2 className="text-sm font-semibold mb-3 text-gray-300">Live Preview</h2>
                    
                    <svg width="0" height="0">
                      <defs>
                        <clipPath id="livePreview" clipPathUnits="objectBoundingBox">
                          <path d={pathD} />
                        </clipPath>
                      </defs>
                    </svg>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Gradient</p>
                        <div
                          className="aspect-square rounded"
                          style={{ 
                            clipPath: 'url(#livePreview)',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Solid</p>
                        <div
                          className="aspect-square bg-emerald-500"
                          style={{ clipPath: 'url(#livePreview)' }}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Image 1</p>
                        <div
                          className="aspect-square bg-cover bg-center"
                          style={{ 
                            clipPath: 'url(#livePreview)',
                            backgroundImage: 'url(https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400)'
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Image 2</p>
                        <div
                          className="aspect-square bg-cover bg-center"
                          style={{ 
                            clipPath: 'url(#livePreview)',
                            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400)'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Code Output */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-sm font-semibold text-gray-300">Generated Code</h2>
                      <button
                        onClick={copyCode}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          copied 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="bg-gray-950 rounded-lg p-3 overflow-auto text-xs max-h-80 border border-gray-700">
                      <code className="text-green-400 whitespace-pre-wrap break-all">
                        {generateSvgCode()}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Path Data */}
                <div className="bg-gray-800 rounded-xl p-4">
                  <h2 className="text-sm font-semibold mb-2 text-gray-300">Raw Path Data</h2>
                  <div className="bg-gray-950 rounded-lg p-3 overflow-x-auto border border-gray-700">
                    <code className="text-xs text-blue-400 break-all font-mono">{pathD}</code>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
