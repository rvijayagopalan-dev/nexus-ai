
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getGeminiResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Use gemini-3-flash-preview for fast and reliable responses
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(h => ({ role: h.role, parts: h.parts })),
      { role: 'user', parts: [{ text: prompt }] }
    ],
    config: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    }
  });

  return response.text;
};

export const getDailyGreeting = async (name: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a short, inspiring, one-sentence morning greeting for ${name}. Make it professional yet warm.`,
  });
  return response.text;
};
