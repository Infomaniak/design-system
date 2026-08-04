import * as z from 'zod';

export const fontFaceFontStyleSchema = z.union([
  z.enum(['auto', 'normal', 'italic', 'left', 'right', 'oblique']),
  z.stringFormat('oblique', /^oblique\s+/),
]);
