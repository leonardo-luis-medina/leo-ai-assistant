# Weekly Review Skill

## Purpose
Automated strategic synthesis of upcoming calendar commitments and recent email trends.

## When to Use
Run manually or on-demand at the start of the week.

## Inputs
*   Google Calendar: Events for the next 7 days.
*   Gmail: Top 15 messages from the last 7 days (`newer_than:7d`).

## Workflow
1.  Authenticate via `getGoogleAccessToken.ts`.
2.  Fetch weekly calendar and recent email metadata.
3.  Prompt `gemini-3.6-flash` for: (1) coming events, (2) email patterns/themes, and (3) 2-3 suggested priorities.
4.  Redact and save result.

## Expected Output
JSON response containing `generatedAt`, `calendarRaw`, `emailRaw`, and `review` (the LLM-generated analysis).

## Verification
1.  Invoke `GET /api/weekly-review`.
2.  Check for structured JSON output.
3.  Confirm persistence in `outputs` database table.

## Guardrails
*   Professional tone enforcement.
*   Does not modify or send calendar/email data.

## Failure Handling
Logs errors to Vercel logs if data fetching or Gemini generation fails.

## Privacy Requirements
Final review content is filtered for PII via `lib/redact.ts`.
