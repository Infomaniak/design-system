---
'@infomaniak-design-system/tokens': minor
---

Improved Tailwind token generation to map color tokens to their corresponding Tailwind utilities. Color tokens prefixed with `background`, `border`, and `content` now generate `background-color-*`, `border-color-*`, and `text-color-*` utility classes respectively, instead of the generic `color-*` class, producing more idiomatic Tailwind output.
