import { getGeminiClient } from './geminiService';
import { config } from '../../config';
import { buildCounsellorSystemPrompt, StudentContext } from '../prompts/counsellorPrompt';
import { getVerifiedCoursesKnowledge } from './courseKnowledgeService';

export interface GenerateChatResponseParams {
  userMessage: string;
  conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  studentContext?: StudentContext;
  conversationSummary?: string;
  preferredLanguage?: string;
}

export interface ChatEngineResult {
  reply: string;
  model: string;
  isSimulated: boolean;
  tokensUsed?: number;
}

export const generateCounsellorReply = async (
  params: GenerateChatResponseParams
): Promise<ChatEngineResult> => {
  const verifiedCourses = await getVerifiedCoursesKnowledge();

  const systemPrompt = buildCounsellorSystemPrompt(
    verifiedCourses,
    params.studentContext,
    params.conversationSummary
  );

  // 1. PRIMARY PREFERRED ENGINE: GOOGLE GEMINI 3.1 FLASH LITE (Ultra-fast, high quality)
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const contents = [
        ...params.conversationHistory.slice(-6).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        {
          role: 'user',
          parts: [{ text: params.userMessage }]
        }
      ];

      const response = await gemini.models.generateContent({
        model: config.gemini.model,
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.6,
          maxOutputTokens: 350
        }
      });

      const reply = response.text || "Hello! I am your AI admission counsellor. What degree or course are you looking to explore?";

      return {
        reply,
        model: `Google ${config.gemini.model}`,
        isSimulated: false
      };
    } catch (geminiError) {
      console.error('[Gemini AI Engine Error]:', geminiError);
    }
  }

  // 2. INSTANT ZERO-LATENCY RULE-BASED ADMISSIONS COUNSELLOR ENGINE
  let fallbackReply = "Hello! I'm your AI Admission Counsellor. What course, stream, or career pathway would you like to explore today?";
  const lower = params.userMessage.toLowerCase();

  if (lower.includes('12th')) {
    fallbackReply = "Great! Having completed 12th is a key milestone. Are you looking towards Engineering & Technology, Digital Business & Management, or Design & UI/UX?";
  } else if (lower.includes('bca') || lower.includes('computer')) {
    fallbackReply = "With a BCA background, you have an excellent foundation for our Full-Stack Web Development & Cloud Systems or Data Analytics & Machine Learning programs. Which specialization excites you more?";
  } else if (lower.includes('fees') || lower.includes('fee')) {
    fallbackReply = "Our annual tuition fees range from ₹1.2L to ₹2.6L depending on whether you choose 1-year diplomas or full multi-year degrees. Would you like to check scholarship eligibility?";
  } else if (lower.includes('job') || lower.includes('placement')) {
    fallbackReply = "Our curriculum is industry-aligned with live project labs and campus placement support. What specific role are you aiming for in the industry?";
  } else if (lower.includes('hi') || lower.includes('hello')) {
    fallbackReply = "Hello! Welcome to EduGuide Admissions. I can help you find the right degree program based on your marks, interests, and budget. What are you currently studying?";
  }

  return {
    reply: fallbackReply,
    model: config.gemini.apiKey ? `Google ${config.gemini.model}` : 'Instant Admissions Engine (Local)',
    isSimulated: true
  };
};
