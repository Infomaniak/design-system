import { join } from 'node:path';
import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { createCssVariableNameGenerator } from '../../../../../../shared/dtcg/resolver/to/css/token/name/create-css-variable-name-generator.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isDesignTokensCollectionTokenWithType } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import {
  T1_DIRECTORY_NAME,
  T2_DIRECTORY_NAME,
  T3_DIRECTORY_NAME,
} from '../../../constants/design-token-tiers.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header.ts';
import { resolvedTokenToString, resolvedTokenToYamlValue } from './token-to-yaml-value.ts';

export interface BuildDesignMdTokensOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly modifiers: DesignTokenModifiers;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

/**
 * Generates a single DESIGN.md reference file containing all resolved
 * design tokens. The file shows the default product values and instructs
 * downstream AI agents to always use portable semantic token names so
 * that the same component code works across all products.
 */
export async function buildDesignMdTokens({
  baseCollection,
  modifiers,
  outputDirectory,
  logger,
}: BuildDesignMdTokensOptions): Promise<void> {
  return logger.asyncTask('design-md', async (logger: Logger): Promise<void> => {
    const designMdOutputDirectory = join(outputDirectory, 'design-md');

    const themeBaselines = new Map<string, DesignTokensCollection>();
    for (const [modifier, contexts] of modifiers) {
      if (modifier === 'theme') {
        for (const [theme, collection] of contexts) {
          themeBaselines.set(theme, collection);
        }
      }
    }

    const lightCollection = themeBaselines.get('light');
    const darkCollection = themeBaselines.get('dark');

    if (!lightCollection || !darkCollection) {
      logger.warn('Missing light or dark theme baseline; skipping DESIGN.md generation');
      return;
    }

    const generateCssVariableName = createCssVariableNameGenerator({
      prefix: 'esds',
    });

    const content = generateDesignMdContent({
      lightCollection,
      darkCollection,
      baseCollection,
      generateCssVariableName,
    });

    await writeFileSafe(join(designMdOutputDirectory, 'DESIGN.md'), content, {
      encoding: 'utf-8',
    });
  });
}

/*-- YAML SERIALISER --*/

interface YamlBlock {
  readonly lines: string[];
  readonly isSequence: boolean;
}

export function toYamlBlock(value: unknown, indent = 0): YamlBlock {
  const spaces = ' '.repeat(indent);

  if (value === null || value === undefined) {
    return { lines: ['null'], isSequence: false };
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return { lines: [String(value)], isSequence: false };
  }

  if (typeof value === 'string') {
    return { lines: [`"${value.replace(/"/g, '\\"')}"`], isSequence: false };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { lines: [`${spaces}[]`], isSequence: false };
    }

    const lines: string[] = [];
    for (const item of value) {
      const itemBlock = toYamlBlock(item, indent + 2);
      for (let i = 0; i < itemBlock.lines.length; i++) {
        if (i === 0) {
          lines.push(`${spaces}- ${itemBlock.lines[i].trimStart()}`);
        } else {
          lines.push(itemBlock.lines[i]);
        }
      }
    }
    return { lines, isSequence: true };
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);

    if (entries.length === 0) {
      return { lines: [`${spaces}{}`], isSequence: false };
    }

    const lines: string[] = [];
    for (const [key, val] of entries) {
      const valBlock = toYamlBlock(val, indent + 2);
      if (valBlock.isSequence) {
        lines.push(`${spaces}${key}:`);
        lines.push(...valBlock.lines);
      } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        lines.push(`${spaces}${key}:`);
        lines.push(...valBlock.lines);
      } else if (valBlock.lines.length === 1) {
        lines.push(`${spaces}${key}: ${valBlock.lines[0].trimStart()}`);
      } else {
        lines.push(`${spaces}${key}:`);
        lines.push(...valBlock.lines);
      }
    }
    return { lines, isSequence: false };
  }

  return { lines: [`${spaces}${String(value)}`], isSequence: false };
}

export function toYaml(value: unknown, indent = 0): string {
  return toYamlBlock(value, indent).lines.join('\n');
}

/*-- CONTENT GENERATION --*/

interface DesignContentOptions {
  readonly lightCollection: DesignTokensCollection;
  readonly darkCollection: DesignTokensCollection;
  readonly baseCollection: DesignTokensCollection;
  readonly generateCssVariableName: (name: string[]) => string;
}

function generateDesignMdContent({
  lightCollection,
  darkCollection,
  baseCollection,
  generateCssVariableName,
}: DesignContentOptions): string {
  /* YAML FRONT MATTER */
  const yamlTree: Record<string, unknown> = {};

  for (const token of baseCollection.tokens()) {
    if (!isDesignTokensCollectionTokenWithType(token)) {
      continue;
    }

    if (token.name.length === 0) {
      continue;
    }

    const tier = getTierFromToken(token);
    if (tier === 't1') {
      continue;
    }

    const resolvedLight = lightCollection.resolve(lightCollection.get(token.name));
    const resolvedDark = darkCollection.resolve(darkCollection.get(token.name));

    const lightYamlValue = resolvedTokenToYamlValue(lightCollection, resolvedLight);
    const darkYamlValue = resolvedTokenToYamlValue(darkCollection, resolvedDark);

    const yamlName = token.name[0] === 'color' ? ['colors', ...token.name.slice(1)] : token.name;

    if (JSON.stringify(lightYamlValue) !== JSON.stringify(darkYamlValue)) {
      setDeep(yamlTree, [...yamlName], {
        light: lightYamlValue,
        dark: darkYamlValue,
      });
    } else {
      setDeep(yamlTree, [...yamlName], lightYamlValue);
    }
  }

  const yamlContent = toYaml(yamlTree, 0);

  /* TIER GROUPING */
  const t2Tokens: GenericDesignTokensCollectionToken[] = [];
  const t3Tokens: GenericDesignTokensCollectionToken[] = [];

  for (const token of baseCollection.tokens()) {
    const tier = getTierFromToken(token);
    if (tier === 't2') {
      t2Tokens.push(token);
    } else if (tier === 't3') {
      t3Tokens.push(token);
    }
  }

  /* MARKDOWN TABLES */
  const t2Table = buildTierTable(
    t2Tokens,
    lightCollection,
    darkCollection,
    generateCssVariableName,
    {
      tier: 't2',
    },
  );
  const t3Table =
    t3Tokens.length > 0
      ? buildTierTable(t3Tokens, lightCollection, darkCollection, generateCssVariableName, {
          tier: 't3',
        })
      : '';

  /* STATIC CONTENT */
  const systemOverview = `This design tokens reference is part of the Infomaniak Design System. It contains the default resolved token values for the design system, accounting for light and dark theme variants. Use this file as the definitive reference when building UI components. The values shown represent the default product; when building for a specific product (calendar, mail, swisstransfer, etc.), the build system automatically resolves the same token names to the correct product-specific colors.`;

  const aiDirectives = `
- **Always use CSS variables** in implementation. Never hard-code hex or dimension values.
- **Prefer Tier 2 (Semantic) tokens** for all component styling. Only use Tier 3 (Component) tokens when they explicitly exist for the element you are building.
- **Never reference Tier 1 (Primitive) tokens directly** in component code; they exist only for alias resolution and designer reference.
- **Theme awareness**: The design system supports \`light\` and \`dark\` modes. Use the \`data-esds-theme\` attribute or corresponding modifier CSS file to apply themes.
- **Portable product tokens**: When building components for a specific product (calendar, mail, swisstransfer, etc.), always use the token names exactly as shown in this file (e.g., \`color.background.brand.default\` with \`var(--esds-color-background-brand-default)\`). The build system automatically resolves these to the correct product-specific colors. **Never** use product-specific primitive names such as \`color.background.brand.calendar.default\` directly in component code. **Never** create separate component variants or branches per product when the same semantic token exists. All products share the same token API — only the resolved values differ.
`.trim();

  const parts = [
    `# ${AUTO_GENERATED_FILE_HEADER}`,
    '---',
    yamlContent,
    '---',
    '',
    `# Design Tokens Reference`,
    '',
    '## 1. System Overview',
    '',
    systemOverview,
    '',
    '## 2. Semantic Tokens (The Usage)',
    '',
    t2Table,
  ];

  if (t3Table) {
    parts.push('', '## 3. Component Tokens', '', t3Table);
  }

  parts.push('', '## 4. AI Implementation Directives', '', aiDirectives);

  return parts.join('\n');
}

/*-- TIER DETECTION --*/

function getTierFromToken(
  token: GenericDesignTokensCollectionToken,
): 't1' | 't2' | 't3' | undefined {
  if (token.files.some((path) => path.includes(`/${T1_DIRECTORY_NAME}/`))) {
    return 't1';
  }
  if (token.files.some((path) => path.includes(`/${T2_DIRECTORY_NAME}/`))) {
    return 't2';
  }
  if (token.files.some((path) => path.includes(`/${T3_DIRECTORY_NAME}/`))) {
    return 't3';
  }
  return undefined;
}

/*-- MARKDOWN TABLE BUILDER --*/

interface BuildTierTableOptions {
  readonly tier: 't2' | 't3';
}

function buildTierTable(
  tokens: GenericDesignTokensCollectionToken[],
  lightCollection: DesignTokensCollection,
  darkCollection: DesignTokensCollection,
  generateCssVariableName: (name: string[]) => string,
  _options: BuildTierTableOptions,
): string {
  const rows: string[] = [];

  rows.push('| Token Name | Light Value | Dark Value | CSS Variable | Description |');
  rows.push('|---|---|---|---|---|');

  for (const token of tokens) {
    const resolvedLight = lightCollection.resolve(lightCollection.get([...token.name]));
    const lightValue = resolvedTokenToString(lightCollection, resolvedLight);

    const resolvedDark = darkCollection.resolve(darkCollection.get([...token.name]));
    const darkValue = resolvedTokenToString(darkCollection, resolvedDark);
    rows.push(
      `| ${escapeMdCell(token.name.join('.'))} | ${escapeMdCell(lightValue)} | ${escapeMdCell(darkValue)} | ${escapeMdCell(`var(${generateCssVariableName([...token.name])})`)} | ${escapeMdCell(formatDescription(token))} |`,
    );
  }

  return rows.join('\n');
}

/*-- HELPER FUNCTIONS --*/

function setDeep(obj: Record<string, unknown>, path: string[], value: unknown): void {
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[path[path.length - 1]] = value;
}

function formatDescription(token: GenericDesignTokensCollectionToken): string {
  const parts: string[] = [];

  if (token.deprecated) {
    parts.push('⚠️ **Deprecated**');
  }

  if (token.description) {
    parts.push(token.description);
  }

  return parts.length > 0 ? parts.join(' — ') : 'N/A';
}

function escapeMdCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ').trim();
}
