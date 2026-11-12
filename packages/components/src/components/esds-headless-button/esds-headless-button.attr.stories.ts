import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import {
  storybookInteractiveControls,
  type StoryPropertyConfigLike,
} from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import { htmlElementRef } from '../../helpers/.private/component/html-element-ref.ts';
import { AttributeRegistry } from '../../helpers/custom-attribute/custom-attribute.ts';
import { EsdsButtonAttr } from '../esds-button/esds-button.attr.ts';
import documentation from './esds-headless-button.attr.md?raw';
import { EsdsHeadlessButtonAttr } from './esds-headless-button.attr.ts';

const defineHeadlessAndButtonAttrs = htmlElementRef((element: Element) => {
  const registry = AttributeRegistry.of(element.ownerDocument!);

  EsdsHeadlessButtonAttr.define({ registry });
  EsdsButtonAttr.define({ registry });
});

const { args, argTypes } = getStorybookHelpers<EsdsHeadlessButtonAttr>('esds-headless-button');

const meta = {
  title: 'Components/Headless Button',
  component: 'esds-headless-button',
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
} satisfies Meta<EsdsHeadlessButtonAttr>;

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

export const NativeButton: StoryObj<
  EsdsHeadlessButtonAttr & HTMLButtonElement & ExtraControls & { content: string }
> = {
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Native-looking button',
  }),
  render: (args) =>
    html`<button
      ${defineHeadlessAndButtonAttrs}
      esds-headless-button
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      ${args.content}
    </button>`,
};

export const AnchorAsButton: StoryObj<
  EsdsHeadlessButtonAttr & HTMLAnchorElement & ExtraControls & { content: string; href: string }
> = {
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Anchor acting as a button',
    href: 'https://infomaniak.com',
  }),
  render: (args) =>
    html`<a
      ${defineHeadlessAndButtonAttrs}
      esds-headless-button
      href="${args.href}"
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      ${args.content}
    </a>`,
};

export const SameContractNoLook: StoryObj<
  EsdsHeadlessButtonAttr & HTMLButtonElement & ExtraControls & { content: string }
> = {
  ...storybookInteractiveControls({
    ...extraControls,
    content: 'Same contract, no look',
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The same behavior contract as `esds-button`, with zero styling: the native look stays native.',
      },
    },
  },
  render: (args) =>
    html`<button
        ${defineHeadlessAndButtonAttrs}
        esds-button
        ?disabled=${args.disabled}
        ?loading=${args.loading}
      >
        ${args.content}
      </button>
      <button
        ${defineHeadlessAndButtonAttrs}
        esds-headless-button
        ?disabled=${args.disabled}
        ?loading=${args.loading}
      >
        ${args.content}
      </button>`,
};
