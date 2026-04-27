import{a as e,en as t,s as n,yt as r}from"./iframe-BWTgfWbi.js";var i=t(r());function a(t){let r={a:`a`,br:`br`,code:`code`,div:`div`,h2:`h2`,h3:`h3`,h4:`h4`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...n(),...t.components},{Table:a}=r;return a||s(`Table`,!0),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e,{title:`Design Tokens/Getting Started`}),`
`,(0,i.jsxs)(`div`,{className:`welcome-section`,children:[(0,i.jsx)(`h1`,{children:`Design Tokens`}),(0,i.jsx)(`p`,{className:`welcome-description`,children:(0,i.jsx)(r.p,{children:`Our design system is powered by design tokens: name-value pairs that define the visual language
of Infomaniak products. Tokens ensure consistency across platforms while remaining flexible
enough for different contexts.`})})]}),`
`,(0,i.jsxs)(r.ul,{children:[`
`,(0,i.jsx)(r.li,{children:(0,i.jsx)(r.a,{href:`#token-architecture`,children:`Token Architecture`})}),`
`,(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:`#consuming-tokens`,children:`Consuming Tokens`}),`
`,(0,i.jsxs)(r.ul,{children:[`
`,(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:`#web`,children:`Web`}),`
`,(0,i.jsxs)(r.ul,{children:[`
`,(0,i.jsx)(r.li,{children:(0,i.jsx)(r.a,{href:`#install-from-npm`,children:`Install from NPM`})}),`
`,(0,i.jsx)(r.li,{children:(0,i.jsx)(r.a,{href:`#css-files`,children:`CSS Files`})}),`
`,(0,i.jsx)(r.li,{children:(0,i.jsx)(r.a,{href:`#loading-themes-root-files`,children:`Loading Themes (.root files)`})}),`
`,(0,i.jsx)(r.li,{children:(0,i.jsx)(r.a,{href:`#using-modifiers-attr-files`,children:`Using Modifiers (.attr files)`})}),`
`,(0,i.jsx)(r.li,{children:(0,i.jsx)(r.a,{href:`#tailwind-css`,children:`Tailwind CSS`})}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:`#how-it-works`,children:`How It Works`}),`
`,(0,i.jsxs)(r.ul,{children:[`
`,(0,i.jsx)(r.li,{children:(0,i.jsx)(r.a,{href:`#token-resolution-chain`,children:`Token Resolution Chain`})}),`
`,(0,i.jsx)(r.li,{children:(0,i.jsx)(r.a,{href:`#modifiers-override-by-path-matching`,children:`Modifiers Override by Path Matching`})}),`
`]}),`
`]}),`
`]}),`
`,(0,i.jsx)(r.h2,{id:`token-architecture`,children:`Token Architecture`}),`
`,(0,i.jsx)(r.p,{children:`Our token system follows the Design Tokens Community Group (DTCG) standard with a three-tier architecture:`}),`
`,(0,i.jsxs)(r.ul,{children:[`
`,(0,i.jsxs)(r.li,{children:[(0,i.jsx)(`a`,{href:`./?path=/docs/design-tokens-t1--docs`,children:`T1 Primitive tokens`}),` for foundational tokens
values`]}),`
`,(0,i.jsxs)(r.li,{children:[(0,i.jsx)(`a`,{href:`./?path=/docs/design-tokens-t2--docs`,children:`T2 Semantic tokens`}),` for semantic abstraction
tokens`]}),`
`,(0,i.jsxs)(r.li,{children:[(0,i.jsx)(`a`,{href:`./?path=/docs/design-tokens-t3--docs`,children:`T3 Component tokens`}),` for component-specific
tokens`]}),`
`]}),`
`,(0,i.jsx)(r.h2,{id:`consuming-tokens`,children:`Consuming Tokens`}),`
`,(0,i.jsx)(r.h3,{id:`web`,children:`Web`}),`
`,(0,i.jsx)(r.h4,{id:`install-from-npm`,children:`Install from NPM`}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:`language-bash`,children:`npm install @infomaniak-design-system/tokens
`})}),`
`,(0,i.jsx)(r.h4,{id:`css-files`,children:`CSS Files`}),`
`,(0,i.jsx)(r.p,{children:`We offer two CSS file formats:`}),`
`,(0,i.jsx)(a,{headers:[`File format`,`CSS Selector`,`Usage`],rows:[[(0,i.jsx)(r.code,{children:`*.root.css`}),(0,i.jsx)(r.code,{children:`:root, :host`}),(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.code,{children:`*.root.css`}),` files apply globally via `,(0,i.jsx)(r.code,{children:`:root`}),` immediately.`,(0,i.jsx)(r.br,{}),`Use `,(0,i.jsx)(r.code,{children:`media`}),` queries with theme files to prevent conflicts (e.g., loading both light and dark simultaneously).`]})],[(0,i.jsx)(r.code,{children:`*.attr.css`}),(0,i.jsx)(r.code,{children:`[data-esds-<modifier>="<context>"]`}),(0,i.jsxs)(r.div,{children:[(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.code,{children:`.attr.css`}),` files only affect elements inside a container with the matching data attribute.`]}),(0,i.jsxs)(r.ul,{children:[(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:`<modifier>`}),`: "theme" | "product"`]}),(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.code,{children:`<context>`}),`: "infomaniak" | "mail" | "euria" | ...`]})]})]})]]}),`
`,(0,i.jsxs)(r.h4,{id:`using-rootcss-files`,children:[`Using `,(0,i.jsx)(r.code,{children:`*.root.css`}),` files`]}),`
`,(0,i.jsx)(r.p,{children:`Root CSS files could be loaded using query, for example:`}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:`language-html`,children:`<link
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
`})}),`
`,(0,i.jsxs)(r.h4,{id:`using-attrcss-files`,children:[`Using `,(0,i.jsx)(r.code,{children:`*.attr.css`}),` files`]}),`
`,(0,i.jsx)(r.p,{children:`Attr CSS file could be imported via CSS and activated using data attributes:`}),`
`,(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:`NOTE`}),`: `,(0,i.jsx)(r.code,{children:`*.attr.css`}),` CSS files are `,(0,i.jsx)(r.strong,{children:`optional`}),` and should be imported only if necessary.`]}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:`language-css`,children:`@import '@infomaniak-design-system/tokens/css/tokens.attr.css';
@import '@infomaniak-design-system/tokens/css/modifiers/product/mail.attr.css';
@import '@infomaniak-design-system/tokens/css/modifiers/theme/dark.attr.css';
`})}),`
`,(0,i.jsx)(r.p,{children:`Modifiers can also be set on container elements:`}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:`language-html`,children:`<body
  data-esds-theme="dark"
  data-esds-product="mail"
>
  <!-- Dark theme and product mail applies to children -->
</body>
`})}),`
`,(0,i.jsx)(r.h4,{id:`tailwind-css`,children:`Tailwind CSS`}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:`language-css`,children:`@import 'tailwindcss';
@import '@infomaniak-design-system/tokens/css/tokens.root.css';
@import '@infomaniak-design-system/tokens/tailwind.css';
`})}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:`language-html`,children:`<button class="bg-brand-default">Click me!</button>
`})}),`
`,(0,i.jsx)(r.h2,{id:`how-it-works`,children:`How It Works`}),`
`,(0,i.jsx)(r.h3,{id:`token-resolution-chain`,children:`Token Resolution Chain`}),`
`,(0,i.jsx)(r.p,{children:`Token values reference each other in a hierarchy, ensuring consistency across the system:`}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{children:`T3-Component  →  button.background.error
                    ↓
T2-Semantic   →  color.background.error.default
                    ↓
T1-Primitive  →  color.red.600 (#E21C40)
`})}),`
`,(0,i.jsx)(r.p,{children:`When a primitive value changes, every token referencing it updates automatically.`}),`
`,(0,i.jsx)(r.h3,{id:`modifiers-override-by-path-matching`,children:`Modifiers Override by Path Matching`}),`
`,(0,i.jsx)(r.p,{children:`Modifiers let you swap the values of existing tokens without changing their names. They work by matching the path of a T2 (semantic) or T3 (component) token and replacing its value for specific contexts.`}),`
`,(0,i.jsx)(r.p,{children:(0,i.jsx)(r.strong,{children:`How it works:`})}),`
`,(0,i.jsxs)(r.ol,{children:[`
`,(0,i.jsx)(r.li,{children:`A modifier file contains the same token path as the base token`}),`
`,(0,i.jsx)(r.li,{children:`When applied, it replaces that path's value in the CSS cascade`}),`
`,(0,i.jsx)(r.li,{children:`Resolution continues with the new value`}),`
`]}),`
`,(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:`Example`}),`: The `,(0,i.jsx)(r.code,{children:`euria`}),` product modifier`]}),`
`,(0,i.jsxs)(r.p,{children:[`The `,(0,i.jsx)(r.code,{children:`euria.tokens.json`}),` modifier overrides `,(0,i.jsx)(r.code,{children:`color.background.brand.default`}),` by including the same path with a different value:`]}),`
`,(0,i.jsxs)(r.p,{children:[`Base `,(0,i.jsx)(r.code,{children:`t2-semantic/color.tokens.json`}),`:`]}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:`language-json`,children:`{
  "color": {
    "background": {
      "brand": {
        "default": { "$value": "{color.sky.700}" }
      }
    }
  }
}
`})}),`
`,(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.code,{children:`modifiers/product/euria.tokens.json`}),`:`]}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:`language-json`,children:`{
  "color": {
    "background": {
      "brand": {
        "default": { "$value": "{color.ocean.700}" }
      }
    }
  }
}
`})}),`
`,(0,i.jsx)(r.p,{children:(0,i.jsx)(r.strong,{children:`Resolution with modifiers:`})}),`
`,(0,i.jsxs)(r.p,{children:[`Multiple modifiers can be applied simultaneously. In the example below, the `,(0,i.jsx)(r.code,{children:`euria`}),` modifier changes the base brand color, then `,(0,i.jsx)(r.code,{children:`dark`}),` further adjusts it for the dark theme:`]}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{children:`With data-esds-product="euria" data-esds-theme="dark":

              T3: button.background.brand.default
                      ↓
              T2: color.background.brand.default
                      ↓
  Euria modifier: color.background.brand.default (color.ocean.700)
                      ↓
   Dark modifier: color.background.brand.default (color.ocean.400)
                      ↓
              T1: color.ocean.400
`})}),`
`,(0,i.jsx)(r.p,{children:(0,i.jsx)(r.strong,{children:`Apply modifiers using data attributes:`})}),`
`,(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:`language-html`,children:`<body
  data-esds-product="euria"
  data-esds-theme="dark"
>
  <!-- All children resolve with both modifiers applied -->
  <button style="background: var(--esds-color-background-brand-default)">
    Gets a color.ocean.400 background
  </button>
</body>
`})})]})}function o(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}function s(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{o as default};