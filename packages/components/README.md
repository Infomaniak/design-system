# @infomaniak-design-system/components

Web components library for Infomaniak's Design System. Built with [Lit](https://lit.dev) and published as standard ES modules with full TypeScript support.

## Installation

```bash
yarn add @infomaniak-design-system/components
```

Requires a peer-like dependency on `lit` for the consuming project:

```bash
yarn add lit
```

## Quick Start

Import all components at once:

```typescript
import '@infomaniak-design-system/components';
```

Import a specific component — it auto-registers and gives you class access:

```typescript
import { EsdsIconComponent } from '@infomaniak-design-system/components/esds-icon';
```

## Usage with Frameworks

### React 19+

Import once in your app entry point to auto-register the component:

```tsx
// main.tsx
import '@infomaniak-design-system/components';
```

Use in your JSX templates:

```tsx
function App() {
  return (
    <div>
      <esds-icon
        name="esds:bell"
        mode="svg"
        inline="true"
      />
    </div>
  );
}
```

React 19 has web components support, attributes pass through naturally.

### Angular 20+

Import in your component or module to auto-register the component:

```typescript
// app.component.ts
import { Component } from '@angular/core';
import '@infomaniak-design-system/components';

@Component({
  selector: 'app-root',
  template: `
    <esds-icon
      [attr.name]="iconName"
      mode="svg"
      inline
    ></esds-icon>
  `,
})
export class AppComponent {
  iconName = 'esds:bell';
}
```

Angular handles custom elements as standard HTML. Use `[attr.name]` for dynamic attributes.

For full component documentation, see the Storybook docs.
