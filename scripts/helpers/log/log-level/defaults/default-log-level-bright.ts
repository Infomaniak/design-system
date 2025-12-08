import {
  ANSI_ESCAPE_SET_BACKGROUND_BRIGHT_COLOR_CYAN,
  ANSI_ESCAPE_SET_BACKGROUND_BRIGHT_COLOR_GREEN,
  ANSI_ESCAPE_SET_BACKGROUND_BRIGHT_COLOR_MAGENTA,
  ANSI_ESCAPE_SET_BACKGROUND_BRIGHT_COLOR_RED,
  ANSI_ESCAPE_SET_BACKGROUND_BRIGHT_COLOR_YELLOW,
  ANSI_ESCAPE_SET_BOLD_MODE,
  ANSI_ESCAPE_SET_FOREGROUND_BRIGHT_COLOR_RED,
  ANSI_ESCAPE_SET_FOREGROUND_BRIGHT_COLOR_WHITE,
} from '../../ansi/ansi.ts';
import { ansiFatalRawLogger } from '../../raw/ansi-fatal-raw-logger.ts';
import { ansiRawLogger } from '../../raw/ansi-raw-logger.ts';
import { type RawLogger } from '../../raw/raw-logger.ts';
import { type LogLevel } from '../log-level.ts';

export const DEFAULT_LOG_LEVEL_BRIGHT: ReadonlyMap<LogLevel, RawLogger> = new Map<
  LogLevel,
  RawLogger
>([
  [
    'log',
    ansiRawLogger(
      ANSI_ESCAPE_SET_BOLD_MODE,
      ANSI_ESCAPE_SET_FOREGROUND_BRIGHT_COLOR_WHITE,
      ANSI_ESCAPE_SET_BACKGROUND_BRIGHT_COLOR_GREEN,
    ),
  ],
  [
    'info',
    ansiRawLogger(
      ANSI_ESCAPE_SET_BOLD_MODE,
      ANSI_ESCAPE_SET_FOREGROUND_BRIGHT_COLOR_WHITE,
      ANSI_ESCAPE_SET_BACKGROUND_BRIGHT_COLOR_CYAN,
    ),
  ],
  [
    'debug',
    ansiRawLogger(
      ANSI_ESCAPE_SET_BOLD_MODE,
      ANSI_ESCAPE_SET_FOREGROUND_BRIGHT_COLOR_WHITE,
      ANSI_ESCAPE_SET_BACKGROUND_BRIGHT_COLOR_MAGENTA,
    ),
  ],
  [
    'warn',
    ansiRawLogger(
      ANSI_ESCAPE_SET_BOLD_MODE,
      ANSI_ESCAPE_SET_FOREGROUND_BRIGHT_COLOR_WHITE,
      ANSI_ESCAPE_SET_BACKGROUND_BRIGHT_COLOR_YELLOW,
    ),
  ],
  [
    'error',
    ansiRawLogger(
      ANSI_ESCAPE_SET_BOLD_MODE,
      ANSI_ESCAPE_SET_FOREGROUND_BRIGHT_COLOR_WHITE,
      ANSI_ESCAPE_SET_BACKGROUND_BRIGHT_COLOR_RED,
    ),
  ],
  [
    'fatal',
    ansiFatalRawLogger(ANSI_ESCAPE_SET_BOLD_MODE, ANSI_ESCAPE_SET_FOREGROUND_BRIGHT_COLOR_RED),
  ],
]);
