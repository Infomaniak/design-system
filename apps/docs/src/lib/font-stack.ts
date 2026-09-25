/**
 * Font stack applied as the default typography across the whole Storybook UI
 * (manager chrome, docs pages and story canvas).
 *
 * Kept in a dedicated module with no `import.meta.env` access so it can safely
 * be imported by both the Vite-built preview and the esbuild-built manager.
 */
export const fontBase: string = "'Infomaniak Sans', sans-serif";
