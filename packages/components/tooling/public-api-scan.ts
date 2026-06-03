import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename));

const RELATIVE_SRC_DIR = '../src';
const EXCLUDED_FILE = 'public-api.ts';
const EXCLUDED_SUFFIXES = ['.private', '.test', '.stories', '.mock'];
const FILE_EXTENSION = '.ts';

export interface SourceFile {
  absolutePath: string;
  relativePath: string;
}

export function getSourceDir(): string {
  return path.resolve(__dirname, RELATIVE_SRC_DIR);
}

export function isExcludedDirectory(name: string): boolean {
  return EXCLUDED_SUFFIXES.some((suffix) => name.endsWith(suffix));
}

export function isExcludedFile(name: string): boolean {
  if (name === EXCLUDED_FILE) {
    return true;
  }

  if (!name.endsWith(FILE_EXTENSION)) {
    return true;
  }

  return EXCLUDED_SUFFIXES.some((suffix) => name.endsWith(`${suffix}${FILE_EXTENSION}`));
}

function scanDirectory(dirPath: string, basePath: string, results: SourceFile[]): void {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);
    const relativePath = path.relative(basePath, absolutePath);

    if (entry.isDirectory()) {
      if (isExcludedDirectory(entry.name)) {
        continue;
      }
      scanDirectory(absolutePath, basePath, results);
      continue;
    }

    if (isExcludedFile(entry.name)) {
      continue;
    }

    results.push({
      absolutePath,
      relativePath,
    });
  }
}

export function getPublicApiSourceFiles(): SourceFile[] {
  const srcDir = getSourceDir();

  if (!fs.existsSync(srcDir)) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }

  const results: SourceFile[] = [];
  scanDirectory(srcDir, srcDir, results);

  return results.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}
