import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  storybookInteractiveControls,
  type StoryPropertyConfigLike,
} from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import documentation from './esds-badge.component.md?raw';
import { EsdsBadgeComponent } from './esds-badge.component.ts';

EsdsBadgeComponent.define();

const { args, argTypes } = getStorybookHelpers<EsdsBadgeComponent>('esds-badge');

const meta = {
  title: 'Components/Badge',
  component: 'esds-badge',
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
} satisfies Meta<EsdsBadgeComponent>;

export default meta;

const BADGE_TYPES = ['primary', 'neutral'] as const;

interface ExtraControls {
  badgeType: (typeof BADGE_TYPES)[number];
}

const extraControls: Record<string, StoryPropertyConfigLike> = {
  badgeType: {
    value: 'primary',
    type: 'select',
    options: BADGE_TYPES,
  },
};

export const Default: StoryObj<
  EsdsBadgeComponent &
    ExtraControls & {
      'default-slot': string;
    }
> = {
  ...storybookInteractiveControls({
    ...extraControls,
  }),
  args: {
    'default-slot': '3',
  },
  render: (args) =>
    html`<esds-badge data-esds-badge-type=${ifDefined(args.badgeType)}
      >${args['default-slot']}</esds-badge
    >`,
};

export const Empty: StoryObj<EsdsBadgeComponent & ExtraControls> = {
  ...storybookInteractiveControls({
    ...extraControls,
  }),
  render: (args) =>
    html`<esds-badge data-esds-badge-type=${ifDefined(args.badgeType)}></esds-badge>`,
};
