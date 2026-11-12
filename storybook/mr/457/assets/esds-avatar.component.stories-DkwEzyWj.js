import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,t as i}from"./dist-B4SFml0u.js";import{r as a,t as o}from"./if-defined-DYgFDik5.js";import{n as s}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as c,i as l,n as u,o as d,r as f,t as p}from"./esds-avatar.component-CC7c5XlJ.js";var m;function h(){return(h=e((()=>{m=`[Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2854-2&p=f&t=utLUqVyj1askiodz-0)

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

### Image fallback

While the image is loading, or if it fails to load, the avatar displays a fallback content instead, in this order:

1. the \`icon\`, if provided;
2. otherwise the \`initials\`, if provided;
3. otherwise a default \`esds:user\` icon.

The image loading state is reflected on the host as the \`data-image-state\` attribute (\`loading\`, \`loaded\` or \`error\`); the attribute is absent when no image is provided:

\`\`\`html
<esds-avatar
  image="avatar.png"
  data-image-state="loaded"
></esds-avatar>
\`\`\`

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
`})))()}var g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{r(),n(),o(),h(),d(),u(),p.define(),{args:g,argTypes:_}=i(`esds-avatar`),v={title:`Components/Avatar`,component:`esds-avatar`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:m}}},args:g,argTypes:_},y={...s({...c}),args:{image:l},render:e=>t`<esds-avatar
      data-esds-avatar-size=${a(e.size)}
      shape="${a(e.shape)}"
      image="${a(e.image)}"
      icon="${a(e.icon)}"
      initials="${a(e.initials)}"
    ></esds-avatar>`},b={...s({...c}),render:e=>t`<esds-avatar
      data-esds-avatar-size=${a(e.size)}
      shape="${a(e.shape)}"
      image="${l}"
    ></esds-avatar>`},x={...s({...c}),render:e=>t`<esds-avatar
      data-esds-avatar-size=${a(e.size)}
      shape="${a(e.shape)}"
      icon="esds:calendar-user"
    ></esds-avatar>`},S={...s({...c}),render:e=>t`<esds-avatar
      data-esds-avatar-size=${a(e.size)}
      shape="${a(e.shape)}"
      initials="AB"
    ></esds-avatar>`},C={...s({...c}),render:e=>t`
    <style>
      .avatars-container {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 24px;
      }
    </style>
    <div class="avatars-container">
      <!-- the image fails to load, falling back to the initials -->
      <esds-avatar
        data-esds-avatar-size="${e.size}"
        shape="${a(e.shape)}"
        image="data:image/png;base64,aW52YWxpZA=="
        initials="AB"
      ></esds-avatar>
      <!-- the image fails to load, falling back to the icon -->
      <esds-avatar
        data-esds-avatar-size="${e.size}"
        shape="${a(e.shape)}"
        image="data:image/png;base64,aW52YWxpZA=="
        icon="esds:calendar-user"
      ></esds-avatar>
      <!-- the image fails to load, falling back to the default user icon -->
      <esds-avatar
        data-esds-avatar-size="${e.size}"
        shape="${a(e.shape)}"
        image="data:image/png;base64,aW52YWxpZA=="
      ></esds-avatar>
    </div>
  `},w={...s({...c}),render:e=>t`
    <style>
      .avatars-container {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 24px;
      }
    </style>
    <div class="avatars-container">
      ${f.map(n=>t`
          <esds-avatar
            data-esds-avatar-size="${n}"
            shape="${a(e.shape)}"
            image="${a(e.image)}"
            icon="${a(e.icon)}"
            initials="${a(e.initials)}"
          ></esds-avatar>
        `)}
    </div>
  `},T=[`Default`,`WithImage`,`WithIcon`,`WithInitials`,`ImageFallback`,`AllSizes`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  args: {
    image: AVATAR_STORY_IMAGE
  },
  render: args => html\`<esds-avatar
      data-esds-avatar-size=\${ifDefined(args.size)}
      shape="\${ifDefined(args.shape)}"
      image="\${ifDefined(args.image)}"
      icon="\${ifDefined(args.icon)}"
      initials="\${ifDefined(args.initials)}"
    ></esds-avatar>\`
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  render: args => html\`<esds-avatar
      data-esds-avatar-size=\${ifDefined(args.size)}
      shape="\${ifDefined(args.shape)}"
      image="\${AVATAR_STORY_IMAGE}"
    ></esds-avatar>\`
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  render: args => html\`<esds-avatar
      data-esds-avatar-size=\${ifDefined(args.size)}
      shape="\${ifDefined(args.shape)}"
      icon="esds:calendar-user"
    ></esds-avatar>\`
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  render: args => html\`<esds-avatar
      data-esds-avatar-size=\${ifDefined(args.size)}
      shape="\${ifDefined(args.shape)}"
      initials="AB"
    ></esds-avatar>\`
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
      <!-- the image fails to load, falling back to the initials -->
      <esds-avatar
        data-esds-avatar-size="\${args.size}"
        shape="\${ifDefined(args.shape)}"
        image="data:image/png;base64,aW52YWxpZA=="
        initials="AB"
      ></esds-avatar>
      <!-- the image fails to load, falling back to the icon -->
      <esds-avatar
        data-esds-avatar-size="\${args.size}"
        shape="\${ifDefined(args.shape)}"
        image="data:image/png;base64,aW52YWxpZA=="
        icon="esds:calendar-user"
      ></esds-avatar>
      <!-- the image fails to load, falling back to the default user icon -->
      <esds-avatar
        data-esds-avatar-size="\${args.size}"
        shape="\${ifDefined(args.shape)}"
        image="data:image/png;base64,aW52YWxpZA=="
      ></esds-avatar>
    </div>
  \`
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}}})))()}E();export{w as AllSizes,y as Default,C as ImageFallback,x as WithIcon,b as WithImage,S as WithInitials,T as __namedExportsOrder,v as default};