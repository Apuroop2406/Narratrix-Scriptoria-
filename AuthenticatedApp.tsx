
import React, { useState, useCallback, useEffect } from 'react';
import { ScriptInput } from './components/ScriptInput';
import { Loader } from './components/Loader';
import { analyzeScriptAndPlan } from './services/geminiService';
import type { AnalysisResult, Project } from './types';
import { useAuth } from './contexts/AuthContext';
import { ProjectDashboard } from './components/ProjectDashboard';
import { ProjectView } from './components/ProjectView';

const Logo = () => (
    <div className="flex items-center space-x-3">
        <svg width="36" height="36" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
            </defs>
            <circle cx="128" cy="128" r="120" stroke="url(#logo-gradient)" strokeWidth="16"/>
            <path d="M101.812 73.6667C104.281 68.6667 111.417 65.3333 117.25 68C132.25 74.8333 125.75 96.6667 122.25 106.5C117.25 121.5 118.917 141.5 131.25 152.5C144.25 164.167 155.25 164 163.75 162.5C175.75 160.5 186.25 174.667 181.75 185.5C178.688 192.833 170.917 195.167 164.75 192C149.25 185.167 155.25 163.333 158.75 153.5C163.75 138.5 162.083 118.5 149.75 107.5C136.75 95.8333 125.75 96 117.25 97.5C105.25 99.5 94.75 85.3333 99.25 74.5L101.812 73.6667Z" fill="url(#logo-gradient)"/>
        </svg>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500">
            Scriptoria
        </h1>
    </div>
);

const UserProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-300">{user?.name}</span>
                 <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-10">
                    <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

type View = 'dashboard' | 'new_project' | 'project_detail';

export const AuthenticatedApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { projects, addProject } = useAuth();
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  useEffect(() => {
    // The auth context handles fetching, we just wait for the result.
    if(projects !== null) {
      setIsProjectsLoading(false);
    }
  }, [projects]);


  const handleAnalyze = useCallback(async (projectName: string, script: string) => {
    if (!projectName.trim()) {
        setError('Project Name cannot be empty.');
        return;
    }
    if (!script.trim()) {
      setError('Screenplay cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeScriptAndPlan(script);
      const newProjectData = { name: projectName, script, analysisResult: result };
      const newProject = await addProject(newProjectData);
      setSelectedProject(newProject);
      setCurrentView('project_detail');
    } catch (e) {
      console.error(e);
      setError('Failed to analyze script. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [addProject]);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project_detail');
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
    setCurrentView('dashboard');
  };

  const handleShowNewProject = () => {
    setError(null);
    setCurrentView('new_project');
  };

  const renderContent = () => {
    if (isProjectsLoading) {
        return <div className="flex justify-center items-center mt-12"><Loader text="Loading your workspace..." /></div>;
    }

    switch (currentView) {
      case 'project_detail':
        return selectedProject ? <ProjectView project={selectedProject} onBack={handleBackToDashboard} /> : null;
      
      case 'new_project':
        return (
          <div className="max-w-4xl mx-auto animate-fade-in">
             <button onClick={handleBackToDashboard} className="mb-6 text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Dashboard
            </button>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-2xl shadow-indigo-900/20 p-6">
                 <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300 mb-4">Create New Project</h2>
                 {error && <div className="mb-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg text-sm">{error}</div>}
                 <ScriptInput onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
          </div>
        );

      case 'dashboard':
      default:
        return <ProjectDashboard projects={projects} onSelectProject={handleSelectProject} onCreateNew={handleShowNewProject} />;
    }
  };

  return (
    <div className="min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
            <Logo/>
            <UserProfile />
        </header>
        
        <main>
          {renderContent()}
        </main>
        
        <footer className="text-center mt-12 text-gray-500">
          <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};
