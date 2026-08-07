- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=1473-1429&t=ZWopR2KZ2XXD2MTX-0)

## Usage

Import and register the custom attribute `esds-text-link`:

```ts
import { EsdsTextLinkAttr } from '@infomaniak-design-system/components';

EsdsTextLinkAttr.define();
```

```html
<a
  esds-text-link
  href="https://example.com"
>
  Link text
</a>
```

> [!WARNING]
> It is expected that the `<a esds-text-link>` element is used as a **child** of a _text container_ like a `<p>`, `<li>`, `<td>` element.
> It is not intended to be used as a standalone/isolated element like a button.

```html
<p>
  You have no products.
  <a
    esds-text-link
    href="https://shop.example.com"
    >Go to the shop</a
  >
  and order some.
</p>
```

## Description

Adding the custom attribute `esds-text-link` to an `<a>` element, applies the `esds-text-link` styles to this element.

> [!NOTE]
> The `<a>` element may be used as any other `<a>` element.

## Demo
