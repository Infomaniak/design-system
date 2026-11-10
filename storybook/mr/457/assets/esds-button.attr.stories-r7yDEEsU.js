import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{a,i as o,n as s,r as c,t as l}from"./injectable-style-sheet-17jwLt-s.js";import{c as u,o as d}from"./iframe-SREY109P.js";import{r as f,t as p}from"./if-defined-DYgFDik5.js";import{n as m}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as h,i as g,n as _,o as v,r as y,s as b,t as x}from"./injectable-style-sheet-CJbmy-p9.js";var S;function C(){return(C=e((()=>{S=`kbd[esds-kbd]{box-sizing:border-box;align-items:center;gap:var(--esds-kbd-gap);padding:var(--esds-kbd-padding-block) var(--esds-kbd-padding-inline);background-color:var(--esds-kbd-background-color);border:var(--esds-kbd-border-width) solid var(--esds-kbd-border-color);border-radius:var(--esds-kbd-border-radius);color:var(--esds-kbd-content-color);font:var(--esds-kbd-font);display:inline-flex}`})))()}var w,T;function E(){return(E=e((()=>{l(),o(),C(),w=s.parse(S),T=class e extends c{static define({registry:t=a.root}={}){t.defineOptionally(`esds-kbd`,e)}#e;constructor(e){if(e.ownerElement?.tagName!==`KBD`)throw Error(`esds-kbd attribute can only be used on <kbd> elements`);super(e)}connectedCallback(){this.#e=w.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var D;function O(){return(O=e((()=>{D=`- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=1473-1429&t=ZWopR2KZ2XXD2MTX-0)

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

## Description

Adding the custom attribute \`esds-button\` to a \`<button>\` or \`<a>\` element, applies the \`esds-button\` styles to this element.

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
@import '@infomaniak-design-system/tokens/css/modifiers/button-type/all.attr.css';
\`\`\`

Or individually:

\`\`\`css
@import '@infomaniak-design-system/tokens/css/modifiers/button-type/[type].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/button-type/primary.attr.css'; */
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
@import '@infomaniak-design-system/tokens/css/modifiers/button-size/all.attr.css';
\`\`\`

Or individually:

\`\`\`css
@import '@infomaniak-design-system/tokens/css/modifiers/button-size/[size].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/button-size/small.attr.css'; */
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

## Demo
`})))()}var k;function A(){return(A=e((()=>{k=`:root{--esds-button-transition:.15s linear 0s}[esds-button]{--computed-esds-button-padding-inline:calc(var(--esds-button-padding-inline) - var(--esds-button-border-width));--computed-esds-button-padding-block:calc(var(--esds-button-padding-block) - var(--esds-button-border-width));appearance:none;box-sizing:border-box;cursor:default;border-radius:var(--esds-button-border-radius);width:auto;padding-inline:var(--computed-esds-button-padding-inline);padding-block:var(--computed-esds-button-padding-block);justify-content:center;align-items:center;gap:var(--esds-button-gap-row) var(--esds-button-gap-column);font:var(--esds-button-content-font);border:var(--esds-button-border-width) solid var(--esds-button-border-color);background-color:var(--esds-button-background-color);color:var(--esds-button-content-color);transition:border-color var(--esds-button-transition), background-color var(--esds-button-transition), color var(--esds-button-transition);-webkit-hyphens:auto;hyphens:auto;overflow-wrap:anywhere;word-break:normal;white-space:normal;flex-wrap:wrap;margin:0;text-decoration:none;display:inline-flex}[esds-button]>esds-icon{font-size:var(--esds-button-icon-size);flex-shrink:0}[esds-button][square]{--computed-esds-button-padding-inline:0;--computed-esds-button-padding-block:0;width:var(--esds-button-size);height:var(--esds-button-size)}[esds-button]:focus-visible{outline:var(--esds-focus-border-width) solid var(--esds-focus-border-color);outline-offset:var(--esds-focus-border-offset);border-radius:var(--esds-focus-border-radius)}[esds-button]:not(:disabled,[disabled],[loading]):hover{background-color:color-mix(in srgb, rgb(from var(--esds-button-color-state-hover) r g b/100%) calc(var(--esds-button-color-state-hover-a) * 100%), rgb(from var(--esds-button-background-color) r g b/100%) calc(var(--esds-button-background-color-a) * (1 - var(--esds-button-color-state-hover-a)) * 100%))}[esds-button]:not(:disabled,[disabled],[loading]):active{background-color:color-mix(in srgb, rgb(from var(--esds-button-color-state-pressed) r g b/100%) calc(var(--esds-button-color-state-pressed-a) * 100%), rgb(from var(--esds-button-background-color) r g b/100%) calc(var(--esds-button-background-color-a) * (1 - var(--esds-button-color-state-pressed-a)) * 100%))}[esds-button]:is(:disabled,[disabled]){cursor:not-allowed;border-color:var(--esds-button-border-color-disabled);border-width:var(--esds-button-border-width-disabled);background-color:var(--esds-button-background-color-disabled);color:var(--esds-button-content-color-disabled)}[esds-button]:is(:disabled,[disabled]):not([square]){--computed-esds-button-padding-inline:calc(var(--esds-button-padding-inline) - var(--esds-button-border-width-disabled));--computed-esds-button-padding-block:calc(var(--esds-button-padding-block) - var(--esds-button-border-width-disabled))}[esds-button]:is(:disabled,[disabled])[loading]:after{border-top-color:var(--esds-button-content-color-disabled);border-left-color:var(--esds-button-content-color-disabled);border-bottom-color:var(--esds-button-content-color-disabled)}[esds-button][loading]{cursor:progress;color:#0000;transition-duration:0s;position:relative}[esds-button][loading]>*{visibility:hidden}[esds-button][loading]:after{--esds-button-loader-size:calc(var(--esds-button-icon-size) * .8125);content:"";box-sizing:border-box;top:calc(50% - var(--esds-button-loader-size) / 2);left:calc(50% - var(--esds-button-loader-size) / 2);width:var(--esds-button-loader-size);height:var(--esds-button-loader-size);border:2px solid var(--esds-button-content-color);border-right-color:#0000;border-radius:50%;animation:1s linear infinite esds-button-loader-animation;display:block;position:absolute}@keyframes esds-button-loader-animation{0%{rotate:0deg}to{rotate:360deg}}`})))()}function j(e){return e.tagName===`A`}function M(e){return N(e)||P(e)}function N(e){return e.hasAttribute(`disabled`)||Reflect.has(e,`disabled`)&&Reflect.get(e,`disabled`)}function P(e){return e.hasAttribute(`loading`)}function F(e,t){e.addEventListener(`${t}down`,n=>{M(e)&&(n.preventDefault(),n.stopPropagation(),e.setAttribute(`inert`,``),window.addEventListener(`${t}up`,()=>{e.removeAttribute(`inert`),e instanceof HTMLElement&&P(e)&&!N(e)&&e.focus()},{once:!0}))})}var I,L;function R(){return(R=e((()=>{_(),h(),A(),I=x.parse(k),L=class e extends g{static define({registry:t=y.root}={}){t.defineOptionally(`esds-button`,e)}#e;#t=new MutationObserver(()=>{this.#r()});#n=void 0;constructor(e){if(e.ownerElement?.tagName!==`BUTTON`&&e.ownerElement?.tagName!==`A`)throw Error(`esds-button attribute can only be used on <button> or <a> elements`);super(e);let t=this.ownerElement;j(t)&&(t.role=`button`,t.addEventListener(`keypress`,e=>{if(e.code===`Space`){if(M(t))return;t.click()}})),F(t,`pointer`),F(t,`key`)}#r(){let e=this.ownerElement;j(e)&&(M(e)?e.setAttribute(`aria-disabled`,`true`):e.removeAttribute(`aria-disabled`),P(e)?e.setAttribute(`aria-busy`,`true`):e.removeAttribute(`aria-busy`),N(e)?(this.#n===void 0&&(this.#n=e.getAttribute(`tabindex`)),e.setAttribute(`tabindex`,`-1`)):this.#n!==void 0&&(this.#n===null?e.removeAttribute(`tabindex`):e.setAttribute(`tabindex`,this.#n),this.#n=void 0)),P(e)?e.setAttribute(`aria-label`,e.textContent.trim()):e.removeAttribute(`aria-label`)}connectedCallback(){let e=this.ownerElement;this.#e=I.injectFrom(e),j(e)&&(this.#t.observe(e,{attributes:!0,attributeFilter:[`disabled`,`loading`]}),this.#r())}disconnectedCallback(){this.#e?.(),this.#e=void 0,this.#t.disconnect()}}})))()}var z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{u(),E(),r(),n(),p(),b(),h(),O(),R(),d.define(),z=v(e=>{L.define({registry:y.of(e.ownerDocument)}),T.define({registry:y.of(e.ownerDocument)})}),{args:B,argTypes:V}=i(`esds-button`),H={title:`Components/Button`,component:`esds-button`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:D}}},args:B,argTypes:V},U={disabled:{value:!1,type:`boolean`},loading:{value:!1,type:`boolean`}},W=[`primary`,`primary-destructive`,`secondary`,`secondary-destructive`,`ghost-primary`,`ghost-secondary`,`ghost-destructive`],G=[`small`,`medium`,`large`],K=t`<style>
  .buttons-container {
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    justify-content: start;
    justify-items: start;
    gap: 16px 12px;
  }
</style>`,q={...m({...U,content:`Text content`,buttonType:{value:`primary`,type:`select`,options:W},size:{value:`medium`,type:`select`,options:G}}),render:e=>t`<button
      ${z}
      esds-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
      data-esds-button-type=${f(e.buttonType)}
      data-esds-button-size=${f(e.size)}
      @click="${()=>console.log(`clicked`)}"
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${e.content}
      <kbd esds-kbd="">⌘</kbd>
    </button>`},J={...m({...U,content:`Link content`,href:`https://infomaniak.com`}),render:e=>t`<a
      ${z}
      esds-button
      href="${e.href}"
      target="_blank"
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${e.content}
    </a>`},Y={...m({...U,content:`Text content`}),render:e=>t`<button
      ${z}
      esds-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      ${e.content}
    </button>`},X={...m(U),render:e=>t`
    ${K}
    <div class="buttons-container">
      ${W.map(n=>t`
          <button
            ${z}
            esds-button
            data-esds-button-type=${f(n)}
            ?disabled=${e.disabled}
            ?loading=${e.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
            ${n}
          </button>
          <button
            ${z}
            esds-button
            data-esds-button-type=${f(n)}
            square
            ?disabled=${e.disabled}
            ?loading=${e.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
          </button>
        `)}
    </div>
  `},Z={...m(U),render:e=>t`
    ${K}
    <div class="buttons-container">
      ${G.map(n=>t`
          <button
            ${z}
            esds-button
            data-esds-button-size=${f(n)}
            ?disabled=${e.disabled}
            ?loading=${e.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
            ${n}
          </button>
          <button
            ${z}
            esds-button
            data-esds-button-size=${f(n)}
            square
            ?disabled=${e.disabled}
            ?loading=${e.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
          </button>
        `)}
    </div>
  `},Q=[`Button`,`Link`,`TextOnly`,`Types`,`Sizes`],q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
      <kbd esds-kbd="">⌘</kbd>
    </button>\`
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls(extraControls),
  render: args => html\`
    \${BUTTON_GRID_STYLES}
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
          <button
            \${defineEsdsButtonAttr}
            esds-button
            data-esds-button-type=\${ifDefined(variant)}
            square
            ?disabled=\${args.disabled}
            ?loading=\${args.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
          </button>
        \`)}
    </div>
  \`
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls(extraControls),
  render: args => html\`
    \${BUTTON_GRID_STYLES}
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
          <button
            \${defineEsdsButtonAttr}
            esds-button
            data-esds-button-size=\${ifDefined(variant)}
            square
            ?disabled=\${args.disabled}
            ?loading=\${args.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
          </button>
        \`)}
    </div>
  \`
}`,...Z.parameters?.docs?.source}}}})))()}$();export{q as Button,J as Link,Z as Sizes,Y as TextOnly,X as Types,Q as __namedExportsOrder,H as default};