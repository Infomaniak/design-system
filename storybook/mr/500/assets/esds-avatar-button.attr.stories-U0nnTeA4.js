import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{r as a,t as o}from"./if-defined-DYgFDik5.js";import{n as s}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as c,n as l,o as u,r as d,s as f,t as p}from"./injectable-style-sheet-CJbmy-p9.js";import{a as m,i as h,n as g,t as _}from"./esds-avatar.component-BjGaUncq.js";import{n as v,t as y}from"./esds-button.attr-B9RdiHI5.js";var b;function x(){return(x=e((()=>{b=`[//]: # (- [Figma ↗]&#40;TODO&#41;)

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

## Description

A wrapper to create a _button_ around an avatar.

It inherits the same behavior and properties as the [esds-button](./?path=/docs/components-button--docs).

## Demo
`})))()}var S;function C(){return(C=e((()=>{S=`[esds-avatar-button]{--esds-button-padding-inline:0px;--esds-button-padding-block:0px;--esds-button-gap-row:0px;--esds-button-gap-column:0px;--esds-button-border-radius:var(--esds-avatar-border-radius-circle);--esds-button-border-color:transparent;--esds-button-border-color-disabled:transparent;--esds-button-border-width:0px;--esds-button-border-width-disabled:0px;--esds-button-background-color:transparent;--esds-button-background-color-a:0;--esds-button-background-color-disabled:transparent;--esds-button-background-color-disabled-a:0;--esds-button-content-color:transparent;--esds-button-content-color-disabled:transparent;--esds-button-color-state-hover:transparent;--esds-button-color-state-hover-a:0;--esds-button-color-state-pressed:transparent;--esds-button-color-state-pressed-a:0;--esds-button-icon-size:0px;--esds-button-size:0px;--esds-focus-border-radius:var(--esds-avatar-border-radius-circle)}[esds-avatar-button]>esds-avatar{transition:background-color var(--esds-button-transition), opacity var(--esds-button-transition)}[esds-avatar-button]>esds-avatar:after{transition:background-color var(--esds-button-transition)}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[image]:not([image=""]),[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[image]:not([image=""]){background-color:var(--esds-avatar-background-color);position:relative}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[image]:not([image=""]):after,[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[image]:not([image=""]):after{content:"";background-color:#0000;position:absolute;inset:0}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar:not([image]:not([image=""])){background-color:color-mix(in srgb, rgb(from var(--esds-avatar-color-state-hover) r g b/100%) calc(var(--esds-avatar-color-state-hover-a) * 100%), rgb(from var(--esds-avatar-background-color) r g b/100%) calc(var(--esds-avatar-background-color-a) * (1 - var(--esds-avatar-color-state-hover-a)) * 100%))}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[image]:not([image=""]):after{background-color:var(--esds-avatar-color-state-hover)}[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar:not([image]:not([image=""])){background-color:color-mix(in srgb, rgb(from var(--esds-avatar-color-state-pressed) r g b/100%) calc(var(--esds-avatar-color-state-pressed-a) * 100%), rgb(from var(--esds-avatar-background-color) r g b/100%) calc(var(--esds-avatar-background-color-a) * (1 - var(--esds-avatar-color-state-pressed-a)) * 100%))}[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[image]:not([image=""]):after{background-color:var(--esds-avatar-color-state-pressed)}[esds-avatar-button]:is(:disabled,[disabled])>esds-avatar{background-color:var(--esds-avatar-background-color-disabled);color:var(--esds-avatar-content-color-disabled)}[esds-avatar-button]:is(:disabled,[disabled])>esds-avatar[image]:not([image=""]){opacity:var(--esds-avatar-opacity-disabled)}[esds-avatar-button]:has(>esds-avatar[shape=square]){--esds-button-border-radius:var(--esds-avatar-border-radius-square);--esds-focus-border-radius:var(--esds-avatar-border-radius-square)}`})))()}var w,T;function E(){return(E=e((()=>{l(),c(),v(),C(),w=p.parse(S),T=class e extends y{static define({registry:t=d.root}={}){t.defineOptionally(`esds-avatar-button`,e),y.define()}#e;connectedCallback(){super.connectedCallback(),this.#e=w.injectFrom(this.ownerElement)}disconnectedCallback(){super.disconnectedCallback(),this.#e?.(),this.#e=void 0}}})))()}var D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{r(),n(),o(),f(),c(),m(),g(),x(),E(),_.define(),D=u(e=>{T.define({registry:d.of(e.ownerDocument)})}),{args:O,argTypes:k}=i(`esds-avatar-button`),A={title:`Components/Avatar/Avatar Button`,component:`esds-avatar-button`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:b}}},args:O,argTypes:k},j={...h,disabled:{value:!1,type:`boolean`},image:`https://picsum.photos/seed/esds-avatar/48`,icon:``,initials:``},M={...s({...j}),render:e=>t`
    <button
      ${D}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${a(e.shape)}"
        image="${a(e.image)}"
        icon="${a(e.icon)}"
        initials="${a(e.initials)}"
      ></esds-avatar>
    </button>
  `},N={...s({...j}),render:e=>t`
    <button
      ${D}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${a(e.shape)}"
        image="https://picsum.photos/seed/esds-avatar/48"
      ></esds-avatar>
    </button>
  `},P={...s({...j}),render:e=>t`
    <button
      ${D}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${a(e.shape)}"
        icon="esds:calendar-user"
      ></esds-avatar>
    </button>
  `},F={...s({...j}),render:e=>t`
    <button
      ${D}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${a(e.shape)}"
        initials="AB"
      ></esds-avatar>
    </button>
  `},I=[`Default`,`WithImage`,`WithIcon`,`WithInitials`],M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarButtonExtraControls
  }),
  render: args => html\`
    <button
      \${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      data-esds-avatar-size="\${args.size}"
      ?disabled=\${args.disabled}
    >
      <esds-avatar
        shape="\${ifDefined(args.shape)}"
        image="\${ifDefined(args.image)}"
        icon="\${ifDefined(args.icon)}"
        initials="\${ifDefined(args.initials)}"
      ></esds-avatar>
    </button>
  \`
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarButtonExtraControls
  }),
  render: args => html\`
    <button
      \${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      data-esds-avatar-size="\${args.size}"
      ?disabled=\${args.disabled}
    >
      <esds-avatar
        shape="\${ifDefined(args.shape)}"
        image="https://picsum.photos/seed/esds-avatar/48"
      ></esds-avatar>
    </button>
  \`
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarButtonExtraControls
  }),
  render: args => html\`
    <button
      \${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      data-esds-avatar-size="\${args.size}"
      ?disabled=\${args.disabled}
    >
      <esds-avatar
        shape="\${ifDefined(args.shape)}"
        icon="esds:calendar-user"
      ></esds-avatar>
    </button>
  \`
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarButtonExtraControls
  }),
  render: args => html\`
    <button
      \${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      data-esds-avatar-size="\${args.size}"
      ?disabled=\${args.disabled}
    >
      <esds-avatar
        shape="\${ifDefined(args.shape)}"
        initials="AB"
      ></esds-avatar>
    </button>
  \`
}`,...F.parameters?.docs?.source}}}})))()}L();export{M as Default,P as WithIcon,N as WithImage,F as WithInitials,I as __namedExportsOrder,A as default};