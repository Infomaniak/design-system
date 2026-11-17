import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{l as t,s as n}from"./blocks-B6Ms2BxU.js";import{a as r}from"./chunk-W22LQPXL-DAacIxBz.js";import{i,r as a}from"./react-DITjJg24.js";var o;function s(){return(s=e((()=>{o=new URL(`system-icons-step1-iOFj0CQ-.png`,import.meta.url).href})))()}var c;function l(){return(l=e((()=>{c=new URL(`system-icons-step2-xvaCfRgW.png`,import.meta.url).href})))()}var u;function d(){return(d=e((()=>{u=new URL(`system-icons-step3-DwJ0V5B0.png`,import.meta.url).href})))()}var f;function p(){return(p=e((()=>{f=new URL(`system-icons-step4-1-akF_twCk.png`,import.meta.url).href})))()}var m;function h(){return(h=e((()=>{m=new URL(`system-icons-step4-2-CGZ8Wtsh.webp`,import.meta.url).href})))()}var g;function _(){return(_=e((()=>{g=new URL(`system-icons-step5-1a-C6d6xC1s.webp`,import.meta.url).href})))()}var v;function y(){return(y=e((()=>{v=new URL(`system-icons-step5-1b-Z4z_ZYjp.webp`,import.meta.url).href})))()}var b;function x(){return(x=e((()=>{b=new URL(`system-icons-step7a-Dx94gPaR.webp`,import.meta.url).href})))()}var S;function C(){return(C=e((()=>{S=new URL(`system-icons-step7b-Bslys6Nz.webp`,import.meta.url).href})))()}var w;function T(){return(T=e((()=>{w=new URL(`system-icons-step7c-DSmkufUm.png`,import.meta.url).href})))()}var E;function D(){return(D=e((()=>{E=new URL(`system-icons-step8-Dj6WzsCy.webp`,import.meta.url).href})))()}function O(e){let t={a:`a`,blockquote:`blockquote`,code:`code`,em:`em`,h1:`h1`,h3:`h3`,h4:`h4`,hr:`hr`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...i(),...e.components};return(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)(n,{title:`Icons/Icon Contribution`}),`
`,(0,A.jsx)(t.h1,{id:`icon---contribution-️`,children:`Icon - Contribution ✳️`}),`
`,(0,A.jsx)(t.p,{children:`A guide for designers on how to create icons.
Each icon is delivered in two versions, one for developers and one for designers.`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`Developer icon`}),`: keeps its strokes. Developers can then use an equation to adjust the stroke width to the icon size, so every size gets the right thickness.`]}),`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`Designer icon`}),`: flattened, so the strokes become filled shapes. Since Figma can't scale stroke width with icon size, the designer icon comes in a fixed set of sizes, each with its own correct stroke.`]}),`
`]}),`
`,(0,A.jsx)(t.p,{children:(0,A.jsx)(t.strong,{children:(0,A.jsx)(t.a,{href:`https://www.figma.com/design/GiBEx5gisOnNe3cikN0z1U/ESDS-Team---System-icons---Contribution?node-id=2-8276&p=f&t=T3CL24pct9LcIv0K-0`,rel:`nofollow`,children:`Contribution Figma file`})})}),`
`,(0,A.jsx)(t.hr,{}),`
`,(0,A.jsx)(t.h3,{id:`1-open-the-lucide-icons-plugin`,children:`1. Open the Lucide Icons plugin`}),`
`,(0,A.jsx)(`img`,{src:o,alt:`Open the Lucide Icons plugin`,width:`500px`}),`
`,(0,A.jsx)(t.h3,{id:`2-click-an-icon-to-insert-it`,children:`2. Click an icon to insert it`}),`
`,(0,A.jsx)(`img`,{src:c,alt:`Click an icon to insert it`,width:`500px`}),`
`,(0,A.jsx)(t.h3,{id:`3-convert-the-icon-into-a-component`,children:`3. Convert the icon into a component`}),`
`,(0,A.jsx)(`img`,{src:u,alt:`Convert the icon into a component`,width:`500px`}),`
`,(0,A.jsx)(t.h3,{id:`4-dev-icon`,children:`4. Dev icon`}),`
`,(0,A.jsx)(t.h4,{id:`41-keep-it-as-imported-and-set-the-stroke-to-175px`,children:`4.1 Keep it as imported and set the stroke to 1.75px`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsx)(t.li,{children:`Don't flatten or outline it, because developers need the original strokes.`}),`
`]}),`
`,(0,A.jsxs)(t.blockquote,{children:[`
`,(0,A.jsx)(t.p,{children:`💡 Tip: set the plugin's default stroke to 1.75px to skip this step in the future`}),`
`]}),`
`,(0,A.jsx)(`img`,{src:f,alt:`Lucide Icons plugin settings with stroke width set to 1.75`,width:`500px`}),`
`,(0,A.jsx)(t.h4,{id:`42-create-the-filled-version-if-needed`,children:`4.2 Create the filled version if needed`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsx)(t.li,{children:`For developers, the filled and stroke versions of an icon are separate components, because they're built and handled differently.`}),`
`,(0,A.jsxs)(t.li,{children:[`When a filled icon has inner details, like the `,(0,A.jsx)(t.code,{children:`i`}),` in `,(0,A.jsx)(t.code,{children:`circle-info-filled`}),`, draw those details as `,(0,A.jsx)(t.strong,{children:`strokes`}),`, then use `,(0,A.jsx)(t.strong,{children:`Subtract`}),` in the pathfinder to cut them out of the filled shape. Don't flatten the details. Because the cut-out is still a stroke, the equation keeps controlling its thickness, and the "i" adapts to every size the same way an outline icon does.`]}),`
`]}),`
`,(0,A.jsx)(`img`,{src:m,alt:`circle-info-filled dev component: the i is a stroke subtracted from the filled circle`,width:`700px`}),`
`,(0,A.jsx)(t.h3,{id:`5-designer-icon`,children:`5. Designer icon`}),`
`,(0,A.jsx)(t.h4,{id:`51-generate-all-sizes`,children:`5.1 Generate all sizes`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[`Select the stroke dev icon and run the `,(0,A.jsx)(t.a,{href:`./?path=/docs/designers-guide-figma-plugins--docs#esds-icons`,children:`ESDS icons plugin`}),` to generate the designer version (by default, the plugin works on a copy, so your dev icon stays untouched).`]}),`
`]}),`
`,(0,A.jsx)(`img`,{src:g,alt:`Run the ESDS icons plugin`,width:`700px`}),`
`,(0,A.jsx)(`img`,{src:v,alt:`Follow the ESDS icons plugin steps to generate all sizes`}),`
`,(0,A.jsx)(t.h4,{id:`52-variants`,children:`5.2 Variants`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`size`}),`: make sure all sizes are included (`,(0,A.jsx)(t.code,{children:`16, 20, 24, 32, 40`}),`).`]}),`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`filled`}),`: The designer version must always include a `,(0,A.jsx)(t.code,{children:`filled`}),` variant property, set to `,(0,A.jsx)(t.code,{children:`false`}),` even when the icon has no filled version. This avoids problems when swapping icons in Figma.`]}),`
`]}),`
`,(0,A.jsx)(t.h3,{id:`6-name-the-dev-and-designer-components`,children:`6. Name the dev and designer components`}),`
`,(0,A.jsx)(t.h4,{id:`61-name-structure-example`,children:`6.1 Name structure example:`}),`
`,(0,A.jsxs)(t.p,{children:[`Icon: `,(0,A.jsx)(t.code,{children:`esds/icon/house`})]}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`esds`}),`: Design System acronym`]}),`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`icon`}),`: asset type`]}),`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`house`}),`: `,(0,A.jsx)(t.code,{children:`icon name`})]}),`
`]}),`
`,(0,A.jsxs)(t.p,{children:[`Filled icon (`,(0,A.jsx)(t.em,{children:`dev only`}),`): `,(0,A.jsx)(t.code,{children:`esds/icon/house-filled`})]}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`esds`}),`: Design System acronym`]}),`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`icon`}),`: asset type`]}),`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`house-filled`}),`: `,(0,A.jsx)(t.code,{children:`icon name`})]}),`
`]}),`
`,(0,A.jsx)(t.h4,{id:`62-naming-convention`,children:`6.2 Naming convention`}),`
`,(0,A.jsx)(t.p,{children:`Name an icon after what it shows, not what it's used for.`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`Describe, don't prescribe`}),`: the name says what the icon shows (`,(0,A.jsx)(t.code,{children:`envelope`}),`), not what it means in a given context (`,(0,A.jsx)(t.code,{children:`mail`}),`).`]}),`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`Word order follows what you see first`}),`: when an icon combines several elements, name them in the order the eye notices them. The most prominent element comes first, smaller details or badges after. For example, an envelope with a small checkmark is `,(0,A.jsx)(t.code,{children:`envelope-check`}),`, not `,(0,A.jsx)(t.code,{children:`check-envelope`}),`.`]}),`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`Search works through tags`}),`: the uses ("mail", "email", "message"…) go in the description tags (see step 7). People can still find the icon by searching "mail" without it being its name.`]}),`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`A common practice`}),`: `,(0,A.jsx)(t.a,{href:`https://lucide.dev/contribute/icons/naming-conventions`,rel:`nofollow`,children:`Lucide`}),` (`,(0,A.jsx)(t.code,{children:`floppy-disk`}),`, not `,(0,A.jsx)(t.code,{children:`save`}),`) and `,(0,A.jsx)(t.a,{href:`https://blog.fontawesome.com/icon-naming-conventions/`,rel:`nofollow`,children:`Font Awesome`}),` (`,(0,A.jsx)(t.code,{children:`house`}),`, not `,(0,A.jsx)(t.code,{children:`home`}),`; `,(0,A.jsx)(t.code,{children:`magnifying-glass`}),`, not `,(0,A.jsx)(t.code,{children:`search`}),`) both follow this rule.`]}),`
`]}),`
`,(0,A.jsx)(t.h3,{id:`7-final-adjustments-on-both-dev-and-designer-components`,children:`7. Final adjustments on both dev and designer components`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[`Remove the `,(0,A.jsx)(t.code,{children:`Fill`}),` setting.`]}),`
`]}),`
`,(0,A.jsx)(`img`,{src:b,alt:`Remove the Fill setting`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsx)(t.li,{children:`Give the component layers clear names.`}),`
`]}),`
`,(0,A.jsx)(`img`,{src:S,alt:`Component layers named clearly`,width:`700px`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsx)(t.li,{children:`Add 10–12 relevant tags to the component description following the same naming convention as the icon name.`}),`
`,(0,A.jsxs)(t.li,{children:[(0,A.jsx)(t.strong,{children:`Renaming only:`}),` if you need to rename a component, then add the old name as an alias at the start of the list, with an exclamation mark in front: `,(0,A.jsx)(t.code,{children:`!old-icon-name`}),`. Then update and save the version as described in step 9.`]}),`
`]}),`
`,(0,A.jsx)(`img`,{src:w,alt:`Add relevant tags to the component description`,width:`500px`}),`
`,(0,A.jsx)(t.h3,{id:`8-send-for-approval`,children:`8. Send for approval`}),`
`,(0,A.jsxs)(t.p,{children:[`Use the `,(0,A.jsx)(t.a,{href:`https://www.figma.com/design/GiBEx5gisOnNe3cikN0z1U/ESDS-Team---System-icons---Contribution?node-id=2020-225&t=T3CL24pct9LcIv0K-11`,rel:`nofollow`,children:`template layout`}),`, drop it into the `,(0,A.jsx)(t.code,{children:`approval`}),` section, then share it with the DS team.`]}),`
`,(0,A.jsx)(`img`,{src:E,alt:`Template layout dropped into the approval section`,width:`700px`}),`
`,(0,A.jsx)(t.h3,{id:`9-release-to-production`,children:`9. Release to production`}),`
`,(0,A.jsxs)(t.blockquote,{children:[`
`,(0,A.jsxs)(t.p,{children:[`👑 `,(0,A.jsx)(t.strong,{children:`Golden rule:`}),` any change, even a typo fix or a tiny adjustment, needs a new version. Never overwrite an existing version.`]}),`
`]}),`
`,(0,A.jsx)(t.h4,{id:`91-dev-version`,children:`9.1 Dev version`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[`Move the dev component to the `,(0,A.jsx)(t.a,{href:`https://www.figma.com/design/VfpVYoNSwpoUfPTvWU3HdU/ESDS-Team---System-icons---Source-of-truth?node-id=172-67&t=RkfxFdne4hLjGxOy-11`,rel:`nofollow`,children:`dev icons file`}),`.`]}),`
`,(0,A.jsxs)(t.li,{children:[`Add it to the list using the same structure as the existing icons: duplicate an existing frame, paste the component into it, and rename the frame title to the icon name.`,`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[`Titles are set in `,(0,A.jsx)(t.strong,{children:`Roboto on purpose`}),`. A script runs on this file automatically, and the file is set up so it can't use custom fonts. Don't change the font.`]}),`
`]}),`
`]}),`
`,(0,A.jsxs)(t.li,{children:[`Update the version number at the top of the section by bumping the last digit (for example, `,(0,A.jsx)(t.code,{children:`0.0.1`}),` → `,(0,A.jsx)(t.code,{children:`0.0.2`}),`).`,`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[`For now, only the last digit changes. A bigger bump (for example, `,(0,A.jsx)(t.code,{children:`0.1.0`}),`) has to be decided by the DS team and will be stated during the approval step (step 8).`]}),`
`]}),`
`]}),`
`,(0,A.jsxs)(t.li,{children:[`Save the version in Figma: open `,(0,A.jsx)(t.strong,{children:`Show version history`}),`, add a version manually, and name it with the version number. Leave the description empty.`]}),`
`]}),`
`,(0,A.jsx)(t.h4,{id:`92-designer-version`,children:`9.2 Designer version`}),`
`,(0,A.jsxs)(t.ul,{children:[`
`,(0,A.jsxs)(t.li,{children:[`Move the designer component to the `,(0,A.jsx)(t.a,{href:`https://www.figma.com/design/nbEPxwoIzXfZVquwR4NfYg/Edelweiss---Iconography?node-id=154-62&t=8BIXs4lj0dcXXU54-11`,rel:`nofollow`,children:`designer icons file`}),`.`]}),`
`,(0,A.jsxs)(t.li,{children:[`Update the section name with the `,(0,A.jsx)(t.strong,{children:`same version number`}),` as the dev file. The two files must always stay in sync, in both content and version number.`]}),`
`,(0,A.jsx)(t.li,{children:`Publish the library.`}),`
`]}),`
`,(0,A.jsx)(t.h3,{id:`10-let-the-ds-team-know`,children:`10. Let the DS team know`}),`
`,(0,A.jsx)(t.p,{children:`Tell the DS team the release is done so they can share what's new.`})]})}function k(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,A.jsx)(t,{...e,children:(0,A.jsx)(O,{...e})}):O(e)}var A;function j(){return(j=e((()=>{A=r(),a(),t(),s(),l(),d(),p(),h(),_(),y(),x(),C(),T(),D()})))()}j();export{k as default};