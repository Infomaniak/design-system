import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookInteractiveControls } from '../../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';
import {
  AVATAR_STORY_IMAGE,
  avatarStoryExtraControls,
  type AvatarStoryExtraControls,
} from '../esds-avatar.component.stories.shared.ts';
import { EsdsAvatarComponent } from '../esds-avatar.component.ts';
import documentation from './esds-avatar-group.component.md?raw';
import { EsdsAvatarGroupComponent } from './esds-avatar-group.component.ts';

EsdsAvatarGroupComponent.define();
EsdsAvatarComponent.define();

const { args, argTypes } = getStorybookHelpers<EsdsAvatarGroupComponent>('esds-avatar-group');

const meta = {
  title: 'Components/Avatar/Avatar Group',
  component: 'esds-avatar-group',
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
} satisfies Meta<EsdsAvatarGroupComponent>;

export default meta;

interface AvatarStoryPerson {
  readonly image?: string;
  readonly icon?: string;
  readonly initials?: string;
}

const AVATAR_STORY_PEOPLE: readonly AvatarStoryPerson[] = [
  { image: AVATAR_STORY_IMAGE },
  { initials: 'IK' },
  { image: 'https://github.com/lifaon74.png' },
  { icon: 'esds:calendar-user' },
  { image: 'https://github.com/vjo.png' },
  { image: 'data:image/png,broken' }, // intentionally broken image → default user icon fallback
];

export const Default: StoryObj<
  EsdsAvatarGroupComponent & AvatarStoryExtraControls & { count: number }
> = {
  ...storybookInteractiveControls({
    ...avatarStoryExtraControls,
    count: {
      value: 4,
      type: 'number',
    },
  }),
  render: (args) =>
    html`<esds-avatar-group
      data-esds-avatar-size=${ifDefined(args.size)}
      shape="${ifDefined(args.shape)}"
    >
      ${AVATAR_STORY_PEOPLE.slice(0, args.count).map(
        (person) => html`
          <esds-avatar
            image="${ifDefined(person.image)}"
            icon="${ifDefined(person.icon)}"
            initials="${ifDefined(person.initials)}"
          ></esds-avatar>
        `,
      )}
    </esds-avatar-group>`,
};
