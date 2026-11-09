---
'@infomaniak-design-system/tokens': patch
---

State overlay colors (hover, pressed and selected, in soft, medium and strong intensities) are now derived from their base color (`color.blue.900` in light, `color.gray.50` in dark) with an exact opacity percentage, instead of pre-computed hex values with rounded alpha. The `color.blue.900-*` and `color.gray.50-*` primitives now resolve to exact alphas (e.g. 6% instead of ~5.9%); the visual rendering is unchanged.
