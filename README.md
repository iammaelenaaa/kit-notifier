# Kit Notifier — Aerial Fun & Fitness

Sends an email to zina@zinaditonno.com whenever someone submits a Kit form.

---

## Deploy to Vercel

### Step 1 — Push to GitHub
1. Create a new GitHub repo (e.g. `kit-notifier`)
2. Upload all these files to the repo

### Step 2 — Deploy on Vercel
1. Go to vercel.com → New Project → Import your GitHub repo
2. No build settings needed — just click Deploy

### Step 3 — Add Environment Variables in Vercel
Go to your project → Settings → Environment Variables and add:

| Variable | Value |
|---|---|
| `GMAIL_USER` | The Gmail address you want to send FROM (e.g. your Gmail) |
| `GMAIL_APP_PASSWORD` | A Gmail App Password (see below) |

**How to get a Gmail App Password:**
1. Go to myaccount.google.com → Security
2. Enable 2-Step Verification if not already on
3. Search for "App Passwords"
4. Create one for "Mail" — copy the 16-character password
5. Paste it as `GMAIL_APP_PASSWORD` in Vercel

### Step 4 — Set up the Webhook in Kit
1. Log into app.kit.com
2. Go to Settings → Integrations → Webhooks (or Automations)
3. Create a new webhook with:
   - **Event**: Subscriber Created (or Form Subscribed)
   - **URL**: `https://YOUR-VERCEL-URL.vercel.app/api/webhook`
4. Save it

### Step 5 — Test
Submit a test entry on any Kit form. Zina should receive an email within seconds!

---

## How It Works
- Kit fires a POST request to your webhook URL whenever someone submits a form
- Your Vercel serverless function receives it, extracts the subscriber's name/email/form
- Nodemailer sends a formatted email notification to zina@zinaditonno.com
- Totally free — Vercel free tier handles this easily
