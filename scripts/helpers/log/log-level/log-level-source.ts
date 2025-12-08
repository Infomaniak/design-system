import { type RawLogger } from '../raw/raw-logger.ts';
import { type LogLevel } from './log-level.ts';

export type LogLevelSource =
  | Iterable<[level: LogLevel, logger: RawLogger]>
  | Partial<Record<LogLevel, RawLogger>>;
