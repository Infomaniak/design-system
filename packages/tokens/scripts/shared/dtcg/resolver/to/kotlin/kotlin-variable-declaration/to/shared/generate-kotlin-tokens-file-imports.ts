export function generateKotlinTokensFileImports(content: string): string {
  const imports: string[] = [];

  if (content.includes(': Color')) {
    imports.push('androidx.compose.ui.graphics.Color');
  }

  if (content.includes(': Dp')) {
    imports.push('androidx.compose.ui.unit.Dp');
  }

  if (/\d+\.dp/.test(content)) {
    imports.push('androidx.compose.ui.unit.dp');
  }

  if (/\d+\.sp/.test(content)) {
    imports.push('androidx.compose.ui.unit.sp');
  }

  if (content.includes(': Shape')) {
    imports.push('androidx.compose.ui.graphics.Shape');
  }

  if (content.includes('RectangleShape')) {
    imports.push('androidx.compose.ui.graphics.RectangleShape');
  }

  if (content.includes('RoundedCornerShape')) {
    imports.push('androidx.compose.foundation.shape.RoundedCornerShape');
  }

  if (content.includes('CircleShape')) {
    imports.push('androidx.compose.foundation.shape.CircleShape');
  }

  if (content.includes('TextUnit')) {
    imports.push('androidx.compose.ui.unit.TextUnit');
  }

  if (content.includes(': TextStyle')) {
    imports.push('androidx.compose.ui.text.TextStyle');
  }

  if (content.includes('FontFamily')) {
    imports.push('androidx.compose.ui.text.font.FontFamily');
  }

  if (content.includes('FontWeight')) {
    imports.push('androidx.compose.ui.text.font.FontWeight');
  }

  if (content.includes('BorderStroke')) {
    imports.push('androidx.compose.foundation.BorderStroke');
  }

  if (content.includes('Shadow')) {
    imports.push('androidx.compose.ui.graphics.shadow.Shadow');
  }

  return imports
    .map((path: string): string => {
      return `import ${path}`;
    })
    .join('\n');
}
