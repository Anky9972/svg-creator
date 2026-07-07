import React, { useState } from 'react';
import { generatePathString } from '../utils/geometry';

export default function KeyframeGenerator({ points, globalRadius }) {
  const [keyframes, setKeyframes] = useState([]);
  const [animationName, setAnimationName] = useState('clip-anim');
  const [duration, setDuration] = useState('2s');

  const addKeyframe = () => {
    const pathD = generatePathString(points, globalRadius);
    setKeyframes([...keyframes, { id: Date.now(), pathD }]);
  };

  const removeKeyframe = (id) => {
    setKeyframes(keyframes.filter(kf => kf.id !== id));
  };

  const generateCSS = () => {
    if (keyframes.length < 2) return '/* Add at least 2 keyframes to generate animation */';
    
    let css = `@keyframes ${animationName} {\n`;
    keyframes.forEach((kf, index) => {
      const percent = Math.round((index / (keyframes.length - 1)) * 100);
      css += `  ${percent}% {\n    clip-path: path('${kf.pathD}');\n  }\n`;
    });
    css += '}\n\n';
    css += `.animated-element {\n  animation: ${animationName} ${duration} infinite alternate ease-in-out;\n}`;
    return css;
  };

  return (
    <div className="mt-6 bg-[#1f2937] p-4 rounded-xl border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-white">CSS Keyframes Generator</h2>
        <button
          onClick={addKeyframe}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors"
        >
          + Add Current Shape
        </button>
      </div>
      
      {keyframes.length > 0 && (
        <div className="space-y-2 mb-4">
          {keyframes.map((kf, index) => (
            <div key={kf.id} className="flex justify-between items-center bg-[#111827] p-2 rounded border border-slate-800">
              <span className="text-xs text-slate-300">Keyframe {index + 1} ({Math.round((index / (Math.max(keyframes.length - 1, 1))) * 100)}%)</span>
              <button onClick={() => removeKeyframe(kf.id)} className="text-red-400 hover:text-red-300 text-xs px-2">Remove</button>
            </div>
          ))}
        </div>
      )}

      {keyframes.length >= 2 && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Animation Name</label>
              <input 
                type="text" 
                value={animationName} 
                onChange={e => setAnimationName(e.target.value)}
                className="w-full px-2 py-1 bg-[#111827] border border-slate-700 rounded text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Duration</label>
              <input 
                type="text" 
                value={duration} 
                onChange={e => setDuration(e.target.value)}
                className="w-full px-2 py-1 bg-[#111827] border border-slate-700 rounded text-xs text-white"
              />
            </div>
          </div>
          <pre className="bg-[#111827] p-3 rounded border border-slate-700 text-xs text-emerald-400 overflow-x-auto">
            <code>{generateCSS()}</code>
          </pre>
        </>
      )}
    </div>
  );
}
