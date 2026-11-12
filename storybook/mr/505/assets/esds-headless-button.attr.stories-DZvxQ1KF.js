import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{n as a}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as o,o as s,r as c,s as l}from"./injectable-style-sheet-CJbmy-p9.js";import{n as u,t as d}from"./esds-headless-button.attr-ClYGAG0e.js";import{n as f,t as p}from"./esds-button.attr-CBakPmAs.js";var m;function h(){return(h=e((()=>{m='## Usage\n\nImport and register the custom attribute `esds-headless-button`:\n\n```ts\nimport { EsdsHeadlessButtonAttr } from \'@infomaniak-design-system/components\';\n\nEsdsHeadlessButtonAttr.define();\n```\n\n```html\n<button esds-headless-button>Button</button>\n```\n\n```html\n<a\n  esds-headless-button\n  href="#"\n  >Anchor acting as a button</a\n>\n```\n\n## Description\n\nAdding the custom attribute `esds-headless-button` to a `<button>` or `<a>` element gives it the\ndesign-system button **behavior** with zero styling: the element keeps its native look.\n\nThe attribute:\n\n- turns an `<a>` into a button semantically (`role="button"`) and makes Space trigger `click()`;\n- makes the press inert while `disabled` or `loading` (no hover/focus side effects while pressed);\n- mirrors `disabled`/`loading` to `aria-disabled`/`aria-busy` on anchors, saves/restores the\n  `tabindex`, and mirrors the text content to `aria-label` while loading.\n\nIt injects **zero** CSS: no reset, no focus-ring styling, no look.\n\n> [!WARNING]\n> An element must carry at most **one** behavior-bearing attribute. `<a esds-button\nesds-headless-button>` would run the button behavior twice (e.g. one Space press calling\n> `click()` twice).\n\n### Building clickable components\n\nBehavior flows from `esds-headless-button`; look layers extend it and never extend another\nlook-carrying attribute:\n\n1. **Bundled variant attributes** — `esds-button`, `esds-avatar-button` (future: `esds-badge-button`):\n   a first-class, recurring, design-approved clickable variant extends `EsdsHeadlessButtonAttr`\n   directly and owns its styling.\n2. **Element choice + optional stacking** — for context-dependent interactivity (a chip, a tag, a\n   link-look button), the look attribute stays element-agnostic and interactivity is expressed by the\n   element itself: `<span esds-chip>` static, `<button esds-chip>` clickable, `<a esds-chip href>`\n   link. Stack `esds-headless-button` only when the element needs the design-system state contract\n   (`loading`, inert press, anchor keyboard): `<button esds-chip esds-headless-button>`.\n\n## Demo\n'})))()}var g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{r(),n(),l(),o(),f(),h(),u(),g=s(e=>{let t=c.of(e.ownerDocument);d.define({registry:t}),p.define({registry:t})}),{args:_,argTypes:v}=i(`esds-headless-button`),y={title:`Components/Headless Button`,component:`esds-headless-button`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:m}}},args:_,argTypes:v},b={disabled:{value:!1,type:`boolean`},loading:{value:!1,type:`boolean`}},x={...a({...b,content:`Native-looking button`}),render:e=>t`<button
      ${g}
      esds-headless-button
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      ${e.content}
    </button>`},S={...a({...b,content:`Anchor acting as a button`,href:`https://infomaniak.com`}),render:e=>t`<a
      ${g}
      esds-headless-button
      href="${e.href}"
      ?disabled=${e.disabled}
      ?loading=${e.loading}
    >
      ${e.content}
    </a>`},C={...a({...b,content:`Same contract, no look`}),parameters:{docs:{description:{story:"The same behavior contract as `esds-button`, with zero styling: the native look stays native."}}},render:e=>t`<button
        ${g}
        esds-button
        ?disabled=${e.disabled}
        ?loading=${e.loading}
      >
        ${e.content}
      </button>
      <button
        ${g}
        esds-headless-button
        ?disabled=${e.disabled}
        ?loading=${e.loading}
      >
        ${e.content}
      </button>`},w=[`NativeButton`,`AnchorAsButton`,`SameContractNoLook`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Native-looking button'
  }),
  render: args => html\`<button
      \${defineHeadlessAndButtonAttrs}
      esds-headless-button
      ?disabled=\${args.disabled}
      ?loading=\${args.loading}
    >
      \${args.content}
    </button>\`
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Anchor acting as a button',
    href: 'https://infomaniak.com'
  }),
  render: args => html\`<a
      \${defineHeadlessAndButtonAttrs}
      esds-headless-button
      href="\${args.href}"
      ?disabled=\${args.disabled}
      ?loading=\${args.loading}
    >
      \${args.content}
    </a>\`
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Same contract, no look'
  }),
  parameters: {
    docs: {
      description: {
        story: 'The same behavior contract as \`esds-button\`, with zero styling: the native look stays native.'
      }
    }
  },
  render: args => html\`<button
        \${defineHeadlessAndButtonAttrs}
        esds-button
        ?disabled=\${args.disabled}
        ?loading=\${args.loading}
      >
        \${args.content}
      </button>
      <button
        \${defineHeadlessAndButtonAttrs}
        esds-headless-button
        ?disabled=\${args.disabled}
        ?loading=\${args.loading}
      >
        \${args.content}
      </button>\`
}`,...C.parameters?.docs?.source}}}})))()}T();export{S as AnchorAsButton,x as NativeButton,C as SameContractNoLook,w as __namedExportsOrder,y as default};