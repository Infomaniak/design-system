/**
 * Options for the resolved value display element.
 */
export interface CreateResolvedValueDisplayOptions {
  /**
   * When provided, the `<div>` will receive a `data-preview-value` attribute.
   * The element body is left empty since the value is filled in by JavaScript
   * at runtime (e.g. for themable color tokens).
   *
   * @default undefined
   */
  readonly dataPreviewValue?: string;
}

/**
 * Creates a standardized resolved value display element for markdown token previews.
 * Used across all token type renderers to maintain consistent styling for resolved values.
 *
 * @param value - The resolved value to display (ignored when `dataPreviewValue` is set)
 * @param options - Optional configuration for special rendering modes
 * @returns HTML string for the resolved value display element
 */
export function createResolvedValueDisplay(
  value: string | number,
  options: CreateResolvedValueDisplayOptions = {},
): string {
  const { dataPreviewValue } = options;

  const dataAttr = dataPreviewValue ? `data-preview-value="${dataPreviewValue}"` : '';
  const content = dataPreviewValue ? '' : value;

  return /* HTML */ `
    <div
      style="
      margin-top: 4px;
      font-family: monospace;
      font-size: 12px;
      color: #6b7280;
      min-height: 18px;
    "
      ${dataAttr}
    >
      ${content}
    </div>
  `;
}
