import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookInteractiveControls } from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import documentation from './esds-avatar.component.md?raw';
import {
  AVATAR_SIZES,
  AVATAR_STORY_IMAGE,
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
    image: AVATAR_STORY_IMAGE,
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
      image="${AVATAR_STORY_IMAGE}"
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

export const ImageFallback: StoryObj<EsdsAvatarComponent & AvatarStoryExtraControls> = {
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
      <!-- the image fails to load, falling back to the initials -->
      <esds-avatar
        data-esds-avatar-size="${args.size}"
        shape="${ifDefined(args.shape)}"
        image="data:image/png;base64,aW52YWxpZA=="
        initials="AB"
      ></esds-avatar>
      <!-- the image fails to load, falling back to the icon -->
      <esds-avatar
        data-esds-avatar-size="${args.size}"
        shape="${ifDefined(args.shape)}"
        image="data:image/png;base64,aW52YWxpZA=="
        icon="esds:calendar-user"
      ></esds-avatar>
      <!-- the image fails to load, falling back to the default user icon -->
      <esds-avatar
        data-esds-avatar-size="${args.size}"
        shape="${ifDefined(args.shape)}"
        image="data:image/png;base64,aW52YWxpZA=="
      ></esds-avatar>
    </div>
  `,
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
