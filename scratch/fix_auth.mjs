import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add Firebase imports
content = content.replace(
  "import { useState, useCallback, useRef, useEffect, useMemo } from 'react'",
  "import { useState, useCallback, useRef, useEffect, useMemo } from 'react'\nimport { auth, googleProvider, db } from './utils/firebase';\nimport { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';\nimport { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';"
);

// 2. Add Auth states around line 328
const stateString = `  const lastUpdateRef = useRef(Date.now())

  // --- Auth & Community State ---
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
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
`;

content = content.replace("  const lastUpdateRef = useRef(Date.now())", stateString);

fs.writeFileSync('src/App.jsx', content);
console.log("Successfully restored auth to App.jsx");
