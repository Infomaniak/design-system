---
'@infomaniak-design-system/tokens': minor
---

Tailwind tokens now ship state helpers: any `bg-` token can be suffixed with `-state-[state-token-name]` to blend a background color with a state color.

_Example:_ `active:bg-brand-state-selected-strong` applies the `color.state.selected-strong` state token over the `color.background.brand` background token.
