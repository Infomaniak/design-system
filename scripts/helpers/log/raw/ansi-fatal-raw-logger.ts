import { ansiEscapeGraphicModeString } from '../ansi/ansi.ts';
import { type RawLogger } from './raw-logger.ts';

export function ansiFatalRawLogger(...parameters: string[]): RawLogger {
  return (name: string, args: any[]): void => {
    console.log('');
    console.log(
      ansiEscapeGraphicModeString(`---- Terminated with error: [${name}] ----`, ...parameters),
    );
    console.log('');
    console.log(...args);
    console.log('\n\n');
  };
}
