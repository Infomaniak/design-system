import { EsdsIconComponent } from '@infomaniak-design-system/components';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { storybookInteractiveControls } from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import { htmlElementRef } from '../../helpers/.private/component/html-element-ref.ts';
import { AttributeRegistry } from '../../helpers/custom-attribute/custom-attribute.ts';
import documentation from './esds-button.attr.md?raw';
import { EsdsButtonAttr } from './esds-button.attr.ts';

EsdsIconComponent.define();

const defineEsdsButtonAttr = htmlElementRef((element: Element) => {
  EsdsButtonAttr.define({
    registry: AttributeRegistry.of(element.ownerDocument!),
  });
});

const { args, argTypes } = getStorybookHelpers<EsdsButtonAttr>('esds-button');

const meta = {
  title: 'Components/Button',
  component: 'esds-button',
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
} satisfies Meta<EsdsButtonAttr>;

export default meta;

// type Story = StoryObj<EsdsButtonAttr & HTMLButtonElement>;

export const Default: StoryObj<
  EsdsButtonAttr &
    HTMLButtonElement & {
      content: string;
    }
> = {
  ...storybookInteractiveControls({
    content: 'Text content',
  }),
  render: (args) =>
    html`<button
      ${defineEsdsButtonAttr}
      esds-button
    >
      ${args.content}
    </button>`,
};

export const Link: StoryObj<EsdsButtonAttr & HTMLAnchorElement> = {
  ...storybookInteractiveControls({
    href: 'https://infomaniak.com',
  }),
  render: (args) =>
    html`<a
      ${defineEsdsButtonAttr}
      esds-button
      href="${args.href}"
      >Button link</a
    >`,
};
