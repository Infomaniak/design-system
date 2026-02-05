import { glob, opendir } from 'node:fs/promises';
import { basename } from 'node:path';
import type { DesignTokensCollection } from '../design-tokens-collection.ts';

export type DesignTokenModifiers = Map<string /* modifier */, DesignTokenContexts>;

export type DesignTokenContexts = Map<string /* context */, DesignTokensCollection>;

/* EXTRACT */

export interface ExtractDesignTokenModifiersOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly sourceDirectory: string;
}

export async function extractDesignTokenModifiers({
  baseCollection,
  sourceDirectory,
}: ExtractDesignTokenModifiersOptions): Promise<DesignTokenModifiers> {
  const modifiers: DesignTokenModifiers = new Map();

  for await (const modifierDir of await opendir(sourceDirectory)) {
    if (!modifierDir.isDirectory()) {
      throw new Error(`Expected directory, got file: ${modifierDir.name}`);
    }

    const contexts: DesignTokenContexts = new Map<string, DesignTokensCollection>();

    const modifier: string = basename(modifierDir.name, '.tokens.json');

    modifiers.set(modifier, contexts);

    for await (const contextEntry of glob(`${sourceDirectory}/${modifier}/*.tokens.json`)) {
      const context: string = basename(contextEntry, '.tokens.json');

      contexts.set(
        context,
        await baseCollection
          .clone()
          .fromFiles([contextEntry], { forEachTokenBehaviour: 'prevent-new-token' }),
      );
    }
  }

  return modifiers;
}
