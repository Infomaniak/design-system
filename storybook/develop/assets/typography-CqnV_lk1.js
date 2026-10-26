import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,l as n,s as r}from"./blocks-BgcQL0-E.js";import{a as i}from"./chunk-W22LQPXL-mcUkC8rZ.js";import{i as a,r as o}from"./react-BXJ34t_g.js";import{a as s,i as c}from"./iframe-s1uhpjk8.js";function l(e){let n={a:`a`,blockquote:`blockquote`,code:`code`,del:`del`,em:`em`,h1:`h1`,h2:`h2`,h3:`h3`,h4:`h4`,p:`p`,pre:`pre`,span:`span`,strong:`strong`,sub:`sub`,sup:`sup`,...a(),...e.components},{FontPreview:i,Table:o}=n;return i||d(`FontPreview`,!0),o||d(`Table`,!0),(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(r,{title:`Typography`}),`
`,(0,f.jsx)(n.h1,{id:`typography`,children:`Typography`}),`
`,(0,f.jsx)(n.p,{children:`This page describes the typography basics of the design system.`}),`
`,(0,f.jsx)(n.h2,{id:`font-family`,children:`Font Family`}),`
`,(0,f.jsxs)(n.p,{children:[`The main font family is "`,(0,f.jsx)(n.strong,{children:`Infomaniak Sans`}),`".`]}),`
`,(0,f.jsx)(n.p,{children:`It is available in different font weights.`}),`
`,(0,f.jsxs)(`table`,{children:[(0,f.jsxs)(`tr`,{children:[(0,f.jsx)(`td`,{style:{fontWeight:`var(--esds-font-weight-regular)`},children:(0,f.jsx)(i,{})}),(0,f.jsx)(`td`,{children:`font.weight.regular`})]}),(0,f.jsxs)(`tr`,{children:[(0,f.jsx)(`td`,{style:{fontWeight:`var(--esds-font-weight-medium)`},children:(0,f.jsx)(i,{})}),(0,f.jsx)(`td`,{children:`font.weight.medium`})]})]}),`
`,(0,f.jsxs)(n.blockquote,{children:[`
`,(0,f.jsxs)(n.p,{children:[`Installing the font locally to use it in Figma or another desktop app? Follow the
`,(0,f.jsx)(n.a,{href:`./?path=/docs/designers-guide-install-the-font--docs`,children:`Install the Font`}),` guide.`]}),`
`]}),`
`,(0,f.jsx)(n.h3,{id:`usage`,children:`Usage`}),`
`,(0,f.jsxs)(n.p,{children:[`The fonts are distributed by our S3 server: `,(0,f.jsx)(n.code,{children:`https://fonts.storage.infomaniak.com/design-system/latest/infomaniak-sans.min.css`}),`.`]}),`
`,(0,f.jsx)(n.h4,{id:`html`,children:`HTML`}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-html`,children:`<link
  rel="stylesheet"
  href="https://fonts.storage.infomaniak.com/design-system/latest/infomaniak-sans.min.css"
/>
`})}),`
`,(0,f.jsx)(n.h4,{id:`css`,children:`CSS`}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-css`,children:`@import 'https://fonts.storage.infomaniak.com/design-system/latest/infomaniak-sans.min.css';
`})}),`
`,(0,f.jsx)(n.h3,{id:`applying-the-font`,children:`Applying the font`}),`
`,(0,f.jsxs)(n.p,{children:[`Use the CSS variable `,(0,f.jsx)(n.code,{children:`--esds-font-family-base`}),` to apply the font to the `,(0,f.jsx)(n.code,{children:`<html>`}),` element:`]}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-css`,children:`html {
  font-family: var(--esds-font-family-base), sans-serif;
}
`})}),`
`,(0,f.jsxs)(n.blockquote,{children:[`
`,(0,f.jsxs)(n.p,{children:[`It's a good practice to apply the font-family to the `,(0,f.jsx)(n.code,{children:`<html>`}),` element, as it allows you to later use a different font-family based on the user's language.`]}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-css`,children:`html[lang^='zh-'] {
  font-family: var(--esds-font-family-zh), sans-serif;
}
`})}),`
`]}),`
`,(0,f.jsx)(n.h2,{id:`font-sizes--line-heights`,children:`Font Sizes & Line Heights`}),`
`,(0,f.jsx)(n.h3,{id:`base-font-size`,children:`Base Font Size`}),`
`,(0,f.jsxs)(n.p,{children:[`The default font size is `,(0,f.jsx)(n.code,{children:`16px`}),`. This corresponds to the CSS value of `,(0,f.jsx)(n.code,{children:`1rem`}),`.
Users are able to change the default font size in their browser.
By using `,(0,f.jsx)(n.code,{children:`rem`}),`, the font-sizes scale nicely with the user defined value.`]}),`
`,(0,f.jsx)(n.h3,{id:`tokens`,children:`Tokens`}),`
`,(0,f.jsxs)(n.p,{children:[(0,f.jsx)(n.a,{href:`./?path=/docs/design-tokens-t2-text--docs`,children:`Text tokens`}),` (font sizes and line-heights) are defined by the `,(0,f.jsx)(n.code,{children:`text.{xs..5xl}.{size|line-height|letter-spacing}`}),` design tokens.`]}),`
`,(0,f.jsx)(n.h2,{id:`typography-1`,children:`Typography`}),`
`,(0,f.jsxs)(n.p,{children:[(0,f.jsx)(n.a,{href:`./?path=/docs/design-tokens-t2-typography--docs`,children:`Typography tokens`}),` group the font family, size, weight, etc. into a single token: `,(0,f.jsx)(n.code,{children:`typography.{xs..5xl}.{base|emphasized}`}),`.`]}),`
`,(0,f.jsx)(n.p,{children:`It makes it easier to apply the expected font:`}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-css`,children:`font: var(--esds-typography-md-base);
`})}),`
`,(0,f.jsx)(n.h2,{id:`elements`,children:`Elements`}),`
`,(0,f.jsx)(n.h3,{id:`headings`,children:`Headings`}),`
`,(0,f.jsx)(n.p,{children:`Headings are used to break up content into sections to provide a clear hierarchy of information.`}),`
`,(0,f.jsxs)(n.h4,{id:`custom-attribute-recommended`,children:[`Custom attribute `,(0,f.jsx)(n.em,{children:`(recommended)`})]}),`
`,(0,f.jsxs)(n.p,{children:[`The `,(0,f.jsx)(n.a,{href:`./?path=/docs/components-heading--docs`,children:`esds-heading`}),` attribute `,(0,f.jsx)(n.strong,{children:`must`}),` be used to apply `,(0,f.jsx)(n.code,{children:`heading`}),` text styles to elements:`]}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-html`,children:`<h1 esds-heading="xl">Large text</h1>
`})}),`
`,(0,f.jsx)(n.h4,{id:`tailwind`,children:`Tailwind`}),`
`,(0,f.jsxs)(n.p,{children:[`On projects using Tailwind-based UI elements, we provide the custom class `,(0,f.jsx)(n.code,{children:`esds-heading-*`}),` to apply `,(0,f.jsx)(n.code,{children:`heading`}),` text styles to elements:`]}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-html`,children:`<h1 class="esds-heading-xl">Large text</h1>
`})}),`
`,(0,f.jsxs)(n.p,{children:[`For `,(0,f.jsx)(n.code,{children:`emphasized`}),` text, you may use the `,(0,f.jsx)(n.code,{children:`esds-heading-{xs..xl}-emphasized`}),` class.`]}),`
`,(0,f.jsx)(n.h4,{id:`tokens-1`,children:`Tokens`}),`
`,(0,f.jsxs)(n.p,{children:[(0,f.jsx)(n.a,{href:`./?path=/docs/design-tokens-t3-heading--docs`,children:`Heading tokens`}),` are defined by the `,(0,f.jsx)(n.code,{children:`heading.{xs..xl}.{font}`}),` design tokens, and are used by the `,(0,f.jsx)(n.code,{children:`esds-heading`}),` custom attribute.`]}),`
`,(0,f.jsx)(n.p,{children:`Here's an example of how to apply raw styles:`}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-html`,children:`<h1 style="font: var(--esds-heading-xl-font)">Heading 1</h1>
`})}),`
`,(0,f.jsx)(n.h3,{id:`body-text`,children:`Body Text`}),`
`,(0,f.jsx)(n.p,{children:`Body texts are used as blocks or lines of text.`}),`
`,(0,f.jsxs)(n.h4,{id:`custom-attribute-recommended-1`,children:[`Custom attribute `,(0,f.jsx)(n.em,{children:`(recommended)`})]}),`
`,(0,f.jsxs)(n.p,{children:[`The `,(0,f.jsx)(n.a,{href:`./?path=/docs/components-body--docs`,children:`esds-body`}),` attribute `,(0,f.jsx)(n.strong,{children:`must`}),` be used to apply `,(0,f.jsx)(n.code,{children:`body`}),` text styles to elements:`]}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-html`,children:`<p esds-body="md">
  This is a sample paragraph showing how text will appear in your application. It demonstrates the
  font style, size, and spacing that will be used throughout your content.
</p>
`})}),`
`,(0,f.jsx)(n.h4,{id:`tailwind-1`,children:`Tailwind`}),`
`,(0,f.jsxs)(n.p,{children:[`On projects using Tailwind-based UI elements, we provide the custom class `,(0,f.jsx)(n.code,{children:`esds-body-*`}),` to apply `,(0,f.jsx)(n.code,{children:`body`}),` text styles to elements:`]}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-html`,children:`<p class="esds-body-sm">
  This is a sample paragraph showing how text will appear in your application. It demonstrates the
  font style, size, and spacing that will be used throughout your content.
</p>
`})}),`
`,(0,f.jsxs)(n.p,{children:[`For `,(0,f.jsx)(n.code,{children:`emphasized`}),` text, you may use the `,(0,f.jsx)(n.code,{children:`esds-body-{xs..lg}-emphasized`}),` class.`]}),`
`,(0,f.jsx)(n.h4,{id:`tokens-2`,children:`Tokens`}),`
`,(0,f.jsxs)(n.p,{children:[(0,f.jsx)(n.a,{href:`./?path=/docs/design-tokens-t3-body--docs`,children:`Body tokens`}),` are defined by the `,(0,f.jsx)(n.code,{children:`body.{xs..lg}.{font}`}),` design tokens, and are used by the `,(0,f.jsx)(n.code,{children:`esds-body`}),` custom attribute.`]}),`
`,(0,f.jsx)(n.p,{children:`Here's an example of how to apply raw styles:`}),`
`,(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-html`,children:`<p style="font: var(--esds-body-md-font)">
  This is a sample paragraph showing how text will appear in your application. It demonstrates the
  font style, size, and spacing that will be used throughout your content.
</p>
`})}),`
`,(0,f.jsx)(n.h3,{id:`text-styles`,children:`Text styles`}),`
`,(0,f.jsx)(o,{headers:[`Text style`,`Code`,`Result`],rows:[[(0,f.jsx)(c,{href:`https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/sup`,children:`Superscript`}),(0,f.jsx)(t,{language:`html`,code:`Infomaniak<sup>TM</sup>`}),(0,f.jsxs)(n.p,{style:{font:`var(--esds-body-md-font)`,margin:0},children:[`Infomaniak`,(0,f.jsx)(n.sup,{children:`TM`})]})],[(0,f.jsx)(c,{href:`https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/sub`,children:`Subscript`}),(0,f.jsx)(t,{language:`html`,code:`H<sub>2</sub>O`}),(0,f.jsxs)(n.p,{style:{font:`var(--esds-body-md-font)`,margin:0},children:[`H`,(0,f.jsx)(n.sub,{children:`2`}),`O`]})],[(0,f.jsx)(c,{href:`https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/em`,children:`Italic`}),(0,f.jsx)(t,{language:`html`,code:`<em>italic</em>`}),(0,f.jsx)(n.p,{style:{font:`var(--esds-body-md-font)`,margin:0},children:(0,f.jsx)(n.em,{children:`italic`})})],[(0,f.jsx)(c,{href:`https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration`,children:`Underlined`}),(0,f.jsx)(t,{language:`html`,code:`<span style="text-decoration: underline">underlined</span>`}),(0,f.jsx)(n.p,{style:{font:`var(--esds-body-md-font)`,margin:0},children:(0,f.jsx)(n.span,{style:{textDecoration:`underline`},children:`underlined`})})],[(0,f.jsx)(c,{href:`https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration`,children:`Underlined Dashed`}),(0,f.jsx)(t,{language:`html`,code:`
          <span
            style="text-decoration: underline dashed;
            text-underline-offset: var(--esds-spacing-2xs)"
          >underlined dashed</span>
        `}),(0,f.jsx)(n.p,{style:{font:`var(--esds-body-md-font)`,margin:0},children:(0,f.jsx)(n.span,{style:{textDecoration:`underline dashed`,textUnderlineOffset:`var(--esds-spacing-2xs)`},children:`underlined dashed`})})],[(0,f.jsx)(c,{href:`https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/del`,children:`Strike Through`}),(0,f.jsx)(t,{language:`html`,code:`<del>deleted</del>`}),(0,f.jsx)(n.p,{style:{font:`var(--esds-body-md-font)`,margin:0},children:(0,f.jsx)(n.del,{children:`deleted`})})],[(0,f.jsx)(c,{href:`https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-transform`,children:`Uppercase`}),(0,f.jsx)(t,{language:`html`,code:`<span style="text-transform: uppercase">uppercase</span>`}),(0,f.jsx)(n.p,{style:{font:`var(--esds-body-md-font)`,margin:0},children:(0,f.jsx)(n.span,{style:{textTransform:`uppercase`},children:`uppercase`})})]]})]})}function u(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,f.jsx)(t,{...e,children:(0,f.jsx)(l,{...e})}):l(e)}function d(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}var f;function p(){return(p=e((()=>{f=i(),o(),n(),s()})))()}p();export{u as default};