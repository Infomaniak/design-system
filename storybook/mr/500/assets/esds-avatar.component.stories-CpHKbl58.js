import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{r as a,t as o}from"./if-defined-DYgFDik5.js";import{n as s}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as c,i as l,n as u,r as d,t as f}from"./esds-avatar.component-Cj9hgC5e.js";var p;function m(){return(m=e((()=>{p=`[//]: # (- [Figma ↗]&#40;TODO&#41;)

## Usage

Import and register the custom element \`esds-avatar\`:

\`\`\`ts
import { EsdsAvatarComponent } from '@infomaniak-design-system/components';

EsdsAvatarComponent.define();
\`\`\`

\`\`\`html
<esds-avatar initials="AB"></esds-avatar>
\`\`\`

## Description

Represents an avatar.

### Styles

#### Sizes

List of all available avatar sizes:

- \`extra-large\` (default): extra-large avatar (48px)
- \`large\`: large avatar (40px)
- \`medium\`: medium avatar (32px)
- \`small\`: small avatar (24px)

##### Import

To import all avatar sizes:

\`\`\`css
@import '@infomaniak-design-system/tokens/css/modifiers/avatar-size/all.attr.css';
\`\`\`

Or individually:

\`\`\`css
@import '@infomaniak-design-system/tokens/css/modifiers/avatar-size/[size].attr.css';
/* example: @import '@infomaniak-design-system/tokens/css/modifiers/avatar-size/large.attr.css'; */
\`\`\`

##### Apply

Add the attribute \`data-esds-avatar-size="[size]"\` to apply an avatar size:

\`\`\`html
<esds-avatar
  data-esds-avatar-size="extra-large"
  initials="AB"
></esds-avatar>
\`\`\`

## Demo
`})))()}var h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{r(),n(),o(),m(),c(),u(),f.define(),{args:h,argTypes:g}=i(`esds-avatar`),_={title:`Components/Avatar`,component:`esds-avatar`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:p}}},args:h,argTypes:g},v={...s({...l}),args:{image:`https://picsum.photos/seed/esds-avatar/48`},render:e=>t`<esds-avatar
      data-esds-avatar-size=${a(e.size)}
      shape="${a(e.shape)}"
      image="${a(e.image)}"
      icon="${a(e.icon)}"
      initials="${a(e.initials)}"
    ></esds-avatar>`},y={...s({...l}),render:e=>t`<esds-avatar
      data-esds-avatar-size=${a(e.size)}
      shape="${a(e.shape)}"
      image="https://picsum.photos/seed/esds-avatar/48"
    ></esds-avatar>`},b={...s({...l}),render:e=>t`<esds-avatar
      data-esds-avatar-size=${a(e.size)}
      shape="${a(e.shape)}"
      icon="esds:calendar-user"
    ></esds-avatar>`},x={...s({...l}),render:e=>t`<esds-avatar
      data-esds-avatar-size=${a(e.size)}
      shape="${a(e.shape)}"
      initials="AB"
    ></esds-avatar>`},S={...s({...l}),render:e=>t`
    <style>
      .avatars-container {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 24px;
      }
    </style>
    <div class="avatars-container">
      ${d.map(n=>t`
          <esds-avatar
            data-esds-avatar-size="${n}"
            shape="${a(e.shape)}"
            image="${a(e.image)}"
            icon="${a(e.icon)}"
            initials="${a(e.initials)}"
          ></esds-avatar>
        `)}
    </div>
  `},C=[`Default`,`WithImage`,`WithIcon`,`WithInitials`,`AllSizes`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  args: {
    image: 'https://picsum.photos/seed/esds-avatar/48'
  },
  render: args => html\`<esds-avatar
      data-esds-avatar-size=\${ifDefined(args.size)}
      shape="\${ifDefined(args.shape)}"
      image="\${ifDefined(args.image)}"
      icon="\${ifDefined(args.icon)}"
      initials="\${ifDefined(args.initials)}"
    ></esds-avatar>\`
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  render: args => html\`<esds-avatar
      data-esds-avatar-size=\${ifDefined(args.size)}
      shape="\${ifDefined(args.shape)}"
      image="https://picsum.photos/seed/esds-avatar/48"
    ></esds-avatar>\`
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  render: args => html\`<esds-avatar
      data-esds-avatar-size=\${ifDefined(args.size)}
      shape="\${ifDefined(args.shape)}"
      icon="esds:calendar-user"
    ></esds-avatar>\`
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  render: args => html\`<esds-avatar
      data-esds-avatar-size=\${ifDefined(args.size)}
      shape="\${ifDefined(args.shape)}"
      initials="AB"
    ></esds-avatar>\`
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  render: args => html\`
    <style>
      .avatars-container {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 24px;
      }
    </style>
    <div class="avatars-container">
      \${AVATAR_SIZES.map(variant => html\`
          <esds-avatar
            data-esds-avatar-size="\${variant}"
            shape="\${ifDefined(args.shape)}"
            image="\${ifDefined(args.image)}"
            icon="\${ifDefined(args.icon)}"
            initials="\${ifDefined(args.initials)}"
          ></esds-avatar>
        \`)}
    </div>
  \`
}`,...S.parameters?.docs?.source}}}})))()}w();export{S as AllSizes,v as Default,b as WithIcon,y as WithImage,x as WithInitials,C as __namedExportsOrder,_ as default};