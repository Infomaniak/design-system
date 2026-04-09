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
// esds-svg custom element JSX types for react-jsx transform
declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface IntrinsicElements extends React.JSX.IntrinsicElements {
      'esds-svg': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        mode?: 'svg' | 'bg' | 'mask';
        inline?: boolean;
        nolazy?: boolean;
      };
    }
  }
}
