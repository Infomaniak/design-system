import fs from 'node:fs';
import path from 'node:path';
import { getPublicApiSourceFiles, getSourceDir } from './public-api-scan.ts';

async function main(): Promise<void> {
  // if (!(await validatePublicApi())) {
  //   process.exit(1);
  // }

  const absoluteSrcDir = getSourceDir();
  const outputFile = path.join(absoluteSrcDir, 'public-api.ts');

  if (!fs.existsSync(absoluteSrcDir)) {
    console.error(`Source directory not found: ${absoluteSrcDir}`);
    process.exit(1);
  }

  const files = await getPublicApiSourceFiles();

  const sortedExportPaths = files
    .map((file) => {
      return file.relativePath.replace(/\\/g, '/');
    })
    .sort();

  const exportLines = sortedExportPaths.map((relativePath) => `export * from './${relativePath}';`);

  const content = exportLines.join('\n') + '\n';

  fs.writeFileSync(outputFile, content, 'utf-8');

  console.log(`Generated ${outputFile} with ${exportLines.length} export(s)`);
}

await main();
