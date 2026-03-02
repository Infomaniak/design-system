import type Color from 'colorjs.io';
import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { indent } from '../../../../../../../../../scripts/helpers/misc/string/indent/indent.ts';
import { isCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { colorDesignTokenValueToColorJs } from '../../../../../../shared/dtcg/design-token/token/types/base/types/color/value/to/colorjs/color-design-token-value-to-color-js.ts';
import type { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericDesignTokensCollectionTokenWithType } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header.ts';

export interface BuildKotlinTokensOptions {
  readonly collection: DesignTokensCollection;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

interface KotlinColorProperty {
  readonly name: string;
  readonly hexValue: string;
}

export function buildKotlinTokens({
  collection,
  outputDirectory,
  logger,
}: BuildKotlinTokensOptions): Promise<void> {
  return logger.asyncTask('kotlin', async (): Promise<void> => {
    const kotlinColorsProperties: KotlinColorProperty[] = [];

    for (const token of collection.tokens()) {
      const resolvedToken: GenericDesignTokensCollectionTokenWithType = {
        ...token,
        type: collection.resolve(token).type,
      };

      if (isColorDesignTokensCollectionToken(resolvedToken)) {
        if (isCurlyReference(resolvedToken.value)) {
          continue;
        }

        const kotlinValName = resolvedToken.name.filter((part) => part !== 'color').join('');
        const color: Color = colorDesignTokenValueToColorJs(resolvedToken.value, resolvedToken);

        kotlinColorsProperties.push({
          name: kotlinValName,
          hexValue: colorToCompose(color),
        });
      }
    }

    const sortedProperties = kotlinColorsProperties
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    const fileContent = kotlinColorPropertiesToFileContent(sortedProperties);

    await writeFileSafe(`${outputDirectory}/android/compose/EsdsColorRawTokens.kt`, fileContent, {
      encoding: 'utf-8',
    });
  });
}

/** Converts hex RRGGBBAA (standard) to AARRGGBB (Jetpack Compose) */
function colorToCompose(color: Color): string {
  const hex = color
    .to('srgb')
    .toString({ format: 'hex', collapse: false })
    .substring(1)
    .toUpperCase();

  // If length is 8, the last 2 chars are `alpha` otherwise, `alpha` is implicit `FF`
  const alpha = hex.length === 8 ? hex.slice(6) : 'FF';
  const rgb = hex.slice(0, 6);

  return `0x${alpha}${rgb}`;
}

function kotlinColorPropertyToString(property: KotlinColorProperty): string {
  return indent(`val ${property.name} = Color(${property.hexValue})`, '    ');
}

function kotlinColorPropertiesToFileContent(properties: readonly KotlinColorProperty[]): string {
  return `//
// ${AUTO_GENERATED_FILE_HEADER}
//

package com.infomaniak.designsystem.compose

import androidx.compose.ui.graphics.Color

object EsdsColorRawTokens {
${properties.map(kotlinColorPropertyToString).join('\n')}
}
`;
}
