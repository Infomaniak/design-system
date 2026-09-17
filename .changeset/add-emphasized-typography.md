---
'@infomaniak-design-system/tokens': minor
'@infomaniak-design-system/components': minor
---

Added emphasized typography styles for headings and body text. Text emphasis is now opt-in via a new `emphasized` attribute on the `esds-heading` and `esds-body` custom attributes, new `esds-heading-{xs..xl}-emphasized` and `esds-body-{xs..lg}-emphasized` utility classes, or automatically through `<strong>` content inside a styled element.

The `heading.{xs..xl}.font` and `body.{xs..lg}.font` tokens now expose `base` and `emphasized` variants instead of a single value; the previous flat token path was removed, so consumers referencing it must update to one of the new variants (e.g. `body.md.font.base`). The corresponding CSS custom properties were renamed accordingly (`--esds-body-md-font` becomes `--esds-body-md-font-base` / `--esds-body-md-font-emphasized`). Headings no longer default to the emphasized typography style: they now render with the base style unless emphasis is applied.
