
import React, { useState } from 'react';
import { Loader } from './Loader';
import { ConceptArtPrompt } from '../types';

interface ConceptArtGeneratorProps {
    onGenerate: (prompt: string) => void;
    imageUrl: string | null;
    isLoading: boolean;
    prompts: ConceptArtPrompt[];
}

export const ConceptArtGenerator: React.FC<ConceptArtGeneratorProps> = ({ onGenerate, imageUrl, isLoading, prompts }) => {
    const [prompt, setPrompt] = useState(prompts?.[0]?.prompt || 'Abandoned railway station at night, dramatic lighting, thriller tone.');
    
    return (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <h3 className="text-xl font-semibold text-indigo-300 mb-4">Art Generator</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="art-prompt" className="block text-sm font-medium text-gray-300 mb-1">
                            Describe the scene
                        </label>
                        <textarea
                            id="art-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-200 text-sm"
                            placeholder="e.g., A futuristic city skyline at sunset, flying cars..."
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => onGenerate(prompt)}
                            disabled={isLoading || !prompt.trim()}
                            className="w-full px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 disabled:scale-100"
                        >
                            {isLoading ? 'Generating...' : 'Generate Art'}
                        </button>
                    </div>
                </div>

                <h4 className="text-lg font-semibold text-indigo-300 mt-6 mb-3">AI-Suggested Prompts</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {prompts.map(p => (
                        <button 
                            key={p.sceneNumber}
                            onClick={() => setPrompt(p.prompt)}
                            className="w-full text-left p-3 bg-gray-800/70 hover:bg-indigo-900/50 rounded-lg transition-colors text-sm"
                        >
                            <span className="font-bold text-indigo-400">Scene {p.sceneNumber}:</span>
                            <span className="text-gray-400 ml-2">{p.prompt}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-2">
                {isLoading && (
                    <div className="flex justify-center items-center h-full min-h-[300px] bg-gray-800/50 rounded-lg">
                        <Loader text="Creating cinematic concept art..." />
                    </div>
                )}
                {imageUrl && !isLoading && (
                     <div className="bg-gray-800/50 p-2 rounded-lg">
                        <img 
                            src={imageUrl} 
                            alt="Generated concept art" 
                            className="w-full h-auto rounded-md object-contain animate-fade-in"
                        />
                     </div>
                )}
                {!imageUrl && !isLoading && (
                    <div className="flex justify-center items-center h-full min-h-[300px] bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
                        <p className="text-gray-500">Your generated concept art will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
