# Infomaniak's Design System - Components - Contributing

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

# to create a new component
yarn generate component

# OR for a custom attribute
yarn generate attr

# and give your component/attr a name using kebab-case such as `esds-my-component`
```

### Export from the package

Export your component by adding it to `public-api.ts`:

```bash
yarn generate public-api
```

> [!NOTE]
> this runs automatically on build.

### Guidelines

#### Component architecture

```
src/components/my-component/
├── my-component.component.ts         # Lit component + JSDoc + signals
├── my-component.component.css        # CSS style
├── my-component.component.test.ts    # Tests
└── my-component.component.stories.ts # Storybook story
```

#### Custom attribute architecture

```
src/components/my-attr/
├── my-attr.attr.ts         # Custom Attribute + JSDoc
├── my-attr.attr.md         # Documentation
├── my-attr.attr.css        # CSS style
├── my-attr.attr.test.ts    # Tests
└── my-attr.attr.stories.ts # Storybook story
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

#### CSS / Sass

> [!WARNING]
> CSS must be preferred over Sass: it garanties standard support and is easier to maintain in the long term.
> Sass is only used when it provides a feature not available in CSS but planned for the future.

## Visual Regression Tests

Components are automatically checked for visual regressions on every PR. The suite screenshots each tagged story on the PR's deployed Storybook and diffs it against the `develop` branch baseline.

### Tagging a story

Add the `vr-test` tag to a story's `tags` array to include it in visual regression:

```ts
const meta = {
  title: 'Components/MyComponent',
  tags: ['autodocs', 'vr-test'],
} satisfies Meta;
```

Stories not present on `develop` (new components) are automatically skipped. The job is advisory (non-blocking).

### Running locally

```bash
yarn dev:docs   # start Storybook on :6006
yarn test:vrt   # run visual regression tests (localhost vs develop)
```

> [!NOTE]
> use `VR_STORYBOOK_URL=http://localhost:XXXX yarn test:vrt` if Storybook does not run on `:6006`

## Useful scripts

| Command            | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `yarn generate`    | Generate a new component or custom attribute folder and files |
| `yarn analyze:cem` | Generate `custom-elements.json` from source code              |
| `yarn build`       | Full build: CEM + Vite + TypeScript declarations              |
| `yarn dev:docs`    | Start Storybook dev server                                    |
| `yarn test:e2e`    | Run Playwright E2E tests (`*.component.e2e.ts`)               |
| `yarn test:vrt`    | Run Playwright visual regression tests                        |

## CEM config

See `custom-elements-manifest.config.mjs` for analyzer settings. The `type-parser` plugin is enabled so union types show as select controls in Storybook.
