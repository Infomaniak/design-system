export const PX_TO_REM: number = 1 / 16;

export function convertPxToRem(input: number): number {
  return input * PX_TO_REM;
}
