import{n as e}from"./chunk-DnJy8xQt.js";import{r as t}from"./react-pwy5RQoA.js";import{_ as n,a as r,o as i}from"./iframe-BroWjMgJ.js";import{t as a}from"./mdx-react-shim-DPu4Xs5y.js";function o(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...t(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(r,{title:`Components/esds-icon`}),`
`,(0,c.jsx)(n.h1,{id:`esds-icon`,children:`esds-icon`}),`
`,(0,c.jsx)(n.p,{children:`Web component for displaying icons from the Infomaniak Design System icon library.`}),`
`,(0,c.jsx)(n.h2,{id:`installation`,children:`Installation`}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-bash`,children:`yarn add @infomaniak-design-system/components
`})}),`
`,(0,c.jsxs)(n.p,{children:[`Requires a peer-like dependency on `,(0,c.jsx)(n.code,{children:`lit`}),` for the consuming project:`]}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-bash`,children:`yarn add lit
`})}),`
`,(0,c.jsx)(n.h2,{id:`configuration`,children:`Configuration`}),`
`,(0,c.jsxs)(n.p,{children:[`The `,(0,c.jsx)(n.code,{children:`configure()`}),` function must be called `,(0,c.jsx)(n.strong,{children:`once`}),` before using any icon component:`]}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-typescript`,children:`import { configure } from '@infomaniak-design-system/components';
import { IconifyApi } from '@infomaniak-design-system/esds-icon';

const api = new IconifyApi({
  url: 'https://your-iconify-instance.com',
});

configure(api);
`})}),`
`,(0,c.jsxs)(n.p,{children:[`Calling `,(0,c.jsx)(n.code,{children:`configure()`}),` more than once will throw an error. If not configured, a default `,(0,c.jsx)(n.code,{children:`IconifyApi`}),` instance is created internally.`]}),`
`,(0,c.jsx)(n.h2,{id:`usage`,children:`Usage`}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-html`,children:`<esds-icon name="esds:bell" mode="svg" inline></esds-icon>
`})}),`
`,(0,c.jsx)(n.h2,{id:`styling`,children:`Styling`}),`
`,(0,c.jsx)(n.p,{children:`The icon may be styled using the following CSS properties:`}),`
`,(0,c.jsxs)(n.ul,{children:[`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.code,{children:`color`}),`: to set the icon's color`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.code,{children:`font-size`}),`: to set the icon's size`]}),`
`]}),`
`,(0,c.jsx)(n.h2,{id:`preventing-layout-shift`,children:`Preventing Layout Shift`}),`
`,(0,c.jsxs)(n.p,{children:[`To avoid `,(0,c.jsx)(n.a,{href:`https://iconify.design/docs/iconify-icon/#layout-shift`,rel:`nofollow`,children:`layout shift`}),` when the icon loads, add the following CSS to your project:`]}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-css`,children:`esds-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
}
`})}),`
`,(0,c.jsx)(n.p,{children:`This ensures the component reserves space before the icon is rendered.`}),`
`,(0,c.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,c.jsx)(n.h3,{id:`esds-icon-1`,children:(0,c.jsx)(n.code,{children:`<esds-icon>`})}),`
`,(0,c.jsxs)(`table`,{children:[(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{children:`Attribute`}),(0,c.jsx)(`th`,{children:`Type`}),(0,c.jsx)(`th`,{children:`Default`}),(0,c.jsx)(`th`,{children:`Description`})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`name`}),(0,c.jsx)(`td`,{children:`string`}),(0,c.jsx)(`td`,{children:`""`}),(0,c.jsxs)(`td`,{children:[`Icon identifier in `,(0,c.jsx)(`code`,{children:`prefix:name`}),` format`]})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`mode`}),(0,c.jsx)(`td`,{children:`EsdsIconComponentMode`}),(0,c.jsx)(`td`,{children:`"svg"`}),(0,c.jsxs)(`td`,{children:[(0,c.jsx)(n.p,{children:`The rendering mode to apply:`}),(0,c.jsxs)(`ul`,{children:[(0,c.jsxs)(`li`,{children:[(0,c.jsx)(`code`,{children:`svg`}),`: Renders SVG inline inside the component`]}),(0,c.jsxs)(`li`,{children:[(0,c.jsx)(`code`,{children:`bg`}),`: Uses CSS `,(0,c.jsx)(`code`,{children:`background-image`}),` with the SVG encoded as a data URL`]}),(0,c.jsxs)(`li`,{children:[(0,c.jsx)(`code`,{children:`mask`}),`: Uses CSS `,(0,c.jsx)(`code`,{children:`mask-image`}),` for color-current icon rendering`]})]})]})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`inline`}),(0,c.jsx)(`td`,{children:`boolean`}),(0,c.jsx)(`td`,{children:`false`}),(0,c.jsx)(`td`,{children:`Adjusts vertical alignment for inline use`})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`nolazy`}),(0,c.jsx)(`td`,{children:`boolean`}),(0,c.jsx)(`td`,{children:`false`}),(0,c.jsx)(`td`,{children:`Disables lazy loading, fetches icon immediately`})]})]}),`
`,(0,c.jsx)(n.p,{children:(0,c.jsx)(n.strong,{children:`Properties:`})}),`
`,(0,c.jsxs)(`table`,{children:[(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{children:`Property`}),(0,c.jsx)(`th`,{children:`Type`}),(0,c.jsx)(`th`,{children:`Description`})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`status`}),(0,c.jsx)(`td`,{children:(0,c.jsx)(`code`,{children:`"loading" | "rendered" | "error"`})}),(0,c.jsx)(`td`,{children:`Read-only loading state of the icon`})]})]}),`
`,(0,c.jsx)(n.h2,{id:`typescript`,children:`TypeScript`}),`
`,(0,c.jsx)(n.p,{children:`Type declarations are included. Import types directly:`}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-typescript`,children:`import type { EsdsIconComponent, EsdsIconComponentMode } from '@infomaniak-design-system/components';
`})})]})}function s(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=n(),a(),i()}))();export{s as default};