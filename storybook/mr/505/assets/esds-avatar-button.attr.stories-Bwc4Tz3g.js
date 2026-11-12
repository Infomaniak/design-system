import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{n as a}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as o,n as s,o as c,r as l,s as u,t as d}from"./injectable-style-sheet-CJbmy-p9.js";import{n as f,t as p}from"./esds-headless-button.attr-ClYGAG0e.js";var m;function h(){return(h=e((()=>{m=`[Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2854-2&p=f&t=utLUqVyj1askiodz-0)

## Usage

Import and register the custom attribute \`esds-avatar-button\`:

\`\`\`ts
import { EsdsAvatarButtonAttr } from '@infomaniak-design-system/components';

EsdsAvatarButtonAttr.define();
\`\`\`

\`\`\`html
<button
  esds-avatar-button
  data-esds-avatar-size="large"
>
  <esds-avatar
    shape="square"
    initials="AB"
  ></esds-avatar>
</button>
\`\`\`

> [!NOTE]
> The \`data-esds-avatar-size\` **MUST** be placed on the \`button\` instead of the \`avatar\`.
>
> On this POC branch the \`esds-avatar\` component is not present (it lives in PR #457): render any
> content instead.

## Description

A wrapper to create a _button_ around an avatar.

It inherits the same **behavior** as the [esds-headless-button](./?path=/docs/components-headless-button--docs) attribute and owns the avatar-button look.

## Demo
`})))()}var g;function _(){return(_=e((()=>{g=`[esds-avatar-button]{--esds-avatar-border-radius-circle:9999px;--esds-avatar-border-radius-square:8px;--esds-avatar-button-transition:.15s linear 0s;appearance:none;color:inherit;font:inherit;box-sizing:border-box;border-radius:var(--esds-focus-border-radius);--esds-focus-border-radius:var(--esds-avatar-border-radius-circle);background:0 0;border:none;justify-content:center;align-items:center;margin:0;padding:0;text-decoration:none;display:inline-flex}[esds-avatar-button]>esds-avatar{transition:background-color var(--esds-avatar-button-transition), opacity var(--esds-avatar-button-transition)}[esds-avatar-button]>esds-avatar:after{transition:background-color var(--esds-avatar-button-transition)}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[image]:not([image=""]),[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[image]:not([image=""]){background-color:var(--esds-avatar-background-color);position:relative}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[image]:not([image=""]):after,[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[image]:not([image=""]):after{content:"";background-color:#0000;position:absolute;inset:0}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar:not([image]:not([image=""])){background-color:color-mix(in srgb, rgb(from var(--esds-avatar-color-state-hover) r g b/100%) calc(var(--esds-avatar-color-state-hover-a) * 100%), rgb(from var(--esds-avatar-background-color) r g b/100%) calc(var(--esds-avatar-background-color-a) * (1 - var(--esds-avatar-color-state-hover-a)) * 100%))}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[image]:not([image=""]):after{background-color:var(--esds-avatar-color-state-hover)}[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar:not([image]:not([image=""])){background-color:color-mix(in srgb, rgb(from var(--esds-avatar-color-state-pressed) r g b/100%) calc(var(--esds-avatar-color-state-pressed-a) * 100%), rgb(from var(--esds-avatar-background-color) r g b/100%) calc(var(--esds-avatar-background-color-a) * (1 - var(--esds-avatar-color-state-pressed-a)) * 100%))}[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[image]:not([image=""]):after{background-color:var(--esds-avatar-color-state-pressed)}[esds-avatar-button]:is(:disabled,[disabled])>esds-avatar{background-color:var(--esds-avatar-background-color-disabled);color:var(--esds-avatar-content-color-disabled)}[esds-avatar-button]:is(:disabled,[disabled])>esds-avatar[image]:not([image=""]){opacity:var(--esds-avatar-opacity-disabled)}[esds-avatar-button]:has(>esds-avatar[shape=square]){--esds-focus-border-radius:var(--esds-avatar-border-radius-square)}`})))()}var v,y;function b(){return(b=e((()=>{s(),o(),f(),_(),v=d.parse(g),y=class e extends p{static define({registry:t=l.root}={}){t.defineOptionally(`esds-avatar-button`,e),p.define()}#e;connectedCallback(){super.connectedCallback(),this.#e=v.injectFrom(this.ownerElement)}disconnectedCallback(){super.disconnectedCallback(),this.#e?.(),this.#e=void 0}}})))()}var x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{r(),n(),u(),o(),h(),b(),x=c(e=>{y.define({registry:l.of(e.ownerDocument)})}),{args:S,argTypes:C}=i(`esds-avatar-button`),w={title:`Components/Avatar/Avatar Button`,component:`esds-avatar-button`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:m}}},args:S,argTypes:C},T={disabled:{value:!1,type:`boolean`},loading:{value:!1,type:`boolean`}},E={...a({...T,initials:`AB`}),parameters:{docs:{description:{story:"POC forward-port: renders a plain span instead of the `esds-avatar` component (absent on this branch). The hover/pressed/disabled styles targeting the avatar child are inactive here."}}},render:e=>t`<button
      ${x}
      esds-avatar-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      <span>${e.initials}</span>
    </button>`},D={...a({...T,initials:`AB`,href:`https://infomaniak.com`}),render:e=>t`<a
      ${x}
      esds-avatar-button
      href="${e.href}"
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      <span>${e.initials}</span>
    </a>`},O=[`Default`,`Link`],E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls,
    initials: 'AB'
  }),
  parameters: {
    docs: {
      description: {
        story: 'POC forward-port: renders a plain span instead of the \`esds-avatar\` component (absent on this branch). The hover/pressed/disabled styles targeting the avatar child are inactive here.'
      }
    }
  },
  render: args => html\`<button
      \${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      ?disabled=\${args.disabled}
      ?loading=\${args.loading}
    >
      <span>\${args.initials}</span>
    </button>\`
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls,
    initials: 'AB',
    href: 'https://infomaniak.com'
  }),
  render: args => html\`<a
      \${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      href="\${args.href}"
      ?disabled=\${args.disabled}
      ?loading=\${args.loading}
    >
      <span>\${args.initials}</span>
    </a>\`
}`,...D.parameters?.docs?.source}}}})))()}k();export{E as Default,D as Link,O as __namedExportsOrder,w as default};