# Infomaniak's Design System - DTCG Tokens

Contains the list of Infomaniak's Design System tokens based on the [Design Tokens Community Group - (DTCG - 2025.10)](https://www.designtokens.org/tr/2025.10/format) format, and script to convert them to different formats (CSS, Figma, Tailwind, etc.).

## Structure and nomenclature

A `design token` is a pair consisting of a **name** and a **value**.
They're assembled into a list of tokens to apply styles to interface elements.

In this repository, the file structure is as follows:

- `tokens`: Contains the list of all the design tokens: all the names and values available as design tokens
  - `t1-primitive`: Contains the _primitive_ tokens: it's a list of all the possible values to use for the design tokens.
    Developers should not use these values directly in their code, as they should rely on more abstract tokens (see t2, t3).
  - `t2-semantic`: Contains the _semantic_ tokens: it's a list of token's having a semantic meaning (ex: "color.brand").
    All the values of these tokens are pointing to the `t1-primitive` tokens: they can't have their own values.
  - `t3-component`: Contains the _component_ tokens: it's a list of tokens that are used to style components or elements of the interface.
    All the values of these tokens are pointing to the `t1-primitive` or `t2-semantic` tokens: they can't have their own values.

Each t2 and t3 may _optionaly_ have `theme` and/or `variant` properties into the `$extensions` property:

```json
{
  "$extensions": {
    "theme": {
      "dark": "{color.black.100}"
    },
    "variant": {
      "small": "{spacing.1}"
    }
  }
}
```

- `theme`: Represents an _alternative_ value that are used **globally** to style the interface (ex: "light" or "dark").
- `variant`: Represents an _alternative_ value that are used **locally** to style a component or element (ex: "button.small" or "button.primary").

## Scripts

## Import tokens into figma

We use the Figma [TokensBrücke plugin](../../docs/figma/tokens-bruecke/figma-tokens-bruecke.md) to import the figma variables.
