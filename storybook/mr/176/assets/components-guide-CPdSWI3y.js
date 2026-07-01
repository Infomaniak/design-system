import{i as e}from"./preload-helper-CT_b8DTk.js";import{k as t,l as n,m as r,u as i}from"./iframe-B-yUX8yB.js";import{t as a}from"./mdx-react-shim-DZAkfQ8o.js";function o(e){let t={blockquote:`blockquote`,code:`code`,h2:`h2`,p:`p`,pre:`pre`,strong:`strong`,...r(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Components/Getting Started`}),`
`,(0,c.jsxs)(`div`,{className:`welcome-section`,children:[(0,c.jsx)(`h1`,{children:`Components`}),(0,c.jsx)(`p`,{className:`welcome-description`,children:(0,c.jsx)(t.p,{children:`Reusable web components built for Infomaniak products. Each component is framework-agnostic and
can be used in any project that supports custom elements.`})})]}),`
`,(0,c.jsx)(t.h2,{id:`installation`,children:`Installation`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-bash`,children:`npm install @infomaniak-design-system/components
`})}),`
`,(0,c.jsx)(t.h2,{id:`quick-start`,children:`Quick Start`}),`
`,(0,c.jsxs)(t.p,{children:[`Import and register the components you need. `,(0,c.jsxs)(t.strong,{children:[`Call `,(0,c.jsx)(t.code,{children:`define()`}),` in your application's entry file`]}),` (e.g., `,(0,c.jsx)(t.code,{children:`main.ts`}),`) so custom elements are defined before we try to render them:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`import { EsdsIconComponent } from '@infomaniak-design-system/components';

EsdsIconComponent.define();
`})}),`
`,(0,c.jsx)(t.p,{children:`Use it in your HTML or JSX:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<esds-icon name="esds:headset"></esds-icon>
`})}),`
`,(0,c.jsxs)(t.blockquote,{children:[`
`,(0,c.jsx)(t.p,{children:`Each component may have additional configuration. See the component's documentation for specifics.`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`framework-support`,children:`Framework Support`}),`
`,(0,c.jsx)(t.p,{children:`Components are built as standard Web Components and work in any framework (React, Vue, Angular, vanilla JS, etc.). No additional adapters are required.`})]})}function s(e={}){let{wrapper:t}={...r(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),i()}))();export{s as default};