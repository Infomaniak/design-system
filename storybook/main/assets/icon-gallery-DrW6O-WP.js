import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{t as n}from"./react-CnPKFcMr.js";import{t as r}from"./react-dom-DJJocFY6.js";import{A as i,O as a,T as o,a as s,k as c,o as l,u}from"./iframe-CGLci5dI.js";import{t as d}from"./mdx-react-shim-CXY17jHF.js";var f,p=e((()=>{a(),f=new c({resources:[`https://iconify.infomaniak.com/`]})})),m,h=e((()=>{m={ABORTED:`ABORTED`,API_ERROR:`API_ERROR`,NETWORK_ERROR:`NETWORK_ERROR`,TIMEOUT:`TIMEOUT`,UNKNOWN_ERROR:`UNKNOWN_ERROR`,BOUNDARY_ERROR:`BOUNDARY_ERROR`}}));function ee(e){return{name:e.name,categories:e.categories}}function g(e){return e instanceof Error?{message:e.message,code:e.name===`AbortError`?m.ABORTED:m.API_ERROR}:{message:`An unknown error occurred`,code:m.UNKNOWN_ERROR}}function _(e=f){let t=(0,v.useRef)(null),n=(0,v.useRef)(null),[r,i]=(0,v.useState)([]),[a,o]=(0,v.useState)(``),[s,c]=(0,v.useState)([]),[l,u]=(0,v.useState)(0),[d,p]=(0,v.useState)(``),[m,h]=(0,v.useState)(``),[_,y]=(0,v.useState)(!1),[b,x]=(0,v.useState)(!1),[ne,S]=(0,v.useState)(null),C=_||b,w=(0,v.useCallback)(()=>{t.current!==null&&(t.current.abort(),t.current=null)},[]),T=(0,v.useCallback)(e=>{p(e),n.current!==null&&clearTimeout(n.current),n.current=setTimeout(()=>{h(e.trim().toLowerCase())},te)},[]),E=(0,v.useCallback)(async t=>{try{y(!0),S(null);let n=await e.listIconSets({signal:t}),r=Object.keys(n).sort();i(r),r.length>0&&o(r[0])}catch(e){if(t.aborted)return;S(g(e))}finally{y(!1)}},[e]),D=(0,v.useCallback)(async(t,n)=>{try{u((await e.search({prefix:t,query:``,signal:n})).length)}catch{}},[e]),O=(0,v.useCallback)(async(n,r,i)=>{try{x(!0),S(null),c((await e.search({prefix:n,query:r,signal:i})).map(ee))}catch(e){if(i.aborted)return;S(g(e))}finally{x(!1),t.current?.signal===i&&(t.current=null)}},[e]);(0,v.useEffect)(()=>{let e=new AbortController;return E(e.signal),()=>{e.abort()}},[E]),(0,v.useEffect)(()=>{if(a===``)return;w();let e=new AbortController;return t.current=e,D(a,e.signal),O(a,m,e.signal),()=>{e.abort()}},[a,m,D,O,w]);let k=(0,v.useCallback)(e=>{o(e),p(``),h(``)},[]),A=(0,v.useCallback)(()=>{p(``),h(``),n.current!==null&&(clearTimeout(n.current),n.current=null)},[]),re=(0,v.useCallback)(()=>{if(r.length===0){w();let e=new AbortController;t.current=e,E(e.signal)}else if(a!==``){w();let e=new AbortController;t.current=e,D(a,e.signal),O(a,m,e.signal)}},[r.length,a,m,E,D,O,w]);return(0,v.useEffect)(()=>()=>{w(),n.current!==null&&clearTimeout(n.current)},[w]),{collections:r,icons:s,totalCount:l,filteredCount:s.length,selectedCollection:a,searchQuery:d,isLoading:C,isLoadingCollections:_,isLoadingIcons:b,error:ne,setCollection:k,setSearchQuery:T,retry:re,clearSearch:A}}var v,te,y=e((()=>{a(),v=t(n(),1),p(),h(),te=300}));function b(){try{return typeof window>`u`||!window.parent?null:new URL(window.parent.location.href)}catch{return null}}function x(e){let t=b();return t?t.searchParams.get(e):null}function ne(e){let t=b();if(!t)return;Object.entries(e).forEach(([e,n])=>{n===null||n===``?t.searchParams.delete(e):t.searchParams.set(e,n)});let n=t.search,r=t.toString().split(`?`)[0]+n.replace(/%2F/g,`/`);window.parent.history.replaceState(null,``,r)}function S(){let e=_(f),{collections:t,selectedCollection:n,searchQuery:r,setCollection:i,setSearchQuery:a}=e,[o,s]=(0,C.useState)(!1),c=(0,C.useRef)(null),l=(0,C.useRef)({search:``,collection:``});(0,C.useEffect)(()=>{if(o||t.length===0)return;let e=x(T),n=x(w);e&&t.includes(e)&&i(e),n&&a(n),s(!0)},[t,o,i,a]);let u=(0,C.useCallback)((e,t)=>{l.current.search===e&&l.current.collection===t||(l.current={search:e,collection:t},ne({[w]:e||null,[T]:t||null}))},[]);return(0,C.useEffect)(()=>{if(o)return c.current&&clearTimeout(c.current),c.current=setTimeout(()=>{u(r,n)},E),()=>{c.current&&clearTimeout(c.current)}},[r,n,o,u]),(0,C.useEffect)(()=>()=>{c.current&&clearTimeout(c.current)},[]),e}var C,w,T,E,D=e((()=>{C=t(n(),1),p(),y(),w=`search`,T=`collection`,E=100})),O,k,A,re=e((()=>{O=t(n(),1),k=o(),A=({collections:e,selected:t,onChange:n,disabled:r=!1})=>{let i=e=>{n(e.target.value)},a=O.useMemo(()=>[...e].sort((e,t)=>e.localeCompare(t)),[e]);return(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(`style`,{children:`
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
      `}),(0,k.jsx)(`select`,{id:`collection-select`,"aria-label":`Icon collection`,value:t,onChange:i,disabled:r,className:`icon-collection-filter`,children:a.map(e=>(0,k.jsx)(`option`,{value:e,children:e},e))})]})},A.__docgenInfo={description:``,methods:[],displayName:`IconCollectionFilter`,props:{collections:{required:!0,tsType:{name:`unknown`},description:``},selected:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(collection: string) => void`,signature:{arguments:[{type:{name:`string`},name:`collection`}],return:{name:`void`}}},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})),j,ie,ae=e((()=>{n(),j=o(),ie=({searchQuery:e=``,onClearSearch:t})=>{let n=e.length>0;return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(`style`,{children:`
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
      `}),(0,j.jsxs)(`div`,{className:`icon-gallery-empty`,children:[(0,j.jsxs)(`svg`,{width:`64`,height:`64`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,className:`icon-gallery-empty__icon`,children:[(0,j.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,j.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,j.jsx)(`h3`,{className:`icon-gallery-empty__title`,children:n?`No icons found for "${e}"`:`No icons in this collection`}),(0,j.jsx)(`p`,{className:`icon-gallery-empty__text${n?` icon-gallery-empty__text--with-query`:``}`,children:n?`Try adjusting your search terms or browse all icons`:`This collection appears to be empty. Try selecting a different collection.`}),n&&t&&(0,j.jsx)(`button`,{onClick:t,className:`icon-gallery-empty__button`,children:`Clear search`})]})]})},ie.__docgenInfo={description:``,methods:[],displayName:`IconGalleryEmpty`,props:{searchQuery:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`''`,computed:!1}},onClearSearch:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})),M,N,oe=e((()=>{n(),M=o(),N=({error:e,onRetry:t})=>(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(`style`,{children:`
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
      `}),(0,M.jsxs)(`div`,{className:`icon-gallery-error`,children:[(0,M.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error__icon`,children:[(0,M.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,M.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,M.jsx)(`h3`,{className:`icon-gallery-error__title`,children:`Something went wrong`}),(0,M.jsx)(`p`,{className:`icon-gallery-error__message`,children:e.message}),(0,M.jsx)(`button`,{onClick:t,className:`icon-gallery-error__button`,children:`Retry`})]})]}),N.__docgenInfo={description:``,methods:[],displayName:`IconGalleryError`,props:{error:{required:!0,tsType:{name:`IconGalleryErrorType`},description:``},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})),P,F,se=e((()=>{n(),P=o(),F=({count:e=20})=>(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(`style`,{children:`
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
      `}),(0,P.jsx)(`div`,{className:`icon-gallery-skeleton`,children:Array.from({length:e}).map((e,t)=>(0,P.jsxs)(`div`,{className:`icon-gallery-skeleton__item`,children:[(0,P.jsx)(`div`,{className:`icon-gallery-skeleton__icon`}),(0,P.jsx)(`div`,{className:`icon-gallery-skeleton__text`})]},t))})]}),F.__docgenInfo={description:``,methods:[],displayName:`IconGallerySkeleton`,props:{count:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`20`,computed:!1}}}}})),ce,I,L,le=e((()=>{ce=t(n(),1),I=o(),L=({icon:e,prefix:t,iconSize:n=48,onClick:r})=>{let i=`${t}:${e.name}`,a=(0,ce.useCallback)(()=>{r?.(e)},[r,e]);return(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)(`style`,{children:`
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
      `}),(0,I.jsxs)(`div`,{className:`icon-card`,onClick:a,role:`button`,tabIndex:0,onKeyDown:e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),a())},children:[(0,I.jsx)(`div`,{className:`icon-card__icon`,children:(0,I.jsx)(`esds-icon`,{name:i,style:{fontSize:`${n}px`}})}),(0,I.jsx)(`code`,{className:`icon-card__code`,children:i})]})]})},L.__docgenInfo={description:``,methods:[],displayName:`IconCard`,props:{icon:{required:!0,tsType:{name:`IconItem`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``},iconSize:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`48`,computed:!1}},onClick:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(icon: IconItem) => void`,signature:{arguments:[{type:{name:`IconItem`},name:`icon`}],return:{name:`void`}}},description:``}}}})),R,z,ue,B,de=e((()=>{R=t(n(),1),z=o(),ue=1500,B=({value:e,label:t,children:n,className:r=``,size:i=`sm`})=>{let[a,o]=(0,R.useState)(`idle`),[s,c]=(0,R.useState)(!1),[l,u]=(0,R.useState)({x:0,y:0}),d=(0,R.useRef)(null),f=(0,R.useRef)(null);(0,R.useEffect)(()=>()=>{d.current&&clearTimeout(d.current)},[]);let p=(0,R.useCallback)(async t=>{let n=t.currentTarget.getBoundingClientRect();u({x:n.left+n.width/2,y:n.top-8});try{await navigator.clipboard.writeText(e),o(`copied`)}catch{o(`failed`)}d.current&&clearTimeout(d.current),d.current=setTimeout(()=>{o(`idle`)},ue)},[e]),m=(0,R.useCallback)(e=>{let t=e.currentTarget.getBoundingClientRect();u({x:t.left+t.width/2,y:t.top-8}),c(!0)},[]),h=(0,R.useCallback)(()=>{c(!1)},[]);return(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(`style`,{children:`
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
      `}),(0,z.jsxs)(`span`,{className:`copyable-text ${r}`,children:[t&&(0,z.jsxs)(`span`,{className:`copyable-text__label`,children:[t,`:`]}),(0,z.jsx)(`button`,{ref:f,className:`copyable-text__button`,onClick:p,onMouseEnter:m,onMouseLeave:h,type:`button`,"aria-label":`Copy ${e} to clipboard`,style:{"--button-font-size":{sm:`14px`,md:`16px`,lg:`18px`}[i]},children:n??e})]}),(0,z.jsx)(`span`,{className:`copyable-text__tooltip ${a!==`idle`||s?`copyable-text__tooltip--visible`:``}`,style:{"--tooltip-x":`${l.x}px`,"--tooltip-y":`${l.y}px`},role:`status`,"aria-live":`polite`,children:(()=>{if(a!==`idle`)switch(a){case`copied`:return`Copied!`;case`failed`:return`Failed to copy`}return s?`Copy to clipboard`:``})()})]})},B.__docgenInfo={description:``,methods:[],displayName:`CopyableText`,props:{value:{required:!0,tsType:{name:`string`},description:`Value to copy to clipboard`},label:{required:!1,tsType:{name:`string`},description:`Optional label text to display before the value`},children:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:`Optional children to render instead of value`},className:{required:!1,tsType:{name:`string`},description:`Optional additional className`,defaultValue:{value:`''`,computed:!1}},size:{required:!1,tsType:{name:`union`,raw:`'sm' | 'md' | 'lg'`,elements:[{name:`literal`,value:`'sm'`},{name:`literal`,value:`'md'`},{name:`literal`,value:`'lg'`}]},description:`Optional size variant`,defaultValue:{value:`'sm'`,computed:!1}}}}})),V,H,fe=e((()=>{V=o(),H=({metadata:e})=>{let t=e.tags.map(e=>(0,V.jsx)(`span`,{className:`metadata-pill`,children:e},e));return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`style`,{children:`
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
      `}),(0,V.jsxs)(`div`,{className:`metadata-section`,children:[(0,V.jsx)(`div`,{className:`metadata-label`,children:`Tags:`}),(0,V.jsx)(`div`,{className:`metadata-value`,children:t.length>0?t:`No tags`})]}),(0,V.jsxs)(`div`,{className:`metadata-section`,children:[(0,V.jsx)(`div`,{className:`metadata-label`,children:`Collection:`}),(0,V.jsx)(`div`,{className:`metadata-value`,children:e.collection})]}),(0,V.jsxs)(`div`,{className:`metadata-section`,children:[(0,V.jsx)(`div`,{className:`metadata-label`,children:`License:`}),(0,V.jsx)(`div`,{className:`metadata-value`,children:e.license})]})]})},H.__docgenInfo={description:``,methods:[],displayName:`IconMetadataDisplay`,props:{metadata:{required:!0,tsType:{name:`IconMetadata`},description:`Metadata to display`}}}}));function pe({icon:e,isOpen:t,prefix:n,onClose:r}){let[a,o]=(0,U.useState)(null);if((0,U.useEffect)(()=>{t&&e?f.listIconsCached({prefix:n,info:!0}).then(t=>{let r=i(t).find(t=>t.name===e.name);o(r?{name:r.name,iconId:`${n}:${r.name}`,tags:Array.from(r.categories||new Set),collection:t.info?.name??n,license:t.info?.license?.title??`Unknown License`}:null)}).catch(()=>{o(null)}):o(null)},[t,e,n]),(0,U.useEffect)(()=>(t?document.body.style.overflow=`hidden`:document.body.style.overflow=``,()=>{document.body.style.overflow=``}),[t]),(0,U.useEffect)(()=>{let e=e=>{e.key===`Escape`&&r()};return t&&document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[t,r]),!t||!e)return null;let s=()=>{r()},c=e=>{e.stopPropagation()},l=`${n}:${e.name}`,u=`<esds-icon name="${l}" />`,d=document.getElementById(`modal-root`)||document.body;return(0,me.createPortal)((0,W.jsx)(`div`,{"data-testid":`modal-backdrop`,onClick:s,style:{position:`fixed`,top:0,left:0,right:0,bottom:0,backgroundColor:`rgba(0, 0, 0, 0.5)`,display:`flex`,justifyContent:`center`,alignItems:`center`,zIndex:1e3},children:(0,W.jsxs)(`div`,{onClick:c,role:`dialog`,"aria-modal":`true`,"aria-label":`Icon details`,style:{fontFamily:`inherit`,backgroundColor:`white`,borderRadius:`8px`,padding:`24px`,maxWidth:`600px`,width:`90%`,maxHeight:`90vh`,overflow:`auto`,position:`relative`},children:[(0,W.jsx)(`button`,{onClick:r,"aria-label":`Close dialog`,style:{position:`absolute`,top:`10px`,right:`10px`,background:`none`,border:`none`,cursor:`pointer`,fontSize:`24px`},children:`×`}),(0,W.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,marginBottom:`var(--esds-spacing-2xl)`},children:(0,W.jsx)(`esds-icon`,{style:{fontSize:`var(--esds-icon-size-xl)`},name:l})}),(0,W.jsx)(`div`,{style:{marginBottom:`var(--esds-spacing-2xl)`},children:(0,W.jsx)(B,{value:l,label:``,size:`lg`})}),(0,W.jsx)(`div`,{style:{marginBottom:`var(--esds-spacing-2xl)`},children:(0,W.jsx)(B,{value:u,label:`Component`})}),a&&(0,W.jsx)(H,{metadata:a})]})}),d)}var U,me,W,he=e((()=>{a(),U=t(n(),1),me=t(r(),1),p(),de(),fe(),W=o()})),G,K,q,ge=e((()=>{G=t(n(),1),le(),he(),K=o(),q=({icons:e,prefix:t,iconSize:n})=>{let[r,i]=(0,G.useState)(null),[a,o]=(0,G.useState)(!1),s=(0,G.useCallback)(e=>{i(e),o(!0)},[]),c=(0,G.useCallback)(()=>{o(!1)},[]);return e.length===0?null:(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(`style`,{children:`
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
      `}),(0,K.jsx)(`div`,{className:`icon-grid`,children:e.map(e=>(0,K.jsx)(L,{icon:e,prefix:t,iconSize:n,onClick:s},`${t}:${e.name}`))}),(0,K.jsx)(pe,{icon:r,isOpen:a,prefix:t,onClose:c})]})},q.__docgenInfo={description:``,methods:[],displayName:`IconGrid`,props:{icons:{required:!0,tsType:{name:`unknown`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``},iconSize:{required:!1,tsType:{name:`number`},description:``}}}})),J,_e,ve=e((()=>{n(),J=o(),_e=({value:e,onChange:t,placeholder:n=`Search icons by name...`,disabled:r=!1,onClear:i})=>{let a=e=>{t(e.target.value)},o=()=>{i()},s=e.length>0;return(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(`style`,{children:`
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
      `}),(0,J.jsxs)(`div`,{className:`icon-search-bar`,children:[(0,J.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,className:`icon-search-bar__icon`,children:[(0,J.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,J.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,J.jsx)(`input`,{type:`text`,value:e,onChange:a,placeholder:n,disabled:r,className:`icon-search-bar__input`}),s&&!r&&(0,J.jsx)(`button`,{type:`button`,onClick:o,className:`icon-search-bar__clear`,"aria-label":`Clear search`,children:(0,J.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,J.jsx)(`line`,{x1:`18`,y1:`6`,x2:`6`,y2:`18`}),(0,J.jsx)(`line`,{x1:`6`,y1:`6`,x2:`18`,y2:`18`})]})})]})]})},_e.__docgenInfo={description:``,methods:[],displayName:`IconSearchBar`,props:{value:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: string) => void`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`void`}}},description:``},placeholder:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Search icons by name...'`,computed:!1}},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},onClear:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})),Y,ye,be,xe,Se,Ce=e((()=>{n(),Y=o(),ye=16,be=96,xe=2,Se=({value:e,onChange:t,min:n=ye,max:r=be,step:i=xe,disabled:a=!1})=>(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsx)(`style`,{children:`
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
      `}),(0,Y.jsxs)(`div`,{className:`icon-size-slider`,children:[(0,Y.jsx)(`span`,{className:`icon-size-slider__label`,children:`Size`}),(0,Y.jsx)(`input`,{type:`range`,min:n,max:r,step:i,value:e,onChange:e=>{t(Number(e.target.value))},className:`icon-size-slider__input`,"aria-label":`Icon size`,disabled:a}),(0,Y.jsxs)(`span`,{className:`icon-size-slider__value`,children:[e,`px`]})]})]}),Se.__docgenInfo={description:``,methods:[],displayName:`IconSizeSlider`,props:{value:{required:!0,tsType:{name:`number`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: number) => void`,signature:{arguments:[{type:{name:`number`},name:`value`}],return:{name:`void`}}},description:``},min:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`16`,computed:!1}},max:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`96`,computed:!1}},step:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`2`,computed:!1}},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})),we,X,Te,Ee,De=e((()=>{we=t(n(),1),D(),re(),ae(),oe(),se(),ge(),ve(),Ce(),X=o(),Te=48,Ee=()=>{let{collections:e,icons:t,totalCount:n,filteredCount:r,selectedCollection:i,searchQuery:a,isLoading:o,isLoadingCollections:s,error:c,setCollection:l,setSearchQuery:u,retry:d,clearSearch:f}=S(),[p,m]=(0,we.useState)(Te),h=e=>{l(e)},ee=e=>{u(e)},g=()=>{f()},_=()=>{d()},v=e=>{m(e)},te=()=>s?(0,X.jsxs)(`div`,{className:`icon-gallery__loading`,children:[(0,X.jsx)(F,{}),(0,X.jsx)(`p`,{className:`icon-gallery__loading-text`,children:`Loading collections...`})]}):o?(0,X.jsx)(F,{}):c===null?t.length===0?(0,X.jsx)(ie,{searchQuery:a,onClearSearch:a.length>0?g:void 0}):(0,X.jsx)(q,{icons:t,prefix:i,iconSize:p}):(0,X.jsx)(N,{error:c,onRetry:_}),y=o||c!==null;return(0,X.jsxs)(X.Fragment,{children:[(0,X.jsx)(`style`,{children:`
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
      `}),(0,X.jsxs)(`div`,{className:`icon-gallery`,children:[(0,X.jsxs)(`div`,{className:`icon-gallery__header`,children:[(0,X.jsxs)(`div`,{className:`icon-gallery__title-row`,children:[(0,X.jsx)(`h1`,{className:`icon-gallery__title`,children:`Icon Gallery`}),(0,X.jsxs)(`span`,{className:`icon-gallery__count`,children:[`Showing `,r,` of `,n,` icons`]})]}),(0,X.jsx)(`div`,{className:`icon-gallery__controls-wrapper`,children:(0,X.jsxs)(`div`,{className:`icon-gallery__controls`,children:[(0,X.jsx)(`div`,{className:`icon-gallery__search`,children:(0,X.jsx)(_e,{value:a,onChange:ee,disabled:y,onClear:g})}),(0,X.jsx)(`div`,{className:`icon-gallery__filter`,children:(0,X.jsx)(A,{collections:e,selected:i,onChange:h,disabled:y})}),(0,X.jsx)(`div`,{className:`icon-gallery__slider`,children:(0,X.jsx)(Se,{value:p,onChange:v,disabled:y})})]})})]}),(0,X.jsx)(`div`,{children:te()})]})]})},Ee.__docgenInfo={description:``,methods:[],displayName:`IconGallery`}})),Oe,Z,Q,ke,Ae=e((()=>{Oe=t(n(),1),Z=o(),Q={message:`An unexpected error occurred in the icon gallery`,code:`BOUNDARY_ERROR`},ke=class extends Oe.Component{state={hasError:!1,error:null};static getDerivedStateFromError(e){return{hasError:!0,error:{message:e.message||Q.message,code:e.name===`AbortError`?`ABORTED`:Q.code}}}componentDidCatch(e,t){console.error(`IconGalleryErrorBoundary caught an error:`,e,t)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsx)(`style`,{children:`
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
          `}),(0,Z.jsxs)(`div`,{className:`icon-gallery-error-boundary`,children:[(0,Z.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error-boundary__icon`,children:[(0,Z.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,Z.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,Z.jsx)(`h3`,{className:`icon-gallery-error-boundary__title`,children:`Something went wrong`}),(0,Z.jsx)(`p`,{className:`icon-gallery-error-boundary__message`,children:this.state.error?.message||Q.message}),(0,Z.jsx)(`button`,{onClick:()=>this.setState({hasError:!1,error:null}),className:`icon-gallery-error-boundary__button`,children:`Try Again`})]})]}):this.props.children}},ke.__docgenInfo={description:``,methods:[],displayName:`IconGalleryErrorBoundary`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},fallback:{required:!1,tsType:{name:`ReactNode`},description:``}}}}));function je(e){return(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(s,{title:`Icons/Icon Gallery`}),`
`,(0,$.jsx)(ke,{children:(0,$.jsx)(Ee,{})})]})}function Me(e={}){let{wrapper:t}={...u(),...e.components};return t?(0,$.jsx)(t,{...e,children:(0,$.jsx)(je,{...e})}):je(e)}var $;e((()=>{$=o(),d(),l(),De(),Ae()}))();export{Me as default};