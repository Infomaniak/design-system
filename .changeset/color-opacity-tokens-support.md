---
'@infomaniak-design-system/tokens': patch
---

Added support for opacity (alpha) on color tokens in the generated iOS (Swift) tokens. Colors whose components or alpha reference other tokens are now emitted as `Color.opacity(...)` expressions, and opacity tokens are no longer excluded from the Swift output.

Color tokens are now excluded from the Kotlin output by token type instead of by name, and are exported to Figma as DTCG color objects (`{ colorSpace, components, alpha }`) instead of hex strings. On the web, color tokens whose components or alpha reference other tokens are emitted using the CSS relative color syntax (ex: `rgb(from var(--color-red) r g b / var(--opacity-20))`).
