---
'@infomaniak-design-system/tokens': minor
---

**Breaking:** shadow colors now live with the rest of each shadow definition, matching Figma (Token Core):

- `color.shadow.{xs,sm,md,lg,xl,2xl}` are renamed to `shadow.{xs,sm,md,lg,xl,2xl}.color` (e.g. `--esds-color-shadow-md` → `--esds-shadow-md-color`).
- Shadow colors are expressed as their base color with an exact opacity (`color.gray.400` in light, `color.gray.950` in dark, from 6% to 14%). The rendered colors are unchanged.
- Removed the now-unused alpha primitives `color.gray.400-{6,8,10,14}` and `color.gray.950-{6,8,10,14}`.
