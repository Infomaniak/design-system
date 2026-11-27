# Designers Guide/Components/Creating a component with variants

> A variant component is one component with several variations — sizes, colors, states… Figma and code express variants...

A variant component is one component with several variations — sizes, colors, states… Figma and
code express variants differently, so tokens are applied differently on each side. Follow the rules
below to keep the two in sync.

> 👑 **Golden rule**: on Figma, a property that changes with the variant points to a `t2` token; an
> invariant property points to the component's own `t3` token.

## Example - `kbd` 📐

<img
  src={VariantComponentExample}
  alt="A .kbd component set with large and medium variants, with the size variant property visible in the Figma properties panel"
/>

## Variants in Figma vs code 🔀

- **UX side**: Figma groups the variations into one component through its **variant** feature: the
  variations live in a single component set and are picked from a select. A variant is chosen
  explicitly — it is never inherited from context.
- **Dev side**: code has no variant property. Variations are expressed as **modifiers** (e.g.
  `kbd-size="large"` → `kbd.font = { body.sm.font.emphasized }`, `kbd-size="medium"` →
  `kbd.font = { body.xs.font.emphasized }`), applied and inherited by context. Components consume
  only `t3` tokens (e.g. `kbd.border.width`).

## Which token for which property? 🏷️

### It changes with the variant (e.g. the `kbd` font size)

Point to a **`t2` token** — or a `t3` not owned by the component, like a heading/body typography
token. The token holds the value to put inside the modifier, so devs read it directly on Figma.

### It doesn't change with the variant (e.g. the `kbd` background)

Point to the **component's own `t3` token** (e.g. `kbd.background.color`). One update fixes every
variant at once.

## Checklist ✅

- A property that changes with the variant points to a `t2` token, or to a shared typography `t3`
- An invariant property points to the component's own `t3` token
- A component with no variants consumes only its own `t3` tokens
