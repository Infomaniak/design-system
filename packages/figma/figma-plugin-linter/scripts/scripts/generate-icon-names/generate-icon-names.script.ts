import { runScript } from '../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { generateIconNameInventory } from './generate-icon-names.ts';

await runScript('generate-icon-names', async (): Promise<void> => {
  await generateIconNameInventory();
});
