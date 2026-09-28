import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{g as t,h as n,n as r,p as i,t as a,u as o}from"./dist-D5vWbpez.js";import{c as s,o as c}from"./iframe-CK2Tlpxa.js";import{a as l,i as u,l as d,n as f,o as p,r as m,s as h,t as g}from"./injectable-style-sheet-BBpgD0Qy.js";var _;function v(){return(v=e((()=>{t(),_=e=>e??i})))()}function y(){return(y=e((()=>{v()})))()}var b;function x(){return(x=e((()=>{b=`- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=1473-1429&t=ZWopR2KZ2XXD2MTX-0)

## Usage

Import and register the custom attribute \`esds-button\`:

\`\`\`ts
import { EsdsButtonAttr } from '@infomaniak-design-system/components';

EsdsButtonAttr.define();
\`\`\`

\`\`\`html
<button esds-button>Button</button>
\`\`\`

\`\`\`html
<a
  esds-button
  href="#"
>
  Button link
</a>
\`\`\`

### Styles

#### Types

TODO

## Description

Adding the custom attribute \`esds-button\` to a \`<button>\` or \`<a>\` element, applies the \`esds-button\` styles to this element.

## Demo
`})))()}var S;function C(){return(C=e((()=>{S=`:root{--esds-button-transition:.15s linear 0s}[esds-button]{appearance:none;box-sizing:border-box;border-radius:var(--esds-button-border-radius);width:auto;padding-inline:calc(var(--esds-button-padding-inline) - var(--esds-button-border-width));padding-block:calc(var(--esds-button-padding-block) - var(--esds-button-border-width));justify-content:center;align-items:center;gap:var(--esds-button-gap-row) var(--esds-button-gap-column);font:var(--esds-button-content-font);border:var(--esds-button-border-width) solid var(--esds-button-border-color);background-color:var(--esds-button-background-color);color:var(--esds-button-content-color);transition:border-color var(--esds-button-transition), background-color var(--esds-button-transition), color var(--esds-button-transition);-webkit-hyphens:auto;hyphens:auto;overflow-wrap:anywhere;word-break:normal;white-space:normal;flex-wrap:wrap;margin:0;text-decoration:none;display:inline-flex}[esds-button]:focus-visible{outline:var(--esds-focus-border-width) solid var(--esds-focus-border-color);outline-offset:var(--esds-focus-border-offset);border-radius:var(--esds-focus-border-radius)}[esds-button]:not(:disabled,[disabled],[loading]):hover{background-color:color-mix(in srgb, rgb(from var(--esds-button-color-state-hover) r g b/100%) calc(var(--esds-button-color-state-hover-a) * 100%), rgb(from var(--esds-button-background-color) r g b/100%) calc(var(--esds-button-background-color-a) * (1 - var(--esds-button-color-state-hover-a)) * 100%))}[esds-button]:not(:disabled,[disabled],[loading]):active{background-color:color-mix(in srgb, rgb(from var(--esds-button-color-state-pressed) r g b/100%) calc(var(--esds-button-color-state-pressed-a) * 100%), rgb(from var(--esds-button-background-color) r g b/100%) calc(var(--esds-button-background-color-a) * (1 - var(--esds-button-color-state-pressed-a)) * 100%))}[esds-button]:is(:disabled,[disabled]){padding-inline:calc(var(--esds-button-padding-inline) - var(--esds-button-border-width-disabled));padding-block:calc(var(--esds-button-padding-block) - var(--esds-button-border-width-disabled));border-color:var(--esds-button-border-color-disabled);border-width:var(--esds-button-border-width-disabled);background-color:var(--esds-button-background-color-disabled);color:var(--esds-button-content-color-disabled)}[esds-button]:is(:disabled,[disabled])[loading]:after{border-top-color:var(--esds-button-content-color-disabled);border-left-color:var(--esds-button-content-color-disabled);border-bottom-color:var(--esds-button-content-color-disabled)}[esds-button]>esds-icon{font-size:var(--esds-button-icon-size)}[esds-button][loading]{cursor:progress;color:#0000;transition-duration:0s;position:relative}[esds-button][loading]>*{visibility:hidden}[esds-button][loading]:after{--esds-button-loader-size:calc(var(--esds-button-icon-size) * .8125);content:"";box-sizing:border-box;top:calc(50% - var(--esds-button-loader-size) / 2);left:calc(50% - var(--esds-button-loader-size) / 2);width:var(--esds-button-loader-size);height:var(--esds-button-loader-size);border:2px solid var(--esds-button-content-color);border-right-color:#0000;border-radius:50%;animation:1s linear infinite esds-button-loader-animation;display:block;position:absolute}@keyframes esds-button-loader-animation{0%{rotate:0deg}to{rotate:360deg}}`})))()}var w,T;function E(){return(E=e((()=>{f(),l(),C(),w=g.parse(S),T=class e extends u{static define({registry:t=m.root}={}){t.defineOptionally(`esds-button`,e)}#e;constructor(e){if(e.ownerElement?.tagName!==`BUTTON`&&e.ownerElement?.tagName!==`A`)throw Error(`esds-button attribute can only be used on <button> or <a> elements`);super(e);let t=this.ownerElement;t.addEventListener(`pointerdown`,e=>{t.hasAttribute(`loading`)&&(e.preventDefault(),e.stopPropagation(),t.setAttribute(`inert`,``),window.addEventListener(`pointerup`,()=>{t.removeAttribute(`inert`)},{once:!0}))})}connectedCallback(){this.#e=w.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{s(),r(),o(),y(),h(),l(),x(),E(),c.define(),D=p(e=>{T.define({registry:m.of(e.ownerDocument)})}),{args:O,argTypes:k}=a(`esds-button`),A={title:`Components/Button`,component:`esds-button`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:b}}},args:O,argTypes:k},j={disabled:{value:!1,type:`boolean`},loading:{value:!1,type:`boolean`}},M=[`primary`,`primary-destructive`,`secondary`,`secondary-destructive`,`ghost-primary`,`ghost-secondary`,`ghost-destructive`],N=[`small`,`medium`,`large`],P={...d({...j,content:`Text content`,buttonType:{value:`primary`,type:`select`,options:M},size:{value:`medium`,type:`select`,options:N}}),render:e=>n`<button
      ${D}
      esds-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
      data-esds-button-type=${_(e.buttonType)}
      data-esds-button-size=${_(e.size)}
      @click="${()=>console.log(`clicked`)}"
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${e.content}
    </button>`},F={...d({...j,content:`Link content`,href:`https://infomaniak.com`}),render:e=>n`<a
      ${D}
      esds-button
      href="${e.href}"
      ?disabled=${e.disabled}
      ?loading=${e.loading}
      >${e.content}</a
    >`},I={...d({...j,content:`Text content`}),render:e=>n`<button
      ${D}
      esds-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      ${e.content}
    </button>`},L={...d(j),render:e=>n`
    <style>
      .buttons-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 12px;
      }
    </style>
    <div class="buttons-container">
      ${M.map(t=>n`
          <button
            ${D}
            esds-button
            data-esds-button-type=${_(t)}
            ?disabled=${e.disabled}
            ?loading=${e.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
            ${t}
          </button>
        `)}
    </div>
  `},R={...d(j),render:e=>n`
    <style>
      .buttons-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 12px;
      }
    </style>
    <div class="buttons-container">
      ${N.map(t=>n`
          <button
            ${D}
            esds-button
            data-esds-button-size=${_(t)}
            ?disabled=${e.disabled}
            ?loading=${e.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
            ${t}
          </button>
        `)}
    </div>
  `},z=[`Button`,`Link`,`WithoutIcon`,`Types`,`Sizes`],P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Text content',
    buttonType: {
      value: 'primary',
      type: 'select',
      options: BUTTON_TYPES
    },
    size: {
      value: 'medium',
      type: 'select',
      options: BUTTON_SIZES
    }
  }),
  render: args => html\`<button
      \${defineEsdsButtonAttr}
      esds-button
      ?disabled=\${args.disabled}
      ?loading=\${args.loading}
      data-esds-button-type=\${ifDefined(args.buttonType)}
      data-esds-button-size=\${ifDefined(args.size)}
      @click="\${() => console.log('clicked')}"
    >
      <esds-icon name="esds:plus"></esds-icon>
      \${args.content}
    </button>\`
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Link content',
    href: 'https://infomaniak.com'
  }),
  render: args => html\`<a
      \${defineEsdsButtonAttr}
      esds-button
      href="\${args.href}"
      ?disabled=\${args.disabled}
      ?loading=\${args.loading}
      >\${args.content}</a
    >\`
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Text content'
  }),
  render: args => html\`<button
      \${defineEsdsButtonAttr}
      esds-button
      ?disabled=\${args.disabled}
      ?loading=\${args.loading}
    >
      \${args.content}
    </button>\`
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls(extraControls),
  render: args => html\`
    <style>
      .buttons-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 12px;
      }
    </style>
    <div class="buttons-container">
      \${BUTTON_TYPES.map(variant => html\`
          <button
            \${defineEsdsButtonAttr}
            esds-button
            data-esds-button-type=\${ifDefined(variant)}
            ?disabled=\${args.disabled}
            ?loading=\${args.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
            \${variant}
          </button>
        \`)}
    </div>
  \`
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls(extraControls),
  render: args => html\`
    <style>
      .buttons-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 12px;
      }
    </style>
    <div class="buttons-container">
      \${BUTTON_SIZES.map(variant => html\`
          <button
            \${defineEsdsButtonAttr}
            esds-button
            data-esds-button-size=\${ifDefined(variant)}
            ?disabled=\${args.disabled}
            ?loading=\${args.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
            \${variant}
          </button>
        \`)}
    </div>
  \`
}`,...R.parameters?.docs?.source}}}})))()}B();export{P as Button,F as Link,R as Sizes,L as Types,I as WithoutIcon,z as __namedExportsOrder,A as default};