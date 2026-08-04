[![npm (scoped)](https://img.shields.io/npm/v/@infomaniak-design-system/components.svg)](https://www.npmjs.com/package/@infomaniak-design-system/components)
![npm](https://img.shields.io/npm/dm/@infomaniak-design-system/components.svg)
![NPM](https://img.shields.io/npm/l/@infomaniak-design-system/components.svg)
![npm type definitions](https://img.shields.io/npm/types/@infomaniak-design-system/components.svg)

# Infomaniak's Design System - Components

Web components built with Lit, documented via Storybook using Custom Elements Manifest (CEM).

- [Documentation ↗](https://infomaniak.github.io/design-system/storybook/main/?path=/docs/components-getting-started--docs)

## Getting Started

### Installation

```bash
npm install @infomaniak-design-system/components
```

### Usage

Import a component and call `.define()` in your entry file before rendering:

```ts
import { EsdsIconComponent } from '@infomaniak-design-system/components';

EsdsIconComponent.define();
```

Use it in HTML or JSX:

```html
<esds-icon name="esds:headset"></esds-icon>
```

> Each component may have an additional configuration. See the component's Storybook docs for specifics.

### Framework Support

Components are standard Web Components (custom elements) and work in any framework — React, Vue, Angular, or vanilla JS. No additional adapters are required.

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
src/components/my-component/
├── my-component.component.ts         # Lit component + JSDoc + signals
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

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `yarn generate`    | Generate a new component folder and files        |
| `yarn analyze:cem` | Generate `custom-elements.json` from source code |
| `yarn build`       | Full build: CEM + Vite + TypeScript declarations |
| `yarn dev:docs`    | Start Storybook dev server                       |
| `yarn test:e2e`    | Run Playwright E2E tests (`*.component.e2e.ts`)  |
| `yarn test:vrt`    | Run Playwright visual regression tests           |

## CEM config

See `custom-elements-manifest.config.mjs` for analyzer settings. The `type-parser` plugin is enabled so union types show as select controls in Storybook.
