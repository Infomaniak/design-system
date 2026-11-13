---
'@infomaniak-design-system/tokens': minor
---

Fixed the 6xl font size to 56px, aligning it with the Figma Token Core:

- Replaced the primitive token `font.size.52` (3.25rem) with `font.size.56` (3.5rem).
- `font.size.6xl` now references `font.size.56`, so `text.6xl`, `typography.6xl.*` and `heading.2xl` render at 56px (line-height unchanged at 60px).
