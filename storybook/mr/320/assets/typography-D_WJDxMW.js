import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./blocks-Bh_5PVZc.js";import{a as r}from"./chunk-W22LQPXL-Bced4FlR.js";import{i,r as a}from"./react-Bl2r1tuC.js";function o(e){let n={a:`a`,blockquote:`blockquote`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,h4:`h4`,p:`p`,pre:`pre`,strong:`strong`,...i(),...e.components},{FontPreview:r}=n;return r||c(`FontPreview`,!0),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(t,{title:`Typography`}),`
`,(0,l.jsx)(n.h1,{id:`typography`,children:`Typography`}),`
`,(0,l.jsx)(n.p,{children:`This page describes the typography basics of the design system.`}),`
`,(0,l.jsx)(n.h2,{id:`font-family`,children:`Font Family`}),`
`,(0,l.jsxs)(n.p,{children:[`The main font family is "`,(0,l.jsx)(n.strong,{children:`Suisse Int'l`}),`".`]}),`
`,(0,l.jsx)(n.p,{children:`It is available in different font weights.`}),`
`,(0,l.jsxs)(`table`,{children:[(0,l.jsxs)(`tr`,{children:[(0,l.jsx)(`td`,{style:{fontWeight:`var(--esds-font-weight-regular)`},children:(0,l.jsx)(r,{})}),(0,l.jsx)(`td`,{children:`font.weight.regular`})]}),(0,l.jsxs)(`tr`,{children:[(0,l.jsx)(`td`,{style:{fontWeight:`var(--esds-font-weight-medium)`},children:(0,l.jsx)(r,{})}),(0,l.jsx)(`td`,{children:`font.weight.medium`})]})]}),`
`,(0,l.jsx)(n.h3,{id:`usage`,children:`Usage`}),`
`,(0,l.jsxs)(n.blockquote,{children:[`
`,(0,l.jsx)(n.p,{children:`[!WARNING]
This section is not yet available: waiting for the "Infomaniak Sans" font.`}),`
`]}),`
`,(0,l.jsx)(n.h3,{id:`applying-the-font`,children:`Applying the font`}),`
`,(0,l.jsxs)(n.p,{children:[`Use the CSS variable `,(0,l.jsx)(n.code,{children:`--esds-font-family-base`}),` to apply the font to the `,(0,l.jsx)(n.code,{children:`<html>`}),` element:`]}),`
`,(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:`language-css`,children:`html {
  font-family: var(--esds-font-family-base), sans-serif;
}
`})}),`
`,(0,l.jsxs)(n.blockquote,{children:[`
`,(0,l.jsxs)(n.p,{children:[`It's a good practice to apply the font-family to the `,(0,l.jsx)(n.code,{children:`<html>`}),` element, as it allows you to later use a different font-family based on the user's language.`]}),`
`,(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:`language-css`,children:`html[lang^='zh-'] {
  font-family: var(--esds-font-family-zh), sans-serif;
}
`})}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`font-sizes--line-heights`,children:`Font Sizes & Line Heights`}),`
`,(0,l.jsx)(n.h3,{id:`base-font-size`,children:`Base Font Size`}),`
`,(0,l.jsxs)(n.p,{children:[`The default font size is `,(0,l.jsx)(n.code,{children:`16px`}),`. This corresponds to the CSS value of `,(0,l.jsx)(n.code,{children:`1rem`}),`.
Users are able to change the default font size in their browser.
By using `,(0,l.jsx)(n.code,{children:`rem`}),`, the font-sizes scale nicely with the user defined value.`]}),`
`,(0,l.jsx)(n.h3,{id:`tokens`,children:`Tokens`}),`
`,(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.a,{href:`/docs/design-tokens-t2-text--docs`,children:`Text tokens`}),` (font sizes and line-heights) are defined by the `,(0,l.jsx)(n.code,{children:`text.{xs..5xl}.{size|line-height|letter-spacing}`}),` design tokens.`]}),`
`,(0,l.jsx)(n.h2,{id:`typography-1`,children:`Typography`}),`
`,(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.a,{href:`/docs/design-tokens-t2-typography--docs`,children:`Typography tokens`}),` group the font family, size, weight, etc. into a single token: `,(0,l.jsx)(n.code,{children:`typography.{xs..5xl}.{base|emphasized}`}),`.`]}),`
`,(0,l.jsx)(n.p,{children:`It makes it easier to apply the expected font:`}),`
`,(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:`language-css`,children:`font: var(--esds-typography-md-base);
`})}),`
`,(0,l.jsx)(n.h2,{id:`elements`,children:`Elements`}),`
`,(0,l.jsx)(n.h3,{id:`headings`,children:`Headings`}),`
`,(0,l.jsx)(n.p,{children:`Headings are used to break up content into sections to provide a clear hierarchy of information.`}),`
`,(0,l.jsx)(n.h4,{id:`custom-attribute`,children:`Custom attribute`}),`
`,(0,l.jsxs)(n.p,{children:[`The `,(0,l.jsx)(n.a,{href:`/docs/components-heading--docs`,children:`esds-heading`}),` attribute `,(0,l.jsx)(n.strong,{children:`must`}),` be used to apply `,(0,l.jsx)(n.code,{children:`heading`}),` text styles to elements:`]}),`
`,(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:`language-html`,children:`<h1 esds-heading="xl">Large text</h1>
`})}),`
`,(0,l.jsx)(n.h4,{id:`tailwind`,children:`Tailwind`}),`
`,(0,l.jsxs)(n.p,{children:[`On projects using Tailwind-based UI elements, we provide the custom class `,(0,l.jsx)(n.code,{children:`esds-heading-*`}),` to apply `,(0,l.jsx)(n.code,{children:`heading`}),` text styles to elements:`]}),`
`,(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:`language-html`,children:`<h1 class="esds-heading-xl">Large text</h1>
`})}),`
`,(0,l.jsx)(n.h4,{id:`tokens-1`,children:`Tokens`}),`
`,(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.a,{href:`/docs/design-tokens-t3-heading--docs`,children:`Heading tokens`}),` are defined by the `,(0,l.jsx)(n.code,{children:`heading.{xs..xl}.{font}`}),` design tokens, and are used by the `,(0,l.jsx)(n.code,{children:`esds-heading`}),` custom attribute.`]}),`
`,(0,l.jsx)(n.p,{children:`Here's an example of how to apply raw styles:`}),`
`,(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:`language-html`,children:`<h1 style="font: var(--esds-heading-xl-font)">Heading 1</h1>
`})}),`
`,(0,l.jsx)(n.h3,{id:`body-text`,children:`Body Text`}),`
`,(0,l.jsx)(n.p,{children:`Body texts are used as blocks or lines of text.`}),`
`,(0,l.jsx)(n.h4,{id:`custom-attribute-1`,children:`Custom attribute`}),`
`,(0,l.jsxs)(n.p,{children:[`The `,(0,l.jsx)(n.a,{href:`/docs/components-body--docs`,children:`esds-body`}),` attribute `,(0,l.jsx)(n.strong,{children:`must`}),` be used to apply `,(0,l.jsx)(n.code,{children:`body`}),` text styles to elements:`]}),`
`,(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:`language-html`,children:`<p esds-body="md">
  This is a sample paragraph showing how text will appear in your application. It demonstrates the
  font style, size, and spacing that will be used throughout your content.
</p>
`})}),`
`,(0,l.jsx)(n.h4,{id:`tailwind-1`,children:`Tailwind`}),`
`,(0,l.jsxs)(n.p,{children:[`On projects using Tailwind-based UI elements, we provide the custom class `,(0,l.jsx)(n.code,{children:`esds-body-*`}),` to apply `,(0,l.jsx)(n.code,{children:`body`}),` text styles to elements:`]}),`
`,(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:`language-html`,children:`<p class="esds-body-sm">
  This is a sample paragraph showing how text will appear in your application. It demonstrates the
  font style, size, and spacing that will be used throughout your content.
</p>
`})}),`
`,(0,l.jsx)(n.h4,{id:`tokens-2`,children:`Tokens`}),`
`,(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.a,{href:`/docs/design-tokens-t3-body--docs`,children:`Body tokens`}),` are defined by the `,(0,l.jsx)(n.code,{children:`body.{xs..lg}.{font}`}),` design tokens, and are used by the `,(0,l.jsx)(n.code,{children:`esds-body`}),` custom attribute.`]}),`
`,(0,l.jsx)(n.p,{children:`Here's an example of how to apply raw styles:`}),`
`,(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:`language-html`,children:`<p style="font: var(--esds-body-md-font)">
  This is a sample paragraph showing how text will appear in your application. It demonstrates the
  font style, size, and spacing that will be used throughout your content.
</p>
`})})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,l.jsx)(t,{...e,children:(0,l.jsx)(o,{...e})}):o(e)}function c(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}var l;function u(){return(u=e((()=>{l=r(),a(),n()})))()}u();export{s as default};