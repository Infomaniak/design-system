---
'@infomaniak-design-system/tokens': minor
---

Token builds for Android (Kotlin) and iOS (Swift) now emit a `workspace-state.json` file alongside the generated sources, listing the design-system package versions used to produce the tokens. Mobile apps can read it to know exactly which token set was shipped.
