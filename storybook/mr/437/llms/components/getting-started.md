# Components/Getting Started

> Reusable web components built for Infomaniak products. Each component is framework-agnostic and can be used in any pr...

<div className="welcome-section">
  <h1>Components</h1>
  <p className="welcome-description">
    Reusable web components built for Infomaniak products. Each component is framework-agnostic and
    can be used in any project that supports custom elements.
  </p>
</div>

## Installation

```bash
npm install @infomaniak-design-system/components
```

## Quick Start

Import and register the components you need. **Call `define()` in your application's entry file** (e.g., `main.ts`) so custom elements are defined before we try to render them:

```ts
import { EsdsIconComponent } from '@infomaniak-design-system/components';

EsdsIconComponent.define();
```

Use it in your HTML or JSX:

```html
<esds-icon name="esds:headset"></esds-icon>
```

> Each component may have additional configuration. See the component's documentation for specifics.

## Framework Support

Components are built as standard Web Components and work in any framework (React, Vue, Angular, vanilla JS, etc.). No additional adapters are required.

### React

Import the components you need from `@infomaniak-design-system/components`, and they are ready to use, with autocompletion.

### Angular

Add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` to any Angular module or component that uses the Design System components:

```ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  // ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

## IDE Support

> ℹ️ IDE support is only needed if your framework does not already provide autocompletion.

The integration files are shipped in the package. Custom attributes (e.g. `esds-button` on a native `<a>` or `<button>`) are autocompleted on any element.

### JetBrains

JetBrains IDEs detect the components automatically through the `web-types` field of the package — no configuration is needed.

### VS Code

If you don't have one already, create a `.vscode/settings.json` file at the root of your project.

Then add or append the following configuration:

```json
{
  "html.customData": [
    "./node_modules/@infomaniak-design-system/components/vscode.html-custom-data.json"
  ],
  "css.customData": [
    "./node_modules/@infomaniak-design-system/components/vscode.css-custom-data.json"
  ]
}
```
