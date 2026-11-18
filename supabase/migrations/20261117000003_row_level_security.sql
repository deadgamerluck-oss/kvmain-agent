-- ============================================================================
-- 20261117000003_row_level_security.sql
-- Row Level Security (RLS) & Granular Role Authorization Policies
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Enable RLS on every table
-- ----------------------------------------------------------------------------
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_consents ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 2. Helper functions to check authentication and authorization roles
-- ----------------------------------------------------------------------------

-- Check if current user is an authenticated counsellor or admin
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.counsellors
            WHERE user_id = auth.uid() AND is_active = true
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is specifically an admin or dean
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.counsellors
            WHERE user_id = auth.uid()
            AND is_active = true
            AND role IN ('admin', 'dean')
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is the assigned counsellor for a given lead
CREATE OR REPLACE FUNCTION public.is_assigned_to_lead(p_lead_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_counsellor_id UUID;
BEGIN
    SELECT id INTO v_counsellor_id FROM public.counsellors WHERE user_id = auth.uid() AND is_active = true;
    IF v_counsellor_id IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.counsellor_assignments
        WHERE lead_id = p_lead_id
        AND counsellor_id = v_counsellor_id
        AND assignment_status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 3. RLS Policies: courses
-- Public read-only for active courses; Admins can manage all.
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read active courses"
    ON public.courses
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Staff read all courses"
    ON public.courses
    FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Admin manage courses"
    ON public.courses
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. RLS Policies: student_profiles
-- Anonymous visitors cannot read profiles directly. Staff can view/edit.
-- Server admin client (secret key) bypasses RLS for backend operations.
-- ----------------------------------------------------------------------------
CREATE POLICY "Staff view student profiles"
    ON public.student_profiles
    FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Staff update student profiles"
    ON public.student_profiles
    FOR UPDATE
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- ----------------------------------------------------------------------------
-- 5. RLS Policies: counsellor_conversations & messages
-- Anonymous users interact securely via backend session secret validation.
-- Direct client access restricted to authenticated staff/admins.
-- ----------------------------------------------------------------------------
CREATE POLICY "Staff view all conversations"
    ON public.counsellor_conversations
    FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Staff manage conversations"
    ON public.counsellor_conversations
    FOR ALL
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "Staff view messages"
    ON public.counsellor_messages
    FOR SELECT
    USING (public.is_staff());

-- ----------------------------------------------------------------------------
-- 6. RLS Policies: admission_leads
-- Only staff can read leads. Counsellors see assigned leads; Admins see all.
-- ----------------------------------------------------------------------------
CREATE POLICY "Admin view all admission leads"
    ON public.admission_leads
    FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admin manage all admission leads"
    ON public.admission_leads
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Counsellors view assigned admission leads"
    ON public.admission_leads
    FOR SELECT
    USING (
        public.is_staff() AND
        (public.is_assigned_to_lead(id) OR public.is_admin())
    );

CREATE POLICY "Counsellors update assigned leads"
    ON public.admission_leads
    FOR UPDATE
    USING (
        public.is_staff() AND
        (public.is_assigned_to_lead(id) OR public.is_admin())
    )
    WITH CHECK (
        public.is_staff() AND
        (public.is_assigned_to_lead(id) OR public.is_admin())
    );

-- ----------------------------------------------------------------------------
-- 7. RLS Policies: lead_notes (Confidential internal notes)
-- Students and AI NEVER have access. Only staff with assignments or admins.
-- ----------------------------------------------------------------------------
CREATE POLICY "Staff read lead notes"
    ON public.lead_notes
    FOR SELECT
    USING (
        public.is_admin() OR
        (public.is_staff() AND public.is_assigned_to_lead(lead_id))
    );

CREATE POLICY "Staff insert lead notes"
    ON public.lead_notes
    FOR INSERT
    WITH CHECK (
        public.is_admin() OR
        (public.is_staff() AND public.is_assigned_to_lead(lead_id))
    );

-- ----------------------------------------------------------------------------
-- 8. RLS Policies: follow_ups & counsellor_assignments
-- ----------------------------------------------------------------------------
CREATE POLICY "Staff read assignments"
    ON public.counsellor_assignments
    FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Admin manage assignments"
    ON public.counsellor_assignments
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Staff manage follow ups"
    ON public.follow_ups
    FOR ALL
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- ----------------------------------------------------------------------------
-- 9. RLS Policies: counsellors profile directory
-- ----------------------------------------------------------------------------
CREATE POLICY "Staff view counsellors directory"
    ON public.counsellors
    FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Admin manage counsellors directory"
    ON public.counsellors
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 10. RLS Policies: conversation_consents
-- ----------------------------------------------------------------------------
CREATE POLICY "Staff view conversation consents"
    ON public.conversation_consents
    FOR SELECT
    USING (public.is_staff());
