# Hostinger Deployment Guide

This project is a monorepo consisting of:
- **Client**: React (Vite + Tailwind CSS SPA)
- **Server**: Node.js + Express API (TypeScript compiled to `dist/`)

---

## Architecture on Hostinger

```
                  ┌──────────────────────────────────────────────┐
                  │          Hostinger Server / Domain           │
                  │             (Nginx Reverse Proxy)            │
                  └──────────────┬───────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
        Routes: `/` & assets            Routes: `/api/*`
                 │                               │
                 ▼                               ▼
     Static Dist Directory               PM2 Cluster Daemon
   `/client/dist/index.html`           `localhost:4000` (Node API)
```

---

## Option 1: Hostinger VPS (Recommended for Full AI & Voice Support)

Hostinger VPS (Ubuntu 22.04 / 24.04) allows running Node.js, PM2, and Nginx reverse proxy with SSL.

### Step 1: Install Node.js, PM2 & Nginx on VPS
SSH into your Hostinger VPS:
```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Install PM2 globally
sudo npm install -g pm2
```

### Step 2: Clone & Deploy Project
```bash
# Navigate to web root
cd /var/www

# Clone repository (or upload via SFTP/Git)
sudo git clone <your-repository-url> ai-student-counsellor
cd ai-student-counsellor
sudo chown -R $USER:$USER /var/www/ai-student-counsellor

# Install dependencies and build both client & server
npm install
npm run build
```

### Step 3: Configure Environment Variables
Create the production `.env` in `/var/www/ai-student-counsellor/server/.env`:
```env
PORT=4000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com

# Supabase Production Database
SUPABASE_URL=https://dkqaxnskdvqbghcphwks.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_key_here
SESSION_COOKIE_SECRET=change-this-to-a-very-secure-random-32char-string

# AI Engine Key (Gemini)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.1-flash-lite
```

### Step 4: Start Backend with PM2
```bash
# From /var/www/ai-student-counsellor
pm2 start ecosystem.config.js

# Ensure PM2 restarts automatically on server reboot
pm2 save
pm2 startup
```

### Step 5: Configure Nginx & SSL
Copy [nginx.hostinger.conf](file:///d:/macrowdigital/KV-Agent/ai-student-counsellor/nginx.hostinger.conf) to `/etc/nginx/sites-available/yourdomain.com`:
```bash
sudo cp nginx.hostinger.conf /etc/nginx/sites-available/yourdomain.com
# Edit yourdomain.com with nano/vim:
sudo nano /etc/nginx/sites-available/yourdomain.com

# Enable the site configuration
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Install free SSL (Certbot):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option 2: Hostinger Shared/Cloud Web Hosting (hPanel)

If you are using **Hostinger Business/Cloud Shared Hosting**:

### 1. Backend (Node.js App Feature in hPanel)
1. Go to **hPanel** -> **Websites** -> **Node.js**.
2. Click **Create Application**:
   - **Node.js version**: 20.x
   - **Application root**: `server`
   - **Application startup file**: `dist/index.js`
   - **Application URL**: `api.yourdomain.com` or `yourdomain.com/api`
3. Add your Environment variables (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, etc.) in the hPanel Environment configuration.
4. Click **Run NPM Install** and **Start Application**.

### 2. Frontend (Static SPA Hosting)
1. Run `npm run build:client` on your machine or CI/CD.
2. Upload all files from `client/dist/` into your Hostinger `public_html/`.
3. In `public_html/`, create an `.htaccess` file for React Router single-page app support:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```
