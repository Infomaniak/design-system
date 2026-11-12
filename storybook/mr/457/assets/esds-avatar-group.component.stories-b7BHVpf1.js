import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,p as i,t as a,w as o}from"./dist-B4SFml0u.js";import{r as s,t as c}from"./if-defined-DYgFDik5.js";import{n as l}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as u,i as d,n as f,o as p,t as m}from"./esds-avatar.component-CC7c5XlJ.js";import{o as h,r as g,t as _}from"./define-component-Z-wd0EWj.js";var v;function y(){return(y=e((()=>{v=`[Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2854-425&t=utLUqVyj1askiodz-0)

## Usage

Import and register the custom element \`esds-avatar-group\`:

\`\`\`ts
import { EsdsAvatarGroupComponent } from '@infomaniak-design-system/components';

EsdsAvatarGroupComponent.define();
\`\`\`

\`\`\`html
<esds-avatar-group>
  <esds-avatar initials="AB"></esds-avatar>
  <esds-avatar initials="CD"></esds-avatar>
  <esds-avatar initials="EF"></esds-avatar>
</esds-avatar-group>
\`\`\`

## Description

Groups many avatars.

### Styles

You may apply [the same styles](./?path=/docs/components-avatar--docs#styles) as the avatar component.

#### Example:

\`\`\`html
<esds-avatar-group
  data-esds-avatar-size="extra-large"
  shape="square"
>
  <esds-avatar initials="AB"></esds-avatar>
  <esds-avatar initials="CD"></esds-avatar>
  <esds-avatar initials="EF"></esds-avatar>
</esds-avatar-group>
\`\`\`

## Demo
`})))()}var b;function x(){return(x=e((()=>{b=`:host{box-sizing:border-box;justify-content:center;align-items:center;display:inline-flex}:host ::slotted(esds-avatar:not(:first-child)){margin-inline-start:var(--esds-avatar-group-gap)}:host([shape=square]) ::slotted(esds-avatar){border-radius:var(--esds-avatar-border-radius-square)}`})))()}var S;function C(){return(C=e((()=>{g(),n(),x(),S=class extends h(i){static define(){_(`esds-avatar-group`,this)}static styles=o(b);render(){return t`<slot></slot>`}}})))()}var w,T,E,D,O;function k(){return(k=e((()=>{r(),n(),c(),p(),f(),y(),C(),S.define(),m.define(),{args:w,argTypes:T}=a(`esds-avatar-group`),E={title:`Components/Avatar/Avatar Group`,component:`esds-avatar-group`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:v}}},args:w,argTypes:T},D={...l({...u}),args:{image:d,icon:``,initials:``,count:3},render:e=>t`<esds-avatar-group
      data-esds-avatar-size=${s(e.size)}
      shape="${s(e.shape)}"
    >
      ${Array.from({length:e.count}).map(()=>t`
          <esds-avatar
            image="${s(e.image)}"
            icon="${s(e.icon)}"
            initials="${s(e.initials)}"
          ></esds-avatar>
        `)}
    </esds-avatar-group>`},O=[`Default`],D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  args: {
    image: AVATAR_STORY_IMAGE,
    icon: '',
    initials: '',
    count: 3
  },
  render: args => html\`<esds-avatar-group
      data-esds-avatar-size=\${ifDefined(args.size)}
      shape="\${ifDefined(args.shape)}"
    >
      \${Array.from({
    length: args.count
  }).map(() => html\`
          <esds-avatar
            image="\${ifDefined(args.image)}"
            icon="\${ifDefined(args.icon)}"
            initials="\${ifDefined(args.initials)}"
          ></esds-avatar>
        \`)}
    </esds-avatar-group>\`
}`,...D.parameters?.docs?.source}}}})))()}k();export{D as Default,O as __namedExportsOrder,E as default};