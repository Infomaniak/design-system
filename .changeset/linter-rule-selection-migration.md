---
'@infomaniak-design-system/figma-plugin-linter': minor
---

New lint rules now default to enabled for existing users. The persisted rule selection stores the registry snapshot at save time (`ruleSelection.v2` payload): on load, rules the snapshot already knew keep their stored enabled state — explicit mutes survive — while rules added since the save default to enabled, so a plugin update never silently ships a rule switched off. Selections saved before versioning keep their stored ids as-is until the next save or reset.
