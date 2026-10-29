# Components/Heading

> Import and register the custom attribute `esds-heading`:

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

## API

### CSS Custom Properties

| Name | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| --esds-heading-margin-block | — | — | No | The "block" margin to apply to the element (default: 0, only available for h1..h6). |
| --esds-heading-margin-inline | — | — | No | The "inline" margin to apply to the element (default: 0, only available for h1..h6). |

## Examples

### Default

```html
<esds-heading text="This is a heading example" size="md"></esds-heading>
```

### With Strong Content

```html
<h1
      esds-heading="md"
    >
      This is a heading example <strong>with strong content</strong>
    </h1>
```

### All Sizes

```html
<esds-heading text="This is a heading example"></esds-heading>
```
