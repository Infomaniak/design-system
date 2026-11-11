import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{l as t,s as n}from"./blocks-Cr2ZIGG9.js";import{a as r}from"./chunk-W22LQPXL-CVCnKrju.js";import{i,r as a}from"./react-DITjJg24.js";function o(e){let t={code:`code`,em:`em`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Design Tokens/Getting Started/Definition & Architecture`}),`
`,(0,c.jsxs)(`div`,{className:`welcome-section`,children:[(0,c.jsx)(`h1`,{children:`Design Tokens`}),(0,c.jsx)(`p`,{className:`welcome-description`,children:(0,c.jsxs)(t.p,{children:[`Our design system is powered by design tokens: `,(0,c.jsx)(`strong`,{children:`name-value`}),` `,(0,c.jsx)(`em`,{children:`pairs`}),` that
define the visual language of Infomaniak products. Tokens ensure consistency across platforms
while remaining flexible enough for different contexts.`]})})]}),`
`,(0,c.jsx)(t.h2,{id:`token-architecture`,children:`Token Architecture`}),`
`,(0,c.jsx)(t.p,{children:`Our token system follows the Design Tokens Community Group (DTCG) standard with a three-tier architecture:`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(`a`,{href:`./?path=/docs/design-tokens-t1--docs`,children:`T1 Primitive tokens`}),` for foundational token
values`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(`a`,{href:`./?path=/docs/design-tokens-t2--docs`,children:`T2 Semantic tokens`}),` for semantic abstraction
tokens`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(`a`,{href:`./?path=/docs/design-tokens-t3--docs`,children:`T3 Component tokens`}),` for component-specific
tokens`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`how-it-works`,children:`How It Works`}),`
`,(0,c.jsx)(t.h3,{id:`token-resolution-chain`,children:`Token Resolution Chain`}),`
`,(0,c.jsx)(t.p,{children:`Token values reference each other in a hierarchy, ensuring consistency across the system:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`T3-Component  →  button.background.error
                    ↓
T2-Semantic   →  color.background.error.default
                    ↓
T1-Primitive  →  color.red.600 (#E21C40)
`})}),`
`,(0,c.jsx)(t.p,{children:`When a primitive value changes, every token referencing it updates automatically.`}),`
`,(0,c.jsx)(t.h3,{id:`modifiers-override-by-path-matching`,children:`Modifiers Override by Path Matching`}),`
`,(0,c.jsx)(t.p,{children:`Modifiers let you swap the values of existing tokens without changing their names. They work by matching the path of a T2 (semantic) or T3 (component) token and replacing its value for specific contexts.`}),`
`,(0,c.jsx)(t.p,{children:(0,c.jsx)(t.strong,{children:`How it works:`})}),`
`,(0,c.jsxs)(t.ol,{children:[`
`,(0,c.jsx)(t.li,{children:`A modifier file contains the same token path as the base token`}),`
`,(0,c.jsx)(t.li,{children:`When applied, it replaces that path's value in the CSS cascade`}),`
`,(0,c.jsx)(t.li,{children:`Resolution continues with the new value`}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`Example`}),`: The `,(0,c.jsx)(t.code,{children:`euria`}),` product modifier`]}),`
`,(0,c.jsxs)(t.p,{children:[`The `,(0,c.jsx)(t.code,{children:`euria.tokens.json`}),` modifier overrides `,(0,c.jsx)(t.code,{children:`color.background.brand`}),` (the default brand background) by including the same path with a different value:`]}),`
`,(0,c.jsxs)(t.p,{children:[`Base `,(0,c.jsx)(t.code,{children:`t2-semantic/color.tokens.json`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-json`,children:`{
  "color": {
    "background": {
      "brand": {
        "$root": { "$value": "{color.background.brand.infomaniak}" },
        "infomaniak": { "$value": "{color.blue.600}" },
        "euria": { "$value": "{color.ocean.700}" }
      }
    }
  }
}
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`modifiers/product/euria.tokens.json`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-json`,children:`{
  "color": {
    "background": {
      "brand": {
        "$value": "{color.background.brand.euria}"
      }
    }
  }
}
`})}),`
`,(0,c.jsx)(t.p,{children:(0,c.jsx)(t.strong,{children:`Resolution with modifiers:`})}),`
`,(0,c.jsxs)(t.p,{children:[`Multiple modifiers can be applied simultaneously. In the example below, the `,(0,c.jsx)(t.code,{children:`euria`}),` modifier points the brand background to the Euria brand token, then `,(0,c.jsx)(t.code,{children:`dark`}),` further adjusts it for the dark theme:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`With data-esds-product="euria" data-esds-theme="dark":

              T3: button.background.color
                      ↓
              T2: color.background.brand
                      ↓
  Euria modifier: color.background.brand.euria (color.ocean.700)
                      ↓
   Dark modifier: color.background.brand.euria (color.ocean.400)
                      ↓
              T1: color.ocean.400
`})}),`
`,(0,c.jsx)(t.p,{children:(0,c.jsxs)(t.em,{children:[(0,c.jsx)(t.strong,{children:`Web example -`}),` apply modifiers using data attributes:`]})}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<body
  data-esds-product="euria"
  data-esds-theme="dark"
>
  <!-- All children resolve with both modifiers applied -->
  <button style="background: var(--esds-color-background-brand)">
    Gets a color.ocean.400 background
  </button>
</body>
`})})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};