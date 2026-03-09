/// <reference types="vite/client" />

// CSS module declarations for importing CSS files
declare module '*.css' {
  const css: string;
  export default css;
}
