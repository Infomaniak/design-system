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
<h1
      esds-heading="md"
    >
      This is a heading example
    </h1>
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
<h1
      esds-heading="2xl"
    >
      This is a heading example
    </h1>
    <h2
      esds-heading="xl"
    >
      This is a heading example
    </h2>
    <h3
      esds-heading="lg"
    >
      This is a heading example
    </h3>
    <h4
      esds-heading="md"
    >
      This is a heading example
    </h4>
    <h5
      esds-heading="sm"
    >
      This is a heading example
    </h5>
    <h6
      esds-heading="xs"
    >
      This is a heading example
    </h6>
```
