import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { EsdsIconComponent } from './esds-icon.component.ts';

EsdsIconComponent.define();

const { args, argTypes, template } = getStorybookHelpers<EsdsIconComponent>('esds-icon');

const meta = {
  title: 'Components/Icon',
  component: 'esds-icon',
  tags: ['autodocs'],
  args,
  argTypes,
  render: (args) => template(args),
} satisfies Meta<EsdsIconComponent>;

export default meta;

type Story = StoryObj<EsdsIconComponent>;

export const Default: Story = {
  args: {
    name: 'esds:headset',
  },
};
