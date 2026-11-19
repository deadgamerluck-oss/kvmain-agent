import { Router, Request, Response } from 'express';
import { config } from '../config';
import { getSupabaseAdmin } from '../config/supabase';
import { generateCounsellorReply } from '../ai/services/chatEngineService';
import { extractStudentIntelligence } from '../ai/services/leadIntelligenceService';
import { 
  generateAnonymousSession, 
  hashSessionSecret, 
  verifySessionSecret 
} from '../middleware/session.auth';

const router = Router();

// ----------------------------------------------------------------------------
// POST /api/ai/conversations
// Initializes a secure student conversation and sets HTTP-only session cookie
// ----------------------------------------------------------------------------
router.post('/conversations', async (req: Request, res: Response) => {
  const { channel = 'chat', preferred_language = 'en', title = 'Admission Advisory Session' } = req.body;
  const { sessionId, rawSecret } = generateAnonymousSession();
  const secretHash = hashSessionSecret(rawSecret);

  const supabase = getSupabaseAdmin();
  let conversationId = `conv_${Date.now()}`;

  if (supabase) {
    try {
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

      if (!error && data?.id) {
        conversationId = data.id;
      } else if (error) {
        console.warn('[Supabase conversation insert warning]:', error.message);
      }
    } catch (e: unknown) {
      console.warn('[Supabase connection offline or unreachable]:', e instanceof Error ? e.message : e);
    }
  }

  const isProduction = config.nodeEnv === 'production';
  res.cookie(config.session.cookieName, `${sessionId}:${rawSecret}`, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  return res.status(201).json({
    success: true,
    conversationId,
    sessionId,
    channel,
    language: preferred_language
  });
});

// ----------------------------------------------------------------------------
// GET /api/ai/conversations/:id
// Retrieves authorized conversation history
// ----------------------------------------------------------------------------
router.get('/conversations/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const cookieVal = req.cookies?.[config.session.cookieName];
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return res.status(200).json({
      success: true,
      mode: 'mock',
      data: {
        id,
        messages: []
      }
    });
  }

  // Authorize session
  if (!cookieVal || typeof cookieVal !== 'string') {
    return res.status(401).json({ success: false, message: 'Unauthorized session' });
  }

  const parts = cookieVal.split(':');
  const rawSecret = parts[1];

  const { data: conv, error: convErr } = await supabase
    .from('counsellor_conversations')
    .select('*, student:student_profiles(*)')
    .eq('id', id)
    .single();

  if (convErr || !conv || !conv.session_secret_hash) {
    return res.status(404).json({ success: false, message: 'Conversation not found' });
  }

  if (!verifySessionSecret(rawSecret, conv.session_secret_hash)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { data: messages } = await supabase
    .from('counsellor_messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  return res.status(200).json({
    success: true,
    data: {
      ...conv,
      messages: messages || []
    }
  });
});

// ----------------------------------------------------------------------------
// POST /api/ai/chat
// Primary Real AI Chat processing endpoint
// ----------------------------------------------------------------------------
router.post('/chat', async (req: Request, res: Response) => {
  const { conversationId, message, language = 'auto' } = req.body;
  const cookieVal = req.cookies?.[config.session.cookieName];
  const supabase = getSupabaseAdmin();

  if (!conversationId || !message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'conversationId and valid message are required' });
  }

  let conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];
  let studentContext = {};
  let conversationSummary = '';

  // 1. Authorize session if Supabase is active
  if (supabase) {
    if (!cookieVal || typeof cookieVal !== 'string') {
      return res.status(401).json({ success: false, message: 'Unauthorized session cookie missing' });
    }
    const parts = cookieVal.split(':');
    const rawSecret = parts[1];

    try {
      const { data: conv, error: convErr } = await supabase
        .from('counsellor_conversations')
        .select('session_secret_hash, summary, student:student_profiles(*)')
        .eq('id', conversationId)
        .maybeSingle();

      if (convErr) {
        console.warn('[Supabase session check warning]:', convErr.message);
      } else if (conv && conv.session_secret_hash) {
        if (!verifySessionSecret(rawSecret, conv.session_secret_hash)) {
          return res.status(403).json({ success: false, message: 'Forbidden: Session ownership invalid' });
        }
        conversationSummary = conv.summary || '';
        if (conv.student) {
          studentContext = conv.student;
        }

        // Load recent message context
        const { data: dbMessages } = await supabase
          .from('counsellor_messages')
          .select('role, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (dbMessages) {
          conversationHistory = (dbMessages as Array<{ role: 'user' | 'assistant' | 'system'; content: string }>).reverse();
        }

        // Save incoming student message
        await supabase.from('counsellor_messages').insert({
          conversation_id: conversationId,
          role: 'user',
          content: message,
          channel: 'chat',
          language: language !== 'auto' ? language : 'en'
        });
      }
    } catch (dbErr) {
      console.warn('[Database conversation lookup error]:', dbErr);
    }
  }

  try {
    // 2. Generate Real AI Counsellor Reply
    const chatResult = await generateCounsellorReply({
      userMessage: message,
      conversationHistory,
      studentContext,
      conversationSummary,
      preferredLanguage: language
    });

    // 3. Extract Student Intelligence & Lead Qualification
    const intelligence = await extractStudentIntelligence(
      message,
      studentContext,
      conversationHistory
    );

    // 4. Persist AI message and updated conversation state safely
    if (supabase) {
      try {
        await supabase.from('counsellor_messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: chatResult.reply,
          channel: 'chat',
          language: intelligence.detectedLanguage
        });

        await supabase
          .from('counsellor_conversations')
          .update({
            last_message_at: new Date().toISOString(),
            interest_level: intelligence.interestLevel,
            admission_readiness: intelligence.admissionReadiness,
            preferred_language: intelligence.detectedLanguage
          })
          .eq('id', conversationId);

        // If callback requested or serious interest, qualify lead safely
        if (intelligence.callbackRequested || intelligence.leadTemperature === 'hot') {
          const { data: existingLead } = await supabase
            .from('admission_leads')
            .select('id')
            .eq('conversation_id', conversationId)
            .maybeSingle();

          if (!existingLead) {
            await supabase.from('admission_leads').insert({
              conversation_id: conversationId,
              lead_temperature: intelligence.leadTemperature,
              lead_status: 'qualified',
              callback_requested: intelligence.callbackRequested,
              callback_consent_at: intelligence.callbackConsentGiven ? new Date().toISOString() : null,
              summary: intelligence.objectionsIdentified || 'High-intent enquiry through AI Chat'
            });
          }
        }
      } catch (postDbErr) {
        console.warn('[Post-response database persistence warning]:', postDbErr);
      }
    }

    return res.status(200).json({
      success: true,
      reply: chatResult.reply,
      conversationId,
      language: intelligence.detectedLanguage,
      studentContext: intelligence.extractedContext,
      suggestedQuestions: intelligence.suggestedQuestions,
      conversationStage: intelligence.conversationStage,
      isSimulated: chatResult.isSimulated,
      model: chatResult.model
    });
  } catch (error: unknown) {
    let errorMessage = 'AI Processing Failed';
    if (error && typeof error === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyErr = error as any;
      if (anyErr.status === 429 || anyErr.code === 'insufficient_quota') {
        errorMessage = 'OpenAI API quota exceeded (HTTP 429): You have no credits remaining. Please check billing at platform.openai.com/settings/organization/billing or provide an active API key with quota.';
      } else if (anyErr.message) {
        errorMessage = anyErr.message;
      }
    }
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
});

export default router;
