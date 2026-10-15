---
'@infomaniak-design-system/figma-plugin-linter': minor
---

Added the ESDS Linter Figma plugin, a read-only design-token compliance linter for the Infomaniak Design System. Pick a scan scope (Selection, Page or File), run the plugin, and get findings grouped by rule within each severity; clicking a finding selects the offending layer on canvas, and the markdown report can be copied for handoff tickets. This first slice ships the plugin scaffolding, the lint engine (progress, cooperative cancel), the scan scopes, the report pipeline and the `lorem-ipsum` check (leftover placeholder copy, any casing); token rules and fix mode follow in the next slices. The plugin is distributed as a GitHub Release asset (`esds-linter.zip`), imported locally in Figma Desktop as a development plugin — it is not published to the Figma Community. See the package README for installation and usage.
