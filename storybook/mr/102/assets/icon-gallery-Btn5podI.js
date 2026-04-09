import{$t as e,Kt as t,Zt as n,a as r,s as i,yt as a}from"./iframe-JDaUyWo0.js";var o=e(a(),1),s=e(n(),1);const c=new t({resources:[`https://iconify.preprod.dev.infomaniak.ch/`]}),l={ABORTED:`ABORTED`,API_ERROR:`API_ERROR`,NETWORK_ERROR:`NETWORK_ERROR`,TIMEOUT:`TIMEOUT`,UNKNOWN_ERROR:`UNKNOWN_ERROR`,BOUNDARY_ERROR:`BOUNDARY_ERROR`};var u=300;function d(e){return{name:e.name,categories:e.categories}}function f(e){return e instanceof Error?{message:e.message,code:e.name===`AbortError`?l.ABORTED:l.API_ERROR}:{message:`An unknown error occurred`,code:l.UNKNOWN_ERROR}}function p(e=c){let t=(0,s.useRef)(null),n=(0,s.useRef)(new Map),r=(0,s.useRef)(null),[i,a]=(0,s.useState)([]),[o,l]=(0,s.useState)(``),[p,m]=(0,s.useState)([]),[h,g]=(0,s.useState)(``),[_,v]=(0,s.useState)(``),[y,b]=(0,s.useState)(!1),[x,S]=(0,s.useState)(!1),[C,w]=(0,s.useState)(null),T=y||x,E=(0,s.useCallback)(()=>{t.current!==null&&(t.current.abort(),t.current=null)},[]),D=(0,s.useCallback)(e=>{g(e),r.current!==null&&clearTimeout(r.current),r.current=setTimeout(()=>{v(e.trim().toLowerCase())},u)},[]),O=(0,s.useCallback)(async t=>{try{b(!0),w(null);let n=await e.listIconSets({signal:t}),r=Object.keys(n).sort();a(r),r.length>0&&l(r[0])}catch(e){if(t.aborted)return;w(f(e))}finally{b(!1)}},[e]),k=(0,s.useCallback)(async(r,i)=>{try{S(!0),w(null);let t=n.current.get(r);if(t!==void 0){m(t);return}let a=(await e.listIcons({prefix:r,signal:i})).map(d);n.current.set(r,a),m(a)}catch(e){if(i.aborted)return;w(f(e))}finally{S(!1),t.current?.signal===i&&(t.current=null)}},[e]);(0,s.useEffect)(()=>{let e=new AbortController;return O(e.signal),()=>{e.abort()}},[O]),(0,s.useEffect)(()=>{if(o===``)return;E();let e=new AbortController;return t.current=e,k(o,e.signal),()=>{e.abort()}},[o,k,E]);let A=(0,s.useMemo)(()=>_===``?p:p.filter(e=>e.name.toLowerCase().includes(_)),[p,_]),j=(0,s.useCallback)(e=>{l(e),g(``),v(``)},[]),M=(0,s.useCallback)(()=>{g(``),v(``),r.current!==null&&(clearTimeout(r.current),r.current=null)},[]),N=(0,s.useCallback)(()=>{if(i.length===0){E();let e=new AbortController;t.current=e,O(e.signal)}else if(o!==``){n.current.delete(o),E();let e=new AbortController;t.current=e,k(o,e.signal)}},[i.length,o,O,k,E]);return(0,s.useEffect)(()=>()=>{E(),r.current!==null&&clearTimeout(r.current)},[E]),{collections:i,icons:A,totalCount:p.length,filteredCount:A.length,selectedCollection:o,searchQuery:h,isLoading:T,isLoadingCollections:y,isLoadingIcons:x,error:C,setCollection:j,setSearchQuery:D,retry:N,clearSearch:M}}var m=({collections:e,selected:t,onChange:n,disabled:r=!1})=>{let i=e=>{n(e.target.value)},a=s.useMemo(()=>[...e].sort((e,t)=>e.localeCompare(t)),[e]);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:`
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
      `}),(0,o.jsx)(`select`,{id:`collection-select`,"aria-label":`Icon collection`,value:t,onChange:i,disabled:r,className:`icon-collection-filter`,children:a.map(e=>(0,o.jsx)(`option`,{value:e,children:e},e))})]})},h=m;m.__docgenInfo={description:``,methods:[],displayName:`IconCollectionFilter`,props:{collections:{required:!0,tsType:{name:`unknown`},description:``},selected:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(collection: string) => void`,signature:{arguments:[{type:{name:`string`},name:`collection`}],return:{name:`void`}}},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}};var g=({searchQuery:e=``,onClearSearch:t})=>{let n=e.length>0;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:`
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
      `}),(0,o.jsxs)(`div`,{className:`icon-gallery-empty`,children:[(0,o.jsxs)(`svg`,{width:`64`,height:`64`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,className:`icon-gallery-empty__icon`,children:[(0,o.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,o.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,o.jsx)(`h3`,{className:`icon-gallery-empty__title`,children:n?`No icons found for "${e}"`:`No icons in this collection`}),(0,o.jsx)(`p`,{className:`icon-gallery-empty__text${n?` icon-gallery-empty__text--with-query`:``}`,children:n?`Try adjusting your search terms or browse all icons`:`This collection appears to be empty. Try selecting a different collection.`}),n&&t&&(0,o.jsx)(`button`,{onClick:t,className:`icon-gallery-empty__button`,children:`Clear search`})]})]})},_=g;g.__docgenInfo={description:``,methods:[],displayName:`IconGalleryEmpty`,props:{searchQuery:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`''`,computed:!1}},onClearSearch:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var v=({error:e,onRetry:t})=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:`
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
      `}),(0,o.jsxs)(`div`,{className:`icon-gallery-error`,children:[(0,o.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error__icon`,children:[(0,o.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,o.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,o.jsx)(`h3`,{className:`icon-gallery-error__title`,children:`Something went wrong`}),(0,o.jsx)(`p`,{className:`icon-gallery-error__message`,children:e.message}),(0,o.jsx)(`button`,{onClick:t,className:`icon-gallery-error__button`,children:`Retry`})]})]}),y=v;v.__docgenInfo={description:``,methods:[],displayName:`IconGalleryError`,props:{error:{required:!0,tsType:{name:`IconGalleryErrorType`},description:``},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var b=({count:e=20})=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:`
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
      `}),(0,o.jsx)(`div`,{className:`icon-gallery-skeleton`,children:Array.from({length:e}).map((e,t)=>(0,o.jsxs)(`div`,{className:`icon-gallery-skeleton__item`,children:[(0,o.jsx)(`div`,{className:`icon-gallery-skeleton__icon`}),(0,o.jsx)(`div`,{className:`icon-gallery-skeleton__text`})]},t))})]}),x=b;b.__docgenInfo={description:``,methods:[],displayName:`IconGallerySkeleton`,props:{count:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`20`,computed:!1}}}};var S=({icon:e,prefix:t})=>{let n=`${t}:${e.name}`;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:`
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
      `}),(0,o.jsxs)(`div`,{className:`icon-card`,children:[(0,o.jsx)(`div`,{className:`icon-card__icon`,children:(0,o.jsx)(`esds-svg`,{name:n,mode:`bg`,style:{width:`48px`,height:`48px`}})}),(0,o.jsx)(`code`,{className:`icon-card__code`,children:n})]})]})},C=S;S.__docgenInfo={description:``,methods:[],displayName:`IconCard`,props:{icon:{required:!0,tsType:{name:`IconItem`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``}}};var w=({icons:e,prefix:t})=>e.length===0?null:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:`
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
      `}),(0,o.jsx)(`div`,{className:`icon-grid`,children:e.map(e=>(0,o.jsx)(C,{icon:e,prefix:t},`${t}:${e.name}`))})]}),T=w;w.__docgenInfo={description:``,methods:[],displayName:`IconGrid`,props:{icons:{required:!0,tsType:{name:`unknown`},description:``},prefix:{required:!0,tsType:{name:`string`},description:``}}};var E=({value:e,onChange:t,placeholder:n=`Search icons by name...`,disabled:r=!1,onClear:i})=>{let a=e=>{t(e.target.value)},s=()=>{i()},c=e.length>0;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:`
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
      `}),(0,o.jsxs)(`div`,{className:`icon-search-bar`,children:[(0,o.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,className:`icon-search-bar__icon`,children:[(0,o.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,o.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]}),(0,o.jsx)(`input`,{type:`text`,value:e,onChange:a,placeholder:n,disabled:r,className:`icon-search-bar__input`}),c&&!r&&(0,o.jsx)(`button`,{type:`button`,onClick:s,className:`icon-search-bar__clear`,"aria-label":`Clear search`,children:(0,o.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,o.jsx)(`line`,{x1:`18`,y1:`6`,x2:`6`,y2:`18`}),(0,o.jsx)(`line`,{x1:`6`,y1:`6`,x2:`18`,y2:`18`})]})})]})]})},D=E;E.__docgenInfo={description:``,methods:[],displayName:`IconSearchBar`,props:{value:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: string) => void`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`void`}}},description:``},placeholder:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Search icons by name...'`,computed:!1}},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},onClear:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}};var O=()=>{let{collections:e,icons:t,totalCount:n,filteredCount:r,selectedCollection:i,searchQuery:a,isLoading:s,isLoadingCollections:c,error:l,setCollection:u,setSearchQuery:d,retry:f,clearSearch:m}=p(),g=e=>{u(e)},v=e=>{d(e)},b=()=>{m()},S=()=>{f()},C=()=>c?(0,o.jsxs)(`div`,{className:`icon-gallery__loading`,children:[(0,o.jsx)(x,{}),(0,o.jsx)(`p`,{className:`icon-gallery__loading-text`,children:`Loading collections...`})]}):s?(0,o.jsx)(x,{}):l===null?t.length===0?(0,o.jsx)(_,{searchQuery:a,onClearSearch:a.length>0?b:void 0}):(0,o.jsx)(T,{icons:t,prefix:i}):(0,o.jsx)(y,{error:l,onRetry:S}),w=s||l!==null;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:`
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
      `}),(0,o.jsxs)(`div`,{className:`icon-gallery`,children:[(0,o.jsxs)(`div`,{className:`icon-gallery__header`,children:[(0,o.jsxs)(`div`,{className:`icon-gallery__title-row`,children:[(0,o.jsx)(`h1`,{className:`icon-gallery__title`,children:`Icon Gallery`}),(0,o.jsxs)(`span`,{className:`icon-gallery__count`,children:[`Showing `,r,` of `,n,` icons`]})]}),(0,o.jsx)(`div`,{className:`icon-gallery__controls-wrapper`,children:(0,o.jsxs)(`div`,{className:`icon-gallery__controls`,children:[(0,o.jsx)(`div`,{className:`icon-gallery__search`,children:(0,o.jsx)(D,{value:a,onChange:v,disabled:w,onClear:b})}),(0,o.jsx)(`div`,{className:`icon-gallery__filter`,children:(0,o.jsx)(h,{collections:e,selected:i,onChange:g,disabled:w})})]})})]}),(0,o.jsx)(`div`,{children:C()})]})]})},k=O;O.__docgenInfo={description:``,methods:[],displayName:`IconGallery`};var A={message:`An unexpected error occurred in the icon gallery`,code:`BOUNDARY_ERROR`},j=class extends s.Component{state={hasError:!1,error:null};static getDerivedStateFromError(e){return{hasError:!0,error:{message:e.message||A.message,code:e.name===`AbortError`?`ABORTED`:A.code}}}componentDidCatch(e,t){console.error(`IconGalleryErrorBoundary caught an error:`,e,t)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:`
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
          `}),(0,o.jsxs)(`div`,{className:`icon-gallery-error-boundary`,children:[(0,o.jsxs)(`svg`,{width:`64`,height:`64`,fill:`none`,viewBox:`0 0 24 24`,className:`icon-gallery-error-boundary__icon`,children:[(0,o.jsx)(`path`,{fill:`currentColor`,d:`M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15`}),(0,o.jsx)(`path`,{fill:`currentColor`,d:`M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16`})]}),(0,o.jsx)(`h3`,{className:`icon-gallery-error-boundary__title`,children:`Something went wrong`}),(0,o.jsx)(`p`,{className:`icon-gallery-error-boundary__message`,children:this.state.error?.message||A.message}),(0,o.jsx)(`button`,{onClick:()=>this.setState({hasError:!1,error:null}),className:`icon-gallery-error-boundary__button`,children:`Try Again`})]})]}):this.props.children}};j.__docgenInfo={description:``,methods:[],displayName:`IconGalleryErrorBoundary`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},fallback:{required:!1,tsType:{name:`ReactNode`},description:``}}};function M(e){return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r,{title:`Icons/Icon Gallery`}),`
`,(0,o.jsx)(j,{children:(0,o.jsx)(k,{})})]})}function N(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(M,{...e})}):M(e)}export{N as default};