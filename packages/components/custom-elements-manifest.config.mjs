import { getTsProgram, typeParserPlugin } from '@wc-toolkit/type-parser';
import { jsxTypesPlugin } from '@wc-toolkit/jsx-types';

export default {
  globs: ['src/**/*.component.ts', 'src/**/*.attr.ts'],
  outdir: '.',
  dev: false,
  litelement: true,
  packagejson: false,
  plugins: [
    typeParserPlugin({
      debug: false,
      typeSrc: 'types',
    }),
    jsxTypesPlugin({
      outdir: './dist',
      fileName: 'generated-jsx-types.d.ts',
      stronglyTypedEvents: true,
      globalTypePath: '@infomaniak-design-system/components',
    }),
  ],
  overrideModuleCreation({ ts, globs }) {
    const program = getTsProgram(ts, globs, 'tsconfig.json');
    return program
      .getSourceFiles()
      .filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  },
};
