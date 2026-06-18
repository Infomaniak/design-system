import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { DraftComponentComponent } from './draft-component.component.ts';

const { args, argTypes, template } =
  getStorybookHelpers<DraftComponentComponent>('draft-component');

const meta = {
  title: 'Components/Draft Component',
  component: 'draft-component',
  tags: ['autodocs'],
  args,
  argTypes,
  render: (args) => template(args),
} satisfies Meta<DraftComponentComponent>;

export default meta;

type Story = StoryObj<DraftComponentComponent>;

export const Default: Story = {
  args: {
    label: 'Draft Component',
  },
};
