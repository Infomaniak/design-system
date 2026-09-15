const PENDING_LOADS = new Map<string, Promise<void>>();

/**
 * Generic helper to dynamically load a remote CSS stylesheet by injecting a
 * `<link rel="stylesheet">` tag into the document head.
 *
 * - Deduplicates concurrent and repeated loads for the same URL.
 * - Resolves once the stylesheet is loaded.
 * - Rejects when the stylesheet fails to load so callers can log or recover.
 */
export function loadRemoteCss(url: string): Promise<void> {
  let promise: Promise<void> | undefined = PENDING_LOADS.get(url);

  if (promise === undefined) {
    promise = new Promise<void>((resolve: () => void, reject: (reason: unknown) => void): void => {
      const existingLink: HTMLLinkElement | undefined = [
        ...document.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
      ].find((link: HTMLLinkElement): boolean => link.getAttribute('href') === url);

      if (existingLink) {
        resolve();
        return;
      }

      const link: HTMLLinkElement = document.createElement('link');

      const controller: AbortController = new AbortController();

      link.addEventListener(
        'load',
        (): void => {
          controller.abort();
          resolve();
        },
        { signal: controller.signal },
      );

      link.addEventListener(
        'error',
        (): void => {
          controller.abort();
          PENDING_LOADS.delete(url);
          link.remove();
          reject(new Error(`Failed to load remote CSS: ${url}`));
        },
        { signal: controller.signal },
      );

      link.rel = 'stylesheet';
      link.href = url;

      document.head.appendChild(link);
    });

    PENDING_LOADS.set(url, promise);
  }

  return promise;
}
