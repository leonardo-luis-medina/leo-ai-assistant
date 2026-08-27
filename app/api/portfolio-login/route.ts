import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.PORTFOLIO_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("portfolio_auth", process.env.PORTFOLIO_PASSWORD!, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}