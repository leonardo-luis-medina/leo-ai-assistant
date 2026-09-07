# Morning Brief Skill

## Purpose
Automated generation of a concise, prioritized daily executive brief by synthesizing Google Calendar events and unread Gmail messages.

## When to Use
Run automatically via Vercel Cron or on-demand to receive a daily summary of commitments and incoming communications.

## Inputs
*   Google Calendar: Primary calendar events for today (from now until end of day).
*   Gmail: Top 5 unread messages.

## Workflow
1.  Authenticate via `getGoogleAccessToken.ts`.
2.  Fetch calendar events using `google.calendar`.
3.  Fetch unread email metadata using `google.gmail`.
4.  Send combined metadata to `gemini-3.6-flash` with an "executive assistant" prompt.
5.  Redact and save both raw and public outputs to Vercel Postgres.

## Expected Output
JSON response containing `generatedAt`, `calendarRaw`, `emailRaw`, and `brief` (the LLM-generated summary).

## Verification
1.  Invoke `GET /api/morning-brief`.
2.  Verify JSON response structure.
3.  Query `SELECT * FROM outputs WHERE route = 'morning-brief'` in the database to confirm persistence.

## Guardrails
*   Only reads metadata (Subject/From) from emails.
*   Does not delete or modify emails/events.

## Failure Handling
Throws an error if token refresh fails or API connectivity issues occur; logged in the Vercel execution environment.

## Privacy Requirements
Output is processed by `lib/redact.ts` to neutralize PII before being stored in the `redacted_content` column.
