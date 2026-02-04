
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/**
 * The Google Client ID is now retrieved from environment variables.
 * For local development, add it to your .env file.
 * For production (Vercel), add it to the Environment Variables in the project settings.
 */
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

if (!GOOGLE_CLIENT_ID) {
  console.warn(
    "Warning: GOOGLE_CLIENT_ID is not defined. " +
    "Google Authentication will not work until you set the environment variable."
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
