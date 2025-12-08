/**
 * Creates a Promise that resolves after `duration` milliseconds.
 */
export function sleep(duration: number, signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve: () => void, reject: (reason?: unknown) => void): void => {
    signal?.throwIfAborted();

    const end = (): void => {
      signal?.removeEventListener('abort', onAbort);
      clearTimeout(timer);
    };

    const onAbort = (): void => {
      end();
      reject(signal!.reason);
    };

    signal?.addEventListener('abort', onAbort);

    const timer: any = setTimeout((): void => {
      end();
      resolve();
    }, duration);
  });
}
