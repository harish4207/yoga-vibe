/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_SECRET: string;
  readonly VITE_GOOGLE_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_GOOGLE_CLIENT_ID: string;
    REACT_APP_GOOGLE_CLIENT_SECRET: string;
    REACT_APP_GOOGLE_REDIRECT_URI: string;
  }
} 