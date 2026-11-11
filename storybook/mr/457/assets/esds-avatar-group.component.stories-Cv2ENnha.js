import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,p as i,t as a,w as o}from"./dist-B4SFml0u.js";import{r as s,t as c}from"./if-defined-DYgFDik5.js";import{n as l}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as u,i as d,n as f,t as p}from"./esds-avatar.component-8u980N_7.js";import{o as m,r as h,t as g}from"./define-component-Z-wd0EWj.js";var _;function v(){return(v=e((()=>{_=`[//]: # (- [Figma ↗]&#40;TODO&#41;)

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
  data-esds-avatar-size="large"
  shape="square"
>
  <esds-avatar initials="AB"></esds-avatar>
  <esds-avatar initials="CD"></esds-avatar>
  <esds-avatar initials="EF"></esds-avatar>
</esds-avatar-group>
\`\`\`

## Demo
`})))()}var y;function b(){return(b=e((()=>{y=`:host{box-sizing:border-box;justify-content:center;align-items:center;display:inline-flex}:host ::slotted(esds-avatar:not(:first-child)){margin-left:var(--esds-avatar-group-gap)}:host([shape=square]) ::slotted(esds-avatar){border-radius:var(--esds-avatar-border-radius-square)}`})))()}var x;function S(){return(S=e((()=>{h(),n(),b(),x=class extends m(i){static define(){g(`esds-avatar-group`,this)}static styles=o(y);render(){return t`<slot></slot>`}}})))()}var C,w,T,E,D;function O(){return(O=e((()=>{r(),n(),c(),u(),f(),v(),S(),x.define(),p.define(),{args:C,argTypes:w}=a(`esds-avatar-group`),T={title:`Components/Avatar/Avatar Group`,component:`esds-avatar-group`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:_}}},args:C,argTypes:w},E={...l({...d}),args:{image:`https://picsum.photos/200`,icon:``,initials:``,count:3},render:e=>t`<esds-avatar-group
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
    </esds-avatar-group>`},D=[`Default`],E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls
  }),
  args: {
    image: 'https://picsum.photos/200',
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
}`,...E.parameters?.docs?.source}}}})))()}O();export{E as Default,D as __namedExportsOrder,T as default};