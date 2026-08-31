import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{h as t,n,t as r,u as i}from"./dist-HdtEXM6g.js";import{a,i as o,l as s,n as c,o as l,r as u,s as d,t as f}from"./injectable-style-sheet-AWu4pPpv.js";var p;function m(){return(m=e((()=>{p=`## Usage

Import and register the custom attribute \`esds-body\`:

\`\`\`ts
import { EsdsBodyAttr } from '@infomaniak-design-system/components';

EsdsBodyAttr.define();
\`\`\`

\`\`\`html
<p esds-body="md">Body</p>
\`\`\`

## Description

A custom attribute for applying body text styles to elements while preserving native semantics.

## Demo
`})))()}var h;function g(){return(g=e((()=>{h=`[esds-body]{font:var(--esds-body-font)}[esds-body=xs]{--esds-body-font:var(--esds-body-xs-font)}[esds-body=sm]{--esds-body-font:var(--esds-body-sm-font)}[esds-body=md]{--esds-body-font:var(--esds-body-md-font)}[esds-body=lg]{--esds-body-font:var(--esds-body-lg-font)}p[esds-body]{margin-block:var(--esds-body-margin-block,0);margin-inline:var(--esds-body-margin-inline,0)}`})))()}var _,v;function y(){return(y=e((()=>{c(),a(),g(),_=f.parse(h),v=class e extends o{static define({registry:t=u.root}={}){t.defineOptionally(`esds-body`,e)}#e;connectedCallback(){this.#e=_.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),i(),d(),a(),m(),y(),b=l(e=>{v.define({registry:u.of(e.ownerDocument)})}),{args:x,argTypes:S}=r(`esds-body`),C={title:`Components/Body`,component:`esds-body`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:p}}},args:x,argTypes:S},w={...s({text:`This is a body example`,size:{value:`md`,type:`select`,options:[`xs`,`sm`,`md`,`lg`]}}),render:e=>t`<p
      ${b}
      esds-body="${e.size}"
    >
      ${e.text}
    </p>`},T={...s({text:`This is a body example`}),render:e=>t`
    <p
      ${b}
      esds-body="lg"
    >
      ${e.text}
    </p>
    <p
      ${b}
      esds-body="md"
    >
      ${e.text}
    </p>
    <p
      ${b}
      esds-body="sm"
    >
      ${e.text}
    </p>
    <p
      ${b}
      esds-body="xs"
    >
      ${e.text}
    </p>
  `},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    text: 'This is a body example',
    size: {
      value: 'md',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg']
    }
  }),
  render: args => html\`<p
      \${defineEsdsBodyAttr}
      esds-body="\${args.size}"
    >
      \${args.text}
    </p>\`
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    text: 'This is a body example'
  }),
  render: args => html\`
    <p
      \${defineEsdsBodyAttr}
      esds-body="lg"
    >
      \${args.text}
    </p>
    <p
      \${defineEsdsBodyAttr}
      esds-body="md"
    >
      \${args.text}
    </p>
    <p
      \${defineEsdsBodyAttr}
      esds-body="sm"
    >
      \${args.text}
    </p>
    <p
      \${defineEsdsBodyAttr}
      esds-body="xs"
    >
      \${args.text}
    </p>
  \`
}`,...T.parameters?.docs?.source}}},E=[`Default`,`AllSizes`]})))()}D();export{T as AllSizes,w as Default,E as __namedExportsOrder,C as default};