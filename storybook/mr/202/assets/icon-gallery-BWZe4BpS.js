import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{t as n}from"./react-CnPKFcMr.js";import{F as r,P as i,h as a,m as o,y as s}from"./iframe-C1xn2AmK.js";import{t as c}from"./mdx-react-shim-CIYcsFcg.js";function l(){return S||=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]}function u(){return ee||=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey]}function d(e){let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`success`,i),e.removeEventListener(`error`,a)},i=()=>{t(g(e.result)),r()},a=()=>{n(e.error),r()};e.addEventListener(`success`,i),e.addEventListener(`error`,a)});return T.set(t,e),t}function f(e){if(C.has(e))return;let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`complete`,i),e.removeEventListener(`error`,a),e.removeEventListener(`abort`,a)},i=()=>{t(),r()},a=()=>{n(e.error||new DOMException(`AbortError`,`AbortError`)),r()};e.addEventListener(`complete`,i),e.addEventListener(`error`,a),e.addEventListener(`abort`,a)});C.set(e,t)}function p(e){E=e(E)}function m(e){return u().includes(e)?function(...t){return e.apply(D(this),t),g(this.request)}:function(...t){return g(e.apply(D(this),t))}}function h(e){return typeof e==`function`?m(e):(e instanceof IDBTransaction&&f(e),x(e,l())?new Proxy(e,E):e)}function g(e){if(e instanceof IDBRequest)return d(e);if(w.has(e))return w.get(e);let t=h(e);return t!==e&&(w.set(e,t),T.set(t,e)),t}function _(e,t,{blocked:n,upgrade:r,blocking:i,terminated:a}={}){let o=indexedDB.open(e,t),s=g(o);return r&&o.addEventListener(`upgradeneeded`,e=>{r(g(o.result),e.oldVersion,e.newVersion,g(o.transaction),e)}),n&&o.addEventListener(`blocked`,e=>n(e.oldVersion,e.newVersion,e)),s.then(e=>{a&&e.addEventListener(`close`,()=>a()),i&&e.addEventListener(`versionchange`,e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),s}function v(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t==`string`))return;if(O.get(t))return O.get(t);let n=t.replace(/FromIndex$/,``),r=t!==n,i=ne.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||te.includes(n)))return;let a=async function(e,...t){let a=this.transaction(e,i?`readwrite`:`readonly`),o=a.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&a.done]))[0]};return O.set(t,a),a}async function*y(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;let n=new Proxy(t,oe);for(ae.set(n,t),T.set(n,D(t));t;)yield n,t=await(k.get(n)||t.continue()),k.delete(n)}function b(e,t){return t===Symbol.asyncIterator&&x(e,[IDBIndex,IDBObjectStore,IDBCursor])||t===`iterate`&&x(e,[IDBIndex,IDBObjectStore])}var x,S,ee,C,w,T,E,D,te,ne,O,re,ie,k,ae,oe,se=e((()=>{x=(e,t)=>t.some(t=>e instanceof t),C=new WeakMap,w=new WeakMap,T=new WeakMap,E={get(e,t,n){if(e instanceof IDBTransaction){if(t===`done`)return C.get(e);if(t===`store`)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return g(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t===`done`||t===`store`)?!0:t in e}},D=e=>T.get(e),te=[`get`,`getKey`,`getAll`,`getAllKeys`,`count`],ne=[`put`,`add`,`delete`,`clear`],O=new Map,p(e=>({...e,get:(t,n,r)=>v(t,n)||e.get(t,n,r),has:(t,n)=>!!v(t,n)||e.has(t,n)})),re=[`continue`,`continuePrimaryKey`,`advance`],ie={},k=new WeakMap,ae=new WeakMap,oe={get(e,t){if(!re.includes(t))return e[t];let n=ie[t];return n||=ie[t]=function(...e){k.set(this,ae.get(this)[t](...e))},n}},p(e=>({...e,get(t,n,r){return b(t,n)?y:e.get(t,n,r)},has(t,n){return b(t,n)||e.has(t,n)}}))})),ce,A,le,ue,de,fe,pe=e((()=>{se(),ce=`esds-icon-cache`,A=`svg-cache`,le=1,ue=5e3,de=500,fe=class{#e;constructor(){typeof indexedDB<`u`&&(this.#e=_(ce,le,{upgrade(e){e.objectStoreNames.contains(A)||e.createObjectStore(A,{keyPath:`key`})}}))}async get(e){if(this.#e!==void 0)try{let t=await(await this.#e).get(A,e);return t===void 0?void 0:{svg:t.svg,lastModified:t.lastModified}}catch{return}}async set(e,t,n){if(this.#e===void 0)return;let r={key:e,svg:t,lastModified:n};try{let e=(await this.#e).transaction(A,`readwrite`),t=e.store;if(await t.put(r),await t.count()>ue){let e=await t.getAll();e.sort((e,t)=>e.lastModified-t.lastModified);let n=e.slice(0,de);for(let e of n)await t.delete(e.key)}await e.done}catch{}}async delete(e){if(this.#e!==void 0)try{await(await this.#e).delete(A,e)}catch{}}async clear(){if(this.#e!==void 0)try{await(await this.#e).clear(A)}catch{}}}}));function me(e){let t=new Set,n=new Map;if(e.uncategorized!==void 0)for(let n of e.uncategorized)t.add(n);if(e.categories!==void 0)for(let[r,i]of Object.entries(e.categories))for(let e of i){t.add(e);let i=n.get(e);i===void 0&&(i=new Set,n.set(e,i)),i.add(r)}return Array.from(t,e=>({name:e,categories:n.get(e)??new Set}))}var he=e((()=>{})),ge,_e,ve=e((()=>{pe(),he(),ge=class{resources;rotate;timeout;bulkDebounce;constructor({resources:e=[`https://iconify.infomaniak.com`],rotate:t=750,timeout:n=5e3,bulkDebounce:r=10}={}){if(e.length===0)throw Error("Expect at least one `resources`.");if(t<=0)throw RangeError("`rotate` must be in range ]0, Infinity[.");if(n<=0)throw RangeError("`timeout` must be in range ]0, Infinity[.");this.resources=e,this.rotate=t,this.timeout=n,this.bulkDebounce=r}clearPersistentSVGCache(){return this.#e.clear()}#e=new fe;#t=new Map;async#n(e){let t=this.#t.get(e);return t===void 0&&(t=this.getLastModified({prefixes:[e]}).then(t=>t.lastModified[e]??0),this.#t.set(e,t)),t}async#r({path:e,searchParams:t,body:n,headers:r,signal:i,...a}){let o=e;if(t!==void 0){if(e.includes(`?`))throw Error("Cannot provide search params inside the path. Use `searchParams`.");let n=t.toString();n!==``&&(o=`${e}?${n}`)}let s=null,c=new Headers(r);n!==void 0&&(s=JSON.stringify(n),c.set(`content-type`,`application/json`));let l=i?AbortSignal.any([i,AbortSignal.timeout(this.timeout)]):AbortSignal.timeout(this.timeout);for(let e of this.resources){let t=new URL(o,e);try{let e=await fetch(t,{...a,body:s,headers:c,signal:AbortSignal.any([l,AbortSignal.timeout(this.rotate)])});if(e.ok)return e}catch(e){i?.aborted||console.warn(e)}}throw Error(`Unable to fetch api: ${o}.`)}async#i({expectNumberResponse:e,...t}){let n=await(await this.#r(t)).json();if(typeof n==`number`&&!e)throw Error(`fetch failed with error code: ${n}`);return n}getSVGUrl({prefix:e,name:t,color:n,width:r,height:i,flip:a,rotate:o,download:s,box:c,resourceIndex:l=0}){if(!(0<=l&&l<this.resources.length))throw RangeError(`\`resourceIndex\` must be in range [0, ${this.resources.length}[`);let u=new URL(`${this.resources[l]}/${encodeURIComponent(e)}/${encodeURIComponent(t)}.svg`);return n!==void 0&&u.searchParams.set(`color`,n),r!==void 0&&u.searchParams.set(`width`,String(r)),i!==void 0&&u.searchParams.set(`height`,String(i)),a!==void 0&&u.searchParams.set(`flip`,a),o!==void 0&&u.searchParams.set(`rotate`,String(o)),s&&u.searchParams.set(`download`,`1`),c&&u.searchParams.set(`box`,`1`),u}getIconsData({prefix:e,icons:t,pretty:n=!1,...r}){let i=new URLSearchParams;if(t.length>0)i.set(`icons`,t.join(`,`));else throw Error(`Must have at least one icon.`);return n&&i.set(`pretty`,`1`),this.#i({...r,path:`/${e}.json`,searchParams:i})}getLastModified({prefixes:e=[],pretty:t=!1,...n}){let r=new URLSearchParams;return e.length>0&&r.set(`prefixes`,e.join(`,`)),t&&r.set(`pretty`,`1`),this.#i({...n,path:`/last-modified`,searchParams:r})}listIconSets({prefixes:e=[],pretty:t=!1,...n}={}){let r=new URLSearchParams;return e.length>0&&r.set(`prefixes`,e.join(`,`)),t&&r.set(`pretty`,`1`),this.#i({...n,path:`/collections`,searchParams:r})}listIcons({prefix:e,info:t,chars:n,pretty:r=!1,...i}){let a=new URLSearchParams;return a.set(`prefix`,e),t&&a.set(`info`,`1`),n&&a.set(`chars`,`1`),r&&a.set(`pretty`,`1`),this.#i({...i,path:`/collection`,searchParams:a})}#a=new Map;listIconsCached({prefix:e,info:t=!1,chars:n=!1,signal:r}){return new Promise((i,a)=>{r?.throwIfAborted();let o=JSON.stringify([e,t,n]),s=this.#a.get(o);if(s===void 0){let r=new AbortController,i=r.signal;s={controller:r,promise:this.listIcons({prefix:e,info:t,chars:n,signal:i}).catch(e=>{throw i.aborted||this.#a.delete(o),e}),count:0},this.#a.set(o,s)}s.count++;let c=()=>{r?.removeEventListener(`abort`,l)},l=()=>{s.count--,s.count===0&&(s.controller.abort(),this.#a.delete(o)),a(r.reason)};r?.addEventListener(`abort`,l),s.promise.then(e=>{c(),i(e)},e=>{c(),a(e)})})}clearListIconsCache(){this.#a.clear()}searchIcons({query:e,limit:t,start:n,prefixes:r=[],category:i,pretty:a=!1,...o}){let s=new URLSearchParams;return s.set(`query`,e),t!==void 0&&s.set(`limit`,String(t)),n!==void 0&&s.set(`start`,String(n)),r.length>0&&s.set(`prefixes`,r.join(`,`)),i&&s.set(`category`,i),a&&s.set(`pretty`,`1`),this.#i({...o,path:`/search`,searchParams:s})}#o=new Map;getSVG({prefix:e,name:t,signal:n}){return new Promise((r,i)=>{if(n?.aborted){i(n.reason??new DOMException(`The operation was aborted.`,`AbortError`));return}let a=`${e}:${t}`,o=this.#o.get(a);if(o!==void 0){o.count++;let e=()=>{n?.removeEventListener(`abort`,t)},t=()=>{o.count--,o.count===0&&!o.resolved&&(o.controller.abort(),this.#o.delete(a)),i(n.reason??new DOMException(`The operation was aborted.`,`AbortError`))};n?.addEventListener(`abort`,t),o.promise.then(t=>{o.resolved=!0,e(),r(t)},t=>{e(),i(t)});return}let s=new AbortController;o={controller:s,promise:(async()=>{let n=await this.#e.get(a);if(n!==void 0){let r;try{r=await this.#n(e)}catch{r=0}return r>0&&r<=n.lastModified||this.#c({prefix:e,name:t,signal:s.signal}).then(async t=>{try{let n=await this.#n(e);n>0&&await this.#e.set(a,t,n)}catch{}if(t!==n.svg){let e=this.#o.get(a);e!==void 0&&(e.promise=Promise.resolve(t))}}).catch(e=>{e instanceof Error&&e.message.startsWith(`Missing icon`)&&this.#e.delete(a)}),n.svg}let r=await this.#c({prefix:e,name:t,signal:s.signal});try{let t=await this.#n(e);t>0&&await this.#e.set(a,r,t)}catch{}return r})().catch(e=>{throw s.signal.aborted||this.#o.delete(a),e}),count:0,resolved:!1},this.#o.set(a,o),o.count++;let c=()=>{n?.removeEventListener(`abort`,l)},l=()=>{o.count--,o.count===0&&!o.resolved&&(o.controller.abort(),this.#o.delete(a)),i(n.reason??new DOMException(`The operation was aborted.`,`AbortError`))};n?.addEventListener(`abort`,l),o.promise.then(e=>{o.resolved=!0,c(),r(e)},e=>{c(),i(e)})})}#s=new Map;#c({prefix:e,name:t,signal:n}){return new Promise((r,i)=>{n?.throwIfAborted();let a=this.#s.get(e);if(a===void 0){let t=new Set,n=new AbortController,{promise:r,resolve:i,reject:o}=Promise.withResolvers(),s=this.#n(e).catch(()=>0);a={names:t,controller:n,promise:r,timer:setTimeout(()=>{this.#s.delete(e),t.size>0?this.getIconsData({prefix:e,icons:Array.from(t),signal:n.signal}).then(async t=>{let n=t.width??_e,r=await s;for(let[i,a]of Object.entries(t.icons)){let o=`${e}:${i}`,s=a.width??n,c=`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 ${s} ${a.height??t.height??s}">${a.body}</svg>`;if(r>0)try{await this.#e.set(o,c,r)}catch{}}i(t)}).catch(o):o(Error(`Nothing to load.`))},this.bulkDebounce)},this.#s.set(e,a)}a.names.add(t);let o=()=>{n?.removeEventListener(`abort`,s)},s=()=>{o(),a.names.delete(t),a.names.size===0&&(clearTimeout(a.timer),a.controller.abort(),this.#s.delete(e)),i(n.reason)};n?.addEventListener(`abort`,s),a.promise.then(e=>{if(!Reflect.has(e.icons,t))throw Error(`Missing icon: ${t}.`);let n=e.icons[t],r=n.width??e.width??_e;return`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 ${r} ${n.height??e.height??r}">${n.body}</svg>`}).then(e=>{o(),r(e)},e=>{o(),i(e)})})}clearSVGsCache(){this.#o.clear(),this.#s.clear()}async search({prefix:e,query:t=``,signal:n}){let r=me(await this.listIconsCached({prefix:e,signal:n}));if(t=t.trim(),t===``)return r;let i=t.split(/\s+/g);return r.filter(({name:e,categories:t})=>{let n=e.toLowerCase();return i.every(e=>{let r=e.toLowerCase();return/^[a-zA-Z0-9#]/.test(e)?n.includes(r)||Array.from(t).some(e=>e.startsWith(`#`)&&e.toLowerCase().includes(r)):Array.from(t).some(e=>e.toLowerCase().startsWith(r))})})}},_e=16})),ye=e((()=>{he(),ve()})),j,be=e((()=>{ye(),j=new ge({resources:[`https://iconify.preprod.dev.infomaniak.ch/`]})})),M,xe=e((()=>{M={ABORTED:`ABORTED`,API_ERROR:`API_ERROR`,NETWORK_ERROR:`NETWORK_ERROR`,TIMEOUT:`TIMEOUT`,UNKNOWN_ERROR:`UNKNOWN_ERROR`,BOUNDARY_ERROR:`BOUNDARY_ERROR`}}));function Se(e){return{name:e.name,categories:e.categories}}function Ce(e){return e instanceof Error?{message:e.message,code:e.name===`AbortError`?M.ABORTED:M.API_ERROR}:{message:`An unknown error occurred`,code:M.UNKNOWN_ERROR}}function we(e=j){let t=(0,N.useRef)(null),n=(0,N.useRef)(null),[r,i]=(0,N.useState)([]),[a,o]=(0,N.useState)(``),[s,c]=(0,N.useState)([]),[l,u]=(0,N.useState)(0),[d,f]=(0,N.useState)(``),[p,m]=(0,N.useState)(``),[h,g]=(0,N.useState)(!1),[_,v]=(0,N.useState)(!1),[y,b]=(0,N.useState)(null),x=h||_,S=(0,N.useCallback)(()=>{t.current!==null&&(t.current.abort(),t.current=null)},[]),ee=(0,N.useCallback)(e=>{f(e),n.current!==null&&clearTimeout(n.current),n.current=setTimeout(()=>{m(e.trim().toLowerCase())},Te)},[]),C=(0,N.useCallback)(async t=>{try{g(!0),b(null);let n=await e.listIconSets({signal:t}),r=Object.keys(n).sort();i(r),r.length>0&&o(r[0])}catch(e){if(t.aborted)return;b(Ce(e))}finally{g(!1)}},[e]),w=(0,N.useCallback)(async(t,n)=>{try{u((await e.search({prefix:t,query:``,signal:n})).length)}catch{}},[e]),T=(0,N.useCallback)(async(n,r,i)=>{try{v(!0),b(null),c((await e.search({prefix:n,query:r,signal:i})).map(Se))}catch(e){if(i.aborted)return;b(Ce(e))}finally{v(!1),t.current?.signal===i&&(t.current=null)}},[e]);(0,N.useEffect)(()=>{let e=new AbortController;return C(e.signal),()=>{e.abort()}},[C]),(0,N.useEffect)(()=>{if(a===``)return;S();let e=new AbortController;return t.current=e,w(a,e.signal),T(a,p,e.signal),()=>{e.abort()}},[a,p,w,T,S]);let E=(0,N.useCallback)(e=>{o(e),f(``),m(``)},[]),D=(0,N.useCallback)(()=>{f(``),m(``),n.current!==null&&(clearTimeout(n.current),n.current=null)},[]),te=(0,N.useCallback)(()=>{if(r.length===0){S();let e=new AbortController;t.current=e,C(e.signal)}else if(a!==``){S();let e=new AbortController;t.current=e,w(a,e.signal),T(a,p,e.signal)}},[r.length,a,p,C,w,T,S]);return(0,N.useEffect)(()=>()=>{S(),n.current!==null&&clearTimeout(n.current)},[S]),{collections:r,icons:s,totalCount:l,filteredCount:s.length,selectedCollection:a,searchQuery:d,isLoading:x,isLoadingCollections:h,isLoadingIcons:_,error:y,setCollection:E,setSearchQuery:ee,retry:te,clearSearch:D}}var N,Te,Ee=e((()=>{N=t(n(),1),be(),xe(),Te=300}));function De(){try{return typeof window>`u`||!window.parent?null:new URL(window.parent.location.href)}catch{return null}}function Oe(e){let t=De();return t?t.searchParams.get(e):null}function ke(e){let t=De();if(!t)return;Object.entries(e).forEach(([e,n])=>{n===null||n===``?t.searchParams.delete(e):t.searchParams.set(e,n)});let n=t.search,r=t.toString().split(`?`)[0]+n.replace(/%2F/g,`/`);window.parent.history.replaceState(null,``,r)}function Ae(){let e=we(j),{collections:t,selectedCollection:n,searchQuery:r,setCollection:i,setSearchQuery:a}=e,[o,s]=(0,P.useState)(!1),c=(0,P.useRef)(null),l=(0,P.useRef)({search:``,collection:``});(0,P.useEffect)(()=>{if(o||t.length===0)return;let e=Oe(Me),n=Oe(je);e&&t.includes(e)&&i(e),n&&a(n),s(!0)},[t,o,i,a]);let u=(0,P.useCallback)((e,t)=>{l.current.search===e&&l.current.collection===t||(l.current={search:e,collection:t},ke({[je]:e||null,[Me]:t||null}))},[]);return(0,P.useEffect)(()=>{if(o)return c.current&&clearTimeout(c.current),c.current=setTimeout(()=>{u(r,n)},Ne),()=>{c.current&&clearTimeout(c.current)}},[r,n,o,u]),(0,P.useEffect)(()=>()=>{c.current&&clearTimeout(c.current)},[]),e}var P,je,Me,Ne,Pe=e((()=>{P=t(n(),1),be(),Ee(),je=`search`,Me=`collection`,Ne=100})),Fe,F,Ie,Le=e((()=>{Fe=t(n(),1),F=i(),Ie=({collections:e,selected:t,onChange:n,disabled:r=!1})=>{let i=e=>{n(e.target.value)},a=Fe.useMemo(()=>[...e].sort((e,t)=>e.localeCompare(t)),[e]);return(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(`style`,{children:`
        .icon-collection-filter {
          width: 100%;
          padding: 10px 36px 10px 12px;
          font-size: 14px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          outline: none;
          background-color: #ffffff;
          color: #111827;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }
        .icon-collection-filter:focus {
          border-color: #3b82f6;
        }
        .icon-collection-filter:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
          background-image: none;
        }
      `}),(0,F.jsx)(`select`,{id:`collection-select`,"aria-label":`Icon collection`,value:t,onChange:i,disabled:r,className:`icon-collection-filter`,children:a.map(e=>(0,F.jsx)(`option`,{value:e,children:e},e))})]})}})),I,Re,ze=e((()=>{n(),I=i(),Re=({searchQuery:e=``,onClearSearch:t})=>{let n=e.length>0;return(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)(`style`,{children:`
        .icon-gallery-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
        }
        .icon-gallery-empty__icon {
          margin-bottom: 1rem;
          color: #9ca3af;
        }
        .icon-gallery-empty__title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .icon-gallery-empty__text {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 0;
        }
        .icon-gallery-empty__text--with-query {
          margin-bottom: 1.5rem;
        }
        .icon-gallery-empty__button {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          background-color: #3b82f6;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .icon-gallery-empty__button:hover {
          background-color: #2563eb;
        }
      `}),(0,I.jsxs)(`div`,{className:`icon-gallery-empty`,children:[(0,I.jsxs)(`svg`,{width:`64`,height:`64`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,className:`icon-gallery-empty__icon`,children:[(0,I.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,I.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,I.jsx)(`h3`,{className:`icon-gallery-empty__title`,children:n?`No icons found for "${e}"`:`No icons in this collection`}),(0,I.jsx)(`p`,{className:`icon-gallery-empty__text${n?` icon-gallery-empty__text--with-query`:``}`,children:n?`Try adjusting your search terms or browse all icons`:`This collection appears to be empty. Try selecting a different collection.`}),n&&t&&(0,I.jsx)(`button`,{onClick:t,className:`icon-gallery-empty__button`,children:`Clear search`})]})]})}})),L,Be,Ve=e((()=>{n(),L=i(),Be=({error:e,onRetry:t})=>(0,L.jsxs)(L.Fragment,{children:[(0,L.jsx)(`style`,{children:`
        .icon-gallery-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
        }
        .icon-gallery-error__icon {
          margin-bottom: 1rem;
          color: #ef4444;
        }
        .icon-gallery-error__title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .icon-gallery-error__message {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 1.5rem;
          max-width: 400px;
        }
        .icon-gallery-error__button {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          background-color: #3b82f6;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .icon-gallery-error__button:hover {
          background-color: #2563eb;
        }
      `}),(0,L.jsxs)(`div`,{className:`icon-gallery-error`,children:[(0,L.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error__icon`,children:[(0,L.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,L.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,L.jsx)(`h3`,{className:`icon-gallery-error__title`,children:`Something went wrong`}),(0,L.jsx)(`p`,{className:`icon-gallery-error__message`,children:e.message}),(0,L.jsx)(`button`,{onClick:t,className:`icon-gallery-error__button`,children:`Retry`})]})]})})),R,He,Ue=e((()=>{n(),R=i(),He=({count:e=20})=>(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`style`,{children:`
        .icon-gallery-skeleton {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .icon-gallery-skeleton {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .icon-gallery-skeleton {
            grid-template-columns: repeat(5, 1fr);
          }
        }
        @keyframes skeleton-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .icon-gallery-skeleton__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: #f9fafb;
          min-height: 120px;
          gap: 0.75rem;
          animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .icon-gallery-skeleton__icon {
          width: 48px;
          height: 48px;
          background-color: #e5e7eb;
          border-radius: 4px;
        }
        .icon-gallery-skeleton__text {
          width: 80%;
          height: 16px;
          background-color: #e5e7eb;
          border-radius: 4px;
        }
      `}),(0,R.jsx)(`div`,{className:`icon-gallery-skeleton`,children:Array.from({length:e}).map((e,t)=>(0,R.jsxs)(`div`,{className:`icon-gallery-skeleton__item`,children:[(0,R.jsx)(`div`,{className:`icon-gallery-skeleton__icon`}),(0,R.jsx)(`div`,{className:`icon-gallery-skeleton__text`})]},t))})]})})),We,z,Ge,Ke=e((()=>{We=t(n(),1),z=i(),Ge=({icon:e,prefix:t,iconSize:n=48,onClick:r})=>{let i=`${t}:${e.name}`,a=(0,We.useCallback)(()=>{r?.(e)},[r,e]);return(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(`style`,{children:`
        .icon-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: #ffffff;
          transition: background-color 0.2s ease;
          cursor: pointer;
          min-height: 120px;
          gap: 0.75rem;
        }
        .icon-card:hover {
          background-color: #f9fafb;
        }
        .icon-card:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        .icon-card__icon {
          width: 72px;
          height: 72px;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-card__code {
          font-size: 12px;
          font-family: monospace;
          color: #374151;
          text-align: center;
          word-break: break-all;
          line-height: 1.4;
        }
      `}),(0,z.jsxs)(`div`,{className:`icon-card`,onClick:a,role:`button`,tabIndex:0,onKeyDown:e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),a())},children:[(0,z.jsx)(`div`,{className:`icon-card__icon`,children:(0,z.jsx)(`esds-icon`,{name:i,style:{fontSize:`${n}px`}})}),(0,z.jsx)(`code`,{className:`icon-card__code`,children:i})]})]})}})),B,V,qe,H,Je=e((()=>{B=t(n(),1),V=i(),qe=1500,H=({value:e,label:t,children:n,className:r=``,size:i=`sm`})=>{let[a,o]=(0,B.useState)(`idle`),[s,c]=(0,B.useState)(!1),[l,u]=(0,B.useState)({x:0,y:0}),d=(0,B.useRef)(null),f=(0,B.useRef)(null);(0,B.useEffect)(()=>()=>{d.current&&clearTimeout(d.current)},[]);let p=(0,B.useCallback)(async t=>{let n=t.currentTarget.getBoundingClientRect();u({x:n.left+n.width/2,y:n.top-8});try{await navigator.clipboard.writeText(e),o(`copied`)}catch{o(`failed`)}d.current&&clearTimeout(d.current),d.current=setTimeout(()=>{o(`idle`)},qe)},[e]),m=(0,B.useCallback)(e=>{let t=e.currentTarget.getBoundingClientRect();u({x:t.left+t.width/2,y:t.top-8}),c(!0)},[]),h=(0,B.useCallback)(()=>{c(!1)},[]);return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`style`,{children:`
        .copyable-text {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .copyable-text__label {
          font-size: 14px;
          color: #6b7280;
        }
        .copyable-text__button {
          appearance: none;
          border: 1px solid transparent;
          background: var(--esds-color-gray-100, #f3f4f6);
          font-family: ui-monospace, monospace;
          font-size: var(--button-font-size);
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--esds-color-gray-700, #374151);
          line-height: 1.4;
        }
        .copyable-text__button:hover {
          background: var(--esds-color-gray-200, #e5e7eb);
          border-color: var(--esds-color-gray-300, #d1d5db);
        }
        .copyable-text__button:focus-visible {
          outline: 2px solid var(--esds-color-blue-500, #3b82f6);
          outline-offset: 2px;
        }
        .copyable-text__button:active {
          background: var(--esds-color-gray-300, #d1d5db);
        }
        .copyable-text__tooltip {
          position: fixed;
          background: var(--esds-color-gray-800, #1f2937);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-family: system-ui, -apple-system, sans-serif;
          left: var(--tooltip-x, 0);
          top: var(--tooltip-y, 0);
          transform: translateX(-50%) translateY(-100%);
          pointer-events: none;
          white-space: nowrap;
          z-index: 10001;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .copyable-text__tooltip--visible {
          opacity: 1;
        }
        .copyable-text__tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px;
          border-style: solid;
          border-color: var(--esds-color-gray-800, #1f2937) transparent transparent transparent;
        }
      `}),(0,V.jsxs)(`span`,{className:`copyable-text ${r}`,children:[t&&(0,V.jsxs)(`span`,{className:`copyable-text__label`,children:[t,`:`]}),(0,V.jsx)(`button`,{ref:f,className:`copyable-text__button`,onClick:p,onMouseEnter:m,onMouseLeave:h,type:`button`,"aria-label":`Copy ${e} to clipboard`,style:{"--button-font-size":{sm:`14px`,md:`16px`,lg:`18px`}[i]},children:n??e})]}),(0,V.jsx)(`span`,{className:`copyable-text__tooltip ${a!==`idle`||s?`copyable-text__tooltip--visible`:``}`,style:{"--tooltip-x":`${l.x}px`,"--tooltip-y":`${l.y}px`},role:`status`,"aria-live":`polite`,children:(()=>{if(a!==`idle`)switch(a){case`copied`:return`Copied!`;case`failed`:return`Failed to copy`}return s?`Copy to clipboard`:``})()})]})}})),U,Ye,Xe=e((()=>{U=i(),Ye=({metadata:e})=>{let t=e.tags.map(e=>(0,U.jsx)(`span`,{className:`metadata-pill`,children:e},e));return(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)(`style`,{children:`
        .metadata-section {
          margin-bottom: 16px;
        }
        .metadata-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .metadata-value {
          font-size: 14px;
          color: #111827;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .metadata-pill {
          font-family: monospace;
          font-size: 12px;
          background-color: var(--esds-color-gray-100);
          padding: 6px 8px;
          border-radius: 200px;
          display: flex;
          white-space: nowrap;
          width: max-content;
        }
      `}),(0,U.jsxs)(`div`,{className:`metadata-section`,children:[(0,U.jsx)(`div`,{className:`metadata-label`,children:`Tags:`}),(0,U.jsx)(`div`,{className:`metadata-value`,children:t.length>0?t:`No tags`})]}),(0,U.jsxs)(`div`,{className:`metadata-section`,children:[(0,U.jsx)(`div`,{className:`metadata-label`,children:`Collection:`}),(0,U.jsx)(`div`,{className:`metadata-value`,children:e.collection})]}),(0,U.jsxs)(`div`,{className:`metadata-section`,children:[(0,U.jsx)(`div`,{className:`metadata-label`,children:`License:`}),(0,U.jsx)(`div`,{className:`metadata-value`,children:e.license})]})]})}}));function Ze({icon:e,isOpen:t,prefix:n,onClose:r}){let[i,a]=(0,W.useState)(null);if((0,W.useEffect)(()=>{t&&e?j.listIconsCached({prefix:n,info:!0}).then(t=>{let r=me(t).find(t=>t.name===e.name);a(r?{name:r.name,iconId:`${n}:${r.name}`,tags:Array.from(r.categories||new Set),collection:t.info?.name??n,license:t.info?.license?.title??`Unknown License`}:null)}).catch(()=>{a(null)}):a(null)},[t,e,n]),(0,W.useEffect)(()=>(t?document.body.style.overflow=`hidden`:document.body.style.overflow=``,()=>{document.body.style.overflow=``}),[t]),(0,W.useEffect)(()=>{let e=e=>{e.key===`Escape`&&r()};return t&&document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[t,r]),!t||!e)return null;let o=()=>{r()},s=e=>{e.stopPropagation()},c=`${n}:${e.name}`,l=`<esds-icon name="${c}" />`,u=document.getElementById(`modal-root`)||document.body;return(0,Qe.createPortal)((0,G.jsx)(`div`,{"data-testid":`modal-backdrop`,onClick:o,style:{position:`fixed`,top:0,left:0,right:0,bottom:0,backgroundColor:`rgba(0, 0, 0, 0.5)`,display:`flex`,justifyContent:`center`,alignItems:`center`,zIndex:1e3},children:(0,G.jsxs)(`div`,{onClick:s,role:`dialog`,"aria-modal":`true`,"aria-label":`Icon details`,style:{fontFamily:`inherit`,backgroundColor:`white`,borderRadius:`8px`,padding:`24px`,maxWidth:`600px`,width:`90%`,maxHeight:`90vh`,overflow:`auto`,position:`relative`},children:[(0,G.jsx)(`button`,{onClick:r,"aria-label":`Close dialog`,style:{position:`absolute`,top:`10px`,right:`10px`,background:`none`,border:`none`,cursor:`pointer`,fontSize:`24px`},children:`×`}),(0,G.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,marginBottom:`var(--esds-spacing-2xl)`},children:(0,G.jsx)(`esds-icon`,{style:{fontSize:`var(--esds-icon-size-4xl)`},name:c})}),(0,G.jsx)(`div`,{style:{marginBottom:`var(--esds-spacing-2xl)`},children:(0,G.jsx)(H,{value:c,label:``,size:`lg`})}),(0,G.jsx)(`div`,{style:{marginBottom:`var(--esds-spacing-2xl)`},children:(0,G.jsx)(H,{value:l,label:`Component`})}),i&&(0,G.jsx)(Ye,{metadata:i})]})}),u)}var W,Qe,G,$e=e((()=>{ye(),W=t(n(),1),Qe=t(r(),1),be(),Je(),Xe(),G=i()})),K,q,et,tt=e((()=>{K=t(n(),1),Ke(),$e(),q=i(),et=({icons:e,prefix:t,iconSize:n})=>{let[r,i]=(0,K.useState)(null),[a,o]=(0,K.useState)(!1),s=(0,K.useCallback)(e=>{i(e),o(!0)},[]),c=(0,K.useCallback)(()=>{o(!1)},[]);return e.length===0?null:(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`style`,{children:`
        .icon-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .icon-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .icon-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}),(0,q.jsx)(`div`,{className:`icon-grid`,children:e.map(e=>(0,q.jsx)(Ge,{icon:e,prefix:t,iconSize:n,onClick:s},`${t}:${e.name}`))}),(0,q.jsx)(Ze,{icon:r,isOpen:a,prefix:t,onClose:c})]})}})),J,nt,rt=e((()=>{n(),J=i(),nt=({value:e,onChange:t,placeholder:n=`Search icons by name...`,disabled:r=!1,onClear:i})=>{let a=e=>{t(e.target.value)},o=()=>{i()},s=e.length>0;return(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(`style`,{children:`
        .icon-search-bar {
          position: relative;
          display: flex;
          align-items: center;
        }
        .icon-search-bar__input {
          width: 100%;
          padding: 10px 40px 10px 40px;
          font-size: 14px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          outline: none;
          background-color: #ffffff;
          color: #111827;
        }
        .icon-search-bar__input:focus {
          border-color: #3b82f6;
        }
        .icon-search-bar__input:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }
        .icon-search-bar__icon {
          position: absolute;
          left: 12px;
          pointer-events: none;
          color: #6b7280;
        }
        .icon-search-bar__icon:has(+ input:disabled) {
          opacity: 0.5;
        }
        .icon-search-bar__clear {
          position: absolute;
          right: 10px;
          padding: 4px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-search-bar__clear:hover {
          background-color: #f3f4f6;
        }
      `}),(0,J.jsxs)(`div`,{className:`icon-search-bar`,children:[(0,J.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,className:`icon-search-bar__icon`,children:[(0,J.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,J.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,J.jsx)(`input`,{type:`text`,value:e,onChange:a,placeholder:n,disabled:r,className:`icon-search-bar__input`}),s&&!r&&(0,J.jsx)(`button`,{type:`button`,onClick:o,className:`icon-search-bar__clear`,"aria-label":`Clear search`,children:(0,J.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,J.jsx)(`line`,{x1:`18`,y1:`6`,x2:`6`,y2:`18`}),(0,J.jsx)(`line`,{x1:`6`,y1:`6`,x2:`18`,y2:`18`})]})})]})]})}})),Y,it,at,ot,st,ct=e((()=>{n(),Y=i(),it=16,at=96,ot=2,st=({value:e,onChange:t,min:n=it,max:r=at,step:i=ot,disabled:a=!1})=>(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsx)(`style`,{children:`
        .icon-size-slider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 200px;
        }
        .icon-size-slider__label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
        }
        .icon-size-slider__input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          margin: 0;
          padding: 0;
          background: #e5e7eb;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          vertical-align: middle;
        }
        .icon-size-slider__input::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 3px;
        }
        .icon-size-slider__input::-moz-range-track {
          height: 6px;
          border-radius: 3px;
        }
        .icon-size-slider__input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          margin-top: -6px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: transform 0.1s ease;
        }
        .icon-size-slider__input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: transform 0.1s ease;
        }
        .icon-size-slider__input::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .icon-size-slider__input::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
        .icon-size-slider__value {
          font-size: 14px;
          font-family: monospace;
          color: #6b7280;
          min-width: 4ch;
          text-align: right;
        }
      `}),(0,Y.jsxs)(`div`,{className:`icon-size-slider`,children:[(0,Y.jsx)(`span`,{className:`icon-size-slider__label`,children:`Size`}),(0,Y.jsx)(`input`,{type:`range`,min:n,max:r,step:i,value:e,onChange:e=>{t(Number(e.target.value))},className:`icon-size-slider__input`,"aria-label":`Icon size`,disabled:a}),(0,Y.jsxs)(`span`,{className:`icon-size-slider__value`,children:[e,`px`]})]})]})})),lt,X,ut,dt,ft=e((()=>{lt=t(n(),1),Pe(),Le(),ze(),Ve(),Ue(),tt(),rt(),ct(),X=i(),ut=48,dt=()=>{let{collections:e,icons:t,totalCount:n,filteredCount:r,selectedCollection:i,searchQuery:a,isLoading:o,isLoadingCollections:s,error:c,setCollection:l,setSearchQuery:u,retry:d,clearSearch:f}=Ae(),[p,m]=(0,lt.useState)(ut),h=e=>{l(e)},g=e=>{u(e)},_=()=>{f()},v=()=>{d()},y=e=>{m(e)},b=()=>s?(0,X.jsxs)(`div`,{className:`icon-gallery__loading`,children:[(0,X.jsx)(He,{}),(0,X.jsx)(`p`,{className:`icon-gallery__loading-text`,children:`Loading collections...`})]}):o?(0,X.jsx)(He,{}):c===null?t.length===0?(0,X.jsx)(Re,{searchQuery:a,onClearSearch:a.length>0?_:void 0}):(0,X.jsx)(et,{icons:t,prefix:i,iconSize:p}):(0,X.jsx)(Be,{error:c,onRetry:v}),x=o||c!==null;return(0,X.jsxs)(X.Fragment,{children:[(0,X.jsx)(`style`,{children:`
        .icon-gallery {
          padding: 1.5rem;
        }
        .icon-gallery__header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          position: sticky;
          top: 0;
          background-color: #fff;
          box-shadow: 0 4px 6px -4px rgba(0, 0, 0, 0.05);
        }
        .icon-gallery__title-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .icon-gallery__title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .icon-gallery__count {
          font-size: 14px;
          color: #6b7280;
        }
        .icon-gallery__controls-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .icon-gallery__controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .icon-gallery__controls {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }
        .icon-gallery__search {
          flex: 1 1 200px;
        }
        .icon-gallery__filter {
          flex: 0 0 auto;
          min-width: 200px;
        }
        .icon-gallery__slider {
          flex: 0 0 auto;
          min-width: 200px;
          align-content: center;
        }
        .icon-gallery__loading {
          text-align: center;
          padding: 3rem 1rem;
        }
        .icon-gallery__loading-text {
          margin-top: 1rem;
          color: #6b7280;
          font-size: 14px;
        }
      `}),(0,X.jsxs)(`div`,{className:`icon-gallery`,children:[(0,X.jsxs)(`div`,{className:`icon-gallery__header`,children:[(0,X.jsxs)(`div`,{className:`icon-gallery__title-row`,children:[(0,X.jsx)(`h1`,{className:`icon-gallery__title`,children:`Icon Gallery`}),(0,X.jsxs)(`span`,{className:`icon-gallery__count`,children:[`Showing `,r,` of `,n,` icons`]})]}),(0,X.jsx)(`div`,{className:`icon-gallery__controls-wrapper`,children:(0,X.jsxs)(`div`,{className:`icon-gallery__controls`,children:[(0,X.jsx)(`div`,{className:`icon-gallery__search`,children:(0,X.jsx)(nt,{value:a,onChange:g,disabled:x,onClear:_})}),(0,X.jsx)(`div`,{className:`icon-gallery__filter`,children:(0,X.jsx)(Ie,{collections:e,selected:i,onChange:h,disabled:x})}),(0,X.jsx)(`div`,{className:`icon-gallery__slider`,children:(0,X.jsx)(st,{value:p,onChange:y,disabled:x})})]})})]}),(0,X.jsx)(`div`,{children:b()})]})]})}})),pt,Z,Q,mt,ht=e((()=>{pt=t(n(),1),Z=i(),Q={message:`An unexpected error occurred in the icon gallery`,code:`BOUNDARY_ERROR`},mt=class extends pt.Component{state={hasError:!1,error:null};static getDerivedStateFromError(e){return{hasError:!0,error:{message:e.message||Q.message,code:e.name===`AbortError`?`ABORTED`:Q.code}}}componentDidCatch(e,t){console.error(`IconGalleryErrorBoundary caught an error:`,e,t)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsx)(`style`,{children:`
            .icon-gallery-error-boundary {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 3rem 1rem;
              text-align: center;
            }
            .icon-gallery-error-boundary__icon {
              margin-bottom: 1rem;
              color: #ef4444;
            }
            .icon-gallery-error-boundary__title {
              font-size: 18px;
              font-weight: 600;
              color: #374151;
              margin-bottom: 0.5rem;
            }
            .icon-gallery-error-boundary__message {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 1.5rem;
              max-width: 400px;
            }
            .icon-gallery-error-boundary__button {
              padding: 8px 16px;
              font-size: 14px;
              font-weight: 500;
              color: #ffffff;
              background-color: #3b82f6;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              transition: background-color 0.2s ease;
            }
            .icon-gallery-error-boundary__button:hover {
              background-color: #2563eb;
            }
          `}),(0,Z.jsxs)(`div`,{className:`icon-gallery-error-boundary`,children:[(0,Z.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error-boundary__icon`,children:[(0,Z.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,Z.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,Z.jsx)(`h3`,{className:`icon-gallery-error-boundary__title`,children:`Something went wrong`}),(0,Z.jsx)(`p`,{className:`icon-gallery-error-boundary__message`,children:this.state.error?.message||Q.message}),(0,Z.jsx)(`button`,{onClick:()=>this.setState({hasError:!1,error:null}),className:`icon-gallery-error-boundary__button`,children:`Try Again`})]})]}):this.props.children}}}));function gt(e){return(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(o,{title:`Icons/Icon Gallery`}),`
`,(0,$.jsx)(mt,{children:(0,$.jsx)(dt,{})})]})}function _t(e={}){let{wrapper:t}={...s(),...e.components};return t?(0,$.jsx)(t,{...e,children:(0,$.jsx)(gt,{...e})}):gt(e)}var $;e((()=>{$=i(),c(),a(),ft(),ht()}))();export{_t as default};