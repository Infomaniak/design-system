---
'@infomaniak-design-system/tokens': patch
---

Publishing tokens to the iOS and Android repositories now deletes the previous `esds/tokens/*` branches from the same release channel (`rc`, `dev`, or prod), which also closes their pull requests.
