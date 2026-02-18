
import React from 'react';
import type { ScheduleItem, Scene, SceneHeatmapItem } from '../types';

interface ScheduleTableProps {
  schedule: ScheduleItem[];
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule }) => {
  if (!schedule || schedule.length === 0) {
    return <p className="text-gray-400">No schedule data available.</p>;
  }

  return (
    <div className="animate-fade-in">
      <div className="overflow-x-auto bg-gray-800/70 rounded-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-6">Day</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Location</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Scenes</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Actors</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {schedule.map((item) => (
              <tr key={item.day} className="hover:bg-gray-800/50 transition-colors">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{item.day}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{item.location}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{item.scenes}</td>
                <td className="px-3 py-4 text-sm text-gray-300">
                    <div className="flex flex-wrap gap-1">
                        {item.actors.map(actor => (
                            <span key={actor} className="px-2 py-0.5 text-xs rounded-full bg-indigo-900/70 text-indigo-300">{actor}</span>
                        ))}
                    </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- NEW COMPONENT IN THE SAME FILE ---

interface SceneBreakdownViewProps {
    scenes: Scene[];
    heatmapData: SceneHeatmapItem[];
}

const getHeatmapColor = (value: number): string => {
    if (value > 7) return 'bg-red-900/60 text-red-300';
    if (value > 4) return 'bg-yellow-900/60 text-yellow-300';
    if (value > 0) return 'bg-green-900/60 text-green-300';
    return 'bg-gray-800/60 text-gray-400';
};

export const SceneBreakdownView: React.FC<SceneBreakdownViewProps> = ({ scenes, heatmapData }) => {
    const heatmapMap = new Map(heatmapData.map(item => [item.sceneNumber, item]));
    
    return (
        <div className="animate-fade-in">
            <div className="overflow-x-auto bg-gray-800/70 rounded-lg">
                <table className="min-w-full divide-y divide-gray-700 text-sm">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="py-3 px-3 text-left font-semibold text-gray-300">#</th>
                            <th className="py-3 px-3 text-left font-semibold text-gray-300">Location</th>
                            <th className="py-3 px-3 text-left font-semibold text-gray-300">Time</th>
                            <th className="py-3 px-3 text-left font-semibold text-gray-300">Characters</th>
                            <th className="py-3 px-3 text-center font-semibold text-gray-300" title="Action Intensity">Act</th>
                            <th className="py-3 px-3 text-center font-semibold text-gray-300" title="VFX Requirements">VFX</th>
                            <th className="py-3 px-3 text-center font-semibold text-gray-300" title="Crowd Size">Cwd</th>
                            <th className="py-3 px-3 text-center font-semibold text-gray-300" title="Logistics">Log</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-gray-900">
                        {scenes.map(scene => {
                            const heatmap = heatmapMap.get(scene.sceneNumber);
                            return (
                                <tr key={scene.sceneNumber} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="py-3 px-3 font-medium text-white">{scene.sceneNumber}</td>
                                    <td className="py-3 px-3 text-gray-300">{scene.location}</td>
                                    <td className="py-3 px-3 text-gray-300">{scene.time}</td>
                                    <td className="py-3 px-3 text-gray-300">{scene.characters.join(', ')}</td>
                                    <td className={`py-3 px-3 text-center font-mono font-bold ${getHeatmapColor(heatmap?.actionIntensity ?? 0)}`}>{heatmap?.actionIntensity ?? 0}</td>
                                    <td className={`py-3 px-3 text-center font-mono font-bold ${getHeatmapColor(heatmap?.vfxRequirements ?? 0)}`}>{heatmap?.vfxRequirements ?? 0}</td>
                                    <td className={`py-3 px-3 text-center font-mono font-bold ${getHeatmapColor(heatmap?.crowdSize ?? 0)}`}>{heatmap?.crowdSize ?? 0}</td>
                                    <td className={`py-3 px-3 text-center font-mono font-bold ${getHeatmapColor(heatmap?.logistics ?? 0)}`}>{heatmap?.logistics ?? 0}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
