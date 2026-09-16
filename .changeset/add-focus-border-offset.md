---
'@infomaniak-design-system/tokens': minor
'@infomaniak-design-system/components': minor
---

Added a new `focus.border.offset` token (defaults to `spacing.2xs`), exposed as the `--esds-focus-border-offset` CSS custom property. The focus effect on `esds-text-link` now offsets its outline with this token, so the focus ring no longer overlaps the link text and can be tuned via the custom property.
