import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';

export interface BuildTokensOptions {
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
}

export async function buildTokensAndroid({
  sourceDirectory,
  outputDirectory,
}: BuildTokensOptions): Promise<void> {
  sourceDirectory = removeTrailingSlash(sourceDirectory);
  console.log('Building tokens from sourceDirectory: ', sourceDirectory);
  await '';

  // registerDtcgCssStyleDictionaryTransform();
  // registerStyleDictionaryThemeFilter();
  //
  // await rm(outputDirectory, { force: true, recursive: true });
  //
  // for await (const entry of glob(`${sourceDirectory}/themes/**/*.tokens.json`)) {
  //   const relativePath: string = relative(`${sourceDirectory}/themes`, dirname(entry));
  //
  //   const name: string = basename(entry, '.tokens.json');
  //
  //   const isPatch: boolean = name.endsWith('.patch');
  //
  //   const attributeName: string = isPatch ? name.slice(0, -'.patch'.length) : name;
  //
  //   const fileHeader = (): string[] => [
  //     'Do not edit directly, this file was auto-generated.',
  //     ...(isPatch ? ['This is a "patch" file: it requires "base" themes to works properly.'] : []),
  //   ];
  //
  //   const sd = new StyleDictionary({
  //     log: {
  //       verbosity: 'verbose',
  //     },
  //     // include: [`${sourceBaseTokensDirectory}/**/*.tokens.json`],
  //     include: [
  //       `${sourceDirectory}/base/t1-primitive/**/*.tokens.json`,
  //       `${sourceDirectory}/base/t2-semantic/**/*.tokens.json`,
  //       `${sourceDirectory}/base/t3-component/**/*.tokens.json`,
  //     ],
  //     usesDtcg: true,
  //     source: [entry],
  //     platforms: {
  //       css: {
  //         buildPath: join(outputDirectory, 'css', relativePath),
  //         prefix: 'ikds-',
  //         transforms: [...DTCG_CSS_TRANSFORMS],
  //         files: [
  //           {
  //             destination: `${name}.css`,
  //             format: formats.cssVariables,
  //             filter: isPatch ? 'theme-filter' : undefined,
  //             options: {
  //               fileHeader,
  //               outputReferences: true,
  //               selector: ':root, :host',
  //             },
  //           },
  //           {
  //             destination: `${name}.attr.css`,
  //             format: formats.cssVariables,
  //             filter: isPatch ? 'theme-filter' : undefined,
  //             options: {
  //               fileHeader,
  //               outputReferences: true,
  //               selector: `[data-theme="${attributeName}"],\n[data-variant="${attributeName}"]`,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   });
  //
  //   await sd.buildAllPlatforms();
  // }
}
