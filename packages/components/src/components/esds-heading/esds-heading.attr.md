## Usage

Import and register the custom attribute `esds-heading`:

```ts
import { EsdsHeadingAttr } from '@infomaniak-design-system/components';

EsdsHeadingAttr.define();
```

```html
<h3 esds-heading="md">Heading</h3>
```

## Description

A custom attribute for styling headings (h1..h6) while preserving native semantics.

Use the `<strong>` element to emphasize text within a heading text element, or use the `emphasized` attribute on the `esds-heading` attribute to apply emphasized styles to the text.

## Demo
