import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t,h as n,n as r,t as i,u as a,x as o}from"./dist-D5vWbpez.js";import{_ as s,d as c,f as l,g as u,h as d,l as f,m as p}from"./iframe-QUq7cw7F.js";var m;function h(){return(h=e((()=>{m=`:host{display:block}:host(:not([orientation=vertical])){width:100%}:host([orientation=vertical]){flex-direction:column;align-self:stretch;display:inline-flex}.separator{align-items:center;display:flex}:host([orientation=vertical]) .separator{flex-direction:column;flex:1}.line{background-color:var(--esds-separator-color);flex:1}:host(:not([orientation=vertical])) .line{height:var(--esds-separator-thickness)}:host([orientation=vertical]) .line{width:var(--esds-separator-thickness)}:host(:not([orientation=vertical])) .content:not([hidden]){margin-inline:var(--esds-separator-spacing)}:host([orientation=vertical]) .content:not([hidden]){margin-block:var(--esds-separator-spacing)}.content[hidden]{display:none}`})))()}function g(e,t,n,r,i,a){var o,s,c,l,u,d,f,p=Symbol.metadata||Symbol.for(`Symbol.metadata`),m=Object.defineProperty,h=Object.create,g=[h(null),h(null)],v=t.length;function x(t,n,r){return function(i,a){n&&(a=i,i=e);for(var o=0;o<t.length;o++)a=t[o].apply(i,r?[a]:[]);return r?a:i}}function S(e,t,n,r){if(typeof e!=`function`&&(r||e!==void 0))throw TypeError(t+` must `+(n||`be`)+` a function`+(r?``:` or undefined`));return e}function C(e,t,n,r,i,a,c,l,u,d,f){function p(e){if(!f(e))throw TypeError(`Attempted to access private element on non-instance`)}var h=[].concat(t[0]),_=t[3],v=!c,b=i===1,C=i===3,w=i===4,T=i===2;function E(t,n,r){return function(i,a){return n&&(a=i,i=e),r&&r(i),D[t].call(i,a)}}if(!v){var D={},O=[],k=C?`get`:w||b?`set`:`value`;if(u?(d||b?D={get:y(function(){return _(this)},r,`get`),set:function(e){t[4](this,e)}}:D[k]=_,d||y(D[k],r,T?``:k)):d||(D=Object.getOwnPropertyDescriptor(e,r)),!d&&!u){if((s=g[+l][r])&&(s^i)!==7)throw Error(`Decorating two elements with the same name (`+D[k].name+`) is not supported yet`);g[+l][r]=i<3?1:i}}for(var A=e,j=h.length-1;j>=0;j-=n?2:1){var M=S(h[j],`A decorator`,`be`,!0),N=n?h[j-1]:void 0,P={},F={kind:[`field`,`accessor`,`method`,`getter`,`setter`,`class`][i],name:r,metadata:o,addInitializer:function(e,t){if(e.v)throw TypeError(`attempted to call addInitializer after decoration was finished`);S(t,`An initializer`,`be`,!0),a.push(t)}.bind(null,P)};if(v)s=M.call(N,A,F),P.v=1,S(s,`class decorators`,`return`)&&(A=s);else if(F.static=l,F.private=u,s=F.access={has:u?f.bind():function(e){return r in e}},w||(s.get=u?T?function(e){return p(e),D.value}:E(`get`,0,p):function(e){return e[r]}),T||C||(s.set=u?E(`set`,0,p):function(e,t){e[r]=t}),A=M.call(N,b?{get:D.get,set:D.set}:D[k],F),P.v=1,b){if(typeof A==`object`&&A)(s=S(A.get,`accessor.get`))&&(D.get=s),(s=S(A.set,`accessor.set`))&&(D.set=s),(s=S(A.init,`accessor.init`))&&O.unshift(s);else if(A!==void 0)throw TypeError(`accessor decorators must return an object with get, set, or init properties or undefined`)}else S(A,(d?`field`:`method`)+` decorators`,`return`)&&(d?O.unshift(A):D[k]=A)}return i<2&&c.push(x(O,l,1),x(a,l,0)),d||v||(u?b?c.splice(-1,0,E(`get`,l),E(`set`,l)):c.push(T?D[k]:S.call.bind(D[k])):m(e,r,D)),A}function w(e){return m(e,p,{configurable:!0,enumerable:!0,value:o})}return a!==void 0&&(o=a[p]),o=h(o??null),u=[],d=function(e){e&&u.push(x(e))},f=function(t,r){for(var a=0;a<n.length;a++){var o=n[a],s=o[1],d=7&s;if((8&s)==t&&!d==r){var f=o[2],p=!!o[3],m=16&s;C(t?e:e.prototype,o,m,p?`#`+f:_(f),d,d<2?[]:t?l||=[]:c||=[],u,!!t,p,r,t&&p?function(t){return b(t)===e}:i)}}},f(8,0),f(0,0),f(8,1),f(0,1),d(c),d(l),s=u,v||w(e),{e:s,get c(){var n=[];return v&&[w(e=C(e,[t],r,e.name,5,n)),x(n,1)]}}}function _(e){var t=v(e,`string`);return typeof t==`symbol`?t:t+``}function v(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function y(e,t,n){typeof t==`symbol`&&(t=(t=t.description)?`[`+t+`]`:``);try{Object.defineProperty(e,"name",{configurable:!0,value:n?n+` `+t:t})}catch{}return e}function b(e){if(Object(e)!==e)throw TypeError(`right-hand side of 'in' should be an object, got `+(e===null?`null`:typeof e));return e}var x,S,C,w,T,E;function D(){return(D=e((()=>{u(),p(),h(),a(),f(),E=class extends (x=s(t)){static{[S,C,w,T]=g(this,[],[[c({type:String,reflect:!0}),1,`orientation`],[c({type:Boolean,reflect:!0}),1,`decorative`]],0,void 0,x).e}static define(){l(`esds-separator`,this)}static styles=o(m);#e=S(this,`horizontal`);get orientation(){return this.#e}set orientation(e){this.#e=e}#t=(C(this),w(this,!1));get decorative(){return this.#t}set decorative(e){this.#t=e}#n=(T(this),d(!1));#r=new MutationObserver(()=>{this.#i()});connectedCallback(){super.connectedCallback(),this.#r.observe(this,{childList:!0,characterData:!0,subtree:!0}),this.#i()}disconnectedCallback(){super.disconnectedCallback(),this.#r.disconnect()}updated(){this.decorative?(this.setAttribute(`role`,`presentation`),this.removeAttribute(`aria-orientation`)):(this.setAttribute(`role`,`separator`),this.setAttribute(`aria-orientation`,this.orientation===`vertical`?`vertical`:`horizontal`))}render(){return n`
      <div class="separator">
        <span class="line"></span>
        <span
          class="content"
          ?hidden="${!this.#n.get()}"
        >
          <slot></slot>
        </span>
        <span class="line"></span>
      </div>
    `}#i(){let e=Array.from(this.childNodes).some(e=>this.#a(e));this.#n.set(e)}#a(e){return e.nodeType===Node.TEXT_NODE?(e.textContent??``).trim().length>0:e.nodeType===Node.ELEMENT_NODE}}})))()}var O;function k(){return(k=e((()=>{O=`## Setup

Import and register the separator component in your application's entry file (e.g., \`main.ts\` or \`index.ts\`):

\`\`\`ts
import { EsdsSeparatorComponent } from '@infomaniak-design-system/components';

EsdsSeparatorComponent.define();
\`\`\`

> **Important:** \`define()\` must be called before any component renders \`<esds-separator>\`.

## Usage

### Horizontal

The separator is full-width (\`width: 100%\`); avoid \`margin-inline\` on it, as it would cause a horizontal overflow.

\`\`\`html
<esds-separator></esds-separator>
\`\`\`

### Vertical

In a flex or grid container, the vertical separator stretches to fill the available space:

\`\`\`html
<div style="display: flex; align-items: center; gap: 1rem; height: 3rem">
  <span>Left</span>
  <esds-separator orientation="vertical"></esds-separator>
  <span>Right</span>
</div>
\`\`\`

> **Note:** outside a flex/grid container, set an explicit height on the element (e.g. \`style="height: 3rem"\`), otherwise it collapses.

### With content

Use the default slot to display a label (or any content) between the two lines:

\`\`\`html
<esds-separator>OR</esds-separator>
\`\`\`

### Decorative

Removes the separator from the accessibility tree:

\`\`\`html
<esds-separator decorative></esds-separator>
\`\`\`

## Description

The separator divides content horizontally or vertically. Unlike the native \`<hr>\` element, it supports vertical orientation and can display content between its two lines.

### Semantics

- The component has \`role="separator"\` and exposes \`aria-orientation\` matching the \`orientation\` attribute.
- Slotted content is visual-only: \`role="separator"\` hides its children from assistive technology. Set \`aria-label\` explicitly on the element if a name is needed.
- With the \`decorative\` attribute, it switches to \`role="presentation"\` and is removed from the accessibility tree.
- For thematic breaks in prose content, prefer the native \`<hr>\` element; this component is intended for interface layouts (menus, toolbars, forms, card sections...).

Its appearance is driven by the design tokens; changes to the look belong to the token layer, not to component consumers.

## Demo
`})))()}var A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{D(),r(),a(),k(),E.define(),{args:A,argTypes:j,template:M}=i(`esds-separator`),N={title:`Components/Separator`,component:`esds-separator`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:O}}},args:A,argTypes:j,render:e=>M(e)},P={},F={args:{orientation:`vertical`},render:e=>n`
    <div style="display: flex; align-items: center; gap: 1rem; height: 3rem">
      <span>Left</span>
      ${M(e)}
      <span>Right</span>
    </div>
  `},I={args:{orientation:`vertical`,"default-slot":`OR`},render:e=>n`
    <div style="display: flex; align-items: center; gap: 1rem; height: 8rem">
      <span>Left</span>
      ${M(e)}
      <span>Right</span>
    </div>
  `},L={args:{"default-slot":`OR`}},R={args:{decorative:!0}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'vertical'
  },
  render: args => html\`
    <div style="display: flex; align-items: center; gap: 1rem; height: 3rem">
      <span>Left</span>
      \${template(args)}
      <span>Right</span>
    </div>
  \`
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'vertical',
    'default-slot': 'OR'
  },
  render: args => html\`
    <div style="display: flex; align-items: center; gap: 1rem; height: 8rem">
      <span>Left</span>
      \${template(args)}
      <span>Right</span>
    </div>
  \`
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    'default-slot': 'OR'
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    decorative: true
  }
}`,...R.parameters?.docs?.source}}},z=[`Default`,`Vertical`,`VerticalLabeled`,`Labeled`,`Decorative`]})))()}B();export{R as Decorative,P as Default,L as Labeled,F as Vertical,I as VerticalLabeled,z as __namedExportsOrder,N as default};