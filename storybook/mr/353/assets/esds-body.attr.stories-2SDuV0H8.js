import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{h as t,n,t as r,u as i}from"./dist-D5vWbpez.js";import{a,i as o,l as s,n as c,o as l,r as u,s as d,t as f}from"./injectable-style-sheet-BBpgD0Qy.js";var p;function m(){return(m=e((()=>{p=`## Usage

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

Use the \`<strong>\` element to emphasize text within a body text element, or use the \`emphasized\` attribute on the \`esds-body\` attribute to apply emphasized styles to the text.

## Demo
`})))()}var h;function g(){return(g=e((()=>{h=`[esds-body]{font:var(--esds-body-font)}[esds-body=xs]{--esds-body-font:var(--esds-body-xs-font-base)}[esds-body=xs][emphasized],[esds-body=xs] strong{--esds-body-font:var(--esds-body-xs-font-emphasized)}[esds-body=sm]{--esds-body-font:var(--esds-body-sm-font-base)}[esds-body=sm][emphasized],[esds-body=sm] strong{--esds-body-font:var(--esds-body-sm-font-emphasized)}[esds-body=md],strong{--esds-body-font:var(--esds-body-md-font-base)}:is([esds-body=md],strong)[emphasized],:is([esds-body=md],strong) strong{--esds-body-font:var(--esds-body-md-font-emphasized)}[esds-body=lg]{--esds-body-font:var(--esds-body-lg-font-base)}[esds-body=lg][emphasized],[esds-body=lg] strong{--esds-body-font:var(--esds-body-lg-font-emphasized)}p[esds-body]{margin-block:var(--esds-body-margin-block,0);margin-inline:var(--esds-body-margin-inline,0)}`})))()}var _,v;function y(){return(y=e((()=>{c(),a(),g(),_=f.parse(h),v=class e extends o{static define({registry:t=u.root}={}){t.defineOptionally(`esds-body`,e)}#e;connectedCallback(){this.#e=_.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{n(),i(),d(),a(),m(),y(),b=l(e=>{v.define({registry:u.of(e.ownerDocument)})}),{args:x,argTypes:S}=r(`esds-body`),C={title:`Components/Body`,component:`esds-body`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:p}}},args:x,argTypes:S},w={...s({text:`This is a body example`,size:{value:`md`,type:`select`,options:[`xs`,`sm`,`md`,`lg`]},emphasized:{value:!1,type:`boolean`}}),render:e=>t`<p
      ${b}
      esds-body="${e.size}"
      ?emphasized="${e.emphasized}"
    >
      ${e.text}
    </p>`},T={...s({size:{value:`md`,type:`select`,options:[`xs`,`sm`,`md`,`lg`]}}),render:e=>t`<p
      ${b}
      esds-body="${e.size}"
    >
      This is a body example <strong>with strong content</strong>
    </p>`},E={...s({text:`This is a body example`,emphasized:{value:!1,type:`boolean`}}),render:e=>t`
    ${[`xs`,`sm`,`md`,`lg`].map(n=>t`<p
        ${b}
        esds-body="${n}"
        ?emphasized="${e.emphasized}"
      >
        ${e.text}
      </p>`)}
  `},D=[`Default`,`WithStrongContent`,`AllSizes`],w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    text: 'This is a body example',
    size: {
      value: 'md',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg']
    },
    emphasized: {
      value: false,
      type: 'boolean'
    }
  }),
  render: args => html\`<p
      \${defineEsdsBodyAttr}
      esds-body="\${args.size}"
      ?emphasized="\${args.emphasized}"
    >
      \${args.text}
    </p>\`
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
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
      This is a body example <strong>with strong content</strong>
    </p>\`
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    text: 'This is a body example',
    emphasized: {
      value: false,
      type: 'boolean'
    }
  }),
  render: args => html\`
    \${['xs', 'sm', 'md', 'lg'].map(size => {
    return html\`<p
        \${defineEsdsBodyAttr}
        esds-body="\${size}"
        ?emphasized="\${args.emphasized}"
      >
        \${args.text}
      </p>\`;
  })}
  \`
}`,...E.parameters?.docs?.source}}}})))()}O();export{E as AllSizes,w as Default,T as WithStrongContent,D as __namedExportsOrder,C as default};