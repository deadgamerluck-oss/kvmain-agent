export interface CreateLeadParams {
  conversation_id?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  interested_course_id?: string;
  lead_temperature?: 'hot' | 'warm' | 'cold';
  callback_requested?: boolean;
  callback_preferred_time?: string;
}

export const leadService = {
  /**
   * Creates an admission lead through the secure server route preventing duplicate entries per session
   */
  async createLead(params: CreateLeadParams) {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err: unknown) {
      return { status: 'error', message: err instanceof Error ? err.message : 'Network error' };
    }
  },

  /**
   * Fetches leads from the backend service
   */
  async getLeads() {
    try {
      const res = await fetch('/api/leads', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch {
      // fallback
    }
    return { status: 'mock', data: [] };
  }
};
