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

function buildGlobExcludePatterns(): string[] {
  const suffixGlob = EXCLUDED_SUFFIXES.map((s) => s.replace('.', '')).join(',');

  return [
    `**/${EXCLUDED_FILE}`,
    `**/*.{${suffixGlob}}${FILE_EXTENSION}`,
    `**/*.{${suffixGlob}}/**/*${FILE_EXTENSION}`,
  ];
}

export async function getPublicApiSourceFiles(): Promise<SourceFile[]> {
  const srcDir = getSourceDir();

  if (!fs.existsSync(srcDir)) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }

  const files: string[] = [];

  for await (const entry of fs.promises.glob('**/*.ts', {
    cwd: srcDir,
    exclude: buildGlobExcludePatterns(),
  })) {
    files.push(entry as string);
  }

  return files
    .map((relativePath) => ({
      absolutePath: path.join(srcDir, relativePath),
      relativePath,
    }))
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}
