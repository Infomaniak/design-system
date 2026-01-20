import { logLevelSourceToReadonlyMap } from './log-level/log-level-source-to-readonly-map.ts';
import { type LogLevelSource } from './log-level/log-level-source.ts';
import { type LogLevel } from './log-level/log-level.ts';
import { type RawLogger } from './raw/raw-logger.ts';

export interface LoggerOptions {
  readonly logLevel?: LogLevelSource;
}

export class Logger {
  static root(options?: LoggerOptions): Logger {
    return new Logger('$ROOT', options);
  }

  readonly #name: string;
  readonly #logLevel: ReadonlyMap<LogLevel, RawLogger>;

  constructor(name: string, { logLevel = [] }: LoggerOptions = {}) {
    this.#name = name;
    this.#logLevel = logLevelSourceToReadonlyMap(logLevel);
  }

  get name(): string {
    return this.#name;
  }

  report(level: LogLevel, args: any[]): void {
    this.#logLevel.get(level)?.(this.#name, args);
  }

  log(...args: any[]): void {
    this.report('log', args);
  }

  info(...args: any[]): void {
    this.report('info', args);
  }

  debug(...args: any[]): void {
    this.report('debug', args);
  }

  warn(...args: any[]): void {
    this.report('warn', args);
  }

  error(...args: any[]): void {
    this.report('error', args);
  }

  fatal(error: unknown): void {
    this.report('fatal', [error]);
    throw error;
  }

  child(name: string): Logger {
    return new Logger(this.#name === '$ROOT' ? name : `${this.#name} > ${name}`, {
      logLevel: this.#logLevel,
    });
  }

  spawn<GReturn>(name: string, callback: (logger: Logger) => GReturn): GReturn {
    return callback(this.child(name));
  }

  asyncTask<GReturn>(
    name: string,
    callback: (logger: Logger) => Promise<GReturn>,
    {
      startLevel = 'info',
      successLevel = startLevel,
      errorLevel = 'error',
      timer = true,
    }: LoggerAsyncTaskOptions = {},
  ): Promise<GReturn> {
    return this.spawn(name, async (logger: Logger): Promise<GReturn> => {
      const start: number = Date.now();

      logger.report(startLevel, ['STARTING...']);

      let result: { type: 'success'; value: GReturn } | { type: 'error'; error: unknown };

      try {
        result = {
          type: 'success',
          value: await callback(logger),
        };
      } catch (error: unknown) {
        result = { type: 'error', error };
      }

      const extra: string = timer ? ` (${Date.now() - start}ms)` : '';

      if (result.type === 'success') {
        logger.report(successLevel, [`DONE${extra}`]);
      } else {
        logger.report(errorLevel, [
          `ERROR${extra}${Error.isError(result.error) ? `: ${result.error.message}` : ''}`,
        ]);
        throw result.error;
      }

      return result.value;
    });
  }
}

export interface LoggerAsyncTaskOptions {
  readonly startLevel?: LogLevel;
  readonly successLevel?: LogLevel;
  readonly errorLevel?: LogLevel;
  readonly timer?: boolean;
}
