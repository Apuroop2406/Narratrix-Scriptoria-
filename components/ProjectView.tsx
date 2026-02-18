
import React, { useState, useCallback } from 'react';
import { Tabs } from './Tabs';
import { DashboardView } from './AnalysisOutput';
import { ScheduleTable, SceneBreakdownView } from './ScheduleTable';
import { ConceptArtGenerator } from './ConceptArtGenerator';
import { Loader } from './Loader';
import { generateConceptArt } from '../services/geminiService';
import type { Project } from '../types';

// The Tab type is now defined locally for this component
export type Tab = 'dashboard' | 'breakdown' | 'schedule' | 'conceptArt';

interface ProjectViewProps {
    project: Project;
    onBack: () => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [conceptArtImage, setConceptArtImage] = useState<string | null>(null);
  const [isGeneratingArt, setIsGeneratingArt] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerateArt = useCallback(async (prompt: string) => {
    setIsGeneratingArt(true);
    setError(null);
    setConceptArtImage(null);
    try {
      const imageUrl = await generateConceptArt(prompt);
      setConceptArtImage(imageUrl);
    } catch (e) {
      console.error(e);
      setError('Failed to generate concept art. Please check the console for details.');
    } finally {
      setIsGeneratingArt(false);
    }
  }, []);

  const renderContent = () => {
    const analysisResult = project.analysisResult;
    if (!analysisResult) {
        return <p className="text-gray-400">No analysis data available for this project.</p>;
    }

    if (error) {
        return <div className="mt-6 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">{error}</div>;
    }
    
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView result={analysisResult} />;
      case 'breakdown':
        return <SceneBreakdownView scenes={analysisResult.analysis.scenes} heatmapData={analysisResult.sceneComplexityHeatmap} />;
      case 'schedule':
        return <ScheduleTable schedule={analysisResult.schedule} />;
      case 'conceptArt':
        return <ConceptArtGenerator onGenerate={handleGenerateArt} imageUrl={conceptArtImage} isLoading={isGeneratingArt} prompts={analysisResult.conceptArtPrompts}/>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
        <div className="mb-6 flex items-center">
            <button onClick={onBack} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Dashboard
            </button>
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-2xl shadow-indigo-900/20">
            <div className="p-4 sm:p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-100">{project.name}</h2>
                <p className="text-sm text-gray-400">Analysis Dashboard</p>
            </div>
            {/* The Tab type is declared in this file, so we cast it for the Tabs component */}
            <Tabs activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab as Tab)} />
            <div className="p-4 sm:p-6 min-h-[300px]">
                {renderContent()}
            </div>
        </div>
    </div>
  );
};
