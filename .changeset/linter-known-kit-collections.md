---
'@infomaniak-design-system/figma-plugin-linter': minor
---

Tokens bound from Edelweiss kit libraries no longer trigger the unknown-collection warning. The platform kits (Material, Shadcn, iOS-iPadOS) bind tokens from Edelweiss - Token Core, which publishes semantic collections beyond the t1/t2/t3 tiers (`theme`, `dataviz`, `product`, `button-*`, `badge-*`, `avatar-size`), and the Material Kit adds `Schemes/…` roles — the linter now recognizes them by matching the source **library** (`Edelweiss - …` prefix, stamped during the library-import pass), so a new collection inside a kit needs no plugin change. Guards: remote only (a kit collection pasted into the file keeps its warning), raw palette collections inside kits (`Red/100`) still warn, kit tokens keep their `unknown` tier so they are never suggested as fixes, and wrong-token / primitive-misuse keep evaluating them.
