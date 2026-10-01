---
'@infomaniak-design-system/tokens': minor
---

Added a new `all.attr.css` output for each modifier, which imports the attribute CSS of all its contexts into a single file. Consumers can now import one file per modifier (e.g. `modifiers/button-size/all.attr.css`) instead of listing every context variant individually.
