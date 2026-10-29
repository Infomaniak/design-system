# Components/Button

> Import and register the custom attribute `esds-button`:

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
  Button link
</a>
```

## Description

Adding the custom attribute `esds-button` to a `<button>` or `<a>` element, applies the `esds-button` styles to this element.

### Styles

#### Types

List of all available button types:

- `primary` (default): for a primary button
- `primary-destructive`: for a destructive button
- `secondary`: for a secondary button
- `secondary-destructive`: for a secondary destructive button
- `ghost-primary`: for a ghost button
- `ghost-secondary`: for a ghost secondary button
- `ghost-destructive`: for a ghost destructive button

##### Import

To import all button types:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/button-type/all.attr.css';
```

Or individually:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/button-type/[type].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/button-type/primary.attr.css'; */
```

##### Apply

Add the attribute `data-esds-button-type="[type]"` to apply a button type:

```html
<button
  esds-button
  data-esds-button-type="primary"
>
  Button
</button>
```

#### Sizes

List of all available button sizes:

- `small`: for a small button
- `medium` (default): for a medium button
- `large`: for a large button

##### Import

To import all button sizes:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/button-size/all.attr.css';
```

Or individually:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/button-size/[size].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/button-size/small.attr.css'; */
```

##### Apply

Add the attribute `data-esds-button-size="[size]"` to apply a button size:

```html
<button
  esds-button
  data-esds-button-size="medium"
>
  Button
</button>
```

Both `data-esds-button-type` and `data-esds-button-size` can be combined:

```html
<button
  esds-button
  data-esds-button-type="primary"
  data-esds-button-size="medium"
>
  Button
</button>
```

## Demo

## API

### Attributes

| Name | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| disabled | — | — | No | Disables the button |
| loading | — | — | No | Displays a loading state on the button |

## Examples

### Button

```html
<esds-button content="Text content" buttonType="primary" size="medium"></esds-button>
```

### Link

```html
<esds-button content="Link content" href="https://infomaniak.com"></esds-button>
```

### Text Only

```html
<esds-button content="Text content"></esds-button>
```

### Types

```html
<esds-button></esds-button>
```

### Sizes

```html
<esds-button></esds-button>
```
