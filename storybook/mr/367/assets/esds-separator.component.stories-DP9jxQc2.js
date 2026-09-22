import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t,h as n,n as r,t as i,u as a,x as o}from"./dist-D5vWbpez.js";import{d as s,f as c,l}from"./iframe-cMmLCfKS.js";var u;function d(){return(d=e((()=>{u=`:host{box-sizing:content-box;width:100%;height:var(--esds-separator-width);padding-block:var(--esds-separator-padding);background-color:var(--esds-separator-color);background-clip:content-box;display:block}:host([orientation=vertical]){width:var(--esds-separator-width);height:auto;padding-block:0;padding-inline:var(--esds-separator-padding);align-self:stretch;display:inline-block}`})))()}function f(e,t,n,r,i,a){var o,s,c,l,u,d,f,m=Symbol.metadata||Symbol.for(`Symbol.metadata`),_=Object.defineProperty,v=Object.create,y=[v(null),v(null)],b=t.length;function x(t,n,r){return function(i,a){n&&(a=i,i=e);for(var o=0;o<t.length;o++)a=t[o].apply(i,r?[a]:[]);return r?a:i}}function S(e,t,n,r){if(typeof e!=`function`&&(r||e!==void 0))throw TypeError(t+` must `+(n||`be`)+` a function`+(r?``:` or undefined`));return e}function C(e,t,n,r,i,a,c,l,u,d,f){function p(e){if(!f(e))throw TypeError(`Attempted to access private element on non-instance`)}var m=[].concat(t[0]),g=t[3],v=!c,b=i===1,C=i===3,w=i===4,T=i===2;function E(t,n,r){return function(i,a){return n&&(a=i,i=e),r&&r(i),D[t].call(i,a)}}if(!v){var D={},O=[],k=C?`get`:w||b?`set`:`value`;if(u?(d||b?D={get:h(function(){return g(this)},r,`get`),set:function(e){t[4](this,e)}}:D[k]=g,d||h(D[k],r,T?``:k)):d||(D=Object.getOwnPropertyDescriptor(e,r)),!d&&!u){if((s=y[+l][r])&&(s^i)!==7)throw Error(`Decorating two elements with the same name (`+D[k].name+`) is not supported yet`);y[+l][r]=i<3?1:i}}for(var A=e,j=m.length-1;j>=0;j-=n?2:1){var M=S(m[j],`A decorator`,`be`,!0),N=n?m[j-1]:void 0,P={},F={kind:[`field`,`accessor`,`method`,`getter`,`setter`,`class`][i],name:r,metadata:o,addInitializer:function(e,t){if(e.v)throw TypeError(`attempted to call addInitializer after decoration was finished`);S(t,`An initializer`,`be`,!0),a.push(t)}.bind(null,P)};if(v)s=M.call(N,A,F),P.v=1,S(s,`class decorators`,`return`)&&(A=s);else if(F.static=l,F.private=u,s=F.access={has:u?f.bind():function(e){return r in e}},w||(s.get=u?T?function(e){return p(e),D.value}:E(`get`,0,p):function(e){return e[r]}),T||C||(s.set=u?E(`set`,0,p):function(e,t){e[r]=t}),A=M.call(N,b?{get:D.get,set:D.set}:D[k],F),P.v=1,b){if(typeof A==`object`&&A)(s=S(A.get,`accessor.get`))&&(D.get=s),(s=S(A.set,`accessor.set`))&&(D.set=s),(s=S(A.init,`accessor.init`))&&O.unshift(s);else if(A!==void 0)throw TypeError(`accessor decorators must return an object with get, set, or init properties or undefined`)}else S(A,(d?`field`:`method`)+` decorators`,`return`)&&(d?O.unshift(A):D[k]=A)}return i<2&&c.push(x(O,l,1),x(a,l,0)),d||v||(u?b?c.splice(-1,0,E(`get`,l),E(`set`,l)):c.push(T?D[k]:S.call.bind(D[k])):_(e,r,D)),A}function w(e){return _(e,m,{configurable:!0,enumerable:!0,value:o})}return a!==void 0&&(o=a[m]),o=v(o??null),u=[],d=function(e){e&&u.push(x(e))},f=function(t,r){for(var a=0;a<n.length;a++){var o=n[a],s=o[1],d=7&s;if((8&s)==t&&!d==r){var f=o[2],m=!!o[3],h=16&s;C(t?e:e.prototype,o,h,m?`#`+f:p(f),d,d<2?[]:t?l||=[]:c||=[],u,!!t,m,r,t&&m?function(t){return g(t)===e}:i)}}},f(8,0),f(0,0),f(8,1),f(0,1),d(c),d(l),s=u,b||w(e),{e:s,get c(){var n=[];return b&&[w(e=C(e,[t],r,e.name,5,n)),x(n,1)]}}}function p(e){var t=m(e,`string`);return typeof t==`symbol`?t:t+``}function m(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function h(e,t,n){typeof t==`symbol`&&(t=(t=t.description)?`[`+t+`]`:``);try{Object.defineProperty(e,"name",{configurable:!0,value:n?n+` `+t:t})}catch{}return e}function g(e){if(Object(e)!==e)throw TypeError(`right-hand side of 'in' should be an object, got `+(e===null?`null`:typeof e));return e}var _,v,y,b,x;function S(){return(S=e((()=>{d(),a(),l(),x=class extends t{static{[_,v,y,b]=f(this,[],[[s({type:String,reflect:!0}),1,`orientation`],[s({type:Boolean,reflect:!0}),1,`decorative`]],0,void 0,t).e}constructor(...e){super(...e),b(this)}static define(){c(`esds-separator`,this)}static styles=o(u);#e=_(this,`horizontal`);get orientation(){return this.#e}set orientation(e){this.#e=e}#t=(v(this),y(this,!1));get decorative(){return this.#t}set decorative(e){this.#t=e}connectedCallback(){super.connectedCallback(),this.hasAttribute(`role`)||this.setAttribute(`role`,`separator`)}updated(){this.toggleAttribute(`aria-hidden`,this.decorative),this.decorative?this.removeAttribute(`aria-orientation`):this.setAttribute(`aria-orientation`,this.orientation===`vertical`?`vertical`:`horizontal`)}}})))()}var C;function w(){return(w=e((()=>{C=`## Setup

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
<esds-separator orientation="vertical"></esds-separator>
\`\`\`

> **Note:** outside a flex/grid container, set an explicit height on the element (e.g. \`style="height: 3rem"\`), otherwise it collapses.

### Decorative

Removes the separator from the accessibility tree:

\`\`\`html
<esds-separator decorative></esds-separator>
\`\`\`

## Description

The separator divides content horizontally or vertically. Unlike the native \`<hr>\` element, it supports vertical orientation.

### Semantics

- The component sets \`role="separator"\` unless a \`role\` is already present, and reflects the orientation with \`aria-orientation\` (any value other than \`vertical\` is treated as \`horizontal\`).
- With the \`decorative\` attribute, \`aria-hidden="true"\` removes the separator from the accessibility tree, independently of the role.
- The component does not support slotted content: any children are ignored. For a labeled divider, compose the separator with text in your layout instead.
- For thematic breaks in prose content, prefer the native \`<hr>\` element; this component is intended for interface layouts (menus, toolbars, forms, card sections...).

Its appearance is driven by the design tokens; changes to the look belong to the token layer, not to component consumers.

## Demo
`})))()}var T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{S(),r(),a(),w(),x.define(),{args:T,argTypes:E,template:D}=i(`esds-separator`),O={title:`Components/Separator`,component:`esds-separator`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:C}}},args:T,argTypes:E,render:e=>n`
    <div
      style="display: flex; align-items: center; min-height: 3rem; flex-direction: ${e.orientation===`vertical`?`row`:`column`}"
    >
      <span>before</span>
      ${D(e)}
      <span>after</span>
    </div>
  `},k={},A={args:{orientation:`vertical`}},j={args:{decorative:!0}},M=[`Default`,`Vertical`,`Decorative`],k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'vertical'
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    decorative: true
  }
}`,...j.parameters?.docs?.source}}}})))()}N();export{j as Decorative,k as Default,A as Vertical,M as __namedExportsOrder,O as default};