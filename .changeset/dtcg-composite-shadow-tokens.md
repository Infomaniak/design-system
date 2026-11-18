---
'@infomaniak-design-system/tokens': minor
---

**Breaking:** shadow tokens are now real DTCG composite tokens (`$type: "shadow"`), aligning the code tokens with Figma Token Core:

- `shadow.{xs,sm,md,lg,xl,2xl}` are single tokens whose value holds the offset, blur, spread and color: `--esds-shadow-md` now contains the full `box-shadow` value (e.g. `0px 2px 4px -1px var(--esds-color-shadow)`).
- The per-axis sub-tokens are removed (`shadow.{size}.{x,y,blur,spread,color}` → `--esds-shadow-md-x`, …), as well as the T1 primitives `shadow.1`–`shadow.6` (`--esds-shadow-1-x`, …).
- The shadow color is now the semantic token `color.shadow` (`--esds-color-shadow`), overridden by the themes (gray.700 in light, gray.500 in dark, both at 30% opacity), referenced by every shadow: `--esds-color-shadow-md` is removed.
- The 30% opacity now lives in `color.shadow` (previously `color.gray.400` at 6–14% in the light theme and `color.gray.950` at 6–14% in the dark theme), giving more visible elevation.
- New T1 primitives: `blur.{1,2,6,10,50}`, `dimension.25` and `dimension.minus-{1,3,6,12}`.
- Removed the now-unused alpha primitives `color.gray.400-{6,8,10,14}` and `color.gray.950-{6,8,10,14}`.
- The Tailwind output now binds the `--shadow-*` theme namespace to the tokens: Tailwind's built-in shadow scale is cleared and the `shadow-{xs,sm,md,lg,xl,2xl}` utilities resolve to `--esds-shadow-*`, staying theme-swappable.

Offsets, blur and spread values are unchanged.
