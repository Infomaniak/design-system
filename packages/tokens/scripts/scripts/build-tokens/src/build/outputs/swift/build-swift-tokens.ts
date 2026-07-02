import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
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
import { T1_DIRECTORY_NAME, T2_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';
import { buildSwiftEnumColor } from './built-steps/build-swift-enum-color.ts';
import { buildSwiftThemeStructs } from './built-steps/build-swift-theme-structs/build-swift-theme-structs.ts';
import { buildXcAssets } from './built-steps/build-xcassets.ts';
import { buildSwiftFile } from './helpers/build-swift-file.ts';
import {
  SWIFT_PRIMITIVE_TOKENS,
  SWIFT_RESOURCES_DIR,
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
    const iosSwiftUiOutputDirectory: string = `${cleanOutputDirectory}/ios/swift-ui`;
    const iosSwiftUiSourceOutputDirectory: string = join(
      iosSwiftUiOutputDirectory,
      SWIFT_SOURCES_DIR,
    );
    const iosSwiftUiResourcesOutputDirectory: string = join(
      iosSwiftUiOutputDirectory,
      SWIFT_RESOURCES_DIR,
    );

    const t1ColorTokenNameToColorsetName = new Map<string, string>();
    const declarations: Map<string, SwiftEnumDeclaration[]> = new Map();

    const theme: DesignTokenContexts = modifiers.get('theme')!;
    const lightThemeCollection: DesignTokensCollection = theme.get('light')!;
    const darkThemeCollection: DesignTokensCollection = theme.get('dark')!;

    const t1Colors: GenericDesignTokensCollectionToken[] = [];
    const t2Colors: GenericDesignTokensCollectionToken[] = [];
    const t2NonColors: GenericDesignTokensCollectionToken[] = [];

    for (const token of baseCollection.tokens()) {
      const resolvedToken: GenericDesignTokensCollectionTokenWithType = {
        ...token,
        type: baseCollection.resolve(token).type,
      };
      if (isExcludedSwiftToken(resolvedToken)) {
        continue;
      }

      const inT1: boolean = token.files.some((path: string): boolean =>
        path.includes(T1_DIRECTORY_NAME),
      );

      if (isColorDesignTokensCollectionToken(resolvedToken)) {
        if (inT1) {
          t1Colors.push(token);
        } else {
          t2Colors.push(token);
        }
      } else if (token.files.some((path: string): boolean => path.includes(T2_DIRECTORY_NAME))) {
        t2NonColors.push(token);
      }
    }

    await logger.asyncTask('t1-tokens', async (logger: Logger): Promise<void> => {
      await logger.asyncTask('color-tokens', async (): Promise<void> => {
        for (const token of t1Colors) {
          const { tokenName, colorsetName } = await buildXcAssets({
            token,
            outputDirectory: iosSwiftUiResourcesOutputDirectory,
          });
          t1ColorTokenNameToColorsetName.set(JSON.stringify(tokenName), colorsetName);
        }
      });
    });

    await logger.asyncTask('t2-tokens', async (logger: Logger): Promise<void> => {
      await logger.asyncTask('color-tokens', async (): Promise<void> => {
        for (const token of t2Colors) {
          const enumColor: SwiftEnumDeclaration | null = await buildSwiftEnumColor({
            token,
            lightThemeCollection,
            darkThemeCollection,
            t1ColorTokenNameToColorsetName,
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

      await logger.asyncTask('non-color-tokens', async (): Promise<void> => {
        for (const token of t2NonColors) {
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

      await logger.asyncTask('generate-file', async (): Promise<void> => {
        const rawTokensOutputDirectory: string = join(
          iosSwiftUiSourceOutputDirectory,
          SWIFT_PRIMITIVE_TOKENS,
        );

        // Build empty enum
        const content: string = buildSwiftFile({
          imports: ['SwiftUI'],
          type: 'public enum',
          name: SWIFT_PRIMITIVE_TOKENS,
          protocols: ['Sendable'],
          content: '',
        });

        await writeTextFileSafe(
          join(rawTokensOutputDirectory, `${SWIFT_PRIMITIVE_TOKENS}.swift`),
          content,
        );

        for (const [groupName, declaration] of declarations) {
          const content: string = buildSwiftFile({
            imports: ['SwiftUI'],
            type: 'extension',
            name: SWIFT_PRIMITIVE_TOKENS,
            protocols: [],
            content: dedent`
              enum ${groupName} {
                ${swiftEnumDeclarationsToString(declaration)}
              }
            `,
          });

          await writeTextFileSafe(
            join(rawTokensOutputDirectory, `${SWIFT_PRIMITIVE_TOKENS}+${groupName}.swift`),
            content,
          );
        }
      });
    });

    await logger.asyncTask('main-theme', async (): Promise<void> => {
      await buildSwiftThemeStructs({
        baseCollection,
        modifiers,
        outputDirectory: iosSwiftUiSourceOutputDirectory,
        rawTokensPrefix: SWIFT_PRIMITIVE_TOKENS,
      });
    });
  });
}
