
import React, { useState } from 'react';

interface ScriptInputProps {
  onAnalyze: (projectName: string, script: string) => void;
  isLoading: boolean;
}

export const ScriptInput: React.FC<ScriptInputProps> = ({ onAnalyze, isLoading }) => {
  const [projectName, setProjectName] = useState('');
  const [script, setScript] = useState('');

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="project-name" className="block text-lg font-semibold mb-2 text-indigo-300">
          Project Name
        </label>
        <input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g., 'Cyberpunk Sunset'"
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-200 text-sm"
            disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="script-input" className="block text-lg font-semibold mb-2 text-indigo-300">
          Paste Your Screenplay Below
        </label>
        <textarea
          id="script-input"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="e.g., SCENE 1. INT. COFFEE SHOP - DAY..."
          className="w-full h-64 p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-200 font-mono text-sm resize-y"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onAnalyze(projectName, script)}
          disabled={isLoading || !script.trim() || !projectName.trim()}
          className="px-8 py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-teal-400 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg shadow-indigo-800/30 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Analyze & Save Project'
          )}
        </button>
      </div>
    </div>
  );
};
