import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

// Sign Up with Email and Password
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign up failed", error);
    throw error;
  }
};

// Login with Email and Password
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};

// Database functions
export const saveProjectToCloud = async (userId, projectData, isPublic = true) => {
  try {
    const projectsRef = collection(db, "projects");
    const docRef = await addDoc(projectsRef, {
      ...projectData,
      userId,
      isPublic,
      createdAt: serverTimestamp(),
      likes: 0
    });
    return docRef.id;
  } catch (error) {
    console.error("Failed to save project", error);
    throw error;
  }
};

export const updateProjectInCloud = async (projectId, projectData) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      ...projectData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Failed to update project", error);
    throw error;
  }
};

export const getCommunityProjects = async () => {
  try {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const projects = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().isPublic) {
        projects.push({ id: doc.id, ...doc.data() });
      }
    });
    return projects;
  } catch (error) {
    console.error("Failed to load community projects", error);
    throw error;
  }
};

export const getUserProjects = async (userId) => {
  try {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const projects = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().userId === userId) {
        projects.push({ id: doc.id, ...doc.data() });
      }
    });
    return projects;
  } catch (error) {
    console.error("Failed to load user projects", error);
    throw error;
  }
};
