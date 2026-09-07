# Agent Workflow

This project is developed and maintained using the **Gemini CLI** within **VS Code**.

## Development Methodology
*   **Gemini CLI:** The primary tool used for repository inspection, architectural understanding, and managing project-level instructions.
*   **Project Context:**
    *   `CLAUDE.md` and `AGENTS.md` at the project root define the instruction set and behavior for the assistant.
    *   The `.claude/skills/` directory contains documentation specifying standardized, reusable workflow patterns (e.g., Morning Brief, Inbox Triage).
*   **Verification:** All modifications are validated via direct interaction with the Next.js API route endpoints and checking the Vercel Postgres database state.

## Note on Automation
The production automations are **Next.js API routes** (`/app/api/...`).
*   **Scheduling:** Triggered by **Vercel Cron** configurations in `vercel.json`.
*   **Integration:** Google Calendar and Gmail are accessed directly using the `googleapis` library via authenticated sessions created using `getGoogleAccessToken.ts`.
*   **Note:** The `.claude/skills/` documentation does **not** imply or constitute evidence that any agent platform executed these workflows autonomously. They are documentation artifacts describing the existing Next.js logic.
