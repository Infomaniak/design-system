const VITE_MOCKER_ENTRY_PATTERN: RegExp = /src=(['"])\/vite-inject-mocker-entry\.js\1/g;

export function normalizeStorybookIframeHtml(html: string): string {
  return html.replace(VITE_MOCKER_ENTRY_PATTERN, (_fullMatch: string, quote: string): string => {
    return `src=${quote}./vite-inject-mocker-entry.js${quote}`;
  });
}
