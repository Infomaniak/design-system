# Components/Headless Button

> Import and register the custom attribute `esds-headless-button`:

## Usage

Import and register the custom attribute `esds-headless-button`:

```ts
import { EsdsHeadlessButtonAttr } from '@infomaniak-design-system/components';

EsdsHeadlessButtonAttr.define();
```

```html
<button esds-headless-button>Button</button>
```

```html
<a
  esds-headless-button
  href="#"
  >Anchor acting as a button</a
>
```

## Description

Adding the custom attribute `esds-headless-button` to a `<button>` or `<a>` element gives it the
design-system button **behavior** with zero styling: the element keeps its native look.

The attribute:

- turns an `<a>` into a button semantically (`role="button"`) and makes Space trigger `click()`;
- makes the press inert while `disabled` or `loading` (no hover/focus side effects while pressed);
- mirrors `disabled`/`loading` to `aria-disabled`/`aria-busy` on anchors, saves/restores the
  `tabindex`, and mirrors the text content to `aria-label` while loading.

It injects **zero** CSS: no reset, no focus-ring styling, no look.

> [!WARNING]
> An element must carry at most **one** behavior-bearing attribute. `<a esds-button
esds-headless-button>` would run the button behavior twice (e.g. one Space press calling
> `click()` twice).

### Building clickable components

Behavior flows from `esds-headless-button`; look layers extend it and never extend another
look-carrying attribute:

1. **Bundled variant attributes** — `esds-button`, `esds-avatar-button` (future: `esds-badge-button`):
   a first-class, recurring, design-approved clickable variant extends `EsdsHeadlessButtonAttr`
   directly and owns its styling.
2. **Element choice + optional stacking** — for context-dependent interactivity (a chip, a tag, a
   link-look button), the look attribute stays element-agnostic and interactivity is expressed by the
   element itself: `<span esds-chip>` static, `<button esds-chip>` clickable, `<a esds-chip href>`
   link. Stack `esds-headless-button` only when the element needs the design-system state contract
   (`loading`, inert press, anchor keyboard): `<button esds-chip esds-headless-button>`.

## Demo

## API

### Attributes

| Name | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| disabled | — | — | No | Disables the button |
| loading | — | — | No | Displays a loading state on the button |

## Examples

### Native Button

```html
<button
      esds-headless-button
    >
      Native-looking button
    </button>
```

### Anchor As Button

```html
<a
      esds-headless-button
      href="https://infomaniak.com"
    >
      Anchor acting as a button
    </a>
```

### Same Contract No Look

```html
<button
        esds-button
      >
        Same contract, no look
      </button>
      <button
        esds-headless-button
      >
        Same contract, no look
      </button>
```
