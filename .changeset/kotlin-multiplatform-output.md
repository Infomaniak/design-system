---
'@infomaniak-design-system/tokens': minor
---

Kotlin tokens are now generated for Kotlin/Compose Multiplatform: sources are emitted in the `commonMain` source set (`src/commonMain/kotlin`) instead of `src/main/kotlin`, and theme modules' `build.gradle.kts` now declare their namespace inside a `kotlin { android { ... } }` block.
