import {
  EsdsIconComponent,
  ICONIFY_API,
  InjectionContext,
} from '@infomaniak-design-system/components';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { IconifyApi } from '../../iconify-api/iconify-api.ts';

EsdsIconComponent.define();

const { args, argTypes, template } = getStorybookHelpers<EsdsIconComponent>('esds-icon-lit');

const meta = {
  title: 'Components/Icon',
  component: 'esds-icon-lit',
  tags: ['autodocs'],
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

export const Preprod: Story = {
  args: {
    name: 'esds:bug',
  },
  render: ({ name, inline }: EsdsIconComponentStoryArgs) => {
    const ctx = new InjectionContext([
      ICONIFY_API.define(
        new IconifyApi({
          resources: ['https://iconify.preprod.dev.infomaniak.ch'],
        }),
      ),
    ]);

    return html`
      <esds-icon-lit
        data-inject="${ctx.id}"
        name="${name}"
        inline="${inline}"
      ></esds-icon-lit>
    `;
  },
};
