export const REM_TO_PX: number = 16;

export function convertRemToPx(input: number): number {
  return input * REM_TO_PX;
}
