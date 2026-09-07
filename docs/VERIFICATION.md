# Verification

Instructions for validating the functionality of the automations.

## General Verification Steps
1.  **Invoke:** Call the API route via `curl` or browser (e.g., `GET http://localhost:3000/api/morning-brief`).
2.  **Confirm Output:** Ensure the returned JSON includes the expected fields (`generatedAt`, raw data arrays, and the AI-generated summary/triage).
3.  **Check Persistence:** Connect to the Vercel Postgres instance and query the `outputs` table:
    `SELECT * FROM outputs WHERE route = 'morning-brief' ORDER BY generated_at DESC LIMIT 1;`
4.  **Validate Sanitization:** Verify that `redacted_content` exists in the database record and has been properly scrubbed of raw email/calendar arrays.

## Endpoint-Specific Verification

| Endpoint | Scheduled? | Cron Pattern | Trigger |
| :--- | :--- | :--- | :--- |
| `/api/morning-brief` | Yes | `0 0 * * *` | Daily at 00:00 UTC |
| `/api/inbox-triage` | Yes | `0 2 * * *` | Daily at 02:00 UTC |
| `/api/weekly-review` | No | N/A | Manually/On-demand |

## Evidence Requirements
*   **Database Record:** An entry in the `outputs` table for the target route is mandatory evidence of successful execution.
*   **Log Output:** Successful console logs or Vercel deployment logs indicating no errors during execution.
