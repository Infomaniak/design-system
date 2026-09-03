import type { PublishMode } from './publish-mode.ts';

export type FontPublishDirectory = 'dev' | 'latest';

export function publishModeToFontPublishDirectory(mode: PublishMode): FontPublishDirectory {
  switch (mode) {
    case 'dev':
    case 'rc':
      return 'dev';
    case 'prod':
      return 'latest';
  }
}
