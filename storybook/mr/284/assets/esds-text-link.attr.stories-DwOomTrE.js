import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{_ as t,a as n,c as r,d as i,f as a,g as o,h as s,i as c,l,o as u,u as d,v as f}from"./iframe-unRPtA8z.js";function p(e){return typeof e==`string`?{value:e}:e}function m(e){return{args:Object.fromEntries(Object.entries(e).map(([e,t])=>{let{value:n}=p(t);return[e,n]})),argTypes:Object.fromEntries(Object.entries(e).map(([e,t])=>{let{type:n}=p(t);return[e,{control:{type:n},table:{category:`Interactive Controls`}}]}))}}var h,g;function _(){return(_=e((()=>{f(),d(),a(),h=new WeakMap,g=i(class extends l{render(e){return o}update(e,[t]){let n=t!==this.G;return n&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),o}rt(e){if(this.G!==void 0)if(this.isConnected||(e=void 0),typeof this.G==`function`){let t=this.ht??globalThis,n=h.get(t);n===void 0&&(n=new WeakMap,h.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G==`function`?h.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}})})))()}function v(){return(v=e((()=>{_()})))()}function y(e){let t;return g(n=>{t!==void 0&&(t(),t=void 0),n!==void 0&&n instanceof HTMLElement&&(t=e(n))})}function b(){return(b=e((()=>{v()})))()}var x,S;function C(){return(C=e((()=>{x=class{#e;constructor(e){this.#e=e}get ownerElement(){return this.#e.ownerElement}get name(){return this.#e.name}get value(){return this.#e.value}set value(e){this.#e.value=e}},S=class e{static#e=new WeakMap;static get root(){return this.of(document)}static of(t){let n=this.#e.get(t);return n===void 0&&(n=new e(t),this.#e.set(t,n)),n}#t;#n=new Map;#r=new WeakMap;#i=new WeakMap;#a=new WeakMap;#o=new WeakMap;#s=new MutationObserver(e=>{for(let t=0;t<e.length;t++){let{type:n,target:r,attributeName:i,addedNodes:a,removedNodes:o}=e[t];if(n===`attributes`){if(!(r instanceof Element))throw Error(`Expected Element.`);if(i===null)throw Error(`Expected attributeName not to be null.`);let n=r.attributes.getNamedItem(i)??this.#u(r,i);if(n===void 0)continue;this.#d(r,i,n);let a=n.value;for(let r=t+1;r<e.length;r++){let t=e[r];if(t.type===`attributes`&&t.target===n.ownerElement&&t.attributeName===n.name){a=t.oldValue;break}}this.#m(n,a)}else if(n===`childList`){for(let e of o)this.#f(e);for(let e of a)this.#f(e)}}});#c=new Map;constructor(e){this.#t=e}#l(e){let t=this.#n.get(e.name);if(t===void 0)throw Error(`Missing entry for attribute ${JSON.stringify(e.name)}`);let n=this.#r.get(e);return n===void 0&&(n=new t(e),this.#r.set(e,n)),n}#u(e,t){return this.#i.get(e)?.get(t)}#d(e,t,n){let r=this.#i.get(e);n===void 0?r!==void 0&&(r.delete(t),r.size===0&&this.#i.delete(e)):(r===void 0&&(r=new Map,this.#i.set(e,r)),r.set(t,n))}#f(e=this.#t){if(e.nodeType===Node.COMMENT_NODE||e.nodeType===Node.TEXT_NODE)return;let t=this.#t.createTreeWalker(e,NodeFilter.SHOW_ELEMENT);for(e.nodeType===Node.ELEMENT_NODE&&this.#p(e);t.nextNode();)this.#p(t.currentNode)}#p(e){let t=new Set,n=this.#i.get(e);if(n!==void 0)for(let r of n.values())t.add(r),e.attributes.getNamedItem(r.name)!==r&&this.#d(e,r.name,void 0);for(let n of e.attributes)this.#n.has(n.name)&&!t.has(n)&&(t.add(n),this.#d(e,n.name,n));for(let e of t)this.#m(e)}#m(e,t=e.value){let n=this.#l(e),r=e.ownerElement!==null&&e.ownerElement.isConnected&&t!==null,i=this.#a.get(n);(i===void 0||r!==i)&&(this.#a.set(n,r),r?n.connectedCallback?.():n.disconnectedCallback?.());let a=this.#o.get(n)??null,o=e.ownerElement===null?null:t;o!==a&&(o===null?this.#o.delete(n):(this.#o.set(n,o),a!==null&&n.changedCallback?.(a,o)))}define(e,t){if(!/^[a-z]+(-[a-z\d]+)+$/.test(e)||e.startsWith(`aria-`)||e.startsWith(`data-`))throw Error(`Invalid name ${JSON.stringify(e)}`);if(this.#n.has(e))throw Error(`CustomAttribute ${JSON.stringify(e)} already registered`);this.#n.set(e,t),this.#s.observe(this.#t,{childList:!0,subtree:!0,attributes:!0,attributeOldValue:!0,attributeFilter:Array.from(this.#n.keys())});for(let t of this.#t.querySelectorAll(`[${e}]`))this.#p(t);let n=this.#c.get(e);if(n!==void 0){for(let{resolve:e}of n)e(t);this.#c.delete(e)}}defineOptionally(e,t){this.#n.has(e)||this.define(e,t)}get(e){return this.#n.get(e)}whenDefined(e){let t=this.#n.get(e);if(t===void 0){let t=Promise.withResolvers(),n=this.#c.get(e);return n===void 0&&(n=[],this.#c.set(e,n)),n.push(t),t.promise}return Promise.resolve(t)}}})))()}var w;function T(){return(T=e((()=>{w=`## Usage

Import and register the custom attribute \`esds-text-link\`:

\`\`\`ts
import { EsdsTextLinkAttr } from '@infomaniak-design-system/components';

EsdsTextLinkAttr.define();
\`\`\`

\`\`\`html
<a
  esds-text-link
  href="https://example.com"
>
  Link text
</a>
\`\`\`

## Description

Adding the custom attribute \`esds-text-link\` to an \`<a>\` element, applies the \`esds-text-link\` styles to this element.

> [!NOTE]
> The \`<a>\` element may be used as any other \`<a>\` element.

## Demo
`})))()}var E;function D(){return(D=e((()=>{E=class e{static parse(t,n){let r=new CSSStyleSheet(n);return r.replaceSync(t),new e(r)}#e;#t;constructor(e){this.#e=e,this.#t=new WeakMap}inject(e){let t=this.#t.get(e);t===void 0?(this.#t.set(e,1),e.adoptedStyleSheets.push(this.#e)):this.#t.set(e,t+1);let n=!1;return()=>{n||(n=!0,this.#n(e))}}#n(e){let t=this.#t.get(e);if(t===1){this.#t.delete(e);let t=e.adoptedStyleSheets.indexOf(this.#e);e.adoptedStyleSheets.splice(t,1)}else this.#t.set(e,t-1)}#r(e){let t=e;for(;t!==null;)if(t instanceof Document||t instanceof ShadowRoot)return t;else t=t.parentNode;throw Error(`Could not find container`)}injectFrom(e){return this.inject(this.#r(e))}}})))()}var O;function k(){return(k=e((()=>{O=`[esds-text-link]{color:var(--esds-text-link-color-default);text-decoration:none;display:inline}[esds-text-link]:focus-visible{outline-offset:2px;outline:2px solid}[esds-text-link]:hover{color:var(--esds-text-link-color-hover)}[esds-text-link]:active{color:var(--esds-text-link-color-pressed)}[esds-text-link]:visited{color:var(--esds-text-link-color-visited-default)}[esds-text-link]:visited:hover{color:var(--esds-text-link-color-visited-hover)}[esds-text-link]:visited:active{color:var(--esds-text-link-color-visited-pressed)}[esds-text-link][underline]{text-decoration:underline}`})))()}var A,j;function M(){return(M=e((()=>{C(),D(),k(),A=E.parse(O),j=class e extends x{static define({registry:t=S.root}={}){t.defineOptionally(`esds-text-link`,e)}#e;constructor(e){if(e.ownerElement?.tagName!==`A`)throw Error(`esds-text-link attribute can only be used on <a> elements`);super(e)}connectedCallback(){this.#e=A.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{r(),n(),s(),b(),C(),T(),M(),u.define(),N=y(e=>{j.define({registry:S.of(e.ownerDocument)})}),{args:P,argTypes:F}=c(`esds-text-link`),I={title:`Components/Link`,component:`esds-text-link`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:w}}},args:P,argTypes:F},L={...m({href:`https://infomaniak.com`}),render:e=>t`<a
      ${N}
      esds-text-link
      href="${e.href}"
      >Text link</a
    >`},R={...m({href:`https://infomaniak.com`,target:`_blank`,rel:`noopener noreferrer nofollow`}),render:e=>t`
    <a
      ${N}
      esds-text-link
      href="${e.href}"
      target="${e.target}"
      rel="${e.rel}"
      >Opens in new tab</a
    >
  `},z={...m({href:`/some-file.pdf`,download:`my-file.pdf`}),render:e=>t`
    <a
      ${N}
      esds-text-link
      href="${e.href}"
      download="${e.download}"
    >
      Download folder
    </a>
  `},B={render:()=>t`
    <a
      ${N}
      esds-text-link
      href="https://infomaniak.com"
      target="_blank"
    >
      Infomaniak
      <esds-icon
        name="esds:square-arrow-out-up-right"
        inline
      ></esds-icon>
    </a>
  `},V={...m({href:`https://infomaniak.com`}),render:e=>t`
    <a
      ${N}
      esds-text-link
      underline
      href="${e.href}"
    >
      Link with underline
    </a>
  `},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    href: 'https://infomaniak.com'
  }),
  render: args => html\`<a
      \${defineEsdsLinkAttr}
      esds-text-link
      href="\${args.href}"
      >Text link</a
    >\`
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    href: 'https://infomaniak.com',
    target: '_blank',
    rel: 'noopener noreferrer nofollow'
  }),
  render: args => html\`
    <a
      \${defineEsdsLinkAttr}
      esds-text-link
      href="\${args.href}"
      target="\${args.target}"
      rel="\${args.rel}"
      >Opens in new tab</a
    >
  \`
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    href: '/some-file.pdf',
    download: 'my-file.pdf'
  }),
  render: args => html\`
    <a
      \${defineEsdsLinkAttr}
      esds-text-link
      href="\${args.href}"
      download="\${args.download}"
    >
      Download folder
    </a>
  \`
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <a
      \${defineEsdsLinkAttr}
      esds-text-link
      href="https://infomaniak.com"
      target="_blank"
    >
      Infomaniak
      <esds-icon
        name="esds:square-arrow-out-up-right"
        inline
      ></esds-icon>
    </a>
  \`
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    href: 'https://infomaniak.com'
  }),
  render: args => html\`
    <a
      \${defineEsdsLinkAttr}
      esds-text-link
      underline
      href="\${args.href}"
    >
      Link with underline
    </a>
  \`
}`,...V.parameters?.docs?.source}}},H=[`Default`,`External`,`Download`,`WithIcon`,`Underline`]})))()}U();export{L as Default,z as Download,R as External,V as Underline,B as WithIcon,H as __namedExportsOrder,I as default};