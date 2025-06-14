// Default values for development
const DEFAULT_REDIRECT_URI = 'http://localhost:3000/auth/callback';

export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '';
export const GOOGLE_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI || DEFAULT_REDIRECT_URI;

// Only create the auth URL if we have a client ID
export const GOOGLE_AUTH_URL = GOOGLE_CLIENT_ID
  ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`
  : '';
