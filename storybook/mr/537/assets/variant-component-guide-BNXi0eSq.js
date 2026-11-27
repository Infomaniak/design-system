import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{l as t,s as n}from"./blocks-BhIHenDv.js";import{a as r}from"./chunk-W22LQPXL-DAacIxBz.js";import{i,r as a}from"./react-DITjJg24.js";var o;function s(){return(s=e((()=>{o=new URL(`variant-component-example-ZyMEOSBm.png`,import.meta.url).href})))()}function c(e){let t={blockquote:`blockquote`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...i(),...e.components};return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(n,{title:`Designers Guide/Components/Creating a component with variants`}),`
`,(0,u.jsx)(t.h1,{id:`creating-a-component-with-variants`,children:`Creating a component with variants`}),`
`,(0,u.jsx)(t.p,{children:`A variant component is one component with several variations — sizes, colors, states… Figma and
code express variants differently, so tokens are applied differently on each side. Follow the rules
below to keep the two in sync.`}),`
`,(0,u.jsxs)(t.blockquote,{children:[`
`,(0,u.jsxs)(t.p,{children:[`👑 `,(0,u.jsx)(t.strong,{children:`Golden rule`}),`: on Figma, a property that changes with the variant points to a `,(0,u.jsx)(t.code,{children:`t2`}),` token; an
invariant property points to the component's own `,(0,u.jsx)(t.code,{children:`t3`}),` token.`]}),`
`]}),`
`,(0,u.jsxs)(t.h2,{id:`example---kbd-`,children:[`Example - `,(0,u.jsx)(t.code,{children:`kbd`}),` 📐`]}),`
`,(0,u.jsx)(`img`,{src:o,alt:`A .kbd component set with large and medium variants, with the size variant property visible in the Figma properties panel`}),`
`,(0,u.jsx)(t.h2,{id:`variants-in-figma-vs-code-`,children:`Variants in Figma vs code 🔀`}),`
`,(0,u.jsxs)(t.ul,{children:[`
`,(0,u.jsxs)(t.li,{children:[(0,u.jsx)(t.strong,{children:`UX side`}),`: Figma groups the variations into one component through its `,(0,u.jsx)(t.strong,{children:`variant`}),` feature: the
variations live in a single component set and are picked from a select. A variant is chosen
explicitly — it is never inherited from context.`]}),`
`,(0,u.jsxs)(t.li,{children:[(0,u.jsx)(t.strong,{children:`Dev side`}),`: code has no variant property. Variations are expressed as `,(0,u.jsx)(t.strong,{children:`modifiers`}),` (e.g.
`,(0,u.jsx)(t.code,{children:`kbd-size="large"`}),` → `,(0,u.jsx)(t.code,{children:`kbd.font = { body.sm.font.emphasized }`}),`, `,(0,u.jsx)(t.code,{children:`kbd-size="medium"`}),` →
`,(0,u.jsx)(t.code,{children:`kbd.font = { body.xs.font.emphasized }`}),`), applied and inherited by context. Components consume
only `,(0,u.jsx)(t.code,{children:`t3`}),` tokens (e.g. `,(0,u.jsx)(t.code,{children:`kbd.border.width`}),`).`]}),`
`]}),`
`,(0,u.jsx)(t.h2,{id:`which-token-for-which-property-️`,children:`Which token for which property? 🏷️`}),`
`,(0,u.jsxs)(t.h3,{id:`it-changes-with-the-variant-eg-the-kbd-font-size`,children:[`It changes with the variant (e.g. the `,(0,u.jsx)(t.code,{children:`kbd`}),` font size)`]}),`
`,(0,u.jsxs)(t.p,{children:[`Point to a `,(0,u.jsxs)(t.strong,{children:[(0,u.jsx)(t.code,{children:`t2`}),` token`]}),` — or a `,(0,u.jsx)(t.code,{children:`t3`}),` not owned by the component, like a heading/body typography
token. The token holds the value to put inside the modifier, so devs read it directly on Figma.`]}),`
`,(0,u.jsxs)(t.h3,{id:`it-doesnt-change-with-the-variant-eg-the-kbd-background`,children:[`It doesn't change with the variant (e.g. the `,(0,u.jsx)(t.code,{children:`kbd`}),` background)`]}),`
`,(0,u.jsxs)(t.p,{children:[`Point to the `,(0,u.jsxs)(t.strong,{children:[`component's own `,(0,u.jsx)(t.code,{children:`t3`}),` token`]}),` (e.g. `,(0,u.jsx)(t.code,{children:`kbd.background.color`}),`). One update fixes every
variant at once.`]}),`
`,(0,u.jsx)(t.h2,{id:`checklist-`,children:`Checklist ✅`}),`
`,(0,u.jsxs)(t.ul,{children:[`
`,(0,u.jsxs)(t.li,{children:[`A property that changes with the variant points to a `,(0,u.jsx)(t.code,{children:`t2`}),` token, or to a shared typography `,(0,u.jsx)(t.code,{children:`t3`})]}),`
`,(0,u.jsxs)(t.li,{children:[`An invariant property points to the component's own `,(0,u.jsx)(t.code,{children:`t3`}),` token`]}),`
`,(0,u.jsxs)(t.li,{children:[`A component with no variants consumes only its own `,(0,u.jsx)(t.code,{children:`t3`}),` tokens`]}),`
`]})]})}function l(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,u.jsx)(t,{...e,children:(0,u.jsx)(c,{...e})}):c(e)}var u;function d(){return(d=e((()=>{u=r(),a(),t(),s()})))()}d();export{l as default};