import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  storybookInteractiveControls,
  type StoryPropertyConfigLike,
} from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import documentation from './esds-avatar.component.md?raw';
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

const AVATAR_SHAPES = ['circle', 'square'] as const;

const AVATAR_SIZES = ['xl'] as const;

interface ExtraControls {
  shape: (typeof AVATAR_SHAPES)[number];
  size: (typeof AVATAR_SIZES)[number];
}

const extraControls: Record<string, StoryPropertyConfigLike> = {
  shape: {
    value: 'circle',
    type: 'select',
    options: AVATAR_SHAPES,
  },
  size: {
    value: 'xl',
    type: 'select',
    options: AVATAR_SIZES,
  },
};

export const Default: StoryObj<EsdsAvatarComponent & ExtraControls> = {
  ...storybookInteractiveControls({
    ...extraControls,
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

export const WithImage: StoryObj<EsdsAvatarComponent & ExtraControls> = {
  ...storybookInteractiveControls({
    ...extraControls,
  }),
  render: (args) =>
    html`<esds-avatar
      data-esds-avatar-size=${ifDefined(args.size)}
      shape="${ifDefined(args.shape)}"
      image="https://picsum.photos/200"
    ></esds-avatar>`,
};

export const WithIcon: StoryObj<EsdsAvatarComponent & ExtraControls> = {
  ...storybookInteractiveControls({
    ...extraControls,
  }),
  render: (args) =>
    html`<esds-avatar
      data-esds-avatar-size=${ifDefined(args.size)}
      shape="${ifDefined(args.shape)}"
      icon="esds:calendar-user"
    ></esds-avatar>`,
};

export const WithInitials: StoryObj<EsdsAvatarComponent & ExtraControls> = {
  ...storybookInteractiveControls({
    ...extraControls,
  }),
  render: (args) =>
    html`<esds-avatar
      data-esds-avatar-size=${ifDefined(args.size)}
      shape="${ifDefined(args.shape)}"
      initials="AB"
    ></esds-avatar>`,
};
