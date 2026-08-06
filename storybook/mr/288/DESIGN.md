---
typography:
  display:
    md:
      base:
        fontFamily: "Suisse Int'l"
        fontSize: "48px"
        fontWeight: "400"
        lineHeight: "56px"
        letterSpacing: "0px"
      emphasized:
        fontFamily: "Suisse Int'l"
        fontSize: "48px"
        fontWeight: "500"
        lineHeight: "56px"
        letterSpacing: "0px"
  heading:
    lg:
      base:
        fontFamily: "Suisse Int'l"
        fontSize: "40px"
        fontWeight: "400"
        lineHeight: "48px"
        letterSpacing: "0px"
      emphasized:
        fontFamily: "Suisse Int'l"
        fontSize: "40px"
        fontWeight: "500"
        lineHeight: "48px"
        letterSpacing: "0px"
    md:
      base:
        fontFamily: "Suisse Int'l"
        fontSize: "32px"
        fontWeight: "400"
        lineHeight: "40px"
        letterSpacing: "0px"
      emphasized:
        fontFamily: "Suisse Int'l"
        fontSize: "32px"
        fontWeight: "500"
        lineHeight: "40px"
        letterSpacing: "0px"
    sm:
      base:
        fontFamily: "Suisse Int'l"
        fontSize: "24px"
        fontWeight: "400"
        lineHeight: "32px"
        letterSpacing: "0px"
      emphasized:
        fontFamily: "Suisse Int'l"
        fontSize: "24px"
        fontWeight: "500"
        lineHeight: "32px"
        letterSpacing: "0px"
  title:
    md:
      base:
        fontFamily: "Suisse Int'l"
        fontSize: "20px"
        fontWeight: "400"
        lineHeight: "28px"
        letterSpacing: "0px"
      emphasized:
        fontFamily: "Suisse Int'l"
        fontSize: "20px"
        fontWeight: "500"
        lineHeight: "28px"
        letterSpacing: "0px"
  body:
    lg:
      base:
        fontFamily: "Suisse Int'l"
        fontSize: "18px"
        fontWeight: "400"
        lineHeight: "26px"
        letterSpacing: "0px"
      emphasized:
        fontFamily: "Suisse Int'l"
        fontSize: "18px"
        fontWeight: "500"
        lineHeight: "26px"
        letterSpacing: "0px"
    md:
      base:
        fontFamily: "Suisse Int'l"
        fontSize: "16px"
        fontWeight: "400"
        lineHeight: "24px"
        letterSpacing: "0px"
      emphasized:
        fontFamily: "Suisse Int'l"
        fontSize: "16px"
        fontWeight: "500"
        lineHeight: "24px"
        letterSpacing: "0px"
    sm:
      base:
        fontFamily: "Suisse Int'l"
        fontSize: "14px"
        fontWeight: "400"
        lineHeight: "20px"
        letterSpacing: "0px"
      emphasized:
        fontFamily: "Suisse Int'l"
        fontSize: "14px"
        fontWeight: "500"
        lineHeight: "20px"
        letterSpacing: "0px"
  caption:
    md:
      base:
        fontFamily: "Suisse Int'l"
        fontSize: "12px"
        fontWeight: "400"
        lineHeight: "16px"
        letterSpacing: "0px"
      emphasized:
        fontFamily: "Suisse Int'l"
        fontSize: "12px"
        fontWeight: "500"
        lineHeight: "16px"
        letterSpacing: "0px"
---

# Design Tokens Reference

## 1. System Overview

This design tokens reference is part of the Infomaniak Design System. It contains the default resolved token values for the design system, accounting for light and dark theme variants. Use this file as the definitive reference when building UI components. The values shown represent the default product; when building for a specific product (calendar, mail, swisstransfer, etc.), the build system automatically resolves the same token names to the correct product-specific colors.

## 2. Semantic Tokens (The Usage)

| Token Name | Light Value | Dark Value | CSS Variable | Description |
|---|---|---|---|---|
| blur.none | 0px | 0px | var(--esds-blur-none) | No blur; sharp, unaffected element. |
| blur.xs | 4px | 4px | var(--esds-blur-xs) | Extra-small blur for subtle focus effects. |
| blur.sm | 8px | 8px | var(--esds-blur-sm) | Small blur for soft focus and light depth. |
| blur.md | 12px | 12px | var(--esds-blur-md) | Medium blur for moderate focus and depth. |
| blur.lg | 16px | 16px | var(--esds-blur-lg) | Large blur for prominent depth and focus. |
| blur.xl | 24px | 24px | var(--esds-blur-xl) | Extra-large blur for strong focus effects. |
| blur.2xl | 40px | 40px | var(--esds-blur-2xl) | 2x-large blur for heavy depth and frosted effects. |
| blur.3xl | 64px | 64px | var(--esds-blur-3xl) | 3x-large blur for maximum frosted-glass effects. |
| border.none.width | 0px | 0px | var(--esds-border-none-width) | No border width. |
| border.xs.width | 1px | 1px | var(--esds-border-xs-width) | Extra-small border width for fine hairline borders. |
| border.sm.width | 2px | 2px | var(--esds-border-sm-width) | Small border width for subtle outlines. |
| border.md.width | 3px | 3px | var(--esds-border-md-width) | Medium border width for default element outlines. |
| border.lg.width | 4px | 4px | var(--esds-border-lg-width) | Large border width for emphasized outlines. |
| color.background.elevation.sunken.default | #f1f5f9 | #020618 | var(--esds-color-background-elevation-sunken-default) | Background for sunken, recessed surfaces below the base level. |
| color.background.elevation.sunken.hover | #e2e8f0 | #0f172b | var(--esds-color-background-elevation-sunken-hover) | Background for sunken, recessed surfaces below the base level. |
| color.background.elevation.sunken.pressed | #cad5e2 | #192334 | var(--esds-color-background-elevation-sunken-pressed) | Background for sunken, recessed surfaces below the base level. |
| color.background.elevation.sunken.selected | #cad5e2 | #192334 | var(--esds-color-background-elevation-sunken-selected) | Background for sunken, recessed surfaces below the base level. |
| color.background.elevation.surface.default | #fff | #192334 | var(--esds-color-background-elevation-surface-default) | Background for the default surface level, the base UI layer. |
| color.background.elevation.surface.hover | #f8fafc | #314158 | var(--esds-color-background-elevation-surface-hover) | Background for the default surface level, the base UI layer. |
| color.background.elevation.surface.pressed | #f1f5f9 | #0f172b | var(--esds-color-background-elevation-surface-pressed) | Background for the default surface level, the base UI layer. |
| color.background.elevation.surface.selected | #f1f5f9 | #0f172b | var(--esds-color-background-elevation-surface-selected) | Background for the default surface level, the base UI layer. |
| color.background.elevation.raised.default | #fff | #192334 | var(--esds-color-background-elevation-raised-default) | Background for raised, elevated surfaces such as cards. |
| color.background.elevation.raised.hover | #f8fafc | #314158 | var(--esds-color-background-elevation-raised-hover) | Background for raised, elevated surfaces such as cards. |
| color.background.elevation.raised.pressed | #f1f5f9 | #0f172b | var(--esds-color-background-elevation-raised-pressed) | Background for raised, elevated surfaces such as cards. |
| color.background.elevation.raised.selected | #f1f5f9 | #0f172b | var(--esds-color-background-elevation-raised-selected) | Background for raised, elevated surfaces such as cards. |
| color.background.elevation.overlay.default | #f1f5f9 | #192334 | var(--esds-color-background-elevation-overlay-default) | Background for overlay and modal surfaces above the base UI. |
| color.background.elevation.overlay.hover | #e2e8f0 | #314158 | var(--esds-color-background-elevation-overlay-hover) | Background for overlay and modal surfaces above the base UI. |
| color.background.elevation.overlay.pressed | #cad5e2 | #0f172b | var(--esds-color-background-elevation-overlay-pressed) | Background for overlay and modal surfaces above the base UI. |
| color.background.elevation.overlay.selected | #cad5e2 | #0f172b | var(--esds-color-background-elevation-overlay-selected) | Background for overlay and modal surfaces above the base UI. |
| color.background.brand.infomaniak.default | #0077cf | #36adfa | var(--esds-color-background-brand-infomaniak-default) | Infomaniak brand background colors. |
| color.background.brand.infomaniak.hover | #015ca3 | #7cc8fd | var(--esds-color-background-brand-infomaniak-hover) | Infomaniak brand background colors. |
| color.background.brand.infomaniak.pressed | #064e86 | #0c93eb | var(--esds-color-background-brand-infomaniak-pressed) | Infomaniak brand background colors. |
| color.background.brand.mail.default | #e9004c | #ff97af | var(--esds-color-background-brand-mail-default) | Mail product brand background colors. |
| color.background.brand.mail.hover | #d7004b | #ffc6d3 | var(--esds-color-background-brand-mail-hover) | Mail product brand background colors. |
| color.background.brand.mail.pressed | #b40045 | #ff5d86 | var(--esds-color-background-brand-mail-pressed) | Mail product brand background colors. |
| color.background.brand.kdrive.default | #3e66f3 | #95b5fb | var(--esds-color-background-brand-kdrive-default) | kDrive product brand background colors. |
| color.background.brand.kdrive.hover | #2846e8 | #c0d1fd | var(--esds-color-background-brand-kdrive-hover) | kDrive product brand background colors. |
| color.background.brand.kdrive.pressed | #2033d5 | #5c89f7 | var(--esds-color-background-brand-kdrive-pressed) | kDrive product brand background colors. |
| color.background.brand.euria.default | #0071ec | #48c2ff | var(--esds-color-background-brand-euria-default) | Euria product brand background colors. |
| color.background.brand.euria.hover | #085dc5 | #83d8ff | var(--esds-color-background-brand-euria-hover) | Euria product brand background colors. |
| color.background.brand.euria.pressed | #0d519b | #1ea4ff | var(--esds-color-background-brand-euria-pressed) | Euria product brand background colors. |
| color.background.brand.kchat.default | #007bab | #75ddff | var(--esds-color-background-brand-kchat-default) | kChat product brand background colors. |
| color.background.brand.kchat.hover | #00668d | #b6ebff | var(--esds-color-background-brand-kchat-hover) | kChat product brand background colors. |
| color.background.brand.kchat.pressed | #065474 | #2cceff | var(--esds-color-background-brand-kchat-pressed) | kChat product brand background colors. |
| color.background.brand.security.default | #4d62ea | #a3c4fe | var(--esds-color-background-brand-security-default) | Security product brand background colors. |
| color.background.brand.security.hover | #3546cd | #c6dcff | var(--esds-color-background-brand-security-hover) | Security product brand background colors. |
| color.background.brand.security.pressed | #2d3da6 | #7ea1fb | var(--esds-color-background-brand-security-pressed) | Security product brand background colors. |
| color.background.brand.calendar.default | #0f6e77 | #4cc6d4 | var(--esds-color-background-brand-calendar-default) | Calendar product brand background colors. |
| color.background.brand.calendar.hover | #0c5961 | #6fe5f4 | var(--esds-color-background-brand-calendar-hover) | Calendar product brand background colors. |
| color.background.brand.calendar.pressed | #04454b | #009fad | var(--esds-color-background-brand-calendar-pressed) | Calendar product brand background colors. |
| color.background.brand.contacts.default | #9346ff | #cab1ff | var(--esds-color-background-brand-contacts-default) | Contacts product brand background colors. |
| color.background.brand.contacts.hover | #8f30f7 | #e0d4ff | var(--esds-color-background-brand-contacts-hover) | Contacts product brand background colors. |
| color.background.brand.contacts.pressed | #811ee3 | #b185ff | var(--esds-color-background-brand-contacts-pressed) | Contacts product brand background colors. |
| color.background.brand.knote.default | #d93a00 | #ffb36b | var(--esds-color-background-brand-knote-default) | kNote product brand background colors. |
| color.background.brand.knote.hover | #a32c09 | #ffd3a4 | var(--esds-color-background-brand-knote-hover) | kNote product brand background colors. |
| color.background.brand.knote.pressed | #83270b | #ff882f | var(--esds-color-background-brand-knote-pressed) | kNote product brand background colors. |
| color.background.brand.swisstransfer.default | #15864e | #7bdaa2 | var(--esds-color-background-brand-swisstransfer-default) | SwissTransfer product brand background colors. |
| color.background.brand.swisstransfer.hover | #116b40 | #afebc4 | var(--esds-color-background-brand-swisstransfer-hover) | SwissTransfer product brand background colors. |
| color.background.brand.swisstransfer.pressed | #105535 | #3cb572 | var(--esds-color-background-brand-swisstransfer-pressed) | SwissTransfer product brand background colors. |
| color.background.brand.default | #0077cf | #0077cf | var(--esds-color-background-brand-default) | Default brand background (Infomaniak). |
| color.background.brand.pressed | #064e86 | #064e86 | var(--esds-color-background-brand-pressed) | Pressed state of the default brand background. |
| color.background.brand.hover | #015ca3 | #015ca3 | var(--esds-color-background-brand-hover) | Hover state of the default brand background. |
| color.background.feedback.success.dim1.default | #1ec95e | #41e17c | var(--esds-color-background-feedback-success-dim1-default) | Strong success background (dim1). |
| color.background.feedback.success.dim1.hover | #12a74a | #83f2ac | var(--esds-color-background-feedback-success-dim1-hover) | Strong success background (dim1). |
| color.background.feedback.success.dim1.pressed | #12833d | #1ec95e | var(--esds-color-background-feedback-success-dim1-pressed) | Strong success background (dim1). |
| color.background.feedback.success.dim2.default | #b9f9d0 | #12552d | var(--esds-color-background-feedback-success-dim2-default) | Soft success background (dim2). |
| color.background.feedback.success.dim2.hover | #83f2ac | #146734 | var(--esds-color-background-feedback-success-dim2-hover) | Soft success background (dim2). |
| color.background.feedback.success.dim2.pressed | #41e17c | #042f16 | var(--esds-color-background-feedback-success-dim2-pressed) | Soft success background (dim2). |
| color.background.feedback.warning.dim1.default | #ffa032 | #ffb34a | var(--esds-color-background-feedback-warning-dim1-default) | Strong warning background (dim1). |
| color.background.feedback.warning.dim1.hover | #f97207 | #ffd188 | var(--esds-color-background-feedback-warning-dim1-hover) | Strong warning background (dim1). |
| color.background.feedback.warning.dim1.pressed | #dd4f02 | #ffa032 | var(--esds-color-background-feedback-warning-dim1-pressed) | Strong warning background (dim1). |
| color.background.feedback.warning.dim2.default | #ffd188 | #7a200d | var(--esds-color-background-feedback-warning-dim2-default) | Soft warning background (dim2). |
| color.background.feedback.warning.dim2.hover | #ffb34a | #94260c | var(--esds-color-background-feedback-warning-dim2-hover) | Soft warning background (dim2). |
| color.background.feedback.warning.dim2.pressed | #ffa032 | #460d02 | var(--esds-color-background-feedback-warning-dim2-pressed) | Soft warning background (dim2). |
| color.background.feedback.error.dim1.default | #ff5757 | #ff5757 | var(--esds-color-background-feedback-error-dim1-default) | Strong error background (dim1). |
| color.background.feedback.error.dim1.hover | #ff2323 | #ff9494 | var(--esds-color-background-feedback-error-dim1-hover) | Strong error background (dim1). |
| color.background.feedback.error.dim1.pressed | #f00 | #ff2323 | var(--esds-color-background-feedback-error-dim1-pressed) | Strong error background (dim1). |
| color.background.feedback.error.dim2.default | #ffc0c0 | #920a0a | var(--esds-color-background-feedback-error-dim2-default) | Soft error background (dim2). |
| color.background.feedback.error.dim2.hover | #ff9494 | #b10303 | var(--esds-color-background-feedback-error-dim2-hover) | Soft error background (dim2). |
| color.background.feedback.error.dim2.pressed | #ff5757 | #500000 | var(--esds-color-background-feedback-error-dim2-pressed) | Soft error background (dim2). |
| color.background.disabled | #e2e8f0 | #192334 | var(--esds-color-background-disabled) | Background for disabled, non-interactive elements. |
| color.background.dataviz.orange.dim1.default | #dd4f02 | #ffa032 | var(--esds-color-background-dataviz-orange-dim1-default) | Strong orange data-viz background (dim1). |
| color.background.dataviz.orange.dim1.hover | #b73206 | #ffb34a | var(--esds-color-background-dataviz-orange-dim1-hover) | Strong orange data-viz background (dim1). |
| color.background.dataviz.orange.dim1.pressed | #94260c | #f97207 | var(--esds-color-background-dataviz-orange-dim1-pressed) | Strong orange data-viz background (dim1). |
| color.background.dataviz.orange.dim2.default | #ffd188 | #94260c | var(--esds-color-background-dataviz-orange-dim2-default) | Soft orange data-viz background (dim2). |
| color.background.dataviz.orange.dim2.hover | #ffb34a | #b73206 | var(--esds-color-background-dataviz-orange-dim2-hover) | Soft orange data-viz background (dim2). |
| color.background.dataviz.orange.dim2.pressed | #ffa032 | #460d02 | var(--esds-color-background-dataviz-orange-dim2-pressed) | Soft orange data-viz background (dim2). |
| color.background.dataviz.emerald.dim1.default | #15864e | #3cb572 | var(--esds-color-background-dataviz-emerald-dim1-default) | Strong emerald data-viz background (dim1). |
| color.background.dataviz.emerald.dim1.hover | #116b40 | #7bdaa2 | var(--esds-color-background-dataviz-emerald-dim1-hover) | Strong emerald data-viz background (dim1). |
| color.background.dataviz.emerald.dim1.pressed | #105535 | #23a662 | var(--esds-color-background-dataviz-emerald-dim1-pressed) | Strong emerald data-viz background (dim1). |
| color.background.dataviz.emerald.dim2.default | #afebc4 | #105535 | var(--esds-color-background-dataviz-emerald-dim2-default) | Soft emerald data-viz background (dim2). |
| color.background.dataviz.emerald.dim2.hover | #7bdaa2 | #116b40 | var(--esds-color-background-dataviz-emerald-dim2-hover) | Soft emerald data-viz background (dim2). |
| color.background.dataviz.emerald.dim2.pressed | #3cb572 | #072719 | var(--esds-color-background-dataviz-emerald-dim2-pressed) | Soft emerald data-viz background (dim2). |
| color.background.dataviz.blue.dim1.default | #0077cf | #36adfa | var(--esds-color-background-dataviz-blue-dim1-default) | Strong blue data-viz background (dim1). |
| color.background.dataviz.blue.dim1.hover | #015ca3 | #7cc8fd | var(--esds-color-background-dataviz-blue-dim1-hover) | Strong blue data-viz background (dim1). |
| color.background.dataviz.blue.dim1.pressed | #064e86 | #0c93eb | var(--esds-color-background-dataviz-blue-dim1-pressed) | Strong blue data-viz background (dim1). |
| color.background.dataviz.blue.dim2.default | #b9e0fe | #064e86 | var(--esds-color-background-dataviz-blue-dim2-default) | Soft blue data-viz background (dim2). |
| color.background.dataviz.blue.dim2.hover | #7cc8fd | #015ca3 | var(--esds-color-background-dataviz-blue-dim2-hover) | Soft blue data-viz background (dim2). |
| color.background.dataviz.blue.dim2.pressed | #36adfa | #072a4a | var(--esds-color-background-dataviz-blue-dim2-pressed) | Soft blue data-viz background (dim2). |
| color.background.dataviz.violet.dim1.default | #8f30f7 | #b185ff | var(--esds-color-background-dataviz-violet-dim1-default) | Strong violet data-viz background (dim1). |
| color.background.dataviz.violet.dim1.hover | #811ee3 | #cab1ff | var(--esds-color-background-dataviz-violet-dim1-hover) | Strong violet data-viz background (dim1). |
| color.background.dataviz.violet.dim1.pressed | #6c18bf | #9346ff | var(--esds-color-background-dataviz-violet-dim1-pressed) | Strong violet data-viz background (dim1). |
| color.background.dataviz.violet.dim2.default | #e0d4ff | #6c18bf | var(--esds-color-background-dataviz-violet-dim2-default) | Soft violet data-viz background (dim2). |
| color.background.dataviz.violet.dim2.hover | #cab1ff | #811ee3 | var(--esds-color-background-dataviz-violet-dim2-hover) | Soft violet data-viz background (dim2). |
| color.background.dataviz.violet.dim2.pressed | #b185ff | #370b6a | var(--esds-color-background-dataviz-violet-dim2-pressed) | Soft violet data-viz background (dim2). |
| color.background.dataviz.purple.dim1.default | #4d62ea | #7ea1fb | var(--esds-color-background-dataviz-purple-dim1-default) | Strong purple data-viz background (dim1). |
| color.background.dataviz.purple.dim1.hover | #3546cd | #a3c4fe | var(--esds-color-background-dataviz-purple-dim1-hover) | Strong purple data-viz background (dim1). |
| color.background.dataviz.purple.dim1.pressed | #2d3da6 | #607ff4 | var(--esds-color-background-dataviz-purple-dim1-pressed) | Strong purple data-viz background (dim1). |
| color.background.dataviz.purple.dim2.default | #c6dcff | #2d3da6 | var(--esds-color-background-dataviz-purple-dim2-default) | Soft purple data-viz background (dim2). |
| color.background.dataviz.purple.dim2.hover | #a3c4fe | #3546cd | var(--esds-color-background-dataviz-purple-dim2-hover) | Soft purple data-viz background (dim2). |
| color.background.dataviz.purple.dim2.pressed | #7ea1fb | #1a204c | var(--esds-color-background-dataviz-purple-dim2-pressed) | Soft purple data-viz background (dim2). |
| color.background.dataviz.pink.dim1.default | #e9004c | #ff5d86 | var(--esds-color-background-dataviz-pink-dim1-default) | Strong pink data-viz background (dim1). |
| color.background.dataviz.pink.dim1.hover | #d7004b | #ff97af | var(--esds-color-background-dataviz-pink-dim1-hover) | Strong pink data-viz background (dim1). |
| color.background.dataviz.pink.dim1.pressed | #b40045 | #ff2461 | var(--esds-color-background-dataviz-pink-dim1-pressed) | Strong pink data-viz background (dim1). |
| color.background.dataviz.pink.dim2.default | #ffc6d3 | #b40045 | var(--esds-color-background-dataviz-pink-dim2-default) | Soft pink data-viz background (dim2). |
| color.background.dataviz.pink.dim2.hover | #ff97af | #d7004b | var(--esds-color-background-dataviz-pink-dim2-hover) | Soft pink data-viz background (dim2). |
| color.background.dataviz.pink.dim2.pressed | #ff5d86 | #570022 | var(--esds-color-background-dataviz-pink-dim2-pressed) | Soft pink data-viz background (dim2). |
| color.background.dataviz.yellow.dim1.default | #ecb306 | #fccf20 | var(--esds-color-background-dataviz-yellow-dim1-default) | Strong yellow data-viz background (dim1). |
| color.background.dataviz.yellow.dim1.hover | #cc8a02 | #fee046 | var(--esds-color-background-dataviz-yellow-dim1-hover) | Strong yellow data-viz background (dim1). |
| color.background.dataviz.yellow.dim1.pressed | #a26206 | #ecb306 | var(--esds-color-background-dataviz-yellow-dim1-pressed) | Strong yellow data-viz background (dim1). |
| color.background.dataviz.yellow.dim2.default | #fff089 | #864d0d | var(--esds-color-background-dataviz-yellow-dim2-default) | Soft yellow data-viz background (dim2). |
| color.background.dataviz.yellow.dim2.hover | #fee046 | #a26206 | var(--esds-color-background-dataviz-yellow-dim2-hover) | Soft yellow data-viz background (dim2). |
| color.background.dataviz.yellow.dim2.pressed | #fccf20 | #422006 | var(--esds-color-background-dataviz-yellow-dim2-pressed) | Soft yellow data-viz background (dim2). |
| color.background.dataviz.gray.dim1.default | #62748e | #90a1b9 | var(--esds-color-background-dataviz-gray-dim1-default) | Strong gray data-viz background (dim1). |
| color.background.dataviz.gray.dim1.hover | #45556c | #cad5e2 | var(--esds-color-background-dataviz-gray-dim1-hover) | Strong gray data-viz background (dim1). |
| color.background.dataviz.gray.dim1.pressed | #314158 | #62748e | var(--esds-color-background-dataviz-gray-dim1-pressed) | Strong gray data-viz background (dim1). |
| color.background.dataviz.gray.dim2.default | #e2e8f0 | #192334 | var(--esds-color-background-dataviz-gray-dim2-default) | Soft gray data-viz background (dim2). |
| color.background.dataviz.gray.dim2.hover | #cad5e2 | #314158 | var(--esds-color-background-dataviz-gray-dim2-hover) | Soft gray data-viz background (dim2). |
| color.background.dataviz.gray.dim2.pressed | #90a1b9 | #020618 | var(--esds-color-background-dataviz-gray-dim2-pressed) | Soft gray data-viz background (dim2). |
| color.background.dataviz.dim1.default | #0077cf | #0077cf | var(--esds-color-background-dataviz-dim1-default) | Default dim1 data-viz background. |
| color.background.dataviz.dim1.hover | #015ca3 | #015ca3 | var(--esds-color-background-dataviz-dim1-hover) | Dim1 data-viz background on hover. |
| color.background.dataviz.dim1.pressed | #064e86 | #064e86 | var(--esds-color-background-dataviz-dim1-pressed) | Dim1 data-viz background on press. |
| color.background.dataviz.dim2.default | #b9e0fe | #b9e0fe | var(--esds-color-background-dataviz-dim2-default) | Default dim2 data-viz background. |
| color.background.dataviz.dim2.hover | #7cc8fd | #7cc8fd | var(--esds-color-background-dataviz-dim2-hover) | Dim2 data-viz background on hover. |
| color.background.dataviz.dim2.pressed | #36adfa | #36adfa | var(--esds-color-background-dataviz-dim2-pressed) | Dim2 data-viz background on press. |
| color.content.on.disabled | #90a1b9 | #62748e | var(--esds-color-content-on-disabled) | Content color for disabled states on backgrounds. |
| color.content.on.brand.infomaniak.default | #fff | #072a4a | var(--esds-color-content-on-brand-infomaniak-default) | Foreground on Infomaniak brand backgrounds. |
| color.content.on.brand.calendar.default | #fff | #001f23 | var(--esds-color-content-on-brand-calendar-default) | Foreground on Calendar brand backgrounds. |
| color.content.on.brand.contacts.default | #fff | #370b6a | var(--esds-color-content-on-brand-contacts-default) | Foreground on Contacts brand backgrounds. |
| color.content.on.brand.euria.default | #fff | #0e315d | var(--esds-color-content-on-brand-euria-default) | Foreground on Euria brand backgrounds. |
| color.content.on.brand.kchat.default | #fff | #04354d | var(--esds-color-content-on-brand-kchat-default) | Foreground on kChat brand backgrounds. |
| color.content.on.brand.kdrive.default | #fff | #181c53 | var(--esds-color-content-on-brand-kdrive-default) | Foreground on kDrive brand backgrounds. |
| color.content.on.brand.knote.default | #fff | #471003 | var(--esds-color-content-on-brand-knote-default) | Foreground on kNote brand backgrounds. |
| color.content.on.brand.mail.default | #fff | #570022 | var(--esds-color-content-on-brand-mail-default) | Foreground on Mail brand backgrounds. |
| color.content.on.brand.security.default | #fff | #1a204c | var(--esds-color-content-on-brand-security-default) | Foreground on Security brand backgrounds. |
| color.content.on.brand.swisstransfer.default | #fff | #072719 | var(--esds-color-content-on-brand-swisstransfer-default) | Foreground on SwissTransfer brand backgrounds. |
| color.content.on.brand.default | #fff | #fff | var(--esds-color-content-on-brand-default) | Default foreground on brand backgrounds. |
| color.content.on.feedback.success.dim1.default | #042f16 | #f0fdf4 | var(--esds-color-content-on-feedback-success-dim1-default) | Foreground on strong success backgrounds (dim1). |
| color.content.on.feedback.success.dim2.default | #042f16 | #042f16 | var(--esds-color-content-on-feedback-success-dim2-default) | Foreground on soft success backgrounds (dim2). |
| color.content.on.feedback.warning.dim1.default | #7a200d | #fff7eb | var(--esds-color-content-on-feedback-warning-dim1-default) | Foreground on strong warning backgrounds (dim1). |
| color.content.on.feedback.warning.dim2.default | #460d02 | #460d02 | var(--esds-color-content-on-feedback-warning-dim2-default) | Foreground on soft warning backgrounds (dim2). |
| color.content.on.feedback.error.dim1.default | #920a0a | #fdd | var(--esds-color-content-on-feedback-error-dim1-default) | Foreground on strong error backgrounds (dim1). |
| color.content.on.feedback.error.dim2.default | #500000 | #500000 | var(--esds-color-content-on-feedback-error-dim2-default) | Foreground on soft error backgrounds (dim2). |
| color.content.on.dataviz.blue.dim1.default | #0b426f | #e0effe | var(--esds-color-content-on-dataviz-blue-dim1-default) | Foreground on strong blue data-viz backgrounds (dim1). |
| color.content.on.dataviz.blue.dim2.default | #f0f8ff | #072a4a | var(--esds-color-content-on-dataviz-blue-dim2-default) | Foreground on soft blue data-viz backgrounds (dim2). |
| color.content.on.dataviz.emerald.dim1.default | #0e462d | #d6f5df | var(--esds-color-content-on-dataviz-emerald-dim1-default) | Foreground on strong emerald data-viz backgrounds (dim1). |
| color.content.on.dataviz.emerald.dim2.default | #eefbf2 | #072719 | var(--esds-color-content-on-dataviz-emerald-dim2-default) | Foreground on soft emerald data-viz backgrounds (dim2). |
| color.content.on.dataviz.orange.dim1.default | #7a200d | #ffe9c6 | var(--esds-color-content-on-dataviz-orange-dim1-default) | Foreground on strong orange data-viz backgrounds (dim1). |
| color.content.on.dataviz.orange.dim2.default | #ffe9c6 | #460d02 | var(--esds-color-content-on-dataviz-orange-dim2-default) | Foreground on soft orange data-viz backgrounds (dim2). |
| color.content.on.dataviz.pink.dim1.default | #990241 | #ffe0e6 | var(--esds-color-content-on-dataviz-pink-dim1-default) | Foreground on strong pink data-viz backgrounds (dim1). |
| color.content.on.dataviz.pink.dim2.default | #ffeff2 | #570022 | var(--esds-color-content-on-dataviz-pink-dim2-default) | Foreground on soft pink data-viz backgrounds (dim2). |
| color.content.on.dataviz.purple.dim1.default | #2c3983 | #dfecff | var(--esds-color-content-on-dataviz-purple-dim1-default) | Foreground on strong purple data-viz backgrounds (dim1). |
| color.content.on.dataviz.purple.dim2.default | #eef5ff | #1a204c | var(--esds-color-content-on-dataviz-purple-dim2-default) | Foreground on soft purple data-viz backgrounds (dim2). |
| color.content.on.dataviz.violet.dim1.default | #59169c | #efe8ff | var(--esds-color-content-on-dataviz-violet-dim1-default) | Foreground on strong violet data-viz backgrounds (dim1). |
| color.content.on.dataviz.violet.dim2.default | #f6f2ff | #370b6a | var(--esds-color-content-on-dataviz-violet-dim2-default) | Foreground on soft violet data-viz backgrounds (dim2). |
| color.content.on.dataviz.yellow.dim1.default | #723f11 | #fef9c3 | var(--esds-color-content-on-dataviz-yellow-dim1-default) | Foreground on strong yellow data-viz backgrounds (dim1). |
| color.content.on.dataviz.yellow.dim2.default | #fefce8 | #422006 | var(--esds-color-content-on-dataviz-yellow-dim2-default) | Foreground on soft yellow data-viz backgrounds (dim2). |
| color.content.on.dataviz.gray.dim1.default | #0f172b | #f1f5f9 | var(--esds-color-content-on-dataviz-gray-dim1-default) | Foreground on strong gray data-viz backgrounds (dim1). |
| color.content.on.dataviz.gray.dim2.default | #f8fafc | #020618 | var(--esds-color-content-on-dataviz-gray-dim2-default) | Foreground on soft gray data-viz backgrounds (dim2). |
| color.content.on.dataviz.dim1.default | #0b426f | #0b426f | var(--esds-color-content-on-dataviz-dim1-default) | Default foreground on data-viz dim1 backgrounds. |
| color.content.on.dataviz.dim2.default | #f0f8ff | #f0f8ff | var(--esds-color-content-on-dataviz-dim2-default) | Default foreground on data-viz dim2 backgrounds. |
| color.content.brand.infomaniak.default | #0077cf | #36adfa | var(--esds-color-content-brand-infomaniak-default) | Infomaniak brand foreground colors. |
| color.content.brand.infomaniak.hover | #015ca3 | #7cc8fd | var(--esds-color-content-brand-infomaniak-hover) | Infomaniak brand foreground colors. |
| color.content.brand.infomaniak.pressed | #064e86 | #0c93eb | var(--esds-color-content-brand-infomaniak-pressed) | Infomaniak brand foreground colors. |
| color.content.brand.mail.default | #d7004b | #ff5d86 | var(--esds-color-content-brand-mail-default) | Mail product brand foreground colors. |
| color.content.brand.mail.hover | #b40045 | #ff97af | var(--esds-color-content-brand-mail-hover) | Mail product brand foreground colors. |
| color.content.brand.mail.pressed | #990241 | #ff2461 | var(--esds-color-content-brand-mail-pressed) | Mail product brand foreground colors. |
| color.content.brand.kdrive.default | #3e66f3 | #95b5fb | var(--esds-color-content-brand-kdrive-default) | kDrive product brand foreground colors. |
| color.content.brand.kdrive.hover | #2846e8 | #c0d1fd | var(--esds-color-content-brand-kdrive-hover) | kDrive product brand foreground colors. |
| color.content.brand.kdrive.pressed | #2033d5 | #5c89f7 | var(--esds-color-content-brand-kdrive-pressed) | kDrive product brand foreground colors. |
| color.content.brand.euria.default | #068aff | #48c2ff | var(--esds-color-content-brand-euria-default) | Euria product brand foreground colors. |
| color.content.brand.euria.hover | #0071ec | #83d8ff | var(--esds-color-content-brand-euria-hover) | Euria product brand foreground colors. |
| color.content.brand.euria.pressed | #085dc5 | #1ea4ff | var(--esds-color-content-brand-euria-pressed) | Euria product brand foreground colors. |
| color.content.brand.kchat.default | #009cd4 | #2cceff | var(--esds-color-content-brand-kchat-default) | kChat product brand foreground colors. |
| color.content.brand.kchat.hover | #007bab | #75ddff | var(--esds-color-content-brand-kchat-hover) | kChat product brand foreground colors. |
| color.content.brand.kchat.pressed | #00668d | #00b0e6 | var(--esds-color-content-brand-kchat-pressed) | kChat product brand foreground colors. |
| color.content.brand.security.default | #4d62ea | #7ea1fb | var(--esds-color-content-brand-security-default) | Security product brand foreground colors. |
| color.content.brand.security.hover | #3546cd | #a3c4fe | var(--esds-color-content-brand-security-hover) | Security product brand foreground colors. |
| color.content.brand.security.pressed | #2d3da6 | #607ff4 | var(--esds-color-content-brand-security-pressed) | Security product brand foreground colors. |
| color.content.brand.calendar.default | #0c5961 | #009fad | var(--esds-color-content-brand-calendar-default) | Calendar product brand foreground colors. |
| color.content.brand.calendar.hover | #04454b | #4cc6d4 | var(--esds-color-content-brand-calendar-hover) | Calendar product brand foreground colors. |
| color.content.brand.calendar.pressed | #023137 | #0a848f | var(--esds-color-content-brand-calendar-pressed) | Calendar product brand foreground colors. |
| color.content.brand.contacts.default | #9346ff | #cab1ff | var(--esds-color-content-brand-contacts-default) | Contacts product brand foreground colors. |
| color.content.brand.contacts.hover | #8f30f7 | #e0d4ff | var(--esds-color-content-brand-contacts-hover) | Contacts product brand foreground colors. |
| color.content.brand.contacts.pressed | #811ee3 | #b185ff | var(--esds-color-content-brand-contacts-pressed) | Contacts product brand foreground colors. |
| color.content.brand.knote.default | #f94f00 | #ff882f | var(--esds-color-content-brand-knote-default) | kNote product brand foreground colors. |
| color.content.brand.knote.hover | #d93a00 | #ffb36b | var(--esds-color-content-brand-knote-hover) | kNote product brand foreground colors. |
| color.content.brand.knote.pressed | #a32c09 | #ff6707 | var(--esds-color-content-brand-knote-pressed) | kNote product brand foreground colors. |
| color.content.brand.swisstransfer.default | #15864e | #3cb572 | var(--esds-color-content-brand-swisstransfer-default) | SwissTransfer product brand foreground colors. |
| color.content.brand.swisstransfer.hover | #116b40 | #7bdaa2 | var(--esds-color-content-brand-swisstransfer-hover) | SwissTransfer product brand foreground colors. |
| color.content.brand.swisstransfer.pressed | #105535 | #23a662 | var(--esds-color-content-brand-swisstransfer-pressed) | SwissTransfer product brand foreground colors. |
| color.content.brand.default | #0077cf | #0077cf | var(--esds-color-content-brand-default) | Default brand foreground color. |
| color.content.brand.hover | #015ca3 | #015ca3 | var(--esds-color-content-brand-hover) | Hover state of the default brand foreground. |
| color.content.brand.pressed | #064e86 | #064e86 | var(--esds-color-content-brand-pressed) | Pressed state of the default brand foreground. |
| color.content.primary | #192334 | #f1f5f9 | var(--esds-color-content-primary) | Primary content color for main text and headings. |
| color.content.secondary | #45556c | #cad5e2 | var(--esds-color-content-secondary) | Secondary content color for supporting text. |
| color.content.tertiary | #62748e | #90a1b9 | var(--esds-color-content-tertiary) | Tertiary content color for subtle, low-emphasis text. |
| color.content.disabled | #90a1b9 | #62748e | var(--esds-color-content-disabled) | Content color for disabled text and icons. |
| color.content.inverse | #f1f5f9 | #192334 | var(--esds-color-content-inverse) | Inverse content color for use on dark backgrounds. |
| color.content.feedback.error.default | #d70000 | #ff9494 | var(--esds-color-content-feedback-error-default) | Error foreground color with interaction states. |
| color.content.feedback.error.hover | #b10303 | #ffc0c0 | var(--esds-color-content-feedback-error-hover) | Error foreground color with interaction states. |
| color.content.feedback.error.pressed | #920a0a | #ff5757 | var(--esds-color-content-feedback-error-pressed) | Error foreground color with interaction states. |
| color.content.feedback.success.default | #12833d | #83f2ac | var(--esds-color-content-feedback-success-default) | Success foreground color with interaction states. |
| color.content.feedback.success.hover | #146734 | #b9f9d0 | var(--esds-color-content-feedback-success-hover) | Success foreground color with interaction states. |
| color.content.feedback.success.pressed | #12552d | #41e17c | var(--esds-color-content-feedback-success-pressed) | Success foreground color with interaction states. |
| color.content.feedback.warning.default | #b73206 | #ffb34a | var(--esds-color-content-feedback-warning-default) | Warning foreground color with interaction states. |
| color.content.feedback.warning.hover | #94260c | #ffd188 | var(--esds-color-content-feedback-warning-hover) | Warning foreground color with interaction states. |
| color.content.feedback.warning.pressed | #7a200d | #ffa032 | var(--esds-color-content-feedback-warning-pressed) | Warning foreground color with interaction states. |
| color.content.visited.default | #8f30f7 | #cab1ff | var(--esds-color-content-visited-default) | Visited-link content colors with interaction states. |
| color.content.visited.hover | #811ee3 | #e0d4ff | var(--esds-color-content-visited-hover) | Visited-link content colors with interaction states. |
| color.content.visited.pressed | #6c18bf | #b185ff | var(--esds-color-content-visited-pressed) | Visited-link content colors with interaction states. |
| color.border.brand.infomaniak.default | #0c93eb | #36adfa | var(--esds-color-border-brand-infomaniak-default) | Infomaniak brand border colors. |
| color.border.brand.infomaniak.hover | #0077cf | #7cc8fd | var(--esds-color-border-brand-infomaniak-hover) | Infomaniak brand border colors. |
| color.border.brand.infomaniak.pressed | #015ca3 | #0c93eb | var(--esds-color-border-brand-infomaniak-pressed) | Infomaniak brand border colors. |
| color.border.brand.mail.default | #ff2461 | #ff97af | var(--esds-color-border-brand-mail-default) | Mail product brand border colors. |
| color.border.brand.mail.hover | #e9004c | #ffc6d3 | var(--esds-color-border-brand-mail-hover) | Mail product brand border colors. |
| color.border.brand.mail.pressed | #d7004b | #ff5d86 | var(--esds-color-border-brand-mail-pressed) | Mail product brand border colors. |
| color.border.brand.kdrive.default | #5c89f7 | #95b5fb | var(--esds-color-border-brand-kdrive-default) | kDrive product brand border colors. |
| color.border.brand.kdrive.hover | #3e66f3 | #c0d1fd | var(--esds-color-border-brand-kdrive-hover) | kDrive product brand border colors. |
| color.border.brand.kdrive.pressed | #2846e8 | #5c89f7 | var(--esds-color-border-brand-kdrive-pressed) | kDrive product brand border colors. |
| color.border.brand.euria.default | #068aff | #48c2ff | var(--esds-color-border-brand-euria-default) | Euria product brand border colors. |
| color.border.brand.euria.hover | #0071ec | #83d8ff | var(--esds-color-border-brand-euria-hover) | Euria product brand border colors. |
| color.border.brand.euria.pressed | #085dc5 | #1ea4ff | var(--esds-color-border-brand-euria-pressed) | Euria product brand border colors. |
| color.border.brand.kchat.default | #2cceff | #75ddff | var(--esds-color-border-brand-kchat-default) | kChat product brand border colors. |
| color.border.brand.kchat.hover | #00b0e6 | #b6ebff | var(--esds-color-border-brand-kchat-hover) | kChat product brand border colors. |
| color.border.brand.kchat.pressed | #009cd4 | #2cceff | var(--esds-color-border-brand-kchat-pressed) | kChat product brand border colors. |
| color.border.brand.security.default | #4d62ea | #a3c4fe | var(--esds-color-border-brand-security-default) | Security product brand border colors. |
| color.border.brand.security.hover | #3546cd | #c6dcff | var(--esds-color-border-brand-security-hover) | Security product brand border colors. |
| color.border.brand.security.pressed | #2d3da6 | #7ea1fb | var(--esds-color-border-brand-security-pressed) | Security product brand border colors. |
| color.border.brand.calendar.default | #0c5961 | #4cc6d4 | var(--esds-color-border-brand-calendar-default) | Calendar product brand border colors. |
| color.border.brand.calendar.hover | #04454b | #6fe5f4 | var(--esds-color-border-brand-calendar-hover) | Calendar product brand border colors. |
| color.border.brand.calendar.pressed | #023137 | #009fad | var(--esds-color-border-brand-calendar-pressed) | Calendar product brand border colors. |
| color.border.brand.contacts.default | #cab1ff | #cab1ff | var(--esds-color-border-brand-contacts-default) | Contacts product brand border colors. |
| color.border.brand.contacts.hover | #b185ff | #e0d4ff | var(--esds-color-border-brand-contacts-hover) | Contacts product brand border colors. |
| color.border.brand.contacts.pressed | #9346ff | #b185ff | var(--esds-color-border-brand-contacts-pressed) | Contacts product brand border colors. |
| color.border.brand.knote.default | #ff882f | #ffb36b | var(--esds-color-border-brand-knote-default) | kNote product brand border colors. |
| color.border.brand.knote.hover | #ff6707 | #ffd3a4 | var(--esds-color-border-brand-knote-hover) | kNote product brand border colors. |
| color.border.brand.knote.pressed | #f94f00 | #ff882f | var(--esds-color-border-brand-knote-pressed) | kNote product brand border colors. |
| color.border.brand.swisstransfer.default | #23a662 | #7bdaa2 | var(--esds-color-border-brand-swisstransfer-default) | SwissTransfer product brand border colors. |
| color.border.brand.swisstransfer.hover | #15864e | #afebc4 | var(--esds-color-border-brand-swisstransfer-hover) | SwissTransfer product brand border colors. |
| color.border.brand.swisstransfer.pressed | #116b40 | #3cb572 | var(--esds-color-border-brand-swisstransfer-pressed) | SwissTransfer product brand border colors. |
| color.border.brand.default | #0c93eb | #0c93eb | var(--esds-color-border-brand-default) | Default brand border color. |
| color.border.brand.hover | #0077cf | #0077cf | var(--esds-color-border-brand-hover) | Hover state of the default brand border. |
| color.border.brand.pressed | #015ca3 | #015ca3 | var(--esds-color-border-brand-pressed) | Pressed state of the default brand border. |
| color.border.dataviz.blue.dim1.default | #0077cf | #36adfa | var(--esds-color-border-dataviz-blue-dim1-default) | Strong blue data-viz border (dim1). |
| color.border.dataviz.blue.dim1.hover | #015ca3 | #7cc8fd | var(--esds-color-border-dataviz-blue-dim1-hover) | Strong blue data-viz border (dim1). |
| color.border.dataviz.blue.dim1.pressed | #064e86 | #0c93eb | var(--esds-color-border-dataviz-blue-dim1-pressed) | Strong blue data-viz border (dim1). |
| color.border.dataviz.blue.dim2.default | #b9e0fe | #015ca3 | var(--esds-color-border-dataviz-blue-dim2-default) | Soft blue data-viz border (dim2). |
| color.border.dataviz.blue.dim2.hover | #7cc8fd | #0077cf | var(--esds-color-border-dataviz-blue-dim2-hover) | Soft blue data-viz border (dim2). |
| color.border.dataviz.blue.dim2.pressed | #36adfa | #0b426f | var(--esds-color-border-dataviz-blue-dim2-pressed) | Soft blue data-viz border (dim2). |
| color.border.dataviz.emerald.dim1.default | #15864e | #3cb572 | var(--esds-color-border-dataviz-emerald-dim1-default) | Strong emerald data-viz border (dim1). |
| color.border.dataviz.emerald.dim1.hover | #116b40 | #7bdaa2 | var(--esds-color-border-dataviz-emerald-dim1-hover) | Strong emerald data-viz border (dim1). |
| color.border.dataviz.emerald.dim1.pressed | #105535 | #23a662 | var(--esds-color-border-dataviz-emerald-dim1-pressed) | Strong emerald data-viz border (dim1). |
| color.border.dataviz.emerald.dim2.default | #afebc4 | #116b40 | var(--esds-color-border-dataviz-emerald-dim2-default) | Soft emerald data-viz border (dim2). |
| color.border.dataviz.emerald.dim2.hover | #7bdaa2 | #15864e | var(--esds-color-border-dataviz-emerald-dim2-hover) | Soft emerald data-viz border (dim2). |
| color.border.dataviz.emerald.dim2.pressed | #3cb572 | #0e462d | var(--esds-color-border-dataviz-emerald-dim2-pressed) | Soft emerald data-viz border (dim2). |
| color.border.dataviz.orange.dim1.default | #dd4f02 | #ffa032 | var(--esds-color-border-dataviz-orange-dim1-default) | Strong orange data-viz border (dim1). |
| color.border.dataviz.orange.dim1.hover | #b73206 | #ffb34a | var(--esds-color-border-dataviz-orange-dim1-hover) | Strong orange data-viz border (dim1). |
| color.border.dataviz.orange.dim1.pressed | #94260c | #f97207 | var(--esds-color-border-dataviz-orange-dim1-pressed) | Strong orange data-viz border (dim1). |
| color.border.dataviz.orange.dim2.default | #ffd188 | #b73206 | var(--esds-color-border-dataviz-orange-dim2-default) | Soft orange data-viz border (dim2). |
| color.border.dataviz.orange.dim2.hover | #ffb34a | #dd4f02 | var(--esds-color-border-dataviz-orange-dim2-hover) | Soft orange data-viz border (dim2). |
| color.border.dataviz.orange.dim2.pressed | #ffa032 | #7a200d | var(--esds-color-border-dataviz-orange-dim2-pressed) | Soft orange data-viz border (dim2). |
| color.border.dataviz.pink.dim1.default | #e9004c | #ff5d86 | var(--esds-color-border-dataviz-pink-dim1-default) | Strong pink data-viz border (dim1). |
| color.border.dataviz.pink.dim1.hover | #d7004b | #ff97af | var(--esds-color-border-dataviz-pink-dim1-hover) | Strong pink data-viz border (dim1). |
| color.border.dataviz.pink.dim1.pressed | #b40045 | #ff2461 | var(--esds-color-border-dataviz-pink-dim1-pressed) | Strong pink data-viz border (dim1). |
| color.border.dataviz.pink.dim2.default | #ffc6d3 | #d7004b | var(--esds-color-border-dataviz-pink-dim2-default) | Soft pink data-viz border (dim2). |
| color.border.dataviz.pink.dim2.hover | #ff97af | #e9004c | var(--esds-color-border-dataviz-pink-dim2-hover) | Soft pink data-viz border (dim2). |
| color.border.dataviz.pink.dim2.pressed | #ff5d86 | #990241 | var(--esds-color-border-dataviz-pink-dim2-pressed) | Soft pink data-viz border (dim2). |
| color.border.dataviz.purple.dim1.default | #4d62ea | #7ea1fb | var(--esds-color-border-dataviz-purple-dim1-default) | Strong purple data-viz border (dim1). |
| color.border.dataviz.purple.dim1.hover | #3546cd | #a3c4fe | var(--esds-color-border-dataviz-purple-dim1-hover) | Strong purple data-viz border (dim1). |
| color.border.dataviz.purple.dim1.pressed | #2d3da6 | #607ff4 | var(--esds-color-border-dataviz-purple-dim1-pressed) | Strong purple data-viz border (dim1). |
| color.border.dataviz.purple.dim2.default | #c6dcff | #3546cd | var(--esds-color-border-dataviz-purple-dim2-default) | Soft purple data-viz border (dim2). |
| color.border.dataviz.purple.dim2.hover | #a3c4fe | #4d62ea | var(--esds-color-border-dataviz-purple-dim2-hover) | Soft purple data-viz border (dim2). |
| color.border.dataviz.purple.dim2.pressed | #7ea1fb | #2c3983 | var(--esds-color-border-dataviz-purple-dim2-pressed) | Soft purple data-viz border (dim2). |
| color.border.dataviz.violet.dim1.default | #8f30f7 | #b185ff | var(--esds-color-border-dataviz-violet-dim1-default) | Strong violet data-viz border (dim1). |
| color.border.dataviz.violet.dim1.hover | #811ee3 | #cab1ff | var(--esds-color-border-dataviz-violet-dim1-hover) | Strong violet data-viz border (dim1). |
| color.border.dataviz.violet.dim1.pressed | #6c18bf | #9346ff | var(--esds-color-border-dataviz-violet-dim1-pressed) | Strong violet data-viz border (dim1). |
| color.border.dataviz.violet.dim2.default | #e0d4ff | #811ee3 | var(--esds-color-border-dataviz-violet-dim2-default) | Soft violet data-viz border (dim2). |
| color.border.dataviz.violet.dim2.hover | #cab1ff | #8f30f7 | var(--esds-color-border-dataviz-violet-dim2-hover) | Soft violet data-viz border (dim2). |
| color.border.dataviz.violet.dim2.pressed | #b185ff | #59169c | var(--esds-color-border-dataviz-violet-dim2-pressed) | Soft violet data-viz border (dim2). |
| color.border.dataviz.yellow.dim1.default | #cc8a02 | #fccf20 | var(--esds-color-border-dataviz-yellow-dim1-default) | Strong yellow data-viz border (dim1). |
| color.border.dataviz.yellow.dim1.hover | #a26206 | #fee046 | var(--esds-color-border-dataviz-yellow-dim1-hover) | Strong yellow data-viz border (dim1). |
| color.border.dataviz.yellow.dim1.pressed | #864d0d | #ecb306 | var(--esds-color-border-dataviz-yellow-dim1-pressed) | Strong yellow data-viz border (dim1). |
| color.border.dataviz.yellow.dim2.default | #fff089 | #a26206 | var(--esds-color-border-dataviz-yellow-dim2-default) | Soft yellow data-viz border (dim2). |
| color.border.dataviz.yellow.dim2.hover | #fee046 | #cc8a02 | var(--esds-color-border-dataviz-yellow-dim2-hover) | Soft yellow data-viz border (dim2). |
| color.border.dataviz.yellow.dim2.pressed | #fccf20 | #723f11 | var(--esds-color-border-dataviz-yellow-dim2-pressed) | Soft yellow data-viz border (dim2). |
| color.border.dataviz.gray.dim1.default | #45556c | #90a1b9 | var(--esds-color-border-dataviz-gray-dim1-default) | Strong gray data-viz border (dim1). |
| color.border.dataviz.gray.dim1.hover | #314158 | #cad5e2 | var(--esds-color-border-dataviz-gray-dim1-hover) | Strong gray data-viz border (dim1). |
| color.border.dataviz.gray.dim1.pressed | #192334 | #62748e | var(--esds-color-border-dataviz-gray-dim1-pressed) | Strong gray data-viz border (dim1). |
| color.border.dataviz.gray.dim2.default | #e2e8f0 | #314158 | var(--esds-color-border-dataviz-gray-dim2-default) | Soft gray data-viz border (dim2). |
| color.border.dataviz.gray.dim2.hover | #cad5e2 | #45556c | var(--esds-color-border-dataviz-gray-dim2-hover) | Soft gray data-viz border (dim2). |
| color.border.dataviz.gray.dim2.pressed | #90a1b9 | #0f172b | var(--esds-color-border-dataviz-gray-dim2-pressed) | Soft gray data-viz border (dim2). |
| color.border.dataviz.dim1.default | #0077cf | #0077cf | var(--esds-color-border-dataviz-dim1-default) | Default dim1 data-viz border. |
| color.border.dataviz.dim1.hover | #015ca3 | #015ca3 | var(--esds-color-border-dataviz-dim1-hover) | Dim1 data-viz border on hover. |
| color.border.dataviz.dim1.pressed | #064e86 | #064e86 | var(--esds-color-border-dataviz-dim1-pressed) | Dim1 data-viz border on press. |
| color.border.dataviz.dim2.default | #b9e0fe | #b9e0fe | var(--esds-color-border-dataviz-dim2-default) | Default dim2 data-viz border. |
| color.border.dataviz.dim2.hover | #7cc8fd | #7cc8fd | var(--esds-color-border-dataviz-dim2-hover) | Dim2 data-viz border on hover. |
| color.border.dataviz.dim2.pressed | #36adfa | #36adfa | var(--esds-color-border-dataviz-dim2-pressed) | Dim2 data-viz border on press. |
| color.border.feedback.error.dim1.default | #f00 | #ff5757 | var(--esds-color-border-feedback-error-dim1-default) | Strong error border (dim1). |
| color.border.feedback.error.dim1.hover | #d70000 | #ff9494 | var(--esds-color-border-feedback-error-dim1-hover) | Strong error border (dim1). |
| color.border.feedback.error.dim1.pressed | #b10303 | #ff2323 | var(--esds-color-border-feedback-error-dim1-pressed) | Strong error border (dim1). |
| color.border.feedback.error.dim2.default | #ffc0c0 | #d70000 | var(--esds-color-border-feedback-error-dim2-default) | Soft error border (dim2). |
| color.border.feedback.error.dim2.hover | #ff9494 | #f00 | var(--esds-color-border-feedback-error-dim2-hover) | Soft error border (dim2). |
| color.border.feedback.error.dim2.pressed | #ff5757 | #920a0a | var(--esds-color-border-feedback-error-dim2-pressed) | Soft error border (dim2). |
| color.border.feedback.success.dim1.default | #12a74a | #41e17c | var(--esds-color-border-feedback-success-dim1-default) | Strong success border (dim1). |
| color.border.feedback.success.dim1.hover | #12833d | #83f2ac | var(--esds-color-border-feedback-success-dim1-hover) | Strong success border (dim1). |
| color.border.feedback.success.dim1.pressed | #146734 | #1ec95e | var(--esds-color-border-feedback-success-dim1-pressed) | Strong success border (dim1). |
| color.border.feedback.success.dim2.default | #b9f9d0 | #12833d | var(--esds-color-border-feedback-success-dim2-default) | Soft success border (dim2). |
| color.border.feedback.success.dim2.hover | #83f2ac | #12a74a | var(--esds-color-border-feedback-success-dim2-hover) | Soft success border (dim2). |
| color.border.feedback.success.dim2.pressed | #41e17c | #12552d | var(--esds-color-border-feedback-success-dim2-pressed) | Soft success border (dim2). |
| color.border.feedback.warning.dim1.default | #dd4f02 | #ffa032 | var(--esds-color-border-feedback-warning-dim1-default) | Strong warning border (dim1). |
| color.border.feedback.warning.dim1.hover | #b73206 | #ffb34a | var(--esds-color-border-feedback-warning-dim1-hover) | Strong warning border (dim1). |
| color.border.feedback.warning.dim1.pressed | #94260c | #f97207 | var(--esds-color-border-feedback-warning-dim1-pressed) | Strong warning border (dim1). |
| color.border.feedback.warning.dim2.default | #ffd188 | #b73206 | var(--esds-color-border-feedback-warning-dim2-default) | Soft warning border (dim2). |
| color.border.feedback.warning.dim2.hover | #ffb34a | #dd4f02 | var(--esds-color-border-feedback-warning-dim2-hover) | Soft warning border (dim2). |
| color.border.feedback.warning.dim2.pressed | #ffa032 | #7a200d | var(--esds-color-border-feedback-warning-dim2-pressed) | Soft warning border (dim2). |
| color.border.dim1.default | #90a1b9 | #62748e | var(--esds-color-border-dim1-default) | Strongest neutral border color with interaction states. |
| color.border.dim1.hover | #62748e | #90a1b9 | var(--esds-color-border-dim1-hover) | Strongest neutral border color with interaction states. |
| color.border.dim1.pressed | #45556c | #45556c | var(--esds-color-border-dim1-pressed) | Strongest neutral border color with interaction states. |
| color.border.dim2.default | #cad5e2 | #45556c | var(--esds-color-border-dim2-default) | Strong neutral border color with interaction states. |
| color.border.dim2.hover | #90a1b9 | #62748e | var(--esds-color-border-dim2-hover) | Strong neutral border color with interaction states. |
| color.border.dim2.pressed | #62748e | #314158 | var(--esds-color-border-dim2-pressed) | Strong neutral border color with interaction states. |
| color.border.dim3.default | #e2e8f0 | #314158 | var(--esds-color-border-dim3-default) | Subtle neutral border color with interaction states. |
| color.border.dim3.hover | #cad5e2 | #45556c | var(--esds-color-border-dim3-hover) | Subtle neutral border color with interaction states. |
| color.border.dim3.pressed | #90a1b9 | #0f172b | var(--esds-color-border-dim3-pressed) | Subtle neutral border color with interaction states. |
| color.border.dim4.default | #f1f5f9 | #192334 | var(--esds-color-border-dim4-default) | Faintest neutral border color with interaction states. |
| color.border.dim4.hover | #e2e8f0 | #314158 | var(--esds-color-border-dim4-hover) | Faintest neutral border color with interaction states. |
| color.border.dim4.pressed | #cad5e2 | #0f172b | var(--esds-color-border-dim4-pressed) | Faintest neutral border color with interaction states. |
| color.shadow.xs | #0000 | #0000 | var(--esds-color-shadow-xs) | Shadow color for the xs elevation. |
| color.shadow.sm | #90a1b90f | #0206180f | var(--esds-color-shadow-sm) | Shadow color for the sm elevation. |
| color.shadow.md | #90a1b914 | #02061814 | var(--esds-color-shadow-md) | Shadow color for the md elevation. |
| color.shadow.lg | #90a1b91a | #0206181a | var(--esds-color-shadow-lg) | Shadow color for the lg elevation. |
| color.shadow.xl | #90a1b91a | #0206181a | var(--esds-color-shadow-xl) | Shadow color for the xl elevation. |
| color.shadow.2xl | #90a1b924 | #02061824 | var(--esds-color-shadow-2xl) | Shadow color for the 2xl elevation. |
| font.size.xs | 12px | 12px | var(--esds-font-size-xs) | Extra-small font size for captions and metadata. |
| font.size.sm | 14px | 14px | var(--esds-font-size-sm) | Small font size for helper text and compact UI. |
| font.size.md | 16px | 16px | var(--esds-font-size-md) | Medium (base) font size for body copy and default text. |
| font.size.lg | 18px | 18px | var(--esds-font-size-lg) | Large font size for emphasized body text. |
| font.size.xl | 20px | 20px | var(--esds-font-size-xl) | Extra-large font size for subtitles and subheadings. |
| font.size.2xl | 24px | 24px | var(--esds-font-size-2xl) | 2x-large font size for section headings. |
| font.size.3xl | 32px | 32px | var(--esds-font-size-3xl) | 3x-large font size for prominent headings. |
| font.size.4xl | 40px | 40px | var(--esds-font-size-4xl) | 4x-large font size for display headings. |
| font.size.5xl | 48px | 48px | var(--esds-font-size-5xl) | 5x-large font size for hero display text. |
| font.family.base | "Suisse Int'l" | "Suisse Int'l" | var(--esds-font-family-base) | Base font family used across the design system. |
| font.line-height.xs | 16px | 16px | var(--esds-font-line-height-xs) | Extra-small line-height for the tightest text. |
| font.line-height.sm | 20px | 20px | var(--esds-font-line-height-sm) | Small line-height for compact text blocks. |
| font.line-height.md | 24px | 24px | var(--esds-font-line-height-md) | Medium line-height for default body text. |
| font.line-height.xl | 28px | 28px | var(--esds-font-line-height-xl) | Large line-height for relaxed headings. |
| font.line-height.2xl | 32px | 32px | var(--esds-font-line-height-2xl) | 2x-large line-height for prominent headings. |
| font.line-height.3xl | 40px | 40px | var(--esds-font-line-height-3xl) | 3x-large line-height for display headings. |
| font.line-height.4xl | 48px | 48px | var(--esds-font-line-height-4xl) | 4x-large line-height for large display text. |
| font.line-height.5xl | 56px | 56px | var(--esds-font-line-height-5xl) | 5x-large line-height for hero display text. |
| font.line-height.lg | 26px | 26px | var(--esds-font-line-height-lg) | Large line-height for the lg font size. |
| font.letter-spacing.md | 0px | 0px | var(--esds-font-letter-spacing-md) | Default letter spacing for body and UI text. |
| font.weight.regular | 400 | 400 | var(--esds-font-weight-regular) | Regular weight for body copy and default text. |
| font.weight.medium | 500 | 500 | var(--esds-font-weight-medium) | Medium weight for emphasized labels and headings. |
| icon.size.xs | 16px | 16px | var(--esds-icon-size-xs) | Extra-small icon size for dense, inline iconography. |
| icon.size.sm | 20px | 20px | var(--esds-icon-size-sm) | Small icon size for compact UI icons. |
| icon.size.md | 24px | 24px | var(--esds-icon-size-md) | Medium (default) icon size for standard UI icons. |
| icon.size.lg | 32px | 32px | var(--esds-icon-size-lg) | Large icon size for emphasized or feature icons. |
| icon.size.xl | 40px | 40px | var(--esds-icon-size-xl) | Extra-large icon size for prominent display icons. |
| opacity.none | 0 | 0 | var(--esds-opacity-none) | Fully transparent; invisible element. |
| opacity.ghost | 0.05 | 0.05 | var(--esds-opacity-ghost) | Near-transparent ghost used for faint hints. |
| opacity.subtle | 0.1 | 0.1 | var(--esds-opacity-subtle) | Subtle opacity for barely-visible overlays. |
| opacity.soft | 0.25 | 0.25 | var(--esds-opacity-soft) | Soft opacity for light overlays and washes. |
| opacity.medium | 0.5 | 0.5 | var(--esds-opacity-medium) | Medium opacity for balanced translucency. |
| opacity.strong | 0.75 | 0.75 | var(--esds-opacity-strong) | Strong opacity for prominent but translucent elements. |
| opacity.heavy | 0.9 | 0.9 | var(--esds-opacity-heavy) | Heavy opacity for near-opaque elements. |
| opacity.full | 1 | 1 | var(--esds-opacity-full) | Fully opaque; no translucency. |
| radius.none | 0px | 0px | var(--esds-radius-none) | No corner radius; sharp corners. |
| radius.xs | 2px | 2px | var(--esds-radius-xs) | Extra-small radius for subtle rounding. |
| radius.sm | 4px | 4px | var(--esds-radius-sm) | Small radius for slightly rounded corners. |
| radius.md | 6px | 6px | var(--esds-radius-md) | Medium radius for default rounded corners. |
| radius.lg | 8px | 8px | var(--esds-radius-lg) | Large radius for comfortably rounded corners. |
| radius.xl | 12px | 12px | var(--esds-radius-xl) | Extra-large radius for prominently rounded corners. |
| radius.2xl | 16px | 16px | var(--esds-radius-2xl) | 2x-large radius for very rounded corners. |
| radius.3xl | 24px | 24px | var(--esds-radius-3xl) | 3x-large radius for heavily rounded corners. |
| radius.4xl | 32px | 32px | var(--esds-radius-4xl) | 4x-large radius for extremely rounded corners. |
| radius.full | 1000px | 1000px | var(--esds-radius-full) | Fully rounded radius for pill and circular shapes. |
| shadow.xs.x | 0px | 0px | var(--esds-shadow-xs-x) | Horizontal offset of the xs shadow. |
| shadow.xs.y | 1px | 1px | var(--esds-shadow-xs-y) | Vertical offset of the xs shadow. |
| shadow.xs.blur | 1px | 1px | var(--esds-shadow-xs-blur) | Blur radius of the xs shadow. |
| shadow.xs.spread | 0px | 0px | var(--esds-shadow-xs-spread) | Spread of the xs shadow. |
| shadow.sm.x | 0px | 0px | var(--esds-shadow-sm-x) | Horizontal offset of the sm shadow. |
| shadow.sm.y | 1px | 1px | var(--esds-shadow-sm-y) | Vertical offset of the sm shadow. |
| shadow.sm.blur | 2px | 2px | var(--esds-shadow-sm-blur) | Blur radius of the sm shadow. |
| shadow.sm.spread | 0px | 0px | var(--esds-shadow-sm-spread) | Spread of the sm shadow. |
| shadow.md.x | 0px | 0px | var(--esds-shadow-md-x) | Horizontal offset of the md shadow. |
| shadow.md.y | 2px | 2px | var(--esds-shadow-md-y) | Vertical offset of the md shadow. |
| shadow.md.blur | 4px | 4px | var(--esds-shadow-md-blur) | Blur radius of the md shadow. |
| shadow.md.spread | -1px | -1px | var(--esds-shadow-md-spread) | Spread of the md shadow. |
| shadow.lg.x | 0px | 0px | var(--esds-shadow-lg-x) | Horizontal offset of the lg shadow. |
| shadow.lg.y | 4px | 4px | var(--esds-shadow-lg-y) | Vertical offset of the lg shadow. |
| shadow.lg.blur | 6px | 6px | var(--esds-shadow-lg-blur) | Blur radius of the lg shadow. |
| shadow.lg.spread | -3px | -3px | var(--esds-shadow-lg-spread) | Spread of the lg shadow. |
| shadow.xl.x | 0px | 0px | var(--esds-shadow-xl-x) | Horizontal offset of the xl shadow. |
| shadow.xl.y | 10px | 10px | var(--esds-shadow-xl-y) | Vertical offset of the xl shadow. |
| shadow.xl.blur | 10px | 10px | var(--esds-shadow-xl-blur) | Blur radius of the xl shadow. |
| shadow.xl.spread | -6px | -6px | var(--esds-shadow-xl-spread) | Spread of the xl shadow. |
| shadow.2xl.x | 0px | 0px | var(--esds-shadow-2xl-x) | Horizontal offset of the 2xl shadow. |
| shadow.2xl.y | 25px | 25px | var(--esds-shadow-2xl-y) | Vertical offset of the 2xl shadow. |
| shadow.2xl.blur | 50px | 50px | var(--esds-shadow-2xl-blur) | Blur radius of the 2xl shadow. |
| shadow.2xl.spread | -12px | -12px | var(--esds-shadow-2xl-spread) | Spread of the 2xl shadow. |
| spacing.none | 0px | 0px | var(--esds-spacing-none) | No spacing; zero gap. |
| spacing.2xs | 2px | 2px | var(--esds-spacing-2xs) | 2x-small spacing for tight, dense layouts. |
| spacing.xs | 4px | 4px | var(--esds-spacing-xs) | Extra-small spacing for compact groupings. |
| spacing.sm | 6px | 6px | var(--esds-spacing-sm) | Small spacing for closely related elements. |
| spacing.md | 8px | 8px | var(--esds-spacing-md) | Medium spacing for default gaps between elements. |
| spacing.lg | 12px | 12px | var(--esds-spacing-lg) | Large spacing for relaxed groupings. |
| spacing.xl | 16px | 16px | var(--esds-spacing-xl) | Extra-large spacing for distinct sections. |
| spacing.2xl | 20px | 20px | var(--esds-spacing-2xl) | 2x-large spacing for separated sections. |
| spacing.3xl | 24px | 24px | var(--esds-spacing-3xl) | 3x-large spacing for clearly separated blocks. |
| spacing.4xl | 32px | 32px | var(--esds-spacing-4xl) | 4x-large spacing for major layout separation. |
| spacing.5xl | 40px | 40px | var(--esds-spacing-5xl) | 5x-large spacing for large layout gaps. |
| spacing.6xl | 48px | 48px | var(--esds-spacing-6xl) | 6x-large spacing for very large layout gaps. |
| spacing.7xl | 64px | 64px | var(--esds-spacing-7xl) | 7x-large spacing for major page-level separation. |
| spacing.8xl | 100px | 100px | var(--esds-spacing-8xl) | 8x-large spacing for the largest layout gaps. |
| text.xs.size | 12px | 12px | var(--esds-text-xs-size) | Font size for extra-small text. |
| text.xs.line-height | 16px | 16px | var(--esds-text-xs-line-height) | Line-height for extra-small text. |
| text.xs.letter-spacing | 0px | 0px | var(--esds-text-xs-letter-spacing) | Letter spacing for extra-small text. |
| text.sm.size | 14px | 14px | var(--esds-text-sm-size) | Font size for small text. |
| text.sm.line-height | 20px | 20px | var(--esds-text-sm-line-height) | Line-height for small text. |
| text.sm.letter-spacing | 0px | 0px | var(--esds-text-sm-letter-spacing) | Letter spacing for small text. |
| text.md.size | 16px | 16px | var(--esds-text-md-size) | Font size for medium text. |
| text.md.line-height | 24px | 24px | var(--esds-text-md-line-height) | Line-height for medium text. |
| text.md.letter-spacing | 0px | 0px | var(--esds-text-md-letter-spacing) | Letter spacing for medium text. |
| text.lg.size | 18px | 18px | var(--esds-text-lg-size) | Font size for large text. |
| text.lg.line-height | 26px | 26px | var(--esds-text-lg-line-height) | Line-height for large text. |
| text.lg.letter-spacing | 0px | 0px | var(--esds-text-lg-letter-spacing) | Letter spacing for large text. |
| text.xl.size | 20px | 20px | var(--esds-text-xl-size) | Font size for extra-large text. |
| text.xl.line-height | 28px | 28px | var(--esds-text-xl-line-height) | Line-height for extra-large text. |
| text.xl.letter-spacing | 0px | 0px | var(--esds-text-xl-letter-spacing) | Letter spacing for extra-large text. |
| text.2xl.size | 24px | 24px | var(--esds-text-2xl-size) | Font size for 2x-large text. |
| text.2xl.line-height | 32px | 32px | var(--esds-text-2xl-line-height) | Line-height for 2x-large text. |
| text.2xl.letter-spacing | 0px | 0px | var(--esds-text-2xl-letter-spacing) | Letter spacing for 2x-large text. |
| text.3xl.size | 32px | 32px | var(--esds-text-3xl-size) | Font size for 3x-large text. |
| text.3xl.line-height | 40px | 40px | var(--esds-text-3xl-line-height) | Line-height for 3x-large text. |
| text.3xl.letter-spacing | 0px | 0px | var(--esds-text-3xl-letter-spacing) | Letter spacing for 3x-large text. |
| text.4xl.size | 40px | 40px | var(--esds-text-4xl-size) | Font size for 4x-large text. |
| text.4xl.line-height | 48px | 48px | var(--esds-text-4xl-line-height) | Line-height for 4x-large text. |
| text.4xl.letter-spacing | 0px | 0px | var(--esds-text-4xl-letter-spacing) | Letter spacing for 4x-large text. |
| text.5xl.size | 48px | 48px | var(--esds-text-5xl-size) | Font size for 5x-large text. |
| text.5xl.line-height | 56px | 56px | var(--esds-text-5xl-line-height) | Line-height for 5x-large text. |
| text.5xl.letter-spacing | 0px | 0px | var(--esds-text-5xl-letter-spacing) | Letter spacing for 5x-large text. |

## 3. Component Tokens

| Token Name | Light Value | Dark Value | CSS Variable | Description |
|---|---|---|---|---|
| text-link.color.default | #0077cf | #0077cf | var(--esds-text-link-color-default) | Default text link color. |
| text-link.color.hover | #015ca3 | #015ca3 | var(--esds-text-link-color-hover) | Text link color on hover. |
| text-link.color.pressed | #064e86 | #064e86 | var(--esds-text-link-color-pressed) | Text link color on press. |
| text-link.color.visited.default | #8f30f7 | #cab1ff | var(--esds-text-link-color-visited-default) | Default visited text link color. |
| text-link.color.visited.hover | #811ee3 | #e0d4ff | var(--esds-text-link-color-visited-hover) | Visited text link color on hover. |
| text-link.color.visited.pressed | #6c18bf | #b185ff | var(--esds-text-link-color-visited-pressed) | Visited text link color on press. |
| typography.display.md.base | 400 48px/56px Suisse Int'l | 400 48px/56px Suisse Int'l | var(--esds-typography-display-md-base) | Medium display style, the largest typography preset. |
| typography.display.md.emphasized | 500 48px/56px Suisse Int'l | 500 48px/56px Suisse Int'l | var(--esds-typography-display-md-emphasized) | Medium display style, the largest typography preset. |
| typography.heading.lg.base | 400 40px/48px Suisse Int'l | 400 40px/48px Suisse Int'l | var(--esds-typography-heading-lg-base) | Large heading style for primary page titles. |
| typography.heading.lg.emphasized | 500 40px/48px Suisse Int'l | 500 40px/48px Suisse Int'l | var(--esds-typography-heading-lg-emphasized) | Large heading style for primary page titles. |
| typography.heading.md.base | 400 32px/40px Suisse Int'l | 400 32px/40px Suisse Int'l | var(--esds-typography-heading-md-base) | Medium heading style for section titles. |
| typography.heading.md.emphasized | 500 32px/40px Suisse Int'l | 500 32px/40px Suisse Int'l | var(--esds-typography-heading-md-emphasized) | Medium heading style for section titles. |
| typography.heading.sm.base | 400 24px/32px Suisse Int'l | 400 24px/32px Suisse Int'l | var(--esds-typography-heading-sm-base) | Small heading style for subsection titles. |
| typography.heading.sm.emphasized | 500 24px/32px Suisse Int'l | 500 24px/32px Suisse Int'l | var(--esds-typography-heading-sm-emphasized) | Small heading style for subsection titles. |
| typography.title.md.base | 400 20px/28px Suisse Int'l | 400 20px/28px Suisse Int'l | var(--esds-typography-title-md-base) | Medium title style for component titles. |
| typography.title.md.emphasized | 500 20px/28px Suisse Int'l | 500 20px/28px Suisse Int'l | var(--esds-typography-title-md-emphasized) | Medium title style for component titles. |
| typography.body.lg.base | 400 18px/26px Suisse Int'l | 400 18px/26px Suisse Int'l | var(--esds-typography-body-lg-base) | Large body style for emphasized paragraph text. |
| typography.body.lg.emphasized | 500 18px/26px Suisse Int'l | 500 18px/26px Suisse Int'l | var(--esds-typography-body-lg-emphasized) | Large body style for emphasized paragraph text. |
| typography.body.md.base | 400 16px/24px Suisse Int'l | 400 16px/24px Suisse Int'l | var(--esds-typography-body-md-base) | Medium (default) body style for standard paragraph text. |
| typography.body.md.emphasized | 500 16px/24px Suisse Int'l | 500 16px/24px Suisse Int'l | var(--esds-typography-body-md-emphasized) | Medium (default) body style for standard paragraph text. |
| typography.body.sm.base | 400 14px/20px Suisse Int'l | 400 14px/20px Suisse Int'l | var(--esds-typography-body-sm-base) | Small body style for compact paragraph text. |
| typography.body.sm.emphasized | 500 14px/20px Suisse Int'l | 500 14px/20px Suisse Int'l | var(--esds-typography-body-sm-emphasized) | Small body style for compact paragraph text. |
| typography.caption.md.base | 400 12px/16px Suisse Int'l | 400 12px/16px Suisse Int'l | var(--esds-typography-caption-md-base) | Medium caption style for small metadata and labels. |
| typography.caption.md.emphasized | 500 12px/16px Suisse Int'l | 500 12px/16px Suisse Int'l | var(--esds-typography-caption-md-emphasized) | Medium caption style for small metadata and labels. |

## 4. AI Implementation Directives

- **Always use CSS variables** in implementation. Never hard-code hex or dimension values.
- **Prefer Tier 2 (Semantic) tokens** for all component styling. Only use Tier 3 (Component) tokens when they explicitly exist for the element you are building.
- **Never reference Tier 1 (Primitive) tokens directly** in component code; they exist only for alias resolution and designer reference.
- **Theme awareness**: The design system supports `light` and `dark` modes. Use the `data-esds-theme` attribute or corresponding modifier CSS file to apply themes.
- **Portable product tokens**: When building components for a specific product (calendar, mail, swisstransfer, etc.), always use the token names exactly as shown in this file (e.g., `color.background.brand.default` with `var(--esds-color-background-brand-default)`). The build system automatically resolves these to the correct product-specific colors. **Never** use product-specific primitive names such as `color.background.brand.calendar.default` directly in component code. **Never** create separate component variants or branches per product when the same semantic token exists. All products share the same token API — only the resolved values differ.