import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { type SwiftEnumDeclaration } from '../../../../../../shared/dtcg/resolver/to/swift/swift-enum-declaration/swift-enum-declaration.ts';
import { swiftEnumDeclarationsToString } from '../../../../../../shared/dtcg/resolver/to/swift/swift-enum-declaration/to/swift-enum-declarations-to-string.ts';
import { segmentsToSwiftIdentifier } from '../../../../../../shared/dtcg/resolver/to/swift/token/name/design-token-name-segments-reference-to-swift-name.ts';
import { tokenToSwiftEnum } from '../../../../../../shared/dtcg/resolver/to/swift/token/token-to-swift-enum.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericDesignTokensCollectionTokenWithType,
} from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';
import { T1_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header.ts';
import { buildSwiftPackage } from './built-steps/build-swift-package.ts';
import {
  buildSwiftT2,
  buildSwiftThemes,
} from './built-steps/build-swift-theme-structs/build-swift-theme-structs.ts';
import { buildXcAssets } from './built-steps/build-xcassets.ts';
import { buildSwiftFile, indentSwiftLines } from './helpers/build-swift-file.ts';
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

const SWIFT_COLOR_LIGHT_DARK_FILE = `/*
    ${AUTO_GENERATED_FILE_HEADER}
*/

import SwiftUI

#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

public extension SwiftUI.Color {
    init(light: SwiftUI.Color, dark: SwiftUI.Color) {
        #if canImport(UIKit)
        self.init(uiColor: UIColor { traitCollection in
            traitCollection.userInterfaceStyle == .dark ? UIColor(dark) : UIColor(light)
        })
        #elseif canImport(AppKit)
        self.init(nsColor: NSColor(name: nil) { appearance in
            appearance.bestMatch(from: [.aqua, .darkAqua]) == .darkAqua ? NSColor(dark) : NSColor(light)
        })
        #endif
    }
}
`;

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

    const declarations: Map<string, SwiftEnumDeclaration[]> = new Map();

    const t1TokenColors: GenericDesignTokensCollectionToken[] = [];
    const t1TokenOthers: GenericDesignTokensCollectionToken[] = [];

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

      if (!isT1Token) {
        continue;
      }

      if (isColorDesignTokensCollectionToken(resolvedToken)) {
        t1TokenColors.push(token);
      } else {
        t1TokenOthers.push(token);
      }
    }

    await logger.asyncTask('t1-tokens', async (logger: Logger): Promise<void> => {
      await logger.asyncTask('color-tokens', async (): Promise<void> => {
        for (const token of t1TokenColors) {
          const { colorsetName } = await buildXcAssets({
            token,
            outputDirectory: primitivesTargetDirectory,
          });

          const groupName = getSwiftTokenGroupName(token);
          if (!declarations.has(groupName)) {
            declarations.set(groupName, []);
          }
          declarations.get(groupName)!.push({
            $type: 'declaration',
            name: segmentsToSwiftIdentifier(token.name, 1),
            valueType: 'SwiftUI.Color',
            value: `SwiftUI.Color("${colorsetName}", bundle: .module)`,
          });
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
            imports: groupName === 'Color' ? ['SwiftUI'] : ['Foundation'],
            type: 'public extension',
            name: SWIFT_PRIMITIVE_TOKENS,
            protocols: [],
            content: `enum ${groupName}: Sendable {\n${indentSwiftLines(swiftEnumDeclarationsToString(declaration))}\n}`,
          });

          await writeTextFileSafe(
            join(primitivesTargetDirectory, `${SWIFT_PRIMITIVE_TOKENS}+${groupName}.swift`),
            content,
          );
        }

        await writeTextFileSafe(
          join(primitivesTargetDirectory, 'Color+LightDark.swift'),
          SWIFT_COLOR_LIGHT_DARK_FILE,
        );
      });
    });

    const productTargetNames = await logger.asyncTask(
      't2-tokens',
      async (): Promise<readonly string[]> => {
        const tree = await logger.asyncTask('generate-tokens', () => {
          return buildSwiftT2({
            baseCollection,
            outputDirectory: join(iosSwiftOutputDirectory, SWIFT_SOURCES_DIR),
          });
        });

        return logger.asyncTask('generate-themes', () => {
          return buildSwiftThemes({
            modifiers,
            tree,
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
