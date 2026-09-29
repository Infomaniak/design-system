---
'@infomaniak-design-system/components': minor
'@infomaniak-design-system/tokens': minor
---

Added the `esds-button` custom attribute, which applies the design system button styles to native `<button>` and `<a>` elements while preserving native behavior — links keep their navigation semantics and are exposed to assistive technologies as buttons with proper `aria-disabled` handling. It supports `disabled` and `loading` states, with variants selected through `data-esds-button-type` (`primary`, `secondary`, `ghost`, and their destructive variants) and `data-esds-button-size` (`small`, `medium`, `large`) attributes. The matching design tokens ship as new `button-size` and `button-type` modifiers plus button component tokens, importable per variant or all at once (e.g. `@infomaniak-design-system/tokens/css/modifiers/button-size/all.attr.css`).
