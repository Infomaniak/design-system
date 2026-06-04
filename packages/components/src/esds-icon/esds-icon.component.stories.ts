import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import './esds-icon.component.js';
import { EsdsIconComponent } from './esds-icon.component.js';

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

type Story = StoryObj<EsdsIconComponent>;

export const Default: Story = {
  args: {
    name: 'esds:headset',
  },
};
