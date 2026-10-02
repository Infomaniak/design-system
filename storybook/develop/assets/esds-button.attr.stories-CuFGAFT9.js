import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{g as t,h as n,n as r,p as i,t as a,u as o}from"./dist-D5vWbpez.js";import{c as ee,o as s}from"./iframe-mNQDWtf9.js";import{a as c,i as l,l as u,n as d,o as f,r as p,s as m,t as te}from"./injectable-style-sheet-BBpgD0Qy.js";var h,g;function _(){return(_=e((()=>{h=class{#e;constructor(e){this.#e=e}get ownerElement(){return this.#e.ownerElement}get name(){return this.#e.name}get value(){return this.#e.value}set value(e){this.#e.value=e}},g=class e{static#e=new WeakMap;static get root(){return this.of(document)}static of(t){let n=this.#e.get(t);return n===void 0&&(n=new e(t),this.#e.set(t,n)),n}#t;#n=new Map;#r=new WeakMap;#i=new WeakMap;#a=new WeakMap;#o=new WeakMap;#s=new MutationObserver(e=>{for(let t=0;t<e.length;t++){let{type:n,target:r,attributeName:i,addedNodes:a,removedNodes:o}=e[t];if(n===`attributes`){if(!(r instanceof Element))throw Error(`Expected Element.`);if(i===null)throw Error(`Expected attributeName not to be null.`);let n=r.attributes.getNamedItem(i)??this.#u(r,i);if(n===void 0)continue;this.#d(r,i,n);let a=n.value;for(let r=t+1;r<e.length;r++){let t=e[r];if(t.type===`attributes`&&t.target===n.ownerElement&&t.attributeName===n.name){a=t.oldValue;break}}this.#m(n,a)}else if(n===`childList`){for(let e of o)this.#f(e);for(let e of a)this.#f(e)}}});#c=new Map;constructor(e){this.#t=e}get root(){return this.#t}#l(e){let t=this.#n.get(e.name);if(t===void 0)throw Error(`Missing entry for attribute ${JSON.stringify(e.name)}`);let n=this.#r.get(e);return n===void 0&&(n=new t(e),this.#r.set(e,n)),n}#u(e,t){return this.#i.get(e)?.get(t)}#d(e,t,n){let r=this.#i.get(e);n===void 0?r!==void 0&&(r.delete(t),r.size===0&&this.#i.delete(e)):(r===void 0&&(r=new Map,this.#i.set(e,r)),r.set(t,n))}#f(e=this.#t){if(e.nodeType===Node.COMMENT_NODE||e.nodeType===Node.TEXT_NODE)return;let t=this.#t.createTreeWalker(e,NodeFilter.SHOW_ELEMENT);for(e.nodeType===Node.ELEMENT_NODE&&this.#p(e);t.nextNode();)this.#p(t.currentNode)}#p(e){let t=new Set,n=this.#i.get(e);if(n!==void 0)for(let r of n.values())t.add(r),e.attributes.getNamedItem(r.name)!==r&&this.#d(e,r.name,void 0);for(let n of e.attributes)this.#n.has(n.name)&&!t.has(n)&&(t.add(n),this.#d(e,n.name,n));for(let e of t)this.#m(e)}#m(e,t=e.value){let n=this.#l(e),r=e.ownerElement!==null&&e.ownerElement.isConnected&&t!==null,i=this.#a.get(n);(i===void 0||r!==i)&&(this.#a.set(n,r),r?n.connectedCallback?.():n.disconnectedCallback?.());let a=this.#o.get(n)??null,o=e.ownerElement===null?null:t;o!==a&&(o===null?this.#o.delete(n):(this.#o.set(n,o),a!==null&&n.changedCallback?.(a,o)))}define(e,t){if(!/^[a-z]+(-[a-z\d]+)+$/.test(e)||e.startsWith(`aria-`)||e.startsWith(`data-`))throw Error(`Invalid name ${JSON.stringify(e)}`);if(this.#n.has(e))throw Error(`CustomAttribute ${JSON.stringify(e)} already registered`);this.#n.set(e,t),this.#s.observe(this.#t,{childList:!0,subtree:!0,attributes:!0,attributeOldValue:!0,attributeFilter:Array.from(this.#n.keys())});for(let t of this.#t.querySelectorAll(`[${e}]`))this.#p(t);let n=this.#c.get(e);if(n!==void 0){for(let{resolve:e}of n)e(t);this.#c.delete(e)}}defineOptionally(e,t){this.#n.has(e)||this.define(e,t)}get(e){return this.#n.get(e)}whenDefined(e){let t=this.#n.get(e);if(t===void 0){let t=Promise.withResolvers(),n=this.#c.get(e);return n===void 0&&(n=[],this.#c.set(e,n)),n.push(t),t.promise}return Promise.resolve(t)}}})))()}function ne(e){return e.nodeType===Node.DOCUMENT_NODE}function re(e){return e instanceof ShadowRoot}var v;function y(){return(y=e((()=>{v=class e{static parse(t,n){let r=new CSSStyleSheet(n);return r.replaceSync(t),new e(r)}#e;#t;constructor(e){this.#e=e,this.#t=new WeakMap}inject(e){let t=this.#t.get(e);t===void 0?(this.#t.set(e,1),e.adoptedStyleSheets.push(this.#e)):this.#t.set(e,t+1);let n=!1;return()=>{n||(n=!0,this.#n(e))}}#n(e){let t=this.#t.get(e);if(t===1){this.#t.delete(e);let t=e.adoptedStyleSheets.indexOf(this.#e);t!==-1&&e.adoptedStyleSheets.splice(t,1)}else this.#t.set(e,t-1)}#r(e){let t=e;for(;t!==null;)if(ne(t)||re(t))return t;else t=t.parentNode;throw Error(`Could not find container`)}injectFrom(e){return this.inject(this.#r(e))}}})))()}var b;function x(){return(x=e((()=>{b=`kbd[esds-kbd]{box-sizing:border-box;align-items:center;gap:var(--esds-kbd-gap);padding:var(--esds-kbd-padding-block) var(--esds-kbd-padding-inline);background-color:var(--esds-kbd-background-color);border:var(--esds-kbd-border-width) solid var(--esds-kbd-border-color);border-radius:var(--esds-kbd-border-radius);color:var(--esds-kbd-content-color);font:var(--esds-kbd-font);display:inline-flex}`})))()}var S,C;function w(){return(w=e((()=>{y(),_(),x(),S=v.parse(b),C=class e extends h{static define({registry:t=g.root}={}){t.defineOptionally(`esds-kbd`,e)}#e;constructor(e){if(e.ownerElement?.tagName!==`KBD`)throw Error(`esds-kbd attribute can only be used on <kbd> elements`);super(e)}connectedCallback(){this.#e=S.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var T;function E(){return(E=e((()=>{t(),T=e=>e??i})))()}function D(){return(D=e((()=>{E()})))()}var O;function k(){return(k=e((()=>{O=`- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=1473-1429&t=ZWopR2KZ2XXD2MTX-0)

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
`})))()}var A;function j(){return(j=e((()=>{A=`:root{--esds-button-transition:.15s linear 0s;--esds-button-size:50px}[esds-button]{--computed-esds-button-padding-inline:calc(var(--esds-button-padding-inline) - var(--esds-button-border-width));--computed-esds-button-padding-block:calc(var(--esds-button-padding-block) - var(--esds-button-border-width));appearance:none;box-sizing:border-box;cursor:default;border-radius:var(--esds-button-border-radius);width:auto;padding-inline:var(--computed-esds-button-padding-inline);padding-block:var(--computed-esds-button-padding-block);justify-content:center;align-items:center;gap:var(--esds-button-gap-row) var(--esds-button-gap-column);font:var(--esds-button-content-font);border:var(--esds-button-border-width) solid var(--esds-button-border-color);background-color:var(--esds-button-background-color);color:var(--esds-button-content-color);transition:border-color var(--esds-button-transition), background-color var(--esds-button-transition), color var(--esds-button-transition);-webkit-hyphens:auto;hyphens:auto;overflow-wrap:anywhere;word-break:normal;white-space:normal;flex-wrap:wrap;margin:0;text-decoration:none;display:inline-flex}[esds-button]>esds-icon{font-size:var(--esds-button-icon-size);flex-shrink:0}[esds-button][square]{--computed-esds-button-padding-inline:0;--computed-esds-button-padding-block:0;width:var(--esds-button-size);height:var(--esds-button-size)}[esds-button]:focus-visible{outline:var(--esds-focus-border-width) solid var(--esds-focus-border-color);outline-offset:var(--esds-focus-border-offset);border-radius:var(--esds-focus-border-radius)}[esds-button]:not(:disabled,[disabled],[loading]):hover{background-color:color-mix(in srgb, rgb(from var(--esds-button-color-state-hover) r g b/100%) calc(var(--esds-button-color-state-hover-a) * 100%), rgb(from var(--esds-button-background-color) r g b/100%) calc(var(--esds-button-background-color-a) * (1 - var(--esds-button-color-state-hover-a)) * 100%))}[esds-button]:not(:disabled,[disabled],[loading]):active{background-color:color-mix(in srgb, rgb(from var(--esds-button-color-state-pressed) r g b/100%) calc(var(--esds-button-color-state-pressed-a) * 100%), rgb(from var(--esds-button-background-color) r g b/100%) calc(var(--esds-button-background-color-a) * (1 - var(--esds-button-color-state-pressed-a)) * 100%))}[esds-button]:is(:disabled,[disabled]){cursor:not-allowed;border-color:var(--esds-button-border-color-disabled);border-width:var(--esds-button-border-width-disabled);background-color:var(--esds-button-background-color-disabled);color:var(--esds-button-content-color-disabled)}[esds-button]:is(:disabled,[disabled]):not([square]){--computed-esds-button-padding-inline:calc(var(--esds-button-padding-inline) - var(--esds-button-border-width-disabled));--computed-esds-button-padding-block:calc(var(--esds-button-padding-block) - var(--esds-button-border-width-disabled))}[esds-button]:is(:disabled,[disabled])[loading]:after{border-top-color:var(--esds-button-content-color-disabled);border-left-color:var(--esds-button-content-color-disabled);border-bottom-color:var(--esds-button-content-color-disabled)}[esds-button][loading]{cursor:progress;color:#0000;transition-duration:0s;position:relative}[esds-button][loading]>*{visibility:hidden}[esds-button][loading]:after{--esds-button-loader-size:calc(var(--esds-button-icon-size) * .8125);content:"";box-sizing:border-box;top:calc(50% - var(--esds-button-loader-size) / 2);left:calc(50% - var(--esds-button-loader-size) / 2);width:var(--esds-button-loader-size);height:var(--esds-button-loader-size);border:2px solid var(--esds-button-content-color);border-right-color:#0000;border-radius:50%;animation:1s linear infinite esds-button-loader-animation;display:block;position:absolute}@keyframes esds-button-loader-animation{0%{rotate:0deg}to{rotate:360deg}}`})))()}function M(e){return e.tagName===`A`}function N(e){return P(e)||F(e)}function P(e){return e.hasAttribute(`disabled`)||Reflect.has(e,`disabled`)&&Reflect.get(e,`disabled`)}function F(e){return e.hasAttribute(`loading`)}function I(e,t){e.addEventListener(`${t}down`,n=>{N(e)&&(n.preventDefault(),n.stopPropagation(),e.setAttribute(`inert`,``),window.addEventListener(`${t}up`,()=>{e.removeAttribute(`inert`),e instanceof HTMLElement&&F(e)&&!P(e)&&e.focus()},{once:!0}))})}var L,R;function z(){return(z=e((()=>{d(),c(),j(),L=te.parse(A),R=class e extends l{static define({registry:t=p.root}={}){t.defineOptionally(`esds-button`,e)}#e;#t=new MutationObserver(()=>{this.#r()});#n=void 0;constructor(e){if(e.ownerElement?.tagName!==`BUTTON`&&e.ownerElement?.tagName!==`A`)throw Error(`esds-button attribute can only be used on <button> or <a> elements`);super(e);let t=this.ownerElement;M(t)&&(t.role=`button`,t.addEventListener(`keypress`,e=>{if(e.code===`Space`){if(N(t))return;t.click()}})),I(t,`pointer`),I(t,`key`)}#r(){let e=this.ownerElement;M(e)&&(N(e)?e.setAttribute(`aria-disabled`,`true`):e.removeAttribute(`aria-disabled`),F(e)?e.setAttribute(`aria-busy`,`true`):e.removeAttribute(`aria-busy`),P(e)?(this.#n===void 0&&(this.#n=e.getAttribute(`tabindex`)),e.setAttribute(`tabindex`,`-1`)):this.#n!==void 0&&(this.#n===null?e.removeAttribute(`tabindex`):e.setAttribute(`tabindex`,this.#n),this.#n=void 0)),F(e)?e.setAttribute(`aria-label`,e.textContent.trim()):e.removeAttribute(`aria-label`)}connectedCallback(){let e=this.ownerElement;this.#e=L.injectFrom(e),M(e)&&(this.#t.observe(e,{attributes:!0,attributeFilter:[`disabled`,`loading`]}),this.#r())}disconnectedCallback(){this.#e?.(),this.#e=void 0,this.#t.disconnect()}}})))()}var B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{ee(),w(),r(),o(),D(),m(),c(),k(),z(),s.define(),B=f(e=>{R.define({registry:p.of(e.ownerDocument)}),C.define({registry:p.of(e.ownerDocument)})}),{args:V,argTypes:H}=a(`esds-button`),U={title:`Components/Button`,component:`esds-button`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:O}}},args:V,argTypes:H},W={disabled:{value:!1,type:`boolean`},loading:{value:!1,type:`boolean`}},G=[`primary`,`primary-destructive`,`secondary`,`secondary-destructive`,`ghost-primary`,`ghost-secondary`,`ghost-destructive`],K=[`small`,`medium`,`large`],q={...u({...W,content:`Text content`,buttonType:{value:`primary`,type:`select`,options:G},size:{value:`medium`,type:`select`,options:K}}),render:e=>n`<button
      ${B}
      esds-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
      data-esds-button-type=${T(e.buttonType)}
      data-esds-button-size=${T(e.size)}
      @click="${()=>console.log(`clicked`)}"
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${e.content}
      <kbd esds-kbd="">⌘</kbd>
    </button>`},J={...u({...W,content:`Link content`,href:`https://infomaniak.com`}),render:e=>n`<a
      ${B}
      esds-button
      href="${e.href}"
      target="_blank"
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${e.content}
    </a>`},Y={...u({...W,content:`Text content`}),render:e=>n`<button
      ${B}
      esds-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      ${e.content}
    </button>`},X={...u(W),render:e=>n`
    <style>
      .buttons-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 16px;

        & > div {
          display: flex;
          align-items: center;
          gap: 12px;
        }
      }
    </style>
    <div class="buttons-container">
      ${G.map(t=>n`
          <div>
            <button
              ${B}
              esds-button
              data-esds-button-type=${T(t)}
              ?disabled=${e.disabled}
              ?loading=${e.loading}
            >
              <esds-icon name="esds:plus"></esds-icon>
              ${t}
            </button>
            <!--
            TODO
            <button
              ${B}
              esds-button
              data-esds-button-type=${T(t)}
              square
              ?disabled=${e.disabled}
              ?loading=${e.loading}
            >
              <esds-icon name="esds:plus"></esds-icon>
            </button>
            -->
          </div>
        `)}
    </div>
  `},Z={...u(W),render:e=>n`
    <style>
      .buttons-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 16px;

        & > div {
          display: flex;
          align-items: center;
          gap: 12px;
        }
      }
    </style>
    <div class="buttons-container">
      ${K.map(t=>n`
          <div>
            <button
              ${B}
              esds-button
              data-esds-button-size=${T(t)}
              ?disabled=${e.disabled}
              ?loading=${e.loading}
            >
              <esds-icon name="esds:plus"></esds-icon>
              ${t}
            </button>
            <!--
            TODO
            <button
              ${B}
              esds-button
              data-esds-button-size=${T(t)}
              square
              ?disabled=${e.disabled}
              ?loading=${e.loading}
            >
              <esds-icon name="esds:plus"></esds-icon>
            </button>
            -->
          </div>
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
    <style>
      .buttons-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 16px;

        & > div {
          display: flex;
          align-items: center;
          gap: 12px;
        }
      }
    </style>
    <div class="buttons-container">
      \${BUTTON_TYPES.map(variant => html\`
          <div>
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
            <!--
            TODO
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
            -->
          </div>
        \`)}
    </div>
  \`
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls(extraControls),
  render: args => html\`
    <style>
      .buttons-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 16px;

        & > div {
          display: flex;
          align-items: center;
          gap: 12px;
        }
      }
    </style>
    <div class="buttons-container">
      \${BUTTON_SIZES.map(variant => html\`
          <div>
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
            <!--
            TODO
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
            -->
          </div>
        \`)}
    </div>
  \`
}`,...Z.parameters?.docs?.source}}}})))()}$();export{q as Button,J as Link,Z as Sizes,Y as TextOnly,X as Types,Q as __namedExportsOrder,U as default};