import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { dedent } from '../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { SWIFT_FILE_HEADER } from '../../../../../../tokens/scripts/scripts/build-tokens/src/build/outputs/swift/helpers/build-swift-file-header.ts';
import { toSwiftVariableName } from '../../../../../../tokens/scripts/shared/dtcg/resolver/to/swift/token/name/to-swift-variable-name.ts';
import type { SymbolIcon } from './build-symbols-xcassets.ts';
import {
  SYMBOLS_ENUM_NAME,
  SYMBOLS_SWIFT_FILE_NAME,
  SYMBOL_TYPE_NAME,
} from './sf-symbols-config.ts';

export interface BuildSymbolsSwiftFileOptions {
  readonly outputDirectory: string;
  readonly icons: readonly SymbolIcon[];
  readonly logger: Logger;
}

export async function buildSymbolsSwiftFile({
  outputDirectory,
  icons,
  logger,
}: BuildSymbolsSwiftFileOptions): Promise<void> {
  await logger.asyncTask('build-symbols-swift-file', async (logger: Logger): Promise<void> => {
    const declarations: string[] = [];
    const identifiers: Set<string> = new Set();

    for (const { name } of icons) {
      const identifier: string = toSwiftVariableName([name]);
      if (identifiers.has(identifier)) {
        throw new Error(
          `Icon name ${JSON.stringify(name)} generates duplicated Swift identifier ${JSON.stringify(identifier)}.`,
        );
      }

      identifiers.add(identifier);
      declarations.push(
        `public static let ${identifier} = ${SYMBOL_TYPE_NAME}(name: ${JSON.stringify(name)})`,
      );
    }

    const content: string = dedent`
      ${SWIFT_FILE_HEADER}

      import SwiftUI

      #if canImport(UIKit)
      import UIKit
      #endif

      public enum ${SYMBOLS_ENUM_NAME}: Sendable {
          ${buildSymbolType()}

          ${declarations.join('\n')}
      }
    `;

    await writeTextFileSafe(join(outputDirectory, SYMBOLS_SWIFT_FILE_NAME), content);
    logger.info(`Built ${JSON.stringify(SYMBOLS_SWIFT_FILE_NAME)}.`);
  });
}

function buildSymbolType(): string {
  return dedent`
    public struct ${SYMBOL_TYPE_NAME}: Sendable {
        private let name: String

        public var image: SwiftUI.Image {
            SwiftUI.Image(name, bundle: .module)
        }

        #if canImport(UIKit)
        public var uiImage: UIKit.UIImage {
            guard let image = UIKit.UIImage(named: name, in: .module, compatibleWith: nil) else {
                preconditionFailure("Missing symbol asset \\"\\(name)\\".")
            }
            return image
        }
        #endif

        fileprivate init(name: String) {
            self.name = name
        }
    }
  `;
}
