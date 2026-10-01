import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { storybookInteractiveControls } from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import { htmlElementRef } from '../../helpers/.private/component/html-element-ref.ts';
import { AttributeRegistry } from '../../helpers/custom-attribute/custom-attribute.ts';
import documentation from './esds-body.attr.md?raw';
import { EsdsBodyAttr } from './esds-body.attr.ts';

const defineEsdsBodyAttr = htmlElementRef((element: Element) => {
  EsdsBodyAttr.define({
    registry: AttributeRegistry.of(element.ownerDocument!),
  });
});

const { args, argTypes } = getStorybookHelpers<EsdsBodyAttr>('esds-body');

const meta = {
  title: 'Components/Body',
  component: 'esds-body',
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
} satisfies Meta<EsdsBodyAttr>;

export default meta;

export const Default: StoryObj<
  EsdsBodyAttr &
    HTMLElement & {
      text: string;
      size: 'xs' | 'sm' | 'md' | 'lg';
      emphasized: boolean;
    }
> = {
  ...storybookInteractiveControls({
    text: 'This is a body example',
    size: {
      value: 'md',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    emphasized: {
      value: false,
      type: 'boolean',
    },
  }),
  render: (args) =>
    html`<p
      ${defineEsdsBodyAttr}
      esds-body="${args.size}"
      ?emphasized="${args.emphasized}"
    >
      ${args.text}
    </p>`,
};

export const WithStrongContent: StoryObj<
  EsdsBodyAttr &
    HTMLElement & {
      size: 'xs' | 'sm' | 'md' | 'lg';
    }
> = {
  ...storybookInteractiveControls({
    size: {
      value: 'md',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  }),
  render: (args) =>
    html`<p
      ${defineEsdsBodyAttr}
      esds-body="${args.size}"
    >
      This is a body example <strong>with strong content</strong>
    </p>`,
};

export const AllSizes: StoryObj<
  EsdsBodyAttr &
    HTMLElement & {
      text: string;
      emphasized: boolean;
    }
> = {
  ...storybookInteractiveControls({
    text: 'This is a body example',
    emphasized: {
      value: false,
      type: 'boolean',
    },
  }),
  render: (args) => html`
    ${['xs', 'sm', 'md', 'lg'].map((size) => {
      return html`<p
        ${defineEsdsBodyAttr}
        esds-body="${size}"
        ?emphasized="${args.emphasized}"
      >
        ${args.text}
      </p>`;
    })}
  `,
};
