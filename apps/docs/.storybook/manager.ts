import { addons } from 'storybook/manager-api';
import { create, getPreferredColorScheme } from 'storybook/theming';
import { FONT_BASE } from '../src/lib/font-stack.ts';

addons.setConfig({
  // `base` follows the OS color scheme (create() would apply the same
  // default, but the public ThemeVarsPartial type requires an explicit base).
  theme: create({ base: getPreferredColorScheme(), fontBase: FONT_BASE }),
});
