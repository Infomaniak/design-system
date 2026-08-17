import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{h as t,n,t as r,u as i}from"./dist-DZFPJ7uS.js";import{a,i as o,l as s,n as c,o as l,r as u,s as d,t as f}from"./injectable-style-sheet-C8jXo_XB.js";var p;function m(){return(m=e((()=>{p=`## Usage

Import and register the custom attribute \`esds-heading\`:

\`\`\`ts
import { EsdsHeadingAttr } from '@infomaniak-design-system/components';

EsdsHeadingAttr.define();
\`\`\`

\`\`\`html
<h3 esds-heading="md">Heading</h3>
\`\`\`

## Description

A custom attribute for styling headings (h1..h6) while preserving native semantic.

## Demo
`})))()}var h;function g(){return(g=e((()=>{h=`[esds-heading]{font:var(--esds-heading-font)}[esds-heading=xs]{--esds-heading-font:var(--esds-heading-xs-font)}[esds-heading=sm]{--esds-heading-font:var(--esds-heading-sm-font)}[esds-heading=md]{--esds-heading-font:var(--esds-heading-md-font)}[esds-heading=lg]{--esds-heading-font:var(--esds-heading-lg-font)}[esds-heading=xl]{--esds-heading-font:var(--esds-heading-xl-font)}:is(h1,h2,h3,h4,h5,h6)[esds-heading]{margin-block:var(--esds-heading-margin-block,0);margin-inline:var(--esds-heading-margin-inline,0)}`})))()}var _,v;function y(){return(y=e((()=>{c(),a(),g(),_=f.parse(h),v=class e extends o{static define({registry:t=u.root}={}){t.defineOptionally(`esds-heading`,e)}#e;connectedCallback(){this.#e=_.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),i(),d(),a(),m(),y(),b=l(e=>{v.define({registry:u.of(e.ownerDocument)})}),{args:x,argTypes:S}=r(`esds-heading`),C={title:`Components/Heading`,component:`esds-heading`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:p}}},args:x,argTypes:S},w={...s({text:`This is a heading example`,size:{value:`md`,type:`select`,options:[`xs`,`sm`,`md`,`lg`,`xl`]}}),render:e=>t`<h1
      ${b}
      esds-heading="${e.size}"
    >
      ${e.text}
    </h1>`},T={...s({text:`This is a heading example`}),render:e=>t`
    <h1
      ${b}
      esds-heading="xl"
    >
      ${e.text}
    </h1>
    <h2
      ${b}
      esds-heading="lg"
    >
      ${e.text}
    </h2>
    <h3
      ${b}
      esds-heading="md"
    >
      ${e.text}
    </h3>
    <h4
      ${b}
      esds-heading="sm"
    >
      ${e.text}
    </h4>
    <h5
      ${b}
      esds-heading="xs"
    >
      ${e.text}
    </h5>
  `},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    text: 'This is a heading example',
    size: {
      value: 'md',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    }
  }),
  render: args => html\`<h1
      \${defineEsdsHeadingAttr}
      esds-heading="\${args.size}"
    >
      \${args.text}
    </h1>\`
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    text: 'This is a heading example'
  }),
  render: args => html\`
    <h1
      \${defineEsdsHeadingAttr}
      esds-heading="xl"
    >
      \${args.text}
    </h1>
    <h2
      \${defineEsdsHeadingAttr}
      esds-heading="lg"
    >
      \${args.text}
    </h2>
    <h3
      \${defineEsdsHeadingAttr}
      esds-heading="md"
    >
      \${args.text}
    </h3>
    <h4
      \${defineEsdsHeadingAttr}
      esds-heading="sm"
    >
      \${args.text}
    </h4>
    <h5
      \${defineEsdsHeadingAttr}
      esds-heading="xs"
    >
      \${args.text}
    </h5>
  \`
}`,...T.parameters?.docs?.source}}},E=[`Default`,`AllSizes`]})))()}D();export{T as AllSizes,w as Default,E as __namedExportsOrder,C as default};