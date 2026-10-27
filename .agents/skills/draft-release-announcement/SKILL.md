---
name: draft-release-announcement
description: Drafts the release announcement message for a design-system release. Use when the user wants to announce a release or write release notes for the team channel (keywords release announcement, annonce de release, release notes, announce the release).
---

# Context

You draft the French announcement message posted in the team channel after a release PR (`release: develop → main`) is merged. The message is plain text ready to paste into any messaging tool, summarizing user-facing changes per package. You deliver copy-paste text only — you never post it and you never commit anything.

# Guidelines

## 1. Identify the Release PRs

- If the user provides PR number(s), use them. Otherwise list the recent release PRs and confirm with the user which ones to cover:
  `gh pr list --repo Infomaniak/design-system --search "release: develop → main" --state merged --limit 10`

## 2. Extract the Release Content

For each release PR, fetch the diff and mine it:

`gh pr diff <number> > <temp-file>`

The diff contains everything you need:

- **`packages/*/package.json` version bumps** → which packages were released and at which versions. This is the definitive list of sections to include.
- **`packages/*/CHANGELOG.md` additions** → the authoritative change list. Verbose and engineer-oriented: compress it, shift the audience (see step 4).
- **Deleted `.changeset/*.md` files** → the original short summaries. They appear as `-` lines and are often the best condensed source.
- **Beyond changelogs, check for user-facing changes:**
  - `packages/assets/images/svg/assets/server/esds.json` — a bump of `info.version` means a new icons release (the announced icons version is the one in `esds.json`, not the svg-assets `package.json`);
  - docs pages (`apps/docs/src/stories/**/*.mdx`) added, removed or renamed;
  - `packages/assets/images/svg/scripts/shared/sf-symbols/` changes (iOS SF Symbols generation);
  - Storybook UI tweaks (`apps/docs/src/components/`).
- **Ignore internal-only changes:** workflows, AGENTS.md, tests, CI scripts, tooling.

## 3. Clarify With the User

Unless already answered, ask:

1. **Scope:** one combined message covering all pending releases, or one per release?
2. **Breaking changes:** inline `⚠️` mentions in the package section (default), or a dedicated migration block at the top of the message?
3. **Bonus internals** (docs pages, iOS tooling, Storybook UI): one line each in a `Bonus :` footer (default), or skip?

## 4. Draft the Message

### Language and tone

- French. Keep technical terms, token paths and attribute names in English inside code spans.
- Audience: internal teams consuming the design system — lead with _what changed and why it matters_, not how it was implemented.
- Breaking changes get a `⚠️` prefix plus a migration one-liner (old path → new path).
- One change per line, markdown list dashes for each lines.

### Template

```
Bonjour à tous, une nouvelle release est disponible :

🪙 Tokens vX.Y.Z

- <change line 1>
- ⚠️ <breaking change + migration (old → new)>

→ Disponible via `@infomaniak-design-system/tokens@X.Y.Z`
→ [Changelog](https://github.com/Infomaniak/design-system/blob/main/packages/tokens/CHANGELOG.md)

Bonus :
- <one line per doc / Storybook / iOS tooling update>

Merci à tous pour vos contributions
```

Repeat the package block for each released package, in the section-mapping table order; use a single `Bonus :` footer before the closing line.

### Section mapping (canonical)

| Section         | Emoji | Package / source                               | Version from               | "→" lines                                     |
| --------------- | ----- | ---------------------------------------------- | -------------------------- | --------------------------------------------- |
| Tokens          | 🪙    | `@infomaniak-design-system/tokens`             | `package.json`             | `Disponible via` + Changelog                  |
| Composants      | 🛠     | `@infomaniak-design-system/components`         | `package.json`             | `Disponible via` + Changelog                  |
| Infomaniak Sans | ✍️    | `@infomaniak-design-system/fonts`              | `package.json`             | Changelog only (font served via CDN, not npm) |
| Icônes          | 🎨    | `packages/assets/images/svg` (icon gallery)    | `esds.json` `info.version` | gallery link only (no npm line)               |
| Figma plugins   | 🔌    | `@infomaniak-design-system/figma-plugin-icons` | `package.json`             | guide link + Changelog                        |

- Only include sections for packages that actually released in the covered PRs.
- Changelog URLs follow `https://github.com/Infomaniak/design-system/blob/main/packages/<path>/CHANGELOG.md`.
- Icons gallery: `https://infomaniak.github.io/design-system/storybook/main/?path=/docs/icons-icon-gallery--docs&collection=esds`
- Figma plugins guide: `https://infomaniak.github.io/design-system/storybook/main/?path=/docs/designers-guide-figma-plugins--docs`

## 5. Deliver

- Output the final message as copy-paste text.
- List any facts you could not verify from the diffs (versions, links, renamed pages) so the user can double-check before posting.
