import { jsxTypesPlugin } from '@wc-toolkit/jsx-types';
import { getTsProgram, typeParserPlugin } from '@wc-toolkit/type-parser';
import { customElementJetBrainsPlugin } from 'custom-element-jet-brains-integration';
import { customElementVsCodePlugin } from 'custom-element-vs-code-integration';
import { customAttributesIdePlugin } from './cem/custom-attributes-ide-contributions/custom-attributes-ide-contributions.plugin.ts';

export default {
  globs: ['src/**/*.component.ts', 'src/**/*.attr.ts'],
  outdir: '.',
  dev: false,
  litelement: true,
  packagejson: false,
  // https://custom-elements-manifest.open-wc.org/analyzer/plugins/intro/
  plugins: [
    typeParserPlugin({
      debug: false,
      typeSrc: 'types',
    }),
    // https://www.npmjs.com/package/@wc-toolkit/jsx-types
    // Generate JSX types -> generated-jsx-types.d.ts
    // potential alternative -> https://www.npmjs.com/package/custom-element-jsx-integration
    jsxTypesPlugin({
      outdir: './dist',
      fileName: 'generated-jsx-types.d.ts',
      stronglyTypedEvents: true,
      globalTypePath: '@infomaniak-design-system/components',
    }),
    // https://www.npmjs.com/package/custom-element-jet-brains-integration
    // Generate JetBrains IDEs support -> web-types.json
    customElementJetBrainsPlugin({
      outdir: './dist',
    }),
    // https://www.npmjs.com/package/custom-element-vs-code-integration
    // Generate VSCode IDEs support -> custom-elements.json
    customElementVsCodePlugin({
      outdir: './dist',
    }),
    // Move the custom attributes (classes extending `CustomAttribute`) from the "elements"
    // contributions to the "attributes" / "globalAttributes" contributions of the generated
    // IDE files (web-types.json + vscode.html-custom-data.json), so IDEs autocomplete them on
    // native elements (e.g. `<a esds-button>`). Must stay AFTER the plugins generating those files.
    customAttributesIdePlugin({
      outdir: './dist',
    }),
  ],
  overrideModuleCreation({ ts, globs }) {
    const program = getTsProgram(ts, globs, 'tsconfig.json');
    return program
      .getSourceFiles()
      .filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  },
};
