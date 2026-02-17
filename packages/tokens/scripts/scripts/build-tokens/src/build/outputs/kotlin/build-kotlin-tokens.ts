import type Color from 'colorjs.io';
import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
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
      if (isColorDesignTokensCollectionToken(token)) {
        const resolvedToken: GenericDesignTokensCollectionTokenWithType = {
          ...token,
          type: collection.resolve(token).type,
        };

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
  const hexCode = color.toString({ format: 'hex', collapse: false }).toUpperCase();
  return (
    '0x' + (hexCode.length > 7 ? hexCode.slice(-2) + hexCode.slice(1, -2) : 'FF' + hexCode.slice(1))
  );
}

function kotlinColorPropertyToString(property: KotlinColorProperty): string {
  return `    val ${property.name} = Color(${property.hexValue})`;
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
