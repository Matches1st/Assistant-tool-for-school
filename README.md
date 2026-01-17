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

This application has been updated to use **Gemini 2.5 Flash** as the 1.5 series is now deprecated.

*   **Free Limits:** Approximately **500 requests per day** per key on the free tier.
*   **Model:** `gemini-2.5-flash` (Stable).
*   **Capabilities:** Improved text reasoning, image analysis, and search grounding.

**Strategies to handle limits:**
1.  **Pay-as-you-go:** Enable billing in Google Cloud Console. The costs for Gemini Flash are extremely low, making it a very affordable option for personal heavy use.
2.  **Multiple Keys:** Create free API keys in Google AI Studio and switch between them using the "Change API Key" button in the sidebar if you hit limits.

## Deployment & Referrer Restrictions

When deploying to services like **Netlify** or **Vercel**, your API calls will fail if your API key has HTTP Referrer restrictions that do not match your deployed domain.

**To fix "Access Denied" or "403" errors:**
1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click on your API key to edit it.
3.  **Option A (Easiest):** Set "Client restriction" to **None**. This allows the key to work on localhost and any deployed URL.
4.  **Option B (Secure):** Set "Client restriction" to **Websites** and add your specific Netlify domain (e.g., `https://your-app.netlify.app/*`) AND `http://localhost:*` (for development).

## Troubleshooting
*   **"Rate limit reached":** You hit the daily request limit. Use a new key or wait 24 hours.
*   **"The requested model is not available":** Ensure you are using a valid API key that has access to `gemini-2.5-flash`.
*   **"I'm sorry, something went wrong":** This usually means your API Key is restricted. Use the "Change API Key" button to try a different key or check browser console for 403 errors.

## Deploy to Netlify

1.  Push your code to GitHub.
2.  Log in to Netlify and click "Add new site" > "Import from existing project".
3.  Select your GitHub repository.
4.  **Build Settings:**
    *   **Build Command:** `npm run build`
    *   **Publish Directory:** `dist`
5.  Click **Deploy**.