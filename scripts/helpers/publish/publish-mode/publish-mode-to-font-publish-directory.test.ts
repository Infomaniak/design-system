import { describe, expect, it } from 'vitest';
import { publishModeToFontPublishDirectory } from './publish-mode-to-font-publish-directory.ts';

describe('publishModeToFontPublishDirectory', () => {
  it('maps dev to dev', () => {
    expect(publishModeToFontPublishDirectory('dev')).toBe('dev');
  });

  it('maps rc to dev', () => {
    expect(publishModeToFontPublishDirectory('rc')).toBe('dev');
  });

  it('maps prod to latest', () => {
    expect(publishModeToFontPublishDirectory('prod')).toBe('latest');
  });
});
