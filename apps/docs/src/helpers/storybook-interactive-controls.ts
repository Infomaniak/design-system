import { EsdsLinkAttr } from '@infomaniak-design-system/components';
import type { StoryHelpers } from '@wc-toolkit/storybook-helpers';

export interface StoryPropertyConfig {
  readonly value: string;
  readonly type?:
    | 'object'
    | 'boolean'
    | 'check'
    | 'inline-check'
    | 'radio'
    | 'inline-radio'
    | 'select'
    | 'multi-select'
    | 'number'
    | 'range'
    | 'file'
    | 'color'
    | 'date'
    | 'text'; /* ControlType*/
}

export type StoryPropertyConfigLike = StoryPropertyConfig | string;

function storyPropertyConfigLikeToStoryPropertyConfig(
  input: StoryPropertyConfigLike,
): StoryPropertyConfig {
  return typeof input === 'string' ? { value: input } : input;
}

export function storybookInteractiveControls(
  properties: Record<string, StoryPropertyConfigLike>,
): Pick<StoryHelpers<EsdsLinkAttr>, 'args' | 'argTypes'> {
  return {
    args: Object.fromEntries(
      Object.entries(properties).map(
        ([key, property]: [string, StoryPropertyConfig | string]): [string, unknown] => {
          const { value } = storyPropertyConfigLikeToStoryPropertyConfig(property);
          return [key, value];
        },
      ),
    ),
    argTypes: Object.fromEntries(
      Object.entries(properties).map(
        ([key, property]: [string, StoryPropertyConfigLike]): [
          string,
          StoryHelpers<unknown>['argTypes'][string],
        ] => {
          const { type } = storyPropertyConfigLikeToStoryPropertyConfig(property);
          return [
            key,
            {
              control: {
                type,
              },
              table: {
                category: 'Interactive Controls',
              },
            },
          ];
        },
      ),
    ),
  };
}
