---
'@infomaniak-design-system/components': minor
'@infomaniak-design-system/tokens': minor
---

Added the `esds-kbd` custom attribute, which styles native `<kbd>` elements as keyboard keys — extra-small emphasized body typography with muted content color on a surface background, rounded with a `md` radius and a subtle `dim3` border, all driven by design tokens. The attribute can only be used on `<kbd>` elements, preserving native semantics. The element lays its content out with a flex `gap` token: multi-key shortcuts stay within a single `<kbd esds-kbd>` element, wrapping the `+` separator in a `<span>` so the keys are evenly spaced (e.g. `<kbd esds-kbd>⌘<span>+</span>K</kbd>`).
