---
'@infomaniak-design-system/components': patch
---

`esds-body` and `esds-heading` Tailwind typography classes are now defined as Tailwind v4 custom utilities (`@utility`) instead of component-layer classes. They can be combined with Tailwind variants (e.g. `hover:`, `md:`) and participate correctly in Tailwind's utility ordering. Class names are unchanged.
