import {
  EsdsIconComponent,
  ICONIFY_API,
  InjectionContext,
} from '@infomaniak-design-system/components';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import type { PartialStoryFn } from 'storybook/internal/csf';
import { IconifyApi } from '../../iconify-api/iconify-api.ts';
import documentation from './esds-icon.component.md?raw';

EsdsIconComponent.define();

const { args, argTypes, template } = getStorybookHelpers<EsdsIconComponent>('esds-icon');

const meta = {
  title: 'Components/Icon',
  component: 'esds-icon',
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
  render: (args) => template(args),
} satisfies Meta<EsdsIconComponent>;

export default meta;

type EsdsIconComponentStoryArgs = Pick<EsdsIconComponent, 'name' | 'inline'>;

type Story = StoryObj<EsdsIconComponentStoryArgs>;

export const Default: Story = {
  args: {
    name: 'esds:headset',
  },
};

export const Inline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Add the `inline` attribute so the icon aligns with the surrounding text flow, e.g. inside a link.',
      },
    },
  },
  args: {
    name: 'esds:square-arrow-out-up-right',
  },
  render: (args) => html`
    <a href="#">
      Follow this link
      <esds-icon
        name="${args.name}"
        inline
      ></esds-icon>
    </a>
  `,
};

export const Preprod: Story = {
  args: {
    name: 'esds:bug',
  },
  decorators: [
    (Story: PartialStoryFn) => {
      const ctx = new InjectionContext([
        ICONIFY_API.define(
          new IconifyApi({
            resources: ['https://iconify.preprod.dev.infomaniak.ch'],
          }),
        ),
      ]);
      return html`
        <div data-inject="${ctx.id}">
          ${Story()}
          <!-- NOTE: data-inject can be set directly on the component itself -->
        </div>
      `;
    },
  ],
};
