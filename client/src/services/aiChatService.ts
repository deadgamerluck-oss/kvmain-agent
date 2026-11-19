import { getApiBaseUrl } from '@/lib/apiConfig';

export interface SendAiChatMessageParams {
  conversationId: string;
  message: string;
  language?: string;
}

export interface AiChatResponse {
  success: boolean;
  reply: string;
  conversationId: string;
  language: string;
  studentContext?: Record<string, unknown>;
  suggestedQuestions?: string[];
  conversationStage?: string;
  isSimulated?: boolean;
  model?: string;
  message?: string;
}

const SESSION_TOKEN_KEY = 'counsellor_session_token';

export const aiChatService = {
  /**
   * Initializes or creates a new conversation session
   */
  async createConversation(language = 'en', channel: 'chat' | 'voice' = 'chat'): Promise<string | null> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/ai/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ preferred_language: language, channel })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.sessionToken) {
          try {
            sessionStorage.setItem(SESSION_TOKEN_KEY, json.sessionToken);
          } catch {
            // ignore
          }
        }
        return json.conversationId;
      }
    } catch {
      // fallback
    }
    return `conv_${Date.now()}`;
  },

  /**
   * Sends a student message to the real backend AI admission counsellor
   */
  async sendMessage(params: SendAiChatMessageParams): Promise<AiChatResponse> {
    try {
      const baseUrl = getApiBaseUrl();
      const storedToken = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(SESSION_TOKEN_KEY) : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
        headers['X-Session-Token'] = storedToken;
      }

      const res = await fetch(`${baseUrl}/api/ai/chat`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          ...params,
          sessionToken: storedToken || undefined
        })
      });
      const data = await res.json();
      return data;
    } catch (err: unknown) {
      return {
        success: false,
        reply: "Network error: Unable to connect to the AI Admission Counsellor service. Please check your connection.",
        conversationId: params.conversationId,
        language: params.language || 'en',
        message: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  },

  /**
   * Retrieves conversation history for the authorized student
   */
  async getConversation(conversationId: string) {
    try {
      const baseUrl = getApiBaseUrl();
      const storedToken = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(SESSION_TOKEN_KEY) : null;
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
        headers['X-Session-Token'] = storedToken;
      }

      const res = await fetch(`${baseUrl}/api/ai/conversations/${conversationId}`, {
        headers,
        credentials: 'include'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return null;
  }
};
