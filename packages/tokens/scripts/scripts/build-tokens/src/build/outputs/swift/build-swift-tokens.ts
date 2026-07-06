import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { type SwiftEnumDeclaration } from '../../../../../../shared/dtcg/resolver/to/swift/swift-enum-declaration/swift-enum-declaration.ts';
import { swiftEnumDeclarationsToString } from '../../../../../../shared/dtcg/resolver/to/swift/swift-enum-declaration/to/swift-enum-declarations-to-string.ts';
import { tokenToSwiftEnum } from '../../../../../../shared/dtcg/resolver/to/swift/token/token-to-swift-enum.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericDesignTokensCollectionTokenWithType,
} from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';
import { T1_DIRECTORY_NAME, T2_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';
import { buildSwiftPackage } from './built-steps/build-swift-package.ts';
import {
  buildSwiftT2,
  buildSwiftThemes,
} from './built-steps/build-swift-theme-structs/build-swift-theme-structs.ts';
import { buildXcAssets } from './built-steps/build-xcassets.ts';
import { buildSwiftFile } from './helpers/build-swift-file.ts';
import {
  SWIFT_PRIMITIVE_TARGET_DIR,
  SWIFT_PRIMITIVE_TOKENS,
  SWIFT_SOURCES_DIR,
  isExcludedSwiftToken,
} from './swift-constants.ts';
import { getSwiftTokenGroupName } from './swift-tokens-format.ts';

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
  return logger.asyncTask('swift', async (logger: Logger): Promise<void> => {
    const cleanOutputDirectory = removeTrailingSlash(outputDirectory);
    const iosSwiftOutputDirectory: string = `${cleanOutputDirectory}/ios/swift`;
    const primitivesTargetDirectory: string = join(
      iosSwiftOutputDirectory,
      SWIFT_PRIMITIVE_TARGET_DIR,
    );

    const t1ColorTokenNameToColorSetName = new Map<string, string>();
    const declarations: Map<string, SwiftEnumDeclaration[]> = new Map();

    const t1TokenColors: GenericDesignTokensCollectionToken[] = [];
    const t1TokenOthers: GenericDesignTokensCollectionToken[] = [];

    const t2TokenColors: GenericDesignTokensCollectionToken[] = [];
    const t2TokenOthers: GenericDesignTokensCollectionToken[] = [];

    for (const token of baseCollection.tokens()) {
      const resolvedToken: GenericDesignTokensCollectionTokenWithType = {
        ...token,
        type: baseCollection.resolve(token).type,
      };
      if (isExcludedSwiftToken(resolvedToken)) {
        continue;
      }

      const isT1Token: boolean = token.files.some((path: string): boolean =>
        path.includes(T1_DIRECTORY_NAME),
      );
      const isT2Token: boolean = token.files.some((path: string): boolean =>
        path.includes(T2_DIRECTORY_NAME),
      );

      if (isColorDesignTokensCollectionToken(resolvedToken)) {
        if (isT1Token) {
          t1TokenColors.push(token);
        } else {
          t2TokenColors.push(token);
        }
      } else {
        if (isT1Token) {
          t1TokenOthers.push(token);
        } else if (isT2Token) {
          t2TokenOthers.push(token);
        }
      }
    }

    await logger.asyncTask('t1-tokens', async (logger: Logger): Promise<void> => {
      await logger.asyncTask('color-tokens', async (): Promise<void> => {
        for (const token of t1TokenColors) {
          const { tokenName, colorsetName } = await buildXcAssets({
            token,
            outputDirectory: primitivesTargetDirectory,
          });
          t1ColorTokenNameToColorSetName.set(JSON.stringify(tokenName), colorsetName);
        }
      });

      await logger.asyncTask('other-tokens', async (): Promise<void> => {
        for (const token of t1TokenOthers) {
          const groupName = getSwiftTokenGroupName(token);
          if (!declarations.has(groupName)) {
            declarations.set(groupName, []);
          }
          declarations.get(groupName)!.push(
            tokenToSwiftEnum({
              ...token,
              ...baseCollection.resolve(token),
            }),
          );
        }
      });

      await logger.asyncTask('generate-files', async (): Promise<void> => {
        // Build empty enum
        const content: string = buildSwiftFile({
          imports: ['Foundation'],
          type: 'public enum',
          name: SWIFT_PRIMITIVE_TOKENS,
          protocols: ['Sendable'],
          content: '',
        });

        await writeTextFileSafe(
          join(primitivesTargetDirectory, `${SWIFT_PRIMITIVE_TOKENS}.swift`),
          content,
        );

        for (const [groupName, declaration] of declarations) {
          const content: string = buildSwiftFile({
            imports: ['Foundation'],
            type: 'public extension',
            name: SWIFT_PRIMITIVE_TOKENS,
            protocols: [],
            content: dedent`
              enum ${groupName}: Sendable {
                ${swiftEnumDeclarationsToString(declaration)}
              }
            `,
          });

          await writeTextFileSafe(
            join(primitivesTargetDirectory, `${SWIFT_PRIMITIVE_TOKENS}+${groupName}.swift`),
            content,
          );
        }
      });
    });

    // TODO: Reinstate once the struct-tree approach (buildSwiftT2/buildSwiftThemes below)
    // covers colorset resolution for T2 tokens. Reactivating this requires re-adding:
    //   import { buildSwiftEnumColor } from './built-steps/build-swift-enum-color.ts';
    //   const theme: DesignTokenContexts = modifiers.get('theme')!;
    //   const lightThemeCollection: DesignTokensCollection = theme.get('light')!;
    //   const darkThemeCollection: DesignTokensCollection = theme.get('dark')!;
    /*
    await logger.asyncTask('t2-tokens', async (logger: Logger): Promise<void> => {
      await logger.asyncTask('color-tokens', async (): Promise<void> => {
        for (const token of t2TokenColors) {
          const enumColor: SwiftEnumDeclaration | null = await buildSwiftEnumColor({
            token,
            lightThemeCollection,
            darkThemeCollection,
            t1ColorTokenNameToColorsetName: t1ColorTokenNameToColorSetName,
          });

          if (enumColor === null) {
            continue;
          }

          const groupName = getSwiftTokenGroupName(token);
          if (!declarations.has(groupName)) {
            declarations.set(groupName, []);
          }
          declarations.get(groupName)!.push(enumColor);
        }
      });

      await logger.asyncTask('other-tokens', async (): Promise<void> => {
        for (const token of t2TokenOthers) {
          const groupName = getSwiftTokenGroupName(token);
          if (!declarations.has(groupName)) {
            declarations.set(groupName, []);
          }
          declarations.get(groupName)!.push(
            tokenToSwiftEnum({
              ...token,
              ...baseCollection.resolve(token),
            }),
          );
        }
      });
    });
    */

    const productTargetNames = await logger.asyncTask(
      't2-tokens',
      async (): Promise<readonly string[]> => {
        const baseTokenTree = await logger.asyncTask('generate-tokens', () => {
          return buildSwiftT2({
            baseCollection,
            outputDirectory: join(iosSwiftOutputDirectory, SWIFT_SOURCES_DIR),
            rawTokensPrefix: SWIFT_PRIMITIVE_TOKENS,
          });
        });

        return logger.asyncTask('generate-themes', () => {
          return buildSwiftThemes({
            modifiers,
            baseValueMap: baseTokenTree.valueMap,
            outputDirectory: join(iosSwiftOutputDirectory, SWIFT_SOURCES_DIR),
            rawTokensPrefix: SWIFT_PRIMITIVE_TOKENS,
          });
        });
      },
    );

    await logger.asyncTask('package-manifest', (): Promise<void> => {
      return buildSwiftPackage({
        outputDirectory: iosSwiftOutputDirectory,
        productTargetNames,
      });
    });
  });
}
