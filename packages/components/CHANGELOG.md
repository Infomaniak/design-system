# Changelog

## 0.4.1

### Patch Changes

- [#348](https://github.com/Infomaniak/design-system/pull/348) [`cc9c9fb`](https://github.com/Infomaniak/design-system/commit/cc9c9fb7b568ebcf11c9dce93a2e21905dd30795): Fixed `<esds-icon>` crashing in Firefox ESR with `TypeError: WeakMap key Symbol("IconifyApi") must be an object`. The runtime check deciding between `WeakMap` and `Map` for shared injected defaults was stripped by the bundler's minifier, so the fix released in 0.1.1 never took effect in published builds. The feature detection is now minification-proof.

## 0.4.0

### Minor Changes

- [#313](https://github.com/Infomaniak/design-system/pull/313) [`33ed986`](https://github.com/Infomaniak/design-system/commit/33ed9862bc908b07ac00eb239917a49247139b9d): Updated the text-link component to use the restructured semantic color tokens. Added a proper focus-visible ring using the new focus component tokens, and introduced hover and active states using `color-mix` overlays with the semantic state colors. Links now display an underline on hover and active.

## 0.3.0

### Minor Changes

- d323cb0: Added `esds-heading` and `esds-body` custom attributes for applying typography styles to native HTML elements while preserving their semantic meaning. Both attributes consume the `heading` and `body` design tokens respectively, with sizes set via the attribute value (e.g. `<h1 esds-heading="xl">` or `<p esds-body="md">`).
