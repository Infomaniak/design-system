---
typography:
  xs:
    base:
      fontFamily: "Suisse Int'l"
      fontSize: "0.75rem"
      fontWeight: "400"
      lineHeight: "16px"
      letterSpacing: "0px"
    emphasized:
      fontFamily: "Suisse Int'l"
      fontSize: "0.75rem"
      fontWeight: "500"
      lineHeight: "16px"
      letterSpacing: "0px"
  sm:
    base:
      fontFamily: "Suisse Int'l"
      fontSize: "0.875rem"
      fontWeight: "400"
      lineHeight: "20px"
      letterSpacing: "0px"
    emphasized:
      fontFamily: "Suisse Int'l"
      fontSize: "0.875rem"
      fontWeight: "500"
      lineHeight: "20px"
      letterSpacing: "0px"
  md:
    base:
      fontFamily: "Suisse Int'l"
      fontSize: "1rem"
      fontWeight: "400"
      lineHeight: "24px"
      letterSpacing: "0px"
    emphasized:
      fontFamily: "Suisse Int'l"
      fontSize: "1rem"
      fontWeight: "500"
      lineHeight: "24px"
      letterSpacing: "0px"
  lg:
    base:
      fontFamily: "Suisse Int'l"
      fontSize: "1.125rem"
      fontWeight: "400"
      lineHeight: "26px"
      letterSpacing: "0px"
    emphasized:
      fontFamily: "Suisse Int'l"
      fontSize: "1.125rem"
      fontWeight: "500"
      lineHeight: "26px"
      letterSpacing: "0px"
  xl:
    base:
      fontFamily: "Suisse Int'l"
      fontSize: "1.25rem"
      fontWeight: "400"
      lineHeight: "28px"
      letterSpacing: "0px"
    emphasized:
      fontFamily: "Suisse Int'l"
      fontSize: "1.25rem"
      fontWeight: "500"
      lineHeight: "28px"
      letterSpacing: "0px"
  2xl:
    base:
      fontFamily: "Suisse Int'l"
      fontSize: "1.5rem"
      fontWeight: "400"
      lineHeight: "32px"
      letterSpacing: "0px"
    emphasized:
      fontFamily: "Suisse Int'l"
      fontSize: "1.5rem"
      fontWeight: "500"
      lineHeight: "32px"
      letterSpacing: "0px"
  3xl:
    base:
      fontFamily: "Suisse Int'l"
      fontSize: "2rem"
      fontWeight: "400"
      lineHeight: "40px"
      letterSpacing: "0px"
    emphasized:
      fontFamily: "Suisse Int'l"
      fontSize: "2rem"
      fontWeight: "500"
      lineHeight: "40px"
      letterSpacing: "0px"
  4xl:
    base:
      fontFamily: "Suisse Int'l"
      fontSize: "2.5rem"
      fontWeight: "400"
      lineHeight: "48px"
      letterSpacing: "0px"
    emphasized:
      fontFamily: "Suisse Int'l"
      fontSize: "2.5rem"
      fontWeight: "500"
      lineHeight: "48px"
      letterSpacing: "0px"
  5xl:
    base:
      fontFamily: "Suisse Int'l"
      fontSize: "3rem"
      fontWeight: "400"
      lineHeight: "56px"
      letterSpacing: "0px"
    emphasized:
      fontFamily: "Suisse Int'l"
      fontSize: "3rem"
      fontWeight: "500"
      lineHeight: "56px"
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
| blur.2xl | 40px | 40px | var(--esds-blur-2xl) | 2x-large blur for heavy depth effects. |
| blur.3xl | 64px | 64px | var(--esds-blur-3xl) | 3x-large blur for maximum blur effects. |
| border.none.width | 0px | 0px | var(--esds-border-none-width) | No border width. |
| border.xs.width | 1px | 1px | var(--esds-border-xs-width) | Extra-small border width for fine hairline borders. |
| border.sm.width | 2px | 2px | var(--esds-border-sm-width) | Small border width for subtle outlines. |
| border.md.width | 3px | 3px | var(--esds-border-md-width) | Medium border width for default element outlines. |
| border.lg.width | 4px | 4px | var(--esds-border-lg-width) | Large border width for emphasized outlines. |
| color.background.elevation.sunken | #f1f5f9 | #020618 | var(--esds-color-background-elevation-sunken) | Background for sunken, recessed surfaces below the base level. |
| color.background.elevation.surface | #fff | #192334 | var(--esds-color-background-elevation-surface) | Background for the default surface level, the base UI layer. |
| color.background.elevation.raised | #fff | #192334 | var(--esds-color-background-elevation-raised) | Background for raised, elevated surfaces such as cards. |
| color.background.elevation.overlay | #f1f5f9 | #192334 | var(--esds-color-background-elevation-overlay) | Background for overlay and modal surfaces above the base UI. |
| color.background.brand | #0077cf | #0077cf | var(--esds-color-background-brand) | Default brand background (Infomaniak). |
| color.background.brand.infomaniak | #0077cf | #36adfa | var(--esds-color-background-brand-infomaniak) | Infomaniak brand background colors. |
| color.background.brand.mail | #e9004c | #ff97af | var(--esds-color-background-brand-mail) | Mail product brand background colors. |
| color.background.brand.kdrive | #3e66f3 | #95b5fb | var(--esds-color-background-brand-kdrive) | kDrive product brand background colors. |
| color.background.brand.euria | #0071ec | #48c2ff | var(--esds-color-background-brand-euria) | Euria product brand background colors. |
| color.background.brand.kchat | #009cd4 | #75ddff | var(--esds-color-background-brand-kchat) | kChat product brand background colors. |
| color.background.brand.security | #4d62ea | #a3c4fe | var(--esds-color-background-brand-security) | Security product brand background colors. |
| color.background.brand.calendar | #0a848f | #4cc6d4 | var(--esds-color-background-brand-calendar) | Calendar product brand background colors. |
| color.background.brand.contacts | #9346ff | #cab1ff | var(--esds-color-background-brand-contacts) | Contacts product brand background colors. |
| color.background.brand.knote | #f94f00 | #ffb36b | var(--esds-color-background-brand-knote) | kNote product brand background colors. |
| color.background.brand.swisstransfer | #15864e | #7bdaa2 | var(--esds-color-background-brand-swisstransfer) | SwissTransfer product brand background colors. |
| color.background.feedback.success.dim1 | #1ec95e | #41e17c | var(--esds-color-background-feedback-success-dim1) | Strong success background (dim1). |
| color.background.feedback.success.dim2 | #b9f9d0 | #12552d | var(--esds-color-background-feedback-success-dim2) | Soft success background (dim2). |
| color.background.feedback.warning.dim1 | #ffa032 | #ffb34a | var(--esds-color-background-feedback-warning-dim1) | Strong warning background (dim1). |
| color.background.feedback.warning.dim2 | #ffd188 | #7a200d | var(--esds-color-background-feedback-warning-dim2) | Soft warning background (dim2). |
| color.background.feedback.error.dim1 | #ff5757 | #ff9494 | var(--esds-color-background-feedback-error-dim1) | Strong error background (dim1). |
| color.background.feedback.error.dim2 | #ffc0c0 | #920a0a | var(--esds-color-background-feedback-error-dim2) | Soft error background (dim2). |
| color.background.disabled | #e2e8f0 | #192334 | var(--esds-color-background-disabled) | Background for disabled, non-interactive elements. |
| color.background.dataviz.orange.dim1 | #dd4f02 | #ffa032 | var(--esds-color-background-dataviz-orange-dim1) | Strong orange data-viz background (dim1). |
| color.background.dataviz.orange.dim2 | #ffd188 | #94260c | var(--esds-color-background-dataviz-orange-dim2) | Soft orange data-viz background (dim2). |
| color.background.dataviz.emerald.dim1 | #15864e | #3cb572 | var(--esds-color-background-dataviz-emerald-dim1) | Strong emerald data-viz background (dim1). |
| color.background.dataviz.emerald.dim2 | #afebc4 | #105535 | var(--esds-color-background-dataviz-emerald-dim2) | Soft emerald data-viz background (dim2). |
| color.background.dataviz.blue.dim1 | #0077cf | #36adfa | var(--esds-color-background-dataviz-blue-dim1) | Strong blue data-viz background (dim1). |
| color.background.dataviz.blue.dim2 | #b9e0fe | #064e86 | var(--esds-color-background-dataviz-blue-dim2) | Soft blue data-viz background (dim2). |
| color.background.dataviz.violet.dim1 | #8f30f7 | #b185ff | var(--esds-color-background-dataviz-violet-dim1) | Strong violet data-viz background (dim1). |
| color.background.dataviz.violet.dim2 | #e0d4ff | #6c18bf | var(--esds-color-background-dataviz-violet-dim2) | Soft violet data-viz background (dim2). |
| color.background.dataviz.purple.dim1 | #4d62ea | #7ea1fb | var(--esds-color-background-dataviz-purple-dim1) | Strong purple data-viz background (dim1). |
| color.background.dataviz.purple.dim2 | #c6dcff | #2d3da6 | var(--esds-color-background-dataviz-purple-dim2) | Soft purple data-viz background (dim2). |
| color.background.dataviz.pink.dim1 | #e9004c | #ff5d86 | var(--esds-color-background-dataviz-pink-dim1) | Strong pink data-viz background (dim1). |
| color.background.dataviz.pink.dim2 | #ffc6d3 | #b40045 | var(--esds-color-background-dataviz-pink-dim2) | Soft pink data-viz background (dim2). |
| color.background.dataviz.yellow.dim1 | #ecb306 | #fccf20 | var(--esds-color-background-dataviz-yellow-dim1) | Strong yellow data-viz background (dim1). |
| color.background.dataviz.yellow.dim2 | #fff089 | #864d0d | var(--esds-color-background-dataviz-yellow-dim2) | Soft yellow data-viz background (dim2). |
| color.background.dataviz.gray.dim1 | #62748e | #90a1b9 | var(--esds-color-background-dataviz-gray-dim1) | Strong gray data-viz background (dim1). |
| color.background.dataviz.gray.dim2 | #e2e8f0 | #192334 | var(--esds-color-background-dataviz-gray-dim2) | Soft gray data-viz background (dim2). |
| color.background.dataviz.dim1 | #0077cf | #0077cf | var(--esds-color-background-dataviz-dim1) | Default dim1 data-viz background. |
| color.background.dataviz.dim2 | #b9e0fe | #b9e0fe | var(--esds-color-background-dataviz-dim2) | Default dim2 data-viz background. |
| color.content.on.disabled | #90a1b9 | #62748e | var(--esds-color-content-on-disabled) | Content color for disabled states on backgrounds. |
| color.content.on.brand | #fff | #fff | var(--esds-color-content-on-brand) | Default foreground on brand backgrounds. |
| color.content.on.brand.infomaniak | #fff | #072a4a | var(--esds-color-content-on-brand-infomaniak) | Foreground on Infomaniak brand backgrounds. |
| color.content.on.brand.calendar | #fff | #001f23 | var(--esds-color-content-on-brand-calendar) | Foreground on Calendar brand backgrounds. |
| color.content.on.brand.contacts | #fff | #370b6a | var(--esds-color-content-on-brand-contacts) | Foreground on Contacts brand backgrounds. |
| color.content.on.brand.euria | #fff | #0e315d | var(--esds-color-content-on-brand-euria) | Foreground on Euria brand backgrounds. |
| color.content.on.brand.kchat | #fff | #04354d | var(--esds-color-content-on-brand-kchat) | Foreground on kChat brand backgrounds. |
| color.content.on.brand.kdrive | #fff | #181c53 | var(--esds-color-content-on-brand-kdrive) | Foreground on kDrive brand backgrounds. |
| color.content.on.brand.knote | #fff | #471003 | var(--esds-color-content-on-brand-knote) | Foreground on kNote brand backgrounds. |
| color.content.on.brand.mail | #fff | #570022 | var(--esds-color-content-on-brand-mail) | Foreground on Mail brand backgrounds. |
| color.content.on.brand.security | #fff | #1a204c | var(--esds-color-content-on-brand-security) | Foreground on Security brand backgrounds. |
| color.content.on.brand.swisstransfer | #fff | #072719 | var(--esds-color-content-on-brand-swisstransfer) | Foreground on SwissTransfer brand backgrounds. |
| color.content.on.dataviz.blue.dim1 | #0b426f | #e0effe | var(--esds-color-content-on-dataviz-blue-dim1) | Foreground on strong blue data-viz backgrounds (dim1). |
| color.content.on.dataviz.blue.dim2 | #f0f8ff | #072a4a | var(--esds-color-content-on-dataviz-blue-dim2) | Foreground on soft blue data-viz backgrounds (dim2). |
| color.content.on.dataviz.emerald.dim1 | #0e462d | #d6f5df | var(--esds-color-content-on-dataviz-emerald-dim1) | Foreground on strong emerald data-viz backgrounds (dim1). |
| color.content.on.dataviz.emerald.dim2 | #eefbf2 | #072719 | var(--esds-color-content-on-dataviz-emerald-dim2) | Foreground on soft emerald data-viz backgrounds (dim2). |
| color.content.on.dataviz.orange.dim1 | #7a200d | #ffe9c6 | var(--esds-color-content-on-dataviz-orange-dim1) | Foreground on strong orange data-viz backgrounds (dim1). |
| color.content.on.dataviz.orange.dim2 | #ffe9c6 | #460d02 | var(--esds-color-content-on-dataviz-orange-dim2) | Foreground on soft orange data-viz backgrounds (dim2). |
| color.content.on.dataviz.pink.dim1 | #990241 | #ffe0e6 | var(--esds-color-content-on-dataviz-pink-dim1) | Foreground on strong pink data-viz backgrounds (dim1). |
| color.content.on.dataviz.pink.dim2 | #ffeff2 | #570022 | var(--esds-color-content-on-dataviz-pink-dim2) | Foreground on soft pink data-viz backgrounds (dim2). |
| color.content.on.dataviz.purple.dim1 | #2c3983 | #dfecff | var(--esds-color-content-on-dataviz-purple-dim1) | Foreground on strong purple data-viz backgrounds (dim1). |
| color.content.on.dataviz.purple.dim2 | #eef5ff | #1a204c | var(--esds-color-content-on-dataviz-purple-dim2) | Foreground on soft purple data-viz backgrounds (dim2). |
| color.content.on.dataviz.violet.dim1 | #59169c | #efe8ff | var(--esds-color-content-on-dataviz-violet-dim1) | Foreground on strong violet data-viz backgrounds (dim1). |
| color.content.on.dataviz.violet.dim2 | #f6f2ff | #370b6a | var(--esds-color-content-on-dataviz-violet-dim2) | Foreground on soft violet data-viz backgrounds (dim2). |
| color.content.on.dataviz.yellow.dim1 | #723f11 | #fef9c3 | var(--esds-color-content-on-dataviz-yellow-dim1) | Foreground on strong yellow data-viz backgrounds (dim1). |
| color.content.on.dataviz.yellow.dim2 | #fefce8 | #422006 | var(--esds-color-content-on-dataviz-yellow-dim2) | Foreground on soft yellow data-viz backgrounds (dim2). |
| color.content.on.dataviz.gray.dim1 | #0f172b | #f1f5f9 | var(--esds-color-content-on-dataviz-gray-dim1) | Foreground on strong gray data-viz backgrounds (dim1). |
| color.content.on.dataviz.gray.dim2 | #f8fafc | #020618 | var(--esds-color-content-on-dataviz-gray-dim2) | Foreground on soft gray data-viz backgrounds (dim2). |
| color.content.on.dataviz.dim1 | #0b426f | #0b426f | var(--esds-color-content-on-dataviz-dim1) | Default foreground on data-viz dim1 backgrounds. |
| color.content.on.dataviz.dim2 | #f0f8ff | #f0f8ff | var(--esds-color-content-on-dataviz-dim2) | Default foreground on data-viz dim2 backgrounds. |
| color.content.on.feedback.success | #042f16 | #f0fdf4 | var(--esds-color-content-on-feedback-success) | Foreground on strong success backgrounds (dim1). |
| color.content.on.feedback.warning | #7a200d | #fff7eb | var(--esds-color-content-on-feedback-warning) | Foreground on strong warning backgrounds (dim1). |
| color.content.on.feedback.error | #920a0a | #fdd | var(--esds-color-content-on-feedback-error) | Foreground on strong error backgrounds (dim1). |
| color.content.brand | #0077cf | #0077cf | var(--esds-color-content-brand) | Default brand foreground color. |
| color.content.brand.infomaniak | #0077cf | #36adfa | var(--esds-color-content-brand-infomaniak) | Infomaniak brand foreground colors. |
| color.content.brand.mail | #d7004b | #ff5d86 | var(--esds-color-content-brand-mail) | Mail product brand foreground colors. |
| color.content.brand.kdrive | #3e66f3 | #95b5fb | var(--esds-color-content-brand-kdrive) | kDrive product brand foreground colors. |
| color.content.brand.euria | #068aff | #48c2ff | var(--esds-color-content-brand-euria) | Euria product brand foreground colors. |
| color.content.brand.kchat | #009cd4 | #2cceff | var(--esds-color-content-brand-kchat) | kChat product brand foreground colors. |
| color.content.brand.security | #4d62ea | #7ea1fb | var(--esds-color-content-brand-security) | Security product brand foreground colors. |
| color.content.brand.calendar | #0c5961 | #009fad | var(--esds-color-content-brand-calendar) | Calendar product brand foreground colors. |
| color.content.brand.contacts | #9346ff | #cab1ff | var(--esds-color-content-brand-contacts) | Contacts product brand foreground colors. |
| color.content.brand.knote | #f94f00 | #ff882f | var(--esds-color-content-brand-knote) | kNote product brand foreground colors. |
| color.content.brand.swisstransfer | #15864e | #3cb572 | var(--esds-color-content-brand-swisstransfer) | SwissTransfer product brand foreground colors. |
| color.content.primary | #192334 | #f1f5f9 | var(--esds-color-content-primary) | Primary content color for main text and headings. |
| color.content.secondary | #314158 | #e2e8f0 | var(--esds-color-content-secondary) | Secondary content color for supporting text. |
| color.content.tertiary | #45556c | #cad5e2 | var(--esds-color-content-tertiary) | Tertiary content color for subtle, low-emphasis text. |
| color.content.disabled | #90a1b9 | #62748e | var(--esds-color-content-disabled) | Content color for disabled text and icons. |
| color.content.inverse | #f1f5f9 | #192334 | var(--esds-color-content-inverse) | Inverse content color for use on dark backgrounds. |
| color.content.feedback.error | #d70000 | #ff9494 | var(--esds-color-content-feedback-error) | Error foreground color with interaction states. |
| color.content.feedback.success | #12833d | #83f2ac | var(--esds-color-content-feedback-success) | Success foreground color with interaction states. |
| color.content.feedback.warning | #b73206 | #ffb34a | var(--esds-color-content-feedback-warning) | Warning foreground color with interaction states. |
| color.content.visited | #8f30f7 | #cab1ff | var(--esds-color-content-visited) | Visited-link content colors with interaction states. |
| color.content.muted | #62748e | #90a1b9 | var(--esds-color-content-muted) | Muted content color for de-emphasized, secondary text. |
| color.border.brand | #0077cf | #0077cf | var(--esds-color-border-brand) | Default brand border color. |
| color.border.brand.infomaniak | #0077cf | #36adfa | var(--esds-color-border-brand-infomaniak) | Infomaniak brand border colors. |
| color.border.brand.mail | #e9004c | #ff97af | var(--esds-color-border-brand-mail) | Mail product brand border colors. |
| color.border.brand.kdrive | #3e66f3 | #95b5fb | var(--esds-color-border-brand-kdrive) | kDrive product brand border colors. |
| color.border.brand.euria | #0071ec | #48c2ff | var(--esds-color-border-brand-euria) | Euria product brand border colors. |
| color.border.brand.kchat | #009cd4 | #75ddff | var(--esds-color-border-brand-kchat) | kChat product brand border colors. |
| color.border.brand.security | #4d62ea | #a3c4fe | var(--esds-color-border-brand-security) | Security product brand border colors. |
| color.border.brand.calendar | #0a848f | #4cc6d4 | var(--esds-color-border-brand-calendar) | Calendar product brand border colors. |
| color.border.brand.contacts | #9346ff | #cab1ff | var(--esds-color-border-brand-contacts) | Contacts product brand border colors. |
| color.border.brand.knote | #f94f00 | #ffb36b | var(--esds-color-border-brand-knote) | kNote product brand border colors. |
| color.border.brand.swisstransfer | #15864e | #7bdaa2 | var(--esds-color-border-brand-swisstransfer) | SwissTransfer product brand border colors. |
| color.border.dataviz.blue.dim1 | #0077cf | #36adfa | var(--esds-color-border-dataviz-blue-dim1) | Strong blue data-viz border (dim1). |
| color.border.dataviz.blue.dim2 | #b9e0fe | #015ca3 | var(--esds-color-border-dataviz-blue-dim2) | Soft blue data-viz border (dim2). |
| color.border.dataviz.emerald.dim1 | #15864e | #3cb572 | var(--esds-color-border-dataviz-emerald-dim1) | Strong emerald data-viz border (dim1). |
| color.border.dataviz.emerald.dim2 | #afebc4 | #116b40 | var(--esds-color-border-dataviz-emerald-dim2) | Soft emerald data-viz border (dim2). |
| color.border.dataviz.orange.dim1 | #dd4f02 | #ffa032 | var(--esds-color-border-dataviz-orange-dim1) | Strong orange data-viz border (dim1). |
| color.border.dataviz.orange.dim2 | #ffd188 | #b73206 | var(--esds-color-border-dataviz-orange-dim2) | Soft orange data-viz border (dim2). |
| color.border.dataviz.pink.dim1 | #e9004c | #ff5d86 | var(--esds-color-border-dataviz-pink-dim1) | Strong pink data-viz border (dim1). |
| color.border.dataviz.pink.dim2 | #ffc6d3 | #d7004b | var(--esds-color-border-dataviz-pink-dim2) | Soft pink data-viz border (dim2). |
| color.border.dataviz.purple.dim1 | #4d62ea | #7ea1fb | var(--esds-color-border-dataviz-purple-dim1) | Strong purple data-viz border (dim1). |
| color.border.dataviz.purple.dim2 | #c6dcff | #3546cd | var(--esds-color-border-dataviz-purple-dim2) | Soft purple data-viz border (dim2). |
| color.border.dataviz.violet.dim1 | #8f30f7 | #b185ff | var(--esds-color-border-dataviz-violet-dim1) | Strong violet data-viz border (dim1). |
| color.border.dataviz.violet.dim2 | #e0d4ff | #811ee3 | var(--esds-color-border-dataviz-violet-dim2) | Soft violet data-viz border (dim2). |
| color.border.dataviz.yellow.dim1 | #cc8a02 | #fccf20 | var(--esds-color-border-dataviz-yellow-dim1) | Strong yellow data-viz border (dim1). |
| color.border.dataviz.yellow.dim2 | #fff089 | #a26206 | var(--esds-color-border-dataviz-yellow-dim2) | Soft yellow data-viz border (dim2). |
| color.border.dataviz.gray.dim1 | #45556c | #90a1b9 | var(--esds-color-border-dataviz-gray-dim1) | Strong gray data-viz border (dim1). |
| color.border.dataviz.gray.dim2 | #e2e8f0 | #314158 | var(--esds-color-border-dataviz-gray-dim2) | Soft gray data-viz border (dim2). |
| color.border.dataviz.dim1 | #0077cf | #0077cf | var(--esds-color-border-dataviz-dim1) | Default dim1 data-viz border. |
| color.border.dataviz.dim2 | #b9e0fe | #b9e0fe | var(--esds-color-border-dataviz-dim2) | Default dim2 data-viz border. |
| color.border.feedback.error.dim1 | #f00 | #ff5757 | var(--esds-color-border-feedback-error-dim1) | Strong error border (dim1). |
| color.border.feedback.error.dim2 | #ffc0c0 | #d70000 | var(--esds-color-border-feedback-error-dim2) | Soft error border (dim2). |
| color.border.feedback.success.dim1 | #12a74a | #41e17c | var(--esds-color-border-feedback-success-dim1) | Strong success border (dim1). |
| color.border.feedback.success.dim2 | #b9f9d0 | #12833d | var(--esds-color-border-feedback-success-dim2) | Soft success border (dim2). |
| color.border.feedback.warning.dim1 | #dd4f02 | #ffa032 | var(--esds-color-border-feedback-warning-dim1) | Strong warning border (dim1). |
| color.border.feedback.warning.dim2 | #ffd188 | #b73206 | var(--esds-color-border-feedback-warning-dim2) | Soft warning border (dim2). |
| color.border.dim1 | #90a1b9 | #62748e | var(--esds-color-border-dim1) | Strongest neutral border color with interaction states. |
| color.border.dim2 | #cad5e2 | #45556c | var(--esds-color-border-dim2) | Strong neutral border color with interaction states. |
| color.border.dim3 | #e2e8f0 | #314158 | var(--esds-color-border-dim3) | Subtle neutral border color with interaction states. |
| color.border.dim4 | #f1f5f9 | #192334 | var(--esds-color-border-dim4) | Faintest neutral border color with interaction states. |
| color.shadow.xs | #90a1b90f | #0206180f | var(--esds-color-shadow-xs) | Shadow color for the xs elevation. |
| color.shadow.sm | #90a1b90f | #0206180f | var(--esds-color-shadow-sm) | Shadow color for the sm elevation. |
| color.shadow.md | #90a1b914 | #02061814 | var(--esds-color-shadow-md) | Shadow color for the md elevation. |
| color.shadow.lg | #90a1b91a | #0206181a | var(--esds-color-shadow-lg) | Shadow color for the lg elevation. |
| color.shadow.xl | #90a1b91a | #0206181a | var(--esds-color-shadow-xl) | Shadow color for the xl elevation. |
| color.shadow.2xl | #90a1b924 | #02061824 | var(--esds-color-shadow-2xl) | Shadow color for the 2xl elevation. |
| color.state.focus | #0077cf | #36adfa | var(--esds-color-state-focus) | Focus ring color for focused interactive elements. |
| color.state.hover.medium | #0b426f1f | #f8fafc1f | var(--esds-color-state-hover-medium) | Medium hover overlay for subtle interactive feedback. |
| color.state.hover.strong | #0b426f99 | #f8fafc33 | var(--esds-color-state-hover-strong) | Strong hover overlay for prominent interactive feedback. |
| color.state.pressed.medium | #0b426f29 | #f8fafc29 | var(--esds-color-state-pressed-medium) | Medium pressed overlay for subtle active feedback. |
| color.state.pressed.strong | #0b426fcc | #f8fafc66 | var(--esds-color-state-pressed-strong) | Strong pressed overlay for prominent active feedback. |
| color.state.selected.medium | #0b426f1f | #f8fafc1f | var(--esds-color-state-selected-medium) | Medium selected overlay for subtle selection feedback. |
| color.state.selected.strong | #0b426fcc | #f8fafc66 | var(--esds-color-state-selected-strong) | Strong selected overlay for prominent selection feedback. |
| font.size.xs | 0.75rem | 0.75rem | var(--esds-font-size-xs) | Extra-small font size for captions and metadata. |
| font.size.sm | 0.875rem | 0.875rem | var(--esds-font-size-sm) | Small font size for helper text and compact UI. |
| font.size.md | 1rem | 1rem | var(--esds-font-size-md) | Medium (base) font size for body copy and default text. |
| font.size.lg | 1.125rem | 1.125rem | var(--esds-font-size-lg) | Large font size for emphasized body text. |
| font.size.xl | 1.25rem | 1.25rem | var(--esds-font-size-xl) | Extra-large font size for subtitles and subheadings. |
| font.size.2xl | 1.5rem | 1.5rem | var(--esds-font-size-2xl) | 2x-large font size for section headings. |
| font.size.3xl | 2rem | 2rem | var(--esds-font-size-3xl) | 3x-large font size for prominent headings. |
| font.size.4xl | 2.5rem | 2.5rem | var(--esds-font-size-4xl) | 4x-large font size for display headings. |
| font.size.5xl | 3rem | 3rem | var(--esds-font-size-5xl) | 5x-large font size for hero display text. |
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
| text.xs.size | 0.75rem | 0.75rem | var(--esds-text-xs-size) | Font size for extra-small text. |
| text.xs.line-height | 16px | 16px | var(--esds-text-xs-line-height) | Line-height for extra-small text. |
| text.xs.letter-spacing | 0px | 0px | var(--esds-text-xs-letter-spacing) | Letter spacing for extra-small text. |
| text.sm.size | 0.875rem | 0.875rem | var(--esds-text-sm-size) | Font size for small text. |
| text.sm.line-height | 20px | 20px | var(--esds-text-sm-line-height) | Line-height for small text. |
| text.sm.letter-spacing | 0px | 0px | var(--esds-text-sm-letter-spacing) | Letter spacing for small text. |
| text.md.size | 1rem | 1rem | var(--esds-text-md-size) | Font size for medium text. |
| text.md.line-height | 24px | 24px | var(--esds-text-md-line-height) | Line-height for medium text. |
| text.md.letter-spacing | 0px | 0px | var(--esds-text-md-letter-spacing) | Letter spacing for medium text. |
| text.lg.size | 1.125rem | 1.125rem | var(--esds-text-lg-size) | Font size for large text. |
| text.lg.line-height | 26px | 26px | var(--esds-text-lg-line-height) | Line-height for large text. |
| text.lg.letter-spacing | 0px | 0px | var(--esds-text-lg-letter-spacing) | Letter spacing for large text. |
| text.xl.size | 1.25rem | 1.25rem | var(--esds-text-xl-size) | Font size for extra-large text. |
| text.xl.line-height | 28px | 28px | var(--esds-text-xl-line-height) | Line-height for extra-large text. |
| text.xl.letter-spacing | 0px | 0px | var(--esds-text-xl-letter-spacing) | Letter spacing for extra-large text. |
| text.2xl.size | 1.5rem | 1.5rem | var(--esds-text-2xl-size) | Font size for 2x-large text. |
| text.2xl.line-height | 32px | 32px | var(--esds-text-2xl-line-height) | Line-height for 2x-large text. |
| text.2xl.letter-spacing | 0px | 0px | var(--esds-text-2xl-letter-spacing) | Letter spacing for 2x-large text. |
| text.3xl.size | 2rem | 2rem | var(--esds-text-3xl-size) | Font size for 3x-large text. |
| text.3xl.line-height | 40px | 40px | var(--esds-text-3xl-line-height) | Line-height for 3x-large text. |
| text.3xl.letter-spacing | 0px | 0px | var(--esds-text-3xl-letter-spacing) | Letter spacing for 3x-large text. |
| text.4xl.size | 2.5rem | 2.5rem | var(--esds-text-4xl-size) | Font size for 4x-large text. |
| text.4xl.line-height | 48px | 48px | var(--esds-text-4xl-line-height) | Line-height for 4x-large text. |
| text.4xl.letter-spacing | 0px | 0px | var(--esds-text-4xl-letter-spacing) | Letter spacing for 4x-large text. |
| text.5xl.size | 3rem | 3rem | var(--esds-text-5xl-size) | Font size for 5x-large text. |
| text.5xl.line-height | 56px | 56px | var(--esds-text-5xl-line-height) | Line-height for 5x-large text. |
| text.5xl.letter-spacing | 0px | 0px | var(--esds-text-5xl-letter-spacing) | Letter spacing for 5x-large text. |
| typography.xs.base | 400 0.75rem/16px Suisse Int'l | 400 0.75rem/16px Suisse Int'l | var(--esds-typography-xs-base) | Extra-small base typography (regular weight). |
| typography.xs.emphasized | 500 0.75rem/16px Suisse Int'l | 500 0.75rem/16px Suisse Int'l | var(--esds-typography-xs-emphasized) | Extra-small emphasized typography (medium weight). |
| typography.sm.base | 400 0.875rem/20px Suisse Int'l | 400 0.875rem/20px Suisse Int'l | var(--esds-typography-sm-base) | Small base typography (regular weight). |
| typography.sm.emphasized | 500 0.875rem/20px Suisse Int'l | 500 0.875rem/20px Suisse Int'l | var(--esds-typography-sm-emphasized) | Small emphasized typography (medium weight). |
| typography.md.base | 400 1rem/24px Suisse Int'l | 400 1rem/24px Suisse Int'l | var(--esds-typography-md-base) | Medium base typography (regular weight). |
| typography.md.emphasized | 500 1rem/24px Suisse Int'l | 500 1rem/24px Suisse Int'l | var(--esds-typography-md-emphasized) | Medium emphasized typography (medium weight). |
| typography.lg.base | 400 1.125rem/26px Suisse Int'l | 400 1.125rem/26px Suisse Int'l | var(--esds-typography-lg-base) | Large base typography (regular weight). |
| typography.lg.emphasized | 500 1.125rem/26px Suisse Int'l | 500 1.125rem/26px Suisse Int'l | var(--esds-typography-lg-emphasized) | Large emphasized typography (medium weight). |
| typography.xl.base | 400 1.25rem/28px Suisse Int'l | 400 1.25rem/28px Suisse Int'l | var(--esds-typography-xl-base) | Extra-large base typography (regular weight). |
| typography.xl.emphasized | 500 1.25rem/28px Suisse Int'l | 500 1.25rem/28px Suisse Int'l | var(--esds-typography-xl-emphasized) | Extra-large emphasized typography (medium weight). |
| typography.2xl.base | 400 1.5rem/32px Suisse Int'l | 400 1.5rem/32px Suisse Int'l | var(--esds-typography-2xl-base) | 2x-large base typography (regular weight). |
| typography.2xl.emphasized | 500 1.5rem/32px Suisse Int'l | 500 1.5rem/32px Suisse Int'l | var(--esds-typography-2xl-emphasized) | 2x-large emphasized typography (medium weight). |
| typography.3xl.base | 400 2rem/40px Suisse Int'l | 400 2rem/40px Suisse Int'l | var(--esds-typography-3xl-base) | 3x-large base typography (regular weight). |
| typography.3xl.emphasized | 500 2rem/40px Suisse Int'l | 500 2rem/40px Suisse Int'l | var(--esds-typography-3xl-emphasized) | 3x-large emphasized typography (medium weight). |
| typography.4xl.base | 400 2.5rem/48px Suisse Int'l | 400 2.5rem/48px Suisse Int'l | var(--esds-typography-4xl-base) | 4x-large base typography (regular weight). |
| typography.4xl.emphasized | 500 2.5rem/48px Suisse Int'l | 500 2.5rem/48px Suisse Int'l | var(--esds-typography-4xl-emphasized) | 4x-large emphasized typography (medium weight). |
| typography.5xl.base | 400 3rem/56px Suisse Int'l | 400 3rem/56px Suisse Int'l | var(--esds-typography-5xl-base) | 5x-large base typography (regular weight). |
| typography.5xl.emphasized | 500 3rem/56px Suisse Int'l | 500 3rem/56px Suisse Int'l | var(--esds-typography-5xl-emphasized) | 5x-large emphasized typography (medium weight). |

## 3. Component Tokens

| Token Name | Light Value | Dark Value | CSS Variable | Description |
|---|---|---|---|---|
| body.xs.font | 400 0.75rem/16px Suisse Int'l | 400 0.75rem/16px Suisse Int'l | var(--esds-body-xs-font) | Extra-small body text style. |
| body.sm.font | 400 0.875rem/20px Suisse Int'l | 400 0.875rem/20px Suisse Int'l | var(--esds-body-sm-font) | Small body text style. |
| body.md.font | 400 1rem/24px Suisse Int'l | 400 1rem/24px Suisse Int'l | var(--esds-body-md-font) | Medium (default) body text style. |
| body.lg.font | 400 1.125rem/26px Suisse Int'l | 400 1.125rem/26px Suisse Int'l | var(--esds-body-lg-font) | Large body text style. |
| focus.border.color | #0077cf | #36adfa | var(--esds-focus-border-color) | N/A |
| focus.border.radius | 2px | 2px | var(--esds-focus-border-radius) | N/A |
| focus.border.width | 2px | 2px | var(--esds-focus-border-width) | N/A |
| heading.xs.font | 500 1.25rem/28px Suisse Int'l | 500 1.25rem/28px Suisse Int'l | var(--esds-heading-xs-font) | Extra-small heading style. |
| heading.sm.font | 500 1.5rem/32px Suisse Int'l | 500 1.5rem/32px Suisse Int'l | var(--esds-heading-sm-font) | Small heading style. |
| heading.md.font | 500 2rem/40px Suisse Int'l | 500 2rem/40px Suisse Int'l | var(--esds-heading-md-font) | Medium heading style. |
| heading.lg.font | 500 2.5rem/48px Suisse Int'l | 500 2.5rem/48px Suisse Int'l | var(--esds-heading-lg-font) | Large heading style. |
| heading.xl.font | 500 3rem/56px Suisse Int'l | 500 3rem/56px Suisse Int'l | var(--esds-heading-xl-font) | Extra-large heading style. |
| text-link.content.color.default | #0077cf | #0077cf | var(--esds-text-link-content-color-default) | Default text link color. |
| text-link.content.color.visited | #8f30f7 | #cab1ff | var(--esds-text-link-content-color-visited) | Default visited text link color. |

## 4. AI Implementation Directives

- **Always use CSS variables** in implementation. Never hard-code hex or dimension values.
- **Prefer Tier 2 (Semantic) tokens** for all component styling. Only use Tier 3 (Component) tokens when they explicitly exist for the element you are building.
- **Never reference Tier 1 (Primitive) tokens directly** in component code; they exist only for alias resolution and designer reference.
- **Theme awareness**: The design system supports `light` and `dark` modes. Use the `data-esds-theme` attribute or corresponding modifier CSS file to apply themes.
- **Portable product tokens**: When building components for a specific product (calendar, mail, swisstransfer, etc.), always use the token names exactly as shown in this file (e.g., `color.background.brand.default` with `var(--esds-color-background-brand-default)`). The build system automatically resolves these to the correct product-specific colors. **Never** use product-specific primitive names such as `color.background.brand.calendar.default` directly in component code. **Never** create separate component variants or branches per product when the same semantic token exists. All products share the same token API — only the resolved values differ.