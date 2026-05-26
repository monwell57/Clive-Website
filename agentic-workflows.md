# Agentic & Automation Workflows for clivedkennedyphd.com

A roadmap for adding automation and AI agents on top of the site, written for someone new to this tooling. Read top-to-bottom for the concepts, then jump to the workflow you want to build.

---

## TL;DR

| You want to… | Use |
| --- | --- |
| Send a newsletter to every Sanity subscriber on a schedule | **n8n** workflow: Cron → Sanity (GROQ) → Resend |
| Triage incoming applications with AI before Clive opens them | **n8n** workflow: Webhook (from `/api/apply`) → LLM → Slack/email/Sanity |
| Back up application PDFs to Google Drive | **n8n** or **Zapier**: Webhook → Drive |
| Re-engage subscribers who haven't opened email in 60 days | **n8n** scheduled workflow: Sanity → Resend with conditional logic |
| Auto-generate a draft Field Notes post from a topic | **n8n** workflow with an LLM node + Sanity write back |

---

## 1. Concepts You Need to Know

### What is a "workflow automation" tool?

A **workflow automation tool** is a visual programming environment for stitching APIs together. Instead of writing a Node script that says "every Monday at 9am, fetch X from Sanity, transform it, and POST it to Resend," you drag boxes ("nodes") onto a canvas and connect them. Each box is one step. Each connection is "send the output of this step into the next step."

The three big players:

| Tool | Hosting | Cost | Best for | Comments |
| --- | --- | --- | --- | --- |
| **Zapier** | Cloud only | Free → paid by task count | Non-technical users, simple flows | Easy, expensive at scale, limited file/binary handling |
| **Make** (formerly Integromat) | Cloud only | Cheaper than Zapier | Mid-complexity | Similar to Zapier, slightly more powerful |
| **n8n** | **Self-host or cloud** | Free if self-hosted, ~$20/mo cloud | Complex workflows, code escape hatches, **AI agents** | Open source, has a built-in "AI Agent" node, much cheaper at scale |

**For your use case I'd pick n8n.** Reasons:

1. You want LLM-powered screening — n8n has native nodes for OpenAI/Anthropic/local LLMs, including an "AI Agent" node.
2. Your data lives in Sanity, which has a REST API but no first-class Zapier integration — n8n's generic HTTP nodes make this trivial.
3. Self-hosted = no per-task billing. The site doesn't need millions of operations.

### What is Zapier doing in your code today?

Look at `app/api/apply/route.ts`:

```ts
if (zapierUrl && !zapierUrl.includes('xxxxx')) {
  await fetch(zapierUrl, { method: 'POST', body: JSON.stringify({ … }) });
}
```

There's a **placeholder** webhook URL in `.env.local`. The intent (from `apply-setup.md`) was: when an application is submitted, also ping Zapier so Zapier could create a Google Drive folder and log the submission. **It was never finished** — that's why the env value is `xxxxx/yyyyy`. You can either (a) finish it in Zapier, (b) move it to n8n, or (c) delete it. My recommendation: delete the Zapier env var and rebuild the file-backup flow in n8n once you set n8n up.

### What does "agentic" mean?

"**Agentic AI**" = workflows where an LLM doesn't just answer a single prompt, but **uses tools** (other APIs/functions) to accomplish a goal, often making multiple calls in sequence.

Example **non-agentic** flow:
> "Summarize this resume in 3 bullets." → LLM returns 3 bullets. Done.

Example **agentic** flow:
> "Screen this applicant. Compare their resume to our ideal candidate profile in Sanity. If they're a strong fit, flag them in Sanity and notify Clive on Slack. If they're not, send a polite rejection draft to Clive for review."

The agent decides which tools (Sanity read, Sanity write, Slack post, Resend send) to use and in what order. n8n's **AI Agent** node makes this drag-and-drop.

---

## 2. Your Current Stack (What You're Working With)

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 16 app (clivedkennedyphd.com)                       │
│  ├─ /api/apply   → Resend (email Clive + applicant)          │
│  ├─ /api/subscribe → Sanity (create subscriber) + Resend     │
│  └─ Clerk middleware (gated until launch)                    │
└─────────────────────────────────────────────────────────────┘
          │                          │
          ▼                          ▼
┌──────────────────┐         ┌──────────────────┐
│  Sanity          │         │  Resend          │
│  - subscribers   │         │  - sends email   │
│  - newsletter    │         │  - logs all      │
│    issues        │         │    deliveries    │
│  - settings,     │         │                  │
│    testimonials  │         │                  │
└──────────────────┘         └──────────────────┘
```

Key documents in Sanity (based on the codebase):

- **`subscriber`**: `{ email, journeyStage, subscribedAt, source }`
- **`newsletterIssue`**: the monthly Field Notes content
- **`settings`**, **`testimonial`**, etc.

**Applications are NOT in Sanity** — they only exist as emails in Clive's inbox + attachments. If you want any automation around applicants (screening, status tracking, follow-ups), step one is **start storing them somewhere queryable.**

---

## 3. The Setup Quest: Get n8n Running

You can come back to this section once you actually start building. Skim it for now.

### Option A — n8n Cloud ($20/mo)

1. Go to [n8n.io](https://n8n.io) → sign up
2. You get a hosted instance at `yourname.app.n8n.cloud`
3. Skip to Workflow #1 below

### Option B — Self-host with Docker (free)

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e N8N_HOST=localhost \
  docker.n8n.io/n8nio/n8n
```

Open `http://localhost:5678`. For production, deploy on Railway/Render/Fly.io.

### Option C — Self-host on Railway (~$5/mo, easiest production setup)

1. [railway.app](https://railway.app) → New Project → Deploy n8n template
2. Set env vars: `N8N_BASIC_AUTH_USER`, `N8N_BASIC_AUTH_PASSWORD`, `WEBHOOK_URL=https://your-n8n.up.railway.app`
3. You get a URL like `https://your-n8n.up.railway.app`

### Credentials to add inside n8n (one-time)

Once n8n is running, go to **Credentials → New** and add:

- **Sanity** (HTTP Header Auth)
  - Header name: `Authorization`
  - Header value: `Bearer <your SANITY_API_TOKEN from .env.local>`
- **Resend** (HTTP Header Auth)
  - Header name: `Authorization`
  - Header value: `Bearer <your RESEND_API_KEY>`
- **OpenAI** or **Anthropic** (for AI nodes) — get an API key from their dashboards

---

## 4. Workflow #1 — Newsletter Automation

**Goal:** every month (or whenever a new `newsletterIssue` is published in Sanity), fetch all subscribers and send them the newsletter via Resend.

### Architecture

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Trigger         │ →  │  Fetch subscribers │ →  │  Send via Resend │
│  - Cron OR       │    │  - Sanity GROQ    │    │  - one email per │
│  - Sanity webhook│    │  - Get newsletter │    │    subscriber    │
└──────────────────┘    └──────────────────┘    └──────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Update Sanity   │
                       │  - lastSentAt    │
                       │  - sendCount     │
                       └──────────────────┘
```

### Step-by-step in n8n

**1. Trigger** — drag a **Schedule Trigger** node. Set to "Every 1st of month at 9am" (or whatever cadence Clive wants). Alternative: a **Webhook** node that Sanity calls when an issue is published.

**2. Fetch newsletter issue** — drag an **HTTP Request** node:

- Method: `POST`
- URL: `https://4u3tu3k2.api.sanity.io/v2024-01-27/data/query/production`
- Authentication: Sanity credential
- Body (JSON):

```json
{
  "query": "*[_type == \"newsletterIssue\" && status == \"published\"] | order(publishedAt desc) [0] { _id, title, slug, content, publishedAt }"
}
```

This grabs the most recent published issue. The response will be at `{{ $json.result }}`.

**3. Fetch all subscribers** — another **HTTP Request** node:

- Method: `POST`
- URL: same as above
- Body:

```json
{
  "query": "*[_type == \"subscriber\" && !defined(unsubscribedAt)] { _id, email, journeyStage }"
}
```

**4. Loop over subscribers** — drag a **Split In Batches** node, batch size 1, to iterate one at a time. This avoids hitting Resend rate limits and lets you personalize.

**5. Send via Resend** — drag an **HTTP Request** node inside the loop:

- Method: `POST`
- URL: `https://api.resend.com/emails`
- Authentication: Resend credential
- Headers: `Content-Type: application/json`
- Body (use n8n expressions to inject subscriber & issue):

```json
{
  "from": "SCTC Newsletter <newsletter@clivedkennedyphd.com>",
  "to": "{{ $json.email }}",
  "subject": "{{ $('Fetch newsletter issue').item.json.result.title }}",
  "html": "<!-- render the issue HTML here, see below -->"
}
```

For the HTML body you have two options:

- **Simple:** store full HTML in a Sanity field and just pass it through.
- **Better:** convert the Sanity Portable Text content with a `Code` node using `@portabletext/to-html`, or render server-side and embed.

**6. Update Sanity with send stats** — final **HTTP Request** node:

- Method: `POST`
- URL: `https://4u3tu3k2.api.sanity.io/v2024-01-27/data/mutate/production`
- Body:

```json
{
  "mutations": [
    {
      "patch": {
        "id": "{{ $('Fetch newsletter issue').item.json.result._id }}",
        "set": { "lastSentAt": "{{ $now.toISO() }}" },
        "inc": { "sendCount": 1 }
      }
    }
  ]
}
```

> Note: this requires adding `lastSentAt` and `sendCount` fields to your `newsletterIssue` schema in Sanity Studio.

### Gotchas

- **Resend free tier = 100 emails/day, 3000/month.** If Clive grows past that, upgrade plans or batch over multiple days.
- **Unsubscribe links** — every newsletter MUST have one. Generate per-subscriber unsubscribe tokens and add a `/api/unsubscribe?token=…` route to the Next.js app.
- **CAN-SPAM compliance** — include physical mailing address in the footer.

---

## 5. Workflow #2 — Applicant Screening (Agentic)

**Goal:** when someone submits an application, automatically:

1. Save it to Sanity (so it's queryable)
2. Have an LLM read the resume + cover letter and score fit
3. Notify Clive with the score and an AI-generated summary
4. Tag the applicant in Sanity for downstream tracking

### Prerequisite: store applications in Sanity

Right now `/api/apply` only emails. Add a Sanity write at the end of the route. Sketch:

```ts
// In app/api/apply/route.ts, after the emails send:
await sanityClient.create({
  _type: 'application',
  applicantName,
  applicantEmail,
  submittedAt: new Date().toISOString(),
  status: 'new',
  // Store file URLs by uploading the buffers to Sanity assets:
  coverLetterAsset: await sanityClient.assets.upload('file', buffer, { filename: coverLetter.name }),
  // …and so on for the other 3 files
});
```

You'll need an `application` document type in Sanity Studio with fields: `applicantName`, `applicantEmail`, `submittedAt`, `status` (enum: new/screening/interview/rejected/hired), `aiScore` (number), `aiSummary` (text), and 4 file references.

Once that's in place, you have two trigger options for n8n:

- **Webhook from the apply route** (fast, recommended): add `await fetch(N8N_WEBHOOK_URL, { method: 'POST', body: JSON.stringify({ applicationId }) })` at the end of `/api/apply`
- **Sanity polling** (simpler, slower): n8n polls Sanity for `*[_type == "application" && status == "new"]` every 5 minutes

### Architecture

```
┌──────────────────┐    ┌────────────────────────┐    ┌──────────────────┐
│ Webhook trigger  │ →  │ Fetch application      │ →  │ Download PDFs    │
│ (from /api/apply)│    │ + files from Sanity    │    │ from Sanity      │
└──────────────────┘    └────────────────────────┘    └──────────────────┘
                                                            │
                                                            ▼
                                                  ┌────────────────────┐
                                                  │ Extract text from   │
                                                  │ PDFs (Code node     │
                                                  │ + pdf-parse)        │
                                                  └────────────────────┘
                                                            │
                                                            ▼
                                          ┌────────────────────────────────┐
                                          │ AI Agent node                  │
                                          │  Tools: read Sanity            │
                                          │         (ideal candidate doc)  │
                                          │  Prompt: "Score 1-10, summarize│
                                          │  strengths, flag concerns"     │
                                          └────────────────────────────────┘
                                                            │
                                                            ▼
                                                  ┌────────────────────┐
                                                  │ Patch application  │
                                                  │ in Sanity:         │
                                                  │   aiScore,         │
                                                  │   aiSummary,       │
                                                  │   status="screened"│
                                                  └────────────────────┘
                                                            │
                                                            ▼
                                                  ┌────────────────────┐
                                                  │ If score >= 7:     │
                                                  │   notify Clive     │
                                                  │   "strong fit"     │
                                                  │ Else:              │
                                                  │   queue for review │
                                                  └────────────────────┘
```

### LLM prompt template (drop into the AI Agent node)

```
You are screening applicants for the South Central Training Consortium
Pre-Doctoral Internship Program. Read the applicant's cover letter and
resume below, and produce:

1. A fit score from 1-10 (10 = exceptional fit)
2. Three bullet-point strengths
3. Two bullet-point concerns or questions
4. A one-sentence recommendation: "Interview", "Pass", or "Needs review"

The ideal candidate profile is provided in your Sanity tool — query for
the document with _type == "idealCandidate" before scoring.

COVER LETTER:
{{ $node["Extract cover letter"].json.text }}

RESUME:
{{ $node["Extract resume"].json.text }}
```

### Caveats — read these

- **AI screening of job applicants is legally sensitive.** Use the AI output as a *summary tool for Clive*, not as an automatic accept/reject gate. Always have a human in the loop. The flow above tags and routes — it doesn't auto-reject.
- **Be transparent with applicants** if you're using AI in screening. NYC and a few other jurisdictions require disclosure.
- **Test bias.** Run a set of resumes through with names/demographics swapped and see if the scores stay consistent.

---

## 6. Workflow #3 — Quick Wins (Sketches Only)

### 3a. Backup applications to Google Drive

Replaces the never-finished Zapier flow.

```
Webhook (from /api/apply)
  → Download files from Sanity
  → Google Drive node: "Create folder named {applicantName}"
  → Google Drive node: "Upload files into folder"
  → Slack node: "Posted backup of {applicantName} application"
```

### 3b. Subscriber re-engagement

```
Cron (weekly)
  → Sanity query: subscribers with lastEmailOpened > 60 days ago
  → LLM node: generate personalized "we miss you" email per journeyStage
  → Resend: send
  → Sanity patch: update lastReengageAt
```

### 3c. Auto-draft Field Notes from a topic

```
Manual trigger (Clive submits a topic via a form)
  → LLM node (long context):
      "Write a 600-word Field Notes draft on {topic}, in the voice of
       Dr. Kennedy. Reference the past issues fetched below for tone."
  → Fetch past issues from Sanity as voice examples
  → Sanity write: create newsletterIssue with status=draft
  → Email Clive: "Draft ready to review in Sanity Studio"
```

### 3d. Application reminder

```
Cron (daily)
  → Sanity query: applications where submittedAt > 7 days ago AND status == "new"
  → Slack/email Clive: "{n} applications waiting for review"
```

### 3e. Newsletter analytics digest

```
Cron (weekly)
  → Resend API: fetch send/open/click stats for last week
  → Sanity: fetch newest subscribers count
  → LLM: write a 3-bullet summary
  → Email Clive every Monday
```

---

## 7. Building Blocks Cheat Sheet

### Sanity — query (GROQ)

POST to `https://4u3tu3k2.api.sanity.io/v2024-01-27/data/query/production` with body `{"query": "<GROQ>"}`.

```groq
*[_type == "subscriber" && !defined(unsubscribedAt)] { email, journeyStage }
*[_type == "newsletterIssue"] | order(publishedAt desc) [0]
*[_type == "application" && status == "new"]
count(*[_type == "subscriber"])
```

### Sanity — write (mutate)

POST to `https://4u3tu3k2.api.sanity.io/v2024-01-27/data/mutate/production` with `Authorization: Bearer <SANITY_WRITE_TOKEN>`.

```json
{
  "mutations": [
    { "create": { "_type": "subscriber", "email": "x@y.com" } },
    { "patch": { "id": "doc-id", "set": { "status": "screened" } } },
    { "delete": { "id": "doc-id" } }
  ]
}
```

### Resend — send email

POST to `https://api.resend.com/emails` with `Authorization: Bearer <RESEND_API_KEY>`.

```json
{
  "from": "SCTC <newsletter@clivedkennedyphd.com>",
  "to": "recipient@example.com",
  "subject": "Hi",
  "html": "<p>body</p>",
  "attachments": [{ "filename": "x.pdf", "content": "<base64>" }]
}
```

### Useful n8n nodes (search inside n8n)

- **Schedule Trigger** — run on cron
- **Webhook** — trigger from external POST
- **HTTP Request** — generic API call
- **Split In Batches** — iterate arrays
- **IF** — branching logic
- **Code** — drop in JavaScript when nodes aren't enough
- **AI Agent** — agentic LLM with tool use
- **OpenAI** / **Anthropic** — single-shot LLM calls
- **Google Drive**, **Slack**, **Notion**, **Gmail** — all native nodes

---

## 8. Recommended Starting Order

If you do all of this, do it in this order:

1. **Add the `application` document type in Sanity Studio** + update `/api/apply` to write to Sanity (foundation for everything applicant-related).
2. **Stand up n8n** (Railway is the lowest-friction production option).
3. **Build Workflow #1 (newsletter automation)** — highest immediate value, lowest complexity, no AI yet.
4. **Add unsubscribe handling** — `/api/unsubscribe` route + footer link in newsletters.
5. **Build Workflow #3a (Drive backup)** — kill the Zapier placeholder.
6. **Build Workflow #2 (AI screening)** — only after Clive has a few real applications to test against.
7. **Layer on the analytics + reminder workflows.**

---

## 9. What to Delete / Clean Up

Now that you know what these things do, you can safely:

- **Remove `ZAPIER_WEBHOOK_URL` from `.env.local`** (it's a placeholder and the apply route already skips it). When you rebuild the Drive backup in n8n, you'll use a new env var like `N8N_APPLY_WEBHOOK_URL`.
- **Delete the Zapier code block in `/api/apply/route.ts`** once you have the n8n webhook in place — keeps things tidy.

---

## 10. Where to Get Help

- **n8n docs:** [docs.n8n.io](https://docs.n8n.io) — start with their "AI Agent" tutorial
- **n8n community templates:** [n8n.io/workflows](https://n8n.io/workflows) — copy/adapt instead of building from scratch
- **Sanity GROQ playground:** in Sanity Studio, click "Vision" to test queries live
- **Resend docs:** [resend.com/docs](https://resend.com/docs)
- **Make vs n8n vs Zapier comparison:** plenty of YouTube walkthroughs, search "n8n tutorial 2026"
