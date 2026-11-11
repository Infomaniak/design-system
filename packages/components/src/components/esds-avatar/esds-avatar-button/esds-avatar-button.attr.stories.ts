import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  storybookInteractiveControls,
  type StoryPropertyConfigLike,
} from '../../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import { htmlElementRef } from '../../../helpers/.private/component/html-element-ref.ts';
import { AttributeRegistry } from '../../../helpers/custom-attribute/custom-attribute.ts';
import {
  avatarStoryExtraControls,
  type AvatarStoryExtraControls,
} from '../esds-avatar.component.stories.shared.ts';
import { EsdsAvatarComponent } from '../esds-avatar.component.ts';
import documentation from './esds-avatar-button.attr.md?raw';
import { EsdsAvatarButtonAttr } from './esds-avatar-button.attr.ts';

EsdsAvatarComponent.define();

const defineEsdsAvatarButtonAttr = htmlElementRef((element: Element) => {
  EsdsAvatarButtonAttr.define({
    registry: AttributeRegistry.of(element.ownerDocument!),
  });
});

const { args, argTypes } = getStorybookHelpers<EsdsAvatarButtonAttr>('esds-avatar-button');

const meta = {
  title: 'Components/Avatar/Avatar Button',
  component: 'esds-avatar-button',
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
} satisfies Meta<EsdsAvatarButtonAttr>;

export default meta;

interface AvatarButtonExtraControls extends AvatarStoryExtraControls {
  disabled: boolean;
  image: string;
  icon: string;
  initials: string;
}

const avatarButtonExtraControls: Record<string, StoryPropertyConfigLike> = {
  ...avatarStoryExtraControls,
  disabled: {
    value: false,
    type: 'boolean',
  },
  image: 'https://picsum.photos/seed/esds-avatar/48',
  icon: '',
  initials: '',
};

export const Default: StoryObj<
  EsdsAvatarButtonAttr & EsdsAvatarComponent & AvatarButtonExtraControls
> = {
  ...storybookInteractiveControls({
    ...avatarButtonExtraControls,
  }),
  render: (args) => html`
    <button
      ${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      data-esds-avatar-size="${args.size}"
      ?disabled=${args.disabled}
    >
      <esds-avatar
        shape="${ifDefined(args.shape)}"
        image="${ifDefined(args.image)}"
        icon="${ifDefined(args.icon)}"
        initials="${ifDefined(args.initials)}"
      ></esds-avatar>
    </button>
  `,
};

export const WithImage: StoryObj<
  EsdsAvatarButtonAttr & EsdsAvatarComponent & AvatarButtonExtraControls
> = {
  ...storybookInteractiveControls({
    ...avatarButtonExtraControls,
  }),
  render: (args) => html`
    <button
      ${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      data-esds-avatar-size="${args.size}"
      ?disabled=${args.disabled}
    >
      <esds-avatar
        shape="${ifDefined(args.shape)}"
        image="https://picsum.photos/seed/esds-avatar/48"
      ></esds-avatar>
    </button>
  `,
};

export const WithIcon: StoryObj<
  EsdsAvatarButtonAttr & EsdsAvatarComponent & AvatarButtonExtraControls
> = {
  ...storybookInteractiveControls({
    ...avatarButtonExtraControls,
  }),
  render: (args) => html`
    <button
      ${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      data-esds-avatar-size="${args.size}"
      ?disabled=${args.disabled}
    >
      <esds-avatar
        shape="${ifDefined(args.shape)}"
        icon="esds:calendar-user"
      ></esds-avatar>
    </button>
  `,
};

export const WithInitials: StoryObj<
  EsdsAvatarButtonAttr & EsdsAvatarComponent & AvatarButtonExtraControls
> = {
  ...storybookInteractiveControls({
    ...avatarButtonExtraControls,
  }),
  render: (args) => html`
    <button
      ${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      data-esds-avatar-size="${args.size}"
      ?disabled=${args.disabled}
    >
      <esds-avatar
        shape="${ifDefined(args.shape)}"
        initials="AB"
      ></esds-avatar>
    </button>
  `,
};
