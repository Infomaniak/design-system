/**
 * Builds the icon-name inventory from the icon SVG asset file names
 * (`packages/assets/images/svg/assets/svg/monotone/figma/*.svg` — the names
 * the Edelweiss Iconography kit publishes as `esds/icon/<name>` components).
 *
 * The build script (`build-figma-lint-plugin`) calls this with the raw file
 * names and writes the result to `src/core/generated/icon-names.ts`; the logic
 * lives here so it stays tested and deterministic (sorted, deduplicated).
 */
export function buildIconNameList(fileNames: readonly string[]): readonly string[] {
  const names: Set<string> = new Set();

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.svg')) {
      continue;
    }

    names.add(fileName.slice(0, -'.svg'.length));
  }

  return [...names].sort((first: string, second: string): number => first.localeCompare(second));
}
