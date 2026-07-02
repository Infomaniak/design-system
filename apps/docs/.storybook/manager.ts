import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Sets the title at the very top of the sidebar, above the search box.
const theme = create({
  base: 'dark',
  brandTitle: 'Edelweiss Design System',
  brandImage: '/edelweiss.png',
  colorPrimary: '#0098ff',
  colorSecondary: '#0066cc',
});

addons.setConfig({
  theme,
});
