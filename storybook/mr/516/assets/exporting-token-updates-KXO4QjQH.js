import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{l as t,s as n}from"./blocks-Cr2ZIGG9.js";import{a as r}from"./chunk-W22LQPXL-CVCnKrju.js";import{i,r as a}from"./react-DITjJg24.js";function o(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,hr:`hr`,li:`li`,ol:`ol`,p:`p`,strong:`strong`,ul:`ul`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Designers Guide/Android/Exporting Token Updates`}),`
`,(0,c.jsx)(t.h1,{id:`exporting-token-updates`,children:`Exporting Token Updates`}),`
`,(0,c.jsxs)(t.p,{children:[`This guide walks you through updating the Material color tokens in Figma and exporting them for the
Android team. `,(0,c.jsx)(t.strong,{children:`Never export before an Android developer has approved the changes.`})]}),`
`,(0,c.jsx)(t.hr,{}),`
`,(0,c.jsx)(t.h2,{id:`before-you-start`,children:`Before you start`}),`
`,(0,c.jsx)(t.p,{children:`Make sure you have:`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`edit access to the `,(0,c.jsx)(t.a,{href:`https://www.figma.com/design/r4D2DKWIyzVoigyiTh16Hh/Edelweiss---Material-Kit?m=auto&t=6Praqzvd4yFcNUmT-6`,rel:`nofollow`,children:`Material kit`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[`access to the `,(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.a,{href:`./?path=/docs/designers-guide-android-hct-tonal-palette--docs`,children:`HCT Tonal Palette`})}),` generator, our in-house tool (only needed if you create a new color palette).`]}),`
`,(0,c.jsxs)(t.li,{children:[`a Figma variables export plugin (e.g. `,(0,c.jsx)(t.a,{href:`https://www.figma.com/community/plugin/1264578192495051449/variables-pro-swap-import-export-variables`,rel:`nofollow`,children:`Variables Pro`}),`).`]}),`
`,(0,c.jsx)(t.li,{children:`an Android developer who will review your changes.`}),`
`]}),`
`,(0,c.jsx)(t.hr,{}),`
`,(0,c.jsx)(t.h2,{id:`step-1-create-the-new-color-palette-if-needed`,children:`Step 1: Create the new color palette (if needed)`}),`
`,(0,c.jsx)(t.p,{children:`Skip this step if you are only changing values in existing palettes.`}),`
`,(0,c.jsxs)(t.ol,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Open the `,(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.a,{href:`./?path=/docs/designers-guide-android-hct-tonal-palette--docs`,children:`HCT Tonal Palette`})}),` generator.`]}),`
`,(0,c.jsx)(t.li,{children:`Enter the source color (hex) of the new palette.`}),`
`,(0,c.jsx)(t.li,{children:`Generate the full tonal palette, including tones you don't plan to use yet: Material roles rely on many different tones across all contrast modes.`}),`
`,(0,c.jsxs)(t.li,{children:[`Add the palette to the `,(0,c.jsx)(t.strong,{children:`Primitives`}),` collection.`]}),`
`,(0,c.jsx)(t.li,{children:`Name the new palette exactly like the existing ones: same structure, same tone steps. Do not rename or reorder existing palettes.`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`step-2-apply-the-values-following-materials-logic`,children:`Step 2: Apply the values following Material's logic`}),`
`,(0,c.jsxs)(t.p,{children:[`For each scheme, Material defines which tone of which palette each color role uses. Reproduce that mapping exactly: `,(0,c.jsx)(t.strong,{children:`do not adjust tones by eye`}),`, even if a color looks slightly off.`]}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Example: in the default Light scheme, `,(0,c.jsx)(t.code,{children:`primary`}),` uses tone 40 of the primary palette. In the Dark scheme, it uses tone 80.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Apply the mapping to `,(0,c.jsx)(t.strong,{children:`every mode`}),` of the Theme collection (Light, Light medium contrast, Light high contrast, and their Dark counterparts). Tones change from one mode to another, so check each one separately.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Theme values must `,(0,c.jsx)(t.strong,{children:`alias the Primitives variables`}),`: never paste a raw hex value into Theme.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Update the `,(0,c.jsx)(t.strong,{children:`Product`}),` and `,(0,c.jsx)(t.strong,{children:`Dataviz`}),` collections if your change affects them.`]}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`Source of truth for the mapping:`}),` `,(0,c.jsx)(t.a,{href:`https://m3.material.io/styles/color/roles`,rel:`nofollow`,children:`Material 3 - Color roles`})]}),`
`,(0,c.jsx)(t.p,{children:`If you are unsure about a mapping, ask an Android developer rather than guessing.`}),`
`,(0,c.jsx)(t.h2,{id:`step-3-get-approval-from-an-android-developer`,children:`Step 3: Get approval from an Android developer`}),`
`,(0,c.jsx)(t.p,{children:`Before exporting, always share the following with an Android developer:`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`the new or modified palette,`}),`
`,(0,c.jsx)(t.li,{children:`the tone-to-role mapping for each mode,`}),`
`,(0,c.jsx)(t.li,{children:`screenshots of the main components affected, in Light and Dark.`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`step-4-export-the-tokens`,children:`Step 4: Export the tokens`}),`
`,(0,c.jsx)(t.p,{children:`Only once your changes are approved.`}),`
`,(0,c.jsxs)(t.ol,{children:[`
`,(0,c.jsx)(t.li,{children:`Run the export plugin.`}),`
`,(0,c.jsxs)(t.li,{children:[`Select `,(0,c.jsx)(t.strong,{children:`only`}),` these four collections:`,`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:(0,c.jsx)(t.strong,{children:`Primitives`})}),`
`,(0,c.jsx)(t.li,{children:(0,c.jsx)(t.strong,{children:`Product`})}),`
`,(0,c.jsx)(t.li,{children:(0,c.jsx)(t.strong,{children:`Theme`})}),`
`,(0,c.jsx)(t.li,{children:(0,c.jsx)(t.strong,{children:`Dataviz`})}),`
`]}),`
`]}),`
`,(0,c.jsx)(t.li,{children:`Deselect every other collection, even if it seems related.`}),`
`,(0,c.jsxs)(t.li,{children:[`Export in `,(0,c.jsx)(t.code,{children:`.json`}),` format.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`step-5-hand-off`,children:`Step 5: Hand off`}),`
`,(0,c.jsxs)(t.ol,{children:[`
`,(0,c.jsx)(t.li,{children:`Send the exported file to the related outputs mobile channel on kChat.`}),`
`,(0,c.jsx)(t.li,{children:`Add a short summary of what changed (new palette, modified roles, affected modes).`}),`
`]})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};