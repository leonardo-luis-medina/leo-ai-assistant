import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function redactText(text: string): Promise<string> {
  const prompt = `Rewrite the text below for public display. Replace real people's names with their role (e.g. "a course coordinator"), replace company/project names with generic terms (e.g. "a cloud platform"), remove email addresses entirely, and remove any account/security details. Keep the structure, formatting, and overall meaning identical. Return ONLY the rewritten text, nothing else.

TEXT:
${text}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text ?? text;
}

export async function redactContent(content: Record<string, unknown>) {
  const redacted = { ...content };
  for (const key of ["brief", "triage", "review"]) {
    if (typeof redacted[key] === "string") {
      redacted[key] = await redactText(redacted[key] as string);
    }
  }
  // strip raw calendar/email fields entirely from the public version
  delete redacted.calendarRaw;
  delete redacted.emailRaw;
  return redacted;
}