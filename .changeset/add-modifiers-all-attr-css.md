---
'@infomaniak-design-system/tokens': minor
---

Added a new `modifiers/all.attr.css` output, which imports the attribute CSS of every modifier into a single file. Consumers can now apply all modifiers at once instead of importing each modifier's `all.attr.css` individually:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/all.attr.css';
```

The modifiers are imported in a deterministic order (theme and product first, then the component modifiers), and each modifier can still be imported or overridden individually. The documentation link shipped in the package README was also fixed to point to the tokens getting-started page.
