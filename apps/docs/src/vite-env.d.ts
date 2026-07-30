/// <reference types="vite/client" />

// CSS module declarations for importing CSS files
declare module '*.css' {
  const css: string;
  export default css;
}
// Extend ImportMetaEnv with custom env variables
interface ImportMetaEnv {
  readonly VITE_ICONIFY_API_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
