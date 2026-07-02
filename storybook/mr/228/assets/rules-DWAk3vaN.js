import{i as e}from"./preload-helper-CT_b8DTk.js";import{k as t,l as n,m as r,u as i}from"./iframe-BDCqTINb.js";import{t as a}from"./mdx-react-shim-DwDNhtdC.js";function o(e){let t={blockquote:`blockquote`,h1:`h1`,h2:`h2`,h3:`h3`,hr:`hr`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...r(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Components/Rules`}),`
`,(0,c.jsx)(t.h1,{id:`technical-limitations--figma-kit-iosipados-vs-dev`,children:`Technical Limitations — Figma Kit iOS/iPadOS vs Dev`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`Goal:`}),` identify which components can be modified and their related constraints.`]}),`
`,(0,c.jsx)(t.hr,{}),`
`,(0,c.jsx)(t.h2,{id:`system`,children:`System`}),`
`,(0,c.jsx)(t.p,{children:`Hold actions:`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Title`}),` + `,(0,c.jsx)(t.strong,{children:`Description`}),`: max 2 lines in standard use (avoid if possible), otherwise 1 line max.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Widgets`}),` cannot be customized (display latency can go up to `,(0,c.jsx)(t.strong,{children:`15 min`}),`)`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`action-sheets`,children:`Action Sheets`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Title, short description (single simple sentence), CTAs `,(0,c.jsx)(t.strong,{children:`Primary`}),`, `,(0,c.jsx)(t.strong,{children:`Secondary`}),`, `,(0,c.jsx)(t.strong,{children:`Destructive`}),`.`]}),`
`,(0,c.jsx)(t.li,{children:`Controls must remain consistent across the entire app.`}),`
`,(0,c.jsxs)(t.li,{children:[`⚠️ No different `,(0,c.jsx)(t.strong,{children:`Primary`}),` colors from one screen to another.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`activity-views`,children:`Activity Views`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Only possible to `,(0,c.jsx)(t.strong,{children:`add actions`}),`.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`alerts`,children:`Alerts`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Same as Action Sheets, with an additional `,(0,c.jsx)(t.strong,{children:`input field`}),`.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`buttons`,children:`Buttons`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Accent color`}),` modifiable on the Primary only.`]}),`
`,(0,c.jsxs)(t.li,{children:[`To go further → build `,(0,c.jsx)(t.strong,{children:`fully custom`}),` buttons, while staying close to the iOS style.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`IC light`}),` and `,(0,c.jsx)(t.strong,{children:`IC dark`}),` values are handled by Apple (they add an extra layer).`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Liquid Glass`}),` — 3 available modes:`,`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`Colored Tinted`}),`
`,(0,c.jsx)(t.li,{children:`Colored Transparent Tinted`}),`
`,(0,c.jsx)(t.li,{children:`Transparent`}),`
`]}),`
`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`color-picker`,children:`Color Picker`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`contextual-menus`,children:`Contextual Menus`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Very limited`}),` customization.`]}),`
`,(0,c.jsxs)(t.li,{children:[`We can use `,(0,c.jsx)(t.strong,{children:`our own icons`}),`.`]}),`
`,(0,c.jsx)(t.li,{children:`💡 Jordan C. is a good reference on this component → reach out to him for any questions about its usage.`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`empty-states`,children:`Empty States`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`On the dev side: called `,(0,c.jsx)(t.strong,{children:`"Content unavailable view"`}),`.`]}),`
`,(0,c.jsx)(t.li,{children:`Contains: title, description, image, action.`}),`
`,(0,c.jsx)(t.li,{children:`Rarely used.`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`face-id`,children:`Face ID`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`lists`,children:`Lists`}),`
`,(0,c.jsx)(t.h3,{id:`header`,children:`Header`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Supertitle`}),` and `,(0,c.jsx)(t.strong,{children:`Subtitle`}),` are poorly handled in terms of backward compatibility → do not put critical information in them.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Nested`}),` version: requires an action on the right in `,(0,c.jsx)(t.strong,{children:`text`}),` form.`]}),`
`]}),`
`,(0,c.jsx)(t.h3,{id:`row-swipe-actions`,children:`Row swipe actions`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Icons`}),` and `,(0,c.jsx)(t.strong,{children:`actions`}),` are modifiable.`]}),`
`,(0,c.jsx)(t.li,{children:`For the rest: check directly with the devs.`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`menus`,children:`Menus`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Same constraints as `,(0,c.jsx)(t.strong,{children:`Contextual Menus`}),`.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`notifications`,children:`Notifications`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`page-control`,children:`Page Control`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`pickers`,children:`Pickers`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`❌ Cannot be edited`,`
`,(0,c.jsxs)(t.blockquote,{children:[`
`,(0,c.jsx)(t.p,{children:`Useful for quick flows (e.g. simple event creation).`}),`
`]}),`
`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`popovers`,children:`Popovers`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`📱 `,(0,c.jsx)(t.strong,{children:`iPad only`}),`.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`pop-up-buttons`,children:`Pop-up Buttons`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Accent color`}),` modifiable only.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`progress-indicators`,children:`Progress Indicators`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Accent color`}),` modifiable only.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`segmented-controls`,children:`Segmented Controls`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`sheets`,children:`Sheets`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Grabber`}),` required if the sheet can be dismissed via swipe.`]}),`
`,(0,c.jsxs)(t.li,{children:[`3 heights enforced by Apple: `,(0,c.jsx)(t.strong,{children:`small`}),`, `,(0,c.jsx)(t.strong,{children:`medium`}),`, `,(0,c.jsx)(t.strong,{children:`large`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Inspector`}),`: always slightly transparent (see the Maps app).`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Full screen cover`}),` = takes the entire screen, `,(0,c.jsx)(t.strong,{children:`no grabber`}),`.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`sidebar`,children:`Sidebar`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`📱 `,(0,c.jsx)(t.strong,{children:`iPad only`}),`.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`sliders`,children:`Sliders`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Accent color`}),` modifiable only.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Scale can be modified but with `,(0,c.jsx)(t.strong,{children:`linear steps`}),`:`,`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`✅ 5, 10, 15… or 10, 20, 30…`}),`
`,(0,c.jsx)(t.li,{children:`❌ No random values (3, 7, 19…).`}),`
`]}),`
`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`status-bar--menu-bar`,children:`Status Bar & Menu Bar`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`steppers`,children:`Steppers`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Either as-is, or `,(0,c.jsx)(t.strong,{children:`fully custom`}),`. No in-between.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`tab-bar`,children:`Tab Bar`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Widths are `,(0,c.jsx)(t.strong,{children:`not stretchable`}),` — use them as they are.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Only `,(0,c.jsx)(t.strong,{children:`color`}),` and `,(0,c.jsx)(t.strong,{children:`icon`}),` are modifiable.`]}),`
`,(0,c.jsxs)(t.li,{children:[`📱 On iPad: can be displayed at the top or the bottom → `,(0,c.jsx)(t.strong,{children:`prefer the top`}),` (like Apple TV).`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`text-fields`,children:`Text Fields`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`The `,(0,c.jsx)(t.strong,{children:`accent color bar`}),` (input) is `,(0,c.jsx)(t.strong,{children:`unique across the entire app`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`List background colors`}),`: easily modifiable.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Placeholders`}),` use transparency → do not touch the colors.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`toggle`,children:`Toggle`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`toolbars`,children:`Toolbars`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`It's possible to `,(0,c.jsx)(t.strong,{children:`force`}),` large or small title display → but `,(0,c.jsx)(t.strong,{children:`prefer the native behavior`}),`:`,`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`Large title that shrinks on scroll.`}),`
`,(0,c.jsx)(t.li,{children:`Small title when used in a sheet.`}),`
`]}),`
`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Accent color`}),` is modifiable, nothing else.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`widgets`,children:`Widgets`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`❌ Cannot be edited`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`windows`,children:`Windows`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`⚪ Not applicable.`}),`
`]}),`
`,(0,c.jsx)(t.hr,{}),`
`,(0,c.jsx)(t.h2,{id:`quick-summary`,children:`Quick summary`}),`
`,(0,c.jsx)(t.p,{children:`| Category                       | Components                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| 🟢 Customizable (accent color) | Buttons, Pop-up Buttons, Progress Indicators, Sliders, Toolbars                                                           |
| 🟡 Partially customizable      | System, Action Sheets, Alerts, Activity Views, Contextual Menus, Menus, Lists, Empty States, Text Fields, Sheets, Tab Bar |
| 🟠 As-is or fully custom       | Segmented Controls, Steppers, Pickers                                                                                     |
| 🔴 Cannot be edited            | Color Picker, Face ID, Notifications, Page Control, Status Bar, Menu Bar, Toggle, Widgets                                 |
| 📱 iPad only                   | Popovers, Sidebar                                                                                                         |`})]})}function s(e={}){let{wrapper:t}={...r(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),i()}))();export{s as default};