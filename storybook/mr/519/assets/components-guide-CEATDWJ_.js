import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{l as t,s as n}from"./blocks-Cr2ZIGG9.js";import{a as r}from"./chunk-W22LQPXL-CVCnKrju.js";import{i,r as a}from"./react-DITjJg24.js";function o(e){let t={blockquote:`blockquote`,code:`code`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,strong:`strong`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Components/Getting Started`}),`
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
`,(0,c.jsx)(t.p,{children:`Components are built as standard Web Components and work in any framework (React, Vue, Angular, vanilla JS, etc.). No additional adapters are required.`}),`
`,(0,c.jsx)(t.h3,{id:`react`,children:`React`}),`
`,(0,c.jsxs)(t.p,{children:[`Import the components you need from `,(0,c.jsx)(t.code,{children:`@infomaniak-design-system/components`}),`, and they are ready to use, with autocompletion.`]}),`
`,(0,c.jsx)(t.h3,{id:`angular`,children:`Angular`}),`
`,(0,c.jsxs)(t.p,{children:[`Add `,(0,c.jsx)(t.code,{children:`schemas: [CUSTOM_ELEMENTS_SCHEMA]`}),` to any Angular module or component that uses the Design System components:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  // ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
`})}),`
`,(0,c.jsx)(t.h2,{id:`ide-support`,children:`IDE Support`}),`
`,(0,c.jsxs)(t.blockquote,{children:[`
`,(0,c.jsx)(t.p,{children:`ℹ️ IDE support is only needed if your framework does not already provide autocompletion.`}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`The integration files are shipped in the package. Custom attributes (e.g. `,(0,c.jsx)(t.code,{children:`esds-button`}),` on a native `,(0,c.jsx)(t.code,{children:`<a>`}),` or `,(0,c.jsx)(t.code,{children:`<button>`}),`) are autocompleted on any element.`]}),`
`,(0,c.jsx)(t.h3,{id:`jetbrains`,children:`JetBrains`}),`
`,(0,c.jsxs)(t.p,{children:[`JetBrains IDEs detect the components automatically through the `,(0,c.jsx)(t.code,{children:`web-types`}),` field of the package — no configuration is needed.`]}),`
`,(0,c.jsx)(t.h3,{id:`vs-code`,children:`VS Code`}),`
`,(0,c.jsxs)(t.p,{children:[`If you don't have one already, create a `,(0,c.jsx)(t.code,{children:`.vscode/settings.json`}),` file at the root of your project.`]}),`
`,(0,c.jsx)(t.p,{children:`Then add or append the following configuration:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-json`,children:`{
  "html.customData": [
    "./node_modules/@infomaniak-design-system/components/vscode.html-custom-data.json"
  ],
  "css.customData": [
    "./node_modules/@infomaniak-design-system/components/vscode.css-custom-data.json"
  ]
}
`})})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};