import{Ut as e,Yt as t,_t as n}from"./iframe-oAINLjfU.js";var r=t(e(),1);const i={ABORTED:`ABORTED`,API_ERROR:`API_ERROR`,NETWORK_ERROR:`NETWORK_ERROR`,TIMEOUT:`TIMEOUT`,UNKNOWN_ERROR:`UNKNOWN_ERROR`,BOUNDARY_ERROR:`BOUNDARY_ERROR`};var a=`https://iconify.preprod.dev.infomaniak.ch/`,o=1e4,s=class{#e;constructor(e=o){this.#e=e}async fetch({path:e,searchParams:t,signal:n}){let r=e;t!==void 0&&t.toString()!==``&&(r=`${e}?${t.toString()}`);let i=new URL(r,a),o=AbortSignal.timeout(this.#e),s=n?AbortSignal.any([n,o]):o;try{let e=await fetch(i,{signal:s});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}catch(e){throw e instanceof Error?e:Error(`Request failed`,{cause:e})}}async listIconSets({prefixes:e=[],pretty:t=!1,signal:n}={}){let r=new URLSearchParams;return e.length>0&&r.set(`prefixes`,e.join(`,`)),t&&r.set(`pretty`,`1`),this.fetch({path:`/collections`,searchParams:r,signal:n})}async listIcons({prefix:e,signal:t}){let n=new URLSearchParams;return n.set(`prefix`,e),this.fetch({path:`/collection`,searchParams:n,signal:t})}#t=new Map;async listIconsOptimized({prefix:e,signal:t}){t?.throwIfAborted();let n=e,r=this.#t.get(n);return r===void 0&&(r=this.listIcons({prefix:e,signal:t}).then(e=>{let t=new Set,n=new Map;if(e.uncategorized!==void 0)for(let n of e.uncategorized)t.add(n);if(e.categories!==void 0)for(let[r,i]of Object.entries(e.categories))for(let e of i){t.add(e);let i=n.get(e);i===void 0&&(i=new Set,n.set(e,i)),i.add(r)}return Array.from(t,e=>({name:e,categories:n.get(e)??new Set}))}).catch(e=>{throw this.#t.delete(n),e}),this.#t.set(n,r)),r.finally(()=>{})}},c=300;function l(e){return{name:e.name,categories:e.categories}}function u(e){return e instanceof Error?{message:e.message,code:e.name===`AbortError`?i.ABORTED:i.API_ERROR}:{message:`An unknown error occurred`,code:i.UNKNOWN_ERROR}}function d(){let e=(0,r.useMemo)(()=>new s,[]),t=(0,r.useRef)(null),n=(0,r.useRef)(new Map),i=(0,r.useRef)(null),[a,o]=(0,r.useState)([]),[d,f]=(0,r.useState)(``),[p,m]=(0,r.useState)([]),[h,g]=(0,r.useState)(``),[_,v]=(0,r.useState)(``),[y,b]=(0,r.useState)(!1),[x,S]=(0,r.useState)(!1),[C,w]=(0,r.useState)(null),T=y||x,E=(0,r.useCallback)(()=>{t.current!==null&&(t.current.abort(),t.current=null)},[]),D=(0,r.useCallback)(e=>{g(e),i.current!==null&&clearTimeout(i.current),i.current=setTimeout(()=>{v(e.trim().toLowerCase())},c)},[]),O=(0,r.useCallback)(async t=>{try{b(!0),w(null);let n=await e.listIconSets({signal:t}),r=Object.keys(n).sort();o(r),r.length>0&&f(r[0])}catch(e){if(t.aborted)return;w(u(e))}finally{b(!1)}},[e]),k=(0,r.useCallback)(async(r,i)=>{try{S(!0),w(null);let t=n.current.get(r);if(t!==void 0){m(t);return}let a=(await e.listIconsOptimized({prefix:r,signal:i})).map(l);n.current.set(r,a),m(a)}catch(e){if(i.aborted)return;w(u(e))}finally{S(!1),t.current?.signal===i&&(t.current=null)}},[e]);(0,r.useEffect)(()=>{let e=new AbortController;return O(e.signal),()=>{e.abort()}},[O]),(0,r.useEffect)(()=>{if(d===``)return;E();let e=new AbortController;return t.current=e,k(d,e.signal),()=>{e.abort()}},[d,k,E]);let A=(0,r.useMemo)(()=>_===``?p:p.filter(e=>e.name.toLowerCase().includes(_)),[p,_]),j=(0,r.useCallback)(e=>{f(e),g(``),v(``)},[]),M=(0,r.useCallback)(()=>{g(``),v(``),i.current!==null&&(clearTimeout(i.current),i.current=null)},[]),N=(0,r.useCallback)(()=>{if(a.length===0)O(new AbortController().signal);else if(d!==``){n.current.delete(d),E();let e=new AbortController;t.current=e,k(d,e.signal)}},[a.length,d,O,k,E]);return(0,r.useEffect)(()=>()=>{E(),i.current!==null&&clearTimeout(i.current)},[E]),{collections:a,icons:A,totalCount:p.length,filteredCount:A.length,selectedCollection:d,searchQuery:h,isLoading:T,isLoadingCollections:y,isLoadingIcons:x,error:C,setCollection:j,setSearchQuery:D,retry:N,clearSearch:M}}var f=t(n(),1),p=({collections:e,selected:t,onChange:n,disabled:i=!1})=>{let a=e=>{n(e.target.value)},o=r.useMemo(()=>[...e].sort((e,t)=>e.localeCompare(t)),[e]);return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:`
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
      `}),(0,f.jsx)(`select`,{id:`collection-select`,"aria-label":`Icon collection`,value:t,onChange:a,disabled:i,className:`icon-collection-filter`,children:o.map(e=>(0,f.jsx)(`option`,{value:e,children:e},e))})]})},m=p;p.__docgenInfo={description:``,methods:[],displayName:`IconCollectionFilter`,props:{collections:{required:!0,tsType:{name:`unknown`},description:``},selected:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(collection: string) => void`,signature:{arguments:[{type:{name:`string`},name:`collection`}],return:{name:`void`}}},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}};var h=({searchQuery:e=``,onClearSearch:t})=>{let n=e.length>0;return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:`
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
      `}),(0,f.jsxs)(`div`,{className:`icon-gallery-empty`,children:[(0,f.jsxs)(`svg`,{width:`64`,height:`64`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,className:`icon-gallery-empty__icon`,children:[(0,f.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,f.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,f.jsx)(`h3`,{className:`icon-gallery-empty__title`,children:n?`No icons found for "${e}"`:`No icons in this collection`}),(0,f.jsx)(`p`,{className:`icon-gallery-empty__text${n?` icon-gallery-empty__text--with-query`:``}`,children:n?`Try adjusting your search terms or browse all icons`:`This collection appears to be empty. Try selecting a different collection.`}),n&&t&&(0,f.jsx)(`button`,{onClick:t,className:`icon-gallery-empty__button`,children:`Clear search`})]})]})},g=h;h.__docgenInfo={description:``,methods:[],displayName:`IconGalleryEmpty`,props:{searchQuery:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`''`,computed:!1}},onClearSearch:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var _=({error:e,onRetry:t})=>(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:`
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
      `}),(0,f.jsxs)(`div`,{className:`icon-gallery-error`,children:[(0,f.jsxs)(`svg`,{width:`64`,height:`64`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,className:`icon-gallery-error__icon`,children:[(0,f.jsx)(`circle`,{cx:`12`,cy:`12`,r:`10`}),(0,f.jsx)(`line`,{x1:`12`,y1:`8`,x2:`12`,y2:`12`}),(0,f.jsx)(`line`,{x1:`12`,y1:`16`,x2:`12.01`,y2:`16`})]}),(0,f.jsx)(`h3`,{className:`icon-gallery-error__title`,children:`Something went wrong`}),(0,f.jsx)(`p`,{className:`icon-gallery-error__message`,children:e.message}),(0,f.jsx)(`button`,{onClick:t,className:`icon-gallery-error__button`,children:`Retry`})]})]}),v=_;_.__docgenInfo={description:``,methods:[],displayName:`IconGalleryError`,props:{error:{required:!0,tsType:{name:`IconGalleryErrorType`},description:``},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var y=({count:e=20})=>(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:`
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
      `}),(0,f.jsx)(`div`,{className:`icon-gallery-skeleton`,children:Array.from({length:e}).map((e,t)=>(0,f.jsxs)(`div`,{className:`icon-gallery-skeleton__item`,children:[(0,f.jsx)(`div`,{className:`icon-gallery-skeleton__icon`}),(0,f.jsx)(`div`,{className:`icon-gallery-skeleton__text`})]},t))})]}),b=y;y.__docgenInfo={description:``,methods:[],displayName:`IconGallerySkeleton`,props:{count:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`20`,computed:!1}}}};var x=({icon:e,prefix:t})=>{let n=`${t}:${e.name}`;return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:`
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
          width: 48px;
          height: 48px;
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
      `}),(0,f.jsxs)(`div`,{className:`icon-card`,children:[(0,f.jsx)(`div`,{className:`icon-card__icon`,children:`ICON`}),(0,f.jsx)(`code`,{className:`icon-card__code`,children:n})]})]})},S=x;x.__docgenInfo={description:``,methods:[],displayName:`IconCard`,props:{icon:{required:!0,tsType:{name:`IconItem`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``}}};var C=({icons:e,prefix:t})=>e.length===0?null:(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:`
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
      `}),(0,f.jsx)(`div`,{className:`icon-grid`,children:e.map(e=>(0,f.jsx)(S,{icon:e,prefix:t},`${t}:${e.name}`))})]}),w=C;C.__docgenInfo={description:``,methods:[],displayName:`IconGrid`,props:{icons:{required:!0,tsType:{name:`unknown`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``}}};var T=({value:e,onChange:t,placeholder:n=`Search icons by name...`,disabled:r=!1,onClear:i})=>{let a=e=>{t(e.target.value)},o=()=>{i()},s=e.length>0;return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:`
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
      `}),(0,f.jsxs)(`div`,{className:`icon-search-bar`,children:[(0,f.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,className:`icon-search-bar__icon`,children:[(0,f.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,f.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,f.jsx)(`input`,{type:`text`,value:e,onChange:a,placeholder:n,disabled:r,className:`icon-search-bar__input`}),s&&!r&&(0,f.jsx)(`button`,{onClick:o,className:`icon-search-bar__clear`,"aria-label":`Clear search`,children:(0,f.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,f.jsx)(`line`,{x1:`18`,y1:`6`,x2:`6`,y2:`18`}),(0,f.jsx)(`line`,{x1:`6`,y1:`6`,x2:`18`,y2:`18`})]})})]})]})},E=T;T.__docgenInfo={description:``,methods:[],displayName:`IconSearchBar`,props:{value:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: string) => void`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`void`}}},description:``},placeholder:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Search icons by name...'`,computed:!1}},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},onClear:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var D=()=>{let{collections:e,icons:t,totalCount:n,filteredCount:r,selectedCollection:i,searchQuery:a,isLoading:o,isLoadingCollections:s,error:c,setCollection:l,setSearchQuery:u,retry:p,clearSearch:h}=d(),_=e=>{l(e)},y=e=>{u(e)},x=()=>{h()},S=()=>{p()},C=()=>s?(0,f.jsxs)(`div`,{className:`icon-gallery__loading`,children:[(0,f.jsx)(b,{}),(0,f.jsx)(`p`,{className:`icon-gallery__loading-text`,children:`Loading collections...`})]}):o?(0,f.jsx)(b,{}):c===null?t.length===0?(0,f.jsx)(g,{searchQuery:a,onClearSearch:a.length>0?x:void 0}):(0,f.jsx)(w,{icons:t,prefix:i}):(0,f.jsx)(v,{error:c,onRetry:S}),T=o||c!==null;return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:`
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
      `}),(0,f.jsxs)(`div`,{className:`icon-gallery`,children:[(0,f.jsxs)(`div`,{className:`icon-gallery__header`,children:[(0,f.jsxs)(`div`,{className:`icon-gallery__title-row`,children:[(0,f.jsx)(`h1`,{className:`icon-gallery__title`,children:`Icon Gallery`}),(0,f.jsxs)(`span`,{className:`icon-gallery__count`,children:[`Showing `,r,` of `,n,` icons`]})]}),(0,f.jsx)(`div`,{className:`icon-gallery__controls-wrapper`,children:(0,f.jsxs)(`div`,{className:`icon-gallery__controls`,children:[(0,f.jsx)(`div`,{className:`icon-gallery__search`,children:(0,f.jsx)(E,{value:a,onChange:y,disabled:T,onClear:x})}),(0,f.jsx)(`div`,{className:`icon-gallery__filter`,children:(0,f.jsx)(m,{collections:e,selected:i,onChange:_,disabled:T})})]})})]}),(0,f.jsx)(`div`,{children:C()})]})]})},O=D;D.__docgenInfo={description:``,methods:[],displayName:`IconGallery`};var k={message:`An unexpected error occurred in the icon gallery`,code:`BOUNDARY_ERROR`},A=class extends r.Component{state={hasError:!1,error:null};static getDerivedStateFromError(e){return{hasError:!0,error:{message:e.message||k.message,code:e.name===`AbortError`?`ABORTED`:k.code}}}componentDidCatch(e,t){console.error(`IconGalleryErrorBoundary caught an error:`,e,t)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:`
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
          `}),(0,f.jsxs)(`div`,{className:`icon-gallery-error-boundary`,children:[(0,f.jsxs)(`svg`,{width:`64`,height:`64`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,className:`icon-gallery-error-boundary__icon`,children:[(0,f.jsx)(`circle`,{cx:`12`,cy:`12`,r:`10`}),(0,f.jsx)(`line`,{x1:`12`,y1:`8`,x2:`12`,y2:`12`}),(0,f.jsx)(`line`,{x1:`12`,y1:`16`,x2:`12.01`,y2:`16`})]}),(0,f.jsx)(`h3`,{className:`icon-gallery-error-boundary__title`,children:`Something went wrong`}),(0,f.jsx)(`p`,{className:`icon-gallery-error-boundary__message`,children:this.state.error?.message||k.message}),(0,f.jsx)(`button`,{onClick:()=>this.setState({hasError:!1,error:null}),className:`icon-gallery-error-boundary__button`,children:`Try Again`})]})]}):this.props.children}};A.__docgenInfo={description:``,methods:[],displayName:`IconGalleryErrorBoundary`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},fallback:{required:!1,tsType:{name:`ReactNode`},description:``}}};var j={title:`Icons/All Icons`,component:O};const M={render:()=>(0,f.jsx)(A,{children:(0,f.jsx)(O,{})})};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <IconGalleryErrorBoundary>
      <IconGallery />
    </IconGalleryErrorBoundary>
}`,...M.parameters?.docs?.source}}};const N=[`Default`];export{M as Default,N as __namedExportsOrder,j as default};