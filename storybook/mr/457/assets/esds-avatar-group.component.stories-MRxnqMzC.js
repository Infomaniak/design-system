import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,f as n,n as r,p as i,t as a,w as o}from"./dist-B4SFml0u.js";import{r as s,t as c}from"./if-defined-DYgFDik5.js";import{n as l}from"./storybook-interactive-controls-Cso4u3kZ.js";import{a as u,i as d,n as f,o as p,t as m}from"./esds-avatar.component-C_EDKipX.js";import{o as h,r as g,t as _}from"./define-component-Z-wd0EWj.js";var v;function y(){return(y=e((()=>{v=`[Figma ↗](https://www.figma.com/design/OgklXBGhUgpzlYPnVusMpw/Edelweiss---Token-Core?node-id=2854-425&t=utLUqVyj1askiodz-0)

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
`})))()}var b;function x(){return(x=e((()=>{b=`:host{box-sizing:border-box;justify-content:center;align-items:center;display:inline-flex}:host ::slotted(esds-avatar:not(:first-child)){margin-inline-start:var(--esds-avatar-group-gap)}:host([shape=square]) ::slotted(esds-avatar){border-radius:var(--esds-avatar-border-radius-square)}`})))()}var S;function C(){return(C=e((()=>{g(),n(),x(),S=class extends h(i){static define(){_(`esds-avatar-group`,this)}static styles=o(b);render(){return t`<slot></slot>`}}})))()}var w,T,E,D,O,k;function A(){return(A=e((()=>{r(),n(),c(),p(),f(),y(),C(),S.define(),m.define(),{args:w,argTypes:T}=a(`esds-avatar-group`),E={title:`Components/Avatar/Avatar Group`,component:`esds-avatar-group`,tags:[`autodocs`,`vr-test`],parameters:{docs:{description:{component:v}}},args:w,argTypes:T},D=[{image:d},{initials:`IK`},{image:`https://github.com/lifaon74.png`},{icon:`esds:calendar-user`},{image:`https://github.com/vjo.png`},{image:`data:image/png,broken`}],O={...l({...u,count:{value:4,type:`number`}}),render:e=>t`<esds-avatar-group
      data-esds-avatar-size=${s(e.size)}
      shape="${s(e.shape)}"
    >
      ${D.slice(0,e.count).map(e=>t`
          <esds-avatar
            image="${s(e.image)}"
            icon="${s(e.icon)}"
            initials="${s(e.initials)}"
          ></esds-avatar>
        `)}
    </esds-avatar-group>`},k=[`Default`],O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls,
    count: {
      value: 4,
      type: 'number'
    }
  }),
  render: args => html\`<esds-avatar-group
      data-esds-avatar-size=\${ifDefined(args.size)}
      shape="\${ifDefined(args.shape)}"
    >
      \${AVATAR_STORY_PEOPLE.slice(0, args.count).map(person => html\`
          <esds-avatar
            image="\${ifDefined(person.image)}"
            icon="\${ifDefined(person.icon)}"
            initials="\${ifDefined(person.initials)}"
          ></esds-avatar>
        \`)}
    </esds-avatar-group>\`
}`,...O.parameters?.docs?.source}}}})))()}A();export{O as Default,k as __namedExportsOrder,E as default};