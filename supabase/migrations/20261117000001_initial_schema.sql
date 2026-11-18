-- ============================================================================
-- 001_initial_schema.sql
-- AI Student Admission Counsellor - Layer 3 Schema Architecture
-- ============================================================================

-- Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. Table: student_profiles
-- Represents student candidates inquiring about admissions.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    phone TEXT,
    email TEXT,
    location TEXT,
    highest_qualification TEXT,
    current_education TEXT,
    stream TEXT,
    passing_year INTEGER,
    career_goals TEXT,
    budget_range TEXT,
    preferred_learning_mode TEXT,
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 2. Table: counsellor_conversations
-- Stores counselling sessions across text and voice channels.
-- Includes anonymous session support with cryptographically hashed session secrets.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.counsellor_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE SET NULL,
    anonymous_session_id TEXT,
    session_secret_hash TEXT,
    conversation_title TEXT NOT NULL DEFAULT 'Admission Advisory Session',
    channel TEXT NOT NULL CHECK (channel IN ('chat', 'voice', 'mixed')),
    preferred_language TEXT NOT NULL DEFAULT 'en',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'exploring', 'interested', 'callback_requested', 'handed_off', 'closed')),
    summary TEXT,
    interest_level TEXT CHECK (interest_level IN ('High', 'Medium', 'Low', 'Undecided')),
    admission_readiness TEXT CHECK (admission_readiness IN ('Immediate', 'Next Batch', 'Next Year', 'Researching')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 3. Table: counsellor_messages
-- Stores verbatim conversation turns (both chat messages and voice transcripts).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.counsellor_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.counsellor_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('chat', 'voice', 'system')),
    language TEXT NOT NULL DEFAULT 'en',
    message_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 4. Table: courses
-- Verified institutional course catalogue queried by the AI counsellor.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    eligibility TEXT NOT NULL,
    duration TEXT NOT NULL,
    fees TEXT NOT NULL,
    learning_mode TEXT NOT NULL DEFAULT 'Full-Time On Campus',
    career_opportunities JSONB DEFAULT '[]'::jsonb,
    frequently_asked_questions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 5. Table: counsellors
-- Human admission officers and academic advisors.
-- Links to Supabase auth.users when authenticated.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.counsellors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'counsellor' CHECK (role IN ('counsellor', 'admin', 'dean')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 6. Table: admission_leads
-- High-intent student leads qualified by the AI or seeking human callbacks.
-- Prevent duplicate leads per conversation with a UNIQUE constraint.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admission_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE SET NULL,
    conversation_id UUID UNIQUE REFERENCES public.counsellor_conversations(id) ON DELETE SET NULL,
    interested_course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    lead_temperature TEXT NOT NULL DEFAULT 'warm' CHECK (lead_temperature IN ('hot', 'warm', 'cold')),
    interest_level TEXT CHECK (interest_level IN ('High', 'Medium', 'Low')),
    admission_readiness TEXT CHECK (admission_readiness IN ('Immediate', 'Next Batch', 'Next Year', 'Researching')),
    lead_status TEXT NOT NULL DEFAULT 'new' CHECK (lead_status IN ('new', 'qualified', 'assigned', 'contacted', 'follow_up', 'enrolled', 'closed')),
    lead_score INTEGER DEFAULT 50 CHECK (lead_score >= 0 AND lead_score <= 100),
    summary TEXT,
    objections TEXT,
    next_action TEXT,
    callback_requested BOOLEAN NOT NULL DEFAULT false,
    callback_consent_at TIMESTAMPTZ,
    callback_preferred_time TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 7. Table: counsellor_assignments
-- Tracks history of assigning leads to human counsellors.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.counsellor_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.admission_leads(id) ON DELETE CASCADE,
    counsellor_id UUID NOT NULL REFERENCES public.counsellors(id) ON DELETE RESTRICT,
    assigned_by UUID REFERENCES public.counsellors(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    assignment_status TEXT NOT NULL DEFAULT 'active' CHECK (assignment_status IN ('active', 'completed', 'reassigned')),
    notes TEXT
);

-- ----------------------------------------------------------------------------
-- 8. Table: lead_notes
-- Internal confidential notes added by human counsellors (invisible to students & AI).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.admission_leads(id) ON DELETE CASCADE,
    counsellor_id UUID REFERENCES public.counsellors(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 9. Table: follow_ups
-- Scheduled follow-up calls, emails, and admission campus visits.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.admission_leads(id) ON DELETE CASCADE,
    counsellor_id UUID REFERENCES public.counsellors(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    follow_up_type TEXT NOT NULL DEFAULT 'call' CHECK (follow_up_type IN ('call', 'email', 'campus_visit', 'whatsapp')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'rescheduled')),
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 10. Table: conversation_consents
-- Fine-grained consent tracking (contact, callback, transcripts, recordings).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversation_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.counsellor_conversations(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL CHECK (consent_type IN ('contact', 'callback', 'transcript_storage', 'voice_recording')),
    granted BOOLEAN NOT NULL DEFAULT false,
    consent_text_version TEXT NOT NULL DEFAULT 'v1.0',
    granted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_conversation_consent_type UNIQUE (conversation_id, consent_type)
);

-- ----------------------------------------------------------------------------
-- Updated at triggers for automatic timestamp maintenance
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_student_profiles_updated_at
    BEFORE UPDATE ON public.student_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_counsellor_conversations_updated_at
    BEFORE UPDATE ON public.counsellor_conversations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_counsellors_updated_at
    BEFORE UPDATE ON public.counsellors
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_admission_leads_updated_at
    BEFORE UPDATE ON public.admission_leads
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
