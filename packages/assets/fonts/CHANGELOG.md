# Changelog

## 0.1.1

### Patch Changes

- [#381](https://github.com/Infomaniak/design-system/pull/381) [`7fe6e6d`](https://github.com/Infomaniak/design-system/commit/7fe6e6d7d2d0736191a95a100139818574215817): Renamed the TTF font family from "Infomaniak Variable" to "Infomaniak Sans".

## 0.1.0

### Minor Changes

- [#250](https://github.com/Infomaniak/design-system/pull/250) [`c4a1614`](https://github.com/Infomaniak/design-system/commit/c4a1614e0a9eeacb870becb5139c0a8b295aa918): Introducing `@infomaniak-design-system/fonts`, a new package distributing the Infomaniak Sans typeface (variable TTFs, woff2 files, and ready-to-use CSS), along with the tooling to build and publish font updates.

  The design system's base typography now uses Infomaniak Sans: the semantic `font.family.base` token points to the new `font.family.infomaniak-sans` primitive instead of Suisse Int'l.
  Load the fonts via own hosting to render text with the intended typeface.
