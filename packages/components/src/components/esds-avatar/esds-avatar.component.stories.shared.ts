import type { StoryPropertyConfigLike } from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';

export const AVATAR_SHAPES = ['circle', 'square'] as const;

export const AVATAR_SIZES = ['extra-large', 'large', 'medium', 'small'] as const;

export interface AvatarStoryExtraControls {
  shape: (typeof AVATAR_SHAPES)[number];
  size: (typeof AVATAR_SIZES)[number];
}

export const avatarStoryExtraControls: Record<string, StoryPropertyConfigLike> = {
  shape: {
    value: 'circle',
    type: 'select',
    options: AVATAR_SHAPES,
  },
  size: {
    value: 'large',
    type: 'select',
    options: AVATAR_SIZES,
  },
};
