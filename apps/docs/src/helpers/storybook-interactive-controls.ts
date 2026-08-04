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

/**
 * Generates Storybook interactive controls configuration for a given set of properties.
 *
 * @template T - The type of the component being documented.
 * @param {Record<string, StoryPropertyConfigLike>} properties - An object where keys represent property names and values represent their configuration.
 * @return {Pick<StoryHelpers<T>, 'args' | 'argTypes'>} Returns an object containing `args` and `argTypes` for Storybook interactive controls.
 */
export function storybookInteractiveControls<T>(
  properties: Record<string, StoryPropertyConfigLike>,
): Pick<StoryHelpers<T>, 'args' | 'argTypes'> {
  return {
    args: Object.fromEntries(
      Object.entries(properties).map(
        ([key, property]: [string, StoryPropertyConfig | string]): [string, unknown] => {
          const { value } = storyPropertyConfigLikeToStoryPropertyConfig(property);
          return [key, value];
        },
      ),
    ) as StoryHelpers<T>['args'],
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
