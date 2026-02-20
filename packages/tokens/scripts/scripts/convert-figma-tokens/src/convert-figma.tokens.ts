import { readJsonFile } from '../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { mapGetOrInsertComputed } from '../../../../../../scripts/helpers/misc/map/upsert.ts';
import { isObject } from '../../../../../../scripts/helpers/misc/object/is-object.ts';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { CurlyReference } from '../../../shared/dtcg/design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../shared/dtcg/design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { SegmentsReference } from '../../../shared/dtcg/design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../shared/dtcg/design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type { DesignTokensTree } from '../../../shared/dtcg/design-token/tree/design-tokens-tree.ts';
import { removeDesignTokensTreeModes } from '../../../shared/dtcg/operations/pick-mode/remove-design-tokens-tree-modes.ts';
import { DesignTokensCollection } from '../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericResolvedDesignTokensCollectionToken,
} from '../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { updateDesignTokensCollectionTokenReferences } from '../../../shared/dtcg/resolver/token/update/update-design-tokens-collection-token-references.ts';
import { tokensBrueckeToDtcg } from '../../../shared/tokens-bruecke/to/dtcg/tokens-bruecke-to-dtcg.ts';
import { FIGMA_COLLECTION_NAMES_TO_DESIGN_TOKEN_TIERS } from '../../build-tokens/src/constants/design-token-tiers.ts';

export interface ConvertFigmaTokensOptions {
  readonly tokensPath: string;
  readonly outputDirectory: string;
}

export async function convertFigmaTokens({
  tokensPath,
  outputDirectory,
}: ConvertFigmaTokensOptions): Promise<void> {
  outputDirectory = removeTrailingSlash(outputDirectory);

  const root: DesignTokensTree = tokensBrueckeToDtcg(await readJsonFile(tokensPath));
  Reflect.deleteProperty(root, '$extensions');

  const rootCollection: DesignTokensCollection = new DesignTokensCollection().fromDesignTokensTree(
    root,
  );

  // replace `@root` segments
  for (const token of Array.from(rootCollection.tokens())) {
    if (token.name.includes('@root')) {
      rootCollection.rename(
        token.name,
        token.name.filter((namePart: string): boolean => namePart !== '@root'),
        {
          onExitingTokenBehaviour: 'throw',
        },
      );
    }
  }

  // replace `mode` modifier by `theme`
  for (const token of Array.from(rootCollection.tokens())) {
    if (token.name[0] === 'mode') {
      rootCollection.rename(token.name, ['theme', ...token.name.slice(1)], {
        onExitingTokenBehaviour: 'throw',
      });
    }
  }

  // the list of modifiers present in the Figma file
  const modifiers: Map<string /* modifier */, Set<string /* context */>> = new Map();

  // build the list of modifiers and contexts
  for (const token of rootCollection
    .tokens()
    .filter((token: GenericDesignTokensCollectionToken): boolean => {
      return !FIGMA_COLLECTION_NAMES_TO_DESIGN_TOKEN_TIERS.has(token.name[0]);
    })) {
    if (!isCurlyReference(token.value)) {
      throw new Error(
        `Expected token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} to be a curly reference.`,
      );
    }

    if (token.extensions === undefined || !isObject(token.extensions['mode'])) {
      throw new Error(
        `Expected token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} to have a $extensions with "mode".`,
      );
    }

    const contexts: Set<string> = mapGetOrInsertComputed(
      modifiers,
      token.name[0],
      (): Set<string> => new Set(),
    );

    for (const mode of Object.keys(token.extensions['mode'] as Record<string, unknown>)) {
      contexts.add(mode);
    }
  }

  // the "main" collection
  const mainCollection: DesignTokensCollection = rootCollection.clone();

  // fix t1, t2, t3 pointing on modifiers
  for (const token of rootCollection
    .tokens()
    .filter((token: GenericDesignTokensCollectionToken): boolean => {
      return FIGMA_COLLECTION_NAMES_TO_DESIGN_TOKEN_TIERS.has(token.name[0]);
    })) {
    const resolved: GenericResolvedDesignTokensCollectionToken = rootCollection.resolve(token);

    mainCollection.add(
      updateDesignTokensCollectionTokenReferences(
        token,
        (curlyReference: CurlyReference): CurlyReference => {
          const segmentsReference: SegmentsReference =
            curlyReferenceToSegmentsReference(curlyReference);

          if (modifiers.has(segmentsReference[0])) {
            for (let i: number = 1; i < resolved.trace.length; i++) {
              const name: ArrayDesignTokenName = resolved.trace[i];
              if (!modifiers.has(name[0])) {
                return segmentsReferenceToCurlyReference(name.slice(1));
              }
            }

            throw new Error(
              `Unable to resolve modifier: ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)}.`,
            );
          }

          return curlyReference;
        },
      ),
      {
        last: false,
        merge: false,
      },
    );
  }

  // remove the figma collections prefixes from the main collection
  for (const token of rootCollection.tokens()) {
    mainCollection.rename(token.name, token.name.slice(1), {
      onExitingTokenBehaviour: 'only-references',
    });
  }

  // NOTE: keep as an intermediate debug file
  // await writeJsonFileSafe(`${outputDirectory}/main.tokens.json`, mainCollection.toJSON());

  // generate modifier files
  for (const [modifier, contexts] of modifiers.entries()) {
    // extract only the list of tokens participating in the modifier
    const tokensOfTheModifier: readonly GenericDesignTokensCollectionToken[] = Array.from(
      mainCollection.tokens().filter((token: GenericDesignTokensCollectionToken): boolean => {
        return token.name[0] === modifier && hasTokenValidModes(token);
      }),
    );

    for (const context of contexts.values()) {
      // the main collection resolved with the specified context
      const subCollection: DesignTokensCollection = new DesignTokensCollection(
        tokensOfTheModifier.map(
          ({
            name,
            value,
            type,
            extensions,
            ...token
          }: GenericDesignTokensCollectionToken): GenericDesignTokensCollectionToken => {
            return {
              ...token,
              name: name.slice(1),
              value:
                (extensions?.['mode'] as Record<string, unknown> | undefined)?.[context] ?? value,
            };
          },
        ),
      );

      await writeJsonFileSafe(
        `${outputDirectory}/modifiers/${modifier}/${context}.tokens.json`,
        subCollection.toJSON(),
      );
    }
  }

  // generate t1, t2, t3 files
  for (const [figmaTier, tier] of FIGMA_COLLECTION_NAMES_TO_DESIGN_TOKEN_TIERS.entries()) {
    const subCollection = new DesignTokensCollection(
      mainCollection
        .tokens()
        .filter((token: GenericDesignTokensCollectionToken): boolean => {
          return token.name[0] === figmaTier;
        })
        .map(
          ({
            name,
            ...token
          }: GenericDesignTokensCollectionToken): GenericDesignTokensCollectionToken => {
            return {
              ...token,
              name: name.slice(1),
            };
          },
        ),
    );

    const tokensGroupedByNamespaceMap: Map<string, DesignTokensCollection> = new Map();

    for (const token of subCollection.tokens()) {
      const groupName: string = token.name[0];

      const tokensGroupedByNamespaceCollection: DesignTokensCollection = mapGetOrInsertComputed(
        tokensGroupedByNamespaceMap,
        groupName,
        (): DesignTokensCollection => new DesignTokensCollection(),
      );

      tokensGroupedByNamespaceCollection.add(token);
    }

    for (const [
      groupName,
      tokensGroupedByNamespaceCollection,
    ] of tokensGroupedByNamespaceMap.entries()) {
      await writeJsonFileSafe(
        `${outputDirectory}/${tier}/${groupName}.tokens.json`,
        removeDesignTokensTreeModes(tokensGroupedByNamespaceCollection.toJSON()),
      );
    }
  }
}

/* INTERNAL */

function hasTokenValidModes(token: GenericDesignTokensCollectionToken): boolean {
  if (token.extensions !== undefined && Reflect.has(token.extensions, 'mode')) {
    const mode = Reflect.get(token.extensions, 'mode') as Record<string, unknown>;

    const values: readonly unknown[] = Object.values(mode);

    if (
      values.length === 0 ||
      values.every((value: unknown): boolean => value === values[0]) /* all identical */
    ) {
      return false;
    }
  }

  return true;
}
