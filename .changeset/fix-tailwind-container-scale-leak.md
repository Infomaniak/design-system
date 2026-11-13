---
'@infomaniak-design-system/tokens': minor
---

Reset Tailwind's default container scale in the generated Tailwind CSS, so sizing utilities resolve exclusively from the design tokens' spacing scale:

- `w-3xs`, `min-w-3xs` and other names outside the spacing scale no longer fall back to Tailwind's default container values (e.g. `w-3xs` was 256px), eliminating the mixed, inconsistent sizing scale.
- Container query variants (`@sm:`, `@max-md:`, ...) no longer compile against Tailwind's default container values; they will work again once container-related tokens are bound to the `--container-*` namespace. In the meantime, use arbitrary values instead, e.g. `@min-[28rem]:hidden` / `@max-[48rem]:hidden` (note: future container token bindings will require literal values, as Tailwind rejects `var()` references in container query conditions).
