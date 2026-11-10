import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{c as a,f as o,o as s,p as c,s as l}from"./iframe-SREY109P.js";import{n as u,t as d}from"./iconify-api-CHV2Jb6E.js";var f;function p(){return(p=e((()=>{f=`## Setup

Import and register the icon component in your application's entry file (e.g., \`main.ts\` or \`index.ts\`):

\`\`\`ts
import { EsdsIconComponent } from '@infomaniak-design-system/components';

EsdsIconComponent.define();
\`\`\`

> **Important:** \`define()\` must be called before any component renders \`<esds-icon>\`.

## Usage

The icon inherits its size based on the **local** \`font-size\`.
It is by default \`inline-block\` making it suitable to integrate into \`flex\` container.

\`\`\`html
<esds-icon
  name="esds:headset"
  style="font-size: var(--esds-icon-size-md); /* or let it be inherited from a parent element */"
></esds-icon>
\`\`\`

### Tailwind

You may set the icon size using the tailwind \`text-icon-{size}\` class:

\`\`\`html
<esds-icon
  name="esds:headset"
  class="text-icon-md"
></esds-icon>
\`\`\`

## Configuration (Optional)

If you need custom icon resources (e.g., a specific icon server), set the \`InjectionContext\`:

\`\`\`ts
import { ICONIFY_API, InjectionContext, IconifyApi } from '@infomaniak-design-system/components';

InjectionContext.root = new InjectionContext([
  ICONIFY_API.define(
    new IconifyApi({
      resources: ['https://iconify.preprod.dev.infomaniak.ch'],
    }),
  ),
]);
\`\`\`

> \`InjectionContext\` is only required when the default icon resources are insufficient.

## Demo
`})))()}var m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{a(),o(),r(),n(),u(),p(),s.define(),{args:m,argTypes:h,template:g}=i(`esds-icon`),_={title:`Components/Icon`,component:`esds-icon`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:f}}},args:m,argTypes:h,render:e=>g(e)},v={args:{name:`esds:headset`}},y={parameters:{docs:{description:{story:"Add the `inline` attribute so the icon aligns with the surrounding text flow, e.g. inside a link."}}},args:{name:`esds:square-arrow-out-up-right`},render:e=>t`
    <a href="#">
      Follow this link
      <esds-icon
        name="${e.name}"
        inline
      ></esds-icon>
    </a>
  `},b={args:{name:`esds:bug`},decorators:[e=>{let n=new c([l.define(new d({resources:[`https://iconify.preprod.dev.infomaniak.ch`]}))]);return t`
        <div data-inject="${n.id}">
          ${e()}
          <!-- NOTE: data-inject can be set directly on the component itself -->
        </div>
      `}]},x=[`Default`,`Inline`,`Preprod`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'esds:headset'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Add the \`inline\` attribute so the icon aligns with the surrounding text flow, e.g. inside a link.'
      }
    }
  },
  args: {
    name: 'esds:square-arrow-out-up-right'
  },
  render: args => html\`
    <a href="#">
      Follow this link
      <esds-icon
        name="\${args.name}"
        inline
      ></esds-icon>
    </a>
  \`
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'esds:bug'
  },
  decorators: [(Story: PartialStoryFn) => {
    const ctx = new InjectionContext([ICONIFY_API.define(new IconifyApi({
      resources: ['https://iconify.preprod.dev.infomaniak.ch']
    }))]);
    return html\`
        <div data-inject="\${ctx.id}">
          \${Story()}
          <!-- NOTE: data-inject can be set directly on the component itself -->
        </div>
      \`;
  }]
}`,...b.parameters?.docs?.source}}}})))()}S();export{v as Default,y as Inline,b as Preprod,x as __namedExportsOrder,_ as default};