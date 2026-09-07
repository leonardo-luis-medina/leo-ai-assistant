# AI Guardrails

This project implements strict guardrails to ensure data integrity and user privacy.

## Implemented Guardrails
*   **ReadOnly Data Access:** The application *only* performs read operations (`calendar.events.list`, `gmail.users.messages.list`, `gmail.users.messages.get`). It never attempts to send, delete, or modify user data.
*   **Privacy-First Design:** All generated AI outputs (`brief`, `triage`, `review`) are passed through an LLM-based redaction process (`lib/redact.ts`) *before* being stored in the database for potential public display or review. This ensures PII, specific names, and company identifiers are replaced with generic roles.
*   **Sensitive Data Sanitization:** Raw calendar event lists and raw email metadata arrays are explicitly deleted from the `redacted_content` storage object before persistence in the database.
*   **Credential Security:** The application architecture strictly separates secrets via environment variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GEMINI_API_KEY`). These are never hardcoded or logged.

## Recommended Operating Rules
*   **Fabrication Prevention:** The system must never invent events or emails. If the API returns no results, the prompt forces an explicit "No events/emails" message.
*   **Human Review:** The AI acts as an *executive assistant*, not an *executor*. All triaged categorization or review priorities require human review before any consequential action (e.g., deleting emails) is taken.
*   **Uncertainty Flagging:** If the model cannot categorize an email, it should flag it for human review rather than guessing the category.
