[![npm (scoped)](https://img.shields.io/npm/v/@infomaniak-design-system/components.svg)](https://www.npmjs.com/package/@infomaniak-design-system/components)
![npm](https://img.shields.io/npm/dm/@infomaniak-design-system/components.svg)
![NPM](https://img.shields.io/npm/l/@infomaniak-design-system/components.svg)
![npm type definitions](https://img.shields.io/npm/types/@infomaniak-design-system/components.svg)

# Infomaniak's Design System - Components

Web components built with Lit, documented via Storybook using Custom Elements Manifest (CEM).

- [Documentation ↗](https://infomaniak.github.io/design-system/storybook/main/?path=/docs/components-getting-started--docs)
- [CONTRIBUTING](./CONTRIBUTING.md)

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
