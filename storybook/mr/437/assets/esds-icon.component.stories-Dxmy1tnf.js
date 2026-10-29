import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{c as a,f as o,o as s,p as c,s as l}from"./iframe-DM4AiT0d.js";function u(){return _||=[IDBIndex,IDBObjectStore,IDBCursor,IDBDatabase,IDBTransaction]}function ee(){return oe||=[`advance`,`continue`,`continuePrimaryKey`].map(e=>IDBCursor.prototype[e])}function te(e){let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`success`,i),e.removeEventListener(`error`,a)},i=()=>{t(f(e.result)),r()},a=()=>{n(e.error),r()};e.addEventListener(`success`,i),e.addEventListener(`error`,a)});return b.set(t,e),t}function ne(e){if(v.has(e))return;let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`complete`,i),e.removeEventListener(`error`,a),e.removeEventListener(`abort`,a)},i=()=>{t(),r()},a=()=>{n(e.error||new DOMException(`AbortError`,`AbortError`)),r()};e.addEventListener(`complete`,i),e.addEventListener(`error`,a),e.addEventListener(`abort`,a)});v.set(e,t)}function d(e){x=e(x)}function re(e){return ee().includes(e)?function(...t){return e.apply(S(this),t),f(this.request)}:function(...t){return f(e.apply(S(this),t))}}function ie(e){return typeof e==`function`?re(e):(e instanceof IDBTransaction&&ne(e),g(e,u())?new Proxy(e,x):e)}function f(e){if(e instanceof IDBRequest)return te(e);if(y.has(e))return y.get(e);let t=ie(e);return Object.is(t,e)||(y.set(e,t),b.set(t,e)),t}function p(e,t,{blocked:n,upgrade:r,blocking:i,terminated:a}={}){let o=indexedDB.open(e,t),s=f(o);return r&&o.addEventListener(`upgradeneeded`,e=>{r(f(o.result),e.oldVersion,e.newVersion,f(o.transaction),e)}),n&&o.addEventListener(`blocked`,e=>n(e.oldVersion,e.newVersion,e)),s.then(e=>{a&&e.addEventListener(`close`,()=>a()),i&&e.addEventListener(`versionchange`,e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),s}function m(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t==`string`))return;if(T[t])return T[t];let n=t.replace(/FromIndex$/,``),r=t!==n,i=w.includes(n);return!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||C.includes(n))?void 0:T[t]=async function(e,...t){let a=this.transaction(e,i?`readwrite`:`readonly`),o=a.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&a.done]))[0]}}async function*ae(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;let n=new Proxy(t,A);for(k.set(n,t),b.set(n,S(t));t;)yield n,t=await(O.get(n)||t.continue()),O.delete(n)}function h(e,t){return t===Symbol.asyncIterator&&g(e,[IDBIndex,IDBObjectStore,IDBCursor])||t===`iterate`&&g(e,[IDBIndex,IDBObjectStore])}var g,_,oe,v,y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{g=(e,t)=>t.some(t=>e instanceof t),v=new WeakMap,y=new WeakMap,b=new WeakMap,x={get(e,t,n){if(e instanceof IDBTransaction){if(t===`done`)return v.get(e);if(t===`store`)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return f(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t===`done`||t===`store`)||t in e}},S=e=>b.get(e),C=[`get`,`getKey`,`getAll`,`getAllKeys`,`count`],w=[`put`,`add`,`delete`,`clear`],T={},d(e=>({...e,get:(t,n,r)=>m(t,n)||e.get(t,n,r),has:(t,n)=>!!m(t,n)||e.has(t,n)})),E=[`advance`,`continue`,`continuePrimaryKey`],D={},O=new WeakMap,k=new WeakMap,A={get(e,t){if(!E.includes(t))return e[t];let n=D[t];return n||=D[t]=function(...e){O.set(this,k.get(this)[t](...e))},n}},d(e=>({...e,get(t,n,r){return h(t,n)?ae:e.get(t,n,r)},has(t,n){return h(t,n)||e.has(t,n)}}))})))()}var M,N,P,F,I,L;function R(){return(R=e((()=>{j(),M=`esds-icon-cache`,N=`svg-cache`,P=1,F=5e3,I=500,L=class{#e;constructor(){typeof indexedDB<`u`&&(this.#e=p(M,P,{upgrade(e){e.objectStoreNames.contains(N)||e.createObjectStore(N,{keyPath:`key`})}}))}async get(e){if(this.#e!==void 0)try{let t=await(await this.#e).get(N,e);return t===void 0?void 0:{svg:t.svg,lastModified:t.lastModified}}catch{return}}async set(e,t,n){if(this.#e===void 0)return;let r={key:e,svg:t,lastModified:n};try{let e=(await this.#e).transaction(N,`readwrite`),t=e.store;if(await t.put(r),await t.count()>F){let e=await t.getAll();e.sort((e,t)=>e.lastModified-t.lastModified);let n=e.slice(0,I);for(let e of n)await t.delete(e.key)}await e.done}catch{}}async delete(e){if(this.#e!==void 0)try{await(await this.#e).delete(N,e)}catch{}}async clear(){if(this.#e!==void 0)try{await(await this.#e).clear(N)}catch{}}}})))()}function z(e){let t=new Set,n=new Map,r=new Map;if(e.uncategorized!==void 0)for(let n of e.uncategorized)t.add(n);if(e.categories!==void 0)for(let[r,i]of Object.entries(e.categories))for(let e of i){t.add(e);let i=n.get(e);i===void 0&&(i=new Set,n.set(e,i)),i.add(r)}if(e.aliases!==void 0)for(let[t,n]of Object.entries(e.aliases)){let e=r.get(n);e===void 0&&(e=new Set,r.set(n,e)),e.add(t)}return Array.from(t,e=>({name:e,categories:n.get(e)??new Set,aliases:r.get(e)??new Set}))}var B,V;function H(){return(H=e((()=>{R(),B=class{resources;rotate;timeout;bulkDebounce;constructor({resources:e=[`https://iconify.infomaniak.com`],rotate:t=750,timeout:n=5e3,bulkDebounce:r=10}={}){if(e.length===0)throw Error("Expect at least one `resources`.");if(t<=0)throw RangeError("`rotate` must be in range ]0, Infinity[.");if(n<=0)throw RangeError("`timeout` must be in range ]0, Infinity[.");this.resources=e,this.rotate=t,this.timeout=n,this.bulkDebounce=r}clearPersistentSVGCache(){return this.#e.clear()}#e=new L;#t=new Map;async#n(e){let t=this.#t.get(e);return t===void 0&&(t=this.getLastModified({prefixes:[e]}).then(t=>t.lastModified[e]??0,t=>{throw this.#t.delete(e),t}),this.#t.set(e,t)),t}async#r({path:e,searchParams:t,body:n,headers:r,signal:i,...a}){let o=e;if(t!==void 0){if(e.includes(`?`))throw Error("Cannot provide search params inside the path. Use `searchParams`.");let n=t.toString();n!==``&&(o=`${e}?${n}`)}let s=null,c=new Headers(r);n!==void 0&&(s=JSON.stringify(n),c.set(`content-type`,`application/json`));let l=i?AbortSignal.any([i,AbortSignal.timeout(this.timeout)]):AbortSignal.timeout(this.timeout);for(let e of this.resources){let t=new URL(o,e);try{let e=await fetch(t,{...a,body:s,headers:c,signal:AbortSignal.any([l,AbortSignal.timeout(this.rotate)])});if(e.ok)return e}catch(e){i?.aborted||console.warn(e)}}throw Error(`Unable to fetch api: ${o}.`)}async#i({expectNumberResponse:e,...t}){let n=await(await this.#r(t)).json();if(typeof n==`number`&&!e)throw Error(`fetch failed with error code: ${n}`);return n}getSVGUrl({prefix:e,name:t,color:n,width:r,height:i,flip:a,rotate:o,download:s,box:c,resourceIndex:l=0}){if(!(0<=l&&l<this.resources.length))throw RangeError(`\`resourceIndex\` must be in range [0, ${this.resources.length}[`);let u=new URL(`${this.resources[l]}/${encodeURIComponent(e)}/${encodeURIComponent(t)}.svg`);return n!==void 0&&u.searchParams.set(`color`,n),r!==void 0&&u.searchParams.set(`width`,String(r)),i!==void 0&&u.searchParams.set(`height`,String(i)),a!==void 0&&u.searchParams.set(`flip`,a),o!==void 0&&u.searchParams.set(`rotate`,String(o)),s&&u.searchParams.set(`download`,`1`),c&&u.searchParams.set(`box`,`1`),u}getIconsData({prefix:e,icons:t,pretty:n=!1,...r}){let i=new URLSearchParams;if(t.length>0)i.set(`icons`,t.join(`,`));else throw Error(`Must have at least one icon.`);return n&&i.set(`pretty`,`1`),this.#i({...r,path:`/${e}.json`,searchParams:i})}getLastModified({prefixes:e=[],pretty:t=!1,...n}){let r=new URLSearchParams;return e.length>0&&r.set(`prefixes`,e.join(`,`)),t&&r.set(`pretty`,`1`),this.#i({...n,path:`/last-modified`,searchParams:r})}listIconSets({prefixes:e=[],pretty:t=!1,...n}={}){let r=new URLSearchParams;return e.length>0&&r.set(`prefixes`,e.join(`,`)),t&&r.set(`pretty`,`1`),this.#i({...n,path:`/collections`,searchParams:r})}listIcons({prefix:e,info:t,chars:n,pretty:r=!1,...i}){let a=new URLSearchParams;return a.set(`prefix`,e),t&&a.set(`info`,`1`),n&&a.set(`chars`,`1`),r&&a.set(`pretty`,`1`),this.#i({...i,path:`/collection`,searchParams:a})}#a=new Map;listIconsCached({prefix:e,info:t=!1,chars:n=!1,signal:r}){return new Promise((i,a)=>{r?.throwIfAborted();let o=JSON.stringify([e,t,n]),s=this.#a.get(o);if(s===void 0){let r=new AbortController,i=r.signal;s={controller:r,promise:this.listIcons({prefix:e,info:t,chars:n,signal:i}).catch(e=>{throw i.aborted||this.#a.delete(o),e}),count:0},this.#a.set(o,s)}s.count++;let c=()=>{r?.removeEventListener(`abort`,l)},l=()=>{s.count--,s.count===0&&(s.controller.abort(),this.#a.delete(o)),a(r.reason)};r?.addEventListener(`abort`,l),s.promise.then(e=>{c(),i(e)},e=>{c(),a(e)})})}clearListIconsCache(){this.#a.clear()}searchIcons({query:e,limit:t,start:n,prefixes:r=[],category:i,pretty:a=!1,...o}){let s=new URLSearchParams;return s.set(`query`,e),t!==void 0&&s.set(`limit`,String(t)),n!==void 0&&s.set(`start`,String(n)),r.length>0&&s.set(`prefixes`,r.join(`,`)),i&&s.set(`category`,i),a&&s.set(`pretty`,`1`),this.#i({...o,path:`/search`,searchParams:s})}#o=new Map;getSVG({prefix:e,name:t,signal:n}){return new Promise((r,i)=>{if(n?.aborted){i(n.reason??new DOMException(`The operation was aborted.`,`AbortError`));return}let a=`${e}:${t}`,o=this.#o.get(a);if(o!==void 0){o.count++;let e=()=>{n?.removeEventListener(`abort`,t)},t=()=>{o.count--,o.count===0&&!o.resolved&&(o.controller.abort(),this.#o.delete(a)),i(n.reason??new DOMException(`The operation was aborted.`,`AbortError`))};n?.addEventListener(`abort`,t),o.promise.then(t=>{o.resolved=!0,e(),r(t)},t=>{e(),i(t)});return}let s=new AbortController;o={controller:s,promise:(async()=>{let n=await this.#e.get(a);if(n!==void 0){let r;try{r=await this.#n(e)}catch{r=0}return r>0&&r<=n.lastModified||this.#c({prefix:e,name:t,signal:s.signal}).then(async t=>{try{let n=await this.#n(e);n>0&&await this.#e.set(a,t,n)}catch{}if(t!==n.svg){let e=this.#o.get(a);e!==void 0&&(e.promise=Promise.resolve(t))}}).catch(e=>{e instanceof Error&&e.message.startsWith(`Missing icon`)&&this.#e.delete(a)}),n.svg}let r=await this.#c({prefix:e,name:t,signal:s.signal});try{let t=await this.#n(e);t>0&&await this.#e.set(a,r,t)}catch{}return r})().catch(e=>{throw s.signal.aborted||this.#o.delete(a),e}),count:0,resolved:!1},this.#o.set(a,o),o.count++;let c=()=>{n?.removeEventListener(`abort`,l)},l=()=>{o.count--,o.count===0&&!o.resolved&&(o.controller.abort(),this.#o.delete(a)),i(n.reason??new DOMException(`The operation was aborted.`,`AbortError`))};n?.addEventListener(`abort`,l),o.promise.then(e=>{o.resolved=!0,c(),r(e)},e=>{c(),i(e)})})}#s=new Map;#c({prefix:e,name:t,signal:n}){return new Promise((r,i)=>{n?.throwIfAborted();let a=this.#s.get(e);if(a===void 0){let t=new Set,n=new AbortController,{promise:r,resolve:i,reject:o}=Promise.withResolvers(),s=this.#n(e).catch(()=>0);a={names:t,controller:n,promise:r,timer:setTimeout(()=>{this.#s.delete(e),t.size>0?this.getIconsData({prefix:e,icons:Array.from(t),signal:n.signal}).then(async t=>{let n=t.width??V,r=await s;for(let[i,a]of Object.entries(t.icons)){let o=`${e}:${i}`,s=a.width??n,c=`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 ${s} ${a.height??t.height??s}">${a.body}</svg>`;if(r>0)try{await this.#e.set(o,c,r)}catch{}}i(t)}).catch(o):o(Error(`Nothing to load.`))},this.bulkDebounce)},this.#s.set(e,a)}a.names.add(t);let o=()=>{n?.removeEventListener(`abort`,s)},s=()=>{o(),a.names.delete(t),a.names.size===0&&(clearTimeout(a.timer),a.controller.abort(),this.#s.delete(e)),i(n.reason)};n?.addEventListener(`abort`,s),a.promise.then(e=>{if(!Reflect.has(e.icons,t))throw Error(`Missing icon: ${t}.`);let n=e.icons[t],r=n.width??e.width??V;return`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 ${r} ${n.height??e.height??r}">${n.body}</svg>`}).then(e=>{o(),r(e)},e=>{o(),i(e)})})}clearSVGsCache(){this.#o.clear(),this.#s.clear()}async search({prefix:e,query:t=``,signal:n}){let r=z(await this.listIconsCached({prefix:e,signal:n}));if(t=t.trim(),t===``)return r;let i=t.split(/\s+/g);return r.filter(({name:e,categories:t,aliases:n})=>{let r=e.toLowerCase();return i.every(e=>{let i=e.toLowerCase();if(/^[a-zA-Z0-9#!]/.test(e)){let a=/^[#!]/.test(e)?i.slice(1):i;return r.includes(a)||Array.from(t).filter(e=>e.startsWith(`#`)).map(e=>e.slice(1)).some(e=>e.toLowerCase().includes(a))||Array.from(n).some(e=>e.toLowerCase().includes(a))}return Array.from(t).some(e=>e.toLowerCase().startsWith(i))})})}},V=16})))()}var U;function W(){return(W=e((()=>{U=`## Setup

Import and register the icon component in your application's entry file (e.g., \`main.ts\` or \`index.ts\`):

\`\`\`ts
import { EsdsIconComponent } from '@infomaniak-design-system/components';

EsdsIconComponent.define();
\`\`\`

> **Important:** \`define()\` must be called before any component renders \`<esds-icon>\`.

## Usage

The icon inherits its size based on the **local** \`font-size\`.
It is by default \`inline-block\` making it suitable to integrate into \`flex\` container.

\`\`\`html
<esds-icon
  name="esds:headset"
  style="font-size: var(--esds-icon-size-md); /* or let it be inherited from a parent element */"
></esds-icon>
\`\`\`

### Tailwind

You may set the icon size using the tailwind \`text-icon-{size}\` class:

\`\`\`html
<esds-icon
  name="esds:headset"
  class="text-icon-md"
></esds-icon>
\`\`\`

## Configuration (Optional)

If you need custom icon resources (e.g., a specific icon server), set the \`InjectionContext\`:

\`\`\`ts
import { ICONIFY_API, InjectionContext, IconifyApi } from '@infomaniak-design-system/components';

InjectionContext.root = new InjectionContext([
  ICONIFY_API.define(
    new IconifyApi({
      resources: ['https://iconify.preprod.dev.infomaniak.ch'],
    }),
  ),
]);
\`\`\`

> \`InjectionContext\` is only required when the default icon resources are insufficient.

## Demo
`})))()}var G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{a(),o(),r(),n(),H(),W(),s.define(),{args:G,argTypes:K,template:q}=i(`esds-icon`),J={title:`Components/Icon`,component:`esds-icon`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:U}}},args:G,argTypes:K,render:e=>q(e)},Y={args:{name:`esds:headset`}},X={parameters:{docs:{description:{story:"Add the `inline` attribute so the icon aligns with the surrounding text flow, e.g. inside a link."}}},args:{name:`esds:square-arrow-out-up-right`},render:e=>t`
    <a href="#">
      Follow this link
      <esds-icon
        name="${e.name}"
        inline
      ></esds-icon>
    </a>
  `},Z={args:{name:`esds:bug`},decorators:[e=>{let n=new c([l.define(new B({resources:[`https://iconify.preprod.dev.infomaniak.ch`]}))]);return t`
        <div data-inject="${n.id}">
          ${e()}
          <!-- NOTE: data-inject can be set directly on the component itself -->
        </div>
      `}]},Q=[`Default`,`Inline`,`Preprod`],Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'esds:headset'
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Add the \`inline\` attribute so the icon aligns with the surrounding text flow, e.g. inside a link.'
      }
    }
  },
  args: {
    name: 'esds:square-arrow-out-up-right'
  },
  render: args => html\`
    <a href="#">
      Follow this link
      <esds-icon
        name="\${args.name}"
        inline
      ></esds-icon>
    </a>
  \`
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'esds:bug'
  },
  decorators: [(Story: PartialStoryFn) => {
    const ctx = new InjectionContext([ICONIFY_API.define(new IconifyApi({
      resources: ['https://iconify.preprod.dev.infomaniak.ch']
    }))]);
    return html\`
        <div data-inject="\${ctx.id}">
          \${Story()}
          <!-- NOTE: data-inject can be set directly on the component itself -->
        </div>
      \`;
  }]
}`,...Z.parameters?.docs?.source}}}})))()}$();export{Y as Default,X as Inline,Z as Preprod,Q as __namedExportsOrder,J as default};