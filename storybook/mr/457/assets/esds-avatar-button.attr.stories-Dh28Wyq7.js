import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{r as a,t as o}from"./if-defined-DYgFDik5.js";import{n as s}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as c,n as l,o as u,r as d,s as f,t as p}from"./injectable-style-sheet-CJbmy-p9.js";import{a as m,i as h,n as g,o as _,t as v}from"./esds-avatar.component-CC7c5XlJ.js";import{n as y,t as b}from"./esds-button.attr-B9RdiHI5.js";var x;function S(){return(S=e((()=>{x=`[Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2854-2&p=f&t=utLUqVyj1askiodz-0)

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
`})))()}var C;function w(){return(w=e((()=>{C=`[esds-avatar-button]{appearance:none;box-sizing:border-box;cursor:default;border-radius:var(--esds-avatar-border-radius-circle);background:0 0;border:none;justify-content:center;align-items:center;gap:0;width:auto;margin:0;padding:0;text-decoration:none;display:inline-flex}[esds-avatar-button]:focus-visible{outline:var(--esds-focus-border-width) solid var(--esds-focus-border-color);outline-offset:var(--esds-focus-border-offset);border-radius:var(--esds-avatar-border-radius-circle)}[esds-avatar-button]>esds-avatar{transition:background-color var(--esds-button-transition), opacity var(--esds-button-transition)}[esds-avatar-button]>esds-avatar:after{transition:background-color var(--esds-button-transition)}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[data-image-state=loaded],[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[data-image-state=loaded]{background-color:var(--esds-avatar-background-color);position:relative}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[data-image-state=loaded]:after,[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[data-image-state=loaded]:after{content:"";background-color:#0000;position:absolute;inset:0}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar:not([data-image-state=loaded]){background-color:color-mix(in srgb, rgb(from var(--esds-avatar-color-state-hover) r g b/100%) calc(var(--esds-avatar-color-state-hover-a) * 100%), rgb(from var(--esds-avatar-background-color) r g b/100%) calc(var(--esds-avatar-background-color-a) * (1 - var(--esds-avatar-color-state-hover-a)) * 100%))}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[data-image-state=loaded]:after{background-color:var(--esds-avatar-color-state-hover)}[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar:not([data-image-state=loaded]){background-color:color-mix(in srgb, rgb(from var(--esds-avatar-color-state-pressed) r g b/100%) calc(var(--esds-avatar-color-state-pressed-a) * 100%), rgb(from var(--esds-avatar-background-color) r g b/100%) calc(var(--esds-avatar-background-color-a) * (1 - var(--esds-avatar-color-state-pressed-a)) * 100%))}[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[data-image-state=loaded]:after{background-color:var(--esds-avatar-color-state-pressed)}[esds-avatar-button]:is(:disabled,[disabled]){cursor:not-allowed}[esds-avatar-button]:is(:disabled,[disabled])>esds-avatar{background-color:var(--esds-avatar-background-color-disabled);color:var(--esds-avatar-content-color-disabled)}[esds-avatar-button]:is(:disabled,[disabled])>esds-avatar[data-image-state=loaded]{opacity:var(--esds-avatar-opacity-disabled)}[esds-avatar-button]:has(>esds-avatar[shape=square]){border-radius:var(--esds-avatar-border-radius-square)}[esds-avatar-button]:has(>esds-avatar[shape=square]):focus-visible{border-radius:var(--esds-avatar-border-radius-square)}`})))()}var T,E;function D(){return(D=e((()=>{l(),c(),y(),w(),T=p.parse(C),E=class e extends b{static define({registry:t=d.root}={}){t.defineOptionally(`esds-avatar-button`,e),b.define()}#e;connectedCallback(){super.connectedCallback(),this.#e=T.injectFrom(this.ownerElement)}disconnectedCallback(){super.disconnectedCallback(),this.#e?.(),this.#e=void 0}}})))()}var O,k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{r(),n(),o(),f(),c(),_(),g(),S(),D(),v.define(),O=u(e=>{E.define({registry:d.of(e.ownerDocument)})}),{args:k,argTypes:A}=i(`esds-avatar-button`),j={title:`Components/Avatar/Avatar Button`,component:`esds-avatar-button`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:x}}},args:k,argTypes:A},M={...m,disabled:{value:!1,type:`boolean`},image:h,icon:``,initials:``},N={...s({...M}),render:e=>t`
    <button
      ${O}
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
  `},P={...s({...M}),render:e=>t`
    <button
      ${O}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${a(e.shape)}"
        image="${h}"
      ></esds-avatar>
    </button>
  `},F={...s({...M}),render:e=>t`
    <button
      ${O}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${a(e.shape)}"
        icon="esds:calendar-user"
      ></esds-avatar>
    </button>
  `},I={...s({...M}),render:e=>t`
    <button
      ${O}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${a(e.shape)}"
        initials="AB"
      ></esds-avatar>
    </button>
  `},L=[`Default`,`WithImage`,`WithIcon`,`WithInitials`],N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
        image="\${AVATAR_STORY_IMAGE}"
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
        icon="esds:calendar-user"
      ></esds-avatar>
    </button>
  \`
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}}})))()}R();export{N as Default,F as WithIcon,P as WithImage,I as WithInitials,L as __namedExportsOrder,j as default};