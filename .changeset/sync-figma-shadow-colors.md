---
'@infomaniak-design-system/tokens': minor
---

**Breaking:** shadow colors now live with the rest of each shadow definition, matching Figma (Token Core):

- `color.shadow.{xs,sm,md,lg,xl,2xl}` are renamed to `shadow.{xs,sm,md,lg,xl,2xl}.color` (e.g. `--esds-color-shadow-md` → `--esds-shadow-md-color`).
- Shadow colors use `color.gray.700` at 30% opacity in the light theme (previously `color.gray.400` at 6–14%) and `color.gray.500` at 30% opacity in the dark theme (previously `color.gray.950` at 6–14%), giving more visible elevation.
- Removed the now-unused alpha primitives `color.gray.400-{6,8,10,14}` and `color.gray.950-{6,8,10,14}`.

Offsets, blur and spread are unchanged.
