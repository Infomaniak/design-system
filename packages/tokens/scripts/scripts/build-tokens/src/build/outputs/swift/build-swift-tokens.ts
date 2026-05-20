import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type {
  DesignTokenContexts,
  DesignTokenModifiers,
} from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { type SwiftEnumDeclaration } from '../../../../../../shared/dtcg/resolver/to/swift/swift-enum-declaration/swift-enum-declaration.ts';
import { swiftEnumDeclarationsToString } from '../../../../../../shared/dtcg/resolver/to/swift/swift-enum-declaration/to/swift-enum-declarations-to-string.ts';
import { tokenToSwiftEnum } from '../../../../../../shared/dtcg/resolver/to/swift/token/token-to-swift-enum.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericDesignTokensCollectionTokenWithType,
} from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';
import { isFontFamilyDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/font-family/is-font-family-design-tokens-collection-token.ts';
import { T1_DIRECTORY_NAME, T2_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';
import { buildSwiftEnumColor } from './built-steps/build-swift-enum-color.ts';
import { buildSwiftThemeStructs } from './built-steps/build-swift-theme-structs/build-swift-theme-structs.ts';
import { buildXcAssets } from './built-steps/build-xcassets.ts';
import { buildSwiftFile } from './helpers/build-swift-file.ts';
import { getTokenGroupName } from './swift-tokens-format.ts';

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

    const rawTokensPrefix = 'RawToken';
    const iosSwitftUiOutputDirectory: string = `${outputDirectory}/ios/swift-ui`;
    const t1ColorTokenNameToColorsetName = new Map<string, string>();
    const declarations: Map<string, SwiftEnumDeclaration[]> = new Map();

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
          await buildXcAssets({
            token,
            t1ColorTokenNameToColorsetName,
            outputDirectory: iosSwitftUiOutputDirectory,
          });
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
          const enumColor: SwiftEnumDeclaration | null = await buildSwiftEnumColor({
            token,
            lightThemeCollection,
            darkThemeCollection,
            t1ColorTokenNameToColorsetName,
          });

          if (enumColor === null) {
            continue;
          }

          const groupName = getTokenGroupName(token);

          if (!declarations.has(groupName)) {
            declarations.set(groupName, []);
          }
          declarations.get(groupName)!.push(enumColor);
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
              token.files.some((path: string): boolean => path.includes(T2_DIRECTORY_NAME))
            );
          })) {
          const groupName = getTokenGroupName(token);

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

      await logger.asyncTask('generate-file', async (): Promise<void> => {
        // Build empty enum
        const content: string = buildSwiftFile({
          imports: ['SwiftUI'],
          type: 'public enum',
          name: rawTokensPrefix,
          protocols: ['Sendable'],
          content: '',
        });

        await writeTextFileSafe(join(iosSwitftUiOutputDirectory, 'EsdsTokens.swift'), content);

        for (const [groupName, declaration] of declarations) {
          const content: string = buildSwiftFile({
            imports: ['SwiftUI'],
            type: 'extension',
            name: rawTokensPrefix,
            protocols: [],
            content: `public enum ${groupName} {
              ${swiftEnumDeclarationsToString(declaration)}
            }`,
          });

          await writeTextFileSafe(
            join(iosSwitftUiOutputDirectory, `${rawTokensPrefix}+${groupName}.swift`),
            content,
          );
        }
      });
    });

    await logger.asyncTask('main-theme', async (): Promise<void> => {
      await buildSwiftThemeStructs({
        baseCollection,
        modifiers,
        outputDirectory: iosSwitftUiOutputDirectory,
        rawTokensPrefix,
      });
    });

    // DEBUG: Print all the root struct
    // console.log(JSON.stringify(root, null, 2));
  });
}