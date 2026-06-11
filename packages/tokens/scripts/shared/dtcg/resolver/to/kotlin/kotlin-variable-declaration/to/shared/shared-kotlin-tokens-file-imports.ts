import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';

export const SHARED_KOTLIN_TOKENS_FILE_IMPORTS: string = dedent`
  import androidx.compose.ui.graphics.Color
  import androidx.compose.ui.unit.Dp
  import androidx.compose.ui.unit.dp
  import androidx.compose.ui.unit.sp
  import androidx.compose.ui.graphics.Shape
  import androidx.compose.ui.graphics.RectangleShape
  import androidx.compose.foundation.shape.RoundedCornerShape
  import androidx.compose.foundation.shape.CircleShape
  import androidx.compose.ui.unit.TextUnit
  import androidx.compose.ui.text.TextStyle
  import androidx.compose.ui.text.font.FontFamily
  import androidx.compose.ui.text.font.FontWeight
  import androidx.compose.foundation.BorderStroke
  import androidx.compose.ui.graphics.shadow.Shadow
`;
