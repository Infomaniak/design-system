import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./blocks-mr7koxZ1.js";import{a as r}from"./chunk-W22LQPXL-C8DL1y5I.js";import{i,r as a}from"./react-Bl2r1tuC.js";function o(e){let n={h1:`h1`,h2:`h2`,hr:`hr`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...i(),...e.components},{Table:r}=n;return r||c(`Table`,!0),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(t,{title:`Designers Guide/Android/Android - Technical Limitations`}),`
`,(0,l.jsx)(n.h1,{id:`technical-limitations--figma-kit-android`,children:`Technical Limitations — Figma Kit Android`}),`
`,(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.strong,{children:`Goal:`}),` determine how the components can be used and any related constraints.`]}),`
`,(0,l.jsx)(n.hr,{}),`
`,(0,l.jsx)(n.h2,{id:`overall-backward-compatibility`,children:`Overall backward compatibility`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Jetpack Compose`}),` keeps components compatible regardless of the OS, unlike Apple.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`app-bars`,children:`App Bars`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`XR (Mixed Reality)`}),`, intended for virtual reality headsets → to be removed from the entire
kit.`]}),`
`,(0,l.jsxs)(n.li,{children:[`The `,(0,l.jsx)(n.strong,{children:`left-aligned label`}),` version can use a `,(0,l.jsx)(n.strong,{children:`hamburger menu`}),` instead of the arrow.`]}),`
`,(0,l.jsxs)(n.li,{children:[`3 parameters: `,(0,l.jsx)(n.strong,{children:`nav`}),`, `,(0,l.jsx)(n.strong,{children:`title`}),`, `,(0,l.jsx)(n.strong,{children:`action`}),`.`,`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Nav`}),` → free.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Action`}),` → free, but `,(0,l.jsx)(n.strong,{children:`max 3 icons`}),` recommended (more is possible but discouraged).`]}),`
`]}),`
`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`avatars`,children:`Avatars`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Infomaniak-specific`}),` component, created by the devs.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Colors`}),` freely configurable.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`badges`,children:`Badges`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`No issues Figma/Dev. Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`buttons`,children:`Buttons`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Provide the `,(0,l.jsx)(n.strong,{children:`raw icons`}),` for the different sizes depending on the stroke — `,(0,l.jsx)(n.strong,{children:`variable strokes`}),`
are reserved for web.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Button group`}),` = buttons combined together.`,`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`Design side: prefer it as soon as several buttons are used (recommended, not mandatory).`}),`
`,(0,l.jsxs)(n.li,{children:[`Dev side: handles `,(0,l.jsx)(n.strong,{children:`toggle buttons`}),` automatically (animation, etc.).`]}),`
`]}),`
`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`FAB`}),` = reserved for a primary action at the bottom right; otherwise, they are simple
`,(0,l.jsx)(n.strong,{children:`icon buttons`}),`.`]}),`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed for the rest.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`cards`,children:`Cards`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`The component `,(0,l.jsx)(n.strong,{children:`does not exist as-is on the Android side`}),` — to be built by the devs.`]}),`
`,(0,l.jsxs)(n.li,{children:[`Easily replicable structure, but `,(0,l.jsx)(n.strong,{children:`not callable by default`}),` in this form.`]}),`
`,(0,l.jsxs)(n.li,{children:[`The devs only have the `,(0,l.jsx)(n.strong,{children:`slot version`}),`.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`carousel`,children:`Carousel`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`No issues Figma/Dev. Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`checkbox`,children:`Checkbox`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Extended colors`}),` can be used beyond the default ones.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`chips`,children:`Chips`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Like the buttons: prefer the `,(0,l.jsx)(n.strong,{children:`chip group`}),` as soon as several chips are used, for better dev
integration.`]}),`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed for the rest.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`date--time-picker`,children:`Date & Time Picker`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Either `,(0,l.jsx)(n.strong,{children:`reused as-is`}),`, or `,(0,l.jsx)(n.strong,{children:`rebuilt from scratch`}),` — the existing Calendar cells cannot be used
directly, the devs will have to recode them.`]}),`
`,(0,l.jsxs)(n.li,{children:[`Icons `,(0,l.jsx)(n.strong,{children:`cannot be replaced`}),` with ours.`]}),`
`,(0,l.jsxs)(n.li,{children:[`The `,(0,l.jsx)(n.strong,{children:`input`}),` is a component separate from the date/time picker, to keep our calendar icon and
avoid visual differences in a form.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`dialogs`,children:`Dialogs`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Dialog`}),`: max 2 actions — adding more is discouraged (otherwise manual development).`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`List dialog`}),`: fully custom — can contain something other than a list (image, etc.).`]}),`
`,(0,l.jsxs)(n.li,{children:[`One of the actions can be `,(0,l.jsx)(n.strong,{children:`destructive`}),`, even though this is not natively available in the
component.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`dividers`,children:`Dividers`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Divider + Subheader`}),` does not exist in code — to be rebuilt manually.`]}),`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed for the rest.`}),`
`,(0,l.jsx)(n.li,{children:`⚠️ Action item: improve the Material component to create a dedicated set.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`lists`,children:`Lists`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Icons`}),` can be replaced with our own (icon or chevron).`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Swipe actions`}),` can be modified, `,(0,l.jsx)(n.strong,{children:`max 3`}),`.`]}),`
`,(0,l.jsx)(n.li,{children:`No background by default, but one can be added.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`loading--progress`,children:`Loading & Progress`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`No issues Figma/Dev. Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`menu`,children:`Menu`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Icons`}),` can be replaced with our own (icon or chevron).`]}),`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`navigation`,children:`Navigation`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Navigation rail`}),`: tablet/desktop only. 📱💻`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Navigation bar`}),`: mobile or very small screens.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Drawer`}),`: still used for some cases, despite being deprecated by Material.`]}),`
`,(0,l.jsx)(n.li,{children:`⚠️ No long text: beyond that, the text is truncated with "…", which Material discourages.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`radio-button`,children:`Radio Button`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`No issues Figma/Dev. Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`search`,children:`Search`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Reuses the `,(0,l.jsx)(n.strong,{children:`list items`}),` → fully customizable.`]}),`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`shape`,children:`Shape`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`sheets`,children:`Sheets`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Side sheets`}),` not available on Jetpack Compose for now (as of June 2026).`]}),`
`,(0,l.jsx)(n.li,{children:`⚠️ Avoid overly experimental gradients: the content can be scrolled and the gradient risks being
blocked by the handle.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`sliders`,children:`Sliders`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`snackbar`,children:`Snackbar`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Additional `,(0,l.jsx)(n.strong,{children:`colors`}),` can be considered.`]}),`
`,(0,l.jsxs)(n.li,{children:[`No `,(0,l.jsx)(n.strong,{children:`illustrative icon`}),`.`]}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`switch`,children:`Switch`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed.`}),`
`,(0,l.jsx)(n.li,{children:`❌ Size cannot be reduced — otherwise non-compliant with Material recommendations.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`tabs`,children:`Tabs`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`⚠️ Make sure to use the `,(0,l.jsx)(n.strong,{children:`primary`}),` when there is no secondary.`]}),`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`text-fields`,children:`Text Fields`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Filled version`}),`: bottom edges not rounded (otherwise it masks part of the bottom border) →
prefer the `,(0,l.jsx)(n.strong,{children:`outline version`}),` for fully rounded edges.`]}),`
`,(0,l.jsxs)(n.li,{children:[`The chosen style must be `,(0,l.jsx)(n.strong,{children:`consistent across the entire app`}),`.`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Corner radius`}),` can be modified if needed (e.g.: 4 → 8).`]}),`
`,(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:`Icons`}),` customizable (e.g.: search).`]}),`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`toolbars`,children:`Toolbars`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsxs)(n.li,{children:[`Reserved for `,(0,l.jsx)(n.strong,{children:`actions`}),`; possible for secondary navigation, otherwise use a `,(0,l.jsx)(n.strong,{children:`nav bar`}),`.`]}),`
`,(0,l.jsx)(n.li,{children:`No mix of tab + standalone icon — for tab + icon, apply the toolbar and the FAB separately on the
right.`}),`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`tooltips`,children:`Tooltips`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`Refer to the Material documentation if needed.`}),`
`]}),`
`,(0,l.jsx)(n.h2,{id:`utilities`,children:`Utilities`}),`
`,(0,l.jsxs)(n.ul,{children:[`
`,(0,l.jsx)(n.li,{children:`❌ Cannot be edited.`}),`
`]}),`
`,(0,l.jsx)(n.hr,{}),`
`,(0,l.jsx)(n.h2,{id:`quick-summary`,children:`Quick summary`}),`
`,(0,l.jsx)(r,{headers:[`Category`,`Components`],rows:[[`🟢 Fully customizable`,`Avatars`],[`🟡 Partially customizable (icons, colors, groups recommended)`,`App Bars, Buttons, Checkbox, Chips, Lists, Menu, Snackbar, Search, Text Fields`],[`🟠 As-is or to rebuild (full custom)`,`Cards, Date & Time Picker, Dialogs (list dialog), Dividers, Navigation`],[`🔴 Cannot be edited / constrained`,`Utilities, Switch (size), Date & Time Picker (icons)`],[`⚪ No issues / refer to Material`,`Badges, Carousel, Loading & Progress, Radio Button, Shape, Sliders, Tabs, Toolbars, Tooltips`],[`📱💻 Tablet/Desktop only`,`Navigation rail`]]})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,l.jsx)(t,{...e,children:(0,l.jsx)(o,{...e})}):o(e)}function c(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}var l;function u(){return(u=e((()=>{l=r(),a(),n()})))()}u();export{s as default};