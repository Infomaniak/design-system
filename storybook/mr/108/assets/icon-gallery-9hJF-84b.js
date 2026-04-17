import{$t as e,Kt as t,Zt as n,a as r,bt as i,s as a,yt as o}from"./iframe-DGZ5NNhL.js";var s=e(o(),1),c=e(n(),1);const l=new t({resources:[`https://iconify.preprod.dev.infomaniak.ch/`]}),u={ABORTED:`ABORTED`,API_ERROR:`API_ERROR`,NETWORK_ERROR:`NETWORK_ERROR`,TIMEOUT:`TIMEOUT`,UNKNOWN_ERROR:`UNKNOWN_ERROR`,BOUNDARY_ERROR:`BOUNDARY_ERROR`};var d=300;function f(e){return{name:e.name,categories:e.categories}}function p(e){return e instanceof Error?{message:e.message,code:e.name===`AbortError`?u.ABORTED:u.API_ERROR}:{message:`An unknown error occurred`,code:u.UNKNOWN_ERROR}}function m(e=l){let t=(0,c.useRef)(null),n=(0,c.useRef)(new Map),r=(0,c.useRef)(null),[i,a]=(0,c.useState)([]),[o,s]=(0,c.useState)(``),[u,m]=(0,c.useState)([]),[h,g]=(0,c.useState)(``),[_,v]=(0,c.useState)(``),[y,b]=(0,c.useState)(!1),[x,S]=(0,c.useState)(!1),[C,w]=(0,c.useState)(null),T=y||x,E=(0,c.useCallback)(()=>{t.current!==null&&(t.current.abort(),t.current=null)},[]),D=(0,c.useCallback)(e=>{g(e),r.current!==null&&clearTimeout(r.current),r.current=setTimeout(()=>{v(e.trim().toLowerCase())},d)},[]),O=(0,c.useCallback)(async t=>{try{b(!0),w(null);let n=await e.listIconSets({signal:t}),r=Object.keys(n).sort();a(r),r.length>0&&s(r[0])}catch(e){if(t.aborted)return;w(p(e))}finally{b(!1)}},[e]),k=(0,c.useCallback)(async(r,i)=>{try{S(!0),w(null);let t=n.current.get(r);if(t!==void 0){m(t);return}let a=(await e.listIcons({prefix:r,signal:i})).icons.map(f);n.current.set(r,a),m(a)}catch(e){if(i.aborted)return;w(p(e))}finally{S(!1),t.current?.signal===i&&(t.current=null)}},[e]);(0,c.useEffect)(()=>{let e=new AbortController;return O(e.signal),()=>{e.abort()}},[O]),(0,c.useEffect)(()=>{if(o===``)return;E();let e=new AbortController;return t.current=e,k(o,e.signal),()=>{e.abort()}},[o,k,E]);let A=(0,c.useMemo)(()=>_===``?u:u.filter(e=>e.name.toLowerCase().includes(_)),[u,_]),j=(0,c.useCallback)(e=>{s(e),g(``),v(``)},[]),M=(0,c.useCallback)(()=>{g(``),v(``),r.current!==null&&(clearTimeout(r.current),r.current=null)},[]),N=(0,c.useCallback)(()=>{if(i.length===0){E();let e=new AbortController;t.current=e,O(e.signal)}else if(o!==``){n.current.delete(o),E();let e=new AbortController;t.current=e,k(o,e.signal)}},[i.length,o,O,k,E]);return(0,c.useEffect)(()=>()=>{E(),r.current!==null&&clearTimeout(r.current)},[E]),{collections:i,icons:A,totalCount:u.length,filteredCount:A.length,selectedCollection:o,searchQuery:h,isLoading:T,isLoadingCollections:y,isLoadingIcons:x,error:C,setCollection:j,setSearchQuery:D,retry:N,clearSearch:M}}var h=`search`,g=`collection`,_=100;function v(){try{return typeof window>`u`||!window.parent?null:new URL(window.parent.location.href)}catch{return null}}function y(e){let t=v();return t?t.searchParams.get(e):null}function b(e){let t=v();if(!t)return;Object.entries(e).forEach(([e,n])=>{n===null||n===``?t.searchParams.delete(e):t.searchParams.set(e,n)});let n=t.search,r=t.toString().split(`?`)[0]+n.replace(/%2F/g,`/`);window.parent.history.replaceState(null,``,r)}function x(){let e=m(l),{collections:t,selectedCollection:n,searchQuery:r,setCollection:i,setSearchQuery:a}=e,[o,s]=(0,c.useState)(!1),u=(0,c.useRef)(null),d=(0,c.useRef)({search:``,collection:``});(0,c.useEffect)(()=>{if(o||t.length===0)return;let e=y(g),n=y(h);e&&t.includes(e)&&i(e),n&&a(n),s(!0)},[t,o,i,a]);let f=(0,c.useCallback)((e,t)=>{d.current.search===e&&d.current.collection===t||(d.current={search:e,collection:t},b({[h]:e||null,[g]:t||null}))},[]);return(0,c.useEffect)(()=>{if(o)return u.current&&clearTimeout(u.current),u.current=setTimeout(()=>{f(r,n)},_),()=>{u.current&&clearTimeout(u.current)}},[r,n,o,f]),(0,c.useEffect)(()=>()=>{u.current&&clearTimeout(u.current)},[]),e}var S=({collections:e,selected:t,onChange:n,disabled:r=!1})=>{let i=e=>{n(e.target.value)},a=c.useMemo(()=>[...e].sort((e,t)=>e.localeCompare(t)),[e]);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsx)(`select`,{id:`collection-select`,"aria-label":`Icon collection`,value:t,onChange:i,disabled:r,className:`icon-collection-filter`,children:a.map(e=>(0,s.jsx)(`option`,{value:e,children:e},e))})]})},C=S;S.__docgenInfo={description:``,methods:[],displayName:`IconCollectionFilter`,props:{collections:{required:!0,tsType:{name:`unknown`},description:``},selected:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(collection: string) => void`,signature:{arguments:[{type:{name:`string`},name:`collection`}],return:{name:`void`}}},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}};var w=({searchQuery:e=``,onClearSearch:t})=>{let n=e.length>0;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsxs)(`div`,{className:`icon-gallery-empty`,children:[(0,s.jsxs)(`svg`,{width:`64`,height:`64`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,className:`icon-gallery-empty__icon`,children:[(0,s.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,s.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,s.jsx)(`h3`,{className:`icon-gallery-empty__title`,children:n?`No icons found for "${e}"`:`No icons in this collection`}),(0,s.jsx)(`p`,{className:`icon-gallery-empty__text${n?` icon-gallery-empty__text--with-query`:``}`,children:n?`Try adjusting your search terms or browse all icons`:`This collection appears to be empty. Try selecting a different collection.`}),n&&t&&(0,s.jsx)(`button`,{onClick:t,className:`icon-gallery-empty__button`,children:`Clear search`})]})]})},T=w;w.__docgenInfo={description:``,methods:[],displayName:`IconGalleryEmpty`,props:{searchQuery:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`''`,computed:!1}},onClearSearch:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var E=({error:e,onRetry:t})=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsxs)(`div`,{className:`icon-gallery-error`,children:[(0,s.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error__icon`,children:[(0,s.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,s.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,s.jsx)(`h3`,{className:`icon-gallery-error__title`,children:`Something went wrong`}),(0,s.jsx)(`p`,{className:`icon-gallery-error__message`,children:e.message}),(0,s.jsx)(`button`,{onClick:t,className:`icon-gallery-error__button`,children:`Retry`})]})]}),D=E;E.__docgenInfo={description:``,methods:[],displayName:`IconGalleryError`,props:{error:{required:!0,tsType:{name:`IconGalleryErrorType`},description:``},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var O=({count:e=20})=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsx)(`div`,{className:`icon-gallery-skeleton`,children:Array.from({length:e}).map((e,t)=>(0,s.jsxs)(`div`,{className:`icon-gallery-skeleton__item`,children:[(0,s.jsx)(`div`,{className:`icon-gallery-skeleton__icon`}),(0,s.jsx)(`div`,{className:`icon-gallery-skeleton__text`})]},t))})]}),k=O;O.__docgenInfo={description:``,methods:[],displayName:`IconGallerySkeleton`,props:{count:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`20`,computed:!1}}}};var A=({icon:e,prefix:t,onClick:n})=>{let r=`${t}:${e.name}`,i=(0,c.useCallback)(()=>{n?.(e)},[n,e]);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
        .icon-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
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
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          border-radius: 4px;
        }
        .icon-card__code {
          font-size: 12px;
          font-family: monospace;
          color: #374151;
          text-align: center;
          word-break: break-all;
          line-height: 1.4;
        }
      `}),(0,s.jsxs)(`div`,{className:`icon-card`,onClick:i,role:`button`,tabIndex:0,onKeyDown:e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),i())},children:[(0,s.jsx)(`div`,{className:`icon-card__icon`,children:(0,s.jsx)(`esds-svg`,{name:r,mode:`bg`,style:{width:`48px`,height:`48px`}})}),(0,s.jsx)(`code`,{className:`icon-card__code`,children:r})]})]})},j=A;A.__docgenInfo={description:``,methods:[],displayName:`IconCard`,props:{icon:{required:!0,tsType:{name:`IconItem`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``},onClick:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(icon: IconItem) => void`,signature:{arguments:[{type:{name:`IconItem`},name:`icon`}],return:{name:`void`}}},description:``}}};var M=i(),N=1500,P=({value:e,label:t,children:n,className:r=``,size:i=`sm`})=>{let[a,o]=(0,c.useState)(`idle`),[l,u]=(0,c.useState)(!1),[d,f]=(0,c.useState)({x:0,y:0}),p=(0,c.useRef)(null),m=(0,c.useRef)(null);(0,c.useEffect)(()=>()=>{p.current&&clearTimeout(p.current)},[]);let h=(0,c.useCallback)(async t=>{let n=t.currentTarget.getBoundingClientRect();f({x:n.left+n.width/2,y:n.top-8});try{await navigator.clipboard.writeText(e),o(`copied`)}catch{o(`failed`)}p.current&&clearTimeout(p.current),p.current=setTimeout(()=>{o(`idle`)},N)},[e]),g=(0,c.useCallback)(e=>{let t=e.currentTarget.getBoundingClientRect();f({x:t.left+t.width/2,y:t.top-8}),u(!0)},[]),_=(0,c.useCallback)(()=>{u(!1)},[]),v=()=>{if(a!==`idle`)switch(a){case`copied`:return`Copied!`;case`failed`:return`Failed to copy`}return l?`Copy to clipboard`:``},y={sm:`14px`,md:`16px`,lg:`18px`};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsxs)(`span`,{className:`copyable-text ${r}`,children:[t&&(0,s.jsxs)(`span`,{className:`copyable-text__label`,children:[t,`:`]}),(0,s.jsx)(`button`,{ref:m,className:`copyable-text__button`,onClick:h,onMouseEnter:g,onMouseLeave:_,type:`button`,"aria-label":`Copy ${e} to clipboard`,style:{"--button-font-size":y[i]},children:n??e})]}),(0,s.jsx)(`span`,{className:`copyable-text__tooltip ${a!==`idle`||l?`copyable-text__tooltip--visible`:``}`,style:{"--tooltip-x":`${d.x}px`,"--tooltip-y":`${d.y}px`},role:`status`,"aria-live":`polite`,children:v()})]})},F=P;P.__docgenInfo={description:``,methods:[],displayName:`CopyableText`,props:{value:{required:!0,tsType:{name:`string`},description:`Value to copy to clipboard`},label:{required:!1,tsType:{name:`string`},description:`Optional label text to display before the value`},children:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:`Optional children to render instead of value`},className:{required:!1,tsType:{name:`string`},description:`Optional additional className`,defaultValue:{value:`''`,computed:!1}},size:{required:!1,tsType:{name:`union`,raw:`'sm' | 'md' | 'lg'`,elements:[{name:`literal`,value:`'sm'`},{name:`literal`,value:`'md'`},{name:`literal`,value:`'lg'`}]},description:`Optional size variant`,defaultValue:{value:`'sm'`,computed:!1}}}};var I=({metadata:e})=>{let t=e.tags.map(e=>(0,s.jsx)(`span`,{className:`metadata-pill`,children:e},e));return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsxs)(`div`,{className:`metadata-section`,children:[(0,s.jsx)(`div`,{className:`metadata-label`,children:`Tags:`}),(0,s.jsx)(`div`,{className:`metadata-value`,children:t.length>0?t:`No tags`})]}),(0,s.jsxs)(`div`,{className:`metadata-section`,children:[(0,s.jsx)(`div`,{className:`metadata-label`,children:`Collection:`}),(0,s.jsx)(`div`,{className:`metadata-value`,children:e.collection})]}),(0,s.jsxs)(`div`,{className:`metadata-section`,children:[(0,s.jsx)(`div`,{className:`metadata-label`,children:`License:`}),(0,s.jsx)(`div`,{className:`metadata-value`,children:e.license})]})]})},L=I;I.__docgenInfo={description:``,methods:[],displayName:`IconMetadataDisplay`,props:{metadata:{required:!0,tsType:{name:`IconMetadata`},description:`Metadata to display`}}};function R({icon:e,isOpen:t,prefix:n,onClose:r}){let[i,a]=(0,c.useState)(null);if((0,c.useEffect)(()=>{t&&e?l.listIcons({prefix:n,info:!0}).then(({icons:t,info:r})=>{let i=t.find(t=>t.name===e.name);a(i?{name:i.name,iconId:`${n}:${i.name}`,tags:Array.from(i.categories||new Set),collection:r?.name??n,license:r?.license?.title??`Unknown License`}:null)}).catch(()=>{a(null)}):a(null)},[t,e,n]),(0,c.useEffect)(()=>(t?document.body.style.overflow=`hidden`:document.body.style.overflow=``,()=>{document.body.style.overflow=``}),[t]),(0,c.useEffect)(()=>{let e=e=>{e.key===`Escape`&&r()};return t&&document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[t,r]),!t||!e)return null;let o=()=>{r()},u=e=>{e.stopPropagation()},d=`${n}:${e.name}`,f=`<esds-svg name="${d}" />`,p=document.getElementById(`modal-root`)||document.body;return(0,M.createPortal)((0,s.jsx)(`div`,{"data-testid":`modal-backdrop`,onClick:o,style:{position:`fixed`,top:0,left:0,right:0,bottom:0,backgroundColor:`rgba(0, 0, 0, 0.5)`,display:`flex`,justifyContent:`center`,alignItems:`center`,zIndex:1e3},children:(0,s.jsxs)(`div`,{onClick:u,role:`dialog`,"aria-modal":`true`,"aria-label":`Icon details`,style:{fontFamily:`inherit`,backgroundColor:`white`,borderRadius:`8px`,padding:`24px`,maxWidth:`600px`,width:`90%`,maxHeight:`90vh`,overflow:`auto`,position:`relative`},children:[(0,s.jsx)(`button`,{onClick:r,"aria-label":`Close dialog`,style:{position:`absolute`,top:`10px`,right:`10px`,background:`none`,border:`none`,cursor:`pointer`,fontSize:`24px`},children:`×`}),(0,s.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,marginBottom:`var(--esds-spacing-2xl)`},children:(0,s.jsx)(`esds-svg`,{style:{fontSize:`var(--esds-icon-size-4xl)`},name:d})}),(0,s.jsx)(`div`,{style:{marginBottom:`var(--esds-spacing-2xl)`},children:(0,s.jsx)(F,{value:d,label:``,size:`lg`})}),(0,s.jsx)(`div`,{style:{marginBottom:`var(--esds-spacing-2xl)`},children:(0,s.jsx)(F,{value:f,label:`Component`})}),i&&(0,s.jsx)(L,{metadata:i})]})}),p)}var z=({icons:e,prefix:t})=>{let[n,r]=(0,c.useState)(null),[i,a]=(0,c.useState)(!1),o=(0,c.useCallback)(e=>{r(e),a(!0)},[]),l=(0,c.useCallback)(()=>{a(!1)},[]);return e.length===0?null:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsx)(`div`,{className:`icon-grid`,children:e.map(e=>(0,s.jsx)(j,{icon:e,prefix:t,onClick:o},`${t}:${e.name}`))}),(0,s.jsx)(R,{icon:n,isOpen:i,prefix:t,onClose:l})]})},B=z;z.__docgenInfo={description:``,methods:[],displayName:`IconGrid`,props:{icons:{required:!0,tsType:{name:`unknown`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``}}};var V=({value:e,onChange:t,placeholder:n=`Search icons by name...`,disabled:r=!1,onClear:i})=>{let a=e=>{t(e.target.value)},o=()=>{i()},c=e.length>0;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsxs)(`div`,{className:`icon-search-bar`,children:[(0,s.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,className:`icon-search-bar__icon`,children:[(0,s.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,s.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,s.jsx)(`input`,{type:`text`,value:e,onChange:a,placeholder:n,disabled:r,className:`icon-search-bar__input`}),c&&!r&&(0,s.jsx)(`button`,{type:`button`,onClick:o,className:`icon-search-bar__clear`,"aria-label":`Clear search`,children:(0,s.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,s.jsx)(`line`,{x1:`18`,y1:`6`,x2:`6`,y2:`18`}),(0,s.jsx)(`line`,{x1:`6`,y1:`6`,x2:`18`,y2:`18`})]})})]})]})},H=V;V.__docgenInfo={description:``,methods:[],displayName:`IconSearchBar`,props:{value:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: string) => void`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`void`}}},description:``},placeholder:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Search icons by name...'`,computed:!1}},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},onClear:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var U=()=>{let{collections:e,icons:t,totalCount:n,filteredCount:r,selectedCollection:i,searchQuery:a,isLoading:o,isLoadingCollections:c,error:l,setCollection:u,setSearchQuery:d,retry:f,clearSearch:p}=x(),m=e=>{u(e)},h=e=>{d(e)},g=()=>{p()},_=()=>{f()},v=()=>c?(0,s.jsxs)(`div`,{className:`icon-gallery__loading`,children:[(0,s.jsx)(k,{}),(0,s.jsx)(`p`,{className:`icon-gallery__loading-text`,children:`Loading collections...`})]}):o?(0,s.jsx)(k,{}):l===null?t.length===0?(0,s.jsx)(T,{searchQuery:a,onClearSearch:a.length>0?g:void 0}):(0,s.jsx)(B,{icons:t,prefix:i}):(0,s.jsx)(D,{error:l,onRetry:_}),y=o||l!==null;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
        .icon-gallery {
          padding: 1.5rem;
        }
        .icon-gallery__header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
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
          }
        }
        .icon-gallery__search {
          flex: 1 1 auto;
        }
        .icon-gallery__filter {
          flex: 0 0 auto;
          min-width: 200px;
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
      `}),(0,s.jsxs)(`div`,{className:`icon-gallery`,children:[(0,s.jsxs)(`div`,{className:`icon-gallery__header`,children:[(0,s.jsxs)(`div`,{className:`icon-gallery__title-row`,children:[(0,s.jsx)(`h1`,{className:`icon-gallery__title`,children:`Icon Gallery`}),(0,s.jsxs)(`span`,{className:`icon-gallery__count`,children:[`Showing `,r,` of `,n,` icons`]})]}),(0,s.jsx)(`div`,{className:`icon-gallery__controls-wrapper`,children:(0,s.jsxs)(`div`,{className:`icon-gallery__controls`,children:[(0,s.jsx)(`div`,{className:`icon-gallery__search`,children:(0,s.jsx)(H,{value:a,onChange:h,disabled:y,onClear:g})}),(0,s.jsx)(`div`,{className:`icon-gallery__filter`,children:(0,s.jsx)(C,{collections:e,selected:i,onChange:m,disabled:y})})]})})]}),(0,s.jsx)(`div`,{children:v()})]})]})},W=U;U.__docgenInfo={description:``,methods:[],displayName:`IconGallery`};var G={message:`An unexpected error occurred in the icon gallery`,code:`BOUNDARY_ERROR`},K=class extends c.Component{state={hasError:!1,error:null};static getDerivedStateFromError(e){return{hasError:!0,error:{message:e.message||G.message,code:e.name===`AbortError`?`ABORTED`:G.code}}}componentDidCatch(e,t){console.error(`IconGalleryErrorBoundary caught an error:`,e,t)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
          `}),(0,s.jsxs)(`div`,{className:`icon-gallery-error-boundary`,children:[(0,s.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error-boundary__icon`,children:[(0,s.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,s.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,s.jsx)(`h3`,{className:`icon-gallery-error-boundary__title`,children:`Something went wrong`}),(0,s.jsx)(`p`,{className:`icon-gallery-error-boundary__message`,children:this.state.error?.message||G.message}),(0,s.jsx)(`button`,{onClick:()=>this.setState({hasError:!1,error:null}),className:`icon-gallery-error-boundary__button`,children:`Try Again`})]})]}):this.props.children}};K.__docgenInfo={description:``,methods:[],displayName:`IconGalleryErrorBoundary`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},fallback:{required:!1,tsType:{name:`ReactNode`},description:``}}};function q(e){return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r,{title:`Icons/Icon Gallery`}),`
`,(0,s.jsx)(K,{children:(0,s.jsx)(W,{})})]})}function J(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(q,{...e})}):q(e)}export{J as default};