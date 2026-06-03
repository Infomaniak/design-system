# @infomaniak-design-system/components

Web components built with Lit, documented via Storybook using Custom Elements Manifest (CEM).

## Architecture

### Overview

- **Custom Elements Manifest (CEM)** — generated from JSDoc annotations on component classes
- **Storybook** — reads `custom-elements.json` to auto-generate controls and docs
- **`@wc-toolkit/storybook-helpers`** — provides `getStorybookHelpers(tagName)` for zero-boilerplate stories

### Storybook Integration

1. `yarn analyze:cem` parses JSDoc annotations into `custom-elements.json`
2. The Storybook preview (`apps/docs/.storybook/preview.tsx`) loads the CEM once via `setCustomElementsManifest()`
3. `getStorybookHelpers(tagName)` reads the CEM at runtime to produce:
   - `args` — default values from component property initializers
   - `argTypes` — control types (text, boolean, select, etc.)
   - `template` — renders the element with bound attributes
4. JSDoc descriptions appear in the Storybook Docs tab

## Adding a new component

### Code generator

Simply use our code generator to create a new component following our guidelines:

```bash
cd packages/components
yarn generate component
# and give your component a name using kebab-case such as `esds-my-component`
```

### Export from the package

Export your component by adding it to `public-api.ts`:

```bash
yarn generate public-api
```

Note: this runs automatically on build.

### Guidelines

#### Component architecture

```
src/my-component/
├── my-component.component.ts         # Lit component + JSDoc
├── my-component.component.css        # CSS style
├── my-component.component.test.ts    # Tests
└── my-component.component.stories.ts # Storybook story
```

#### JSDoc

JSDoc drives the CEM, which drives the Storybook controls.
Key JSDoc tags for CEM:

- `@summary` — Short description
- `@element` — Tag name (or use `@customElement` decorator)
- `@attr` / `@attribute` — Document reflected attributes
- `@default` — Default value when not obvious from initializer
- `@internal` — Exclude from public CEM
- `@fires` / `@event` — Custom events
- `@slot` — Named/default slots
- `@csspart` — Shadow DOM parts
- `@cssprop` / `@cssproperty` — CSS custom properties

#### Internal helpers

Internal utilities and test-only helpers must be placed in `*.private.ts` files.
These files are automatically excluded from the generated `public-api.ts` by the `yarn generate public-api` command.

## Useful scripts

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `yarn generate`    | Generate a new component folder and files        |
| `yarn analyze:cem` | Generate `custom-elements.json` from source code |
| `yarn build`       | Full build: CEM + Vite + TypeScript declarations |
| `yarn dev:docs`    | Start Storybook dev server                       |

## CEM config

See `custom-elements-manifest.config.mjs` for analyzer settings. The `type-parser` plugin is enabled so union types show as select controls in Storybook.
