import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename));

const RELATIVE_SRC_DIR = '../src';
const EXCLUDED_FILE = 'public-api.ts';
const EXCLUDED_SUFFIXES = ['.private', '.test', '.stories', '.mock'];
const ALLOWED_EXTENSIONS = ['.ts'];

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

/**
 * Strips the trailing `.ts` or `.d.ts` extension so that suffix checks
 * work uniformly for both declaration and source files.
 */
function stripExtension(name: string): string {
  if (name.endsWith('.d.ts')) {
    return name.slice(0, -'.d.ts'.length);
  }

  if (name.endsWith('.ts')) {
    return name.slice(0, -'.ts'.length);
  }

  return name;
}

export function isExcludedFile(name: string): boolean {
  if (name === EXCLUDED_FILE) {
    return true;
  }

  if (!name.endsWith('.ts')) {
    return true;
  }

  const base = stripExtension(name);

  return EXCLUDED_SUFFIXES.some((suffix) => base.endsWith(suffix));
}

export function buildGlobPatterns(): string[] {
  return ALLOWED_EXTENSIONS.map((ext) => `**/*${ext}`);
}

export function buildGlobExcludePatterns(): string[] {
  const suffixGlob = EXCLUDED_SUFFIXES.map((s) => s.replace('.', '')).join(',');

  return [
    `**/${EXCLUDED_FILE}`,
    `**/*.{${suffixGlob}}.ts`,
    `**/*.{${suffixGlob}}.d.ts`,
    `**/*.{${suffixGlob}}/**/*.ts`,
    `**/*.{${suffixGlob}}/**/*.d.ts`,
  ];
}

export async function getPublicApiSourceFiles(srcDirOverride?: string): Promise<SourceFile[]> {
  const srcDir = srcDirOverride ?? getSourceDir();

  if (!fs.existsSync(srcDir)) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }

  const files: string[] = [];

  for await (const entry of fs.promises.glob(buildGlobPatterns(), {
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
