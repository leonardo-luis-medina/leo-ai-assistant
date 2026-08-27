import { sql } from "@vercel/postgres";

export async function saveOutput(route: string, generatedAt: string, content: unknown) {
  await sql`
    INSERT INTO outputs (route, generated_at, content)
    VALUES (${route}, ${generatedAt}, ${JSON.stringify(content)})
  `;
}