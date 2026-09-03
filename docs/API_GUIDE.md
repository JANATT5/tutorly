# Tutorly API Guide

A reference for everything under `src/app/api/`, `src/lib/`, and `src/hooks/`
— the REST API, the shared client layer, and the AI features. If you're
new to this codebase, read this once top to bottom, then keep it open as a
reference while you build.

## How a request travels

Four layers, always in this order — pages and components never talk to the
database except through an API route:

```
Prisma schema  →  API route  →  React hook  →  Page / component
prisma/schema.prisma   src/app/api/<resource>/route.ts   src/hooks/use<Resource>.ts   src/app/**, src/components/**
```

## Every resource follows the same shape

```
src/app/api/<resource>/
  schema.ts        # zod validation — create schema, edit schema
  route.ts         # GET (list)   · POST (create)
  [id]/route.ts    # GET (one)    · PUT (replace) · PATCH (partial) · DELETE
```

(Some routes now import their schema from `src/app/api/schemas/<resource>.schema.ts`
instead of a co-located `schema.ts` — an in-progress reorganization of the
same pattern, not a different one.)

One rule holds across every resource: the field that says *who this row
belongs to* — `userId`, `tutorId`, `studentId`, `subjectId` — is set once on
create and is never part of the edit schema. You can rename a tutor's bio;
you can't reassign whose profile it is.

## The response envelope

Every route replies through `src/lib/apiResponse.ts` (`ok`, `created`,
`fail`, `handlePrismaError`), so every response body has the same shape,
and the HTTP transport status is always `200`:

```ts
{ status: number, message: string, data?: T }
```

The client helpers in `src/lib/axios.ts` (`axiosGet`/`axiosPost`/
`axiosPut`/`axiosPatch`/`axiosDelete`) read the *real* outcome from that
embedded `status` — a value `>= 400` throws an `ApiError`, exactly like a
real HTTP error would. A page never has to special-case "the server
answered 200 but actually failed."

## The 10 resources

| Resource | Base path | Notes |
|---|---|---|
| Tutors | `/api/tutors` | `sessions` is a live `COUNT` of COMPLETED bookings, not a column. Nested `PATCH /api/tutors/:id/subjects` replaces a tutor's whole subject list (a many-to-many join, not a plain field). |
| Applications | `/api/applications` | `reviewedAt` auto-stamps when `status` becomes APPROVED/REJECTED. |
| Users | `/api/users` | `password` is never selected into any response (`userSafeSelect`) — **not hashed yet**, a real gap if this ever handles real accounts. |
| Students | `/api/students` | |
| Subjects | `/api/subjects` | |
| Bookings | `/api/bookings` | `status` (PENDING/CONFIRMED/COMPLETED/CANCELLED) drives 3 different dashboard views from the same rows — no separate "request" concept exists. |
| Reviews | `/api/reviews` | API works; no "leave a review" UI exists yet. |
| Practice questions | `/api/practice-questions` | Real seeded bank (`prisma/seed-practice-questions.mjs`) — 8 questions per subject (Easy/Medium/Hard) across all 5 subjects, 40 total, not the original ~105 mock questions. |
| Quiz questions | `/api/quiz-questions` | Content-only store; the interactive career quiz's question bank lives in `src/app/quiz/page.tsx` instead (see AI Features below) since it needed more structure than this model has. |
| Quiz results | `/api/quiz-results` | `studentId` has **no foreign key** in the schema — a typo'd id won't be caught the way it is everywhere else. |
| Planr paths | `/api/planr-paths` | |

## Hooks & the current user

`src/hooks/createResourceHooks.ts` builds the standard `useList / useOne /
useCreate / useUpdate / usePatch / useDelete` set for a resource. Each
`src/hooks/use<Resource>.ts` calls it once with that resource's real
Prisma-derived type (`src/interfaces/*.ts`) and its zod-inferred request
types, so a resource's TypeScript types and its runtime validation can
never quietly drift apart.

`src/hooks/useCurrentUser.ts` bridges the fake login cookie
(`src/lib/session.ts` — 3 hardcoded demo accounts, no real session
verification) to a real database id: it looks up the `User` row by
username, then the matching `StudentProfile`/`TutorProfile`. The 3 demo
accounts are seeded as real rows (`prisma/seed-demo-accounts.mjs`) for
exactly this. This is a bridge, not real auth — fine for a demo, would need
real server-side session verification before this ever handles real users.

## AI features

Three features run on a local LLM via [Ollama](https://ollama.com) — free,
no API key, no signup. `src/lib/ai/client.ts` points the `openai` npm
package's SDK at `http://localhost:11434/v1` by default (Ollama speaks the
same Chat Completions API shape); set `OPENAI_API_KEY` + unset
`OPENAI_BASE_URL` in `.env` to switch to real OpenAI later — no code
changes needed either way.

**Grounding, not guessing:** the local model is small and more prone to
inventing plausible-sounding facts than a frontier model, so anything
touching real data goes through tool-calling against Prisma
(`src/lib/ai/tools.ts`: `search_tutors`, `list_subjects`,
`get_tutor_details`, `search_practice_questions`), never free-text
generation. `src/lib/ai/structuredCompletion.ts` is the same idea for
features that need one specific JSON shape back (not open chat) — a single
tool whose parameters ARE the shape being asked for, validated with zod on
the way back, with a real "please try again" error instead of a crash if
the model returns something malformed.

| Feature | Route | What's real vs. not |
|---|---|---|
| Chatbot | `POST /api/chat` | Fully real — tool-calling loop grounded in live Prisma data. `src/components/chat/ChatWidget.tsx`, mounted globally in `layout.tsx`. No conversation persistence (lost on refresh). |
| Career quiz | `POST /api/ai/career-recommendation` | The 8 questions are fixed content in `quiz/page.tsx` (not user-generated, no reason to store them); the recommendation itself is real AI, grounded so `subjectsToStrengthen` can only ever be real subject names. Result saved via `POST /api/quiz-results` for a logged-in student. |
| Planr roadmap | `POST /api/ai/roadmap` | Real AI-generated, informed by the student's stated goal + self-rated skills. Saved via `POST /api/planr-paths`. |

**Speed.** The default model is `llama3.2:3b`, not `qwen3:4b` — both are
pulled locally and confirmed working, but `qwen3:4b` reasons step-by-step
by default even for trivial prompts (measured 1–6 tokens/sec, 1–4 minutes
per response). `llama3.2:3b` skips that and measured ~20–60s per response
on this machine — a real, meaningful improvement, though still not
instant. Every AI feature's UI shows an honest "this can take a bit"
loading state rather than pretending it's instant. Switch back with
`OPENAI_MODEL=qwen3:4b` in `.env` if quality ever matters more than speed
— no code changes needed either way.

**Known limitation: structured-output reliability.** The career quiz and
Planr roadmap routes need one specific JSON shape back, forced via
`tool_choice: "required"` in `src/lib/ai/structuredCompletion.ts` (see the
comments there for what was tested directly against this model). Measured
directly: `llama3.2:3b` doesn't honor that 100% of the time — a deeply
nested response shape (an array nested inside each item of another array)
measured as low as ~35% success per attempt, a flatter shape ~75-95%. Two
real mitigations are in place, not just "trust the model": routes are kept
as flat as the data actually needs (e.g. `subjectsToStrengthen` lives at
the top level of the career-recommendation response, not per-path, since
it's a whole-quiz-result concept anyway), and `structuredCompletion` makes
up to 3 independent attempts before giving up. A genuine triple failure
still surfaces the honest "please try again" error — never a crash, never
a fabricated result — and can take up to ~2-3 minutes to reach that error
in the worst case. The chatbot doesn't hit this: its tool-calling is the
default `auto` mode (multiple optional tools, open-ended chat), which is
measurably more reliable than forcing one specific required shape.

## Wired pages

| Page | Status |
|---|---|
| `/`, `/browse`, `/tutors/[id]`, `/tutors/[id]/book(/confirmation)`, `/dashboard` (all 3 roles), `/practice`, `/quiz`, `/planr/create-project` | Live — real data throughout |
| `/become-tutor` | Live — submitting creates a real User + TutorProfile + PENDING TutorApplication, which shows up in the admin dashboard's Verification tab |
| `/login` | Deliberately unchanged — see "Hooks & the current user" above |

## Known gaps

Nothing here is hidden or silently faked — if you build on this next,
these are the real edges:

1. **Passwords aren't hashed.** `User.password` is plain text. Fine for
   seeded demo accounts; not fine for a real account.
2. **No route-level authorization.** Every endpoint works for anyone who
   can call it. The API validates shape, not permission.
3. **`QuizResult.studentId` has no foreign key** — a pre-existing schema
   gap, not something any pass here introduced.
4. **No Course or Availability model** — the dashboards' "Courses" tabs and
   the tutor Availability tab are explicit placeholders, not fake data.
5. **`useCurrentUser` is a bridge, not real auth** — it trusts a cookie's
   username, not a verified server session.
6. **AI responses are slow and can occasionally be wrong** — small local
   model, no human review loop (unlike, say, TutorApplication's admin
   approval). Every AI-authored message/result is labeled as such in the UI.

## Demo accounts

Seeded by `prisma/seed-demo-accounts.mjs` (safe to re-run):

| Role | Username | Password |
|---|---|---|
| Student | `test` | `1234` |
| Tutor | `tutor1` | `1234` |
| Admin | `admin` | `tutorly-admin` |

`prisma/seed-tutors.mjs` and `prisma/seed-content.mjs` seed the rest of the
demo data (tutors, bookings, applications, etc.) — also safe to re-run.
