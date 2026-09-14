import { EsdsIconComponent } from '@infomaniak-design-system/components';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { storybookInteractiveControls } from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import { htmlElementRef } from '../../helpers/.private/component/html-element-ref.ts';
import { AttributeRegistry } from '../../helpers/custom-attribute/custom-attribute.ts';
import documentation from './esds-button.attr.md?raw';
import { EsdsButtonAttr } from './esds-button.attr.ts';

EsdsIconComponent.define();

const defineEsdsButtonAttr = htmlElementRef((element: Element) => {
  EsdsButtonAttr.define({
    registry: AttributeRegistry.of(element.ownerDocument!),
  });
});

const { args, argTypes } = getStorybookHelpers<EsdsButtonAttr>('esds-button');

const meta = {
  title: 'Components/Button',
  component: 'esds-button',
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
} satisfies Meta<EsdsButtonAttr>;

export default meta;

// type Story = StoryObj<EsdsButtonAttr & HTMLButtonElement>;

export const Button: StoryObj<
  EsdsButtonAttr &
    HTMLButtonElement & {
      content: string;
      disabled: boolean;
    }
> = {
  ...storybookInteractiveControls({
    content: 'Text content',
    disabled: {
      value: false,
      type: 'boolean',
    },
  }),
  render: (args) =>
    html`<button
      ${defineEsdsButtonAttr}
      esds-button
      ?disabled=${args.disabled}
    >
      ${args.content}
    </button>`,
};

export const Link: StoryObj<
  EsdsButtonAttr &
    HTMLAnchorElement & {
      content: string;
      disabled: boolean;
    }
> = {
  ...storybookInteractiveControls({
    content: 'Link content',
    href: 'https://infomaniak.com',
    disabled: {
      value: false,
      type: 'boolean',
    },
  }),
  render: (args) =>
    html`<a
      ${defineEsdsButtonAttr}
      esds-button
      href="${args.href}"
      ?disabled=${args.disabled}
      >${args.content}</a
    >`,
};

export const WithIcon: StoryObj<
  EsdsButtonAttr &
    HTMLButtonElement & {
      content: string;
      disabled: boolean;
    }
> = {
  ...storybookInteractiveControls({
    content: 'Add',
    disabled: {
      value: false,
      type: 'boolean',
    },
  }),
  render: (args) =>
    html`<button
      ${defineEsdsButtonAttr}
      esds-button
      ?disabled=${args.disabled}
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${args.content}
    </button>`,
};

export const Types: StoryObj<
  EsdsButtonAttr &
    HTMLButtonElement & {
      disabled: boolean;
    }
> = {
  ...storybookInteractiveControls({
    disabled: {
      value: false,
      type: 'boolean',
    },
  }),

  render: (args) => html`
    <style>
      .buttons-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 12px;
      }
    </style>
    <div class="buttons-container">
      ${['primary', 'secondary', 'destructive', 'ghost', 'ghost-destructive'].map(
        (variant) => html`
          <button
            ${defineEsdsButtonAttr}
            esds-button
            data-esds-button-type=${variant}
            ?disabled=${args.disabled}
          >
            ${variant}
          </button>
        `,
      )}
    </div>
  `,
};

export const Sizes: StoryObj<
  EsdsButtonAttr &
    HTMLButtonElement & {
      disabled: boolean;
    }
> = {
  ...storybookInteractiveControls({
    disabled: {
      value: false,
      type: 'boolean',
    },
  }),

  render: (args) => html`
    <style>
      .buttons-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 12px;
      }
    </style>
    ${['small', 'medium', 'large'].map(
      (variant) => html`
        <button
          ${defineEsdsButtonAttr}
          esds-button
          data-esds-button-size=${variant}
          ?disabled=${args.disabled}
        >
          ${variant}
        </button>
      `,
    )}
  `,
};
