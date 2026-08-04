import { EsdsIconComponent } from '@infomaniak-design-system/components';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { storybookInteractiveControls } from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import { htmlElementRef } from '../../helpers/.private/component/html-element-ref.ts';
import { AttributeRegistry } from '../../helpers/custom-attribute/custom-attribute.ts';
import documentation from './esds-text-link.attr.md?raw';
import { EsdsTextLinkAttr } from './esds-text-link.attr.ts';

EsdsIconComponent.define();

const defineEsdsLinkAttr = htmlElementRef((element: Element) => {
  EsdsTextLinkAttr.define({
    registry: AttributeRegistry.of(element.ownerDocument!),
  });
});

const { args, argTypes } = getStorybookHelpers<EsdsTextLinkAttr>('esds-text-link');

const meta = {
  title: 'Components/Link',
  component: 'esds-text-link',
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
} satisfies Meta<EsdsTextLinkAttr>;

export default meta;

type Story = StoryObj<EsdsTextLinkAttr & HTMLAnchorElement>;

export const Default: Story = {
  ...storybookInteractiveControls({
    href: 'https://infomaniak.com',
  }),
  render: (args) =>
    html`<a
      ${defineEsdsLinkAttr}
      esds-text-link
      href="${args.href}"
      >Text link</a
    >`,
};

export const External: Story = {
  ...storybookInteractiveControls({
    href: 'https://infomaniak.com',
    target: '_blank',
    rel: 'noopener noreferrer nofollow',
  }),
  render: (args) => html`
    <a
      ${defineEsdsLinkAttr}
      esds-text-link
      href="${args.href}"
      target="${args.target}"
      rel="${args.rel}"
      >Opens in new tab</a
    >
  `,
};

export const Download: Story = {
  ...storybookInteractiveControls({
    href: '/some-file.pdf',
    download: 'my-file.pdf',
  }),
  render: (args) => html`
    <a
      ${defineEsdsLinkAttr}
      esds-text-link
      href="${args.href}"
      download="${args.download}"
    >
      Download file
    </a>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <a
      ${defineEsdsLinkAttr}
      esds-text-link
      href="https://infomaniak.com"
      target="_blank"
    >
      Infomaniak
      <esds-icon
        name="esds:square-arrow-out-up-right"
        inline
      ></esds-icon>
    </a>
  `,
};

export const Underline: Story = {
  ...storybookInteractiveControls({
    href: 'https://infomaniak.com',
  }),
  render: (args) => html`
    <a
      ${defineEsdsLinkAttr}
      esds-text-link
      underline
      href="${args.href}"
    >
      Link with underline
    </a>
  `,
};
