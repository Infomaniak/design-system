---
'@infomaniak-design-system/tokens': minor
---

Added border width token bindings to the generated Tailwind CSS:

- `--border-width-*` variables are emitted in the `@theme` block, so utilities such as `border-xs`, `border-md`, `border-t-lg` or `border-b-sm` resolve against the design tokens (all side variants included).
- Numeric border width utilities are blocked to keep border widths token-driven: `border-0`, `border-2`, `border-4`, `border-8` and every side variant (`border-t-2`, `border-x-4`, ...).
- Editor suggestions for the removed numeric values may still appear (hardcoded in Tailwind's engine).
