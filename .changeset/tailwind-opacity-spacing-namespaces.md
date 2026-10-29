---
'@infomaniak-design-system/tokens': patch
---

Added opacity and spacing token bindings to the generated Tailwind CSS: `--opacity-*` and `--spacing-*` variables are now emitted in the `@theme` block, so Tailwind utilities such as `opacity-*` and spacing-based utilities (e.g. `w-8`, `p-4`) resolve against the design tokens. The `--spacing: 0.25rem` base scale is now emitted before the token variables so specific spacing tokens take precedence over the default scale.
