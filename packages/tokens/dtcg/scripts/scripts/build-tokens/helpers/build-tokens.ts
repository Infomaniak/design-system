import { glob } from 'node:fs/promises';
import { basename, dirname, relative } from 'node:path';
import { writeFileSafe } from '../../../../../../../scripts/helpers/file/write-file-safe.ts';
import { removeTrailingSlash } from '../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { CssVariableDeclaration } from '../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import { cssVariableDeclarationsToString } from '../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/css-variable-declarations-to-string.ts';
import { wrapCssVariableDeclarationsWithCssSelector } from '../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/wrap-css-variable-declarations-with-css-selector.ts';
import {
  designTokensCollectionTokenToCssVariableDeclaration,
  type DesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from '../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';
import { createCssVariableNameGenerator } from '../../../shared/dtcg/resolver/to/css/token/name/create-css-variable-name-generator.ts';
import type { GenericDesignTokensCollectionToken } from '../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';

export interface BuildTokensOptions {
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
}

export async function buildTokens({
  sourceDirectory,
  outputDirectory,
}: BuildTokensOptions): Promise<void> {
  sourceDirectory = removeTrailingSlash(sourceDirectory);
  outputDirectory = removeTrailingSlash(outputDirectory);

  const tiers: readonly string[] = ['t1-primitive', 't2-semantic', 't3-component'];

  const baseCollection: DesignTokensCollection = await new DesignTokensCollection().fromFiles(
    tiers.map((tier: string): string => `${sourceDirectory}/base/${tier}/**/*.tokens.json`),
  );

  const cssOptions: DesignTokensCollectionTokenToCssVariableDeclarationOptions = {
    generateCssVariableName: createCssVariableNameGenerator('ikds'),
  };

  for await (const entry of glob(`${sourceDirectory}/themes/**/*.tokens.json`)) {
    const relativePath: string = relative(`${sourceDirectory}/themes`, dirname(entry));
    const name: string = basename(entry, '.tokens.json');
    const isPatch: boolean = name.endsWith('.patch');
    const attributeName: string = isPatch ? name.slice(0, -'.patch'.length) : name;

    const fileHeader = `/*\n  Do not edit directly, this file was auto-generated.${isPatch ? '\n  This is a "patch" file: it requires "base" themes to works properly.' : ''}\n*/\n\n`;

    const collection: DesignTokensCollection = await baseCollection.clone().fromFiles([entry]);

    let tokens: readonly GenericDesignTokensCollectionToken[] = collection.getMergedTokens();

    if (isPatch) {
      tokens = tokens.filter((token: GenericDesignTokensCollectionToken): boolean => {
        return token.files.some((path: string): boolean => path.includes('.patch'));
      });
    }

    // CSS
    const cssVariables: string = cssVariableDeclarationsToString(
      tokens.map((token: GenericDesignTokensCollectionToken): CssVariableDeclaration => {
        return designTokensCollectionTokenToCssVariableDeclaration(
          {
            ...token,
            type: collection.resolve(token).type,
          },
          cssOptions,
        );
      }),
    );

    await Promise.all([
      writeFileSafe(
        `${outputDirectory}/css/${relativePath}/${name}.css`,
        wrapCssVariableDeclarationsWithCssSelector(cssVariables, ':root, :host', fileHeader),
        {
          encoding: 'utf-8',
        },
      ),
      writeFileSafe(
        `${outputDirectory}/css/${relativePath}/${name}.attr.css`,
        wrapCssVariableDeclarationsWithCssSelector(
          cssVariables,
          `[data-theme="${attributeName}"],\n[data-variant="${attributeName}"]`,
          fileHeader,
        ),
        {
          encoding: 'utf-8',
        },
      ),
    ]);
  }
}
