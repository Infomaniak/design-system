import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { storybookInteractiveControls } from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import { htmlElementRef } from '../../helpers/.private/component/html-element-ref.ts';
import { AttributeRegistry } from '../../helpers/custom-attribute/custom-attribute.ts';
import documentation from './esds-kbd.attr.md?raw';
import { EsdsKbdAttr } from './esds-kbd.attr.ts';

const defineEsdsKbdAttr = htmlElementRef((element: Element) => {
  EsdsKbdAttr.define({
    registry: AttributeRegistry.of(element.ownerDocument!),
  });
});

const { args, argTypes } = getStorybookHelpers<EsdsKbdAttr>('esds-kbd');

const meta = {
  title: 'Components/Kbd',
  component: 'esds-kbd',
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
} satisfies Meta<EsdsKbdAttr>;

export default meta;

type Story = StoryObj<
  EsdsKbdAttr &
    HTMLElement & {
      text: string;
    }
>;

export const Default: Story = {
  ...storybookInteractiveControls({
    text: 'K',
  }),
  render: (args) =>
    html`<p>
      Press
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >${args.text}</kbd
      >
      to open the search.
    </p>`,
};

export const Shortcut: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Multi-key shortcuts are a single `<kbd esds-kbd>` element containing the full combination, e.g. `⌘+K`.',
      },
    },
  },
  render: () => html`
    <p>
      Press
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⌘+K</kbd
      >
      to open the command menu.
    </p>
  `,
};

export const SpecialKeys: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Modifier and special keys are plain Unicode characters typed literally in the markup — the attribute applies no mapping. Copy the glyph you need from the canvas, or the ready-to-use markup from the source below.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--esds-spacing-sm);">
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⇧</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⌥</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⌘</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⌃</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⏎</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⌫</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⇥</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⎋</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⇪</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >⏏</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >←</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >↑</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >→</kbd
      >
      <kbd
        ${defineEsdsKbdAttr}
        esds-kbd
        >↓</kbd
      >
    </div>
  `,
};
