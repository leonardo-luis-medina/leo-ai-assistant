import { NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/getGoogleAccessToken";
import { google } from "googleapis";
import { GoogleGenAI } from "@google/genai";
import { saveOutput } from "@/lib/saveOutput";

export async function GET() {
  const accessToken = await getGoogleAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  // Fetch this week's Calendar events (today through +7 days)
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(now.getDate() + 7);

  const eventsRes = await calendar.events.list({
    calendarId: "primary",
    timeMin: now.toISOString(),
    timeMax: weekFromNow.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = eventsRes.data.items || [];
  const eventSummaries = events
    .map((e) => `- ${e.summary} at ${e.start?.dateTime || e.start?.date}`)
    .join("\n");

  // Fetch this week's emails (last 7 days, not just unread)
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const messagesRes = await gmail.users.messages.list({
    userId: "me",
    q: "newer_than:7d",
    maxResults: 15,
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

  // Send to Gemini for a weekly review
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `You are my executive assistant. Based on the data below, write a concise weekly review covering: (1) what's coming up this week, (2) any patterns or themes in recent emails worth flagging, (3) 2-3 suggested priorities for the week. Keep it professional and skimmable.

THIS WEEK'S CALENDAR:
${eventSummaries || "No events scheduled this week."}

RECENT EMAILS (LAST 7 DAYS):
${emailSummaries.join("\n") || "No recent emails."}
`;

  const geminiResponse = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const generatedAt = new Date().toISOString();

  const result = {
    generatedAt,
    calendarRaw: eventSummaries,
    emailRaw: emailSummaries,
    review: geminiResponse.text,
  };

  await saveOutput("weekly-review", generatedAt, result);

  return NextResponse.json(result);
}