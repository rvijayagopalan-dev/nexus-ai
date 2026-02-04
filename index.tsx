
import React from 'react';
import { jsx as _jsx } from 'react/jsx-runtime';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/**
 * The Google Client ID is now retrieved from Vite environment variables (prefix with VITE_).
 * For local development, add VITE_GOOGLE_CLIENT_ID to your .env.local file (for example: VITE_GOOGLE_CLIENT_ID=your_id).
 * For production (Vercel), add VITE_GOOGLE_CLIENT_ID to the Environment Variables in the project settings.
 */
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

if (!GOOGLE_CLIENT_ID) {
  console.warn(
    "Warning: VITE_GOOGLE_CLIENT_ID is not defined. " +
    "Google Authentication will not work until you set the environment variable (use VITE_GOOGLE_CLIENT_ID)."
  );
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App clientId={GOOGLE_CLIENT_ID} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
