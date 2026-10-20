import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{h as t,n,t as r,u as i}from"./dist-D5vWbpez.js";import{a,i as o,l as s,n as c,o as l,r as u,s as d,t as f}from"./injectable-style-sheet-BBpgD0Qy.js";var p;function m(){return(m=e((()=>{p=`## Usage

Import and register the custom attribute \`esds-heading\`:

\`\`\`ts
import { EsdsHeadingAttr } from '@infomaniak-design-system/components';

EsdsHeadingAttr.define();
\`\`\`

\`\`\`html
<h3 esds-heading="md">Heading</h3>
\`\`\`

## Description

A custom attribute for styling headings (h1..h6) while preserving native semantics.

Use the \`<strong>\` element to emphasize text within a heading text element, or use the \`emphasized\` attribute on the \`esds-heading\` attribute to apply emphasized styles to the text.

## Demo
`})))()}var h;function g(){return(g=e((()=>{h=`[esds-heading]{font:var(--esds-heading-md-font-base)}[esds-heading=xs]{font:var(--esds-heading-xs-font-base)}[esds-heading=xs][emphasized],[esds-heading=xs] strong{font:var(--esds-heading-xs-font-emphasized)}[esds-heading=sm]{font:var(--esds-heading-sm-font-base)}[esds-heading=sm][emphasized],[esds-heading=sm] strong{font:var(--esds-heading-sm-font-emphasized)}[esds-heading=md]{font:var(--esds-heading-md-font-base)}[esds-heading=md][emphasized],[esds-heading=md] strong{font:var(--esds-heading-md-font-emphasized)}[esds-heading=lg]{font:var(--esds-heading-lg-font-base)}[esds-heading=lg][emphasized],[esds-heading=lg] strong{font:var(--esds-heading-lg-font-emphasized)}[esds-heading=xl]{font:var(--esds-heading-xl-font-base)}[esds-heading=xl][emphasized],[esds-heading=xl] strong{font:var(--esds-heading-xl-font-emphasized)}:is(h1,h2,h3,h4,h5,h6)[esds-heading]{margin-block:var(--esds-heading-margin-block,0);margin-inline:var(--esds-heading-margin-inline,0)}`})))()}var _,v;function y(){return(y=e((()=>{c(),a(),g(),_=f.parse(h),v=class e extends o{static define({registry:t=u.root}={}){t.defineOptionally(`esds-heading`,e)}#e;connectedCallback(){this.#e=_.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{n(),i(),d(),a(),m(),y(),b=l(e=>{v.define({registry:u.of(e.ownerDocument)})}),{args:x,argTypes:S}=r(`esds-heading`),C={title:`Components/Heading`,component:`esds-heading`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:p}}},args:x,argTypes:S},w=[`xs`,`sm`,`md`,`lg`,`xl`],T={...s({text:`This is a heading example`,size:{value:`md`,type:`select`,options:w},emphasized:{value:!1,type:`boolean`}}),render:e=>t`<h1
      ${b}
      esds-heading="${e.size}"
      ?emphasized="${e.emphasized}"
    >
      ${e.text}
    </h1>`},E={...s({size:{value:`md`,type:`select`,options:w}}),render:e=>t`<h1
      ${b}
      esds-heading="${e.size}"
    >
      This is a heading example <strong>with strong content</strong>
    </h1>`},D={...s({text:`This is a heading example`,emphasized:{value:!1,type:`boolean`}}),render:e=>t`
    <h1
      ${b}
      esds-heading="xl"
      ?emphasized="${e.emphasized}"
    >
      ${e.text}
    </h1>
    <h2
      ${b}
      esds-heading="lg"
      ?emphasized="${e.emphasized}"
    >
      ${e.text}
    </h2>
    <h3
      ${b}
      esds-heading="md"
      ?emphasized="${e.emphasized}"
    >
      ${e.text}
    </h3>
    <h4
      ${b}
      esds-heading="sm"
      ?emphasized="${e.emphasized}"
    >
      ${e.text}
    </h4>
    <h5
      ${b}
      esds-heading="xs"
      ?emphasized="${e.emphasized}"
    >
      ${e.text}
    </h5>
  `},O=[`Default`,`WithStrongContent`,`AllSizes`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    text: 'This is a heading example',
    size: {
      value: 'md',
      type: 'select',
      options: HEADER_SIZES
    },
    emphasized: {
      value: false,
      type: 'boolean'
    }
  }),
  render: args => html\`<h1
      \${defineEsdsHeadingAttr}
      esds-heading="\${args.size}"
      ?emphasized="\${args.emphasized}"
    >
      \${args.text}
    </h1>\`
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    size: {
      value: 'md',
      type: 'select',
      options: HEADER_SIZES
    }
  }),
  render: args => html\`<h1
      \${defineEsdsHeadingAttr}
      esds-heading="\${args.size}"
    >
      This is a heading example <strong>with strong content</strong>
    </h1>\`
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    text: 'This is a heading example',
    emphasized: {
      value: false,
      type: 'boolean'
    }
  }),
  render: args => html\`
    <h1
      \${defineEsdsHeadingAttr}
      esds-heading="xl"
      ?emphasized="\${args.emphasized}"
    >
      \${args.text}
    </h1>
    <h2
      \${defineEsdsHeadingAttr}
      esds-heading="lg"
      ?emphasized="\${args.emphasized}"
    >
      \${args.text}
    </h2>
    <h3
      \${defineEsdsHeadingAttr}
      esds-heading="md"
      ?emphasized="\${args.emphasized}"
    >
      \${args.text}
    </h3>
    <h4
      \${defineEsdsHeadingAttr}
      esds-heading="sm"
      ?emphasized="\${args.emphasized}"
    >
      \${args.text}
    </h4>
    <h5
      \${defineEsdsHeadingAttr}
      esds-heading="xs"
      ?emphasized="\${args.emphasized}"
    >
      \${args.text}
    </h5>
  \`
}`,...D.parameters?.docs?.source}}}})))()}k();export{D as AllSizes,T as Default,E as WithStrongContent,O as __namedExportsOrder,C as default};