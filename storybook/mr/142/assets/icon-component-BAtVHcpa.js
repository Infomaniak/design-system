import{n as e}from"./chunk-DnJy8xQt.js";import{r as t}from"./react-2PHY_ptJ.js";import{a as n,h as r,o as i}from"./iframe-BqJAIh7h.js";import{t as a}from"./mdx-react-shim-DQIUUSAW.js";function o(e){let r={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,h4:`h4`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...t(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Icons/Icon Component`}),`
`,(0,c.jsx)(r.h1,{id:`web`,children:`Web`}),`
`,(0,c.jsx)(r.h2,{id:`esdsiconcomponent`,children:`EsdsIconComponent`}),`
`,(0,c.jsx)(r.h3,{id:`installation`,children:`Installation`}),`
`,(0,c.jsx)(r.pre,{children:(0,c.jsx)(r.code,{className:`language-shell`,children:`yarn add @infomaniak-design-system/esds-icon
`})}),`
`,(0,c.jsx)(r.h3,{id:`initialization`,children:`Initialization`}),`
`,(0,c.jsx)(r.p,{children:`The icon component needs to be initialized before it can be rendered:`}),`
`,(0,c.jsx)(r.pre,{children:(0,c.jsx)(r.code,{className:`language-ts`,children:`import { EsdsIconComponent } from '@infomaniak-design-system/esds-icon';

EsdsIconComponent.init();
`})}),`
`,(0,c.jsx)(r.p,{children:`This allows defining the API proxy to fetch the icons and registering the custom element.`}),`
`,(0,c.jsxs)(r.p,{children:[`You should put it in your `,(0,c.jsx)(r.code,{children:`main.ts`}),` or `,(0,c.jsx)(r.code,{children:`app.ts`}),` file.`]}),`
`,(0,c.jsx)(r.h3,{id:`usage`,children:`Usage`}),`
`,(0,c.jsx)(r.pre,{children:(0,c.jsx)(r.code,{className:`language-html`,children:`<esds-icon
  style="font-size: var(--esds-icon-size-md); color: var(--esds-color-text-primary)"
  name="esds:home"
></esds-icon>
`})}),`
`,(0,c.jsx)(r.h4,{id:`styling`,children:`Styling`}),`
`,(0,c.jsx)(r.p,{children:`The icon may be styled using the following CSS properties:`}),`
`,(0,c.jsxs)(r.ul,{children:[`
`,(0,c.jsxs)(r.li,{children:[(0,c.jsx)(r.code,{children:`color`}),`: to set the icon's color`]}),`
`,(0,c.jsxs)(r.li,{children:[(0,c.jsx)(r.code,{children:`font-size`}),`: to set the icon's size`]}),`
`]}),`
`,(0,c.jsx)(r.h4,{id:`preventing-layout-shift`,children:`Preventing Layout Shift`}),`
`,(0,c.jsxs)(r.p,{children:[`To avoid `,(0,c.jsx)(r.a,{href:`https://iconify.design/docs/iconify-icon/#layout-shift`,rel:`nofollow`,children:`layout shift`}),` when the icon loads, add the following CSS to your project:`]}),`
`,(0,c.jsx)(r.pre,{children:(0,c.jsx)(r.code,{className:`language-css`,children:`esds-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
}
`})}),`
`,(0,c.jsx)(r.p,{children:`This ensures the component reserves space before the icon is rendered.`}),`
`,(0,c.jsx)(r.h3,{id:`api`,children:`API`}),`
`,(0,c.jsxs)(`table`,{children:[(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{children:`Attribute/Property`}),(0,c.jsx)(`th`,{children:`Type`}),(0,c.jsx)(`th`,{children:`Description`})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`name`}),(0,c.jsx)(`td`,{children:(0,c.jsx)(`code`,{children:`<prefix>:<name>`})}),(0,c.jsx)(`td`,{children:`The name of the icon to display.`})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`mode`}),(0,c.jsx)(`td`,{children:(0,c.jsx)(`code`,{children:`EsdsIconComponentMode`})}),(0,c.jsxs)(`td`,{children:[(0,c.jsxs)(r.p,{children:[`The `,(0,c.jsx)(`code`,{children:`mode`}),` to apply:`]}),(0,c.jsxs)(`ul`,{children:[(0,c.jsx)(`li`,{children:(0,c.jsxs)(r.p,{children:[(0,c.jsx)(`code`,{children:`svg`}),`: injects the svg as direct <svg> child of this component.`]})}),(0,c.jsx)(`li`,{children:(0,c.jsxs)(r.p,{children:[(0,c.jsx)(`code`,{children:`bg`}),`: uses the svg as "background-image" of this component.`]})}),(0,c.jsx)(`li`,{children:(0,c.jsxs)(r.p,{children:[(0,c.jsx)(`code`,{children:`mask`}),`: injects the svg as "mask-image" of this component: this is useful to
apply color to the svg.`]})})]})]})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`inline`}),(0,c.jsx)(`td`,{children:(0,c.jsx)(`code`,{children:`boolean`})}),(0,c.jsx)(`td`,{children:(0,c.jsxs)(r.p,{children:[`Adding `,(0,c.jsx)(`code`,{children:`inline`}),` property to the icon component is identical to setting`,` `,`
`,(0,c.jsx)(`code`,{children:`style="vertical-align: -0.125em"`}),`. This is useful to correct the icon's alignment.`]})})]}),(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{children:`nolazy`}),(0,c.jsx)(`td`,{children:(0,c.jsx)(`code`,{children:`boolean`})}),(0,c.jsx)(`td`,{children:(0,c.jsxs)(r.p,{children:[`By default, icons are rendered only when visible to the visitor. You can opt out of this
behavior by adding the `,(0,c.jsx)(`code`,{children:`nolazy`}),` attribute.`]})})]})]})]})}function s(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=r(),a(),i()}))();export{s as default};