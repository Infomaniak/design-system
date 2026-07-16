import { join } from 'node:path';
import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { mapGetOrInsert } from '../../../../../../../../../scripts/helpers/misc/map/upsert.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { getTokenCategory } from '../../../../../../shared/dtcg/resolver/to/markdown/token-category.ts';
import type { MarkdownRenderContext } from '../../../../../../shared/dtcg/resolver/to/markdown/token/markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../../../../../shared/dtcg/resolver/to/markdown/token/markdown-token-row.ts';
import { borderWidthDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/border-width/border-width-design-tokens-collection-token-to-markdown.ts';
import { breakpointDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/breakpoint/breakpoint-design-tokens-collection-token-to-markdown.ts';
import { colorDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/color/color-design-tokens-collection-token-to-markdown.ts';
import { dimensionDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/dimension/dimension-design-tokens-collection-token-to-markdown.ts';
import { fontFamilyDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/font-family/font-family-design-tokens-collection-token-to-markdown.ts';
import { fontSizeDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/font-size/font-size-design-tokens-collection-token-to-markdown.ts';
import { fontWeightDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/font-weight/font-weight-design-tokens-collection-token-to-markdown.ts';
import { letterSpacingDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/letter-spacing/letter-spacing-design-tokens-collection-token-to-markdown.ts';
import { lineHeightDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/line-height/line-height-design-tokens-collection-token-to-markdown.ts';
import { numberDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/number/number-design-tokens-collection-token-to-markdown.ts';
import { opacityDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/opacity/opacity-design-tokens-collection-token-to-markdown.ts';
import { radiusDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/radius/radius-design-tokens-collection-token-to-markdown.ts';
import { shadowDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/shadow/shadow-design-tokens-collection-token-to-markdown.ts';
import { typographyDesignTokensCollectionTokenToMarkdown } from '../../../../../../shared/dtcg/resolver/to/markdown/token/types/typography/typography-design-tokens-collection-token-to-markdown.ts';
import { getTailwindClass } from '../../../../../../shared/dtcg/resolver/to/tailwind/get-tailwind-class.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericDesignTokensCollectionTokenWithType,
} from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isDesignTokensCollectionTokenWithType } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';
import { isDimensionDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/dimension/is-dimension-design-tokens-collection-token.ts';
import { isFontFamilyDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/font-family/is-font-family-design-tokens-collection-token.ts';
import { isFontWeightDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/font-weight/is-font-weight-design-tokens-collection-token.ts';
import { isNumberDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/number/is-number-design-tokens-collection-token.ts';
import { isShadowDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/composite/shadow/is-shadow-design-tokens-collection-token.ts';
import { isTypographyDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/composite/typography/is-typography-design-tokens-collection-token.ts';
import {
  MATERIAL_DIRECTORY_NAME,
  T1_DIRECTORY_NAME,
  T2_DIRECTORY_NAME,
  T3_DIRECTORY_NAME,
} from '../../../constants/design-token-tiers.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header.ts';

/**
 * Normalizes HTML string by removing newlines and extra whitespace
 * to ensure clean rendering in markdown tables.
 */
function normalizeHtml(html: string): string {
  return html.replace(/\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Extracts the "group prefix" from a file path.
 */
function getTokenGroupPrefix(filePath: string): string {
  const path = filePath.toLowerCase();
  if (path.includes(`/${T1_DIRECTORY_NAME}/`)) return 't1';
  if (path.includes(`/${T2_DIRECTORY_NAME}/`)) return 't2';
  if (path.includes(`/${T3_DIRECTORY_NAME}/`)) return 't3';
  if (path.includes(`/${MATERIAL_DIRECTORY_NAME}/`)) return 'material';

  throw new Error("Unable to determine token's group.");
}

export interface BuildMarkdownTokensOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly modifiers: DesignTokenModifiers;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

interface TokenGroup {
  readonly tierPrefix: string;
  readonly category: string;
  readonly tokens: GenericDesignTokensCollectionToken[];
}

/**
 * Groups tokens by their tier (t1, t2, t3) and semantic category
 */
function groupTokensByTierAndCategory(
  tokens: IteratorObject<GenericDesignTokensCollectionToken>,
): Map<string, TokenGroup> {
  const groups = new Map<string, TokenGroup>();

  for (const token of tokens) {
    // Skip tokens without a type (they are references to other tokens)
    if (!isDesignTokensCollectionTokenWithType(token)) {
      continue;
    }

    if (token.files.length === 0) {
      throw new Error('Unexpected empty token.files');
    }

    const firstTokenFilePath: string = token.files[0];

    const groupPrefix: string = getTokenGroupPrefix(firstTokenFilePath);
    const category = getTokenCategory(firstTokenFilePath);
    const key = `${groupPrefix}-${category}`;

    const group = mapGetOrInsert(groups, key, { tierPrefix: groupPrefix, category, tokens: [] });
    group.tokens.push(token);
  }

  return groups;
}

/**
 * Renders a single token to a markdown table row using the appropriate renderer
 */
export function renderTokenToRow(
  token: GenericDesignTokensCollectionToken,
  context: MarkdownRenderContext,
): MarkdownTokenRow | undefined {
  const tokenWithType: GenericDesignTokensCollectionTokenWithType = {
    ...token,
    type: context.collection.resolve(token).type,
  };

  const row = ((): MarkdownTokenRow | undefined => {
    if (isColorDesignTokensCollectionToken(tokenWithType)) {
      return colorDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
    }

    if (isDimensionDesignTokensCollectionToken(tokenWithType)) {
      // Special handling for radius tokens - show as boxes with border-radius applied
      if (tokenWithType.name[0] === 'radius') {
        return radiusDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
      }
      // Special handling for border-width tokens - show as boxes with border applied
      // Matches both T1 (border-width.0) and T2 (border.xs.width) naming patterns
      if (
        tokenWithType.name[0] === 'border-width' ||
        (tokenWithType.name[0] === 'border' &&
          tokenWithType.name[tokenWithType.name.length - 1] === 'width')
      ) {
        return borderWidthDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
      }
      // Special handling for breakpoint tokens - show value as text (too large to visualize)
      if (tokenWithType.name[0] === 'breakpoint') {
        return breakpointDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
      }
      // Font-size tokens - show sample text with font-size applied
      if (tokenWithType.name[0] === 'font' && tokenWithType.name[1] === 'size') {
        return fontSizeDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
      }
      // Letter-spacing tokens - show sample text with letter-spacing applied
      if (tokenWithType.name[0] === 'font' && tokenWithType.name[1] === 'letter-spacing') {
        return letterSpacingDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
      }
      if (tokenWithType.name[0] === 'icon') {
        return dimensionDesignTokensCollectionTokenToMarkdown(tokenWithType, context, {
          previewHeight: 'auto',
        });
      }
      return dimensionDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
    }

    if (isShadowDesignTokensCollectionToken(tokenWithType)) {
      return shadowDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
    }

    if (isTypographyDesignTokensCollectionToken(tokenWithType)) {
      return typographyDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
    }

    if (isFontFamilyDesignTokensCollectionToken(tokenWithType)) {
      return fontFamilyDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
    }

    if (isFontWeightDesignTokensCollectionToken(tokenWithType)) {
      return fontWeightDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
    }

    if (isNumberDesignTokensCollectionToken(tokenWithType)) {
      // Special handling for opacity tokens - show with transparent grid preview
      if (tokenWithType.name[0] === 'opacity') {
        return opacityDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
      }
      // Line-height tokens - show multi-line text paired with corresponding font-size
      if (tokenWithType.name[0] === 'font' && tokenWithType.name[1] === 'line-height') {
        return lineHeightDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
      }
      return numberDesignTokensCollectionTokenToMarkdown(tokenWithType, context);
    }

    // Skip token types without meaningful visual previews
    return undefined;
  })();

  if (!row) {
    return undefined;
  }

  // Attach Tailwind class for T2/T3 tokens only
  if (context.tierPrefix === 't2' || context.tierPrefix === 't3') {
    return {
      ...row,
      tailwindClasses: getTailwindClass(token.name),
    };
  }

  return row;
}

/**
 * Generates HTML table column headers.
 * Uses a 2-column layout: Preview (20%) | Details (Token, CSS, Description)
 */
function generateColumnHeaders(): string[] {
  return [
    '<table class="token-table">',
    '  <thead>',
    '    <tr>',
    '      <th style="width: 20%;">Preview</th>',
    '      <th style="width: 80%;">Details</th>',
    '    </tr>',
    '  </thead>',
    '  <tbody>',
  ];
}

/**
 * Generates HTML table content for a row
 */
export function generateRowContent(row: MarkdownTokenRow): string {
  const { preview, name, cssVariable, description, tailwindClasses } = row;
  const normalizedPreview = normalizeHtml(preview);

  const tailwindRow = Array.isArray(tailwindClasses)
    ? `<div class="token-row">Tailwind: ${tailwindClasses.map((cls) => `<button class="token-value" data-clipboard="${cls}" type="button">${cls}</button>`).join(' ')}</div>`
    : '';

  return `    <tr>
      <td>${normalizedPreview}</td>
      <td>
        <div class="token-row">
          <button class="token-value" data-clipboard="${name}" type="button">${name}</button>
        </div>${
          row.name.startsWith('material')
            ? ''
            : `<div class="token-row">
                CSS: <button class="token-value" data-clipboard="var(${cssVariable})" type="button">var(${cssVariable})</button>
              </div>`
        }${tailwindRow}<div class="token-row token-description">${description}</div>
      </td>
    </tr>`;
}

/**
 * Generates the complete markdown content for a category
 */
function generateCategoryMarkdown(
  tokens: GenericDesignTokensCollectionToken[],
  context: MarkdownRenderContext,
  logger: Logger,
): string {
  const headerLines = generateColumnHeaders();
  const lines: string[] = [...headerLines];

  // Render each token to a table row
  for (const token of tokens) {
    try {
      const row = renderTokenToRow(token, context);
      if (row) {
        lines.push(generateRowContent(row));
      }
    } catch (error) {
      // Log error but continue with other tokens
      logger.warn(`Failed to render token ${token.name.join('.')}:`, error);
    }
  }

  lines.push('  </tbody>');
  lines.push('</table>');

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
  baseCollection,
  modifiers: _modifiers,
  outputDirectory,
  logger,
}: BuildMarkdownTokensOptions) {
  return logger.asyncTask('markdown', async (logger: Logger): Promise<void> => {
    // Group tokens by tier and category
    const tokensByTierAndCategory = groupTokensByTierAndCategory(baseCollection.tokens());

    // Generate markdown for each tier-category combination
    for (const [key, group] of tokensByTierAndCategory.entries()) {
      await logger.asyncTask(`category: ${key}`, async (): Promise<void> => {
        const groupContext: MarkdownRenderContext = {
          collection: baseCollection,
          tierPrefix: group.tierPrefix,
        };
        const markdownContent = generateCategoryMarkdown(group.tokens, groupContext, logger);
        const markdown = `<!-- ${AUTO_GENERATED_FILE_HEADER} -->\n\n` + markdownContent;
        const filePath = join(outputDirectory, 'markdown', `${key}.md`);
        await writeFileSafe(filePath, markdown, { encoding: 'utf-8' });
      });
    }
  });
}
