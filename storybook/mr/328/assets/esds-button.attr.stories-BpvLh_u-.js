import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{g as t,h as n,n as r,p as i,t as a,u as o}from"./dist-D5vWbpez.js";import{c as s,o as c}from"./iframe-MQClb5OY.js";import{a as l,i as u,l as d,n as f,o as p,r as m,s as h,t as g}from"./injectable-style-sheet-BBpgD0Qy.js";var _;function v(){return(v=e((()=>{t(),_=e=>e??i})))()}function y(){return(y=e((()=>{v()})))()}var b;function x(){return(x=e((()=>{b=`- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=1473-1429&t=ZWopR2KZ2XXD2MTX-0)

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

List of all available button types:

- \`primary\` (default): for a primary button
- \`primary-destructive\`: for a destructive button
- \`secondary\`: for a secondary button
- \`secondary-destructive\`: for a secondary destructive button
- \`ghost-primary\`: for a ghost button
- \`ghost-secondary\`: for a ghost secondary button
- \`ghost-destructive\`: for a ghost destructive button

##### Import

To import all button types:

\`\`\`css
@import '@infomaniak-design-system/tokens/css/modifiers/button-types/all.attr.css';
\`\`\`

Or individually:

\`\`\`css
@import '@infomaniak-design-system/tokens/css/modifiers/button-types/[type].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/button-types/primary.attr.css'; */
\`\`\`

##### Apply

Add the attribute \`data-esds-button-type="[type]"\` to apply a button type:

\`\`\`html
<button
  esds-button
  data-esds-button-type="primary"
>
  Button
</button>
\`\`\`

#### Sizes

List of all available button sizes:

- \`small\`: for a small button
- \`medium\` (default): for a medium button
- \`large\`: for a large button

##### Import

To import all button sizes:

\`\`\`css
@import '@infomaniak-design-system/tokens/css/modifiers/button-sizes/all.attr.css';
\`\`\`

Or individually:

\`\`\`css
@import '@infomaniak-design-system/tokens/css/modifiers/button-sizes/[size].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/button-sizes/small.attr.css'; */
\`\`\`

##### Apply

Add the attribute \`data-esds-button-size="[size]"\` to apply a button size:

\`\`\`html
<button
  esds-button
  data-esds-button-size="medium"
>
  Button
</button>
\`\`\`

Both \`data-esds-button-type\` and \`data-esds-button-size\` can be combined:

\`\`\`html
<button
  esds-button
  data-esds-button-type="primary"
  data-esds-button-size="medium"
>
  Button
</button>
\`\`\`

## Description

Adding the custom attribute \`esds-button\` to a \`<button>\` or \`<a>\` element, applies the \`esds-button\` styles to this element.

## Demo
`})))()}var S;function C(){return(C=e((()=>{S=`:root{--esds-button-transition:.15s linear 0s}[esds-button]{appearance:none;box-sizing:border-box;cursor:default;border-radius:var(--esds-button-border-radius);width:auto;padding-inline:calc(var(--esds-button-padding-inline) - var(--esds-button-border-width));padding-block:calc(var(--esds-button-padding-block) - var(--esds-button-border-width));justify-content:center;align-items:center;gap:var(--esds-button-gap-row) var(--esds-button-gap-column);font:var(--esds-button-content-font);border:var(--esds-button-border-width) solid var(--esds-button-border-color);background-color:var(--esds-button-background-color);color:var(--esds-button-content-color);transition:border-color var(--esds-button-transition), background-color var(--esds-button-transition), color var(--esds-button-transition);-webkit-hyphens:auto;hyphens:auto;overflow-wrap:anywhere;word-break:normal;white-space:normal;flex-wrap:wrap;margin:0;text-decoration:none;display:inline-flex}[esds-button]>esds-icon{font-size:var(--esds-button-icon-size)}[esds-button]:focus-visible{outline:var(--esds-focus-border-width) solid var(--esds-focus-border-color);outline-offset:var(--esds-focus-border-offset);border-radius:var(--esds-focus-border-radius)}[esds-button]:not(:disabled,[disabled],[loading]):hover{background-color:color-mix(in srgb, rgb(from var(--esds-button-color-state-hover) r g b/100%) calc(var(--esds-button-color-state-hover-a) * 100%), rgb(from var(--esds-button-background-color) r g b/100%) calc(var(--esds-button-background-color-a) * (1 - var(--esds-button-color-state-hover-a)) * 100%))}[esds-button]:not(:disabled,[disabled],[loading]):active{background-color:color-mix(in srgb, rgb(from var(--esds-button-color-state-pressed) r g b/100%) calc(var(--esds-button-color-state-pressed-a) * 100%), rgb(from var(--esds-button-background-color) r g b/100%) calc(var(--esds-button-background-color-a) * (1 - var(--esds-button-color-state-pressed-a)) * 100%))}[esds-button]:is(:disabled,[disabled]){cursor:not-allowed;padding-inline:calc(var(--esds-button-padding-inline) - var(--esds-button-border-width-disabled));padding-block:calc(var(--esds-button-padding-block) - var(--esds-button-border-width-disabled));border-color:var(--esds-button-border-color-disabled);border-width:var(--esds-button-border-width-disabled);background-color:var(--esds-button-background-color-disabled);color:var(--esds-button-content-color-disabled)}[esds-button]:is(:disabled,[disabled])[loading]:after{border-top-color:var(--esds-button-content-color-disabled);border-left-color:var(--esds-button-content-color-disabled);border-bottom-color:var(--esds-button-content-color-disabled)}[esds-button][loading]{cursor:progress;color:#0000;transition-duration:0s;position:relative}[esds-button][loading]>*{visibility:hidden}[esds-button][loading]:after{--esds-button-loader-size:calc(var(--esds-button-icon-size) * .8125);content:"";box-sizing:border-box;top:calc(50% - var(--esds-button-loader-size) / 2);left:calc(50% - var(--esds-button-loader-size) / 2);width:var(--esds-button-loader-size);height:var(--esds-button-loader-size);border:2px solid var(--esds-button-content-color);border-right-color:#0000;border-radius:50%;animation:1s linear infinite esds-button-loader-animation;display:block;position:absolute}@keyframes esds-button-loader-animation{0%{rotate:0deg}to{rotate:360deg}}`})))()}function w(e){return e.tagName===`A`}function T(e){return E(e)||D(e)}function E(e){return e.hasAttribute(`disabled`)||Reflect.has(e,`disabled`)&&Reflect.get(e,`disabled`)}function D(e){return e.hasAttribute(`loading`)}function O(e){w(e)&&(T(e)?e.setAttribute(`aria-disabled`,`true`):e.removeAttribute(`aria-disabled`),E(e)?e.setAttribute(`tabindex`,`-1`):e.removeAttribute(`tabindex`))}function k(e,t){e.addEventListener(`${t}down`,n=>{T(e)&&(n.preventDefault(),n.stopPropagation(),e.setAttribute(`inert`,``),window.addEventListener(`${t}up`,()=>{e.removeAttribute(`inert`),e instanceof HTMLElement&&D(e)&&!E(e)&&e.focus()},{once:!0}))})}var A,j;function M(){return(M=e((()=>{f(),l(),C(),A=g.parse(S),j=class e extends u{static define({registry:t=m.root}={}){t.defineOptionally(`esds-button`,e)}#e;#t=new MutationObserver(()=>{O(this.ownerElement)});constructor(e){if(e.ownerElement?.tagName!==`BUTTON`&&e.ownerElement?.tagName!==`A`)throw Error(`esds-button attribute can only be used on <button> or <a> elements`);super(e);let t=this.ownerElement;w(t)&&(t.role=`button`),k(t,`pointer`),k(t,`key`)}connectedCallback(){let e=this.ownerElement;this.#e=A.injectFrom(e),w(e)&&(this.#t.observe(e,{attributes:!0,attributeFilter:[`disabled`,`loading`]}),O(e))}disconnectedCallback(){this.#e?.(),this.#e=void 0,this.#t.disconnect()}}})))()}var N,P,F,I,L,R,z,B,V,H,U,W,G;function K(){return(K=e((()=>{s(),r(),o(),y(),h(),l(),x(),M(),c.define(),N=p(e=>{j.define({registry:m.of(e.ownerDocument)})}),{args:P,argTypes:F}=a(`esds-button`),I={title:`Components/Button`,component:`esds-button`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:b}}},args:P,argTypes:F},L={disabled:{value:!1,type:`boolean`},loading:{value:!1,type:`boolean`}},R=[`primary`,`primary-destructive`,`secondary`,`secondary-destructive`,`ghost-primary`,`ghost-secondary`,`ghost-destructive`],z=[`small`,`medium`,`large`],B={...d({...L,content:`Text content`,buttonType:{value:`primary`,type:`select`,options:R},size:{value:`medium`,type:`select`,options:z}}),render:e=>n`<button
      ${N}
      esds-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
      data-esds-button-type=${_(e.buttonType)}
      data-esds-button-size=${_(e.size)}
      @click="${()=>console.log(`clicked`)}"
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${e.content}
    </button>`},V={...d({...L,content:`Link content`,href:`https://infomaniak.com`}),render:e=>n`<a
      ${N}
      esds-button
      href="${e.href}"
      target="_blank"
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${e.content}
    </a>`},H={...d({...L,content:`Text content`}),render:e=>n`<button
      ${N}
      esds-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      ${e.content}
    </button>`},U={...d(L),render:e=>n`
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
      ${R.map(t=>n`
          <button
            ${N}
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
  `},W={...d(L),render:e=>n`
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
      ${z.map(t=>n`
          <button
            ${N}
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
  `},G=[`Button`,`Link`,`WithoutIcon`,`Types`,`Sizes`],B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Link content',
    href: 'https://infomaniak.com'
  }),
  render: args => html\`<a
      \${defineEsdsButtonAttr}
      esds-button
      href="\${args.href}"
      target="_blank"
      ?disabled=\${args.disabled}
      ?loading=\${args.loading}
    >
      <esds-icon name="esds:plus"></esds-icon>
      \${args.content}
    </a>\`
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}}})))()}K();export{B as Button,V as Link,W as Sizes,U as Types,H as WithoutIcon,G as __namedExportsOrder,I as default};