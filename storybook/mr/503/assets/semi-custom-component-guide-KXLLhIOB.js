import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{l as t,s as n}from"./blocks-Cr2ZIGG9.js";import{a as r}from"./chunk-W22LQPXL-CVCnKrju.js";import{i,r as a}from"./react-DITjJg24.js";var o;function s(){return(s=e((()=>{o=new URL(`semi-custom-component-design-in-context-B4v9l1f6.png`,import.meta.url).href})))()}var c;function l(){return(l=e((()=>{c=new URL(`semi-custom-component-edge-cases-uWPlNZR0.png`,import.meta.url).href})))()}var u;function d(){return(d=e((()=>{u=new URL(`semi-custom-component-expose-dont-duplicate-BKk5h1Al.png`,import.meta.url).href})))()}var f;function p(){return(p=e((()=>{f=new URL(`semi-custom-component-naming-DbqwSQcO.png`,import.meta.url).href})))()}function m(e){let t={a:`a`,blockquote:`blockquote`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...i(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(n,{title:`Designers Guide/Helpers/Creating a semi-custom component`}),`
`,(0,g.jsx)(t.h1,{id:`creating-a-semi-custom-component`,children:`Creating a semi-custom component`}),`
`,(0,g.jsx)(t.p,{children:`A semi-custom component is a custom container that assembles native components from the kit. Use
this guide only when no native component covers the need, even with its properties or slots.`}),`
`,(0,g.jsxs)(t.blockquote,{children:[`
`,(0,g.jsxs)(t.p,{children:[`👑 `,(0,g.jsx)(t.strong,{children:`Golden rule:`}),` native parts stay native. They remain linked instances of the official kit,
never detached or overridden, so that a kit update reaches the component without anyone touching
it.`]}),`
`]}),`
`,(0,g.jsx)(t.h2,{id:`which-tokens-for-which-component`,children:`Which tokens for which component?`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[`🍎 `,(0,g.jsx)(t.strong,{children:`iOS/iPadOS component`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[`Colors:
`,(0,g.jsx)(t.a,{href:`https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2-260&t=U8dJUATnrl0en4i0-11`,rel:`nofollow`,children:`Token Core`})]}),`
`,(0,g.jsxs)(t.li,{children:[`Text styles:
`,(0,g.jsx)(t.a,{href:`https://www.figma.com/design/OFCRdaeYW6GWhyq3ocHSOc/Edelweiss---iOS---iPadOS-Kit?m=auto&t=6Praqzvd4yFcNUmT-6`,rel:`nofollow`,children:`iOS/iPadOS kit`})]}),`
`]}),`
`]}),`
`,(0,g.jsxs)(t.li,{children:[`🤖 `,(0,g.jsx)(t.strong,{children:`Material component`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[`Colors and text styles:
`,(0,g.jsx)(t.a,{href:`https://www.figma.com/design/r4D2DKWIyzVoigyiTh16Hh/Edelweiss---Material-Kit?m=auto&t=6Praqzvd4yFcNUmT-6`,rel:`nofollow`,children:`Material kit`})]}),`
`]}),`
`]}),`
`,(0,g.jsxs)(t.li,{children:[`⬛️ `,(0,g.jsx)(t.strong,{children:`Shadcn component`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[`Colors and text styles:
`,(0,g.jsx)(t.a,{href:`https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2-260&t=U8dJUATnrl0en4i0-11`,rel:`nofollow`,children:`Token Core`})]}),`
`]}),`
`]}),`
`]}),`
`,(0,g.jsx)(t.p,{children:`The container uses the tokens of its kit. Native instances keep their own.`}),`
`,(0,g.jsx)(t.h2,{id:`1-design-in-context-`,children:`1. Design in context 🎨`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Start with a simple frame in auto layout and drop in real instances from the kit. Don't redraw
elements that look native.`}),`
`,(0,g.jsx)(t.li,{children:`Place it in a real screen filled with real content. At this stage, it's not a component yet.`}),`
`,(0,g.jsx)(t.li,{children:`Once the concept is set, validate it with the DS team and the dev teams. Each native part must
have a code equivalent.`}),`
`,(0,g.jsx)(t.li,{children:`Once it's validated, convert it into a component, add the container's states and/or variants,
then move on to step 2.`}),`
`]}),`
`,(0,g.jsx)(`img`,{src:o,alt:`A calendar screen designed with real content: ready for the DS team to approve vs one that shouldn't be a component at this stage`}),`
`,(0,g.jsx)(t.h2,{id:`2-name-your-component-️`,children:`2. Name your component 🏷️`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[`Use `,(0,g.jsx)(t.strong,{children:`kebab-case`}),` for the component name (e.g. `,(0,g.jsx)(t.code,{children:`calendar-event`}),`, `,(0,g.jsx)(t.code,{children:`event-card`}),`).`]}),`
`,(0,g.jsxs)(t.li,{children:[`For an iOS/iPadOS 🍎 or Android 🤖 component, follow the `,(0,g.jsx)(t.strong,{children:`native naming`}),` of the platform kit
instead, so the component reads like the native ones next to it.`]}),`
`,(0,g.jsx)(t.li,{children:`Native instances inside the component keep their native name (Button, Toggle…).`}),`
`,(0,g.jsxs)(t.li,{children:[`For an internal subcomponent that must not be published, prefix its name with `,(0,g.jsx)(t.code,{children:`.`}),` or `,(0,g.jsx)(t.code,{children:`_`}),`: Figma
won't publish it to the library.`,`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Use the same prefix as the native kit the component belongs to.`}),`
`,(0,g.jsxs)(t.li,{children:[`If there's no native convention to follow, use `,(0,g.jsx)(t.code,{children:`.`}),` (e.g. `,(0,g.jsx)(t.code,{children:`.month-cell`}),`).`]}),`
`]}),`
`]}),`
`]}),`
`,(0,g.jsx)(`img`,{src:f,alt:`An internal month-cell subcomponent reused as labels inside a calendar component`}),`
`,(0,g.jsx)(t.h2,{id:`3-expose-dont-duplicate-`,children:`3. Expose, don't duplicate 🔗`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Expose the properties of nested native instances instead of recreating them on the container.`}),`
`,(0,g.jsx)(t.li,{children:`Don't recreate native states as variants of the container: a disabled Button is handled by the
Button itself.`}),`
`]}),`
`,(0,g.jsx)(`img`,{src:u,alt:`A snackbar component exposing its nested native Button instance vs one recreating the Button states as variants`}),`
`,(0,g.jsx)(t.h2,{id:`4-test-the-edge-cases-`,children:`4. Test the edge cases 😥`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Very long text`}),`
`,(0,g.jsx)(t.li,{children:`Empty content`}),`
`,(0,g.jsx)(t.li,{children:`Variable widths`}),`
`,(0,g.jsx)(t.li,{children:`Native states inside each container state`}),`
`,(0,g.jsx)(t.li,{children:`Liquid Glass background for iOS/iPadOS 🍎`}),`
`]}),`
`,(0,g.jsx)(`img`,{src:c,alt:`An event component with a very long title wrapping onto two lines instead of overlapping the trailing icons`}),`
`,(0,g.jsx)(t.h2,{id:`5-ready-to-use-component-checklist-`,children:`5. Ready-to-use component checklist ✅`}),`
`,(0,g.jsx)(t.h3,{id:`native-instances`,children:`Native instances`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Native parts are linked instances from the official kit library`}),`
`,(0,g.jsx)(t.li,{children:`No detached instances, no overrides beyond their own properties`}),`
`,(0,g.jsx)(t.li,{children:`Native layers keep their native name (Button, Toggle…)`}),`
`]}),`
`,(0,g.jsx)(t.h3,{id:`tokens`,children:`Tokens`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`The container uses the tokens of its kit, with no hard-coded values`}),`
`,(0,g.jsx)(t.li,{children:`Text styles are applied, not local sizes and weights`}),`
`,(0,g.jsx)(t.li,{children:`The component is checked in light and dark mode`}),`
`,(0,g.jsx)(t.li,{children:`Icons come from Iconography, with no imported or flattened icons`}),`
`]}),`
`,(0,g.jsx)(t.h3,{id:`properties`,children:`Properties`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Default values are usable as is (default state, realistic text)`}),`
`,(0,g.jsx)(t.li,{children:`Properties are properly named, in English, using native kit naming whenever possible`}),`
`,(0,g.jsx)(t.li,{children:`Showing or hiding an element uses a boolean, not a variant`}),`
`,(0,g.jsx)(t.li,{children:`Instance swaps and slots only offer the allowed native components`}),`
`,(0,g.jsx)(t.li,{children:`No unused or invalid properties left behind`}),`
`]}),`
`,(0,g.jsx)(t.h3,{id:`structure`,children:`Structure`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Auto layout is applied`}),`
`,(0,g.jsx)(t.li,{children:`Layers are named, with no hidden layers or leftover groups`}),`
`,(0,g.jsx)(t.li,{children:`The component resizes correctly (hug and fill tested)`}),`
`,(0,g.jsx)(t.li,{children:`Long-text behavior is defined (wrapping or truncation)`}),`
`,(0,g.jsx)(t.li,{children:`The component is named in kebab-case, or follows the native kit naming (see step 2)`}),`
`,(0,g.jsxs)(t.li,{children:[`Internal subcomponents are prefixed with `,(0,g.jsx)(t.code,{children:`.`}),` or `,(0,g.jsx)(t.code,{children:`_`}),`, following the native kit convention (`,(0,g.jsx)(t.code,{children:`.`}),` by
default)`]}),`
`]}),`
`,(0,g.jsx)(t.h2,{id:`6-integration-into-the-kit-by-the-ds-team-`,children:`6. Integration into the kit by the DS team 🌼`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`All states required by the kit are present`}),`
`,(0,g.jsx)(t.li,{children:`A usage doc explains why this component exists instead of a native one, and lists the native
components it relies on`}),`
`]})]})}function h(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;function _(){return(_=e((()=>{g=r(),a(),t(),s(),l(),d(),p()})))()}_();export{h as default};