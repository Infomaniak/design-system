import { EsdsIconComponent } from '@infomaniak-design-system/components';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import {
  storybookInteractiveControls,
  type StoryPropertyConfigLike,
} from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
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

interface ExtraControls {
  disabled: boolean;
  loading: boolean;
}

const extraControls: Record<string, StoryPropertyConfigLike> = {
  disabled: {
    value: false,
    type: 'boolean',
  },
  loading: {
    value: false,
    type: 'boolean',
  },
};

export const Button: StoryObj<
  EsdsButtonAttr &
    HTMLButtonElement &
    ExtraControls & {
      content: string;
    }
> = {
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Text content',
  }),
  render: (args) =>
    html`<button
      ${defineEsdsButtonAttr}
      esds-button
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      ${args.content}
    </button>`,
};

export const Link: StoryObj<
  EsdsButtonAttr &
    HTMLAnchorElement &
    ExtraControls & {
      content: string;
    }
> = {
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Link content',
    href: 'https://infomaniak.com',
  }),
  render: (args) =>
    html`<a
      ${defineEsdsButtonAttr}
      esds-button
      href="${args.href}"
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      >${args.content}</a
    >`,
};

export const WithIcon: StoryObj<EsdsButtonAttr & HTMLButtonElement & ExtraControls> = {
  ...storybookInteractiveControls({
    ...extraControls,
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
      ?loading=${args.loading}
    >
      <esds-icon name="esds:plus"></esds-icon>
      ${args.content}
    </button>`,
};

export const Types: StoryObj<EsdsButtonAttr & HTMLButtonElement & ExtraControls> = {
  ...storybookInteractiveControls(extraControls),
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
            ?loading=${args.loading}
          >
            ${variant}
          </button>
        `,
      )}
    </div>
  `,
};

export const Sizes: StoryObj<EsdsButtonAttr & HTMLButtonElement & ExtraControls> = {
  ...storybookInteractiveControls(extraControls),
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
      ${['small', 'medium', 'large'].map(
        (variant) => html`
          <button
            ${defineEsdsButtonAttr}
            esds-button
            data-esds-button-size=${variant}
            ?disabled=${args.disabled}
            ?loading=${args.loading}
            @click="${() => console.log('ok')}"
          >
            <esds-icon name="esds:plus"></esds-icon>
            ${variant}
          </button>
        `,
      )}
    </div>
  `,
};
