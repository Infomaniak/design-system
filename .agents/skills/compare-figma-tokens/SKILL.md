---
name: compare-figma-tokens
description: Use when the user wants to audit, compare or diff the Figma "Token Core" variables against the repo DTCG tokens and get a report (keywords compare tokens, audit tokens, diff figma, token drift, rapport tokens, vérifier les tokens, check les variables). Read-only on both sides — reports name-level and value-level differences per collection, never edits anything.
---

# Context

You are an expert design-token auditor. Your task is to reproduce a **full variable-by-variable audit** between the Figma "Token Core" file and this repository's DTCG tokens (`packages/tokens/tokens/**`), then produce a diff report.

**This skill is strictly read-only on both sides.** Never edit Figma variables or repo token files as part of this audit — the deliverable is the report. If the user then wants to fix the drift, propose the appropriate fix (repo-side token sync or Figma cleanup) and wait for their explicit approval before touching anything.

# 1. Prerequisites

- **Figma MCP** must be available. Load the `/figma-use` skill BEFORE any `use_figma` call (resource fallback: `skill://figma/figma-use/SKILL.md`) — it is mandatory, and pass `skillNames: "resource:figma-use"` on every call.
- **File key**: read `FIGMA_TOKENS_FILE_KEY` from the repo `.env` (gitignored; `.env.example` documents the variable). Example: `grep -m1 '^FIGMA_TOKENS_FILE_KEY=' .env | cut -d= -f2- | tr -d '"'`. If `.env` is missing or the variable is empty, extract the fileKey from a `figma.com/design/:fileKey/:fileName` URL provided by the user, or ask them.
- Call `create_session` (fileKey + description) once, then reuse the returned `sessionId` on every file-tool call.
- **Workdir**: `/tmp/opencode/token-diff` (`mkdir -p` it; `/tmp/opencode` may have been purged between sessions — never assume previous dumps are there).
- Do **not** rely on the `get_variable_defs` tool: it requires a layer selection in the Figma desktop app. Use `use_figma` with the Plugin API instead.

# 2. Flatten the repo tokens

Run `scripts/flatten-repo.mjs` (node ≥ 20). It walks `packages/tokens/tokens/{t1-primitive,t2-semantic,t3-component,modifiers}` and writes `repo-tokens.json` + prints per-group/mode counts.

Data model to keep in mind:

- Groups: `t1`, `t2`, `t3` (single mode `Mode 1`) and `modifiers/<name>` (one mode per context file, e.g. `modifiers/theme` → `light`/`dark`).
- Composite tokens (`$type: "typography"` or `"shadow"`) are stored separately as `{ props: {prop: value} }` maps — the Figma side represents them as one variable **per property**.
- The DTCG `$root` key is transparent when flattening (a `$root` token lives at its parent path).

# 3. Dump the Figma variables

Use `use_figma` with `figma.variables.getLocalVariableCollectionsAsync()` + `figma.variables.getLocalVariablesAsync()`. The tool return value is capped (~48 KB), so dump **collection by collection** (typical plan: t1 → 1 call, t2 → 2 calls of ~250 vars, t3 → 1, theme → 2, small collections [product, dataviz, button-type, button-size, badge-type, avatar-size] → 1). Exact code templates (including the value encodings and the mode iteration) are in `references/figma-dump-templates.md`.

Rules that have proven critical:

- **Compact line format**: `name|value` for single-mode collections, `name|mode=value~mode=value` for multi-mode ones. Prefix small-collection lines with `[collection] `.
- **Value encodings**: alias → `@targetVariableName`; color → `#rrggbb` (+ `@alphaPercent` when a < 1); color+opacity composite → `OPAn:@target`; floats/strings raw.
- **Compute hex inside the plugin** (`Math.round(x*255)`), never by hand — manual hex conversion was the #1 source of false positives.
- Save each chunk to `figma-<collection>.txt` (split parts suffixed `a`/`b` when paginated).
- If a composite value shows a raw alias id (`VariableID:1618:162`), resolve it with `figma.variables.getVariableByIdAsync(id)` in a dedicated call.
- Sanity-check the total: the sum of per-collection variable counts must match `getLocalVariablesAsync().length`.

# 4. Run the comparison

Run `scripts/compare.mjs`. It loads `repo-tokens.json` + the `figma-*.txt` dumps and writes `diff-results.json` (per collection: `figmaOnly`, `repoOnly`, `mismatch`, plus `unresolvedFigma`/`unresolvedRepo`). All dump files must exist before running (create empty ones for collections you did not dump). `unresolvedFigma`/`unresolvedRepo` list alias chains that could not be resolved — on complete dumps they must be empty; on partial dumps they reveal which targets are missing (never ignore them: an unresolved chain hides a potential mismatch).

Name mapping (Figma → repo):

- `/` → `.`, and **drop `@root` segments** (they encode DTCG `$root` / collection-mode placeholders).
- Collections ↔ repo groups: `t1`↔`t1-primitive`, `t2`↔`t2-semantic`, `t3`↔`t3-component`, every other collection ↔ `modifiers/<collection name>`.
- Typography composites: repo `typography.2xl.base` ↔ Figma `typography/2xl/base/{fontFamily,fontSize,fontWeight,letterSpacing,lineHeight}`. Shadow composites: repo `shadow.sm` (props `offsetX/offsetY/blur/spread/color`) ↔ Figma `shadow/sm/{prop}`. Component fonts: Figma `body/lg/font/base/fontSize` or `kbd/font/fontSize` → repo `<path>.font` + prop.
- A DTCG `$extensions.figmaName` array overrides the default name for special tokens (used by the 9 dataviz `@root` tokens).

Value comparison:

- Normalize: `rem` dimensions ×16 (→ px), repo `opacity.*` fractions ×100, color `components` (0–1) → hex with `Math.round(c*255)`, alpha references resolved.
- **Figma aliases target variable NAMES, which are ambiguous across collections** (e.g. `color/background/backdrop` exists in both `t2` and `theme`). Resolution tries every candidate collection except the current variable itself and succeeds when candidates converge. Mode contexts (`DEFAULT_CTX`): `theme: light`, `product: infomaniak`, `dataviz: blue`, `button-type: primary`, `button-size: medium`, `badge-type: primary`, `avatar-size: extra-large` — these match the repo t3 snapshot convention (see §5).
- Repo-side reference resolution priority: active modifier context files first, then `t3`, `t2`, `t1`.
- A repo color may carry `components`/`alpha` as curly references (`{color.gray.700}`, `{opacity.30}`) — resolve them through the same graph.

**Verification discipline (do not skip):** before reporting any mismatch as real, re-verify it directly in Figma with a targeted `use_figma` lookup (by name or `getVariableByIdAsync`), and re-check the repo file with `node -e` on the JSON. Transcription slips and stale mapping rules produce false positives; a targeted check settles it in one call.

# 5. Known structural (non-)diffs — do NOT report as drift

- `theme` collection `shadow/{xs,sm,md,lg,xl,2xl}` variables (× light/dark): legacy orphans in Figma — nothing references them anymore (`t2 shadow/{size}/color` → `@color/shadow`), values identical to `color/shadow`. Report as **cleanup candidates**, not drift.
- `button-type` `button.border.width.disabled` exists in Figma but in no repo modifier file — the t3 fallback `button.border.width.disabled = {border.none.width}` covers it with the same value.
- Repo t3 component tokens are **static snapshots of one variant** (badge → `primary`, avatar → `extra-large`), while Figma t3 tokens are bound to the modifier collections (mode-reactive). With the `DEFAULT_CTX` above the values match; a difference in _binding philosophy_ is expected, only flag it if values diverge.
- Typography/shadow representation differs by design (composite token ↔ per-property variables) — that is the mapping, not a diff.
- All t2 variables alias the `theme` collection in Figma (indirection layer): compare **resolved leaf values**, never raw alias targets, for theme-dependent tokens.

# 6. Report

Produce a report with:

1. **Header**: Figma file (name, page of version), repo package version (`packages/tokens/package.json`), variable/token totals. Check the version-page convention: the Figma file should carry a page named like the repo version (`vX.Y.Z`) — flag it if missing.
2. **Per-collection table**: figma/repo counts, # figmaOnly, # repoOnly, # value mismatches.
3. **Details**: real value conflicts first (token, repo value, Figma value), then tokens present on one side only, aggregated when repetitive (e.g. "3 hues × 11 shades"), separating _real drift_ from _structural/expected_ items (§5) and _orphans_.
4. **Suggested next steps** (e.g. repo-side token sync, Figma cleanup, or a fixes branch) — always pending user approval.

Reference files: `references/figma-dump-templates.md` (use_figma dump code), `scripts/flatten-repo.mjs`, `scripts/compare.mjs`.
