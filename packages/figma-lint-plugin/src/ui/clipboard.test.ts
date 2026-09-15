import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard } from './clipboard.ts';

function stubClipboard(clipboard: unknown): void {
  Object.defineProperty(navigator, 'clipboard', { value: clipboard, configurable: true });
}

describe('copyTextToClipboard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    stubClipboard(undefined);
    document.body.innerHTML = '';
  });

  it('writes the text with the async Clipboard API when available', async () => {
    const execCommand: ReturnType<typeof vi.fn> = vi.fn((): boolean => true);
    document.execCommand = execCommand as typeof document.execCommand;
    const writeText: ReturnType<typeof vi.fn> = vi.fn((): Promise<void> => Promise.resolve());
    stubClipboard({ writeText });

    await copyTextToClipboard('#FF00FF');

    expect(writeText).toHaveBeenCalledWith('#FF00FF');
    expect(execCommand).not.toHaveBeenCalled();
  });

  it('falls back to a hidden textarea with execCommand when writeText rejects', async () => {
    const execCommand: ReturnType<typeof vi.fn> = vi.fn((): boolean => true);
    document.execCommand = execCommand as typeof document.execCommand;
    stubClipboard({
      writeText: vi.fn((): Promise<void> => Promise.reject(new Error('denied'))),
    });

    const appended: Element[] = [];
    const originalAppend: typeof document.body.append = document.body.append.bind(document.body);
    vi.spyOn(document.body, 'append').mockImplementation((...nodes: (Node | string)[]): void => {
      for (const node of nodes) {
        if (node instanceof Element) {
          appended.push(node);
        }
      }
      originalAppend(...nodes);
    });

    await copyTextToClipboard('#FF00FF');

    const textarea: HTMLTextAreaElement | undefined = appended.find(
      (node: Element): node is HTMLTextAreaElement => node.tagName === 'TEXTAREA',
    );
    expect(textarea!.value).toBe('#FF00FF');
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(document.body.querySelector('textarea')).toBeNull();
  });

  it('falls back when the Clipboard API is unavailable', async () => {
    const execCommand: ReturnType<typeof vi.fn> = vi.fn((): boolean => true);
    document.execCommand = execCommand as typeof document.execCommand;
    stubClipboard(undefined);

    await copyTextToClipboard('#FF00FF');

    expect(execCommand).toHaveBeenCalledWith('copy');
  });

  it('throws when the execCommand fallback fails', async () => {
    document.execCommand = vi.fn((): boolean => false) as typeof document.execCommand;
    stubClipboard(undefined);

    await expect(copyTextToClipboard('#FF00FF')).rejects.toThrow('Copy to clipboard failed.');
  });
});
