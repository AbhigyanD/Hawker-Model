
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuantAnalysis = async (module: string, context: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a Senior Quantitative Researcher. Generate a rigorous mathematical report for the following module: ${module}. 
    Context: ${context}. 
    The report must include Maximum Likelihood Estimation (MLE) findings, stability diagnostics (like branching ratios or spectral radius if applicable), and a strategy summary. 
    Format as JSON with keys: 'title', 'mleResults', 'diagnostics', 'strategySummary', 'mathNotes'.`,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 8000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          mleResults: { type: Type.STRING },
          diagnostics: { type: Type.STRING },
          strategySummary: { type: Type.STRING },
          mathNotes: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const fetchMarketGrounding = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Find real-time market regime data or academic papers related to: ${query}. Use Google Search.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text,
    sources: chunks.map((c: any) => ({
      title: c.web?.title || 'Research Source',
      url: c.web?.uri || '#'
    }))
  };
};

// Added missing function to generate business strategy using Gemini 3 Pro
export const generateBusinessStrategy = async (concept: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a comprehensive business strategy for: ${concept}. 
    Include brand name, value proposition, monetization model, marketing strategy, and scalability plan.
    Format the output as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brandName: { type: Type.STRING },
          valueProposition: { type: Type.STRING },
          monetizationModel: { type: Type.STRING },
          marketingStrategy: { type: Type.STRING },
          scalabilityPlan: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

// Added missing function to fetch market trends using Google Search grounding
export const fetchMarketTrends = async (industry: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze current market trends, demand drivers, and competitive landscape for the ${industry} industry. Use Google Search.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text,
    sources: chunks.map((c: any) => ({
      title: c.web?.title || 'Industry Insight',
      url: c.web?.uri || '#'
    }))
  };
};

// Added missing function to generate brand assets using Gemini 2.5 Flash Image
export const generateBrandAsset = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });
  
  // Find the image part in the response candidates
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from model.");
};

// Added missing function to generate promo videos using Veo 3.1
export const generatePromoVideo = async (prompt: string, onStatus: (status: string) => void) => {
  const ai = getAI();
  onStatus('Initializing Veo 3.1 video generation engine...');
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  // Polling for video generation completion as per SDK requirements
  while (!operation.done) {
    onStatus('Synthesizing cinematic frames... this usually takes about 60-90 seconds.');
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed: URI not found.");
  
  // Append API key to the download link as per documentation
  return `${downloadLink}&key=${process.env.API_KEY}`;
};
