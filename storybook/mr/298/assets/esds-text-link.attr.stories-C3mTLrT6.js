import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{h as t,n,t as r,u as i}from"./dist-DZFPJ7uS.js";import{i as a,o}from"./iframe-IjM3ZDPs.js";import{a as s,i as c,l,n as u,o as d,r as f,s as p,t as m}from"./injectable-style-sheet-C8jXo_XB.js";var h;function g(){return(g=e((()=>{h=`- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=1473-1429&t=ZWopR2KZ2XXD2MTX-0)

## Usage

Import and register the custom attribute \`esds-text-link\`:

\`\`\`ts
import { EsdsTextLinkAttr } from '@infomaniak-design-system/components';

EsdsTextLinkAttr.define();
\`\`\`

\`\`\`html
<a
  esds-text-link
  href="https://example.com"
>
  Link text
</a>
\`\`\`

> [!WARNING]
> It is expected that the \`<a esds-text-link>\` element is used as a **child** of a _text container_ like a \`<p>\`, \`<li>\`, \`<td>\` element.
> It is not intended to be used as a standalone/isolated element like a button.

\`\`\`html
<p>
  You have no products.
  <a
    esds-text-link
    href="https://shop.example.com"
    >Go to the shop</a
  >
  and order some.
</p>
\`\`\`

## Description

Adding the custom attribute \`esds-text-link\` to an \`<a>\` element, applies the \`esds-text-link\` styles to this element.

> [!NOTE]
> The \`<a>\` element may be used as any other \`<a>\` element.

## Demo
`})))()}var _;function v(){return(v=e((()=>{_=`[esds-text-link]{color:var(--esds-text-link-color-default);text-decoration:none;display:inline}[esds-text-link]:focus-visible{outline-offset:2px;outline:2px solid}[esds-text-link]:hover{color:var(--esds-text-link-color-hover)}[esds-text-link]:active{color:var(--esds-text-link-color-pressed)}[esds-text-link]:visited{color:var(--esds-text-link-color-visited-default)}[esds-text-link]:visited:hover{color:var(--esds-text-link-color-visited-hover)}[esds-text-link]:visited:active{color:var(--esds-text-link-color-visited-pressed)}[esds-text-link][underline]{text-decoration:underline}`})))()}var y,b;function x(){return(x=e((()=>{u(),s(),v(),y=m.parse(_),b=class e extends c{static define({registry:t=f.root}={}){t.defineOptionally(`esds-text-link`,e)}#e;constructor(e){if(e.ownerElement?.tagName!==`A`)throw Error(`esds-text-link attribute can only be used on <a> elements`);super(e)}connectedCallback(){this.#e=y.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{o(),n(),i(),p(),s(),g(),x(),a.define(),S=d(e=>{b.define({registry:f.of(e.ownerDocument)})}),{args:C,argTypes:w}=r(`esds-text-link`),T={title:`Components/Link`,component:`esds-text-link`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:h}}},args:C,argTypes:w},E={...l({href:`https://infomaniak.com`}),render:e=>t`<a
      ${S}
      esds-text-link
      href="${e.href}"
      >Text link</a
    >`},D={...l({href:`https://infomaniak.com`,target:`_blank`,rel:`noopener noreferrer nofollow`}),render:e=>t`
    <a
      ${S}
      esds-text-link
      href="${e.href}"
      target="${e.target}"
      rel="${e.rel}"
      >Opens in new tab</a
    >
  `},O={...l({href:`/some-file.pdf`,download:`my-file.pdf`}),render:e=>t`
    <a
      ${S}
      esds-text-link
      href="${e.href}"
      download="${e.download}"
    >
      Download file
    </a>
  `},k={render:()=>t`
    <a
      ${S}
      esds-text-link
      href="https://infomaniak.com"
      target="_blank"
    >
      Infomaniak
      <esds-icon
        name="esds:square-arrow-out-up-right"
        inline
      ></esds-icon>
    </a>
  `},A={...l({href:`https://infomaniak.com`}),parameters:{docs:{description:{story:`Add the **underline** attribute to add an _underline_ effect on the link.`}}},render:e=>t`
    <a
      ${S}
      esds-text-link
      underline
      href="${e.href}"
    >
      Link with underline
    </a>
  `},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    href: 'https://infomaniak.com'
  }),
  render: args => html\`<a
      \${defineEsdsLinkAttr}
      esds-text-link
      href="\${args.href}"
      >Text link</a
    >\`
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    href: 'https://infomaniak.com',
    target: '_blank',
    rel: 'noopener noreferrer nofollow'
  }),
  render: args => html\`
    <a
      \${defineEsdsLinkAttr}
      esds-text-link
      href="\${args.href}"
      target="\${args.target}"
      rel="\${args.rel}"
      >Opens in new tab</a
    >
  \`
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    href: '/some-file.pdf',
    download: 'my-file.pdf'
  }),
  render: args => html\`
    <a
      \${defineEsdsLinkAttr}
      esds-text-link
      href="\${args.href}"
      download="\${args.download}"
    >
      Download file
    </a>
  \`
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <a
      \${defineEsdsLinkAttr}
      esds-text-link
      href="https://infomaniak.com"
      target="_blank"
    >
      Infomaniak
      <esds-icon
        name="esds:square-arrow-out-up-right"
        inline
      ></esds-icon>
    </a>
  \`
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    href: 'https://infomaniak.com'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Add the **underline** attribute to add an _underline_ effect on the link.'
      }
    }
  },
  render: args => html\`
    <a
      \${defineEsdsLinkAttr}
      esds-text-link
      underline
      href="\${args.href}"
    >
      Link with underline
    </a>
  \`
}`,...A.parameters?.docs?.source}}},j=[`Default`,`External`,`Download`,`WithIcon`,`Underline`]})))()}M();export{E as Default,O as Download,D as External,A as Underline,k as WithIcon,j as __namedExportsOrder,T as default};