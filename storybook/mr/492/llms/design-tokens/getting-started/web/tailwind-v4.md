# Design Tokens/Getting Started/Web/Tailwind (v4)

> A comprehensive guide on how to install and consume the Design System tokens on the web using Tailwind v4.

<div className="welcome-section">
  <h1>Design Tokens</h1>
  <p className="welcome-description">
    A comprehensive guide on how to install and consume the Design System tokens on the web using
    Tailwind v4.
  </p>
</div>

## Installation

```bash
npm install @infomaniak-design-system/tokens
# or with your favorite package manager
```

## Usage

```css
@import 'tailwindcss';
@import '@infomaniak-design-system/tokens/css/tokens.root.css';
@import '@infomaniak-design-system/tokens/tailwind.css';
```

```html
<button class="bg-brand">Click me!</button>
```

### Namespace

Tailwind tokens are scoped by their respective namespace.

<Table
  headers={['Tailwind namespace', 'Tailwind utility', 'Tokens', 'Description']}
  rows={[
    [
      <code>--background-color-*</code>,
      <code>bg-*</code>,
      <code>--esds-color-background-*</code>,
      'Background colors',
    ],
    [
      <>
        <code>--border-color-*</code>
        <code>--outline-color-*</code>
      </>,
      <>
        <code>border-*</code>
        <code>outline-*</code>
      </>,
      <code>--esds-color-border-*</code>,
      'Border colors',
    ],
    [
      <code>--text-color-*</code>,
      <code>text-*</code>,
      <code>--esds-color-content-*</code>,
      'Content colors',
    ],
    [<code>--color-*</code>, 'any color utility', <code>--esds-color-*</code>, 'Other colors'],
    [
      <code>--font-*</code>,
      <code>font-*</code>,
      <code>--esds-font-family-*</code>,
      'Font Families',
    ],
    [<code>--text-*</code>, <code>text-*</code>, <code>--esds-text-*-size</code>, 'Font sizes'],
    [
      <code>--text-*--line-height</code>,
      <code>text-*</code>,
      <code>--esds-text-*-line-height</code>,
      'Line-heights',
    ],
    [
      <code>--font-weight-*</code>,
      <code>font-*</code>,
      <code>--esds-font-weight-*</code>,
      'Font Weights',
    ],
    [
      <code>--tracking-*</code>,
      <code>tracking-*</code>,
      <code>--esds-font-letter-spacing-*</code>,
      'Letter-spacings',
    ],
    [
      <code>--text-icon-*</code>,
      <code>text-icon-*</code>,
      <code>--esds-icon-size-*</code>,
      'Icon sizes',
    ],
    [<code>--radius-*</code>, <code>rounded-*</code>, <code>--esds-radius-*</code>, 'Radius'],
    [
      <>
        <code>--border-width-*</code>
        <code>--outline-width-*</code>
      </>,
      <>
        <code>border-*</code>
        <code>outline-*</code>
      </>,
      <code>--esds-border-*-width</code>,
      'Border widths',
    ],
    [<code>--blur-*</code>, <code>blur-*</code>, <code>--esds-blur-*</code>, 'Blurs'],
    [<code>--opacity-*</code>, <code>opacity-*</code>, <code>--esds-opacity-*</code>, 'Opacities'],
    [
      <code>--spacing-*</code>,
      <>
        <code>p-*</code>
        <code>m-*</code>
        <code>gap-*</code>
        <code>w-*</code>
      </>,
      <code>--esds-spacing-*</code>,
      'Spacings',
    ],
  ]}
/>

#### States

States may be applied to _background_ color tokens by suffixing a `bg-` token with `-state-[state-token-name]`.

_Example:_ `bg-brand-state-selected-strong` will apply the `color.state.selected-strong` state token to the `color.background.brand` background token.

Both are mixed to form a combined color that you may use to style the background of an element when it is in a specific state.

For the previous example, a common usage would be `active:bg-brand-state-selected-strong`.
