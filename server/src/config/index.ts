import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  appName: 'AI Student Admission Counsellor API',
  version: '0.1.0',
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
    isConfigured: Boolean(
      process.env.GEMINI_API_KEY &&
      !process.env.GEMINI_API_KEY.includes('your-gemini-api-key')
    )
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    secretKey: process.env.SUPABASE_SECRET_KEY || '',
    isConfigured: Boolean(
      process.env.SUPABASE_URL && 
      process.env.SUPABASE_SECRET_KEY &&
      !process.env.SUPABASE_URL.includes('your-project-id')
    )
  },
  session: {
    cookieSecret: process.env.SESSION_COOKIE_SECRET || 'dev-counsellor-cookie-secret-key-32chars',
    cookieName: 'counsellor_session_token'
  }
};
