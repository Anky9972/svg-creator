import { useState, useCallback } from 'react';

export const useHistory = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const setState = useCallback((newState) => {
    // Handle function updaters (like React's setState)
    const resolvedState = typeof newState === 'function' ? newState(state) : newState;
    
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(resolvedState);
    // Limit history to 50 states to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift();
      setHistory(newHistory);
      setCurrentIndex(currentIndex);
    } else {
      setHistory(newHistory);
      setCurrentIndex(currentIndex + 1);
    }
  }, [history, currentIndex, state]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const reset = useCallback((resetState) => {
    setHistory([resetState]);
    setCurrentIndex(0);
  }, []);

  return { state, setState, undo, redo, canUndo, canRedo, reset };
};
