---
'@infomaniak-design-system/components': patch
'@infomaniak-design-system/tokens': patch
---

Add the new Avatar components and their design tokens, aligned with the Avatar component in the Figma file _Edelweiss – Token Core_:

- New `esds-avatar` component supporting image, icon and initials avatars, with shape and size variants.
- While an image is loading or failing to load, `esds-avatar` falls back to the icon, the initials or the default user icon; the new `data-image-state` attribute reflects the image loading state and drives the image-specific styles of `esds-avatar-button`.
- New `esds-avatar-group` component to stack and group avatars.
- New `esds-avatar-button` attribute to make an avatar interactive, with hover, focus, active and disabled states.
- New T3 `avatar` tokens and `avatar-size` modifier contexts matching Figma: `small` (24px), `medium` (32px), `large` (40px) and `extra-large` (48px, default).
- Stacked-avatar overlap (`avatar.group.gap`) uses the new negative spacing tokens `spacing.minus-sm` (-6px) and `spacing.minus-md` (-8px).
- New `avatar.color.state.hover.image` / `avatar.color.state.pressed.image` tokens provide the stronger overlays used by the image variant.
- The default initials typography (`heading.xs` emphasized) matches the 48px default size.
