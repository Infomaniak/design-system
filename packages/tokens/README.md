# Infomaniak's Design System - DTCG Tokens

Contains the list of Infomaniak's Design System tokens based on the [Design Tokens Community Group - (DTCG - 2025.10)](https://www.designtokens.org/tr/2025.10/format) format, and scripts to convert them to different formats (CSS, Figma, Tailwind, etc.).

## Definition

A `design token` is a pair consisting of a **name** and a **value**.
They're assembled into a list of tokens to apply styles to elements.

## File structure

- `tokens`: Contains the list the all the tokens for the design tokens.
  - `t1-primitive`: Contains the _primitive_ tokens: it's a list of all the possible values to use for the design tokens.
    Developers should not use these values directly in their code, as they should rely on more abstract tokens (see t2, t3).
  - `t2-semantic`: Contains the _semantic_ tokens: it's a list of token's having a semantic meaning (ex: "color.brand").
    All the values of these tokens are pointing to the `t1-primitive` tokens: they can't have their own values.
  - `t3-component`: Contains the _component_ tokens: it's a list of tokens that are used to style components or elements of the interface.
    All the values of these tokens are pointing to the `t1-primitive` or `t2-semantic` tokens: they can't have their own values.
  - `modifiers`: Contains the list of tokens that are used as alternate values for the `t2-semantic` and `t3-component` tokens.

## Modifiers

- `contexts` are set of tokens associated with a `context` name that can be used to provide alternative values for the tokens.
- `contexts` are grouped by `modifier`:
  - Each `context` can only be used once per modifier.
  - Multiple `modifiers` can be combined to create the final set of tokens.

### Example

- `modifiers`:
  - `theme`:
    - `light.tokens.json`: Contains the tokens for the light theme.
    - `dark.tokens.json`: Contains the tokens for the dark theme.
  - `platform`:
    - `mobile.tokens.json`: Contains the tokens for the mobile platform.
    - `desktop.tokens.json`: Contains the tokens for the desktop platform.

In this example, developpers can use `light` OR `dark` _theme_ (but not both at the same time)
and `mobile` OR `desktop` _platform_.

`light`, `dark`, `mobile` and `desktop` are _contexts_ and `theme` and `platform` are _modifiers_.

## Outputs

### Web

The tokens are published as a npm package: `@infomaniak-design-system/tokens`.

#### CSS

The `css/tokens.root.css` file contains all the _base_ tokens as CSS variables and must be imported in every project.

The `css/modifiers/<modifier>/<context>.(root|attr).css` contains the tokens for the given modifier and context.

> [!NOTE]
> The `root` suffix contains the tokens wrapped by the selector: `:root, :host`
> The `attr` suffix contains the tokens wrapped by the attribute selector: `[data-esds-<modifier>="<context>"]`

##### Import

You may import the CSS files as you prefer, but here's an example of how to use them:

```css
/* src/styles/esds/tokens.css */
@import '@infomaniak-design-system/tokens/css/tokens.root.css';
```

```css
/* src/styles/esds/themes/light.css */
@import '@infomaniak-design-system/tokens/css/modifiers/theme/light.root.css';
```

```css
/* src/styles/esds/themes/dark.css */
@import '@infomaniak-design-system/tokens/css/modifiers/theme/dark.root.css';
```

```css
/* src/styles/esds/modifiers.css */
@import '@infomaniak-design-system/tokens/css/modifiers/button-size/small.attr.css';
@import '@infomaniak-design-system/tokens/css/modifiers/button-type/primary.attr.css';
/* etc. */
```

```html
<!-- index.html -->
<link
  rel="stylesheet"
  href="src/styles/esds/tokens.css"
/>
<link
  rel="stylesheet"
  href="src/styles/esds/themes/light.css"
  media="(prefers-color-scheme: light)"
/>
<link
  rel="stylesheet"
  href="src/styles/esds/themes/dark.css"
  media="(prefers-color-scheme: dark)"
/>

<link
  rel="stylesheet"
  href="src/styles/esds/modifiers.css"
/>
```

##### Usage

```html
<button
  data-esds-button-size="small"
  data-esds-button-type="primary"
>
  Click Me !
</button>
```

#### Tailwind

The npm package contains a `tailwind.css` file that you can import and use in your Tailwind project:

```css
/* src/styles/tailwind.css */
@import 'tailwindcss';
@import '@infomaniak-design-system/tokens/tailwind.css';
```

```html
<!-- index.html -->
<link
  rel="stylesheet"
  href="src/styles/tailwind.css"
/>

/* ... */

<button class="bg-yellow-500">Click Me !</button>
```

## Scripts

TODO

## Import tokens into figma

We use the Figma [TokensBrücke plugin](../../docs/figma/tokens-bruecke/figma-tokens-bruecke.md) to import the figma variables.
