export interface SaveMessageParams {
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  channel?: 'chat' | 'voice' | 'system';
  language?: string;
}

export const messageService = {
  /**
   * Persists a message turn through the server endpoint validating session ownership
   */
  async saveMessage(params: SaveMessageParams): Promise<boolean> {
    try {
      const res = await fetch(`/api/conversations/${params.conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          role: params.role,
          content: params.content,
          channel: params.channel || 'chat',
          language: params.language || 'en'
        })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Retrieves messages for an authorized session owner
   */
  async getMessages(conversationId: string) {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        credentials: 'include'
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch {
      // fallback
    }
    return [];
  }
};
