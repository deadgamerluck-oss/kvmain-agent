import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type CounsellorRow = Database['public']['Tables']['counsellors']['Row'];

export const counsellorService = {
  /**
   * Fetches the counsellor directory for assignment selection
   */
  async getActiveCounsellors(): Promise<CounsellorRow[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data } = await supabase
      .from('counsellors')
      .select('*')
      .eq('is_active', true)
      .order('full_name');
    return data || [];
  }
};
