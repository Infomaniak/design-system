# Components/Body

> Import and register the custom attribute `esds-body`:

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

## API

### CSS Custom Properties

| Name | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| --esds-body-margin-block | — | — | No | The "block" margin to apply to the element (default: 0, only available for p). |
| --esds-body-margin-inline | — | — | No | The "inline" margin to apply to the element (default: 0, only available for p). |

## Examples

### Default

```html
<esds-body text="This is a body example" size="md"></esds-body>
```

### With Strong Content

```html
<p
      esds-body="md"
    >
      This is a body example <strong>with strong content</strong>
    </p>
```

### All Sizes

```html
<esds-body text="This is a body example"></esds-body>
```
