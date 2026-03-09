import type { ExplicitAny } from '../../types/explicit-any.ts';
import { ansiEscapeGraphicModeString } from '../ansi/ansi.ts';
import { type RawLogger } from './raw-logger.ts';

export function ansiRawLogger(...parameters: string[]): RawLogger {
  return (name: string, args: ExplicitAny[]): void => {
    console.log(ansiEscapeGraphicModeString(`[${name}]`, ...parameters), ...args);
  };
}
