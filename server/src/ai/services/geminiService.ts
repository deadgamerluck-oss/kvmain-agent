import { GoogleGenAI } from '@google/genai';
import { config } from '../../config';

let geminiClientInstance: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI | null => {
  if (!config.gemini.isConfigured) {
    return null;
  }
  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenAI({
      apiKey: config.gemini.apiKey
    });
  }
  return geminiClientInstance;
};
