# Changelog

## 0.3.0

### Minor Changes

- 2b185c3: Improved Tailwind token generation to map color tokens to their corresponding Tailwind utilities. Color tokens prefixed with `background`, `border`, and `content` now generate `background-color-*`, `border-color-*`, and `text-color-*` utility classes respectively, instead of the generic `color-*` class, producing more idiomatic Tailwind output.
- 6c2a24e: Split the T3 `typography` token set into separate `body` and `heading` component tokens, and introduced a new T2 `typography` set covering sizes `xs`–`5xl` with `base` and `emphasized` weight variants. Added typography documentation with a font preview component. Fixed a missing `error.dim1.default` color token in light and dark themes.
