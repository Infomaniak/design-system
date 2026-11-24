# Playground

> The [Playground](../playground/index.html) is an in-browser code editor for the design system: write HTML and TypeScri...

The [Playground](../playground/index.html) is an in-browser code editor for the design system: write HTML and TypeScript using ESDS components **with no install, no build and no hosting**, then share your snippet as a plain URL. This is useful to quickly prototype an idea or to reproduce a bug.

**→ [Open the Playground](../playground/index.html)**

## Pinning versions

To reproduce an issue against a specific release, edit the versions directly in the snippet:

- `package.json` → `"@infomaniak-design-system/components": "0.7.1"` (exact version), `"rc"` or
  `"dev"` (dist-tags) instead of `"latest"`.
- `index.html` → the tokens `<link>` URLs (`@latest`, `@0.10.0`, `@rc`, …).
