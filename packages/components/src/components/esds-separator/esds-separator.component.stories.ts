import { EsdsSeparatorComponent } from '@infomaniak-design-system/components';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import documentation from './esds-separator.component.md?raw';

EsdsSeparatorComponent.define();

const { args, argTypes, template } = getStorybookHelpers<EsdsSeparatorComponent>('esds-separator');

const meta = {
  title: 'Components/Separator',
  component: 'esds-separator',
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
} satisfies Meta<EsdsSeparatorComponent>;

export default meta;

type Story = StoryObj<typeof args>;

export const Default: Story = {};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => html`
    <div style="display: flex; align-items: center; gap: 1rem; height: 3rem">
      <span>Left</span>
      ${template(args)}
      <span>Right</span>
    </div>
  `,
};

export const VerticalLabeled: Story = {
  args: {
    orientation: 'vertical',
    'default-slot': 'OR',
  },
  render: (args) => html`
    <div style="display: flex; align-items: center; gap: 1rem; height: 8rem">
      <span>Left</span>
      ${template(args)}
      <span>Right</span>
    </div>
  `,
};

export const Labeled: Story = {
  args: {
    'default-slot': 'OR',
  },
};

export const Decorative: Story = {
  args: {
    decorative: true,
  },
};
