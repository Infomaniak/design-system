---
'@infomaniak-design-system/components': patch
---

Fixed `esds-button` removing an author-defined `aria-label` from anchor buttons (`<a esds-button>`) when the element was upgraded or when its state changed. The accessible name of a button or anchor button is now never modified; the loading state is conveyed with the `aria-disabled` and `aria-busy` attributes instead.
