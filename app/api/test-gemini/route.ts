import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function GET() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "Say hello in one short sentence, confirming you're connected.",
  });

  return NextResponse.json({ reply: response.text });
}