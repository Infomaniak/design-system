- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=1473-1429&t=ZWopR2KZ2XXD2MTX-0)

## Usage

Import and register the custom attribute `esds-button`:

```ts
import { EsdsButtonAttr } from '@infomaniak-design-system/components';

EsdsButtonAttr.define();
```

```html
<button esds-button>Button</button>
```

```html
<a
  esds-button
  href="#"
>
  Link Button
</a>
```

## Description

Adding the custom attribute `esds-button` to a `<button>` or `<a>` element, applies the `esds-button` styles to this element.

## Demo
