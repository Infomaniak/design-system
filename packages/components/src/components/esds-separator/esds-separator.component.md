## Setup

Import and register the separator component in your application's entry file (e.g., `main.ts` or `index.ts`):

```ts
import { EsdsSeparatorComponent } from '@infomaniak-design-system/components';

EsdsSeparatorComponent.define();
```

> **Important:** `define()` must be called before any component renders `<esds-separator>`.

## Usage

### Horizontal

The separator is full-width (`width: 100%`); avoid `margin-inline` on it, as it would cause a horizontal overflow.

```html
<esds-separator></esds-separator>
```

### Vertical

In a flex or grid container, the vertical separator stretches to fill the available space:

```html
<div style="display: flex; align-items: center; gap: 1rem; height: 3rem">
  <span>Left</span>
  <esds-separator orientation="vertical"></esds-separator>
  <span>Right</span>
</div>
```

> **Note:** outside a flex/grid container, set an explicit height on the element (e.g. `style="height: 3rem"`), otherwise it collapses.

### With content

Use the default slot to display a label (or any content) between the two lines:

```html
<esds-separator>OR</esds-separator>
```

### Decorative

Removes the separator from the accessibility tree:

```html
<esds-separator decorative></esds-separator>
```

## Description

The separator divides content horizontally or vertically. Unlike the native `<hr>` element, it supports vertical orientation and can display content between its two lines.

### Semantics

- The component has `role="separator"` and exposes `aria-orientation` matching the `orientation` attribute.
- Slotted content is visual-only: `role="separator"` hides its children from assistive technology. Set `aria-label` explicitly on the element if a name is needed.
- With the `decorative` attribute, it switches to `role="presentation"` and is removed from the accessibility tree.
- For thematic breaks in prose content, prefer the native `<hr>` element; this component is intended for interface layouts (menus, toolbars, forms, card sections...).

Its appearance is driven by the design tokens; changes to the look belong to the token layer, not to component consumers.

## Demo
