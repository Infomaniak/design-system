---
'@infomaniak-design-system/components': patch
---

Improve IDE support for custom attributes and native elements.

- Custom attributes (e.g. `esds-button`) are now contributed to IDEs as attributes instead of custom element tags: they are autocompleted on any element, including native ones (e.g. `<a esds-button>`, `<button esds-button>`).
- JetBrains IDEs now automatically detect the package's `web-types.json` (the `web-types` field previously pointed to a file that was not published).
- Fix the missing `esds-badge` export from the package's public API.
