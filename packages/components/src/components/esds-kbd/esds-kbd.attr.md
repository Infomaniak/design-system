- [Figma ↗](TODO)

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

No special markup is needed to group keys: use several `<kbd esds-kbd>` elements separated by a `+` character, spaced by the natural inline text flow:

```html
<p>
  Press
  <kbd esds-kbd>⌘</kbd>
  +
  <kbd esds-kbd>K</kbd>
  to open the command menu.
</p>
```

> [!NOTE]
> In compact contexts (buttons, inputs, tooltips), wrap the keys in a flex container with a small gap if natural whitespace spacing is not sufficient.

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

## Demo
