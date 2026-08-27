import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  const { rows } = await sql`
    SELECT id, route, generated_at, content, created_at
    FROM outputs
    ORDER BY created_at DESC
    LIMIT 20
  `;

  return NextResponse.json({ outputs: rows });
}