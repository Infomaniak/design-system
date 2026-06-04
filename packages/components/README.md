# @infomaniak-design-system/components

Web components built with Lit, documented via Storybook using Custom Elements Manifest (CEM).

## Architecture

- **Custom Elements Manifest (CEM)** — generated from JSDoc annotations on component classes
- **Storybook** — reads `custom-elements.json` to auto-generate controls and docs
- **`@wc-toolkit/storybook-helpers`** — provides `getStorybookHelpers(tagName)` for zero-boilerplate stories

## Adding a new component

### 1. Create component files

```
src/my-component/
├── my-component.component.ts         # Lit component + JSDoc
├── my-component.component.test.ts.   # Tests
├── my-component.component.stories.ts # Storybook story
└── index.ts                          # Public API (re-exports)
```

### 2. Write the Lit component with JSDoc

JSDoc drives the CEM, which drives the Storybook controls:

```typescript
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Short summary for the component gallery.
 * @summary My new component
 * @element my-component
 */
@customElement('my-component')
export class MyComponent extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  /**
   * Human-readable label shown to the user.
   * @attr label
   */
  @property({ type: String })
  accessor label: string = '';

  /**
   * Whether the component is disabled.
   * @attr disabled
   * @reflect
   */
  @property({ type: Boolean, reflect: true })
  accessor disabled: boolean = false;

  override render() {
    return html`<span>${this.label}</span>`;
  }
}
```

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

### 3. Create the story

Import `getStorybookHelpers` and let the CEM generate controls automatically:

```typescript
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import './my-component.component.js';
import { MyComponent } from './my-component.component.js';

const { args, argTypes, template } = getStorybookHelpers<MyComponent>('my-component');

const meta = {
  title: 'Components/My Component',
  component: 'my-component',
  tags: ['autodocs'],
  args,
  argTypes,
  render: (storyArgs) => template(storyArgs),
} satisfies Meta<MyComponent>;

export default meta;
type Story = StoryObj<MyComponent>;

// Default story — uses CEM defaults
export const Default: Story = {
  args: {
    label: 'Hello World',
  },
};

// Override specific args for extra stories
export const Disabled: Story = {
  args: { disabled: true },
};
```

No manual `argTypes` needed — controls are inferred from the CEM.

### 4. Export from the package

In `src/public-api.ts`:

```typescript
export { MyComponent } from './my-component/my-component.component.js';
```

### 5. Verify

```bash
# Generate CEM
cd packages/components
yarn analyze:cem

# Test in Storybook
cd ../../apps/docs
yarn dev
```

## How it works

1. `yarn analyze:cem` parses JSDoc annotations into `custom-elements.json`
2. The Storybook preview (`apps/docs/.storybook/preview.tsx`) loads the CEM once via `setCustomElementsManifest()`
3. `getStorybookHelpers(tagName)` reads the CEM at runtime to produce:
   - `args` — default values from component property initializers
   - `argTypes` — control types (text, boolean, select, etc.)
   - `template` — renders the element with bound attributes
4. JSDoc descriptions appear in the Storybook Docs tab

## Useful scripts

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `yarn analyze:cem` | Generate `custom-elements.json` from source code |
| `yarn build`       | Full build: CEM + Vite + TypeScript declarations |
| `yarn dev`         | Start Storybook dev server                       |

## CEM config

See `custom-elements-manifest.config.mjs` for analyzer settings. The `type-parser` plugin is enabled so union types show as select controls in Storybook.
