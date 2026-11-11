import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,p as i,t as a,w as o}from"./dist-B4SFml0u.js";import{r as s,t as c}from"./if-defined-DYgFDik5.js";import{n as l}from"./storybook-interactive-controls-Cso4u3kZ.js";import{o as u,r as d,t as f}from"./define-component-Z-wd0EWj.js";var p;function m(){return(m=e((()=>{p=`- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2671-6&p=f&t=0Y9wp336CpvkcrCz-0)

## Usage

Import and register the custom element \`esds-badge\`:

\`\`\`ts
import { EsdsBadgeComponent } from '@infomaniak-design-system/components';

EsdsBadgeComponent.define();
\`\`\`

\`\`\`html
<esds-badge>3</esds-badge>
\`\`\`

## Description

Represents a badge. If no content is provided, the badge will be compacted as a small _dot_.

### Styles

#### Types

List of all available badge types:

- \`primary\` (default): primary style
- \`neutral\`: neutral style

##### Import

To import all badge types:

\`\`\`css
@import '@infomaniak-design-system/tokens/css/modifiers/badge-type/all.attr.css';
\`\`\`

Or individually:

\`\`\`css
@import '@infomaniak-design-system/tokens/css/modifiers/badge-type/[type].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/badge-type/primary.attr.css'; */
\`\`\`

##### Apply

Add the attribute \`data-esds-badge-type="[type]"\` to apply a badge type:

\`\`\`html
<esds-badge data-esds-badge-type="primary">3</esds-badge>
\`\`\`

## Demo
`})))()}var h;function g(){return(g=e((()=>{h=`:host{box-sizing:border-box;min-width:var(--esds-badge-size-content);height:var(--esds-badge-size-content);border-radius:var(--esds-badge-border-radius);padding-inline:var(--esds-badge-padding-inline);padding-block:var(--esds-badge-padding-block);font:var(--esds-badge-content-font);color:var(--esds-badge-content-color);background-color:var(--esds-badge-background-color);justify-content:center;align-items:center;display:inline-flex}:host slot{display:contents}:host(:empty){width:var(--esds-badge-size-dot);height:var(--esds-badge-size-dot);min-width:0;padding:0}`})))()}var _;function v(){return(v=e((()=>{d(),n(),g(),_=class extends u(i){static define(){f(`esds-badge`,this)}static styles=o(h);connectedCallback(){super.connectedCallback(),this.hasAttribute(`role`)||this.setAttribute(`role`,`status`)}render(){return t`<slot></slot>`}}})))()}var y,b,x,S,C,w,T;function E(){return(E=e((()=>{r(),n(),c(),m(),v(),_.define(),{args:y,argTypes:b}=a(`esds-badge`),x={title:`Components/Badge`,component:`esds-badge`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:p}}},args:y,argTypes:b},S={badgeType:{value:`primary`,type:`select`,options:[`primary`,`neutral`]}},C={...l({...S}),args:{"default-slot":`3`},render:e=>t`<esds-badge data-esds-badge-type=${s(e.badgeType)}
      >${e[`default-slot`]}</esds-badge
    >`},w={...l({...S}),render:e=>t`<esds-badge data-esds-badge-type=${s(e.badgeType)}></esds-badge>`},T=[`Default`,`Empty`],C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls
  }),
  args: {
    'default-slot': '3'
  },
  render: args => html\`<esds-badge data-esds-badge-type=\${ifDefined(args.badgeType)}
      >\${args['default-slot']}</esds-badge
    >\`
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls
  }),
  render: args => html\`<esds-badge data-esds-badge-type=\${ifDefined(args.badgeType)}></esds-badge>\`
}`,...w.parameters?.docs?.source}}}})))()}E();export{C as Default,w as Empty,T as __namedExportsOrder,x as default};