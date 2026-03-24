import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import StyleDictionary from 'style-dictionary';
import type { TransformedToken, Config } from 'style-dictionary/types';

import { fixTypeInheritanceParser } from './parser.ts';
import { nameTransform } from './transforms.ts';
import {
  VARIABLE_PREFIX,
  T1_DIRECTORY_NAME,
  T2_DIRECTORY_NAME,
  T3_DIRECTORY_NAME,
} from './helpers.ts';

export interface BuildContext {
  readonly tokensDir: string;
  readonly distDir: string;
  readonly rootDir: string;
  readonly baseSources: string[];
  readonly baseTokens: TransformedToken[];
}

export function registerHooks(sd: typeof StyleDictionary): void {
  sd.registerParser(fixTypeInheritanceParser);
  sd.registerTransform(nameTransform);
}

export async function collectTokens(sources: string[]): Promise<TransformedToken[]> {
  const config: Config = {
    source: sources,
    log: { verbosity: 'silent' },
    parsers: ['esds/fix-type-inheritance'],
    expand: false,
    platforms: {
      collect: {
        transforms: ['esds/name'],
        prefix: VARIABLE_PREFIX,
        options: { outputReferences: true },
        files: [],
      },
    },
  };

  const sd = new StyleDictionary(config);
  await sd.buildPlatform('collect');
  const { allTokens } = await sd.getPlatformTokens('collect');

  const tierOrder = (token: TransformedToken): number => {
    const fp = token.filePath ?? '';
    if (fp.includes(T1_DIRECTORY_NAME)) return 0;
    if (fp.includes(T2_DIRECTORY_NAME)) return 1;
    if (fp.includes(T3_DIRECTORY_NAME)) return 2;
    return 3;
  };

  const indexMap = new Map<TransformedToken, number>();
  allTokens.forEach((t, i) => indexMap.set(t, i));

  allTokens.sort((a: TransformedToken, b: TransformedToken) => {
    const tierDiff = tierOrder(a) - tierOrder(b);
    if (tierDiff !== 0) return tierDiff;
    const fpDiff = (a.filePath ?? '').localeCompare(b.filePath ?? '');
    if (fpDiff !== 0) return fpDiff;
    return (indexMap.get(a) ?? 0) - (indexMap.get(b) ?? 0);
  });

  return allTokens;
}

export async function writeFileSafe(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf-8');
}

export async function listTokenFiles(dir: string): Promise<string[]> {
  try {
    return (await readdir(dir)).filter((f: string) => f.endsWith('.tokens.json'));
  } catch {
    return [];
  }
}
