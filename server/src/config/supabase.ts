import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseAdminInstance: SupabaseClient<any> | null = null;

/**
 * Returns the privileged backend Supabase client initialized with the server secret key.
 * This client bypasses RLS and must NEVER be exposed to frontend browser code.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSupabaseAdmin = (): SupabaseClient<any> | null => {
  if (!config.supabase.isConfigured) {
    return null;
  }

  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(
      config.supabase.url,
      config.supabase.secretKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );
  }

  return supabaseAdminInstance;
};
