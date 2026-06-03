import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../src');

/**
 * Generate public-api.ts by scanning src/ for component directories
 * that have an index.ts barrel file.
 */
function generatePublicApi() {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const exports = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const indexPath = path.join(srcDir, entry.name, 'index.ts');
    if (!fs.existsSync(indexPath)) continue;

    exports.push(`export * from './${entry.name}/index.ts';`);
  }

  const content = exports.sort().join('\n') + '\n';
  const outputPath = path.join(srcDir, 'public-api.ts');

  fs.writeFileSync(outputPath, content);

  console.log(`[generate-public-api] Generated ${outputPath} with ${exports.length} export(s)`);
}

generatePublicApi();
