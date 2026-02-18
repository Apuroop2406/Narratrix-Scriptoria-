
import React from 'react';
import type { AnalysisResult } from '../types';

interface DashboardViewProps {
  result: AnalysisResult;
}

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const scoreColor = score > 75 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-orange-400';
    const trackColor = score > 75 ? 'stroke-green-500/80' : score > 50 ? 'stroke-yellow-500/80' : 'stroke-orange-500/80';

    return (
        <div className="relative flex items-center justify-center">
            <svg className="transform -rotate-90" width="140" height="140" viewBox="0 0 120 120">
                <circle className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                <circle
                    className={`${trackColor} transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
            </svg>
            <div className={`absolute flex flex-col items-center justify-center ${scoreColor}`}>
                <span className="text-4xl font-bold">{score}</span>
                <span className="text-xs font-medium">/ 100</span>
            </div>
        </div>
    );
};

const DashboardCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <div className={`bg-gradient-to-br from-gray-800/60 to-gray-900/50 border border-gray-700/50 rounded-lg p-5 shadow-lg ${className}`}>
        <h3 className="text-lg font-semibold text-indigo-300 mb-3">{title}</h3>
        {children}
    </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ result }) => {
    const { greenlightScore, budget, budgetOptimization, productionRiskAlerts, audienceImpact } = result;

    const riskColor = (level: string) => {
        switch(level.toLowerCase()) {
            case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <DashboardCard title="Greenlight Score" className="lg:col-span-1 md:col-span-2 flex flex-col items-center justify-center text-center">
            <ScoreGauge score={greenlightScore.commercialPotentialScore} />
            <p className="text-sm text-gray-300 mt-2">Commercial Potential</p>
            <div className="mt-4 w-full">
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-400">Production Risk</span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${riskColor(greenlightScore.productionRiskLevel)}`}>
                        {greenlightScore.productionRiskLevel}
                    </span>
                </div>
                 <p className="text-sm text-gray-400 text-left mt-2">
                    <span className="font-semibold text-gray-300">Feasibility:</span> {greenlightScore.overallFeasibility}
                </p>
            </div>
        </DashboardCard>
        
        <DashboardCard title="Budget Overview" className="lg:col-span-2 md:col-span-2">
            <p className="text-4xl font-bold text-teal-400 mb-4">₹{budget.totalEstimate.toLocaleString('en-IN')}</p>
            <h4 className="font-semibold text-gray-300 mb-2">Optimization Suggestions</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
                {budgetOptimization.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
             <h4 className="font-semibold text-gray-300 mt-4 mb-2">High-Cost Scene Recs</h4>
            <ul className="space-y-2 text-sm text-gray-400">
                {budgetOptimization.highCostScenes.map((s, i) => <li key={i}><span className="font-bold text-indigo-400">Scene {s.sceneNumber}:</span> {s.recommendation}</li>)}
            </ul>
        </DashboardCard>

        <DashboardCard title="Production Risk Alerts" className="lg:col-span-2">
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {productionRiskAlerts.length > 0 ? productionRiskAlerts.map((alert, i) => (
                    <div key={i} className="p-3 bg-gray-900/50 rounded-md">
                        <p className="font-semibold text-orange-400">
                           <span className="font-bold text-indigo-400">Scene {alert.sceneNumber}:</span> {alert.riskCategory}
                        </p>
                        <p className="text-sm text-gray-400">{alert.description}</p>
                    </div>
                )) : <p className="text-gray-500">No major production risks detected.</p>}
            </div>
        </DashboardCard>

        <DashboardCard title="Audience Impact">
            <h4 className="font-semibold text-gray-300 mb-2">Predicted Reception</h4>
            <p className="text-sm text-gray-400 mb-4">{audienceImpact.predictedReception}</p>
            <h4 className="font-semibold text-gray-300 mb-2">Commercial Appeal</h4>
            <p className="text-sm text-gray-400">{audienceImpact.commercialAppeal}</p>
        </DashboardCard>

    </div>
  );
};
