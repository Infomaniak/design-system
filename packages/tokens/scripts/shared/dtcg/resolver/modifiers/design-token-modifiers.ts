import { glob, opendir } from 'node:fs/promises';
import { basename } from 'node:path';
import { mapGetOrInsertComputed } from '../../../../../../../scripts/helpers/misc/map/upsert.ts';
import type { DesignTokensCollection } from '../design-tokens-collection.ts';

export type DesignTokenModifiers = Map<string /* modifier */, DesignTokenContexts>;

export type DesignTokenContexts = Map<string /* context */, DesignTokensCollection>;

export type DesignTokenContextEntry = [string /* context */, DesignTokensCollection];

/* EXTRACT */

export interface ExtractDesignTokenModifiersOptions {
  readonly sourceDirectories: Iterable<string>;
  readonly baseCollection: DesignTokensCollection;
}

export async function extractDesignTokenModifiers({
  baseCollection,
  sourceDirectories,
}: ExtractDesignTokenModifiersOptions): Promise<DesignTokenModifiers> {
  const modifiers: DesignTokenModifiers = new Map();

  for (const sourceDirectory of sourceDirectories) {
    for await (const modifierDir of await opendir(sourceDirectory)) {
      if (!modifierDir.isDirectory()) {
        throw new Error(`Expected directory, got file: ${modifierDir.name}`);
      }

      const modifier: string = basename(modifierDir.name, '.tokens.json');

      const contexts: DesignTokenContexts = mapGetOrInsertComputed(
        modifiers,
        modifier,
        (): DesignTokenContexts => new Map<string, DesignTokensCollection>(),
      );

      for await (const contextEntry of glob(`${sourceDirectory}/${modifier}/*.tokens.json`)) {
        const context: string = basename(contextEntry, '.tokens.json');

        if (contexts.has(context)) {
          await contexts.get(context)!.fromFiles([contextEntry]);
        } else {
          contexts.set(
            context,
            await baseCollection
              .clone()
              // NOTE: this line ensures that the modifier contains only existing tokens (present in t2 and t3)
              .fromFiles([contextEntry], { forEachTokenBehaviour: 'prevent-new-token' }),
          );
        }
      }
    }
  }

  return modifiers;
}
