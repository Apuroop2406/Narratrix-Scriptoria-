
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        analysis: {
            type: Type.OBJECT,
            properties: {
                characters: { type: Type.ARRAY, items: { type: Type.STRING } },
                scenes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            sceneNumber: { type: Type.INTEGER },
                            location: { type: Type.STRING },
                            time: { type: Type.STRING, enum: ['Day', 'Night'] },
                            characters: { type: Type.ARRAY, items: { type: Type.STRING } },
                            props: { type: Type.ARRAY, items: { type: Type.STRING } },
                            sfx: { type: Type.ARRAY, items: { type: Type.STRING } },
                            complexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                        },
                        required: ['sceneNumber', 'location', 'time', 'characters', 'props', 'sfx', 'complexity'],
                    },
                },
            },
            required: ['characters', 'scenes'],
        },
        budget: {
            type: Type.OBJECT,
            properties: {
                sceneWiseCost: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { sceneNumber: { type: Type.INTEGER }, estimatedCost: { type: Type.NUMBER } }, required: ['sceneNumber', 'estimatedCost'] } },
                totalEstimate: { type: Type.NUMBER },
                highRiskCostAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['sceneWiseCost', 'totalEstimate', 'highRiskCostAreas'],
        },
        schedule: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER },
                    location: { type: Type.STRING },
                    scenes: { type: Type.STRING },
                    actors: { type: Type.ARRAY, items: { type: Type.STRING } },
                    notes: { type: Type.STRING },
                },
                required: ['day', 'location', 'scenes', 'actors', 'notes'],
            },
        },
        greenlightScore: {
            type: Type.OBJECT,
            properties: {
                commercialPotentialScore: { type: Type.INTEGER },
                productionRiskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                overallFeasibility: { type: Type.STRING },
            },
            required: ['commercialPotentialScore', 'productionRiskLevel', 'overallFeasibility'],
        },
        budgetOptimization: {
            type: Type.OBJECT,
            properties: {
                suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                highCostScenes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { sceneNumber: { type: Type.INTEGER }, recommendation: { type: Type.STRING } }, required: ['sceneNumber', 'recommendation'] } },
            },
            required: ['suggestions', 'highCostScenes'],
        },
        sceneComplexityHeatmap: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    sceneNumber: { type: Type.INTEGER },
                    actionIntensity: { type: Type.INTEGER },
                    vfxRequirements: { type: Type.INTEGER },
                    crowdSize: { type: Type.INTEGER },
                    logistics: { type: Type.INTEGER },
                },
                required: ['sceneNumber', 'actionIntensity', 'vfxRequirements', 'crowdSize', 'logistics'],
            },
        },
        audienceImpact: {
            type: Type.OBJECT,
            properties: {
                predictedReception: { type: Type.STRING },
                commercialAppeal: { type: Type.STRING },
            },
            required: ['predictedReception', 'commercialAppeal'],
        },
        conceptArtPrompts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    sceneNumber: { type: Type.INTEGER },
                    prompt: { type: Type.STRING },
                },
                required: ['sceneNumber', 'prompt'],
            },
        },
        productionRiskAlerts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    sceneNumber: { type: Type.INTEGER },
                    riskCategory: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
                required: ['sceneNumber', 'riskCategory', 'description'],
            },
        },
    },
    required: ['analysis', 'budget', 'schedule', 'greenlightScore', 'budgetOptimization', 'sceneComplexityHeatmap', 'audienceImpact', 'conceptArtPrompts', 'productionRiskAlerts'],
};


export const analyzeScriptAndPlan = async (script: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `
    You are Scriptoria, an expert AI film production assistant. Analyze the provided screenplay with exceptional detail.

    **Screenplay:**
    ---
    ${script}
    ---

    **Your Tasks (execute all):**

    1.  **Script Breakdown:**
        -   Extract a complete list of all characters.
        -   Create a detailed scene-wise breakdown including: Scene number, Location, Time (Day/Night), Characters in scene, Props, and Special effects (SFX).
        -   Determine the complexity for each scene (Low, Medium, High).

    2.  **Budget Estimation:**
        -   Estimate the production budget using these rules: Indoor scene: ₹50,000 base, Outdoor scene: ₹120,000 base, Action scene: +₹200,000, Night shoot: +₹75,000, Each actor per day: ₹40,000.
        -   Provide scene-wise cost, total estimate, and high-risk cost areas.

    3.  **Shooting Schedule Optimization:**
        -   Create an optimized shooting schedule by grouping scenes by location, minimizing actor movement, and reducing night shoots.

    4.  **Greenlight Score System:**
        -   Generate a Commercial Potential Score (0–100).
        -   Provide a Production Risk Level (Low/Medium/High).
        -   Estimate overall feasibility for greenlighting the project in a short sentence.

    5.  **Budget Optimization Suggestions:**
        -   Suggest 2-3 specific ways to reduce production cost (e.g., combine scenes, reduce night shoots).
        -   Highlight 1-2 high-cost scenes with specific recommendations for cost reduction.

    6.  **Scene Complexity Heatmap:**
        -   For each scene, provide a score from 0-10 for: action intensity, VFX requirements, crowd size, and logistics.

    7.  **Audience Impact Prediction:**
        -   Predict likely audience reception and commercial appeal based on genre, action, and story scale in a brief summary.

    8.  **Cinematic Concept Art Prompt Generator:**
        -   Automatically generate 3 detailed, evocative visual prompts for key scenes. Include mood, lighting, camera angle, and tone suggestions.

    9.  **Production Risk Alerts:**
        -   Detect scenes with heavy stunts, large crowds, political sensitivity, or extreme violence. Provide alerts with scene number, risk category, and a brief description.

    **Output Format:**
    Return a single, valid JSON object that strictly adheres to the provided schema. Do not include any explanatory text or markdown formatting.
    `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        },
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Received empty response from API");
    }
    
    return JSON.parse(jsonText) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing script:", error);
    throw new Error("Failed to process the screenplay. The Gemini API returned an error.");
  }
};


export const generateConceptArt = async (prompt: string): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    const fullPrompt = `Cinematic concept art, masterpiece, high detail, 8k. ${prompt}`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [{ text: fullPrompt }] },
            config: {
                imageConfig: {
                    aspectRatio: "16:9",
                }
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64EncodeString: string = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
            }
        }
        throw new Error("No image data found in the response.");

    } catch (error) {
        console.error("Error generating concept art:", error);
        throw new Error("Failed to generate concept art. The Gemini API returned an error.");
    }
};
