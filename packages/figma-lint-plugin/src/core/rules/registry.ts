import { primitiveMisuseRule } from './primitive-misuse.ts';
import type { LintRule } from './rule.ts';
import { unboundValueRule } from './unbound-value.ts';
import { unknownCollectionRule } from './unknown-collection.ts';
import { unresolvedBindingRule } from './unresolved-binding.ts';
import { wrongScopeRule } from './wrong-scope.ts';
import { wrongTokenRule } from './wrong-token.ts';

/**
 * THE only rule registration point: adding a rule = one file in `core/rules/`
 * + one line here.
 */
export const LINT_RULES: readonly LintRule[] = [
  unboundValueRule,
  wrongScopeRule,
  wrongTokenRule,
  primitiveMisuseRule,
  unknownCollectionRule,
  unresolvedBindingRule,
];
