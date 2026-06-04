import type { StorybookConfig } from '@storybook/web-components-vite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { webComponentAutoReload } from './vite-web-component-autoreload.ts';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/components/src/**/*.stories.ts',
  ],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding'),
  ],
  framework: getAbsolutePath('@storybook/web-components-vite'),
  viteFinal: async (config) => {
    config.plugins ||= [];
    config.plugins.push(webComponentAutoReload());
    config.envDir = '../..'; // use .env in the repo root
    return config;
  },
};
export default config;
