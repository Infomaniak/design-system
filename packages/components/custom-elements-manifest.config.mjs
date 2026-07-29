import { getTsProgram, typeParserPlugin } from '@wc-toolkit/type-parser';

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
  ],
  overrideModuleCreation({ ts, globs }) {
    const program = getTsProgram(ts, globs, 'tsconfig.json');
    return program
      .getSourceFiles()
      .filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  },
};
