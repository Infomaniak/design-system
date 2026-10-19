---
'@infomaniak-design-system/tokens': patch
---

Synced DTCG tokens with the latest Figma export: borders rendered on strong (dim1) feedback backgrounds are now transparent in both light and dark themes, instead of white in light theme and dark 950 shades in dark theme. Strong feedback surfaces no longer draw an outline. The theme modifier overrides for these borders were removed accordingly; the `color.border.on.feedback.*.dim1` token paths are unchanged.
