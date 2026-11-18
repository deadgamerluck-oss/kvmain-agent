export interface InitConversationParams {
  channel: 'chat' | 'voice' | 'mixed';
  preferred_language: string;
  title?: string;
}

export interface ConversationSession {
  conversationId: string;
  sessionId: string;
  channel: string;
  language: string;
}

export const conversationService = {
  /**
   * Initializes an anonymous conversation with a secure HTTP-only session cookie
   */
  async initConversation(params: InitConversationParams): Promise<ConversationSession | null> {
    try {
      const res = await fetch('/api/conversations/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // essential for HTTP-only cookie storage
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch {
      // fallback
    }
    return null;
  }
};
