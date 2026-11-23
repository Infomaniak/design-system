- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2181-799&t=ujLMjTQvGkMfXRoU-0)

## Usage

Import and register the custom attribute `esds-kbd`:

```ts
import { EsdsKbdAttr } from '@infomaniak-design-system/components';

EsdsKbdAttr.define();
```

```html
<kbd esds-kbd>K</kbd>
```

### Inline in text

A keyboard key reads naturally inline within a sentence:

```html
<p>
  Press
  <kbd esds-kbd>K</kbd>
  to open the search.
</p>
```

### Multi-key shortcuts

Keep the full combination inside a single `<kbd esds-kbd>` element, and wrap the `+` separator in a `<span>` so each key is its own flex item — the `gap` token then spaces the keys evenly:

```html
<p>
  Press
  <kbd esds-kbd>⌘<span>+</span>K</kbd>
  to open the command menu.
</p>
```

## Description

Adding the custom attribute `esds-kbd` to a `<kbd>` element applies the `esds-kbd` styles to this element.

> [!WARNING]
> The `esds-kbd` attribute can only be used on `<kbd>` elements.

> [!WARNING]
> It is expected that the `<kbd esds-kbd>` element is used as a **child** of a _text container_ like a `<p>`, `<li>`, `<button>` element.
> It is not intended to be used as a standalone/isolated element.

### Semantics

- Use `esds-kbd` for keyboard keys and shortcuts only. For inline code, use a `<code>` element instead so assistive technology conveys the right meaning.
- Do not rely on the key alone to convey an action; always pair it with a descriptive label, such as the text of the button or menu it sits beside.
- Use the same casing and symbols the user sees on their physical keyboard so the displayed key matches what they press.

Its appearance is driven by the design tokens; changes to the look belong to the token layer, not to component consumers.

### Symbol glyphs

Accessibility checkers such as axe report symbol glyphs like `⌘` as an _incomplete_ `color-contrast` result ("Element content contains only non-text characters"): a glyph is not classified as text, so the ratio cannot be computed automatically. This is a manual-review item, not a failure — the glyph is painted with the same color as regular text (`--esds-kbd-content-color`), so it passes whenever text does.

## Demo
