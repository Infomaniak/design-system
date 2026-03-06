import type { PublishMode } from '../publish-mode/publish-mode.ts';

export interface PublishConfig {
  readonly mode: PublishMode;
}
