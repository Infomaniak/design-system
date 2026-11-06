import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookInteractiveControls } from '../../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import {
  avatarStoryExtraControls,
  type AvatarStoryExtraControls,
} from '../esds-avatar.component.stories.shared.ts';
import { EsdsAvatarComponent } from '../esds-avatar.component.ts';
import documentation from './esds-avatar-group.component.md?raw';
import { EsdsAvatarGroupComponent } from './esds-avatar-group.component.ts';

EsdsAvatarGroupComponent.define();
EsdsAvatarComponent.define();

const { args, argTypes } = getStorybookHelpers<EsdsAvatarGroupComponent>('esds-avatar-group');

const meta = {
  title: 'Components/Avatar/Group',
  component: 'esds-avatar-group',
  tags: ['autodocs', 'vr-test'],
  parameters: {
    docs: {
      description: {
        component: documentation,
      },
    },
  },
  args,
  argTypes,
} satisfies Meta<EsdsAvatarGroupComponent>;

export default meta;

export const Default: StoryObj<
  EsdsAvatarGroupComponent &
    AvatarStoryExtraControls & {
      image?: string;
      icon?: string;
      initials?: string;
      count: number;
    }
> = {
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls,
  }),
  args: {
    image: 'https://picsum.photos/200',
    icon: '',
    initials: '',
    count: 3,
  },
  render: (args) =>
    html`<esds-avatar-group
      data-esds-avatar-size=${ifDefined(args.size)}
      shape="${ifDefined(args.shape)}"
    >
      ${Array.from({ length: args.count }).map(
        () => html`
          <esds-avatar
            image="${ifDefined(args.image)}"
            icon="${ifDefined(args.icon)}"
            initials="${ifDefined(args.initials)}"
          ></esds-avatar>
        `,
      )}
    </esds-avatar-group>`,
};
