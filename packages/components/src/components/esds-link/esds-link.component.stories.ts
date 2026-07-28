import { EsdsIconComponent } from '@infomaniak-design-system/components';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { htmlElementRef } from '../../helpers/.private/component/html-element-ref.ts';
import { AttributeRegistry } from '../../helpers/custom-attribute/custom-attribute.ts';
import { EsdsLinkAttr } from './esds-link.attr.ts';
import documentation from './esds-link.component.md?raw';
import { EsdsLinkComponent } from './esds-link.component.ts';

EsdsIconComponent.define();
EsdsLinkComponent.define();

const { args, argTypes } = getStorybookHelpers<EsdsLinkComponent>('esds-link');

const meta = {
  title: 'Components/Link',
  component: 'esds-link',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: documentation,
      },
    },
  },
  args,
  argTypes,
} satisfies Meta<EsdsLinkComponent>;

export default meta;

type Story = StoryObj<EsdsLinkComponent>;

export const Default: Story = {
  args: {
    href: 'https://infomaniak.com',
  },
  render: (args) => html` <esds-link href="${args.href}">Text link</esds-link> `,
};

export const AttributeBased: Story = {
  args: {
    href: 'https://infomaniak.com',
    target: '_blank',
    rel: 'noopener noreferrer nofollow',
  },
  render: (args) => html`
    <div style="display: flex; align-content: space-between; gap: 4px; width: 100%">
      <div>abc</div>
      <esds-link
        style="flex-grow: 1"
        href="${args.href}"
        target="${args.target}"
        rel="${args.rel}"
      >
        Abc
      </esds-link>
      <a
        esds-link
        style="flex-grow: 1"
        ${htmlElementRef((element: Element) => {
          EsdsLinkAttr.define({
            registry: AttributeRegistry.of(element.ownerDocument!),
          });
        })}
        href="${args.href}"
        target="${args.target}"
        rel="${args.rel}"
        >def</a
      >
    </div>
  `,
};

export const External: Story = {
  args: {
    href: 'https://infomaniak.com',
    target: '_blank',
  },
  render: (args) => html`
    <esds-link
      href="${args.href}"
      target="${args.target}"
      >Opens in new tab</esds-link
    >
  `,
};

export const Download: Story = {
  args: {
    href: '/some-file.pdf',
    download: 'my-file.pdf',
  },
  render: (args) => html`
    <esds-link
      href="${args.href}"
      download="${args.download}"
    >
      Download file
    </esds-link>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <esds-link
      href="https://infomaniak.com"
      target="_blank"
    >
      Infomaniak<esds-icon
        name="esds:square-arrow-out-up-right"
        inline
      ></esds-icon>
    </esds-link>
  `,
};

export const CustomRel: Story = {
  args: {
    href: 'https://infomaniak.com',
    target: '_blank',
    rel: 'noopener noreferrer nofollow',
  },
  render: (args) => html`
    <esds-link
      href="${args.href}"
      target="${args.target}"
      rel="${args.rel}"
    >
      Set "noopener noreferrer nofollow" rel
    </esds-link>
  `,
};

export const ClickInterception: Story = {
  args: {
    href: 'https://infomaniak.com',
  },
  decorators: [
    (Story) => html`
      <div
        @esds-link-click=${(e: Event) => {
          e.preventDefault();
          console.log('esds-link-click intercepted for:', (e.target as EsdsLinkComponent).href);
        }}
      >
        ${Story()}
      </div>
    `,
  ],
  render: (args) => html`
    <esds-link href="${args.href}">Intercepted link (check console)</esds-link>
  `,
};
