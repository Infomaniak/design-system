# Changelog

## 0.5.0

### Minor Changes

- [#355](https://github.com/Infomaniak/design-system/pull/355) [`46ce53f`](https://github.com/Infomaniak/design-system/commit/46ce53f6a87f66cc1ae58551d3c25ef8fe53db8a): Added emphasized typography styles for headings and body text. Text emphasis is now opt-in via a new `emphasized` attribute on the `esds-heading` and `esds-body` custom attributes, new `esds-heading-{xs..xl}-emphasized` and `esds-body-{xs..lg}-emphasized` utility classes, or automatically through `<strong>` content inside a styled element.

  The `heading.{xs..xl}.font` and `body.{xs..lg}.font` tokens now expose `base` and `emphasized` variants instead of a single value; the previous flat token path was removed, so consumers referencing it must update to one of the new variants (e.g. `body.md.font.base`). The corresponding CSS custom properties were renamed accordingly (`--esds-body-md-font` becomes `--esds-body-md-font-base` / `--esds-body-md-font-emphasized`). Headings no longer default to the emphasized typography style: they now render with the base style unless emphasis is applied.

- [#328](https://github.com/Infomaniak/design-system/pull/328) [`74ba77c`](https://github.com/Infomaniak/design-system/commit/74ba77c0b11487f885660274d58a4bbab39b3179): Added the `esds-button` custom attribute, which applies the design system button styles to native `<button>` and `<a>` elements while preserving native behavior — links keep their navigation semantics and are exposed to assistive technologies as buttons with proper `aria-disabled` handling. It supports `disabled` and `loading` states, with variants selected through `data-esds-button-type` (`primary`, `secondary`, `ghost`, and their destructive variants) and `data-esds-button-size` (`small`, `medium`, `large`) attributes. The matching design tokens ship as new `button-size` and `button-type` modifiers plus button component tokens, importable per variant or all at once (e.g. `@infomaniak-design-system/tokens/css/modifiers/button-size/all.attr.css`).

- [#353](https://github.com/Infomaniak/design-system/pull/353) [`cc0b29f`](https://github.com/Infomaniak/design-system/commit/cc0b29fe89f9da9975f8426d43b5380aea632c8e): Added the `esds-kbd` custom attribute, which styles native `<kbd>` elements as keyboard keys — extra-small emphasized body typography with muted content color on a surface background, rounded with a `md` radius and a subtle `dim3` border, all driven by design tokens. The attribute can only be used on `<kbd>` elements, preserving native semantics. The element lays its content out with a flex `gap` token: multi-key shortcuts stay within a single `<kbd esds-kbd>` element, wrapping the `+` separator in a `<span>` so the keys are evenly spaced (e.g. `<kbd esds-kbd>⌘<span>+</span>K</kbd>`).

- [#353](https://github.com/Infomaniak/design-system/pull/353) [`cc0b29f`](https://github.com/Infomaniak/design-system/commit/cc0b29fe89f9da9975f8426d43b5380aea632c8e): Added the `esds-separator` component, which divides content horizontally or vertically. It exposes `role="separator"` semantics with `aria-orientation`, and can be removed from the accessibility tree with the `decorative` attribute. Its appearance is driven by the design tokens.

- [#356](https://github.com/Infomaniak/design-system/pull/356) [`92e9970`](https://github.com/Infomaniak/design-system/commit/92e9970095127ae916eebdaa2f7795f1e094a327): Added a new `focus.border.offset` token (defaults to `spacing.2xs`), exposed as the `--esds-focus-border-offset` CSS custom property. The focus effect on `esds-text-link` now offsets its outline with this token, so the focus ring no longer overlaps the link text and can be tuned via the custom property.

## 0.4.1

### Patch Changes

- [#348](https://github.com/Infomaniak/design-system/pull/348) [`cc9c9fb`](https://github.com/Infomaniak/design-system/commit/cc9c9fb7b568ebcf11c9dce93a2e21905dd30795): Fixed `<esds-icon>` crashing in Firefox ESR with `TypeError: WeakMap key Symbol("IconifyApi") must be an object`. The runtime check deciding between `WeakMap` and `Map` for shared injected defaults was stripped by the bundler's minifier, so the fix released in 0.1.1 never took effect in published builds. The feature detection is now minification-proof.

## 0.4.0

### Minor Changes

- [#313](https://github.com/Infomaniak/design-system/pull/313) [`33ed986`](https://github.com/Infomaniak/design-system/commit/33ed9862bc908b07ac00eb239917a49247139b9d): Updated the text-link component to use the restructured semantic color tokens. Added a proper focus-visible ring using the new focus component tokens, and introduced hover and active states using `color-mix` overlays with the semantic state colors. Links now display an underline on hover and active.

## 0.3.0

### Minor Changes

- d323cb0: Added `esds-heading` and `esds-body` custom attributes for applying typography styles to native HTML elements while preserving their semantic meaning. Both attributes consume the `heading` and `body` design tokens respectively, with sizes set via the attribute value (e.g. `<h1 esds-heading="xl">` or `<p esds-body="md">`).
