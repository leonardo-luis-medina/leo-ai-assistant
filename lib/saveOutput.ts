import { sql } from "@vercel/postgres";
import { redactContent } from "./redact";

export async function saveOutput(route: string, generatedAt: string, content: Record<string, unknown>) {
  const redacted = await redactContent(content);

  await sql`
    INSERT INTO outputs (route, generated_at, content, redacted_content)
    VALUES (${route}, ${generatedAt}, ${JSON.stringify(content)}, ${JSON.stringify(redacted)})
  `;
}