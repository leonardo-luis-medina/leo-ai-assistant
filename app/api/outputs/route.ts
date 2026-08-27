import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("portfolio_auth")?.value === process.env.PORTFOLIO_PASSWORD;

  const { rows } = await sql`
    SELECT id, route, generated_at, content, redacted_content, created_at
    FROM outputs
    ORDER BY created_at DESC
    LIMIT 20
  `;

  const outputs = rows.map((row) => ({
    id: row.id,
    route: row.route,
    generated_at: row.generated_at,
    created_at: row.created_at,
    redactedContent: row.redacted_content ?? row.content,
    unredactedContent: isAuthed ? row.content : null,
  }));

  return NextResponse.json({ outputs, isAuthed });
}