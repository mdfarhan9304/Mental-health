# MindBalance 🌿

An empathetic **GenAI wellbeing companion** for students preparing for high-stakes Indian exams (NEET, JEE, CUET, CAT, GATE, UPSC). It turns open-ended journaling and quick mood check-ins into **hidden stress triggers and emotional patterns**, and pairs them with an always-available conversational companion that **talks back in your language and voice**, suggests small wellbeing **tasks**, and gently follows up when you complete them.

> A supportive companion, **not** a substitute for professional care. A persistent disclaimer and crisis-aware safety net are built in.

---

## 🔑 Demo credentials

The hosted/demo database is already seeded so judges see a "lived-in" account immediately.

| | |
|---|---|
| **Email** | `demo@mindbalance.app` |
| **Password** | `Demo123!password` |

This account comes pre-loaded with **14 days of mood logs, 4 journal entries (with AI insights), a chat history, and 3 wellbeing tasks** (2 open + 1 completed — so the companion will warmly acknowledge the completed one on your next chat).

> Email confirmation is **disabled**, so you can also register any email/password and be logged in instantly.

---

## ✨ Features

1. **First-run onboarding — pick a language + a companion** 🎭
   On first visit to the companion, the student chooses a **language** (English / हिन्दी / বাংলা) and a **companion character**. The four characters — **Shruti, Priya, Neha, Kavya** — are named after the *real Sarvam Bulbul voices*, so the name you pick is literally the voice that speaks back. Each has its own persona injected into the AI.

2. **Conversational companion that listens first** 💬
   Streaming, empathetic chat that knows your recent mood. It **gathers context with a gentle question before advising**, shows genuine sympathy, and offers one small, doable nudge — never a wall of generic tips.

3. **Voice, made for India** 🎙️🔊
   Speak to the companion (Sarvam **Saarika** STT) and have replies **read back automatically** in your chosen character's natural Indian voice (Sarvam **Bulbul** TTS), in English, Hindi, or Bengali. The voice is tuned slower/warmer to sound caring.

4. **AI-suggested wellbeing tasks + follow-up loop** ✅
   After a reply, the companion proposes 1–3 small tasks ("Take a 10-minute walk") as one-tap **+ Add** chips. They land on a dedicated **Tasks** page. Check one off and the companion **notices next time you chat** — celebrating the effort and asking how it felt. This closes the loop between advice → action → encouragement.

5. **Smart journaling + AI insight** 📓
   Write freely; the AI surfaces hidden triggers, emotions, practical coping strategies, and a line of encouragement (structured JSON).

6. **Mood tracking + trends** 📈
   One-tap mood/energy check-ins, a visual trend chart (Recharts), and an AI "patterns" summary across your week.

7. **Adaptive guided exercises** 🧘
   The AI recommends a breathing/grounding exercise for your current state with an animated guide (Box Breathing, 4-7-8, 5-4-3-2-1 grounding).

8. **Always-on safety net** 🛟
   Crisis-language detection (client + server) surfaces India helplines (Tele-MANAS 14416, KIRAN 1800-599-0019) and switches the AI into a calm, supportive crisis posture.

---

## 🏗️ Architecture

MindBalance is a single **Next.js (App Router)** codebase: React UI + server-side API routes in one deploy. Secrets (OpenAI, Sarvam) live **only in server routes**; the browser talks to Supabase directly with the public anon key, protected by Row-Level Security.

```
┌──────────────────────────── Browser (client components) ────────────────────────────┐
│  Companion / Journal / Trends / Exercises / Tasks pages                               │
│  • localStorage: language + companion choice (lib/prefs.ts)                           │
│  • Supabase JS client (anon key) → reads/writes the user's OWN rows (RLS enforced)    │
└───────────────┬───────────────────────────────────────────────┬──────────────────────┘
                │ fetch() to own API routes                       │ direct (RLS-guarded)
                ▼                                                 ▼
┌──────────── Next.js server (API routes, keys never leave) ──┐   ┌──── Supabase ────┐
│  /api/chat            → OpenAI streaming companion          │   │  Postgres        │
│  /api/tasks/suggest   → OpenAI structured task suggestions  │   │  • moods         │
│  /api/journal/analyze → OpenAI structured insight (JSON)    │   │  • journal_entries│
│  /api/insights        → OpenAI weekly pattern summary       │   │  • chat_messages │
│  /api/exercise/recommend → OpenAI exercise pick             │   │  • tasks         │
│  /api/voice/transcribe → Sarvam Saarika (STT)              │   │  Auth (email)    │
│  /api/voice/speak      → Sarvam Bulbul (TTS)              │   │  RLS on every tbl│
└────────────────────────────────────────────────────────────┘   └──────────────────┘
                │                          │
                ▼                          ▼
          OpenAI API                  Sarvam AI API
       (reasoning/chat)            (Indian-language voice)
```

### Key data flows

- **Chat turn:** UI sends conversation + `lang` + `companionId` + recent mood + *completed-but-unacknowledged* tasks → `/api/chat` builds a dynamic system prompt (`lib/prompts.ts → buildCompanionSystem`) → OpenAI streams a reply → UI auto-plays it via `/api/voice/speak` using the character's voice → freshly-completed tasks are marked `acknowledged`.
- **Task loop:** assistant reply → `/api/tasks/suggest` returns structured tasks in the chosen language → user taps **+ Add** → row written to Supabase `tasks` → checking it off sets `done + completed_at`, `acknowledged=false` → next chat feeds it back so the AI celebrates it.
- **Storage:** all user content is **cloud-only** in Supabase, scoped per-user. Auth is required (`AuthGate`). Only language/companion *preferences* live in localStorage (per-device UX, not sensitive).

### Hybrid AI by design

- **OpenAI** = reasoning (empathetic chat, structured insight, task suggestions, pattern analysis).
- **Sarvam AI** = authentic Indian-language **voice** (Saarika STT + Bulbul TTS) in English/Hindi/Bengali.

This split uses each provider for its strength. Swapping the reasoning provider is mostly a `lib/openai.ts` + route change.

---

## 🔒 Security model

Security was treated as a first-class concern, not an afterthought. Verified clean by Supabase's own security + performance advisors.

| Concern | How it's handled |
|---|---|
| **Secret exposure** | `OPENAI_API_KEY` and `SARVAM_API_KEY` are used only inside server API routes. `lib/openai.ts` and `lib/sarvam.ts` import `"server-only"`, so the build **fails** if they're ever pulled into a client bundle. Keys never reach the browser. |
| **Per-user data isolation** | **Row-Level Security on every table** (`moods`, `journal_entries`, `chat_messages`, `tasks`). Policy: `(select auth.uid()) = user_id` for both `using` and `with check` — a user can only ever read or write their own rows, even though the browser uses the public anon key directly. |
| **Public vs secret keys** | The Supabase **anon key is public by design** (safe in the browser) — RLS is what protects the data, not key secrecy. Service-role keys are never used client-side. |
| **Input validation** | All AI/voice routes validate and clamp input (`lib/validation.ts`): message count/length caps, TTS text length, and `clampOptional()` on free-form fields like `lang`/`companionId`/`speaker` — limiting abuse and runaway token cost. |
| **RLS performance hardening** | `auth.uid()` is wrapped in a scalar subselect so it's evaluated once per query, not per row (Supabase perf lint 0003) — **0 performance advisories**. |
| **Crisis safety** | `lib/safety.ts` runs keyword crisis detection on **both** client and server. On a hit, the chat API injects a crisis-care directive into the system prompt and returns an `X-Crisis` header; the UI surfaces a helpline banner. The AI is hard-instructed never to diagnose or give clinical instructions. |
| **Auth** | Supabase email/password auth; `AuthGate` gates the app. (Email confirmation is intentionally off for frictionless demos — re-enable for production.) |
| **Untrusted-data hygiene** | DB query results are treated as untrusted user data (never executed as instructions). |

**Production hardening checklist** (intentionally relaxed for the demo): re-enable "Confirm email", turn on **leaked-password protection** (HaveIBeenPwned), rotate any keys that were shared during development, and add rate limiting on the AI routes.

---

## 🗄️ Database schema

Run `supabase/schema.sql` once (SQL Editor) — or it's already applied on the demo project. Every table is keyed to `auth.users(id)` with `on delete cascade` and RLS.

| Table | Purpose | Notable columns |
|---|---|---|
| `moods` | Mood/energy check-ins | `mood`, `energy` (1–5), `note`, `ts` |
| `journal_entries` | Free-text entries + AI insight | `text`, `insight` (jsonb), `ts` |
| `chat_messages` | Companion conversation | `role`, `content`, `ts` |
| `tasks` | Wellbeing todos | `title`, `detail`, `done`, `completed_at`, `acknowledged`, `source` |

Indexes: `(user_id, ts)` on each table for fast per-user, time-ordered reads.

---

## 🌐 API routes

| Route | Method | Provider | Returns |
|---|---|---|---|
| `/api/chat` | POST | OpenAI | Streamed companion reply (+ `X-Crisis` header) |
| `/api/tasks/suggest` | POST | OpenAI | `{ tasks: [{title, detail}] }` (structured JSON, best-effort) |
| `/api/journal/analyze` | POST | OpenAI | `{ insight }` (structured JSON) |
| `/api/insights` | POST | OpenAI | Weekly pattern summary |
| `/api/exercise/recommend` | POST | OpenAI | Recommended exercise id + rationale |
| `/api/voice/transcribe` | POST | Sarvam Saarika | `{ transcript, languageCode }` |
| `/api/voice/speak` | POST | Sarvam Bulbul | `{ audio (base64 WAV), languageCode }` |

---

## 🧰 Tech stack

- **Next.js 15 (App Router) + React 19 + TypeScript** — UI and API routes in one codebase.
- **Tailwind CSS v4** — teal/mint "wellness" design tokens (`theme.css` / `tokens.json`).
- **OpenAI** (`openai` SDK) — reasoning: chat, insight, task suggestions, patterns. Server-only.
- **Sarvam AI** — Saarika (STT) + Bulbul v3 (TTS) for English/Hindi/Bengali voice. Server-only.
- **Supabase** — Postgres + Auth + Row-Level Security; client SDK talks directly with the anon key.
- **Recharts** — mood/energy trends.

---

## ⚙️ Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | _(required)_ | Server-side key for all OpenAI calls. |
| `OPENAI_MODEL` | `gpt-4o-mini` | Fast model for chat & task/exercise picks. |
| `OPENAI_ANALYSIS_MODEL` | `gpt-4o` | Stronger model for journal/insight analysis. |
| `SARVAM_API_KEY` | _(required for voice)_ | Enables Saarika STT + Bulbul TTS. |
| `SARVAM_TTS_MODEL` | `bulbul:v3` | Sarvam TTS engine (use `bulbul:v2` if v3 isn't on your plan). |
| `SARVAM_SPEAKER` | `shruti` | Default voice (overridden per companion character). |
| `NEXT_PUBLIC_SUPABASE_URL` | _(required)_ | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | _(required)_ | Supabase anon (public) key — safe in browser; RLS protects data. |

> `NEXT_PUBLIC_*` vars are inlined at build/start — **restart the dev server** after changing them. On a host (Vercel/Netlify), set all of the above in the project's env settings (`.env.local` is not deployed).

---

## 🚀 Getting started

```bash
# 1. Install
npm install

# 2. Configure
cp .env.local.example .env.local
# then fill OPENAI_API_KEY, SARVAM_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. (If using a fresh Supabase project) apply the schema
#    SQL Editor → paste supabase/schema.sql → Run

# 4. Run
npm run dev   # http://localhost:3000
```

`/` is the landing page → **Open the app** → log in with the demo creds above (or register).

### Deploy

1. Push to a Git host; import into **Vercel** (or any Next.js host).
2. Add every env var from the table above in the host's settings.
3. Ensure the Supabase schema is applied to the target project. Deploy.

---

## 📁 Project structure

```
app/
  (marketing)/page.tsx        # Landing page, served at /
  (app)/dashboard/            # Check-in, snapshot, latest insight
  (app)/journal/ companion/ trends/ exercises/ tasks/   # feature pages
  (app)/login/page.tsx        # email/password auth (Supabase)
  (app)/layout.tsx            # app shell: nav + container + disclaimer (AuthGate)
  api/chat/                   # streaming empathetic companion (OpenAI)
  api/tasks/suggest/          # structured wellbeing-task suggestions (OpenAI)
  api/journal/analyze/        # entry -> structured insight (json_schema)
  api/insights/               # patterns across moods + entries
  api/exercise/recommend/     # state -> recommended exercise
  api/voice/transcribe/       # Sarvam Saarika speech-to-text
  api/voice/speak/            # Sarvam Bulbul text-to-speech
components/                   # ChatWindow, TaskList, MoodLogger, JournalEditor,
                              # InsightCard, TrendChart, BreathingExercise, MicButton,
                              # HelplineBanner, AppNav, AuthGate, Disclaimer
lib/                          # types, store (RLS-aware Supabase hooks), prefs (lang/companion),
                              # companions (characters + languages), openai (server-only),
                              # sarvam (server-only voice), supabase + auth (client),
                              # prompts (dynamic system prompts), safety (crisis + helplines),
                              # validation (input limits), exercises, seed
supabase/schema.sql           # tables + RLS (idempotent; run once)
```

---

## 🎬 Demo script (90 seconds)

1. **Log in** with the demo creds → dashboard is already populated.
2. **Companion** → first time, pick **Bengali + Shruti** (or any combo) → say *"I'm stressed about my next mock test."* → warm, context-seeking reply **plays aloud automatically** in Shruti's voice.
3. **+ Add a suggested task** chip under the reply → it appears on the **Tasks** page.
4. **Tasks** → check one off.
5. **Companion** → send another message → the AI **acknowledges your completed task** and asks how it felt. (The advice → action → encouragement loop.)
6. **Journal** → write an entry → hidden triggers/emotions/coping appear.
7. **Trends** → "Find patterns" → AI reads your week.
8. **Safety** → type a distress phrase → helpline banner + calm crisis response.
```
