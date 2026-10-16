/**
 * Copies text to the clipboard with a `document.execCommand` fallback for
 * contexts where the async Clipboard API is unavailable or denied (Figma
 * plugin iframes do not reliably grant `clipboard-write`).
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  let copiedViaClipboardApi: boolean = false;

  if (navigator.clipboard !== undefined) {
    try {
      await navigator.clipboard.writeText(text);
      copiedViaClipboardApi = true;
    } catch {
      copiedViaClipboardApi = false;
    }
  }

  if (!copiedViaClipboardApi) {
    copyViaExecCommand(text);
  }
}

function copyViaExecCommand(text: string): void {
  const textarea: HTMLTextAreaElement = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();

  const copied: boolean = document.execCommand('copy');
  textarea.remove();

  if (!copied) {
    throw new Error('Copy to clipboard failed.');
  }
}
