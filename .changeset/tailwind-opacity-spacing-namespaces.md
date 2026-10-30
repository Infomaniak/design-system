---
'@infomaniak-design-system/tokens': minor
---

Bound the opacity and spacing token namespaces to the generated Tailwind CSS, and locked numeric utility scales to the design tokens:

- `--opacity-*` and `--spacing-*` variables are emitted in the `@theme` block, so utilities such as `opacity-subtle` or `p-md` resolve against the design tokens.
- Numeric spacing utilities are disabled (the `--spacing` base scale is reset to `initial`): `p-4`, `w-8`, `gap-2` and similar no longer generate; use the token names instead (`p-md`, `w-xl`, `gap-2xl`, ...).
- Numeric opacity utilities are blocked (`opacity-0` through `opacity-100` by 5); arbitrary values such as `opacity-[0.4]` keep working.
- Editor suggestions for the removed numeric values may still appear (hardcoded in Tailwind's engine); variant-prefixed forms (e.g. `hover:opacity-50`) still compile for the same reason.
