import type { FigmaUser } from '../../users/types/figma-user.ts';

export interface FigmaFileVersion {
  readonly id: string;
  readonly created_at: string; // UTC ISO 8601
  readonly label: string | null;
  readonly description: string | null;
  readonly user: FigmaUser;
  readonly thumbnail_url: string;
}
