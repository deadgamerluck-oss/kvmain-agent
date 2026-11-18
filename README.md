# AI Student Admission Counsellor

> **Layer 1: Project Architecture & Local Development Setup**  
> **Layer 2: Complete Frontend UI/UX & Design System**  
> **Layer 3: Supabase Database Architecture & Security Integration**  
> **Layer 4: Real AI Student Admission Counsellor Engine (Powered by Google Gemini)**

This standalone repository contains the frontend application, Express backend API, PostgreSQL Supabase schema, and the **Google Gemini AI Admission Counsellor Engine**.

---

## ⚡ Fast AI Engine Architecture (Google Gemini 2.5 Flash)

- **Official SDK**: `@google/genai`
- **Default High-Speed Model**: `gemini-2.5-flash` (ultra-low latency, optimized for streaming and real-time conversation)
- **Course RAG Integration**: Verified course records from Supabase are injected directly as system knowledge.
- **Multilingual Support**: Supports English, Hindi, Hinglish, Gujarati, and Rajasthani naturally without robotic translation.
- **Instant Fallback**: If an API key is not present or rate-limited, the system falls back seamlessly to the local rule-based admission engine without dropping the user's connection.

---

## ⚙️ Environment Configuration

In `server/.env`:
```bash
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SECRET_KEY=your-supabase-service-role-secret-key-do-not-expose-to-browser
SESSION_COOKIE_SECRET=development-session-secret-change-in-production-min32chars

# Google Gemini API Configuration (Layer 4 Fast Engine)
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.5-flash
```

---

## 🚀 Running Local Development

```bash
cd ai-student-counsellor

# 1. Install all dependencies
npm install

# 2. Run frontend & backend concurrently
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Student Chat & Voice Demo:** [http://localhost:5173/demo](http://localhost:5173/demo)
- **Backend Health:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
