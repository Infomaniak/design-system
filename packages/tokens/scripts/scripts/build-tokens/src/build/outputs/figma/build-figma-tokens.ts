import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { isDesignToken } from '../../../../../../shared/dtcg/design-token/token/is-design-token.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { designTokensCollectionTokenToFigmaDesignTokensTree } from '../../../../../../shared/dtcg/resolver/to/figma/dtcg/token/design-tokens-collection-token-to-figma-design-tokens-tree.ts';
import type { FigmaDesignTokensGroup } from '../../../../../../shared/dtcg/resolver/to/figma/figma/group/figma-design-tokens-group.ts';
import type { FigmaDesignTokensTree } from '../../../../../../shared/dtcg/resolver/to/figma/figma/tree/figma-design-tokens-tree.ts';
import type { ArrayDesignTokenName } from '../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import {
  mergeFigmaDesignTokensTreesAsModes,
  type NamedFigmaTokens,
} from '../../../../../../shared/figma/merge/merge-figma-design-tokens-trees-as-modes.ts';
import {
  DESIGN_TOKEN_TIERS,
  T1_DIRECTORY_NAME,
  T2_DIRECTORY_NAME,
  T3_DIRECTORY_NAME,
} from '../../../constants/design-token-tiers.ts';

export interface BuildFigmaTokensOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly modifiers: DesignTokenModifiers;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export function buildFigmaTokens({
  baseCollection,
  modifiers,
  outputDirectory,
  logger,
}: BuildFigmaTokensOptions): Promise<void> {
  return logger.asyncTask('figma', async (): Promise<void> => {
    const t1FigmaCollectionName: string = 't1';
    const t2FigmaCollectionName: string = 't2';
    const t3FigmaCollectionName: string = 'Themes';

    // 1) group tokens by tiers (primitive, semantic, component)
    const figmaBaseCollection: DesignTokensCollection = baseCollection.clone();

    for (const token of baseCollection.tokens()) {
      const tier: string | undefined = DESIGN_TOKEN_TIERS.find((tier: string): boolean => {
        return token.files.some((path: string): boolean => path.includes(tier));
      });

      let newTokenName: ArrayDesignTokenName;

      if (tier === T1_DIRECTORY_NAME) {
        newTokenName = [t1FigmaCollectionName, ...token.name];
      } else if (tier === T2_DIRECTORY_NAME) {
        newTokenName = [t2FigmaCollectionName, ...token.name];
      } else if (tier === T3_DIRECTORY_NAME) {
        newTokenName = [t3FigmaCollectionName, ...token.name];
      } else {
        throw new Error(
          `Token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} does not belong to a tier.`,
        );
      }

      figmaBaseCollection.rename(token.name, newTokenName);

      for (const contexts of modifiers.values()) {
        for (const contextCollection of contexts.values()) {
          contextCollection.rename(token.name, newTokenName);
        }
      }
    }

    // 2) create figma tokens
    const figmaTokens: FigmaDesignTokensGroup = {};

    const insertFigmaDesignTokensTree = (
      figmaTokens: FigmaDesignTokensGroup,
      name: ArrayDesignTokenName,
      value: FigmaDesignTokensTree,
    ): void => {
      if (name.length === 0) {
        throw new Error('Cannot set property on root');
      }

      let node: any = figmaTokens;

      for (let i: number = 0; i < name.length; i++) {
        const segment: PropertyKey = name[i];

        if (isDesignToken(node)) {
          const $root: any = { ...node };
          for (const key of Object.keys(node)) {
            Reflect.deleteProperty(node, key);
          }
          Reflect.set(node, 'root', $root);
        }

        if (i === name.length - 1) {
          Reflect.set(node, segment, value);
        } else {
          if (Reflect.has(node, segment)) {
            node = Reflect.get(node, segment);
          } else {
            const next: any = {};
            Reflect.set(node, segment, next);
            node = next;
          }
        }
      }
    };

    // 2.1) t1-primitive -> t1 tokens contain all the values, thus, they don't have alternative modes.
    for (const token of figmaBaseCollection.tokens()) {
      if (token.name.at(0) === t1FigmaCollectionName) {
        insertFigmaDesignTokensTree(
          figmaTokens,
          token.name,
          designTokensCollectionTokenToFigmaDesignTokensTree(
            token,
            figmaBaseCollection.resolve(token),
          ),
        );
      }
    }

    // 2.2) t2-semantic -> t2 tokens contain themes; thus, they need to be merged (as modes).
    Object.assign(
      figmaTokens,
      mergeFigmaDesignTokensTreesAsModes(
        Array.from(modifiers.get('theme')!.entries()).map(
          ([themeName, themeCollection]: [string, DesignTokensCollection]): NamedFigmaTokens => {
            const figmaTokens: FigmaDesignTokensGroup = {};

            for (const token of themeCollection.tokens()) {
              if (token.name.at(0) === t2FigmaCollectionName) {
                insertFigmaDesignTokensTree(
                  figmaTokens,
                  token.name,
                  designTokensCollectionTokenToFigmaDesignTokensTree(
                    token,
                    figmaBaseCollection.resolve(token),
                  ),
                );
              }
            }

            return [themeName, figmaTokens];
          },
        ),
      ),
    );

    // TODO: implement when we work on t3 tokens
    // // 2.3) t3-component -> t3 tokens contain variants; thus, they need to be merged (as modes).
    // Object.assign(
    //   figmaTokens,
    //   mergeFigmaDesignTokensTreesAsModes(
    //     DESIGN_TOKEN_VARIANTS.map((variant: string): NamedFigmaTokens => {
    //       const figmaTokens: FigmaDesignTokensGroup = {};
    //
    //       for (const token of figmaBaseCollection.tokens()) {
    //         if (token.name.at(0) === t3FigmaCollectionName) {
    //           insertFigmaDesignTokensTree(
    //             token.name,
    //             designTokensCollectionTokenToFigmaDesignTokensTree(
    //               {
    //                 ...token,
    //                 value: getTokenValueByVariant(token, variant) ?? token.value,
    //               },
    //               figmaBaseCollection.resolve(token),
    //             ),
    //           );
    //         }
    //       }
    //
    //       return [variant, figmaTokens];
    //     }),
    //   ),
    // );

    // 3) write figma tokens to file
    await writeFileSafe(
      `${outputDirectory}/figma.tokens.json`,
      JSON.stringify(figmaTokens, null, 2),
    );
  });
}
