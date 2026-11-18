-- ============================================================================
-- 20261117000002_indexes.sql
-- Performance Indexes for Scalable Queries
-- ============================================================================

-- student_profiles
CREATE INDEX IF NOT EXISTS idx_student_profiles_email ON public.student_profiles(email);
CREATE INDEX IF NOT EXISTS idx_student_profiles_phone ON public.student_profiles(phone);

-- counsellor_conversations
CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON public.counsellor_conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_anon_session_id ON public.counsellor_conversations(anonymous_session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.counsellor_conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.counsellor_conversations(last_message_at DESC);

-- counsellor_messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.counsellor_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.counsellor_messages(created_at ASC);

-- courses
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON public.courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);

-- admission_leads
CREATE INDEX IF NOT EXISTS idx_leads_student_id ON public.admission_leads(student_id);
CREATE INDEX IF NOT EXISTS idx_leads_conversation_id ON public.admission_leads(conversation_id);
CREATE INDEX IF NOT EXISTS idx_leads_course_id ON public.admission_leads(interested_course_id);
CREATE INDEX IF NOT EXISTS idx_leads_lead_status ON public.admission_leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_lead_temperature ON public.admission_leads(lead_temperature);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.admission_leads(created_at DESC);

-- counsellors
CREATE INDEX IF NOT EXISTS idx_counsellors_user_id ON public.counsellors(user_id);
CREATE INDEX IF NOT EXISTS idx_counsellors_role ON public.counsellors(role);

-- counsellor_assignments
CREATE INDEX IF NOT EXISTS idx_assignments_lead_id ON public.counsellor_assignments(lead_id);
CREATE INDEX IF NOT EXISTS idx_assignments_counsellor_id ON public.counsellor_assignments(counsellor_id);

-- lead_notes
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON public.lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_counsellor_id ON public.lead_notes(counsellor_id);

-- follow_ups
CREATE INDEX IF NOT EXISTS idx_follow_ups_lead_id ON public.follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_counsellor_id ON public.follow_ups(counsellor_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_scheduled_at ON public.follow_ups(scheduled_at ASC);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON public.follow_ups(status);

-- conversation_consents
CREATE INDEX IF NOT EXISTS idx_consents_conversation_id ON public.conversation_consents(conversation_id);
