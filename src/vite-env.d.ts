/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_GA_CONSENT_MODE?: "advanced" | "basic";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
