---
'@infomaniak-design-system/tokens': patch
---

Fixed Tailwind tooling resolution of spacing and radius tokens in the generated Tailwind CSS: `--spacing` and `--radius-*` are now emitted in a non-inline `@theme` block instead of `@theme inline`, so utilities such as `w-8` or `rounded-xs` reference `var(--spacing)` / `var(--radius-xs)` and the variables stay exposed on the Theme object for value-resolution tooling (linters, IntelliSense, equivalence checkers). No rendering change: values are identical at runtime and dark/light theming is unaffected (colors remain inline).
