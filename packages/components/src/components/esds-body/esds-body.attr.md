## Usage

Import and register the custom attribute `esds-body`:

```ts
import { EsdsBodyAttr } from '@infomaniak-design-system/components';

EsdsBodyAttr.define();
```

```html
<p esds-body="md">Body</p>
```

## Description

A custom attribute for applying body text styles to elements while preserving native semantics.

Use the `<strong>` element to emphasize text within a body text element, or use the `emphasized` attribute on the `esds-body` attribute to apply emphasized styles to the text.

## Demo
