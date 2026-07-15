import type { RunScriptNotification } from './run-script-notification.ts';

export interface ScriptFailedErrorOptions extends RunScriptNotification, ErrorOptions {
  readonly message?: string;
}

export class ScriptFailedError extends Error implements ScriptFailedErrorOptions {
  readonly notificationTitle: string | undefined;
  readonly notificationMessage: string | undefined;

  constructor({
    message,
    notificationTitle,
    notificationMessage,
    ...options
  }: ScriptFailedErrorOptions = {}) {
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
    this.notificationTitle = notificationTitle;
    this.notificationMessage = notificationMessage;
  }
}
