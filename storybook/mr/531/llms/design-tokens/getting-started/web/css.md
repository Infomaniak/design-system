# Design Tokens/Getting Started/Web/CSS

> A comprehensive guide on how to install and consume the Design System tokens on the web using CSS.

<div className="welcome-section">
  <h1>Design Tokens - Web - CSS</h1>
  <p className="welcome-description">
    A comprehensive guide on how to install and consume the Design System tokens on the web using
    CSS.
  </p>
</div>

## Installation

The package is hosted on npm and can be installed using the command:

```bash
npm install @infomaniak-design-system/tokens
# or with your favorite package manager
```

## Usage

We offer two CSS file formats: `*.root.css` and `*.attr.css` files (see below for explanations).

CSS files may be loaded using `<link>` elements:

_Without media queries_:

```html
<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/tokens.root.css"
/>
```

_With media queries_:

```html
<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/modifiers/theme/light.root.css"
  media="(prefers-color-scheme: light)"
/>
<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/modifiers/theme/dark.root.css"
  media="(prefers-color-scheme: dark)"
/>
```

Or directly imported from your CSS:

```css
@import '@infomaniak-design-system/tokens/css/tokens.root.css';
```

### `*.root.css` files

`*.root.css` files apply **globally** using `:root, :host` as selector.

The main file `@infomaniak-design-system/tokens/css/tokens.root.css` **must always** be included in your project: it contains all the tokens with their default values.

For the other `*.root.css` files, you **must** use _media queries_ with theme files to prevent conflicts (e.g., loading both light and dark simultaneously).

_Example:_

```html
<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/tokens.root.css"
/>
<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/modifiers/product/mail.root.css"
/>

<!-- Auto-switch based on system preference -->
<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/modifiers/theme/light.root.css"
  media="(prefers-color-scheme: light)"
/>
<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/modifiers/theme/dark.root.css"
  media="(prefers-color-scheme: dark)"
/>
```

### `*.attr.css` files

`.attr.css` files only affect elements inside a container with the matching data attribute (selector: `[data-esds-<modifier>="<context>"]`).

#### Import

_Import all modifiers:_

```css
/* load all the modifiers */
@import '@infomaniak-design-system/tokens/css/modifiers/all.attr.css';
```

_Import all contexts:_

```css
/* load all the contexts ("light", "dark") of the modifier "theme" */
@import '@infomaniak-design-system/tokens/css/modifiers/theme/all.attr.css';
```

_Import an individual context:_

```css
/* load the dark theme modifier */
@import '@infomaniak-design-system/tokens/css/modifiers/theme/dark.attr.css';
```

> [!NOTE]
> As a size optimization, we recommend importing only the required modifiers.

#### Apply

Modifiers can be applied to a container element using the associated data attribute:

```html
<body
  data-esds-theme="dark"
  data-esds-product="mail"
>
  <!-- Dark theme and product mail applies to body and children -->
</body>
```
