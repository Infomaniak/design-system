---
'@infomaniak-design-system/tokens': minor
---

Added outline token bindings to the generated Tailwind CSS:

- `outline-{name}` color utilities (e.g. `outline-dim1`, `outline-feedback-error`) now resolve against the border color tokens, including opacity modifiers (`outline-dim1/50`) and variants (`hover:outline-dim1`).
- `outline-xs`, `outline-sm`, `outline-md` and `outline-lg` width utilities resolve against the border width scales (the `none` scale is skipped to keep the built-in `outline-none` style utility untouched).
- Numeric outline width utilities are blocked to keep outline widths token-driven: `outline-0`, `outline-1`, `outline-2`, `outline-4`, `outline-8`. Other bare values (`outline-3`, `outline-16`, ...) remain available (hardcoded in Tailwind's engine).
- Corrected the Tailwind class names reported for the background, content and border color tokens in the generated documentation (the previously reported names, which included the token category, did not compile).
