---
'@infomaniak-design-system/tokens': patch
---

Added support for opacity (alpha) on color tokens in the generated iOS (Swift) tokens. Colors whose components or alpha reference other tokens are now emitted as `Color.opacity(...)` expressions, and opacity tokens are no longer excluded from the Swift output.
