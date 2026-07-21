import { reactWrapperPlugin } from '@wc-toolkit/react-wrappers';
import { getTsProgram, typeParserPlugin } from '@wc-toolkit/type-parser';

export default {
  globs: ['src/**/*.component.ts'],
  outdir: '.',
  dev: false,
  litelement: true,
  packagejson: false,
  plugins: [
    typeParserPlugin({
      debug: false,
      typeSrc: 'types',
    }),
    reactWrapperPlugin({
      outdir: './react',
      stronglyTypedEvents: true,
      componentNameFormatter: (tagName, componentName) => {
        return componentName.replace(/Component$/, '');
      },
      modulePath: () => '@infomaniak-design-system/components',
    }),
  ],
  overrideModuleCreation({ ts, globs }) {
    const program = getTsProgram(ts, globs, 'tsconfig.json');
    return program
      .getSourceFiles()
      .filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  },
};
