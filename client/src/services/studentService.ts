import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type StudentProfileRow = Database['public']['Tables']['student_profiles']['Row'];
export type StudentProfileInsert = Database['public']['Tables']['student_profiles']['Insert'];

export const studentService = {
  /**
   * Fetches or updates student profile information
   */
  async getStudentProfile(id: string): Promise<StudentProfileRow | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  }
};
