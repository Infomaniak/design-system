---
name: convert-figma-tokens
description: Use when the user wants to sync Figma tokens into the repo (keywords convert-figma-tokens, tokens.json, TokensBrücke, Figma export, sync tokens). Runs the conversion from packages/tokens, reviews the regenerated DTCG tokens for coherence, then asks the user to validate before committing/pushing/opening a PR or rolling back.
---

# Context

You are an expert design-token release engineer. Your task is to turn a Figma tokens export into a reviewed, validated commit in this repository. You must NEVER commit or push without the user's explicit approval.

# Guidelines

## 1. Check prerequisites

- Input file `packages/tokens/scripts/scripts/convert-figma-tokens/tokens/tokens.json` must exist (gitignored; exported from Figma via TokensBrücke). If missing, STOP and ask the user to export it first, pointing at `docs/figma/tokens-bruecke/figma-tokens-bruecke.md`.
- Run `git status`. The conversion wipes and regenerates `packages/tokens/tokens/**`. If the worktree has uncommitted changes (especially under `packages/tokens/`), STOP and ask the user how to proceed before running anything.

## 2. Run the conversion

From `packages/tokens`, run:

```shell
yarn convert-figma-tokens
```

It converts the Figma export into DTCG files in `packages/tokens/tokens/**`, formats them (prettier), then runs `yarn build:tokens`. If the build fails, the export is invalid or incoherent: STOP, report the errors, propose the rollback from step 7.

## 3. Review coherence

Inspect `git status --porcelain -- packages/tokens/tokens` and `git diff -- packages/tokens/tokens`:

- **Unexpected removals**: whole tiers, files, or token groups disappearing usually means a bad Figma export. Cross-check against the input `tokens.json` before trusting them.
- **Tier rules**: `t2-semantic` and `t3-component` tokens must reference `t1-primitive` or `t2-semantic` tokens, never raw values.
- **Modifiers**: each context is used at most once per modifier; `modifiers/<modifier>/<context>` files stay consistent.
- **Suspicious renames**: flag removed + added pairs with identical values — likely renames the user should be aware of.

## 4. Present the summary

Give the user a concise report: counts of added / modified / removed token files, notable value changes, and any flagged renames or removals. Tell them where to look (`git diff -- packages/tokens/tokens`) so they can review manually.

## 5. Ask for validation

Ask the user a strict yes/no question: "Do you validate these token changes?" Do not commit, push, or open a PR on an ambiguous answer.

## 6. If YES — commit, push, PR

- Create a branch following repo naming (`feat/`, `fix/`, `docs/` prefixes): `feat/sync-figma-tokens-<YYYY-MM-DD>` when tokens are added, `fix/sync-figma-tokens-<YYYY-MM-DD>` when values are corrected.
- Stage ONLY `packages/tokens/tokens` (the input `tokens.json` is gitignored).
- Commit with Conventional Commits, e.g. `feat(tokens): sync DTCG tokens from Figma export`.
- Push with `git push -u origin <branch>`.
- Open the PR against `develop` with `gh pr create --base develop`, title = commit message, body = the summary from step 4. Do NOT squash or amend history.

## 7. If NO — rollback

Restore the regenerated tokens and discard leftovers, scoped strictly to the tokens directory (never a global `git clean`):

```shell
git restore -- packages/tokens/tokens
git clean -fd -- packages/tokens/tokens
```

Confirm with `git status` that the worktree is back to its pre-conversion state.
