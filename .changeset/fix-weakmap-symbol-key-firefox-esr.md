---
'@infomaniak-design-system/components': patch
---

Fixed `<esds-icon>` crashing in Firefox ESR with `TypeError: WeakMap key Symbol("IconifyApi") must be an object`. The runtime check deciding between `WeakMap` and `Map` for shared injected defaults was stripped by the bundler's minifier, so the fix released in 0.1.1 never took effect in published builds. The feature detection is now minification-proof.
