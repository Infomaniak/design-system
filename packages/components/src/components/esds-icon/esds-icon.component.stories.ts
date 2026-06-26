import { IconifyApi } from '@infomaniak-design-system/esds-icon';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { provideContext } from '../../helpers/.private/component/provide-context.ts';
import { EsdsIconComponent, ICONIFY_API_CONTEXT } from './esds-icon.component.ts';

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
    return html`
      <div
        ${provideContext([
          [
            ICONIFY_API_CONTEXT,
            new IconifyApi({
              resources: ['https://iconify.preprod.dev.infomaniak.ch'],
            }),
          ],
        ])}
      >
        <esds-icon-lit
          name="${name}"
          inline="${inline}"
        ></esds-icon-lit>
      </div>
    `;
  },
};
