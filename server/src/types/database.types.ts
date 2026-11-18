export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      student_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          email: string | null;
          location: string | null;
          highest_qualification: string | null;
          current_education: string | null;
          stream: string | null;
          passing_year: number | null;
          career_goals: string | null;
          budget_range: string | null;
          preferred_learning_mode: string | null;
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          location?: string | null;
          highest_qualification?: string | null;
          current_education?: string | null;
          stream?: string | null;
          passing_year?: number | null;
          career_goals?: string | null;
          budget_range?: string | null;
          preferred_learning_mode?: string | null;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          location?: string | null;
          highest_qualification?: string | null;
          current_education?: string | null;
          stream?: string | null;
          passing_year?: number | null;
          career_goals?: string | null;
          budget_range?: string | null;
          preferred_learning_mode?: string | null;
          preferred_language?: string;
          updated_at?: string;
        };
      };
      counsellor_conversations: {
        Row: {
          id: string;
          student_id: string | null;
          anonymous_session_id: string | null;
          session_secret_hash: string | null;
          conversation_title: string;
          channel: 'chat' | 'voice' | 'mixed';
          preferred_language: string;
          status: 'active' | 'exploring' | 'interested' | 'callback_requested' | 'handed_off' | 'closed';
          summary: string | null;
          interest_level: 'High' | 'Medium' | 'Low' | 'Undecided' | null;
          admission_readiness: 'Immediate' | 'Next Batch' | 'Next Year' | 'Researching' | null;
          started_at: string;
          last_message_at: string;
          ended_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          anonymous_session_id?: string | null;
          session_secret_hash?: string | null;
          conversation_title?: string;
          channel: 'chat' | 'voice' | 'mixed';
          preferred_language?: string;
          status?: 'active' | 'exploring' | 'interested' | 'callback_requested' | 'handed_off' | 'closed';
          summary?: string | null;
          interest_level?: 'High' | 'Medium' | 'Low' | 'Undecided' | null;
          admission_readiness?: 'Immediate' | 'Next Batch' | 'Next Year' | 'Researching' | null;
          started_at?: string;
          last_message_at?: string;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          anonymous_session_id?: string | null;
          session_secret_hash?: string | null;
          conversation_title?: string;
          channel?: 'chat' | 'voice' | 'mixed';
          preferred_language?: string;
          status?: 'active' | 'exploring' | 'interested' | 'callback_requested' | 'handed_off' | 'closed';
          summary?: string | null;
          interest_level?: 'High' | 'Medium' | 'Low' | 'Undecided' | null;
          admission_readiness?: 'Immediate' | 'Next Batch' | 'Next Year' | 'Researching' | null;
          last_message_at?: string;
          ended_at?: string | null;
          updated_at?: string;
        };
      };
      counsellor_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          channel: 'chat' | 'voice' | 'system';
          language: string;
          message_metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          channel: 'chat' | 'voice' | 'system';
          language?: string;
          message_metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          channel?: 'chat' | 'voice' | 'system';
          language?: string;
          message_metadata?: Json;
        };
      };
      courses: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: string;
          short_description: string;
          full_description: string | null;
          eligibility: string;
          duration: string;
          fees: string;
          learning_mode: string;
          career_opportunities: Json;
          frequently_asked_questions: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category: string;
          short_description: string;
          full_description?: string | null;
          eligibility: string;
          duration: string;
          fees: string;
          learning_mode?: string;
          career_opportunities?: Json;
          frequently_asked_questions?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category?: string;
          short_description?: string;
          full_description?: string | null;
          eligibility?: string;
          duration?: string;
          fees?: string;
          learning_mode?: string;
          career_opportunities?: Json;
          frequently_asked_questions?: Json;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      admission_leads: {
        Row: {
          id: string;
          student_id: string | null;
          conversation_id: string | null;
          interested_course_id: string | null;
          lead_temperature: 'hot' | 'warm' | 'cold';
          interest_level: string | null;
          admission_readiness: string | null;
          lead_status: 'new' | 'qualified' | 'assigned' | 'contacted' | 'follow_up' | 'enrolled' | 'closed';
          lead_score: number | null;
          summary: string | null;
          objections: string | null;
          next_action: string | null;
          callback_requested: boolean;
          callback_consent_at: string | null;
          callback_preferred_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          conversation_id?: string | null;
          interested_course_id?: string | null;
          lead_temperature?: 'hot' | 'warm' | 'cold';
          interest_level?: string | null;
          admission_readiness?: string | null;
          lead_status?: 'new' | 'qualified' | 'assigned' | 'contacted' | 'follow_up' | 'enrolled' | 'closed';
          lead_score?: number | null;
          summary?: string | null;
          objections?: string | null;
          next_action?: string | null;
          callback_requested?: boolean;
          callback_consent_at?: string | null;
          callback_preferred_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          conversation_id?: string | null;
          interested_course_id?: string | null;
          lead_temperature?: 'hot' | 'warm' | 'cold';
          interest_level?: string | null;
          admission_readiness?: string | null;
          lead_status?: 'new' | 'qualified' | 'assigned' | 'contacted' | 'follow_up' | 'enrolled' | 'closed';
          lead_score?: number | null;
          summary?: string | null;
          objections?: string | null;
          next_action?: string | null;
          callback_requested?: boolean;
          callback_consent_at?: string | null;
          callback_preferred_time?: string | null;
          updated_at?: string;
        };
      };
      counsellors: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          role: 'counsellor' | 'admin' | 'dean';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          role?: 'counsellor' | 'admin' | 'dean';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          email?: string;
          phone?: string | null;
          role?: 'counsellor' | 'admin' | 'dean';
          is_active?: boolean;
          updated_at?: string;
        };
      };
      counsellor_assignments: {
        Row: {
          id: string;
          lead_id: string;
          counsellor_id: string;
          assigned_by: string | null;
          assigned_at: string;
          assignment_status: 'active' | 'completed' | 'reassigned';
          notes: string | null;
        };
        Insert: {
          id?: string;
          lead_id: string;
          counsellor_id: string;
          assigned_by?: string | null;
          assigned_at?: string;
          assignment_status?: 'active' | 'completed' | 'reassigned';
          notes?: string | null;
        };
        Update: {
          assignment_status?: 'active' | 'completed' | 'reassigned';
          notes?: string | null;
        };
      };
      lead_notes: {
        Row: {
          id: string;
          lead_id: string;
          counsellor_id: string | null;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          counsellor_id?: string | null;
          note: string;
          created_at?: string;
        };
        Update: {
          note?: string;
        };
      };
      follow_ups: {
        Row: {
          id: string;
          lead_id: string;
          counsellor_id: string | null;
          scheduled_at: string;
          follow_up_type: 'call' | 'email' | 'campus_visit' | 'whatsapp';
          status: 'pending' | 'completed' | 'cancelled' | 'rescheduled';
          notes: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          counsellor_id?: string | null;
          scheduled_at: string;
          follow_up_type?: 'call' | 'email' | 'campus_visit' | 'whatsapp';
          status?: 'pending' | 'completed' | 'cancelled' | 'rescheduled';
          notes?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          scheduled_at?: string;
          follow_up_type?: 'call' | 'email' | 'campus_visit' | 'whatsapp';
          status?: 'pending' | 'completed' | 'cancelled' | 'rescheduled';
          notes?: string | null;
          completed_at?: string | null;
        };
      };
      conversation_consents: {
        Row: {
          id: string;
          conversation_id: string;
          consent_type: 'contact' | 'callback' | 'transcript_storage' | 'voice_recording';
          granted: boolean;
          consent_text_version: string;
          granted_at: string | null;
          revoked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          consent_type: 'contact' | 'callback' | 'transcript_storage' | 'voice_recording';
          granted?: boolean;
          consent_text_version?: string;
          granted_at?: string | null;
          revoked_at?: string | null;
          created_at?: string;
        };
        Update: {
          granted?: boolean;
          granted_at?: string | null;
          revoked_at?: string | null;
        };
      };
    };
  };
}
