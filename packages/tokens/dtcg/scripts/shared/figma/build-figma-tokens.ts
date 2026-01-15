import { writeFile } from 'node:fs/promises';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { DesignTokensGroup } from '../dtcg/design-token/group/design-tokens-group.ts';
import { isDesignTokenReference } from '../dtcg/design-token/reference/is-design-token-reference.ts';
import { designTokenReferenceToSegmentsReference } from '../dtcg/design-token/reference/to/segments-reference/design-token-reference-to-segments-reference.ts';
import { isCurlyReference } from '../dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { hasExistingSegmentsReference } from '../dtcg/design-token/reference/types/segments/resolve/has-existing-segments-reference.ts';
import type { SegmentsReference } from '../dtcg/design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../dtcg/design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import { segmentsReferenceToJsonReference } from '../dtcg/design-token/reference/types/segments/to/json-reference/segments-reference-to-json-reference.ts';
import { segmentsReferenceToString } from '../dtcg/design-token/reference/types/segments/to/string/segments-reference-to-string.ts';
import type { DesignTokensTree } from '../dtcg/design-token/tree/design-tokens-tree.ts';
import { mergeDesignTokenFiles } from '../dtcg/operations/merge/merge-design-token-files.ts';
import { designTokenTreeToFigmaFormat } from '../dtcg/to/figma/design-token-tree-to-figma-format.ts';

export interface BuildFigmaTokensOptions {
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
}

export async function buildFigmaTokens({
  sourceDirectory,
  outputDirectory,
}: BuildFigmaTokensOptions): Promise<void> {
  sourceDirectory = removeTrailingSlash(sourceDirectory);
  outputDirectory = removeTrailingSlash(outputDirectory);

  const tiers: readonly string[] = ['t1-primitive', 't2-semantic', 't3-component'];

  function fixReferences<GValue>(value: GValue, root: unknown): GValue {
    if (isDesignTokenReference(value)) {
      const reference: SegmentsReference = designTokenReferenceToSegmentsReference(value);

      for (const tier of tiers) {
        const targetReference: SegmentsReference = [tier, ...reference];
        if (hasExistingSegmentsReference(targetReference, root)) {
          return (
            isCurlyReference(value)
              ? segmentsReferenceToCurlyReference(targetReference)
              : segmentsReferenceToJsonReference(targetReference)
          ) as GValue;
        }
      }
      throw new Error(`No token found for reference "${segmentsReferenceToString(reference)}".`);
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item: unknown): unknown => {
          return fixReferences(item, root);
        }) as GValue;
      } else {
        return Object.fromEntries(
          Object.entries(value).map(([key, value]): [string, unknown] => {
            return [key, fixReferences(value, root)];
          }),
        ) as GValue;
      }
    } else {
      return value;
    }
  }

  let tokens: DesignTokensTree = Object.fromEntries(
    await Promise.all(
      tiers.map(async (tier: string): Promise<[string, DesignTokensTree]> => {
        return [
          tier,
          await mergeDesignTokenFiles([`${sourceDirectory}/base/${tier}/**/*.tokens.json`]),
        ];
      }),
    ),
  );

  tokens = fixReferences(tokens, tokens);

  const figmaTokens: DesignTokensGroup = designTokenTreeToFigmaFormat(tokens, {
    root: tokens,
  });

  const content: string = JSON.stringify(figmaTokens, null, 2);

  await writeFile(`${outputDirectory}/figma.json`, content);

  // for await (const entry of glob(`${sourceDirectory}/themes/**/*.tokens.json`)) {
  //   const tokens: any = JSON.parse(
  //     await readFile(entry, {
  //       encoding: 'utf-8',
  //     }),
  //   );
  //
  //   allTokens = mergeDesignTokens(allTokens, tokens);
  // }

  // console.log(allTokens);
}
