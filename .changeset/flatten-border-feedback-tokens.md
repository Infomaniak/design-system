---
'@infomaniak-design-system/tokens': minor
---

Flatten feedback border tokens and add on-feedback border tokens.

- Removed `color.border.feedback.{error,success,warning,information,neutral}.dim1` and `.dim2` tokens: each feedback border color is now a single token (`color.border.feedback.{error,success,warning,information,neutral}`), resolving to the former `dim1` (strong) value in both light and dark themes.
- Added `color.border.on.feedback.{success,warning,error,information,neutral}.dim1`, `.dim2` and `.dim3` tokens for borders rendered on top of feedback backgrounds.
- Updated the `secondary-destructive` button modifier to reference the flattened `color.border.feedback.error` token.
