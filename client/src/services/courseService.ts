import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type CourseRow = Database['public']['Tables']['courses']['Row'];
export type CourseInsert = Database['public']['Tables']['courses']['Insert'];

export const courseService = {
  /**
   * Fetches active courses. Tries Supabase directly (via RLS public policy) or falls back to server API / demo data.
   */
  async getActiveCourses(): Promise<{ data: CourseRow[]; source: 'supabase' | 'api' | 'mock' }> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (!error && data) {
        return { data: data as CourseRow[], source: 'supabase' };
      }
    }

    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const json = await res.json();
        return { data: json.data || [], source: json.mode === 'supabase' ? 'supabase' : 'mock' };
      }
    } catch {
      // ignore and return empty/mock
    }

    return { data: [], source: 'mock' };
  },

  /**
   * Creates a new course via the server-side admin endpoint
   */
  async createCourse(course: Partial<CourseInsert>): Promise<{ data: CourseRow | null; error: string | null }> {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: json.message || 'Failed to create course' };
      }
      return { data: json.data, error: null };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err.message : 'Network error' };
    }
  }
};
