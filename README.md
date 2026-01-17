# Gemini Web Clone

A highly accurate, client-side clone of the Google Gemini web interface, built with React, Vite, and the official Google GenAI SDK (@google/genai).

## Features

*   **Authentic UI:** Dark mode, clean typography, and message layout mimicking the real Gemini app.
*   **Chat History:** Full chat history persistence using local storage with a collapsible sidebar.
*   **Multimodal Support:** Upload multiple images via button or paste (clipboard) and chat about them.
*   **Real-time Streaming:** See responses character-by-character as they are generated.
*   **Search Grounding:** Uses Google Search to provide up-to-date information with source citations.
*   **API Key Management:** Secure client-side storage, validation testing, and easy switching of API keys.

## Setup Instructions

1.  **Clone/Create Repo:** Create a new repository and add these files.
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Locally:**
    ```bash
    npm run dev
    ```
4.  **Build for Production:**
    ```bash
    npm run build
    ```

## Important: Rate Limits & API Keys (2026 Update)

Google has significantly reduced the limits for the free tier of the Gemini API.

*   **Free Limits:** Approximately **20-50 requests per day** per key. Each message sent counts as 1 request.
*   **Reset Time:** Limits typically reset every 24 hours.
*   **Model:** This app uses `gemini-1.5-flash-latest` which offers the best balance of speed and availability for free usage.

**Strategies to handle limits:**
1.  **Multiple Keys:** Create 2-3 free API keys in Google AI Studio and switch between them using the "Change API Key" button in the sidebar when one runs out.
2.  **Pay-as-you-go:** Enable billing in Google Cloud Console. The costs for Gemini Flash are extremely low ($0.075 / 1 million input tokens), making it a very affordable option for personal heavy use.
3.  **Wait:** Simply wait for the daily quota to reset.

## Deployment & Referrer Restrictions

When deploying to services like **Netlify** or **Vercel**, your API calls will fail if your API key has HTTP Referrer restrictions that do not match your deployed domain.

**To fix "Access Denied" or "403" errors:**
1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click on your API key to edit it.
3.  **Option A (Easiest):** Set "Client restriction" to **None**. This allows the key to work on localhost and any deployed URL.
4.  **Option B (Secure):** Set "Client restriction" to **Websites** and add your specific Netlify domain (e.g., `https://your-app.netlify.app/*`) AND `http://localhost:*` (for development).

## Troubleshooting
*   **"Rate limit reached":** You hit the ~50 requests/day limit. Use a new key or wait.
*   **"I'm sorry, something went wrong":** This usually means your API Key is restricted. Use the "Change API Key" button to try a different key or check browser console for 403 errors.
*   **Model not found:** The app defaults to `gemini-1.5-flash-latest`. If you changed the code to use a Pro model, you may hit stricter limits or need billing enabled.

## Deploy to Netlify

1.  Push your code to GitHub.
2.  Log in to Netlify and click "Add new site" > "Import from existing project".
3.  Select your GitHub repository.
4.  **Build Settings:**
    *   **Build Command:** `npm run build`
    *   **Publish Directory:** `dist`
5.  Click **Deploy**.