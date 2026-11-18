import { getGeminiClient } from './geminiService';
import { config } from '../../config';
import { StudentContext } from '../prompts/counsellorPrompt';

export interface ExtractedIntelligence {
  extractedContext: Partial<StudentContext>;
  leadTemperature: 'hot' | 'warm' | 'cold';
  interestLevel: 'High' | 'Medium' | 'Low' | 'Undecided';
  admissionReadiness: 'Immediate' | 'Next Batch' | 'Next Year' | 'Researching';
  detectedLanguage: string;
  suggestedQuestions: string[];
  conversationStage: 'greeting' | 'qualification' | 'interests' | 'course_exploration' | 'fee_eligibility' | 'objections' | 'callback' | 'closed';
  callbackRequested: boolean;
  callbackConsentGiven: boolean;
  objectionsIdentified?: string;
  recommendedNextAction?: string;
}

export const extractStudentIntelligence = async (
  lastUserMessage: string,
  existingContext: StudentContext,
  _conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<ExtractedIntelligence> => {
  const gemini = getGeminiClient();

  const text = lastUserMessage.toLowerCase();
  const isHot = text.includes('call me') || text.includes('admission') || text.includes('enroll') || text.includes('fee payment') || text.includes('fees');
  const isWarm = text.includes('12th') || text.includes('bca') || text.includes('course') || text.includes('job') || text.includes('eligibility') || text.includes('commerce') || text.includes('science');

  // Fast heuristic detection for sub-second response
  const baseIntelligence: ExtractedIntelligence = {
    extractedContext: {
      ...(text.includes('12th') ? { highestQualification: 'Class 12th' } : {}),
      ...(text.includes('commerce') ? { stream: 'Commerce' } : {}),
      ...(text.includes('science') || text.includes('pcm') || text.includes('pcb') ? { stream: 'Science' } : {}),
      ...(text.includes('bca') ? { highestQualification: 'BCA' } : {}),
      ...(text.includes('ai') || text.includes('tech') || text.includes('coding') ? { courseInterests: ['Technology & AI'] } : {})
    },
    leadTemperature: isHot ? 'hot' : isWarm ? 'warm' : 'cold',
    interestLevel: isHot ? 'High' : isWarm ? 'Medium' : 'Low',
    admissionReadiness: isHot ? 'Next Batch' : 'Researching',
    detectedLanguage: text.match(/[\u0900-\u097F]/) ? 'hi' : text.includes('kya') || text.includes('hai') || text.includes('kaise') || text.includes('mein') || text.includes('karna') ? 'hinglish' : 'en',
    suggestedQuestions: [
      "What are the eligibility criteria?",
      "Are merit scholarships available?",
      "Can I speak with a human counsellor?"
    ],
    conversationStage: isHot ? 'callback' : isWarm ? 'course_exploration' : 'greeting',
    callbackRequested: text.includes('call me') || text.includes('callback') || text.includes('contact me'),
    callbackConsentGiven: text.includes('call me') || text.includes('number is')
  };

  // If Gemini client is available, run lightweight fast classification
  if (gemini) {
    try {
      const prompt = `Student says: "${lastUserMessage}"
Previous context: ${JSON.stringify(existingContext)}
Output strict JSON with:
{"qualification": string or null, "stream": string or null, "interest": string or null, "language": "en" | "hi" | "hinglish" | "gu" | "raj"}`;

      const res = await gemini.models.generateContent({
        model: config.gemini.model,
        contents: prompt,
        config: {
          temperature: 0.1,
          maxOutputTokens: 120
        }
      });

      const raw = res.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
      const parsed = JSON.parse(raw);
      if (parsed.qualification) baseIntelligence.extractedContext.highestQualification = parsed.qualification;
      if (parsed.stream) baseIntelligence.extractedContext.stream = parsed.stream;
      if (parsed.language) baseIntelligence.detectedLanguage = parsed.language;
    } catch {
      // Fallback cleanly to heuristic without delaying the response
    }
  }

  return baseIntelligence;
};
