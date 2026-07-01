# Deprecated

This package is deprecated. Use `@infomaniak-design-system/components` instead.

## Migration

The `esds-icon` web component has been moved to the `@infomaniak-design-system/components` package.

### Install

```bash
npm install @infomaniak-design-system/components
```

### Usage

Import and define the component:

```ts
import { EsdsIconComponent, ICONIFY_API, InjectionContext, IconifyApi } from '@infomaniak-design-system/components';

EsdsIconComponent.define();

InjectionContext.root = new InjectionContext([
  ICONIFY_API.define(
    new IconifyApi({
      resources: ['https://iconify.preprod.dev.infomaniak.ch'],
    }),
  ),
]);

Then use it in your HTML:

```html
<esds-icon name="esds:headset"></esds-icon>
```
