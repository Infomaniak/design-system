import{Kt as e,Qt as t,a as n,en as r,qt as i,s as a,yt as o}from"./iframe-CBsc1q0z.js";var s=r(o(),1),c=r(t(),1);const l=new e({resources:[`https://iconify.preprod.dev.infomaniak.ch/`]}),u={ABORTED:`ABORTED`,API_ERROR:`API_ERROR`,NETWORK_ERROR:`NETWORK_ERROR`,TIMEOUT:`TIMEOUT`,UNKNOWN_ERROR:`UNKNOWN_ERROR`,BOUNDARY_ERROR:`BOUNDARY_ERROR`};var d=300;function f(e){return{name:e.name,categories:e.categories}}function p(e){return e instanceof Error?{message:e.message,code:e.name===`AbortError`?u.ABORTED:u.API_ERROR}:{message:`An unknown error occurred`,code:u.UNKNOWN_ERROR}}function m(e=l){let t=(0,c.useRef)(null),n=(0,c.useRef)(new Map),r=(0,c.useRef)(null),[a,o]=(0,c.useState)([]),[s,u]=(0,c.useState)(``),[m,h]=(0,c.useState)([]),[g,_]=(0,c.useState)(``),[v,y]=(0,c.useState)(``),[b,x]=(0,c.useState)(!1),[S,C]=(0,c.useState)(!1),[w,T]=(0,c.useState)(null),E=b||S,D=(0,c.useCallback)(()=>{t.current!==null&&(t.current.abort(),t.current=null)},[]),O=(0,c.useCallback)(e=>{_(e),r.current!==null&&clearTimeout(r.current),r.current=setTimeout(()=>{y(e.trim().toLowerCase())},d)},[]),k=(0,c.useCallback)(async t=>{try{x(!0),T(null);let n=await e.listIconSets({signal:t}),r=Object.keys(n).sort();o(r),r.length>0&&u(r[0])}catch(e){if(t.aborted)return;T(p(e))}finally{x(!1)}},[e]),A=(0,c.useCallback)(async(r,a)=>{try{C(!0),T(null);let t=n.current.get(r);if(t!==void 0){h(t);return}let o=i(await e.listIconsCached({prefix:r,signal:a})).map(f);n.current.set(r,o),h(o)}catch(e){if(a.aborted)return;T(p(e))}finally{C(!1),t.current?.signal===a&&(t.current=null)}},[e]);(0,c.useEffect)(()=>{let e=new AbortController;return k(e.signal),()=>{e.abort()}},[k]),(0,c.useEffect)(()=>{if(s===``)return;D();let e=new AbortController;return t.current=e,A(s,e.signal),()=>{e.abort()}},[s,A,D]);let j=(0,c.useMemo)(()=>v===``?m:m.filter(e=>e.name.toLowerCase().includes(v)),[m,v]),M=(0,c.useCallback)(e=>{u(e),_(``),y(``)},[]),N=(0,c.useCallback)(()=>{_(``),y(``),r.current!==null&&(clearTimeout(r.current),r.current=null)},[]),P=(0,c.useCallback)(()=>{if(a.length===0){D();let e=new AbortController;t.current=e,k(e.signal)}else if(s!==``){n.current.delete(s),D();let e=new AbortController;t.current=e,A(s,e.signal)}},[a.length,s,k,A,D]);return(0,c.useEffect)(()=>()=>{D(),r.current!==null&&clearTimeout(r.current)},[D]),{collections:a,icons:j,totalCount:m.length,filteredCount:j.length,selectedCollection:s,searchQuery:g,isLoading:E,isLoadingCollections:b,isLoadingIcons:S,error:w,setCollection:M,setSearchQuery:O,retry:P,clearSearch:N}}var h=`search`,g=`collection`,_=100;function v(){try{return typeof window>`u`||!window.parent?null:new URL(window.parent.location.href)}catch{return null}}function y(e){let t=v();return t?t.searchParams.get(e):null}function b(e){let t=v();if(!t)return;Object.entries(e).forEach(([e,n])=>{n===null||n===``?t.searchParams.delete(e):t.searchParams.set(e,n)});let n=t.search,r=t.toString().split(`?`)[0]+n.replace(/%2F/g,`/`);window.parent.history.replaceState(null,``,r)}function x(){let e=m(l),{collections:t,selectedCollection:n,searchQuery:r,setCollection:i,setSearchQuery:a}=e,[o,s]=(0,c.useState)(!1),u=(0,c.useRef)(null),d=(0,c.useRef)({search:``,collection:``});(0,c.useEffect)(()=>{if(o||t.length===0)return;let e=y(g),n=y(h);e&&t.includes(e)&&i(e),n&&a(n),s(!0)},[t,o,i,a]);let f=(0,c.useCallback)((e,t)=>{d.current.search===e&&d.current.collection===t||(d.current={search:e,collection:t},b({[h]:e||null,[g]:t||null}))},[]);return(0,c.useEffect)(()=>{if(o)return u.current&&clearTimeout(u.current),u.current=setTimeout(()=>{f(r,n)},_),()=>{u.current&&clearTimeout(u.current)}},[r,n,o,f]),(0,c.useEffect)(()=>()=>{u.current&&clearTimeout(u.current)},[]),e}var S=({collections:e,selected:t,onChange:n,disabled:r=!1})=>{let i=e=>{n(e.target.value)},a=c.useMemo(()=>[...e].sort((e,t)=>e.localeCompare(t)),[e]);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsx)(`div`,{className:`icon-gallery-skeleton`,children:Array.from({length:e}).map((e,t)=>(0,s.jsxs)(`div`,{className:`icon-gallery-skeleton__item`,children:[(0,s.jsx)(`div`,{className:`icon-gallery-skeleton__icon`}),(0,s.jsx)(`div`,{className:`icon-gallery-skeleton__text`})]},t))})]}),k=O;O.__docgenInfo={description:``,methods:[],displayName:`IconGallerySkeleton`,props:{count:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`20`,computed:!1}}}};var A=({icon:e,prefix:t})=>{let n=`${t}:${e.name}`;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsxs)(`div`,{className:`icon-card`,children:[(0,s.jsx)(`div`,{className:`icon-card__icon`,children:(0,s.jsx)(`esds-icon`,{name:n,mode:`bg`,style:{width:`48px`,height:`48px`}})}),(0,s.jsx)(`code`,{className:`icon-card__code`,children:n})]})]})},j=A;A.__docgenInfo={description:``,methods:[],displayName:`IconCard`,props:{icon:{required:!0,tsType:{name:`IconItem`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``}}};var M=({icons:e,prefix:t})=>e.length===0?null:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsx)(`div`,{className:`icon-grid`,children:e.map(e=>(0,s.jsx)(j,{icon:e,prefix:t},`${t}:${e.name}`))})]}),N=M;M.__docgenInfo={description:``,methods:[],displayName:`IconGrid`,props:{icons:{required:!0,tsType:{name:`unknown`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``}}};var P=({value:e,onChange:t,placeholder:n=`Search icons by name...`,disabled:r=!1,onClear:i})=>{let a=e=>{t(e.target.value)},o=()=>{i()},c=e.length>0;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsxs)(`div`,{className:`icon-search-bar`,children:[(0,s.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,className:`icon-search-bar__icon`,children:[(0,s.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,s.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,s.jsx)(`input`,{type:`text`,value:e,onChange:a,placeholder:n,disabled:r,className:`icon-search-bar__input`}),c&&!r&&(0,s.jsx)(`button`,{type:`button`,onClick:o,className:`icon-search-bar__clear`,"aria-label":`Clear search`,children:(0,s.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,s.jsx)(`line`,{x1:`18`,y1:`6`,x2:`6`,y2:`18`}),(0,s.jsx)(`line`,{x1:`6`,y1:`6`,x2:`18`,y2:`18`})]})})]})]})},F=P;P.__docgenInfo={description:``,methods:[],displayName:`IconSearchBar`,props:{value:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: string) => void`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`void`}}},description:``},placeholder:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Search icons by name...'`,computed:!1}},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},onClear:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var I=()=>{let{collections:e,icons:t,totalCount:n,filteredCount:r,selectedCollection:i,searchQuery:a,isLoading:o,isLoadingCollections:c,error:l,setCollection:u,setSearchQuery:d,retry:f,clearSearch:p}=x(),m=e=>{u(e)},h=e=>{d(e)},g=()=>{p()},_=()=>{f()},v=()=>c?(0,s.jsxs)(`div`,{className:`icon-gallery__loading`,children:[(0,s.jsx)(k,{}),(0,s.jsx)(`p`,{className:`icon-gallery__loading-text`,children:`Loading collections...`})]}):o?(0,s.jsx)(k,{}):l===null?t.length===0?(0,s.jsx)(T,{searchQuery:a,onClearSearch:a.length>0?g:void 0}):(0,s.jsx)(N,{icons:t,prefix:i}):(0,s.jsx)(D,{error:l,onRetry:_}),y=o||l!==null;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
      `}),(0,s.jsxs)(`div`,{className:`icon-gallery`,children:[(0,s.jsxs)(`div`,{className:`icon-gallery__header`,children:[(0,s.jsxs)(`div`,{className:`icon-gallery__title-row`,children:[(0,s.jsx)(`h1`,{className:`icon-gallery__title`,children:`Icon Gallery`}),(0,s.jsxs)(`span`,{className:`icon-gallery__count`,children:[`Showing `,r,` of `,n,` icons`]})]}),(0,s.jsx)(`div`,{className:`icon-gallery__controls-wrapper`,children:(0,s.jsxs)(`div`,{className:`icon-gallery__controls`,children:[(0,s.jsx)(`div`,{className:`icon-gallery__search`,children:(0,s.jsx)(F,{value:a,onChange:h,disabled:y,onClear:g})}),(0,s.jsx)(`div`,{className:`icon-gallery__filter`,children:(0,s.jsx)(C,{collections:e,selected:i,onChange:m,disabled:y})})]})})]}),(0,s.jsx)(`div`,{children:v()})]})]})},L=I;I.__docgenInfo={description:``,methods:[],displayName:`IconGallery`};var R={message:`An unexpected error occurred in the icon gallery`,code:`BOUNDARY_ERROR`},z=class extends c.Component{state={hasError:!1,error:null};static getDerivedStateFromError(e){return{hasError:!0,error:{message:e.message||R.message,code:e.name===`AbortError`?`ABORTED`:R.code}}}componentDidCatch(e,t){console.error(`IconGalleryErrorBoundary caught an error:`,e,t)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
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
          `}),(0,s.jsxs)(`div`,{className:`icon-gallery-error-boundary`,children:[(0,s.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error-boundary__icon`,children:[(0,s.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,s.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,s.jsx)(`h3`,{className:`icon-gallery-error-boundary__title`,children:`Something went wrong`}),(0,s.jsx)(`p`,{className:`icon-gallery-error-boundary__message`,children:this.state.error?.message||R.message}),(0,s.jsx)(`button`,{onClick:()=>this.setState({hasError:!1,error:null}),className:`icon-gallery-error-boundary__button`,children:`Try Again`})]})]}):this.props.children}};z.__docgenInfo={description:``,methods:[],displayName:`IconGalleryErrorBoundary`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},fallback:{required:!1,tsType:{name:`ReactNode`},description:``}}};function B(e){return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n,{title:`Icons/Icon Gallery`}),`
`,(0,s.jsx)(z,{children:(0,s.jsx)(L,{})})]})}function V(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(B,{...e})}):B(e)}export{V as default};