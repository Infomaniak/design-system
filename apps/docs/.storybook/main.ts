import type { StorybookConfig } from '@storybook/web-components-vite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { type InlineConfig, mergeConfig } from 'vite';
import { viteTc39DecoratorsPlugin } from '../../../plugins/vite-tc39-decorators-plugin.ts';
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
    '../../../packages/components/src/**/*.mdx',
    '../../../packages/components/src/**/*.stories.ts',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding'),
  ],
  framework: getAbsolutePath('@storybook/web-components-vite'),
  staticDirs: ['../public'],
  viteFinal: (config: InlineConfig): InlineConfig => {
    return mergeConfig(config, {
      envDir: '../..', // use .env in the repo root,
      plugins: [webComponentAutoReload(), viteTc39DecoratorsPlugin()],
    });
  },
};
export default config;
