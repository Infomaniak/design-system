import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{h as t,n,t as r,u as i}from"./dist-D5vWbpez.js";import{a,i as o,l as s,n as c,o as l,r as u,s as d,t as f}from"./injectable-style-sheet-BBpgD0Qy.js";var p;function m(){return(m=e((()=>{p=`- [Figma ↗](TODO)

## Usage

Import and register the custom attribute \`esds-kbd\`:

\`\`\`ts
import { EsdsKbdAttr } from '@infomaniak-design-system/components';

EsdsKbdAttr.define();
\`\`\`

\`\`\`html
<kbd esds-kbd>K</kbd>
\`\`\`

### Inline in text

A keyboard key reads naturally inline within a sentence:

\`\`\`html
<p>
  Press
  <kbd esds-kbd>K</kbd>
  to open the search.
</p>
\`\`\`

### Multi-key shortcuts

No special markup is needed to group keys: use several \`<kbd esds-kbd>\` elements separated by a \`+\` character, spaced by the natural inline text flow:

\`\`\`html
<p>
  Press
  <kbd esds-kbd>⌘</kbd>
  +
  <kbd esds-kbd>K</kbd>
  to open the command menu.
</p>
\`\`\`

> [!NOTE]
> In compact contexts (buttons, inputs, tooltips), wrap the keys in a flex container with a small gap if natural whitespace spacing is not sufficient.

## Description

Adding the custom attribute \`esds-kbd\` to a \`<kbd>\` element applies the \`esds-kbd\` styles to this element.

> [!WARNING]
> The \`esds-kbd\` attribute can only be used on \`<kbd>\` elements.

> [!WARNING]
> It is expected that the \`<kbd esds-kbd>\` element is used as a **child** of a _text container_ like a \`<p>\`, \`<li>\`, \`<button>\` element.
> It is not intended to be used as a standalone/isolated element.

### Semantics

- Use \`esds-kbd\` for keyboard keys and shortcuts only. For inline code, use a \`<code>\` element instead so assistive technology conveys the right meaning.
- Do not rely on the key alone to convey an action; always pair it with a descriptive label, such as the text of the button or menu it sits beside.
- Use the same casing and symbols the user sees on their physical keyboard so the displayed key matches what they press.

Its appearance is driven by the design tokens; changes to the look belong to the token layer, not to component consumers.

## Demo
`})))()}var h;function g(){return(g=e((()=>{h=`kbd[esds-kbd]{box-sizing:border-box;padding:var(--esds-kbd-padding-block) var(--esds-kbd-padding-inline);background-color:var(--esds-kbd-background-color);border:var(--esds-kbd-border-width) solid var(--esds-kbd-border-color);border-radius:var(--esds-kbd-border-radius);color:var(--esds-kbd-content-color);font:var(--esds-kbd-font)}`})))()}var _,v;function y(){return(y=e((()=>{c(),a(),g(),_=f.parse(h),v=class e extends o{static define({registry:t=u.root}={}){t.defineOptionally(`esds-kbd`,e)}#e;constructor(e){if(e.ownerElement?.tagName!==`KBD`)throw Error(`esds-kbd attribute can only be used on <kbd> elements`);super(e)}connectedCallback(){this.#e=_.injectFrom(this.ownerElement)}disconnectedCallback(){this.#e?.(),this.#e=void 0}}})))()}var b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),i(),d(),a(),m(),y(),b=l(e=>{v.define({registry:u.of(e.ownerDocument)})}),{args:x,argTypes:S}=r(`esds-kbd`),C={title:`Components/Kbd`,component:`esds-kbd`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:p}}},args:x,argTypes:S},w={...s({text:`K`}),render:e=>t`<p>
      Press
      <kbd
        ${b}
        esds-kbd
        >${e.text}</kbd
      >
      to open the search.
    </p>`},T={parameters:{docs:{description:{story:"Multi-key shortcuts are plain markup: several `<kbd esds-kbd>` elements with a `+` separator, spaced by natural inline text flow."}}},render:()=>t`
    <p>
      Press
      <kbd
        ${b}
        esds-kbd
        >⌘</kbd
      >
      +
      <kbd
        ${b}
        esds-kbd
        >K</kbd
      >
      to open the command menu.
    </p>
  `},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    text: 'K'
  }),
  render: args => html\`<p>
      Press
      <kbd
        \${defineEsdsKbdAttr}
        esds-kbd
        >\${args.text}</kbd
      >
      to open the search.
    </p>\`
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Multi-key shortcuts are plain markup: several \`<kbd esds-kbd>\` elements with a \`+\` separator, spaced by natural inline text flow.'
      }
    }
  },
  render: () => html\`
    <p>
      Press
      <kbd
        \${defineEsdsKbdAttr}
        esds-kbd
        >⌘</kbd
      >
      +
      <kbd
        \${defineEsdsKbdAttr}
        esds-kbd
        >K</kbd
      >
      to open the command menu.
    </p>
  \`
}`,...T.parameters?.docs?.source}}},E=[`Default`,`Shortcut`]})))()}D();export{w as Default,T as Shortcut,E as __namedExportsOrder,C as default};