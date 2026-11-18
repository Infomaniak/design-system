---
'@infomaniak-design-system/tokens': patch
---

State overlay colors (hover, pressed and selected, in soft, medium and strong intensities) are now expressed on the theme modifiers as their base color (`color.blue.900` in light, `color.gray.50` in dark) with an exact opacity percentage, matching Figma, instead of pointing to pre-computed alpha primitives. Resolved alphas become exact (e.g. 6% instead of ~5.9%); the visual rendering is unchanged.
