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
@import '@infomaniak-design-system/tokens/css/modifiers/button-types/all.attr.css';
```

Or individually:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/button-types/[type].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/button-types/primary.attr.css'; */
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
@import '@infomaniak-design-system/tokens/css/modifiers/button-sizes/all.attr.css';
```

Or individually:

```css
@import '@infomaniak-design-system/tokens/css/modifiers/button-sizes/[size].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/button-sizes/small.attr.css'; */
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

## Description

Adding the custom attribute `esds-button` to a `<button>` or `<a>` element, applies the `esds-button` styles to this element.

## Demo
