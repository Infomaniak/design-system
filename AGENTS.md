# AGENTS.md — Infomaniak Design System

> **Context brain for AI agents working in this codebase.**

---

## 1. Project Summary

Infomaniak's Design System featuring design tokens based on DTCG standards and comprehensive documentation via Storybook.

**High-Level Tech Stack:**

- **Language:** TypeScript v5 (ESNext, NodeNext modules)
- **Package Manager:** Yarn v4 (workspaces enabled)
- **Build Tools:** Vite (Rolldown fork), Node.js scripts
- **Testing:** Vitest v4 with Istanbul coverage, Playwright for visual regression and E2E tests
- **Documentation:** Storybook v10
- **UI Framework:** React v19
- **Styling:** Tailwind CSS v4
- **Node Version:** v24 (use `nvm use`)

---

## 2. Context Map

```
design-system/
├── apps/
│   └── docs/                    # Storybook documentation app
│       ├── src/
│       │   ├── main.tsx         # App entry point
│       │   ├── stories/         # Storybook stories + token docs
│       │   │   └── tokens/      # Markdown token documentation
│       │   └── assets/          # Static assets
│       ├── .storybook/          # Storybook configuration
│       └── dist/                # Built docs output
├── packages/
│   ├── tokens/                  # Design tokens library (DTCG format)
│   │   ├── tokens/              # Token definitions (t1-primitive, t2-semantic, t3-component)
│   │   ├── scripts/             # Token build/validation scripts
│   │   ├── demo/                # Live demo app for tokens
│   │   └── dist/                # Output: CSS, JSON, Markdown
│   └── components/              # Web components library
│       ├── src/                 # Component source + stories
│       └── tests/visual-regression/      # Playwright visual regression suite
│           ├── visual-regression.spec.ts # Orchestrator (loops manifest, diffs per story)
│           └── helpers.ts                # URL builder, manifest fetcher, story filter
├── scripts/
│   ├── ci/                      # CI/CD automation scripts
│   │   ├── storybook-pr/        # PR Storybook build decision + comment
│   │   ├── storybook-pages/     # Storybook pages deploy context + normalization
│   │   ├── visual-regression/   # Visual regression PR comment automation
│   │   ├── publish/             # Branch-based npm publish orchestrator
│   │   └── on-figma-event/      # Figma webhook handlers
│   └── helpers/                 # Shared utility functions
├── docs/                        # Project documentation
│   ├── figma/                   # Figma integration docs
│   └── plans/                   # Implementation plans and execution docs
└── index.js                     # Root entry point
```

---

## 3. Local Norms

### Command Patterns

| Task                         | Command                                      |
| ---------------------------- | -------------------------------------------- |
| Install deps                 | `yarn install`                               |
| Dev server (docs)            | `cd apps/docs && yarn dev`                   |
| Dev server (Storybook)       | `cd apps/docs && yarn storybook`             |
| Build all packages           | `yarn build`                                 |
| Build tokens only            | `yarn build:tokens`                          |
| Validate tokens              | `cd packages/tokens && yarn validate:tokens` |
| Run tests                    | `yarn test`                                  |
| Test coverage                | `yarn test:coverage`                         |
| Visual regression tests      | `yarn test:vrt`                              |
| Format code                  | `yarn format`                                |
| PR validation                | `yarn ci:on-pull-request`                    |
| CI publish (manual)          | `GITHUB_REF_NAME=develop yarn ci:publish`    |
| CI visual regression comment | `yarn ci:visual-regression --mode=comment`   |
| Create changeset             | `yarn changeset`                             |
| Version + changelog (manual) | `yarn changeset:version`                    |

### Code Style

- **Formatter:** Prettier with single quotes, 100 char width
- **Imports:** Use `prettier-plugin-organize-imports' (auto-organized)
- **Naming conventions:**
  - Functions: `camelCase`
  - Types/Interfaces: `PascalCase`
  - Files: `kebab-case.ts`
  - Test files: `*.test.ts`
  - Token files: `*.tokens.json`
- **TypeScript:**
  - Strict mode enabled
  - No unused locals/parameters
  - `NodeNext` module resolution
  - Import with `.ts` extensions

### Testing

- **Framework:** Vitest v4.0.18
- **Coverage:** Istanbul provider, **100% threshold required**
- **Test location:** Co-located with source files (`*.test.ts`) or in `tests/` subdirs
- **Key files:** `vitest.config.ts` (root), excludes Storybook tests for now

### Workspace Structure

- Monorepo with 3 workspaces:
  1. `@infomaniak-design-system/tokens`
  2. `@infomaniak-design-system/tokens/demo`
  3. `@infomaniak-design-system/docs`

### DTCG Token Structure

Tokens follow Design Tokens Community Group format (v3 tiers):

- **t1-primitive/**: Base values (colors, spacing, etc.)
- **t2-semantic/**: Contextual meanings (bg-primary)
- **t3-component/**: Component-specific tokens

### Component Documentation (CEM)

All web components in `packages/components` must be documented with JSDoc annotations consumed by `@custom-elements-manifest/analyzer`:

| Annotation                  | Usage                                               | Example                                            |
| --------------------------- | --------------------------------------------------- | -------------------------------------------------- |
| `@summary`                  | Short class-level description                       | `/** @summary Icon component */`                   |
| `@element`                  | (Optional) Tag name if not using `@customElement`   | `/** @element esds-icon */`                        |
| `@attr` / `@attribute`      | Document reflected attributes                       | On properties with `@property({ reflect: true })`  |
| `@default`                  | Default value when not obvious from the initializer | `/** @default 'svg' */`                            |
| `@internal`                 | Exclude member from public CEM                      | On private fields / methods                        |
| `@fires` / `@event`         | Custom events dispatched                            | `/** @fires loaded - Fired when icon renders */`   |
| `@slot`                     | Named/default slots usage                           | `/** @slot - Default slot */`                      |
| `@csspart`                  | Shadow DOM parts                                    | `/** @csspart icon - The icon element */`          |
| `@cssprop` / `@cssproperty` | CSS custom properties exposed                       | `/** @cssprop --icon-size - Controls icon size */` |

The CEM is auto-generated during `yarn build` and verified in CI via `git diff --exit-code`. Public consumers (IDEs, Storybook) only see non-`@internal` members.

### PR Requirements

- Branch naming: `feat/`, `fix/`, `docs/` prefixes
- Commits: Conventional Commits format
- Coverage: 100% code coverage required
- Formatting: Run `yarn format` before requesting review
- Do NOT squash commits on merge (preserve history)

### Learned Preferences

#### Storybook Conventions

- **Format:** Use CSF Next (Component Story Format Next) for all stories
  - CSF Next uses the `render` function in the default export (meta)
  - No named exports for stories - single story per file
  - Use `satisfies Meta` for type safety

  ```typescript
  import type { Meta } from '@storybook/react';

  export default {
    title: 'Path/To/Story',
    // ... config,
    render: () => {
      /* story render */
    },
  } satisfies Meta;
  ```

#### Visual Regression Tagging

Add `'vr-test'` to a story's `tags` array to include it in visual regression tests. The suite diffs the PR's deployed Storybook against `develop`. Stories not present on `develop` are skipped (new components). The job is advisory (non-blocking).

```typescript
const meta = {
  tags: ['autodocs', 'vr-test'],
} satisfies Meta;
```

#### Changesets

- **Purpose:** Collect structured change descriptions, automate version bumps, and generate `CHANGELOG.md` files. Changesets do **not** handle publishing — `ci:publish` remains the publish mechanism.
- **Config:** `.changeset/config.json` with `baseBranch: "develop"`, `access: "public"`, ignores non-publishable packages.
- **Creating a changeset:** Run `yarn changeset` on a feature branch, select affected package(s), choose bump type (patch/minor/major), write a description. Commit the generated `.changeset/*.md` file.
- **Versioning:** Automated via `.github/workflows/release-pr.yml`. A draft `develop → main` PR is created automatically when changes land on `develop`. Marking it as **Ready for review** triggers `yarn changeset:version` (bumps `package.json` versions, generates `CHANGELOG.md`, pushes to `develop`). The maintainer then merges the PR to `main` for production publish. Can also be run manually with `yarn changeset:version`.
- **Only publishable packages are versioned:** `@infomaniak-design-system/tokens` and `@infomaniak-design-system/components` (those with a `publish` script). PRs touching only docs/apps/scripts don't need a changeset.

---

## 4. Self-correction

> This section is for you, the future agent.

1. **Stale Map:** If you encounter a file or folder not listed in the "Context Map", update the map in this file.
2. **New Norms:** If the user corrects you (e.g., "Don't use X, use Y"), add that rule to the "Local norms" section immediately so you don't make the mistake again.
3. **Refinement:** If you find this file is too verbose, prune it. Keep it high-signal.
