import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { google } from "googleapis";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return NextResponse.json(
      { error: "Not signed in. Sign in first at the homepage." },
      { status: 401 }
    );
  }

  const accessToken = (session as any).accessToken;

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  // Fetch today's Calendar events
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const eventsRes = await calendar.events.list({
    calendarId: "primary",
    timeMin: now.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = eventsRes.data.items || [];
  const eventSummaries = events
    .map((e) => `- ${e.summary} at ${e.start?.dateTime || e.start?.date}`)
    .join("\n");

  // Fetch recent unread Gmail
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const messagesRes = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread",
    maxResults: 5,
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

  // Send to Gemini for summarization
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `You are my executive assistant. Based on the data below, write a short, professional morning brief with 3-5 bullet highlights. Be concise and prioritize by urgency.

TODAY'S CALENDAR:
${eventSummaries || "No events today."}

UNREAD EMAILS:
${emailSummaries.join("\n") || "No unread emails."}
`;

  const geminiResponse = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    calendarRaw: eventSummaries,
    emailRaw: emailSummaries,
    brief: geminiResponse.text,
  });
}