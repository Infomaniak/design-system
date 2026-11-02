import type { StoryHelpers } from '@wc-toolkit/storybook-helpers';
export interface StoryPropertyConfig {
    readonly value: string | number | boolean;
    readonly type?: 'object' | 'boolean' | 'check' | 'inline-check' | 'radio' | 'inline-radio' | 'select' | 'multi-select' | 'number' | 'range' | 'file' | 'color' | 'date' | 'text';
    readonly options?: readonly unknown[];
}
export type StoryPropertyConfigLike = StoryPropertyConfig | string;
/**
 * Generates Storybook interactive controls configuration for a given set of properties.
 *
 * @template T - The type of the component being documented.
 * @param {Record<string, StoryPropertyConfigLike>} properties - An object where keys represent property names and values represent their configuration.
 * @return {Pick<StoryHelpers<T>, 'args' | 'argTypes'>} Returns an object containing `args` and `argTypes` for Storybook interactive controls.
 */
export declare function storybookInteractiveControls<T>(properties: Record<string, StoryPropertyConfigLike>): Pick<StoryHelpers<T>, 'args' | 'argTypes'>;
