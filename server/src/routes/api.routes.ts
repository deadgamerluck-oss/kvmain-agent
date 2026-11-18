import { Router, Request, Response } from 'express';
import { config } from '../config';
import { getSupabaseAdmin } from '../config/supabase';
import { 
  generateAnonymousSession, 
  hashSessionSecret, 
  verifySessionSecret 
} from '../middleware/session.auth';

const router = Router();

// GET /api/health
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: config.appName,
    database: {
      provider: 'Supabase PostgreSQL',
      status: config.supabase.isConfigured ? 'connected' : 'development_mock_mode'
    }
  });
});

// GET /api/version
router.get('/version', (_req: Request, res: Response) => {
  res.status(200).json({
    name: config.appName,
    version: config.version,
    environment: config.nodeEnv
  });
});

// ----------------------------------------------------------------------------
// Courses Endpoints
// ----------------------------------------------------------------------------

// GET /api/courses
router.get('/courses', async (_req: Request, res: Response) => {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(200).json({
      status: 'success',
      mode: 'mock',
      data: [
        {
          id: 'mock-crs-1',
          name: 'Full-Stack Web Development & Cloud Systems',
          slug: 'fullstack-web-development',
          category: 'Engineering & Technology',
          duration: '2 Years',
          fees: '₹1,80,000 / year',
          eligibility: '10+2 in any discipline with logical aptitude',
          is_active: true
        },
        {
          id: 'mock-crs-2',
          name: 'Digital Marketing & Growth Analytics',
          slug: 'digital-marketing-growth',
          category: 'Management & Business',
          duration: '1 Year',
          fees: '₹1,20,000 / year',
          eligibility: 'Bachelor degree or 12th passing with 50%',
          is_active: true
        }
      ]
    });
  }

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }

  return res.status(200).json({ status: 'success', mode: 'supabase', data });
});

// POST /api/courses (Admin course creation)
router.post('/courses', async (req: Request, res: Response) => {
  const supabase = getSupabaseAdmin();
  const { name, category, duration, fees, eligibility, short_description } = req.body;

  if (!name || !category) {
    return res.status(400).json({ status: 'error', message: 'Course name and category are required' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  if (!supabase) {
    // Development fallback mock response
    return res.status(201).json({
      status: 'success',
      mode: 'mock',
      message: 'Course created in development mock mode (Configure Supabase keys for persistence)',
      data: {
        id: `mock-crs-${Date.now()}`,
        name,
        slug,
        category,
        duration: duration || '3 Years',
        fees: fees || '₹1,50,000 / year',
        eligibility: eligibility || '10+2 minimum 50%',
        short_description: short_description || name,
        is_active: true
      }
    });
  }

  const { data, error } = await supabase
    .from('courses')
    .insert({
      name,
      slug,
      category,
      duration: duration || '3 Years',
      fees: fees || '₹1,50,000 / year',
      eligibility: eligibility || '10+2 minimum 50%',
      short_description: short_description || name,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }

  return res.status(201).json({ status: 'success', mode: 'supabase', data });
});

// ----------------------------------------------------------------------------
// Anonymous Student Conversation & Session Management
// ----------------------------------------------------------------------------

// POST /api/conversations/init
// Initializes an anonymous student session with an HTTP-only secure cookie secret
router.post('/conversations/init', async (req: Request, res: Response) => {
  const { channel = 'chat', preferred_language = 'en', title = 'Admission Advisory Session' } = req.body;
  const { sessionId, rawSecret } = generateAnonymousSession();
  const secretHash = hashSessionSecret(rawSecret);

  const supabase = getSupabaseAdmin();
  let conversationId = `conv_${Date.now()}`;

  if (supabase) {
    const { data, error } = await supabase
      .from('counsellor_conversations')
      .insert({
        anonymous_session_id: sessionId,
        session_secret_hash: secretHash,
        conversation_title: title,
        channel,
        preferred_language,
        status: 'active'
      })
      .select('id')
      .single();

    if (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
    conversationId = data.id;
  }

  // Set HTTP-only, secure, SameSite cookie with rawSecret
  res.cookie(config.session.cookieName, `${sessionId}:${rawSecret}`, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  return res.status(201).json({
    status: 'success',
    conversationId,
    sessionId,
    channel,
    language: preferred_language
  });
});

// GET /api/conversations/:id/messages
// Retrieves messages only if caller holds the valid session secret cookie
router.get('/conversations/:id/messages', async (req: Request, res: Response) => {
  const { id } = req.params;
  const cookieVal = req.cookies?.[config.session.cookieName];
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return res.status(200).json({
      status: 'success',
      mode: 'mock',
      data: []
    });
  }

  // Authorize session ownership
  if (!cookieVal || typeof cookieVal !== 'string') {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: Session cookie missing' });
  }

  const parts = cookieVal.split(':');
  const rawSecret = parts[1];
  if (!rawSecret) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid session format' });
  }

  const { data: conv, error: convErr } = await supabase
    .from('counsellor_conversations')
    .select('session_secret_hash')
    .eq('id', id)
    .single();

  if (convErr || !conv || !conv.session_secret_hash) {
    return res.status(404).json({ status: 'error', message: 'Conversation not found or invalid' });
  }

  if (!verifySessionSecret(rawSecret, conv.session_secret_hash)) {
    return res.status(403).json({ status: 'error', message: 'Forbidden: Session secret mismatch' });
  }

  const { data: messages, error: msgErr } = await supabase
    .from('counsellor_messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  if (msgErr) {
    return res.status(500).json({ status: 'error', message: msgErr.message });
  }

  return res.status(200).json({ status: 'success', data: messages });
});

// POST /api/conversations/:id/messages
router.post('/conversations/:id/messages', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, content, channel = 'chat', language = 'en' } = req.body;
  const cookieVal = req.cookies?.[config.session.cookieName];
  const supabase = getSupabaseAdmin();

  if (!role || !content) {
    return res.status(400).json({ status: 'error', message: 'Role and content are required' });
  }

  if (!supabase) {
    return res.status(201).json({
      status: 'success',
      mode: 'mock',
      data: {
        id: `mock-msg-${Date.now()}`,
        conversation_id: id,
        role,
        content,
        channel,
        language,
        created_at: new Date().toISOString()
      }
    });
  }

  // Verify ownership
  if (!cookieVal || typeof cookieVal !== 'string') {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: Missing session cookie' });
  }
  const parts = cookieVal.split(':');
  const rawSecret = parts[1];
  const { data: conv } = await supabase
    .from('counsellor_conversations')
    .select('session_secret_hash')
    .eq('id', id)
    .single();

  if (!conv || !conv.session_secret_hash || !verifySessionSecret(rawSecret, conv.session_secret_hash)) {
    return res.status(403).json({ status: 'error', message: 'Forbidden' });
  }

  const { data: insertedMsg, error: insertErr } = await supabase
    .from('counsellor_messages')
    .insert({
      conversation_id: id,
      role,
      content,
      channel,
      language
    })
    .select()
    .single();

  if (insertErr) {
    return res.status(500).json({ status: 'error', message: insertErr.message });
  }

  // Update conversation last_message_at
  await supabase
    .from('counsellor_conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', id);

  return res.status(201).json({ status: 'success', data: insertedMsg });
});

// ----------------------------------------------------------------------------
// Admission Leads & Server-Side Lead Creation (Prevents Duplicates)
// ----------------------------------------------------------------------------

// POST /api/leads
router.post('/leads', async (req: Request, res: Response) => {
  const { 
    conversation_id, 
    full_name, 
    phone, 
    email, 
    interested_course_id, 
    lead_temperature = 'warm', 
    callback_requested = false,
    callback_preferred_time 
  } = req.body;

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return res.status(201).json({
      status: 'success',
      mode: 'mock',
      message: 'Lead received in development mock mode',
      data: {
        id: `mock-lead-${Date.now()}`,
        full_name,
        phone,
        lead_temperature,
        lead_status: 'new'
      }
    });
  }

  // 1. Prevent duplicate leads for the same conversation
  if (conversation_id) {
    const { data: existingLead } = await supabase
      .from('admission_leads')
      .select('*')
      .eq('conversation_id', conversation_id)
      .maybeSingle();

    if (existingLead) {
      return res.status(200).json({
        status: 'success',
        message: 'Lead already recorded for this conversation',
        data: existingLead,
        isDuplicatePrevented: true
      });
    }
  }

  // 2. Create student profile record if contact provided
  let studentId: string | null = null;
  if (full_name || phone || email) {
    const { data: student } = await supabase
      .from('student_profiles')
      .insert({
        full_name,
        phone,
        email
      })
      .select('id')
      .single();
    if (student) {
      studentId = student.id;
    }
  }

  // 3. Insert admission lead
  const { data: lead, error: leadErr } = await supabase
    .from('admission_leads')
    .insert({
      student_id: studentId,
      conversation_id: conversation_id || null,
      interested_course_id: interested_course_id || null,
      lead_temperature,
      lead_status: 'new',
      callback_requested,
      callback_consent_at: callback_requested ? new Date().toISOString() : null,
      callback_preferred_time
    })
    .select()
    .single();

  if (leadErr) {
    return res.status(500).json({ status: 'error', message: leadErr.message });
  }

  return res.status(201).json({ status: 'success', data: lead });
});

// GET /api/leads (Staff/Admin endpoint)
router.get('/leads', async (_req: Request, res: Response) => {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(200).json({
      status: 'success',
      mode: 'mock',
      message: 'Configure Supabase keys to load real leads from database'
    });
  }

  const { data, error } = await supabase
    .from('admission_leads')
    .select(`
      *,
      student:student_profiles(*),
      course:courses(name, code, category)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }

  return res.status(200).json({ status: 'success', mode: 'supabase', data });
});

export default router;
