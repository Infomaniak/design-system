import { join } from 'node:path';
import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import { getTokenCategory } from '../../../../../../shared/dtcg/resolver/to/markdown/token-category.ts';
import type { MarkdownRenderContext } from '../../../../../../shared/dtcg/resolver/to/markdown/token/markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../../../../../shared/dtcg/resolver/to/markdown/token/markdown-token-row.ts';
import { borderWidthDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/border-width/border-width-design-tokens-collection-token-to-markdown.ts';
import { breakpointDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/breakpoint/breakpoint-design-tokens-collection-token-to-markdown.ts';
import { colorDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/color/color-design-tokens-collection-token-to-markdown.ts';
import { dimensionDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/dimension/dimension-design-tokens-collection-token-to-markdown.ts';
import { fontFamilyDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/font-family/font-family-design-tokens-collection-token-to-markdown.ts';
import { fontWeightDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/font-weight/font-weight-design-tokens-collection-token-to-markdown.ts';
import { genericDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/generic/generic-design-tokens-collection-token-to-markdown.ts';
import { numberDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/number/number-design-tokens-collection-token-to-markdown.ts';
import { opacityDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/opacity/opacity-design-tokens-collection-token-to-markdown.ts';
import { radiusDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/radius/radius-design-tokens-collection-token-to-markdown.ts';
import { shadowDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/shadow/shadow-design-tokens-collection-token-to-markdown.ts';
import { typographyDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/typography/typography-design-tokens-collection-token-to-markdown.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isDesignTokensCollectionTokenWithType } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';
import { isDimensionDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/dimension/is-dimension-design-tokens-collection-token.ts';
import { isFontFamilyDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/font-family/is-font-family-design-tokens-collection-token.ts';
import { isFontWeightDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/font-weight/is-font-weight-design-tokens-collection-token.ts';
import { isNumberDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/number/is-number-design-tokens-collection-token.ts';
import { isShadowDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/composite/shadow/is-shadow-design-tokens-collection-token.ts';
import { isTypographyDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/composite/typography/is-typography-design-tokens-collection-token.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header .ts';

export interface BuildMarkdownTokensOptions {
  readonly collection: DesignTokensCollection;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

/**
 * Groups tokens by their semantic category (first segment of token name)
 */
function groupTokensByCategory(
  tokens: IteratorObject<GenericDesignTokensCollectionToken>,
): Map<string, GenericDesignTokensCollectionToken[]> {
  const groups = new Map<string, GenericDesignTokensCollectionToken[]>();

  for (const token of tokens) {
    // Skip tokens without a type (they are references to other tokens)
    if (!isDesignTokensCollectionTokenWithType(token)) {
      continue;
    }

    const category = getTokenCategory(token.name);

    if (!groups.has(category)) {
      groups.set(category, []);
    }

    groups.get(category)!.push(token);
  }

  return groups;
}

/**
 * Renders a single token to a markdown table row using the appropriate renderer
 */
function renderTokenToRow(
  token: GenericDesignTokensCollectionToken,
  context: MarkdownRenderContext,
): MarkdownTokenRow | null {
  // Only render tokens with a type
  if (!isDesignTokensCollectionTokenWithType(token)) {
    return null;
  }

  // Select the appropriate renderer based on token type
  if (isColorDesignTokensCollectionToken(token)) {
    return colorDesignTokensCollectionTokenToMarkdown(token, context);
  }

  if (isDimensionDesignTokensCollectionToken(token)) {
    // Special handling for radius tokens - show as boxes with border-radius applied
    if (token.name[0] === 'radius') {
      return radiusDesignTokensCollectionTokenToMarkdown(token, context);
    }
    // Special handling for border-width tokens - show as boxes with border applied
    if (token.name[0] === 'border-width') {
      return borderWidthDesignTokensCollectionTokenToMarkdown(token, context);
    }
    // Special handling for breakpoint tokens - show value as text (too large to visualize)
    if (token.name[0] === 'breakpoint') {
      return breakpointDesignTokensCollectionTokenToMarkdown(token, context);
    }
    return dimensionDesignTokensCollectionTokenToMarkdown(token, context);
  }

  if (isShadowDesignTokensCollectionToken(token)) {
    return shadowDesignTokensCollectionTokenToMarkdown(token, context);
  }

  if (isTypographyDesignTokensCollectionToken(token)) {
    return typographyDesignTokensCollectionTokenToMarkdown(token, context);
  }

  if (isFontFamilyDesignTokensCollectionToken(token)) {
    return fontFamilyDesignTokensCollectionTokenToMarkdown(token, context);
  }

  if (isFontWeightDesignTokensCollectionToken(token)) {
    return fontWeightDesignTokensCollectionTokenToMarkdown(token, context);
  }

  if (isNumberDesignTokensCollectionToken(token)) {
    // Special handling for opacity tokens - show with transparent grid preview
    if (token.name[0] === 'opacity') {
      return opacityDesignTokensCollectionTokenToMarkdown(token, context);
    }
    return numberDesignTokensCollectionTokenToMarkdown(token, context);
  }

  // Fallback to generic renderer for any other type
  return genericDesignTokensCollectionTokenToMarkdown(token, context);
}

/**
 * Generates markdown table column headers based on the token types in the category
 */
function generateColumnHeaders(category: string): string[] {
  // Most categories use Preview, Name, Description
  // Font category shows type since it mixes multiple token types
  if (category === 'font') {
    return ['| Preview | Name | Type | Description |', '|---------|------|------|-------------|'];
  }

  return ['| Preview | Name | Description |', '|---------|------|-------------|'];
}

/**
 * Generates markdown table content for a row
 */
function generateRowContent(row: MarkdownTokenRow, showType: boolean, tokenType?: string): string {
  const { preview, name, description } = row;

  if (showType && tokenType) {
    return `| ${preview} | \`${name}\` | ${tokenType} | ${description} |`;
  }

  return `| ${preview} | \`${name}\` | ${description} |`;
}

/**
 * Generates the complete markdown content for a category
 */
function generateCategoryMarkdown(
  category: string,
  tokens: GenericDesignTokensCollectionToken[],
  context: MarkdownRenderContext,
): string {
  const [headerRow, separatorRow] = generateColumnHeaders(category);
  const showType = category === 'font';
  const lines: string[] = [headerRow, separatorRow];

  // Render each token to a table row
  for (const token of tokens) {
    try {
      const row = renderTokenToRow(token, context);

      if (row) {
        const tokenType = isDesignTokensCollectionTokenWithType(token) ? token.type : undefined;
        lines.push(generateRowContent(row, showType, tokenType));
      }
    } catch (error) {
      // Log error but continue with other tokens
      console.warn(`Failed to render token ${token.name.join('.')}:`, error);
    }
  }

  return lines.join('\n');
}

/**
 * Builds markdown documentation files for all design tokens in the collection.
 *
 * This function groups tokens by their semantic category (e.g., colors, spacing, font),
 * renders each token with an appropriate visual preview, and generates a markdown
 * table documentation file for each category.
 *
 * Output files are written to {outputDirectory}/markdown/{category}.md
 *
 * @param options - Build options including the token collection, output directory, and logger
 */
export async function buildMarkdownTokens({
  collection,
  outputDirectory,
  logger,
}: BuildMarkdownTokensOptions) {
  return logger.asyncTask('markdown', async (): Promise<void> => {
    const context: MarkdownRenderContext = { collection };

    // Group tokens by category
    const tokensByCategory = groupTokensByCategory(collection.tokens());

    // Generate markdown for each category
    for (const [category, tokens] of tokensByCategory.entries()) {
      await logger.asyncTask(`category: ${category}`, async (): Promise<void> => {
        const markdownContent = generateCategoryMarkdown(category, tokens, context);
        const markdown = `<!-- ${AUTO_GENERATED_FILE_HEADER} -->\n\n` + markdownContent;
        const filePath = join(outputDirectory, 'markdown', `${category}.md`);
        await writeFileSafe(filePath, markdown, { encoding: 'utf-8' });
      });
    }
  });
}
