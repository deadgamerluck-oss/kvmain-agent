# Step-by-Step: Deploy Without VPS (Free / Serverless Cloud)

You do **not** need a VPS, Linux terminal skills, or server maintenance. You can deploy this project in **10 minutes** using modern free-tier cloud platforms:

---

## Architecture (No VPS Needed)

```
┌─────────────────────────────────┐       API Calls       ┌─────────────────────────────────┐
│        Vercel / Netlify         │ ────────────────────> │          Render / Railway       │
│    (Frontend - React / Vite)    │                       │     (Backend - Node/Express)    │
│  https://my-counsellor.vercel.app│ <──────────────────── │ https://my-counsellor-api.onrender.com
└─────────────────────────────────┘                       └────────────────┬────────────────┘
                                                                           │
                                                                           ▼
                                                                  Supabase Database
                                                                  & Google Gemini AI
```

---

## Step 1: Push Code to GitHub

1. Create a repository on [github.com](https://github.com) (e.g., `ai-student-counsellor`).
2. In your terminal / command prompt:
```bash
git init
git add .
git commit -m "Initial counsellor commit"
git branch -M main
git remote add origin https://github.com/<your-username>/ai-student-counsellor.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (Free Tier - No VPS)

1. Go to **[Render.com](https://render.com)** and sign up with GitHub.
2. Click **New +** &rarr; **Web Service**.
3. Select your GitHub repository `ai-student-counsellor`.
4. Fill in these settings:
   - **Name**: `ai-counsellor-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`
5. Click **Advanced** &rarr; **Add Environment Variable** and add:
   - `NODE_ENV`: `production`
   - `PORT`: `4000`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` *(update once frontend is deployed)*
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key)*
   - `GEMINI_MODEL`: `gemini-3.1-flash-lite`
   - `SUPABASE_URL`: `https://dkqaxnskdvqbghcphwks.supabase.co`
   - `SUPABASE_SECRET_KEY`: `your_supabase_secret_key_here`
   - `SESSION_COOKIE_SECRET`: `make-a-random-32-character-secret-string-here`
6. Click **Create Web Service**.
7. Once deployed, Render will give you a public URL like:
   `https://ai-counsellor-api.onrender.com`

---

## Step 3: Deploy Frontend to Vercel (Free Tier - 1 Click)

1. Go to **[Vercel.com](https://vercel.com)** and sign up with GitHub.
2. Click **Add New...** &rarr; **Project**.
3. Import your `ai-student-counsellor` repo.
4. In Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit &rarr; select **`client`**
5. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL`: `https://ai-counsellor-api.onrender.com` *(your Render backend URL from Step 2)*
   - `VITE_SUPABASE_URL`: `https://dkqaxnskdvqbghcphwks.supabase.co`
6. Click **Deploy**.

---

## Step 4: Link CORS (1 Minute)

1. Copy your live Vercel URL (e.g. `https://ai-student-counsellor.vercel.app`).
2. Go back to **Render.com** &rarr; your `ai-counsellor-api` &rarr; **Environment**.
3. Change `CLIENT_URL` to your live Vercel URL.
4. Render will auto-redeploy.

---

## Why this is better than a VPS:
- **Zero Server Setup**: No Nginx, no SSH, no Linux commands, no security patches.
- **Auto SSL / HTTPS**: Generated automatically for both frontend and backend.
- **Auto-Deploy on Git Push**: Whenever you commit code, your site updates in ~60 seconds.
- **Free**: Vercel and Render both provide 100% free tiers for personal and portfolio projects.
