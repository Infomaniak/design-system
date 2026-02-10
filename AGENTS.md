# AGENTS.md — Infomaniak Design System

> **Context brain for AI agents working in this codebase.**

---

## 1. Project Summary

Infomaniak's Design System featuring design tokens based on DTCG standards and comprehensive documentation via Storybook.

**High-Level Tech Stack:**

- **Language:** TypeScript v5.9.3 (ESNext, NodeNext modules)
- **Package Manager:** Yarn v4.12.0 (workspaces enabled)
- **Build Tools:** Vite (Rolldown fork), Node.js scripts
- **Testing:** Vitest v4.0.18 with Istanbul coverage
- **Documentation:** Storybook v10.2.3
- **UI Framework:** React v19.2.0
- **Styling:** Tailwind CSS v4.1.18
- **Node Version:** v24 (use `nvm use`)

---

## 2. Context Map

```
/Users/victor/dev/github/design-system/
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
│   └── tokens/                  # Design tokens library (DTCG format)
│       ├── tokens/              # Token definitions (t1-primitive, t2-semantic, t3-component)
│       ├── scripts/             # Token build/validation scripts
│       ├── demo/                # Live demo app for tokens
│       └── dist/                # Output: CSS, JSON, Markdown
├── scripts/
│   ├── scripts/                 # CI/CD automation scripts
│   │   ├── on-pull-request/     # PR validation
│   │   └── on-tag/              # Release automation
│   └── helpers/                 # Shared utility functions
├── docs/                        # Project documentation
│   └── figma/                   # Figma integration docs
└── index.js                     # Root entry point
```

---

## 3. Local Norms

### Command Patterns

| Task                   | Command                                      |
| ---------------------- | -------------------------------------------- |
| Install deps           | `yarn install`                               |
| Dev server (docs)      | `cd apps/docs && yarn dev`                   |
| Dev server (Storybook) | `cd apps/docs && yarn storybook`             |
| Build all packages     | `yarn build`                                 |
| Build tokens only      | `yarn build:tokens`                          |
| Validate tokens        | `cd packages/tokens && yarn validate:tokens` |
| Run tests              | `yarn test`                                  |
| Test coverage          | `yarn test:coverage`                         |
| Format code            | `yarn format`                                |
| PR validation          | `yarn ci:on-pull-request`                    |

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

### PR Requirements

- Branch naming: `feat/`, `fix/`, `docs/` prefixes
- Commits: Conventional Commits format
- Coverage: 100% code coverage required
- Formatting: Run `yarn format` before requesting review
- Do NOT squash commits on merge (preserve history)

### Learned Preferences

_(No preferences accumulated yet — this section updates as you work)_

---

## 4. Self-correction

> This section is for you, the future agent.

1. **Stale Map:** If you encounter a file or folder not listed in the "Context Map", update the map in this file.
2. **New Norms:** If the user corrects you (e.g., "Don't use X, use Y"), add that rule to the "Local norms" section immediately so you don't make the mistake again.
3. **Refinement:** If you find this file is too verbose, prune it. Keep it high-signal.
