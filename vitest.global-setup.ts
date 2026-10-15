import { access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR: string = dirname(fileURLToPath(import.meta.url));
const GENERATED_ICON_NAMES: string = join(
  ROOT_DIR,
  'packages/figma/figma-plugin-linter/src/core/generated/icon-names.ts',
);

/**
 * The linter's icon inventory is generated from the svg-assets package and
 * gitignored — produce it before the first test run on a fresh checkout.
 * A no-op when the file already exists (the build or check:types made it).
 */
export default async function setup(): Promise<void> {
  try {
    await access(GENERATED_ICON_NAMES);
  } catch {
    const { generateIconNameInventory } =
      await import('./packages/figma/figma-plugin-linter/scripts/scripts/generate-icon-names/generate-icon-names.ts');

    await generateIconNameInventory();
  }
}
