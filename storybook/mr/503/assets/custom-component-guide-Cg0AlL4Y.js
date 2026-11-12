import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{l as t,s as n}from"./blocks-Cr2ZIGG9.js";import{a as r}from"./chunk-W22LQPXL-CVCnKrju.js";import{i,r as a}from"./react-DITjJg24.js";var o;function s(){return(s=e((()=>{o=new URL(`custom-component-design-in-context-C4A-HgW4.png`,import.meta.url).href})))()}var c;function l(){return(l=e((()=>{c=new URL(`custom-component-edge-cases-oFQ7m0Fn.png`,import.meta.url).href})))()}var u;function d(){return(d=e((()=>{u=new URL(`custom-component-expose-dont-duplicate-BKk5h1Al.png`,import.meta.url).href})))()}var f;function p(){return(p=e((()=>{f=new URL(`custom-component-subcomponents-BpL_FUpm.png`,import.meta.url).href})))()}function m(e){let t={a:`a`,blockquote:`blockquote`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,strong:`strong`,ul:`ul`,...i(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(n,{title:`Designers Guide/Helpers/Creating a custom component`}),`
`,(0,g.jsx)(t.h1,{id:`creating-a-custom-component`,children:`Creating a custom component`}),`
`,(0,g.jsxs)(t.p,{children:[`Use this guide only when no native component covers the need, even with its properties or slots, `,(0,g.jsx)(t.strong,{children:`and`}),` the DS team has approved the creation of a custom component. If that approval hasn't happened yet, talk to the DS team before you start.`]}),`
`,(0,g.jsxs)(t.blockquote,{children:[`
`,(0,g.jsxs)(t.p,{children:[`👑 `,(0,g.jsx)(t.strong,{children:`Golden rule`}),`: don't do anything now that will have to be undone later. The component must be able to join its kit as is when it's integrated, without being taken apart.`]}),`
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
`,(0,g.jsx)(t.h2,{id:`1-design-in-context-`,children:`1. Design in context 🎨`}),`
`,(0,g.jsxs)(t.ol,{children:[`
`,(0,g.jsx)(t.li,{children:`Start with a simple frame in auto layout.`}),`
`,(0,g.jsx)(t.li,{children:`Place it in a real screen filled with real content. At this stage, it's not a component yet. The goal is to find the right shape first. Componentizing too early locks in things that will still change several times.`}),`
`,(0,g.jsx)(t.li,{children:`Once the component concept is set, validate it with the DS team and the dev teams to make sure it's feasible.`}),`
`,(0,g.jsx)(t.li,{children:`Once it's validated, convert it into a component, add all states and/or variants, then move on to step 2.`}),`
`]}),`
`,(0,g.jsx)(`img`,{src:o,alt:`A calendar event designed in a real screen: ready for the DS team to approve vs one that shouldn't be a component at this stage`}),`
`,(0,g.jsx)(t.h2,{id:`2-name-your-component-️`,children:`2. Name your component 🏷️`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[`Use `,(0,g.jsx)(t.strong,{children:`kebab-case`}),` for the component name (e.g. `,(0,g.jsx)(t.code,{children:`calendar-event`}),`, `,(0,g.jsx)(t.code,{children:`event-card`}),`).`]}),`
`,(0,g.jsxs)(t.li,{children:[`For an iOS/iPadOS 🍎 or Android 🤖 component, follow the `,(0,g.jsx)(t.strong,{children:`native naming`}),` of the platform kit instead, so the component reads like the native ones next to it.`]}),`
`,(0,g.jsxs)(t.li,{children:[`For an internal subcomponent that must not be published, prefix its name with `,(0,g.jsx)(t.code,{children:`.`}),` or `,(0,g.jsx)(t.code,{children:`_`}),`: Figma won't publish it to the library.`,`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Use the same prefix as the native kit the component belongs to.`}),`
`,(0,g.jsxs)(t.li,{children:[`If there's no native convention to follow (e.g. Token Core), use `,(0,g.jsx)(t.code,{children:`.`}),` (e.g. `,(0,g.jsx)(t.code,{children:`.month-cell`}),`).`]}),`
`]}),`
`]}),`
`]}),`
`,(0,g.jsx)(t.h2,{id:`3-assemble-native-components-`,children:`3. Assemble native components 🧱`}),`
`,(0,g.jsx)(t.p,{children:`When native components cover part of the design, assemble them in a custom container and draw only what's genuinely missing.`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[`Native parts stay native: use `,(0,g.jsx)(t.strong,{children:`linked instances`}),` of the official kit, never detached or overridden beyond their own properties, so that a kit update reaches the component without anyone touching it.`]}),`
`,(0,g.jsx)(t.li,{children:`Expose the properties of nested native instances instead of recreating them on the container.`}),`
`,(0,g.jsx)(t.li,{children:`Don't recreate native states as variants of the container: a disabled Button is handled by the Button itself.`}),`
`,(0,g.jsx)(t.li,{children:`Native instances keep their native name (Button, Toggle…).`}),`
`,(0,g.jsx)(t.li,{children:`Each native part must have a code equivalent.`}),`
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
`,(0,g.jsx)(t.h2,{id:`5-extract-only-when-needed-`,children:`5. Extract only when needed 🧩`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Create a subcomponent only if it has its own states or is reused elsewhere. Otherwise, keep a simple frame.`}),`
`,(0,g.jsxs)(t.li,{children:[`For an internal subcomponent, prefix its name with `,(0,g.jsx)(t.code,{children:`.`}),` or `,(0,g.jsx)(t.code,{children:`_`}),` following the naming rules from step 2: Figma won't publish it to the library.`]}),`
`]}),`
`,(0,g.jsx)(`img`,{src:f,alt:`An internal month-cell subcomponent reused as labels inside a calendar component`}),`
`,(0,g.jsx)(t.h2,{id:`6-ready-to-use-component-checklist-`,children:`6. Ready-to-use component checklist ✅`}),`
`,(0,g.jsx)(t.h3,{id:`tokens`,children:`Tokens`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`The tokens from its respective kit are applied`}),`
`,(0,g.jsxs)(t.li,{children:[`The right tokens are used (e.g. no `,(0,g.jsx)(t.code,{children:`background`}),` token on text)`]}),`
`,(0,g.jsx)(t.li,{children:`No hard-coded values left (color, spacing, radius)`}),`
`,(0,g.jsx)(t.li,{children:`Text styles are applied, not local sizes and weights`}),`
`,(0,g.jsx)(t.li,{children:`The component is checked in light and dark mode`}),`
`,(0,g.jsx)(t.li,{children:`Icons come from Iconography, with no imported or flattened icons`}),`
`]}),`
`,(0,g.jsx)(t.h3,{id:`properties`,children:`Properties`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Default values are usable as is (default state, realistic text)`}),`
`,(0,g.jsx)(t.li,{children:`Properties are properly named, in English`}),`
`,(0,g.jsx)(t.li,{children:`Native kit naming is used whenever possible (e.g. symbol, leading, trailing…)`}),`
`,(0,g.jsx)(t.li,{children:`Showing or hiding an element uses a boolean, not a variant`}),`
`,(0,g.jsx)(t.li,{children:`Instance swaps offer preferred values (e.g. the relevant Iconography icons)`}),`
`,(0,g.jsx)(t.li,{children:`Properties of nested instances are exposed when needed`}),`
`,(0,g.jsx)(t.li,{children:`No unused or invalid properties left behind`}),`
`]}),`
`,(0,g.jsx)(t.h3,{id:`native-instances`,children:`Native instances`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Native parts are linked instances from the official kit library`}),`
`,(0,g.jsx)(t.li,{children:`No detached instances, no overrides beyond their own properties`}),`
`,(0,g.jsx)(t.li,{children:`Native layers keep their native name (Button, Toggle…)`}),`
`]}),`
`,(0,g.jsx)(t.h3,{id:`structure`,children:`Structure`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`Auto layout is applied`}),`
`,(0,g.jsx)(t.li,{children:`Layers are named (no "Frame 427"), with no hidden layers or leftover groups`}),`
`,(0,g.jsx)(t.li,{children:`The component resizes correctly (hug and fill tested, min/max width if needed)`}),`
`,(0,g.jsx)(t.li,{children:`Long-text behavior is defined (wrapping or truncation)`}),`
`,(0,g.jsx)(t.li,{children:`Slots are used wisely (e.g. avoid multiple variants just to change how many times an element appears)`}),`
`,(0,g.jsx)(t.li,{children:`The component is named in kebab-case, or follows the native kit naming (see step 2)`}),`
`,(0,g.jsxs)(t.li,{children:[`Internal subcomponents are prefixed with `,(0,g.jsx)(t.code,{children:`.`}),` or `,(0,g.jsx)(t.code,{children:`_`}),`, following the native kit convention (`,(0,g.jsx)(t.code,{children:`.`}),` by default)`]}),`
`]}),`
`,(0,g.jsx)(t.h2,{id:`7-integration-into-the-kit-by-the-ds-team-`,children:`7. Integration into the kit by the DS team 🌼`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsx)(t.li,{children:`All states required by the kit are present`}),`
`,(0,g.jsx)(t.li,{children:`A usage doc explains why this component exists instead of a native equivalent`}),`
`]})]})}function h(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;function _(){return(_=e((()=>{g=r(),a(),t(),s(),l(),d(),p()})))()}_();export{h as default};