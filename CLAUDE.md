@AGENTS.md

# Leo AI Assistant - Project-Level Instructions

## Project Purpose
The **Leo AI Assistant** is a Personal AI Operating System (OS) designed to streamline personal productivity by automatically synthesizing scheduling and communication data. It directly integrates with Google Calendar and Gmail, uses Gemini 3.6 Flash to generate smart summaries, and stores outputs securely in Vercel Postgres using a dual-tier privacy design (raw vs. redacted).

---

## Important Directories & Files
*   `app/api/morning-brief/route.ts`: Daily schedule and unread email synthesizer.
*   `app/api/inbox-triage/route.ts`: Categorizer of recent emails with specialized job alert filter.
*   `app/api/weekly-review/route.ts`: Upcoming calendar and past email trend analyzer.
*   `lib/getGoogleAccessToken.ts`: Refreshes Google OAuth2 access tokens dynamically.
*   `lib/saveOutput.ts`: Persists raw and sanitized results to Vercel Postgres.
*   `lib/redact.ts`: LLM-powered privacy filter to replace PII and strip raw metadata.
*   `vercel.json`: Configuration for the Vercel Cron Jobs scheduling the automations.

---

## The Three Existing Automations
1.  **Morning Brief (`/api/morning-brief`)**: Consolidates today's remaining calendar events and up to 5 unread emails into a concise, prioritized 3-5 bullet brief.
2.  **Inbox Triage (`/api/inbox-triage`)**: Sorts the last 3 days of emails into exactly four categories: `URGENT`, `IMPORTANT`, `FYI`, and `PROMOTIONAL/NOISE`. Direct recruiters/applications are treated as `IMPORTANT`, whereas bulk digests are filtered into `PROMOTIONAL/NOISE`.
3.  **Weekly Review (`/api/weekly-review`)**: Formulates upcoming calendar events and recent emails (past 7 days) into a strategic summary of themes, trends, and top priorities.

---

## Code Modification Guidelines
*   **Inspect Before Modifying:** ALWAYS inspect the existing Next.js APIs, utilities, and typing structures before modifying any codebase logic. Adhere strictly to the Next.js 16.x + React 19 rules found in `node_modules/next/dist/docs/`.
*   **Preserve Existing Functionality:** Do not break existing API routes, Google integrations, or Postgres logging behaviors unless explicitly instructed by the user.

---

## Verification Requirements
*   Every change must be verified by making on-demand HTTP requests to the respective Next.js API endpoints.
*   Check Postgres records to confirm that both raw and redacted JSON outputs are correctly persisted with correct route names and ISO timestamps.

---

## Anti-Hallucination Rules
*   Do not invent emails, events, names, dates, or tasks that do not exist in the raw Google API payload.
*   Clearly differentiate between fetched metadata and AI-generated interpretations.
*   If data is empty (e.g. no events or emails), state "No events" or "No emails" rather than improvising.

---

## Privacy & Security Rules
*   **Secret Protection:** NEVER expose, log, print, or commit API keys, client secrets, Google refresh tokens, or any `.env.local` variables.
*   **Public Redaction:** Ensure that any content stored in `redacted_content` is fully processed by `lib/redact.ts` (stripping out raw arrays and utilizing the LLM to neutralize names, companies, and email addresses).
*   **Non-destructive Operations:** The system must only read Gmail/Calendar data. It must never delete, modify, or draft messages or events unless explicitly requested and approved by a human.
*   **Human Review:** Any consequential decision, system modification, or security setting must be reviewed and approved by the user.
