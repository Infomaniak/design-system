import fs from 'node:fs';
import path from 'node:path';
import { getPublicApiSourceFiles, getSourceDir } from './public-api-scan.ts';

async function generatePublicApi(absoluteSrcDir: string): Promise<void> {
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

async function generateReactBarrel(reactDir: string): Promise<void> {
  if (!fs.existsSync(reactDir)) {
    fs.mkdirSync(reactDir, { recursive: true });
  }

  const files: string[] = [];
  for await (const entry of fs.promises.glob('*.ts', { cwd: reactDir })) {
    const file = entry as string;
    if (file !== 'index.ts') {
      files.push(file);
    }
  }

  const sortedFiles = files.sort();
  const exportLines = sortedFiles.map((file) => `export * from './${file}';`);

  const content = exportLines.join('\n') + '\n';
  const outputFile = path.join(reactDir, 'index.ts');

  fs.writeFileSync(outputFile, content, 'utf-8');

  console.log(`Generated ${outputFile} with ${exportLines.length} export(s)`);
}

async function main(): Promise<void> {
  const absoluteSrcDir = getSourceDir();

  await generatePublicApi(absoluteSrcDir);

  await generateReactBarrel(path.join(absoluteSrcDir, 'react'));
}

await main();
