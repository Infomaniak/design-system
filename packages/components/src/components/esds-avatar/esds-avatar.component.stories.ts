import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookInteractiveControls } from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import documentation from './esds-avatar.component.md?raw';
import {
  AVATAR_SIZES,
  avatarStoryExtraControls,
  type AvatarStoryExtraControls,
} from './esds-avatar.component.stories.shared.ts';
import { EsdsAvatarComponent } from './esds-avatar.component.ts';

EsdsAvatarComponent.define();

const { args, argTypes } = getStorybookHelpers<EsdsAvatarComponent>('esds-avatar');

const meta = {
  title: 'Components/Avatar',
  component: 'esds-avatar',
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
} satisfies Meta<EsdsAvatarComponent>;

export default meta;

export const Default: StoryObj<EsdsAvatarComponent & AvatarStoryExtraControls> = {
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls,
  }),
  args: {
    image: 'https://picsum.photos/200',
  },
  render: (args) =>
    html`<esds-avatar
      data-esds-avatar-size=${ifDefined(args.size)}
      shape="${ifDefined(args.shape)}"
      image="${ifDefined(args.image)}"
      icon="${ifDefined(args.icon)}"
      initials="${ifDefined(args.initials)}"
    ></esds-avatar>`,
};

export const WithImage: StoryObj<EsdsAvatarComponent & AvatarStoryExtraControls> = {
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls,
  }),
  render: (args) =>
    html`<esds-avatar
      data-esds-avatar-size=${ifDefined(args.size)}
      shape="${ifDefined(args.shape)}"
      image="https://picsum.photos/200"
    ></esds-avatar>`,
};

export const WithIcon: StoryObj<EsdsAvatarComponent & AvatarStoryExtraControls> = {
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls,
  }),
  render: (args) =>
    html`<esds-avatar
      data-esds-avatar-size=${ifDefined(args.size)}
      shape="${ifDefined(args.shape)}"
      icon="esds:calendar-user"
    ></esds-avatar>`,
};

export const WithInitials: StoryObj<EsdsAvatarComponent & AvatarStoryExtraControls> = {
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls,
  }),
  render: (args) =>
    html`<esds-avatar
      data-esds-avatar-size=${ifDefined(args.size)}
      shape="${ifDefined(args.shape)}"
      initials="AB"
    ></esds-avatar>`,
};

export const AllSizes: StoryObj<EsdsAvatarComponent & AvatarStoryExtraControls> = {
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls,
  }),
  render: (args) => html`
    <style>
      .avatars-container {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 24px;
      }
    </style>
    <div class="avatars-container">
      ${AVATAR_SIZES.map(
        (variant) => html`
          <esds-avatar
            data-esds-avatar-size="${variant}"
            shape="${ifDefined(args.shape)}"
            image="${ifDefined(args.image)}"
            icon="${ifDefined(args.icon)}"
            initials="${ifDefined(args.initials)}"
          ></esds-avatar>
        `,
      )}
    </div>
  `,
};
