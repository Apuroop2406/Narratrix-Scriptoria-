
export interface Scene {
  sceneNumber: number;
  location: string;
  time: 'Day' | 'Night';
  characters: string[];
  props: string[];
  sfx: string[];
  complexity: 'Low' | 'Medium' | 'High';
}

export interface SceneBreakdown {
  characters: string[];
  scenes: Scene[];
}

export interface SceneCost {
  sceneNumber: number;
  estimatedCost: number;
}

export interface Budget {
  sceneWiseCost: SceneCost[];
  totalEstimate: number;
  highRiskCostAreas: string[];
}

export interface ScheduleItem {
  day: number;
  location: string;
  scenes: string; // e.g., "1, 5, 12"
  actors: string[];
  notes: string;
}

export interface GreenlightScore {
    commercialPotentialScore: number;
    productionRiskLevel: 'Low' | 'Medium' | 'High';
    overallFeasibility: string;
}

export interface BudgetOptimization {
    suggestions: string[];
    highCostScenes: {
        sceneNumber: number;
        recommendation: string;
    }[];
}

export interface SceneHeatmapItem {
    sceneNumber: number;
    actionIntensity: number;
    vfxRequirements: number;
    crowdSize: number;
    logistics: number;
}

export interface AudienceImpact {
    predictedReception: string;
    commercialAppeal: string;
}

export interface ConceptArtPrompt {
    sceneNumber: number;
    prompt: string;
}

export interface ProductionRisk {
    sceneNumber: number;
    riskCategory: string;
    description: string;
}

export interface AnalysisResult {
  analysis: SceneBreakdown;
  budget: Budget;
  schedule: ScheduleItem[];
  greenlightScore: GreenlightScore;
  budgetOptimization: BudgetOptimization;
  sceneComplexityHeatmap: SceneHeatmapItem[];
  audienceImpact: AudienceImpact;
  conceptArtPrompts: ConceptArtPrompt[];
  productionRiskAlerts: ProductionRisk[];
}

export interface Project {
  id: string;
  name: string;
  script: string;
  analysisResult: AnalysisResult;
  createdAt: string; // ISO Date string
}
