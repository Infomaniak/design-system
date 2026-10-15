import { loremIpsumRule } from './lorem-ipsum.ts';
import type { LintRule } from './rule.ts';

/**
 * THE only rule registration point: adding a rule = one file in `core/rules/`
 * + one line here.
 */
export const LINT_RULES: readonly LintRule[] = [loremIpsumRule];
