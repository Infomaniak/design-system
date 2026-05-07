import{Kt as e,Qt as t,a as n,bt as r,en as i,qt as a,s as o,yt as s}from"./iframe-ddzad5gD.js";var c=i(s(),1),l=i(t(),1);const u=new e({resources:[`https://iconify.preprod.dev.infomaniak.ch/`]}),d={ABORTED:`ABORTED`,API_ERROR:`API_ERROR`,NETWORK_ERROR:`NETWORK_ERROR`,TIMEOUT:`TIMEOUT`,UNKNOWN_ERROR:`UNKNOWN_ERROR`,BOUNDARY_ERROR:`BOUNDARY_ERROR`};var f=300;function p(e){return{name:e.name,categories:e.categories}}function m(e){return e instanceof Error?{message:e.message,code:e.name===`AbortError`?d.ABORTED:d.API_ERROR}:{message:`An unknown error occurred`,code:d.UNKNOWN_ERROR}}function h(e=u){let t=(0,l.useRef)(null),n=(0,l.useRef)(null),[r,i]=(0,l.useState)([]),[a,o]=(0,l.useState)(``),[s,c]=(0,l.useState)([]),[d,h]=(0,l.useState)(0),[g,_]=(0,l.useState)(``),[v,y]=(0,l.useState)(``),[b,x]=(0,l.useState)(!1),[S,C]=(0,l.useState)(!1),[w,T]=(0,l.useState)(null),E=b||S,D=(0,l.useCallback)(()=>{t.current!==null&&(t.current.abort(),t.current=null)},[]),O=(0,l.useCallback)(e=>{_(e),n.current!==null&&clearTimeout(n.current),n.current=setTimeout(()=>{y(e.trim().toLowerCase())},f)},[]),k=(0,l.useCallback)(async t=>{try{x(!0),T(null);let n=await e.listIconSets({signal:t}),r=Object.keys(n).sort();i(r),r.length>0&&o(r[0])}catch(e){if(t.aborted)return;T(m(e))}finally{x(!1)}},[e]),A=(0,l.useCallback)(async(t,n)=>{try{h((await e.search({prefix:t,query:``,signal:n})).length)}catch{}},[e]),j=(0,l.useCallback)(async(n,r,i)=>{try{C(!0),T(null),c((await e.search({prefix:n,query:r,signal:i})).map(p))}catch(e){if(i.aborted)return;T(m(e))}finally{C(!1),t.current?.signal===i&&(t.current=null)}},[e]);(0,l.useEffect)(()=>{let e=new AbortController;return k(e.signal),()=>{e.abort()}},[k]),(0,l.useEffect)(()=>{if(a===``)return;D();let e=new AbortController;return t.current=e,A(a,e.signal),j(a,v,e.signal),()=>{e.abort()}},[a,v,A,j,D]);let M=(0,l.useCallback)(e=>{o(e),_(``),y(``)},[]),N=(0,l.useCallback)(()=>{_(``),y(``),n.current!==null&&(clearTimeout(n.current),n.current=null)},[]),P=(0,l.useCallback)(()=>{if(r.length===0){D();let e=new AbortController;t.current=e,k(e.signal)}else if(a!==``){D();let e=new AbortController;t.current=e,A(a,e.signal),j(a,v,e.signal)}},[r.length,a,v,k,A,j,D]);return(0,l.useEffect)(()=>()=>{D(),n.current!==null&&clearTimeout(n.current)},[D]),{collections:r,icons:s,totalCount:d,filteredCount:s.length,selectedCollection:a,searchQuery:g,isLoading:E,isLoadingCollections:b,isLoadingIcons:S,error:w,setCollection:M,setSearchQuery:O,retry:P,clearSearch:N}}var g=`search`,_=`collection`,v=100;function y(){try{return typeof window>`u`||!window.parent?null:new URL(window.parent.location.href)}catch{return null}}function b(e){let t=y();return t?t.searchParams.get(e):null}function x(e){let t=y();if(!t)return;Object.entries(e).forEach(([e,n])=>{n===null||n===``?t.searchParams.delete(e):t.searchParams.set(e,n)});let n=t.search,r=t.toString().split(`?`)[0]+n.replace(/%2F/g,`/`);window.parent.history.replaceState(null,``,r)}function S(){let e=h(u),{collections:t,selectedCollection:n,searchQuery:r,setCollection:i,setSearchQuery:a}=e,[o,s]=(0,l.useState)(!1),c=(0,l.useRef)(null),d=(0,l.useRef)({search:``,collection:``});(0,l.useEffect)(()=>{if(o||t.length===0)return;let e=b(_),n=b(g);e&&t.includes(e)&&i(e),n&&a(n),s(!0)},[t,o,i,a]);let f=(0,l.useCallback)((e,t)=>{d.current.search===e&&d.current.collection===t||(d.current={search:e,collection:t},x({[g]:e||null,[_]:t||null}))},[]);return(0,l.useEffect)(()=>{if(o)return c.current&&clearTimeout(c.current),c.current=setTimeout(()=>{f(r,n)},v),()=>{c.current&&clearTimeout(c.current)}},[r,n,o,f]),(0,l.useEffect)(()=>()=>{c.current&&clearTimeout(c.current)},[]),e}var C=({collections:e,selected:t,onChange:n,disabled:r=!1})=>{let i=e=>{n(e.target.value)},a=l.useMemo(()=>[...e].sort((e,t)=>e.localeCompare(t)),[e]);return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
      `}),(0,c.jsx)(`select`,{id:`collection-select`,"aria-label":`Icon collection`,value:t,onChange:i,disabled:r,className:`icon-collection-filter`,children:a.map(e=>(0,c.jsx)(`option`,{value:e,children:e},e))})]})},w=C;C.__docgenInfo={description:``,methods:[],displayName:`IconCollectionFilter`,props:{collections:{required:!0,tsType:{name:`unknown`},description:``},selected:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(collection: string) => void`,signature:{arguments:[{type:{name:`string`},name:`collection`}],return:{name:`void`}}},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}};var T=({searchQuery:e=``,onClearSearch:t})=>{let n=e.length>0;return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
      `}),(0,c.jsxs)(`div`,{className:`icon-gallery-empty`,children:[(0,c.jsxs)(`svg`,{width:`64`,height:`64`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,className:`icon-gallery-empty__icon`,children:[(0,c.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,c.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,c.jsx)(`h3`,{className:`icon-gallery-empty__title`,children:n?`No icons found for "${e}"`:`No icons in this collection`}),(0,c.jsx)(`p`,{className:`icon-gallery-empty__text${n?` icon-gallery-empty__text--with-query`:``}`,children:n?`Try adjusting your search terms or browse all icons`:`This collection appears to be empty. Try selecting a different collection.`}),n&&t&&(0,c.jsx)(`button`,{onClick:t,className:`icon-gallery-empty__button`,children:`Clear search`})]})]})},E=T;T.__docgenInfo={description:``,methods:[],displayName:`IconGalleryEmpty`,props:{searchQuery:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`''`,computed:!1}},onClearSearch:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var D=({error:e,onRetry:t})=>(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
      `}),(0,c.jsxs)(`div`,{className:`icon-gallery-error`,children:[(0,c.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error__icon`,children:[(0,c.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,c.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,c.jsx)(`h3`,{className:`icon-gallery-error__title`,children:`Something went wrong`}),(0,c.jsx)(`p`,{className:`icon-gallery-error__message`,children:e.message}),(0,c.jsx)(`button`,{onClick:t,className:`icon-gallery-error__button`,children:`Retry`})]})]}),O=D;D.__docgenInfo={description:``,methods:[],displayName:`IconGalleryError`,props:{error:{required:!0,tsType:{name:`IconGalleryErrorType`},description:``},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var k=({count:e=20})=>(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
      `}),(0,c.jsx)(`div`,{className:`icon-gallery-skeleton`,children:Array.from({length:e}).map((e,t)=>(0,c.jsxs)(`div`,{className:`icon-gallery-skeleton__item`,children:[(0,c.jsx)(`div`,{className:`icon-gallery-skeleton__icon`}),(0,c.jsx)(`div`,{className:`icon-gallery-skeleton__text`})]},t))})]}),A=k;k.__docgenInfo={description:``,methods:[],displayName:`IconGallerySkeleton`,props:{count:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`20`,computed:!1}}}};var j=({icon:e,prefix:t,onClick:n})=>{let r=`${t}:${e.name}`,i=(0,l.useCallback)(()=>{n?.(e)},[n,e]);return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
      `}),(0,c.jsxs)(`div`,{className:`icon-card`,onClick:i,role:`button`,tabIndex:0,onKeyDown:e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),i())},children:[(0,c.jsx)(`div`,{className:`icon-card__icon`,children:(0,c.jsx)(`esds-icon`,{name:r,mode:`bg`,style:{width:`48px`,height:`48px`}})}),(0,c.jsx)(`code`,{className:`icon-card__code`,children:r})]})]})},M=j;j.__docgenInfo={description:``,methods:[],displayName:`IconCard`,props:{icon:{required:!0,tsType:{name:`IconItem`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``},onClick:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(icon: IconItem) => void`,signature:{arguments:[{type:{name:`IconItem`},name:`icon`}],return:{name:`void`}}},description:``}}};var N=r(),P=1500,F=({value:e,label:t,children:n,className:r=``,size:i=`sm`})=>{let[a,o]=(0,l.useState)(`idle`),[s,u]=(0,l.useState)(!1),[d,f]=(0,l.useState)({x:0,y:0}),p=(0,l.useRef)(null),m=(0,l.useRef)(null);(0,l.useEffect)(()=>()=>{p.current&&clearTimeout(p.current)},[]);let h=(0,l.useCallback)(async t=>{let n=t.currentTarget.getBoundingClientRect();f({x:n.left+n.width/2,y:n.top-8});try{await navigator.clipboard.writeText(e),o(`copied`)}catch{o(`failed`)}p.current&&clearTimeout(p.current),p.current=setTimeout(()=>{o(`idle`)},P)},[e]),g=(0,l.useCallback)(e=>{let t=e.currentTarget.getBoundingClientRect();f({x:t.left+t.width/2,y:t.top-8}),u(!0)},[]),_=(0,l.useCallback)(()=>{u(!1)},[]),v=()=>{if(a!==`idle`)switch(a){case`copied`:return`Copied!`;case`failed`:return`Failed to copy`}return s?`Copy to clipboard`:``},y={sm:`14px`,md:`16px`,lg:`18px`};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
      `}),(0,c.jsxs)(`span`,{className:`copyable-text ${r}`,children:[t&&(0,c.jsxs)(`span`,{className:`copyable-text__label`,children:[t,`:`]}),(0,c.jsx)(`button`,{ref:m,className:`copyable-text__button`,onClick:h,onMouseEnter:g,onMouseLeave:_,type:`button`,"aria-label":`Copy ${e} to clipboard`,style:{"--button-font-size":y[i]},children:n??e})]}),(0,c.jsx)(`span`,{className:`copyable-text__tooltip ${a!==`idle`||s?`copyable-text__tooltip--visible`:``}`,style:{"--tooltip-x":`${d.x}px`,"--tooltip-y":`${d.y}px`},role:`status`,"aria-live":`polite`,children:v()})]})},I=F;F.__docgenInfo={description:``,methods:[],displayName:`CopyableText`,props:{value:{required:!0,tsType:{name:`string`},description:`Value to copy to clipboard`},label:{required:!1,tsType:{name:`string`},description:`Optional label text to display before the value`},children:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:`Optional children to render instead of value`},className:{required:!1,tsType:{name:`string`},description:`Optional additional className`,defaultValue:{value:`''`,computed:!1}},size:{required:!1,tsType:{name:`union`,raw:`'sm' | 'md' | 'lg'`,elements:[{name:`literal`,value:`'sm'`},{name:`literal`,value:`'md'`},{name:`literal`,value:`'lg'`}]},description:`Optional size variant`,defaultValue:{value:`'sm'`,computed:!1}}}};var L=({metadata:e})=>{let t=e.tags.map(e=>(0,c.jsx)(`span`,{className:`metadata-pill`,children:e},e));return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
      `}),(0,c.jsxs)(`div`,{className:`metadata-section`,children:[(0,c.jsx)(`div`,{className:`metadata-label`,children:`Tags:`}),(0,c.jsx)(`div`,{className:`metadata-value`,children:t.length>0?t:`No tags`})]}),(0,c.jsxs)(`div`,{className:`metadata-section`,children:[(0,c.jsx)(`div`,{className:`metadata-label`,children:`Collection:`}),(0,c.jsx)(`div`,{className:`metadata-value`,children:e.collection})]}),(0,c.jsxs)(`div`,{className:`metadata-section`,children:[(0,c.jsx)(`div`,{className:`metadata-label`,children:`License:`}),(0,c.jsx)(`div`,{className:`metadata-value`,children:e.license})]})]})},R=L;L.__docgenInfo={description:``,methods:[],displayName:`IconMetadataDisplay`,props:{metadata:{required:!0,tsType:{name:`IconMetadata`},description:`Metadata to display`}}};function z({icon:e,isOpen:t,prefix:n,onClose:r}){let[i,o]=(0,l.useState)(null);if((0,l.useEffect)(()=>{t&&e?u.listIconsCached({prefix:n,info:!0}).then(t=>{let r=a(t).find(t=>t.name===e.name);o(r?{name:r.name,iconId:`${n}:${r.name}`,tags:Array.from(r.categories||new Set),collection:t.info?.name??n,license:t.info?.license?.title??`Unknown License`}:null)}).catch(()=>{o(null)}):o(null)},[t,e,n]),(0,l.useEffect)(()=>(t?document.body.style.overflow=`hidden`:document.body.style.overflow=``,()=>{document.body.style.overflow=``}),[t]),(0,l.useEffect)(()=>{let e=e=>{e.key===`Escape`&&r()};return t&&document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[t,r]),!t||!e)return null;let s=()=>{r()},d=e=>{e.stopPropagation()},f=`${n}:${e.name}`,p=`<esds-icon name="${f}" />`,m=document.getElementById(`modal-root`)||document.body;return(0,N.createPortal)((0,c.jsx)(`div`,{"data-testid":`modal-backdrop`,onClick:s,style:{position:`fixed`,top:0,left:0,right:0,bottom:0,backgroundColor:`rgba(0, 0, 0, 0.5)`,display:`flex`,justifyContent:`center`,alignItems:`center`,zIndex:1e3},children:(0,c.jsxs)(`div`,{onClick:d,role:`dialog`,"aria-modal":`true`,"aria-label":`Icon details`,style:{fontFamily:`inherit`,backgroundColor:`white`,borderRadius:`8px`,padding:`24px`,maxWidth:`600px`,width:`90%`,maxHeight:`90vh`,overflow:`auto`,position:`relative`},children:[(0,c.jsx)(`button`,{onClick:r,"aria-label":`Close dialog`,style:{position:`absolute`,top:`10px`,right:`10px`,background:`none`,border:`none`,cursor:`pointer`,fontSize:`24px`},children:`×`}),(0,c.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,marginBottom:`var(--esds-spacing-2xl)`},children:(0,c.jsx)(`esds-icon`,{style:{fontSize:`var(--esds-icon-size-4xl)`},name:f})}),(0,c.jsx)(`div`,{style:{marginBottom:`var(--esds-spacing-2xl)`},children:(0,c.jsx)(I,{value:f,label:``,size:`lg`})}),(0,c.jsx)(`div`,{style:{marginBottom:`var(--esds-spacing-2xl)`},children:(0,c.jsx)(I,{value:p,label:`Component`})}),i&&(0,c.jsx)(R,{metadata:i})]})}),m)}var B=({icons:e,prefix:t})=>{let[n,r]=(0,l.useState)(null),[i,a]=(0,l.useState)(!1),o=(0,l.useCallback)(e=>{r(e),a(!0)},[]),s=(0,l.useCallback)(()=>{a(!1)},[]);return e.length===0?null:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
      `}),(0,c.jsx)(`div`,{className:`icon-grid`,children:e.map(e=>(0,c.jsx)(M,{icon:e,prefix:t,onClick:o},`${t}:${e.name}`))}),(0,c.jsx)(z,{icon:n,isOpen:i,prefix:t,onClose:s})]})},V=B;B.__docgenInfo={description:``,methods:[],displayName:`IconGrid`,props:{icons:{required:!0,tsType:{name:`unknown`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``}}};var H=({value:e,onChange:t,placeholder:n=`Search icons by name...`,disabled:r=!1,onClear:i})=>{let a=e=>{t(e.target.value)},o=()=>{i()},s=e.length>0;return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
      `}),(0,c.jsxs)(`div`,{className:`icon-search-bar`,children:[(0,c.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,className:`icon-search-bar__icon`,children:[(0,c.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,c.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,c.jsx)(`input`,{type:`text`,value:e,onChange:a,placeholder:n,disabled:r,className:`icon-search-bar__input`}),s&&!r&&(0,c.jsx)(`button`,{type:`button`,onClick:o,className:`icon-search-bar__clear`,"aria-label":`Clear search`,children:(0,c.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,c.jsx)(`line`,{x1:`18`,y1:`6`,x2:`6`,y2:`18`}),(0,c.jsx)(`line`,{x1:`6`,y1:`6`,x2:`18`,y2:`18`})]})})]})]})},U=H;H.__docgenInfo={description:``,methods:[],displayName:`IconSearchBar`,props:{value:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: string) => void`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`void`}}},description:``},placeholder:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Search icons by name...'`,computed:!1}},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},onClear:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var W=()=>{let{collections:e,icons:t,totalCount:n,filteredCount:r,selectedCollection:i,searchQuery:a,isLoading:o,isLoadingCollections:s,error:l,setCollection:u,setSearchQuery:d,retry:f,clearSearch:p}=S(),m=e=>{u(e)},h=e=>{d(e)},g=()=>{p()},_=()=>{f()},v=()=>s?(0,c.jsxs)(`div`,{className:`icon-gallery__loading`,children:[(0,c.jsx)(A,{}),(0,c.jsx)(`p`,{className:`icon-gallery__loading-text`,children:`Loading collections...`})]}):o?(0,c.jsx)(A,{}):l===null?t.length===0?(0,c.jsx)(E,{searchQuery:a,onClearSearch:a.length>0?g:void 0}):(0,c.jsx)(V,{icons:t,prefix:i}):(0,c.jsx)(O,{error:l,onRetry:_}),y=o||l!==null;return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
      `}),(0,c.jsxs)(`div`,{className:`icon-gallery`,children:[(0,c.jsxs)(`div`,{className:`icon-gallery__header`,children:[(0,c.jsxs)(`div`,{className:`icon-gallery__title-row`,children:[(0,c.jsx)(`h1`,{className:`icon-gallery__title`,children:`Icon Gallery`}),(0,c.jsxs)(`span`,{className:`icon-gallery__count`,children:[`Showing `,r,` of `,n,` icons`]})]}),(0,c.jsx)(`div`,{className:`icon-gallery__controls-wrapper`,children:(0,c.jsxs)(`div`,{className:`icon-gallery__controls`,children:[(0,c.jsx)(`div`,{className:`icon-gallery__search`,children:(0,c.jsx)(U,{value:a,onChange:h,disabled:y,onClear:g})}),(0,c.jsx)(`div`,{className:`icon-gallery__filter`,children:(0,c.jsx)(w,{collections:e,selected:i,onChange:m,disabled:y})})]})})]}),(0,c.jsx)(`div`,{children:v()})]})]})},G=W;W.__docgenInfo={description:``,methods:[],displayName:`IconGallery`};var K={message:`An unexpected error occurred in the icon gallery`,code:`BOUNDARY_ERROR`},q=class extends l.Component{state={hasError:!1,error:null};static getDerivedStateFromError(e){return{hasError:!0,error:{message:e.message||K.message,code:e.name===`AbortError`?`ABORTED`:K.code}}}componentDidCatch(e,t){console.error(`IconGalleryErrorBoundary caught an error:`,e,t)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:`
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
          `}),(0,c.jsxs)(`div`,{className:`icon-gallery-error-boundary`,children:[(0,c.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error-boundary__icon`,children:[(0,c.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,c.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,c.jsx)(`h3`,{className:`icon-gallery-error-boundary__title`,children:`Something went wrong`}),(0,c.jsx)(`p`,{className:`icon-gallery-error-boundary__message`,children:this.state.error?.message||K.message}),(0,c.jsx)(`button`,{onClick:()=>this.setState({hasError:!1,error:null}),className:`icon-gallery-error-boundary__button`,children:`Try Again`})]})]}):this.props.children}};q.__docgenInfo={description:``,methods:[],displayName:`IconGalleryErrorBoundary`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},fallback:{required:!1,tsType:{name:`ReactNode`},description:``}}};function J(e){return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Icons/Icon Gallery`}),`
`,(0,c.jsx)(q,{children:(0,c.jsx)(G,{})})]})}function Y(e={}){let{wrapper:t}={...o(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(J,{...e})}):J(e)}export{Y as default};