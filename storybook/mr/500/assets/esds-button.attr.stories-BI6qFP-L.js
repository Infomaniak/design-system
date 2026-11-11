import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{c as a,o}from"./iframe-D65E2my1.js";import{r as s,t as c}from"./if-defined-DYgFDik5.js";import{n as l}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as u,o as d,r as f,s as p}from"./injectable-style-sheet-CJbmy-p9.js";import{n as m,t as h}from"./esds-button.attr-B9RdiHI5.js";var g,_;function v(){return(v=e((()=>{g=class{#e;constructor(e){this.#e=e}get ownerElement(){return this.#e.ownerElement}get name(){return this.#e.name}get value(){return this.#e.value}set value(e){this.#e.value=e}},_=class e{static#e=new WeakMap;static get root(){return this.of(document)}static of(t){let n=this.#e.get(t);return n===void 0&&(n=new e(t),this.#e.set(t,n)),n}#t;#n=new Map;#r=new WeakMap;#i=new WeakMap;#a=new WeakMap;#o=new WeakMap;#s=new MutationObserver(e=>{for(let t=0;t<e.length;t++){let{type:n,target:r,attributeName:i,addedNodes:a,removedNodes:o}=e[t];if(n===`attributes`){if(!(r instanceof Element))throw Error(`Expected Element.`);if(i===null)throw Error(`Expected attributeName not to be null.`);let n=r.attributes.getNamedItem(i)??this.#u(r,i);if(n===void 0)continue;this.#d(r,i,n);let a=n.value;for(let r=t+1;r<e.length;r++){let t=e[r];if(t.type===`attributes`&&t.target===n.ownerElement&&t.attributeName===n.name){a=t.oldValue;break}}this.#m(n,a)}else if(n===`childList`){for(let e of o)this.#f(e);for(let e of a)this.#f(e)}}});#c=new Map;constructor(e){this.#t=e}get root(){return this.#t}#l(e){let t=this.#n.get(e.name);if(t===void 0)throw Error(`Missing entry for attribute ${JSON.stringify(e.name)}`);let n=this.#r.get(e);return n===void 0&&(n=new t(e),this.#r.set(e,n)),n}#u(e,t){return this.#i.get(e)?.get(t)}#d(e,t,n){let r=this.#i.get(e);n===void 0?r!==void 0&&(r.delete(t),r.size===0&&this.#i.delete(e)):(r===void 0&&(r=new Map,this.#i.set(e,r)),r.set(t,n))}#f(e=this.#t){if(e.nodeType===Node.COMMENT_NODE||e.nodeType===Node.TEXT_NODE)return;let t=this.#t.createTreeWalker(e,NodeFilter.SHOW_ELEMENT);for(e.nodeType===Node.ELEMENT_NODE&&this.#p(e);t.nextNode();)this.#p(t.currentNode)}#p(e){let t=new Set,n=this.#i.get(e);if(n!==void 0)for(let r of n.values())t.add(r),e.attributes.getNamedItem(r.name)!==r&&this.#d(e,r.name,void 0);for(let n of e.attributes)this.#n.has(n.name)&&!t.has(n)&&(t.add(n),this.#d(e,n.name,n));for(let e of t)this.#m(e)}#m(e,t=e.value){let n=this.#l(e),r=e.ownerElement!==null&&e.ownerElement.isConnected&&t!==null,i=this.#a.get(n);(i===void 0||r!==i)&&(this.#a.set(n,r),r?n.connectedCallback?.():n.disconnectedCallback?.());let a=this.#o.get(n)??null,o=e.ownerElement===null?null:t;o!==a&&(o===null?this.#o.delete(n):(this.#o.set(n,o),a!==null&&n.changedCallback?.(a,o)))}define(e,t){if(!/^[a-z]+(-[a-z\d]+)+$/.test(e)||e.startsWith(`aria-`)||e.startsWith(`data-`))throw Error(`Invalid name ${JSON.stringify(e)}`);if(this.#n.has(e))throw Error(`CustomAttribute ${JSON.stringify(e)} already registered`);this.#n.set(e,t),this.#s.observe(this.#t,{childList:!0,subtree:!0,attributes:!0,attributeOldValue:!0,attributeFilter:Array.from(this.#n.keys())});for(let t of this.#t.querySelectorAll(`[${e}]`))this.#p(t);let n=this.#c.get(e);if(n!==void 0){for(let{resolve:e}of n)e(t);this.#c.delete(e)}}defineOptionally(e,t){this.#n.has(e)||this.define(e,t)}get(e){return this.#n.get(e)}whenDefined(e){let t=this.#n.get(e);if(t===void 0){let t=Promise.withResolvers(),n=this.#c.get(e);return n===void 0&&(n=[],this.#c.set(e,n)),n.push(t),t.promise}return Promise.resolve(t)}}})))()}function y(e){return e.nodeType===Node.DOCUMENT_NODE}function b(e){return e instanceof ShadowRoot}var x;function S(){return(S=e((()=>{x=class e{static parse(t,n){let r=new CSSStyleSheet(n);return r.replaceSync(t),new e(r)}#e;#t;constructor(e){this.#e=e,this.#t=new WeakMap}inject(e){let t=this.#t.get(e);t===void 0?(this.#t.set(e,1),e.adoptedStyleSheets.push(this.#e)):this.#t.set(e,t+1);let n=!1;return()=>{n||(n=!0,this.#n(e))}}#n(e){let t=this.#t.get(e);if(t===1){this.#t.delete(e);let t=e.adoptedStyleSheets.indexOf(this.#e);t!==-1&&e.adoptedStyleSheets.splice(t,1)}else this.#t.set(e,t-1)}#r(e){let t=e;for(;t!==null;)if(y(t)||b(t))return t;else t=t.parentNode;throw Error(`Could not find container`)}injectFrom(e){return this.inject(this.#r(e))}}})))()}var C;function w(){return(w=e((()=>{C=`kbd[esds-kbd]{box-sizing:border-box;align-items:center;gap:var(--esds-kbd-gap);padding:var(--esds-kbd-padding-block) var(--esds-kbd-padding-inline);background-color:var(--esds-kbd-background-color);border:var(--esds-kbd-border-width) solid var(--esds-kbd-border-color);border-radius:var(--esds-kbd-border-radius);color:var(--esds-kbd-content-color);font:var(--esds-kbd-font);display:inline-flex}`})))()}var T,E;function D(){return(D=e((()=>{S(),v(),w(),T=x.parse(C),E=class e extends g{static define({registry:t=_.root}={}){t.defineOptionally(`esds-kbd`,e)}#e;constructor(e){if(e.ownerElement?.tagName!==`KBD`)throw Error(`esds-kbd attribute can only be used on <kbd> elements`);super(e)}connectedCallback(){this.#e=T.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var O;function k(){return(k=e((()=>{O=`- [Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=1473-1429&t=ZWopR2KZ2XXD2MTX-0)

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
`})))()}var A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{a(),D(),r(),n(),c(),p(),u(),k(),m(),o.define(),A=d(e=>{h.define({registry:f.of(e.ownerDocument)}),E.define({registry:f.of(e.ownerDocument)})}),{args:j,argTypes:M}=i(`esds-button`),N={title:`Components/Button`,component:`esds-button`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:O}}},args:j,argTypes:M},P={disabled:{value:!1,type:`boolean`},loading:{value:!1,type:`boolean`}},F=[`primary`,`primary-destructive`,`secondary`,`secondary-destructive`,`ghost-primary`,`ghost-secondary`,`ghost-destructive`],I=[`small`,`medium`,`large`],L=t`<style>
  .buttons-container {
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    justify-content: start;
    justify-items: start;
    gap: 16px 12px;
  }
</style>`,R={...l({...P,content:`Text content`,buttonType:{value:`primary`,type:`select`,options:F},size:{value:`medium`,type:`select`,options:I}}),render:e=>t`<button
      ${A}
      esds-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
      data-esds-button-type=${s(e.buttonType)}
      data-esds-button-size=${s(e.size)}
      @click="${()=>console.log(`clicked`)}"
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${e.content}
      <kbd esds-kbd="">⌘</kbd>
    </button>`},z={...l({...P,content:`Link content`,href:`https://infomaniak.com`}),render:e=>t`<a
      ${A}
      esds-button
      href="${e.href}"
      target="_blank"
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${e.content}
    </a>`},B={...l({...P,content:`Text content`}),render:e=>t`<button
      ${A}
      esds-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      ${e.content}
    </button>`},V={...l(P),render:e=>t`
    ${L}
    <div class="buttons-container">
      ${F.map(n=>t`
          <button
            ${A}
            esds-button
            data-esds-button-type=${s(n)}
            ?disabled=${e.disabled}
            ?loading=${e.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
            ${n}
          </button>
          <button
            ${A}
            esds-button
            data-esds-button-type=${s(n)}
            square
            ?disabled=${e.disabled}
            ?loading=${e.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
          </button>
        `)}
    </div>
  `},H={...l(P),render:e=>t`
    ${L}
    <div class="buttons-container">
      ${I.map(n=>t`
          <button
            ${A}
            esds-button
            data-esds-button-size=${s(n)}
            ?disabled=${e.disabled}
            ?loading=${e.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
            ${n}
          </button>
          <button
            ${A}
            esds-button
            data-esds-button-size=${s(n)}
            square
            ?disabled=${e.disabled}
            ?loading=${e.loading}
          >
            <esds-icon name="esds:plus"></esds-icon>
          </button>
        `)}
    </div>
  `},U=[`Button`,`Link`,`TextOnly`,`Types`,`Sizes`],R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}}})))()}W();export{R as Button,z as Link,H as Sizes,B as TextOnly,V as Types,U as __namedExportsOrder,N as default};