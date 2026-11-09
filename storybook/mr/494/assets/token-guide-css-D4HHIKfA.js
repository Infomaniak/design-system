import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{l as t,s as n}from"./blocks-Cr2ZIGG9.js";import{a as r}from"./chunk-W22LQPXL-CVCnKrju.js";import{i,r as a}from"./react-DITjJg24.js";function o(e){let t={blockquote:`blockquote`,code:`code`,em:`em`,h2:`h2`,h3:`h3`,h4:`h4`,p:`p`,pre:`pre`,strong:`strong`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Design Tokens/Getting Started/Web/CSS`}),`
`,(0,c.jsxs)(`div`,{className:`welcome-section`,children:[(0,c.jsx)(`h1`,{children:`Design Tokens - Web - CSS`}),(0,c.jsx)(`p`,{className:`welcome-description`,children:(0,c.jsx)(t.p,{children:`A comprehensive guide on how to install and consume the Design System tokens on the web using
CSS.`})})]}),`
`,(0,c.jsx)(t.h2,{id:`installation`,children:`Installation`}),`
`,(0,c.jsx)(t.p,{children:`The package is hosted on npm and can be installed using the command:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-bash`,children:`npm install @infomaniak-design-system/tokens
# or with your favorite package manager
`})}),`
`,(0,c.jsx)(t.h2,{id:`usage`,children:`Usage`}),`
`,(0,c.jsxs)(t.p,{children:[`We offer two CSS file formats: `,(0,c.jsx)(t.code,{children:`*.root.css`}),` and `,(0,c.jsx)(t.code,{children:`*.attr.css`}),` files (see below for explanations).`]}),`
`,(0,c.jsxs)(t.p,{children:[`CSS files may be loaded using `,(0,c.jsx)(t.code,{children:`<link>`}),` elements:`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.em,{children:`Without media queries`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/tokens.root.css"
/>
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.em,{children:`With media queries`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<link
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
`,(0,c.jsx)(t.p,{children:`Or directly imported from your CSS:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`@import '@infomaniak-design-system/tokens/css/tokens.root.css';
`})}),`
`,(0,c.jsxs)(t.h3,{id:`rootcss-files`,children:[(0,c.jsx)(t.code,{children:`*.root.css`}),` files`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`*.root.css`}),` files apply `,(0,c.jsx)(t.strong,{children:`globally`}),` using `,(0,c.jsx)(t.code,{children:`:root, :host`}),` as selector.`]}),`
`,(0,c.jsxs)(t.p,{children:[`The main file `,(0,c.jsx)(t.code,{children:`@infomaniak-design-system/tokens/css/tokens.root.css`}),` `,(0,c.jsx)(t.strong,{children:`must always`}),` be included in your project: it contains all the tokens with their default values.`]}),`
`,(0,c.jsxs)(t.p,{children:[`For the other `,(0,c.jsx)(t.code,{children:`*.root.css`}),` files, you `,(0,c.jsx)(t.strong,{children:`must`}),` use `,(0,c.jsx)(t.em,{children:`media queries`}),` with theme files to prevent conflicts (e.g., loading both light and dark simultaneously).`]}),`
`,(0,c.jsx)(t.p,{children:(0,c.jsx)(t.em,{children:`Example:`})}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<link
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
`,(0,c.jsxs)(t.h3,{id:`attrcss-files`,children:[(0,c.jsx)(t.code,{children:`*.attr.css`}),` files`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`.attr.css`}),` files only affect elements inside a container with the matching data attribute (selector: `,(0,c.jsx)(t.code,{children:`[data-esds-<modifier>="<context>"]`}),`).`]}),`
`,(0,c.jsx)(t.h4,{id:`import`,children:`Import`}),`
`,(0,c.jsx)(t.p,{children:(0,c.jsx)(t.em,{children:`Import all modifiers:`})}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`/* load all the modifiers */
@import '@infomaniak-design-system/tokens/css/modifiers/all.attr.css';
`})}),`
`,(0,c.jsx)(t.p,{children:(0,c.jsx)(t.em,{children:`Import all contexts:`})}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`/* load all the contexts ("light", "dark") of the modifier "theme" */
@import '@infomaniak-design-system/tokens/css/modifiers/theme/all.attr.css';
`})}),`
`,(0,c.jsx)(t.p,{children:(0,c.jsx)(t.em,{children:`Import an individual context:`})}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`/* load the dark theme modifier */
@import '@infomaniak-design-system/tokens/css/modifiers/theme/dark.attr.css';
`})}),`
`,(0,c.jsxs)(t.blockquote,{children:[`
`,(0,c.jsx)(t.p,{children:`[!NOTE]
As a size optimization, we recommend importing only the required modifiers.`}),`
`]}),`
`,(0,c.jsx)(t.h4,{id:`apply`,children:`Apply`}),`
`,(0,c.jsx)(t.p,{children:`Modifiers can be applied to a container element using the associated data attribute:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<body
  data-esds-theme="dark"
  data-esds-product="mail"
>
  <!-- Dark theme and product mail applies to body and children -->
</body>
`})})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};