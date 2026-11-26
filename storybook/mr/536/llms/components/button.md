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

## Accessibility

The custom attribute never modifies the accessible name: an author-defined `aria-label` is always preserved.

### Icon-only buttons

An icon-only button (e.g. a `square` button with only an `esds-icon` inside) has no discernible text: `esds-icon` renders a decorative SVG that contributes no accessible name. Give it one, in order of preference:

1. **Visible text content** — the best option, but not applicable to truly icon-only buttons.
2. **Visually-hidden text** inside the button (see [MDN: icon buttons](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role#icon_buttons)) — the name lives next to the icon and survives machine translation.
3. **An author-defined `aria-label`** on the button — pragmatic and fully supported by assistive technologies.

While `loading`, an `<a>` element gets the `aria-disabled` and `aria-busy` attributes, and the spinner is a CSS pseudo-element that is not exposed to assistive technologies.

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
<button
      esds-button
      data-esds-button-type="primary"
      data-esds-button-size="medium"
    >
      <esds-icon name="esds:plus"></esds-icon>
      Text content
      <kbd esds-kbd="">⌘</kbd>
    </button>
```

### Link

```html
<a
      esds-button
      href="https://infomaniak.com"
      target="_blank"
    >
      <esds-icon name="esds:plus"></esds-icon>
      Link content
    </a>
```

### Text Only

```html
<button
      esds-button
    >
      Text content
    </button>
```

### Types

```html
<button esds-button></button>
```

### Sizes

```html
<button esds-button></button>
```

### Author Aria Label

```html
<div class="buttons-container">
      <a
        esds-button
        href="#"
        aria-label="open link"
      >
        <esds-icon name="esds:plus"></esds-icon>
        open
      </a>
      <button
        esds-button
        aria-label="open button"
      >
        <esds-icon name="esds:plus"></esds-icon>
        open
      </button>
    </div>
```
