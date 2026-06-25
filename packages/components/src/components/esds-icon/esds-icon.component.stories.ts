import { IconifyApi } from '@infomaniak-design-system/esds-icon';
import { ContextProvider } from '@lit/context';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { htmlElementRef } from '../../helpers/.private/component/html-element.ref.ts';
import { EsdsIconComponent, ICONIFY_API_CONTEXT } from './esds-icon.component.ts';

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
        ${htmlElementRef((element: HTMLElement) => {
          const context = new ContextProvider(element, {
            context: ICONIFY_API_CONTEXT,
          });

          context.setValue(
            new IconifyApi({
              resources: ['https://iconify.preprod.dev.infomaniak.ch'],
            }),
          );

          context.hostConnected();

          return (): void => {
            context.clearCallbacks();
          };
        })}
      >
        <esds-icon-lit
          name="${name}"
          inline="${inline}"
        ></esds-icon-lit>
      </div>
    `;
  },
};
