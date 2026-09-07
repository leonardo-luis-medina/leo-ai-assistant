# MCP Rationale

This project does **not** use the Model Context Protocol (MCP) or Cowork.

## Architecture
The application achieves integration with Google services directly through standard API protocols:
*   **Authentication:** The project utilizes standard OAuth2 flows. `lib/getGoogleAccessToken.ts` handles token refreshing by exchanging the `GOOGLE_REFRESH_TOKEN` for a valid `access_token`.
*   **Connectivity:** Next.js API route handlers use the official `googleapis` package to directly instantiate `google.calendar` and `google.gmail` clients.
*   **Integration Layer:** This direct API integration serves as the primary integration layer, bypassing the need for middleware or abstraction protocols like MCP.

While MCP could potentially be used as an alternative architecture to abstract these service connections, it is not part of this implementation.
