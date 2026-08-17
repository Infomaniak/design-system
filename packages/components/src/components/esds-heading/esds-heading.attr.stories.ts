import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { storybookInteractiveControls } from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import { htmlElementRef } from '../../helpers/.private/component/html-element-ref.ts';
import { AttributeRegistry } from '../../helpers/custom-attribute/custom-attribute.ts';
import documentation from './esds-heading.attr.md?raw';
import { EsdsHeadingAttr } from './esds-heading.attr.ts';

const defineEsdsHeadingAttr = htmlElementRef((element: Element) => {
  EsdsHeadingAttr.define({
    registry: AttributeRegistry.of(element.ownerDocument!),
  });
});

const { args, argTypes } = getStorybookHelpers<EsdsHeadingAttr>('esds-heading');

const meta = {
  title: 'Components/Heading',
  component: 'esds-heading',
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
} satisfies Meta<EsdsHeadingAttr>;

export default meta;

export const Default: StoryObj<
  EsdsHeadingAttr &
    HTMLElement & {
      text: string;
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    }
> = {
  ...storybookInteractiveControls({
    text: 'This is a heading example',
    size: {
      value: 'md',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  }),
  render: (args) =>
    html`<h1
      ${defineEsdsHeadingAttr}
      esds-heading="${args.size}"
    >
      ${args.text}
    </h1>`,
};

export const AllSizes: StoryObj<
  EsdsHeadingAttr &
    HTMLElement & {
      text: string;
    }
> = {
  ...storybookInteractiveControls({
    text: 'This is a heading example',
  }),
  render: (args) => html`
    <h1
      ${defineEsdsHeadingAttr}
      esds-heading="xl"
    >
      ${args.text}
    </h1>
    <h2
      ${defineEsdsHeadingAttr}
      esds-heading="lg"
    >
      ${args.text}
    </h2>
    <h3
      ${defineEsdsHeadingAttr}
      esds-heading="md"
    >
      ${args.text}
    </h3>
    <h4
      ${defineEsdsHeadingAttr}
      esds-heading="sm"
    >
      ${args.text}
    </h4>
    <h5
      ${defineEsdsHeadingAttr}
      esds-heading="xs"
    >
      ${args.text}
    </h5>
  `,
};
