# Infomaniak's Design System - DTCG Tokens

Contains the list of Infomaniak's Design System tokens based on the [Design Tokens Community Group - (DTCG - 2025.10)](https://www.designtokens.org/tr/2025.10/format) format, and scripts to convert them to different formats (CSS, Figma, Tailwind, etc.).

## Definition

A `design token` is a pair consisting of a **name** and a **value**.
They're assembled into a list of tokens to apply styles to elements.

## File structure

- `tokens`: Contains the list of all the design tokens: all the names and values available as design tokens
  - `t1-primitive`: Contains the _primitive_ tokens: it's a list of all the possible values to use for the design tokens.
    Developers should not use these values directly in their code, as they should rely on more abstract tokens (see t2, t3).
  - `t2-semantic`: Contains the _semantic_ tokens: it's a list of token's having a semantic meaning (ex: "color.brand").
    All the values of these tokens are pointing to the `t1-primitive` tokens: they can't have their own values.
  - `t3-component`: Contains the _component_ tokens: it's a list of tokens that are used to style components or elements of the interface.
    All the values of these tokens are pointing to the `t1-primitive` or `t2-semantic` tokens: they can't have their own values.

## Themes

A `theme` is a set of tokens that are used to style **globally** the interface (ex: "light" or "dark").

Each t2 and t3 may _optionaly_ have a `theme` property present into the `$extensions` object:

```json
{
  "$extensions": {
    "theme": {
      "dark": "{color.black.100}"
    }
  }
}
```

For each theme, **all** the tokens are generated into a dedicated file, used to globally apply a style to the interface.

## Variants

A `variant` is a set of tokens that are used to style **localy** a component or element (ex: "button.small" or "button.primary")

Each t2 and t3 may _optionaly_ have a `variant` property present into the `$extensions` object:

```json
{
  "$extensions": {
    "variant": {
      "small": "{spacing.1}"
    }
  }
}
```

For each variant, only the tokens having this variant are generated into a dedicated file, used to locally apply a style to the components or elements.

## Scripts

## Import tokens into figma

We use the Figma [TokensBrücke plugin](../../docs/figma/tokens-bruecke/figma-tokens-bruecke.md) to import the figma variables.
