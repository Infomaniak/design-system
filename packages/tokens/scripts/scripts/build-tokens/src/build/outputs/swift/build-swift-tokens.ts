import type Color from 'colorjs.io';
import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { colorDesignTokenValueToColorJs } from '../../../../../../shared/dtcg/design-token/token/types/base/types/color/value/to/colorjs/color-design-token-value-to-color-js.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericDesignTokensCollectionTokenWithType } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';

export interface BuildSwiftTokensOptions {
  readonly collection: DesignTokensCollection;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

interface XCAssetsInfo {
  readonly author: string;
  readonly version: number;
}

interface XCAssetsColorComponent {
  readonly alpha: string;
  readonly blue: string;
  readonly green: string;
  readonly red: string;
}

interface XCAssetsColor {
  readonly color: {
    readonly 'color-space': string;
    readonly components: XCAssetsColorComponent;
  };
  readonly idiom: 'universal';
}

interface XCAssetsColorSet {
  readonly colors: XCAssetsColor[];
  readonly info: XCAssetsInfo;
}

const defaultXCAssets: XCAssetsInfo = {
  author: 'esds',
  version: 1,
};

export async function buildSwiftTokens({
  collection,
  outputDirectory,
  logger,
}: BuildSwiftTokensOptions) {
  return logger.asyncTask('swift', async (): Promise<void> => {
    const filesToWrite: { path: string; content: string }[] = [];
    const rootContentsJson = {
      info: defaultXCAssets,
    };

    filesToWrite.push({
      path: `${outputDirectory}/ios/Colors.xcassets/Contents.json`,
      content: JSON.stringify(rootContentsJson, null, 2),
    });

    for (const token of collection.tokens()) {
      const resolvedToken: GenericDesignTokensCollectionTokenWithType = {
        ...token,
        type: collection.resolve(token).type,
      };

      if (isColorDesignTokensCollectionToken(token)) {
        const colorsetName = resolvedToken.name.slice(1).join('');
        const color: Color = colorDesignTokenValueToColorJs(resolvedToken.value, resolvedToken);
        const colorSetContents = createXCAssetsColorSet(color);

        filesToWrite.push({
          path: `${outputDirectory}/ios/Colors.xcassets/${resolvedToken.name[1]}/${colorsetName}.colorset/Contents.json`,
          content: JSON.stringify(colorSetContents, null, 2),
        });
      }
    }

    const writePromises: Promise<void>[] = filesToWrite.map(
      (file: { readonly path: string; readonly content: string }) => {
        return writeFileSafe(file.path, file.content, { encoding: 'utf-8' });
      },
    );

    await Promise.all(writePromises);
  });
}

function createXCAssetsColorSet(color: Color): XCAssetsColorSet {
  if (color.space.name.toLowerCase() != 'srgb') {
    throw new Error(`Unsupported color space: ${color.space.name}`);
  }

  const hexString = color.toString({ format: 'hex', collapse: false });
  const hexParts = hexString.slice(1).match(/.{2}/g)!;

  const swiftColors: XCAssetsColor = {
    color: {
      'color-space': color.space.name,
      components: {
        red: `0x${hexParts[0]}`,
        green: `0x${hexParts[1]}`,
        blue: `0x${hexParts[2]}`,
        alpha: hexParts[3] === undefined ? '0xFF' : `0x${hexParts[3]}`,
      },
    },
    idiom: 'universal',
  };

  return {
    colors: [swiftColors],
    info: defaultXCAssets,
  };
}
