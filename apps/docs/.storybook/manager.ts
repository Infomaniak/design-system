import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { fontBase } from '../src/lib/font-stack.ts';

addons.setConfig({
  theme: create({ base: 'light', fontBase }),
});
