import type { StoryPropertyConfigLike } from '../../../../../apps/docs/src/helpers/storybook-interactive-controls.ts';

export const AVATAR_STORY_IMAGE: string =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzAwcHgiIGhlaWdodD0iMzAwcHgiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPmxvZ28tazwvdGl0bGU+CiAgICA8ZyBpZD0ibG9nby1rIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iaW5mb21hbmlhay1hdmF0YXIiPgogICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiBmaWxsPSIjMDA5OEZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHg9IjAiIHk9IjAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiByeD0iMzAiPjwvcmVjdD4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9ImsiIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iNjQgMjUwLjggMTI2LjQgMjUwLjggMTI2LjQgMjEwIDE0OS4xNzgxOTQgMTg4LjAzNjU2NCAxODEuNiAyNTAuOCAyNTAuNiAyNTAuOCAxODkuNzQ5NTU5IDE0OS4xODE5MzggMjQ3IDk0Ljc5ODY3ODQgMTcyIDk0Ljc5ODY3ODQgMTI2LjQgMTQ2LjM5ODY3OCAxMjYuNCAwIDY0IDAiPjwvcG9seWdvbj4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';

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
