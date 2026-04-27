import type { FigmaFileVersion } from '../types/figma-file-version.ts';

export function isAutosaveFigmaFileVersion(version: FigmaFileVersion): boolean {
  return (
    (version.label === null || version.label === '') &&
    (version.description === null || version.description === '')
  );
}
