import type Color from 'colorjs.io';
import { join } from 'node:path';
import { writeJsonFileSafe } from '../../../../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { isCurlyReference } from '../../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { colorDesignTokensCollectionTokenValueToColorInstance } from '../../../../../../../shared/dtcg/resolver/token/types/base/color/value/to/color-design-tokens-collection-token-value-to-color-instance.ts';
import { buildColorsetContents } from '../build-colorset-contents.ts';

export interface BuildXcAssetsOptions {
  readonly token: GenericDesignTokensCollectionToken;
  readonly t1ColorTokenNameToColorsetName: Map<string, string>;
  readonly outputDirectory: string;
}

export async function buildXcAssets({
  token,
  t1ColorTokenNameToColorsetName,
  outputDirectory,
}: BuildXcAssetsOptions): Promise<void> {
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
    join(outputDirectory, `Colors.xcassets/${category}/${colorsetName}.colorset/Contents.json`),
    buildColorsetContents(sRGBColor),
  );
}
