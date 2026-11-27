---
'@infomaniak-design-system/figma-plugin-linter': minor
---

Designers can now choose which lint rules apply. A `Rules · N/18` button next to the scope picker opens a settings view listing every rule with its severity and a one-line description; toggling a rule applies from the next run (including the automatic re-lint after a fix) and is persisted per user via `figma.clientStorage`, so the selection survives sessions. `Reset to defaults` re-enables every rule; unknown rule ids in a stored selection are ignored so a selection survives plugin updates that add or remove rules; and with every rule disabled the Run button is disabled (the sandbox also refuses the run with a «No rules enabled» setup error).
