---
'@infomaniak-design-system/tokens': minor
---

Modifier scopes (theme, product, …) now re-resolve token aliases per element: a modifier applied to an element also applies to all its descendants, whatever the nesting order, without redeclaring the tokens that depend on the overridden ones. Modifier CSS files now only contain the values the context actually changes, making them smaller. Aliases never overridden by any modifier stay declared once on `:root`.
