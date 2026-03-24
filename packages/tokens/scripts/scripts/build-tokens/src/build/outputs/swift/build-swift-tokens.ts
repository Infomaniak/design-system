import Color from 'colorjs.io';
import { join } from 'node:path';
import { writeJsonFileSafe } from '../../../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { iteratorJoin } from '../../../../../../../../../scripts/helpers/misc/iterator/iterator-join.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { isCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../../../shared/dtcg/design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { ValueOrCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { SegmentsReference } from '../../../../../../shared/dtcg/design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type {
  DesignTokenContexts,
  DesignTokenModifiers,
} from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { SwiftEnumDeclaration } from '../../../../../../shared/dtcg/resolver/to/swift/swift-enum-declaration/swift-enum-declaration.ts';
import { swiftEnumDeclarationsToString } from '../../../../../../shared/dtcg/resolver/to/swift/swift-enum-declaration/to/swift-enum-declarations-to-string.ts';
import { designTokensCollectionTokenToSwiftEnumDeclaration } from '../../../../../../shared/dtcg/resolver/to/swift/token/design-tokens-collection-token-to-swift-enum-declaration.ts';
import { designTokenNameSegmentsReferenceToSwiftName } from '../../../../../../shared/dtcg/resolver/to/swift/token/name/design-token-name-segments-reference-to-swift-name.ts';
import { designTokenNameSegmentsReferenceToSwiftStructName } from '../../../../../../shared/dtcg/resolver/to/swift/token/name/design-token-name-segments-reference-to-swift-struct-name.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericDesignTokensCollectionTokenWithType,
} from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../shared/dtcg/resolver/token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokensCollectionTokenValueToColorInstance } from '../../../../../../shared/dtcg/resolver/token/types/base/color/value/to/color-design-tokens-collection-token-value-to-color-instance.ts';
import { isFontFamilyDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/font-family/is-font-family-design-tokens-collection-token.ts';
import { isNumberDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/number/is-number-design-tokens-collection-token.ts';
import { T1_DIRECTORY_NAME, T2_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header.ts';

import { XCASSETS_INFO } from './constants/xcassets-info.ts';

export interface BuildSwiftTokensOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly modifiers: DesignTokenModifiers;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export async function buildSwiftTokens({
  baseCollection,
  modifiers,
  outputDirectory,
  logger,
}: BuildSwiftTokensOptions) {
  return logger.asyncTask('swift', async (): Promise<void> => {
    outputDirectory = removeTrailingSlash(outputDirectory);
    const iosSwitftUiOutputDirectory: string = `${outputDirectory}/ios/swift-ui`;

    const t1ColorTokenNameToColorsetName = new Map<string, string>();

    const declarations: SwiftEnumDeclaration[] = [];

    const theme: DesignTokenContexts = modifiers.get('theme')!;
    const lightThemeCollection: DesignTokensCollection = theme.get('light')!;
    const darkThemeCollection: DesignTokensCollection = theme.get('dark')!;

    await logger.asyncTask('t1-tokens', async (logger: Logger): Promise<void> => {
      // t1 color tokens
      await logger.asyncTask('color-tokens', async (): Promise<void> => {
        for await (const token of baseCollection
          .tokens()
          .filter((token: GenericDesignTokensCollectionToken): boolean => {
            const resolvedToken: GenericDesignTokensCollectionTokenWithType = {
              ...token,
              type: baseCollection.resolve(token).type,
            };

            return (
              isColorDesignTokensCollectionToken(resolvedToken) &&
              token.files.some((path: string): boolean => path.includes(T1_DIRECTORY_NAME))
            );
          })) {
          if (isCurlyReference(token.value)) {
            throw new Error(`Token ${token.name} is a reference, but it should be a value`);
          }

          const color: Color = colorDesignTokensCollectionTokenValueToColorInstance(token.value);
          const sRGBColor: Color = color.to('sRGB');

          let category: string;
          let colorsetName: string;

          if (token.name[0] === 'color') {
            category = token.name[1];
            colorsetName = token.name.slice(1).join('');
          } else {
            category = token.name[0];
            colorsetName = token.name.join('');
          }

          t1ColorTokenNameToColorsetName.set(JSON.stringify(token.name), colorsetName);

          await writeJsonFileSafe(
            join(
              iosSwitftUiOutputDirectory,
              `Colors.xcassets/${category}/${colorsetName}.colorset/Contents.json`,
            ),
            {
              colors: [
                {
                  color: {
                    'color-space': color.space.name,
                    components: {
                      red: sRGBColor.coords[0],
                      green: sRGBColor.coords[1],
                      blue: sRGBColor.coords[2],
                      alpha: sRGBColor.alpha,
                    },
                  },
                  idiom: 'universal',
                },
              ],
              info: XCASSETS_INFO,
            },
          );
        }
      });
    });

    await logger.asyncTask('t2-tokens', async (logger: Logger): Promise<void> => {
      // t2 color tokens
      await logger.asyncTask('color-tokens', async (): Promise<void> => {
        for await (const token of baseCollection
          .tokens()
          .filter((token: GenericDesignTokensCollectionToken): boolean => {
            const resolvedToken: GenericDesignTokensCollectionTokenWithType = {
              ...token,
              type: baseCollection.resolve(token).type,
            };

            return (
              isColorDesignTokensCollectionToken(resolvedToken) &&
              !token.files.some((path: string): boolean => path.includes(T1_DIRECTORY_NAME))
            );
          })) {
          const lightThemeValue: ValueOrCurlyReference<ColorDesignTokensCollectionTokenValue> =
            lightThemeCollection.has(token.name)
              ? lightThemeCollection.get(token.name).value
              : token.value;

          const darkThemeValue: ValueOrCurlyReference<ColorDesignTokensCollectionTokenValue> =
            darkThemeCollection.has(token.name)
              ? darkThemeCollection.get(token.name).value
              : token.value;

          if (!isCurlyReference(lightThemeValue)) {
            throw new Error(
              `Token ${segmentsReferenceToCurlyReference(token.name)} with theme=light is not a curly reference`,
            );
          }

          if (!isCurlyReference(darkThemeValue)) {
            throw new Error(
              `Token ${segmentsReferenceToCurlyReference(token.name)} with theme=dark is not a curly reference`,
            );
          }

          const lightReference: SegmentsReference =
            curlyReferenceToSegmentsReference(lightThemeValue);

          const darkReference: SegmentsReference =
            curlyReferenceToSegmentsReference(darkThemeValue);

          const lightColorsetName: string | undefined = t1ColorTokenNameToColorsetName.get(
            JSON.stringify(lightReference),
          );

          const darkColorsetName: string | undefined = t1ColorTokenNameToColorsetName.get(
            JSON.stringify(darkReference),
          );

          if (lightColorsetName === undefined || darkColorsetName === undefined) {
            // not pointing on a t1
            continue;
          }

          declarations.push({
            name: designTokenNameSegmentsReferenceToSwiftName(token.name),
            type: 'Color',
            value: `Color(light: Color("${lightColorsetName}"), dark: Color("${darkColorsetName}"))`,
          });
        }
      });

      // t2 non-color tokens
      await logger.asyncTask('non-color-tokens', async (): Promise<void> => {
        for await (const token of baseCollection
          .tokens()
          .filter((token: GenericDesignTokensCollectionToken): boolean => {
            const resolvedToken: GenericDesignTokensCollectionTokenWithType = {
              ...token,
              type: baseCollection.resolve(token).type,
            };

            return (
              !isColorDesignTokensCollectionToken(resolvedToken) &&
              !isFontFamilyDesignTokensCollectionToken(resolvedToken) &&
              isNumberDesignTokensCollectionToken(resolvedToken) && // TODO
              token.files.some((path: string): boolean => path.includes(T2_DIRECTORY_NAME))
            );
          })) {
          declarations.push(
            designTokensCollectionTokenToSwiftEnumDeclaration({
              ...token,
              ...baseCollection.resolve(token),
            }),
          );
        }
      });

      await logger.asyncTask('generate-file', async (): Promise<void> => {
        const content: string = dedent`
        /*
          ${AUTO_GENERATED_FILE_HEADER}
        */
        
        import SwiftUI
        
        public enum EsdsTokens {
          ${swiftEnumDeclarationsToString(declarations)}
        }
      `;

        await writeTextFileSafe(join(iosSwitftUiOutputDirectory, 'EsdsTokens.swift'), content);
      });
    });

    await logger.asyncTask('main-theme', async (logger: Logger): Promise<void> => {
      const names: Set<string> = new Set(
        baseCollection
          .tokens()
          .filter((token: GenericDesignTokensCollectionToken): boolean => {
            return token.files.some((path: string): boolean => path.includes(T2_DIRECTORY_NAME));
          })
          .map((token: GenericDesignTokensCollectionToken): string => {
            return token.name[0];
          }),
      );

      const content: string = dedent`
        /*
          ${AUTO_GENERATED_FILE_HEADER}
        */
        
        import SwiftUI
        
        public struct EsdsTheme: Sendable {
          public let name: String
          
          ${iteratorJoin(
            names.values().map((name: string): string => {
              return `public let ${name}: ${designTokenNameSegmentsReferenceToSwiftStructName(['EsdsTheme', name])}`;
            }),
            '\n',
          )}
          
          public init(
            ${iteratorJoin(
              names.values().map((name: string): string => {
                const structName: string = designTokenNameSegmentsReferenceToSwiftStructName([
                  'EsdsTheme',
                  name,
                ]);
                return `${name}: ${structName} = ${structName}()`;
              }),
              '\n',
            )}
          ) {
           ${iteratorJoin(
             names.values().map((name: string): string => {
               return `self.${name} = ${name}`;
             }),
             '\n',
           )}
          }
        }
      `;

      await writeTextFileSafe(
        join(iosSwitftUiOutputDirectory, 'EsdsTheme/EsdsTheme.swift'),
        content,
      );
    });

    // registerHooks(StyleDictionary);
    //
    // const baseSources = DESIGN_TOKEN_TIERS.map(
    //     (tier) => `${sourceDirectory}/${tier}/**/*.tokens.json`,
    // );
    // const baseTokens = await collectTokens(baseSources);
    //
    // const __dirname = dirname(fileURLToPath(import.meta.url));
    // const ROOT_DIR = join(__dirname, '..');
    //
    // const ctx: BuildContext = {
    //     tokensDir: sourceDirectory,
    //     distDir: outputDirectory,
    //     rootDir: ROOT_DIR,
    //     baseSources,
    //     baseTokens,
    // };
    //
    // buildSwift(ctx);
  });
}
