
import React from 'react';
import type { Project } from '../types';

interface ProjectDashboardProps {
    projects: Project[];
    onSelectProject: (project: Project) => void;
    onCreateNew: () => void;
}

const ProjectCard: React.FC<{ project: Project; onSelect: () => void }> = ({ project, onSelect }) => {
    const score = project.analysisResult.greenlightScore.commercialPotentialScore;
    const scoreColor = score > 75 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-orange-400';

    return (
        <button onClick={onSelect} className="w-full text-left bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 shadow-lg hover:border-indigo-500/50 hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-100">{project.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Created on {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                     <p className={`text-3xl font-bold ${scoreColor}`}>{score}</p>
                     <p className="text-xs text-gray-400">Greenlight Score</p>
                </div>
            </div>
        </button>
    );
};

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projects, onSelectProject, onCreateNew }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300">Your Projects</h2>
                 <button onClick={onCreateNew} className="px-5 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-teal-400 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-800/30 transform hover:scale-105">
                     New Project
                 </button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-400">No projects yet.</h3>
                    <p className="text-gray-500 mt-2">Get started by creating your first project analysis.</p>
                    <button onClick={onCreateNew} className="mt-6 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
                        Create Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(p => (
                        <ProjectCard key={p.id} project={p} onSelect={() => onSelectProject(p)} />
                    ))}
                </div>
            )}
        </div>
    );
};
