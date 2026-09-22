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
  render: (args) => html`
    <div
      style="display: flex; flex-direction: ${
        args.orientation === 'vertical' ? 'row' : 'column'
      }; align-items: center; gap: 1rem; min-height: 3rem"
    >
      <span>before</span>
      ${template(args)}
      <span>after</span>
    </div>
  `,
} satisfies Meta<EsdsSeparatorComponent>;

export default meta;

type Story = StoryObj<typeof args>;

export const Default: Story = {};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
};

export const Decorative: Story = {
  args: {
    decorative: true,
  },
};
