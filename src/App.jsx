import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { auth, googleProvider, db } from './utils/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { Routes, Route } from 'react-router-dom'
import TopBar from './components/TopBar'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import Canvas from './components/Canvas'
import LegalPage from './LegalPage'
import CommunityGallery from './components/CommunityGallery'

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
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const svgRef = useRef(null)
  const canvasContainerRef = useRef(null)
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const lastUpdateRef = useRef(Date.now())

  // --- Auth & Community State ---
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [exportBackground, setExportBackground] = useState({ type: 'solid', value: '#1e293b' })
  const [authError, setAuthError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setAuthError('')
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setAuthError(err.message)
    }
  }

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      console.error(err)
    }
  }

  const logout = () => signOut(auth)

  const handleCloudSave = async () => {
    if (!user) return alert('Please login to save to cloud')
    try {
      await addDoc(collection(db, 'projects'), {
        userId: user.uid,
        points,
        createdAt: serverTimestamp(),
        name: 'My Shape'
      })
      alert('Saved successfully!')
    } catch (err) {
      alert('Error saving project')
    }
  }


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

  // Context for extracted components
  const appCtx = {
    themeColors, theme, toggleTheme,
    leftSidebarOpen, setLeftSidebarOpen, rightSidebarOpen, setRightSidebarOpen,
    isFullscreen, toggleFullscreen,
    user, authLoading, email, setEmail, password, setPassword,
    isSignUp, setIsSignUp, handleEmailAuth, authError, logout, loginWithGoogle,
    saveProjectToCloud: handleCloudSave, undo, redo, canUndo, canRedo,
    exportSVG, exportPNGWithSize, generateShareLink, copyCode, copied,
    aspectRatio, setAspectRatio, handlePresetShape: loadPreset,
    snapToGrid, setSnapToGrid, snapToCenter, setSnapToCenter,
    showGrid: showGridPoints, setShowGrid: setShowGridPoints, gridSize, setGridSize,
    addMode, setAddMode, insertMode, setInsertMode,
    fillColor: previewColors.solid, setFillColor: (c) => setPreviewColors({...previewColors, solid: c}),
    customBgColor: exportBackground.value, setCustomBgColor: (c) => setExportBackground({type: 'solid', value: c}),
    globalRadius, applyGlobalRadius, setGlobalRadius,
    selectedPointData: selectedPoint !== null ? points[selectedPoint] : null,
    updateSelectedPoint: (e) => {
      if (selectedPoint === null) return;
      const val = parseFloat(e.target.value);
      if (!isNaN(val)) {
        setPoints(prev => prev.map((p, i) => i === selectedPoint ? { ...p, [e.target.name]: val } : p));
      }
    },
    deleteSelectedPoint: () => {
      if (selectedPoint !== null) {
        removePoint(selectedPoint);
        setSelectedPoint(null);
      }
    },
    toggleSymmetric: () => {
      if (selectedPoint !== null) {
        setPoints(prev => prev.map((p, i) => i === selectedPoint ? { ...p, symmetric: !p.symmetric } : p));
      }
    },
    clipPathId, setClipPathId,
    // Provide canvas specific ones
    points, setPoints, selectedPoint, setSelectedPoint,
    svgRef, canvasContainerRef, isDragging, dragOffset, lastUpdateRef,
    zoom, pan, pathD,
    updatePoint,
    // Canvas specific
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
    // Additional canvas props from full extraction
    showAnimation, setShowAnimation,
    exportBackground, setExportBackground,
    exportWebP,
    customImages, setCustomImages,
    previewColors: { ...previewColors, solid1: previewColors.solid || '#10b981', solid2: '#3b82f6' },
    codeFormat, setCodeFormat,
    scaleShape: (scale) => {
      setPoints(prev => prev.map(p => ({ ...p, x: (p.x - 0.5) * scale + 0.5, y: (p.y - 0.5) * scale + 0.5 })));
    },
    rotateShape: (angle) => {
      const rad = (angle * Math.PI) / 180;
      setPoints(prev => prev.map(p => {
        const nx = (p.x - 0.5) * Math.cos(rad) - (p.y - 0.5) * Math.sin(rad) + 0.5;
        const ny = (p.x - 0.5) * Math.sin(rad) + (p.y - 0.5) * Math.cos(rad) + 0.5;
        return { ...p, x: nx, y: ny };
      }));
    },
    flipHorizontal: () => setPoints(prev => prev.map(p => ({ ...p, x: 1 - p.x }))),
    flipVertical: () => setPoints(prev => prev.map(p => ({ ...p, y: 1 - p.y }))),
    handleImageUpload: (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setCustomImages(prev => [url, ...prev].slice(0, 4));
      }
    },
    zoomIn: () => setZoom(z => Math.min(z + 0.1, 5)),
    zoomOut: () => setZoom(z => Math.max(z - 0.1, 0.1)),
    resetZoom: () => { setZoom(1); setPan({x:0,y:0}); },
    setZoom, setPan,
    applySnapping: () => {},
    shareOnTwitter: () => {},
    shareOnLinkedIn: () => {},
    shareOnFacebook: () => {},
    copyCodeFormat: () => {},
    saveProject: () => {},
    loadProject: () => {},
    generateCodeInFormat: () => pathD,

    canvasHeight,
    setPreviewColors,
    showGridPoints,
  };

  return (
    <Routes>
      <Route path="/" element={
        <main className="h-screen flex flex-col transition-colors duration-300 font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden relative" style={{ backgroundColor: themeColors.bg, color: themeColors.text }}>
          <TopBar {...appCtx} />
          <div className="flex flex-1 overflow-hidden relative">
            <LeftSidebar {...appCtx} />
            <Canvas {...appCtx} />
            <RightSidebar {...appCtx} />
          </div>
        </main>
      } />
      <Route path="/community" element={<CommunityGallery themeColors={themeColors} theme={theme} />} />
      <Route path="/privacy" element={<LegalPage type="privacy" themeColors={themeColors} />} />
      <Route path="/terms" element={<LegalPage type="terms" themeColors={themeColors} />} />
      <Route path="/contact" element={<LegalPage type="contact" themeColors={themeColors} />} />
      <Route path="/about" element={<LegalPage type="about" themeColors={themeColors} />} />
    </Routes>
  );
}

export default App;
