---
'@infomaniak-design-system/tokens': minor
---

Added a new `modifiers/all.attr.css` output, which imports the attribute CSS of every modifier into a single file. Consumers can now apply all modifiers at once instead of importing each modifier's `all.attr.css` individually:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/all.attr.css';
```
