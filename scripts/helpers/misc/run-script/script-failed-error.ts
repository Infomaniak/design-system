export interface ScriptFailedErrorOptions extends ErrorOptions {
  readonly title?: string;
  readonly message?: string;
  readonly extra?: string;
}

export class ScriptFailedError extends Error {
  readonly title: string | undefined;
  readonly extra: string | undefined;

  constructor({ message, title, extra, ...options }: ScriptFailedErrorOptions = {}) {
    super(
      message ??
        (options.cause === undefined
          ? 'Unknown error'
          : Error.isError(options.cause)
            ? options.cause.message
            : String(options.cause)),
      options,
    );

    this.name = 'ScriptFailedError';
    this.title = title;
    this.extra = extra;
  }
}
