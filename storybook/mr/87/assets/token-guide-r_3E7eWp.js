import{Yt as e,_t as t,a as n}from"./iframe-BBPCFoBg.js";import{n as r}from"./lib-KTwlu7d7.js";var i=e(t());function a(e){let t={code:`code`,h2:`h2`,h3:`h3`,h4:`h4`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...r(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n,{title:`Design Tokens/Getting Started`}),`
`,(0,i.jsxs)(`div`,{className:`welcome-section`,children:[(0,i.jsx)(`h1`,{children:`Design Tokens`}),(0,i.jsx)(`p`,{className:`welcome-description`,children:(0,i.jsx)(t.p,{children:`Our design system is powered by design tokens: name-value pairs that define the visual language
of Infomaniak products. Tokens ensure consistency across platforms while remaining flexible
enough for different contexts.`})})]}),`
`,(0,i.jsx)(t.h2,{id:`token-architecture`,children:`Token Architecture`}),`
`,(0,i.jsx)(t.p,{children:`Our token system follows the Design Tokens Community Group (DTCG) standard with a three-tier architecture:`}),`
`,(0,i.jsxs)(t.ul,{children:[`
`,(0,i.jsxs)(t.li,{children:[(0,i.jsx)(`a`,{href:`/?path=/docs/design-tokens-t1--docs`,children:`T1 Primitive tokens`}),` for foundational tokens
values`]}),`
`,(0,i.jsxs)(t.li,{children:[(0,i.jsx)(`a`,{href:`/?path=/docs/design-tokens-t2--docs`,children:`T2 Semantic tokens`}),` for semantic abstraction
tokens`]}),`
`,(0,i.jsxs)(t.li,{children:[(0,i.jsx)(`a`,{href:`/?path=/docs/design-tokens-t3--docs`,children:`T3 Component tokens`}),` for component-specific
tokens`]}),`
`]}),`
`,(0,i.jsx)(t.h2,{id:`how-it-works`,children:`How It Works`}),`
`,(0,i.jsx)(t.h3,{id:`token-resolution-chain`,children:`Token Resolution Chain`}),`
`,(0,i.jsx)(t.p,{children:`Token values reference each other in a hierarchy, ensuring consistency across the system:`}),`
`,(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:`T3-Component  →  button.background.error
                    ↓
T2-Semantic   →  color.background.error.default
                    ↓
T1-Primitive  →  color.red.600 (#E21C40)
`})}),`
`,(0,i.jsx)(t.p,{children:`When a primitive value changes, every token referencing it updates automatically.`}),`
`,(0,i.jsx)(t.h3,{id:`context-overrides-with-modifiers`,children:`Context Overrides with Modifiers`}),`
`,(0,i.jsx)(t.p,{children:`Modifiers provide alternative values for T2 or T3 tokens to adapt to specific contexts. When you apply modifiers, they replace the default values in the resolution chain.`}),`
`,(0,i.jsx)(t.p,{children:(0,i.jsx)(t.strong,{children:`Available modifiers:`})}),`
`,(0,i.jsxs)(t.ul,{children:[`
`,(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:`Theme`}),`: `,(0,i.jsx)(t.code,{children:`light`}),`, `,(0,i.jsx)(t.code,{children:`dark`})]}),`
`,(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:`Product`}),`: `,(0,i.jsx)(t.code,{children:`infomaniak`}),`, `,(0,i.jsx)(t.code,{children:`euria`}),`, `,(0,i.jsx)(t.code,{children:`swisstransfer`}),`, ...`]}),`
`]}),`
`,(0,i.jsx)(t.p,{children:(0,i.jsx)(t.strong,{children:`Example: Euria dark mode`})}),`
`,(0,i.jsx)(t.p,{children:`Let's trace how a button's background resolves with multiple modifiers:`}),`
`,(0,i.jsx)(t.p,{children:(0,i.jsx)(t.strong,{children:`Without modifiers (default):`})}),`
`,(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:`T3: button.background.default → T2: color.background.brand.default → T1: color.sky.700 (#0098FF)
`})}),`
`,(0,i.jsx)(t.p,{children:(0,i.jsxs)(t.strong,{children:[`With `,(0,i.jsx)(t.code,{children:`data-esds-product="euria"`}),`:`]})}),`
`,(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:`T3: button.background.default → T2: color.background.brand.default → T1: color.ocean.700 (#0064F0)
                                              ↑
                              Modifier overrides semantic token
`})}),`
`,(0,i.jsx)(t.p,{children:(0,i.jsxs)(t.strong,{children:[`With `,(0,i.jsx)(t.code,{children:`data-esds-product="euria"`}),` and `,(0,i.jsx)(t.code,{children:`data-esds-theme="dark"`}),`:`]})}),`
`,(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:`T3: button.background.default → T2: color.background.brand.default → T1: color.ocean.400 (#48BFFF)
                                              ↑
                    Both modifiers combine for final color.ocean.400 value
`})}),`
`,(0,i.jsx)(t.p,{children:`Apply modifiers using data attributes:`}),`
`,(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:`language-html`,children:`<div
  data-esds-product="euria"
  data-esds-theme="dark"
>
  <button style="background: var(--esds-color-background-brand-default)">Click me!</button>
</div>
`})}),`
`,(0,i.jsx)(t.h2,{id:`consuming-tokens`,children:`Consuming Tokens`}),`
`,(0,i.jsx)(t.h3,{id:`web`,children:`Web`}),`
`,(0,i.jsx)(t.h4,{id:`install-via-npm`,children:`Install via npm`}),`
`,(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:`language-bash`,children:`npm install @infomaniak-design-system/tokens
`})}),`
`,(0,i.jsx)(t.h4,{id:`css-variables`,children:`CSS Variables`}),`
`,(0,i.jsx)(t.p,{children:`Import the base tokens and any modifiers you need:`}),`
`,(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:`language-css`,children:`/* Base tokens (required) */
@import '@infomaniak-design-system/tokens/css/tokens.root.css';

/* Theme modifiers */
@import '@infomaniak-design-system/tokens/css/modifiers/theme/light.root.css';
@import '@infomaniak-design-system/tokens/css/modifiers/theme/dark.root.css';
`})}),`
`,(0,i.jsx)(t.p,{children:`Apply modifiers using data attributes:`}),`
`,(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:`language-html`,children:`<button
  data-esds-button-size="small"
  data-esds-button-type="primary"
>
  Click me!
</button>
`})}),`
`,(0,i.jsx)(t.h4,{id:`tailwind-css`,children:`Tailwind CSS`}),`
`,(0,i.jsx)(t.p,{children:`If you're using Tailwind, import our theme extension:`}),`
`,(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:`language-css`,children:`/* src/styles/tailwind.css */
@import 'tailwindcss';
@import '@infomaniak-design-system/tokens/tailwind.css';
`})}),`
`,(0,i.jsx)(t.p,{children:`Tokens automatically map to Tailwind utilities:`}),`
`,(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:`language-html`,children:`<!-- index.html -->
<link
  rel="stylesheet"
  href="src/styles/tailwind.css"
/>

/* ... */

<button class="bg-yellow-500">Click Me!</button>
`})})]})}function o(e={}){let{wrapper:t}={...r(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}export{o as default};