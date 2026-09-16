import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { buildSymbolsSwiftFile } from './build-symbols-swift-file.ts';
import type { SymbolIcon } from './build-symbols-xcassets.ts';
import { SYMBOLS_SWIFT_FILE_NAME } from './sf-symbols-config.ts';

const logger = Logger.never();

function createIcon(name: string): SymbolIcon {
  return { name, outlinedPaths: [{ d: 'M 0 0', windingRule: 'NONZERO' }] };
}

describe('buildSymbolsSwiftFile', () => {
  let outputDirectory: string;

  beforeEach(async () => {
    outputDirectory = await mkdtemp(join(tmpdir(), 'sf-symbols-swift-'));
  });

  afterEach(async () => {
    await rm(outputDirectory, { force: true, recursive: true });
  });

  test('generates public SwiftUI and UIKit image accessors', async () => {
    await buildSymbolsSwiftFile({
      outputDirectory,
      icons: [createIcon('a-square'), createIcon('switch')],
      logger,
    });

    const content: string = await readFile(join(outputDirectory, SYMBOLS_SWIFT_FILE_NAME), 'utf8');

    expect(content).toContain('import SwiftUI');
    expect(content).toContain('#if canImport(UIKit)\nimport UIKit\n#endif');
    expect(content).toContain('public enum ESDSSymbols: Sendable {');
    expect(content).toContain('public struct Symbol: Sendable {');
    expect(content).toContain(
      'public var image: SwiftUI.Image {\n            SwiftUI.Image(name, bundle: .module)\n        }',
    );
    expect(content).toContain(
      'public var uiImage: UIKit.UIImage {\n            guard let image = UIKit.UIImage(named: name, in: .module, compatibleWith: nil)',
    );
    expect(content).toContain('public static let aSquare = Symbol(name: "a-square")');
    expect(content).toContain('public static let `switch` = Symbol(name: "switch")');
  });

  test('rejects icon names that generate the same Swift identifier', async () => {
    await expect(
      buildSymbolsSwiftFile({
        outputDirectory,
        icons: [createIcon('a-b'), createIcon('a--b')],
        logger,
      }),
    ).rejects.toThrow('Icon name "a--b" generates duplicated Swift identifier "aB".');
  });
});
