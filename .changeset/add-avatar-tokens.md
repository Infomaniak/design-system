---
'@infomaniak-design-system/tokens': patch
---

Aligned the Avatar tokens with the Avatar component in Figma:

- The `avatar-size` modifier contexts now match Figma: `small` (24px), `medium` (32px), `large` (40px) and `extra-large` (48px, default). `extra-small` is removed.
- Stacked-avatar overlap (`avatar.group.gap`) now uses the new negative spacing tokens `spacing.minus-sm` (-6px) and `spacing.minus-md` (-8px).
- The default initials typography matches the 48px default size (`heading.xs` emphasized).
- New `avatar.color.state.hover.image` / `avatar.color.state.pressed.image` tokens provide the stronger overlays used by the image variant.
