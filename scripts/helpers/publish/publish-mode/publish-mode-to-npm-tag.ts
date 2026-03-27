import type { PublishMode } from './publish-mode.ts';

export function publishModeToNpmTag(mode: PublishMode): string {
  switch (mode) {
    case 'dev':
      return 'dev';
    case 'rc':
      return 'rc';
    case 'prod':
      return 'latest';
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
}
