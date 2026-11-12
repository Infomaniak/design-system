import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import {
  storybookInteractiveControls,
  type StoryPropertyConfigLike,
} from '../../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import { htmlElementRef } from '../../../helpers/.private/component/html-element-ref.ts';
import { AttributeRegistry } from '../../../helpers/custom-attribute/custom-attribute.ts';
import documentation from './esds-avatar-button.attr.md?raw';
import { EsdsAvatarButtonAttr } from './esds-avatar-button.attr.ts';

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

interface ExtraControls {
  disabled: boolean;
  loading: boolean;
}

const extraControls: Record<string, StoryPropertyConfigLike> = {
  disabled: {
    value: false,
    type: 'boolean',
  },
  loading: {
    value: false,
    type: 'boolean',
  },
};

export const Default: StoryObj<
  EsdsAvatarButtonAttr & HTMLButtonElement & ExtraControls & { initials: string }
> = {
  ...storybookInteractiveControls({
    ...extraControls,
    initials: 'AB',
  }),
  parameters: {
    docs: {
      description: {
        story:
          'POC forward-port: renders a plain span instead of the `esds-avatar` component (absent on this branch). The hover/pressed/disabled styles targeting the avatar child are inactive here.',
      },
    },
  },
  render: (args) =>
    html`<button
      ${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      <span>${args.initials}</span>
    </button>`,
};

export const Link: StoryObj<
  EsdsAvatarButtonAttr & HTMLAnchorElement & ExtraControls & { initials: string }
> = {
  ...storybookInteractiveControls({
    ...extraControls,
    initials: 'AB',
    href: 'https://infomaniak.com',
  }),
  render: (args) =>
    html`<a
      ${defineEsdsAvatarButtonAttr}
      esds-avatar-button
      href="${args.href}"
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      <span>${args.initials}</span>
    </a>`,
};
