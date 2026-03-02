import type { ExplicitAny } from '../../types/explicit-any.ts';

export interface RawLogger {
  (name: string, args: ExplicitAny[]): void;
}
