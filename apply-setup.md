# Application Submission Setup Guide

## Overview
The application flow uses **Resend** for emails (free tier: 3000/month)
and an optional **Zapier webhook** to save files to Google Drive.

---

## Step 1: Install Resend

```bash
npm install resend
```

---

## Step 2: Get Your Resend API Key

1. Go to https://resend.com and create a free account
2. Go to **API Keys** → **Create API Key**
3. Copy the key (starts with `re_`)

---

## Step 3: Update .env.local

Add these to your `.env.local`:

```env
# Resend
RESEND_API_KEY=re_your_api_key_here

# Where applications get emailed TO (Clive's email)
CLIVE_EMAIL=clive.kennedy@example.com

# Your site URL (for links in emails)
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app

# Optional: Zapier webhook for Google Drive backup
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/
```

---

## Step 4: Place Files in Correct Locations

### API Route:
Copy `apply-route.ts` to:
```
app/api/apply/route.ts
```

### Placeholder PDFs:
Copy the 3 placeholder PDFs to your `public/` folder:
```
public/
  application-form.pdf
  availability-form.pdf
  training-schedule.pdf
```

These are the files students download in Step 1 of the application.
Replace them with real PDFs when Clive provides them.

---

## Step 5: Verify Domain in Resend (For Production)

For emails to send properly from your domain:

1. Go to Resend → **Domains** → **Add Domain**
2. Add your domain (e.g., `kennedytraining.com`)
3. Add the DNS records Resend provides
4. Wait for verification (usually 24-48 hours)

**For demo/testing:** Use Resend's test address:
```
from: 'SCTC <onboarding@resend.dev>'
```

Update both `from` fields in `apply-route.ts` while testing:
```typescript
from: 'SCTC Applications <onboarding@resend.dev>',
```

---

## Step 6: Optional — Google Drive Backup via Zapier

### Setup:
1. Go to https://zapier.com (free: 100 tasks/month)
2. Create new Zap
3. Trigger: **Webhooks by Zapier** → Catch Hook
4. Action: **Google Drive** → Create Folder + Upload File

### Zap Logic:
```
Webhook received →
  Create folder: "Applications/{applicantName}"
  Log: applicantName, applicantEmail, submittedAt
```

Note: Zapier free tier doesn't handle file binary data easily.
The email with attachments to Clive is the primary delivery method.
Zapier is just for logging/notification.

Copy the Zapier webhook URL to your `.env.local`:
```env
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/
```

---

## Step 7: Test the Flow

1. Run dev server: `npm run dev`
2. Go to `http://localhost:3000/#apply`
3. Download all 3 placeholder PDFs
4. Scroll to "Submit Your Application"
5. Fill in name + email
6. Upload all 4 PDFs (use the placeholder PDFs for testing)
7. Click "Submit Application"
8. Verify:
   - ✅ Success screen appears
   - ✅ Clive's email received (check inbox + spam)
   - ✅ Applicant confirmation email received
   - ✅ All 4 PDFs attached to Clive's email

---

## File Size Limits

Current limit: **10MB per file** (40MB total)

To change, update in both:

1. `app/api/apply/route.ts`:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // Change 10 to desired MB
```

2. `app/page.tsx` (HomePage.tsx):
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // Change 10 to desired MB
```

---

## Resend Free Tier Limits

| Feature | Free | Paid |
|---------|------|------|
| Emails/month | 3,000 | $20/month for 50k |
| Emails/day | 100 | Unlimited |
| Custom domains | 1 | Unlimited |
| Attachment size | 40MB total | 40MB total |

For Clive's use case (maybe 5-10 applications/month), the free tier
is more than sufficient.

---

## When Clive Has Real PDFs

Replace the placeholder PDFs in `/public/`:

1. Get real PDFs from Clive
2. Rename them exactly:
   - `application-form.pdf`
   - `availability-form.pdf`
   - `training-schedule.pdf`
3. Drop them in the `public/` folder
4. Delete the placeholder PDFs
5. Redeploy

That's it — no code changes needed!

---

## Troubleshooting

### Emails not sending?
1. Check `RESEND_API_KEY` in `.env.local`
2. Verify you're using `onboarding@resend.dev` as the from address for testing
3. Check Resend dashboard → Logs for errors

### Files not downloading?
1. Verify PDFs are in `/public/` folder
2. Check file names match exactly (case-sensitive)
3. Clear browser cache

### 500 error on submit?
1. Check terminal for error messages
2. Verify all env variables are set
3. Make sure files are PDFs under 10MB

### Emails going to spam?
1. For production: verify your domain in Resend
2. Add SPF/DKIM records to your DNS
3. Use a real sending domain (not onboarding@resend.dev)