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

### Decorative

Removes the separator from the accessibility tree:

```html
<esds-separator decorative></esds-separator>
```

## Description

The separator divides content horizontally or vertically. Unlike the native `<hr>` element, it supports vertical orientation.

### Semantics

- The component sets `role="separator"` unless a `role` is already present, and reflects the orientation with `aria-orientation` (any value other than `vertical` is treated as `horizontal`).
- With the `decorative` attribute, `aria-hidden="true"` removes the separator from the accessibility tree, independently of the role.
- The component does not support slotted content: any children are ignored. For a labeled divider, compose the separator with text in your layout instead.
- For thematic breaks in prose content, prefer the native `<hr>` element; this component is intended for interface layouts (menus, toolbars, forms, card sections...).

Its appearance is driven by the design tokens; changes to the look belong to the token layer, not to component consumers.

## Demo
