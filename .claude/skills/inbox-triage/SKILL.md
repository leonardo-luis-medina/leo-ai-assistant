# Inbox Triage Skill

## Purpose
Automated categorization of recent emails into actionable buckets to reduce inbox noise.

## When to Use
Run automatically via Vercel Cron or on-demand to manage high-volume email traffic.

## Inputs
*   Gmail: Top 20 messages from the last 3 days (`newer_than:3d`).

## Workflow
1.  Authenticate via `getGoogleAccessToken.ts`.
2.  Fetch recent email metadata using `google.gmail`.
3.  Send metadata to `gemini-3.6-flash` with a prompt to categorize into `URGENT`, `IMPORTANT`, `FYI`, and `PROMOTIONAL/NOISE`.
4.  Apply specialized logic to filter automated job digests as `PROMOTIONAL/NOISE`.
5.  Redact and save to Vercel Postgres.

## Expected Output
JSON response containing `generatedAt`, `emailRaw`, and `triage` (the LLM-generated categorization).

## Verification
1.  Invoke `GET /api/inbox-triage`.
2.  Verify JSON structure.
3.  Query database to confirm successful persistence of `inbox-triage` route data.

## Guardrails
*   Explicit instruction to ignore/filter bulk automated job alerts.
*   Does not delete or modify emails.

## Failure Handling
Fails safely if API calls are disrupted; errors require manual investigation of execution logs.

## Privacy Requirements
Raw email data is sanitized by `lib/redact.ts` before being saved to public-facing storage fields.
