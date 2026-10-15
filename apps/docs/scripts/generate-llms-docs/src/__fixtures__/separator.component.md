- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2114-296&p=f)

## Setup

Import and register the separator component in your application's entry file (e.g., `main.ts` or `index.ts`):

```ts
import { EsdsSeparatorComponent } from '@infomaniak-design-system/components';

EsdsSeparatorComponent.define();
```

> **Important:** `define()` must be called before any component renders `<esds-separator>`.

## Usage

```html
<esds-separator></esds-separator>
```

## Description

The separator divides content horizontally or vertically. Unlike the native `<hr>` element, it supports vertical orientation.
