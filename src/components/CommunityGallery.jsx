import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCommunityProjects, getUserProjects } from '../utils/firebase';
import { useEditor } from '../context/EditorContext';
import { generatePathString } from '../utils/geometry';

export default function CommunityGallery(props) {
  const { user, authLoading, resetHistory, setClipPathId, setGlobalRadius, setAspectRatio, themeColors, theme } = props;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('community'); // 'community' or 'my-projects'
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [activeTab, user]);

  const fetchProjects = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Add a 10 second timeout to prevent infinite spinning if Firestore hangs
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Database connection timed out. Have you created a Firestore Database in your Firebase Console?")), 10000)
      );
      
      let fetchPromise;
      if (activeTab === 'community') {
        fetchPromise = getCommunityProjects();
      } else if (activeTab === 'my-projects' && user) {
        fetchPromise = getUserProjects(user.uid);
      } else {
        fetchPromise = Promise.resolve([]);
      }

      const data = await Promise.race([fetchPromise, timeoutPromise]);
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
      setErrorMsg(error.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const loadIntoEditor = (project) => {
    resetHistory(project.points);
    if (project.clipPathId) setClipPathId(project.clipPathId);
    if (project.globalRadius !== undefined) setGlobalRadius(project.globalRadius);
    if (project.aspectRatio) setAspectRatio(project.aspectRatio);
    navigate('/');
  };

  if (authLoading) return <div className="flex h-screen items-center justify-center bg-[#0a0a0f] text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 p-6 sm:p-10">
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Clip Path Gallery
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Discover and remix clip-paths created by the community.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-700">
            ← Back to Editor
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto mb-8 flex gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('community')}
          className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${activeTab === 'community' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Community Gallery
        </button>
        {user && (
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${activeTab === 'my-projects' ? 'bg-purple-600/20 text-purple-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            My Saved Projects
          </button>
        )}
      </div>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : errorMsg ? (
          <div className="text-center py-20 bg-red-900/20 rounded-2xl border border-red-800/50">
            <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Projects</h3>
            <p className="text-red-300 max-w-lg mx-auto">{errorMsg}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400">No projects found.</p>
            {activeTab === 'my-projects' && (
              <Link to="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300">Create your first clip-path!</Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => {
              const pathD = generatePathString(project.points, project.globalRadius || 0);
              return (
                <div key={project.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-600 transition-colors group">
                  <div className="aspect-square bg-slate-950 p-6 relative">
                    <svg viewBox="0 0 1 1" className="w-full h-full drop-shadow-2xl">
                      <defs>
                        <linearGradient id={`grad-${project.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                      <path d={pathD} fill={`url(#grad-${project.id})`} />
                    </svg>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button
                        onClick={() => loadIntoEditor(project)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-blue-500/20"
                      >
                        Open in Editor
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold truncate text-slate-200">{project.name || 'Untitled Clip Path'}</h3>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>{new Date(project.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</span>
                      <span>{project.points.length} Points</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
