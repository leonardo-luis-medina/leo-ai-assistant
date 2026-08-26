export async function getGoogleAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}