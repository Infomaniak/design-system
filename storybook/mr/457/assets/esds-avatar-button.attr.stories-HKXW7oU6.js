import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{a,i as o,n as s,r as c,t as l}from"./injectable-style-sheet-17jwLt-s.js";import{r as u,t as d}from"./if-defined-DYgFDik5.js";import{n as f}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as p,n as m,o as h,r as g,s as _,t as v}from"./injectable-style-sheet-CJbmy-p9.js";import{a as y,i as b,n as x,t as S}from"./esds-avatar.component-8u980N_7.js";var C;function w(){return(w=e((()=>{C=`:root{--esds-button-transition:.15s linear 0s}[esds-button]{--computed-esds-button-padding-inline:calc(var(--esds-button-padding-inline) - var(--esds-button-border-width));--computed-esds-button-padding-block:calc(var(--esds-button-padding-block) - var(--esds-button-border-width));appearance:none;box-sizing:border-box;cursor:default;border-radius:var(--esds-button-border-radius);width:auto;padding-inline:var(--computed-esds-button-padding-inline);padding-block:var(--computed-esds-button-padding-block);justify-content:center;align-items:center;gap:var(--esds-button-gap-row) var(--esds-button-gap-column);font:var(--esds-button-content-font);border:var(--esds-button-border-width) solid var(--esds-button-border-color);background-color:var(--esds-button-background-color);color:var(--esds-button-content-color);transition:border-color var(--esds-button-transition), background-color var(--esds-button-transition), color var(--esds-button-transition);-webkit-hyphens:auto;hyphens:auto;overflow-wrap:anywhere;word-break:normal;white-space:normal;flex-wrap:wrap;margin:0;text-decoration:none;display:inline-flex}[esds-button]>esds-icon{font-size:var(--esds-button-icon-size);flex-shrink:0}[esds-button][square]{--computed-esds-button-padding-inline:0;--computed-esds-button-padding-block:0;width:var(--esds-button-size);height:var(--esds-button-size)}[esds-button]:focus-visible{outline:var(--esds-focus-border-width) solid var(--esds-focus-border-color);outline-offset:var(--esds-focus-border-offset);border-radius:var(--esds-focus-border-radius)}[esds-button]:not(:disabled,[disabled],[loading]):hover{background-color:color-mix(in srgb, rgb(from var(--esds-button-color-state-hover) r g b/100%) calc(var(--esds-button-color-state-hover-a) * 100%), rgb(from var(--esds-button-background-color) r g b/100%) calc(var(--esds-button-background-color-a) * (1 - var(--esds-button-color-state-hover-a)) * 100%))}[esds-button]:not(:disabled,[disabled],[loading]):active{background-color:color-mix(in srgb, rgb(from var(--esds-button-color-state-pressed) r g b/100%) calc(var(--esds-button-color-state-pressed-a) * 100%), rgb(from var(--esds-button-background-color) r g b/100%) calc(var(--esds-button-background-color-a) * (1 - var(--esds-button-color-state-pressed-a)) * 100%))}[esds-button]:is(:disabled,[disabled]){cursor:not-allowed;border-color:var(--esds-button-border-color-disabled);border-width:var(--esds-button-border-width-disabled);background-color:var(--esds-button-background-color-disabled);color:var(--esds-button-content-color-disabled)}[esds-button]:is(:disabled,[disabled]):not([square]){--computed-esds-button-padding-inline:calc(var(--esds-button-padding-inline) - var(--esds-button-border-width-disabled));--computed-esds-button-padding-block:calc(var(--esds-button-padding-block) - var(--esds-button-border-width-disabled))}[esds-button]:is(:disabled,[disabled])[loading]:after{border-top-color:var(--esds-button-content-color-disabled);border-left-color:var(--esds-button-content-color-disabled);border-bottom-color:var(--esds-button-content-color-disabled)}[esds-button][loading]{cursor:progress;color:#0000;transition-duration:0s;position:relative}[esds-button][loading]>*{visibility:hidden}[esds-button][loading]:after{--esds-button-loader-size:calc(var(--esds-button-icon-size) * .8125);content:"";box-sizing:border-box;top:calc(50% - var(--esds-button-loader-size) / 2);left:calc(50% - var(--esds-button-loader-size) / 2);width:var(--esds-button-loader-size);height:var(--esds-button-loader-size);border:2px solid var(--esds-button-content-color);border-right-color:#0000;border-radius:50%;animation:1s linear infinite esds-button-loader-animation;display:block;position:absolute}@keyframes esds-button-loader-animation{0%{rotate:0deg}to{rotate:360deg}}`})))()}function T(e){return e.tagName===`A`}function E(e){return D(e)||O(e)}function D(e){return e.hasAttribute(`disabled`)||Reflect.has(e,`disabled`)&&Reflect.get(e,`disabled`)}function O(e){return e.hasAttribute(`loading`)}function k(e,t){e.addEventListener(`${t}down`,n=>{E(e)&&(n.preventDefault(),n.stopPropagation(),e.setAttribute(`inert`,``),window.addEventListener(`${t}up`,()=>{e.removeAttribute(`inert`),e instanceof HTMLElement&&O(e)&&!D(e)&&e.focus()},{once:!0}))})}var A,j;function M(){return(M=e((()=>{l(),o(),w(),A=s.parse(C),j=class e extends c{static define({registry:t=a.root}={}){t.defineOptionally(`esds-button`,e)}#e;#t=new MutationObserver(()=>{this.#r()});#n=void 0;constructor(e){if(e.ownerElement?.tagName!==`BUTTON`&&e.ownerElement?.tagName!==`A`)throw Error(`esds-button attribute can only be used on <button> or <a> elements`);super(e);let t=this.ownerElement;T(t)&&(t.role=`button`,t.addEventListener(`keypress`,e=>{if(e.code===`Space`){if(E(t))return;t.click()}})),k(t,`pointer`),k(t,`key`)}#r(){let e=this.ownerElement;T(e)&&(E(e)?e.setAttribute(`aria-disabled`,`true`):e.removeAttribute(`aria-disabled`),O(e)?e.setAttribute(`aria-busy`,`true`):e.removeAttribute(`aria-busy`),D(e)?(this.#n===void 0&&(this.#n=e.getAttribute(`tabindex`)),e.setAttribute(`tabindex`,`-1`)):this.#n!==void 0&&(this.#n===null?e.removeAttribute(`tabindex`):e.setAttribute(`tabindex`,this.#n),this.#n=void 0)),O(e)?e.setAttribute(`aria-label`,e.textContent.trim()):e.removeAttribute(`aria-label`)}connectedCallback(){let e=this.ownerElement;this.#e=A.injectFrom(e),T(e)&&(this.#t.observe(e,{attributes:!0,attributeFilter:[`disabled`,`loading`]}),this.#r())}disconnectedCallback(){this.#e?.(),this.#e=void 0,this.#t.disconnect()}}})))()}var N;function P(){return(P=e((()=>{N=`[//]: # (- [Figma ↗]&#40;TODO&#41;)

## Usage

Import and register the custom attribute \`esds-avatar-button\`:

\`\`\`ts
import { EsdsAvatarButtonAttr } from '@infomaniak-design-system/components';

EsdsAvatarButtonAttr.define();
\`\`\`

\`\`\`html
<button
  esds-avatar-button
  data-esds-avatar-size="medium"
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
`})))()}var F;function I(){return(I=e((()=>{F=`[esds-avatar-button]{--esds-button-padding-inline:0px;--esds-button-padding-block:0px;--esds-button-gap-row:0px;--esds-button-gap-column:0px;--esds-button-border-radius:var(--esds-avatar-border-radius-circle);--esds-button-border-color:transparent;--esds-button-border-color-disabled:transparent;--esds-button-border-width:0px;--esds-button-border-width-disabled:0px;--esds-button-background-color:transparent;--esds-button-background-color-a:0;--esds-button-background-color-disabled:transparent;--esds-button-background-color-disabled-a:0;--esds-button-content-color:transparent;--esds-button-content-color-disabled:transparent;--esds-button-color-state-hover:transparent;--esds-button-color-state-hover-a:0;--esds-button-color-state-pressed:transparent;--esds-button-color-state-pressed-a:0;--esds-button-icon-size:0px;--esds-button-size:0px;--esds-focus-border-radius:var(--esds-avatar-border-radius-circle)}[esds-avatar-button]>esds-avatar{transition:background-color var(--esds-button-transition), opacity var(--esds-button-transition)}[esds-avatar-button]>esds-avatar:after{transition:background-color var(--esds-button-transition)}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[image]:not([image=""]),[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[image]:not([image=""]){background-color:var(--esds-avatar-background-color);position:relative}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[image]:not([image=""]):after,[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[image]:not([image=""]):after{content:"";background-color:#0000;position:absolute;inset:0}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar:not([image]:not([image=""])){background-color:color-mix(in srgb, rgb(from var(--esds-avatar-color-state-hover) r g b/100%) calc(var(--esds-avatar-color-state-hover-a) * 100%), rgb(from var(--esds-avatar-background-color) r g b/100%) calc(var(--esds-avatar-background-color-a) * (1 - var(--esds-avatar-color-state-hover-a)) * 100%))}[esds-avatar-button]:not(:disabled,[disabled]):hover>esds-avatar[image]:not([image=""]):after{background-color:var(--esds-avatar-color-state-hover)}[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar:not([image]:not([image=""])){background-color:color-mix(in srgb, rgb(from var(--esds-avatar-color-state-pressed) r g b/100%) calc(var(--esds-avatar-color-state-pressed-a) * 100%), rgb(from var(--esds-avatar-background-color) r g b/100%) calc(var(--esds-avatar-background-color-a) * (1 - var(--esds-avatar-color-state-pressed-a)) * 100%))}[esds-avatar-button]:not(:disabled,[disabled]):active>esds-avatar[image]:not([image=""]):after{background-color:var(--esds-avatar-color-state-pressed)}[esds-avatar-button]:is(:disabled,[disabled])>esds-avatar{background-color:var(--esds-avatar-background-color-disabled);color:var(--esds-avatar-content-color-disabled)}[esds-avatar-button]:is(:disabled,[disabled])>esds-avatar[image]:not([image=""]){opacity:var(--esds-avatar-opacity-disabled)}[esds-avatar-button]:has(>esds-avatar[shape=square]){--esds-button-border-radius:var(--esds-avatar-border-radius-square);--esds-focus-border-radius:var(--esds-avatar-border-radius-square)}`})))()}var L,R;function z(){return(z=e((()=>{M(),m(),p(),I(),L=v.parse(F),R=class e extends j{static define({registry:t=g.root}={}){t.defineOptionally(`esds-avatar-button`,e),j.define()}#e;constructor(e){super(e),this.ownerElement.setAttribute(`esds-button`,``)}connectedCallback(){super.connectedCallback(),this.#e=L.injectFrom(this.ownerElement)}disconnectedCallback(){super.disconnectedCallback(),this.#e?.(),this.#e=void 0}}})))()}var B,V,H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{r(),n(),d(),_(),p(),y(),x(),P(),z(),S.define(),B=h(e=>{R.define({registry:g.of(e.ownerDocument)})}),{args:V,argTypes:H}=i(`esds-avatar-button`),U={title:`Components/Avatar/Avatar Button`,component:`esds-avatar-button`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:N}}},args:V,argTypes:H},W={...b,disabled:{value:!1,type:`boolean`},image:`https://picsum.photos/200`,icon:``,initials:``},G={...f({...W}),render:e=>t`
    <button
      ${B}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${u(e.shape)}"
        image="${u(e.image)}"
        icon="${u(e.icon)}"
        initials="${u(e.initials)}"
      ></esds-avatar>
    </button>
  `},K={...f({...W}),render:e=>t`
    <button
      ${B}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${u(e.shape)}"
        image="https://picsum.photos/200"
      ></esds-avatar>
    </button>
  `},q={...f({...W}),render:e=>t`
    <button
      ${B}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${u(e.shape)}"
        icon="esds:calendar-user"
      ></esds-avatar>
    </button>
  `},J={...f({...W}),render:e=>t`
    <button
      ${B}
      esds-avatar-button
      data-esds-avatar-size="${e.size}"
      ?disabled=${e.disabled}
    >
      <esds-avatar
        shape="${u(e.shape)}"
        initials="AB"
      ></esds-avatar>
    </button>
  `},Y=[`Default`,`WithImage`,`WithIcon`,`WithInitials`],G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
        image="https://picsum.photos/200"
      ></esds-avatar>
    </button>
  \`
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}}})))()}X();export{G as Default,q as WithIcon,K as WithImage,J as WithInitials,Y as __namedExportsOrder,U as default};