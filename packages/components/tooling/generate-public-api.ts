import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RELATIVE_SRC_DIR = '../src';
const EXCLUDED_FILE = 'public-api.ts';
const EXCLUDED_SUFFIXES = ['.private', '.test', '.stories', '.mock'];
const FILE_EXTENSION = '.ts';

interface ScanResult {
  filePath: string;
  relativePath: string;
}

function isExcludedDirectory(name: string): boolean {
  return EXCLUDED_SUFFIXES.some((suffix) => name.endsWith(suffix));
}

function isExcludedFile(name: string): boolean {
  if (name === EXCLUDED_FILE) {
    return true;
  }

  if (!name.endsWith(FILE_EXTENSION)) {
    return true;
  }

  return EXCLUDED_SUFFIXES.some((suffix) => name.endsWith(`${suffix}${FILE_EXTENSION}`));
}

function scanDirectory(dirPath: string, basePath: string): ScanResult[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const results: ScanResult[] = [];

  for (const entry of entries) {
    const filePath = path.join(dirPath, entry.name);
    const relativePath = path.relative(basePath, filePath);

    if (entry.isDirectory()) {
      if (isExcludedDirectory(entry.name)) {
        continue;
      }
      results.push(...scanDirectory(filePath, basePath));
      continue;
    }

    if (isExcludedFile(entry.name)) {
      continue;
    }

    results.push({
      filePath,
      relativePath,
    });
  }

  return results;
}

function main(): void {
  const absoluteSrcDir = path.resolve(__dirname, RELATIVE_SRC_DIR);
  const outputFile = path.join(absoluteSrcDir, 'public-api.ts');

  if (!fs.existsSync(absoluteSrcDir)) {
    console.error(`Source directory not found: ${absoluteSrcDir}`);
    process.exit(1);
  }

  const files = scanDirectory(absoluteSrcDir, absoluteSrcDir);

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

main();
