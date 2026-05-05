import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../../../../../../scripts/build-tokens/src/build/constants/auto-generated-file-header.ts';
import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import { kotlinVariableDeclarationsToKotlinValDeclarationsString } from './kotlin-variable-declarations-to-kotlin-val-declarations-string.ts';

export function kotlinVariableDeclarationsToRawKotlinTokenFileContent(
  declarations: Iterable<KotlinVariableDeclaration>,
): string {
  return dedent`
    /*
      ${AUTO_GENERATED_FILE_HEADER}
    */
    
    package com.example.compose
    
    import androidx.compose.ui.graphics.Color
    import androidx.compose.ui.text.font.FontFamily
    import androidx.compose.ui.unit.Dp
    import androidx.compose.ui.unit.TextUnit
    import androidx.compose.ui.unit.dp
    import androidx.compose.ui.unit.sp
    import androidx.compose.ui.text.font.FontWeight
    import androidx.compose.foundation.BorderStroke
    import androidx.compose.ui.graphics.shadow.Shadow
    import androidx.compose.ui.text.TextStyle
    
    ${kotlinVariableDeclarationsToKotlinValDeclarationsString(declarations)}
  `;
}
