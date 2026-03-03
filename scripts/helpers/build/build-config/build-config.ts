import type { BuildMode } from '../build-mode/build-mode.ts';

export interface BuildConfig {
  readonly mode: BuildMode;
  readonly prerelease?: string;
}
