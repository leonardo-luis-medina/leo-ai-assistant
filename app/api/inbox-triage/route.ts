import { NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/getGoogleAccessToken";
import { google } from "googleapis";
import { GoogleGenAI } from "@google/genai";
import { saveOutput } from "@/lib/saveOutput";

export async function GET() {
  const accessToken = await getGoogleAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const messagesRes = await gmail.users.messages.list({
    userId: "me",
    q: "newer_than:3d",
    maxResults: 20,
  });

  const messageIds = messagesRes.data.messages || [];
  const emailSummaries: string[] = [];

  for (const msg of messageIds) {
    const msgDetail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id!,
      format: "metadata",
      metadataHeaders: ["Subject", "From"],
    });
    const headers = msgDetail.data.payload?.headers || [];
    const subject = headers.find((h) => h.name === "Subject")?.value || "(no subject)";
    const from = headers.find((h) => h.name === "From")?.value || "(unknown sender)";
    emailSummaries.push(`- From ${from}: ${subject}`);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `You are my executive assistant doing inbox triage. Categorize the emails below into exactly these buckets: URGENT (needs action today), IMPORTANT (needs action this week), FYI (informational, no action needed), and PROMOTIONAL/NOISE (job alerts, marketing, can be ignored or bulk-deleted). For each bucket, list the relevant emails briefly. End with a one-line recommendation on what to do with the PROMOTIONAL/NOISE bucket.

EMAILS (LAST 3 DAYS):
${emailSummaries.join("\n") || "No recent emails."}
`;

  const geminiResponse = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const generatedAt = new Date().toISOString();

  const result = {
    generatedAt,
    emailRaw: emailSummaries,
    triage: geminiResponse.text,
  };

  await saveOutput("inbox-triage", generatedAt, result);

  return NextResponse.json(result);
}