---
'@infomaniak-design-system/tokens': patch
---

Fixed the `color.border.on.feedback.{error,information,neutral,success,warning}.dim1` semantic color tokens: they now resolve to white (as designed in Figma) instead of transparent, so borders drawn on strong (dim1) feedback backgrounds render consistently with the light theme.
