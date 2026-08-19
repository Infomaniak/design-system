import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./blocks-Bh_5PVZc.js";import{a as r}from"./chunk-W22LQPXL-Bced4FlR.js";import{i,r as a}from"./react-Bl2r1tuC.js";function o(e){let n={blockquote:`blockquote`,h1:`h1`,h2:`h2`,h3:`h3`,hr:`hr`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...i(),...e.components},{Table:r}=n;return r||c(`Table`,!0),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(t,{title:`Components/Technical Limitations`}),`
`,(0,l.jsx)(n.h1,{id:`technical-limitations--figma-kit-iosipados-vs-dev`,children:`Technical Limitations — Figma Kit iOS/iPadOS vs Dev`}),`
`,(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:`Goal:`}),` identify which components can be modified and their related constraints.`]}),`
`,(0,l.jsx)(n.hr,{}),`
`,(0,l.jsx)(n.h2,{id:`system`,children:`System`}),`
`,(0,l.jsx)(n.p,{children:`Hold actions:`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Title`}),` + `,(0,l.jsx)(n.strong,{children:`Description`}),`: max 2 lines in standard use (avoid if possible), otherwise 1 line max.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Widgets`}),` cannot be customized (display latency can go up to `,(0,l.jsx)(n.strong,{children:`15 min`}),`)`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`action-sheets`,children:`Action Sheets`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Title, short description (single simple sentence), CTAs `,(0,l.jsx)(n.strong,{children:`Primary`}),`, `,(0,l.jsx)(n.strong,{children:`Secondary`}),`, `,(0,l.jsx)(n.strong,{children:`Destructive`}),`.`]}),`
`,(0,l.jsx)(n.li,{children:`Controls must remain consistent across the entire app.`}),`
`,(0,l.jsxs)(n.li,{children:[`⚠️ No different `,(0,l.jsx)(n.strong,{children:`Primary`}),` colors from one screen to another.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`activity-views`,children:`Activity Views`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Only possible to `,(0,l.jsx)(n.strong,{children:`add actions`}),`.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`alerts`,children:`Alerts`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Same as Action Sheets, with an additional `,(0,l.jsx)(n.strong,{children:`input field`}),`.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`buttons`,children:`Buttons`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Accent color`}),` modifiable on the Primary only.`]}),`
`,(0,l.jsxs)(n.li,{children:[`To go further → build `,(0,l.jsx)(n.strong,{children:`fully custom`}),` buttons, while staying close to the iOS style.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`IC light`}),` and `,(0,l.jsx)(n.strong,{children:`IC dark`}),` values are handled by Apple (they add an extra layer).`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Liquid Glass`}),` — 3 available modes:`,`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`Colored Tinted`}),`
`,(0,l.jsx)(n.li,{children:`Colored Transparent Tinted`}),`
`,(0,l.jsx)(n.li,{children:`Transparent`}),`
`]}),`
`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`color-picker`,children:`Color Picker`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`contextual-menus`,children:`Contextual Menus`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Very limited`}),` customization.`]}),`
`,(0,l.jsxs)(n.li,{children:[`We can use `,(0,l.jsx)(n.strong,{children:`our own icons`}),`.`]}),`
`,(0,l.jsx)(n.li,{children:`💡 Jordan C. is a good reference on this component → reach out to him for any questions about its usage.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`empty-states`,children:`Empty States`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`On the dev side: called `,(0,l.jsx)(n.strong,{children:`"Content unavailable view"`}),`.`]}),`
`,(0,l.jsx)(n.li,{children:`Contains: title, description, image, action.`}),`
`,(0,l.jsx)(n.li,{children:`Rarely used.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`face-id`,children:`Face ID`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`lists`,children:`Lists`}),`
`,(0,l.jsx)(n.h3,{id:`header`,children:`Header`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Supertitle`}),` and `,(0,l.jsx)(n.strong,{children:`Subtitle`}),` are poorly handled in terms of backward compatibility → do not put critical information in them.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Nested`}),` version: requires an action on the right in `,(0,l.jsx)(n.strong,{children:`text`}),` form.`]}),`
`]}),`
`,(0,l.jsx)(n.h3,{id:`row-swipe-actions`,children:`Row swipe actions`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Icons`}),` and `,(0,l.jsx)(n.strong,{children:`actions`}),` are modifiable.`]}),`
`,(0,l.jsx)(n.li,{children:`For the rest: check directly with the devs.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`menus`,children:`Menus`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Same constraints as `,(0,l.jsx)(n.strong,{children:`Contextual Menus`}),`.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`notifications`,children:`Notifications`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`page-control`,children:`Page Control`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`pickers`,children:`Pickers`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`❌ Cannot be edited`,`
`,(0,l.jsxs)(n.blockquote,{children:[`
`,(0,l.jsx)(n.p,{children:`Useful for quick flows (e.g. simple event creation).`}),`
`]}),`
`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`popovers`,children:`Popovers`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`📱 `,(0,l.jsx)(n.strong,{children:`iPad only`}),`.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`pop-up-buttons`,children:`Pop-up Buttons`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Accent color`}),` modifiable only.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`progress-indicators`,children:`Progress Indicators`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Accent color`}),` modifiable only.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`segmented-controls`,children:`Segmented Controls`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`sheets`,children:`Sheets`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Grabber`}),` required if the sheet can be dismissed via swipe.`]}),`
`,(0,l.jsxs)(n.li,{children:[`3 heights enforced by Apple: `,(0,l.jsx)(n.strong,{children:`small`}),`, `,(0,l.jsx)(n.strong,{children:`medium`}),`, `,(0,l.jsx)(n.strong,{children:`large`}),`.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Inspector`}),`: always slightly transparent (see the Maps app).`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Full screen cover`}),` = takes the entire screen, `,(0,l.jsx)(n.strong,{children:`no grabber`}),`.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`sidebar`,children:`Sidebar`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`📱 `,(0,l.jsx)(n.strong,{children:`iPad only`}),`.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`sliders`,children:`Sliders`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Accent color`}),` modifiable only.`]}),`
`,(0,l.jsxs)(n.li,{children:[`Scale can be modified but with `,(0,l.jsx)(n.strong,{children:`linear steps`}),`:`,`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`✅ 5, 10, 15… or 10, 20, 30…`}),`
`,(0,l.jsx)(n.li,{children:`❌ No random values (3, 7, 19…).`}),`
`]}),`
`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`status-bar--menu-bar`,children:`Status Bar & Menu Bar`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`steppers`,children:`Steppers`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Either as-is, or `,(0,l.jsx)(n.strong,{children:`fully custom`}),`. No in-between.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`tab-bar`,children:`Tab Bar`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Widths are `,(0,l.jsx)(n.strong,{children:`not stretchable`}),` — use them as they are.`]}),`
`,(0,l.jsxs)(n.li,{children:[`Only `,(0,l.jsx)(n.strong,{children:`color`}),` and `,(0,l.jsx)(n.strong,{children:`icon`}),` are modifiable.`]}),`
`,(0,l.jsxs)(n.li,{children:[`📱 On iPad: can be displayed at the top or the bottom → `,(0,l.jsx)(n.strong,{children:`prefer the top`}),` (like Apple TV).`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`text-fields`,children:`Text Fields`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`The `,(0,l.jsx)(n.strong,{children:`accent color bar`}),` (input) is `,(0,l.jsx)(n.strong,{children:`unique across the entire app`}),`.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`List background colors`}),`: easily modifiable.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Placeholders`}),` use transparency → do not touch the colors.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`toggle`,children:`Toggle`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`toolbars`,children:`Toolbars`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`It's possible to `,(0,l.jsx)(n.strong,{children:`force`}),` large or small title display → but `,(0,l.jsx)(n.strong,{children:`prefer the native behavior`}),`:`,`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`Large title that shrinks on scroll.`}),`
`,(0,l.jsx)(n.li,{children:`Small title when used in a sheet.`}),`
`]}),`
`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Accent color`}),` is modifiable, nothing else.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`widgets`,children:`Widgets`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`windows`,children:`Windows`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`⚪ Not applicable.`}),`
`]}),`
`,(0,l.jsx)(n.hr,{}),`
`,(0,l.jsx)(n.h2,{id:`quick-summary`,children:`Quick summary`}),`
`,(0,l.jsx)(r,{headers:[`Category`,`Components`],rows:[[`🟢 Customizable (accent color)`,`Buttons, Pop-up Buttons, Progress Indicators, Sliders, Toolbars`],[`🟡 Partially customizable`,`System, Action Sheets, Alerts, Activity Views, Contextual Menus, Menus, Lists, Empty States, Text Fields, Sheets, Tab Bar`],[`🟠 As-is or fully custom`,`Segmented Controls, Steppers, Pickers`],[`🔴 Cannot be edited`,`Color Picker, Face ID, Notifications, Page Control, Status Bar, Menu Bar, Toggle, Widgets`],[`📱 iPad only`,`Popovers, Sidebar`]]})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,l.jsx)(t,{...e,children:(0,l.jsx)(o,{...e})}):o(e)}function c(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}var l;function u(){return(u=e((()=>{l=r(),a(),n()})))()}u();export{s as default};