import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { toCamelCase } from '../../../../../../../scripts/helpers/misc/case/to-camel-case/to-camel-case.ts';
import { SWIFT_FILE_HEADER } from '../../../../../../tokens/scripts/scripts/build-tokens/src/build/outputs/swift/helpers/build-swift-file-header.ts';
import { indentSwiftLines } from '../../../../../../tokens/scripts/scripts/build-tokens/src/build/outputs/swift/helpers/build-swift-file.ts';
import type { SymbolIcon } from './build-symbols-xcassets.ts';
import { SYMBOLS_SWIFT_FILE_NAME } from './sf-symbols-config.ts';

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
      const identifier: string = toSwiftIdentifier(name);
      if (identifiers.has(identifier)) {
        throw new Error(
          `Icon name ${JSON.stringify(name)} generates duplicated Swift identifier ${JSON.stringify(identifier)}.`,
        );
      }

      identifiers.add(identifier);
      declarations.push(`public static let ${identifier} = Symbol(name: ${JSON.stringify(name)})`);
    }

    const content: string = `${SWIFT_FILE_HEADER}

import SwiftUI

#if canImport(UIKit)
import UIKit
#endif

public enum ESDSSymbols: Sendable {
${indentSwiftLines(buildSymbolType())}

${indentSwiftLines(declarations.join('\n'))}
}`;

    await writeTextFileSafe(join(outputDirectory, SYMBOLS_SWIFT_FILE_NAME), content);
    logger.info(`Built ${JSON.stringify(SYMBOLS_SWIFT_FILE_NAME)}.`);
  });
}

const SWIFT_RESERVED_IDENTIFIERS: ReadonlySet<string> = new Set([
  'Any',
  'Protocol',
  'Self',
  'Type',
  'associatedtype',
  'as',
  'break',
  'case',
  'catch',
  'class',
  'continue',
  'default',
  'defer',
  'deinit',
  'do',
  'else',
  'enum',
  'extension',
  'fallthrough',
  'false',
  'fileprivate',
  'for',
  'func',
  'guard',
  'if',
  'import',
  'in',
  'init',
  'inout',
  'internal',
  'is',
  'let',
  'nil',
  'open',
  'operator',
  'private',
  'protocol',
  'public',
  'repeat',
  'rethrows',
  'return',
  'self',
  'static',
  'struct',
  'subscript',
  'super',
  'switch',
  'throw',
  'throws',
  'true',
  'try',
  'typealias',
  'var',
  'where',
  'while',
]);

function toSwiftIdentifier(iconName: string): string {
  const identifier: string = toCamelCase(iconName);
  return SWIFT_RESERVED_IDENTIFIERS.has(identifier) ? `\`${identifier}\`` : identifier;
}

function buildSymbolType(): string {
  return `public struct Symbol: Sendable {
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
}`;
}
