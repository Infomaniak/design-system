import { blendModeRule } from './blend-mode.ts';
import { datavizBrandRootRule } from './dataviz-brand-root.ts';
import { iconAsFrameRule } from './icon-as-frame.ts';
import { localCollectionRule } from './local-collection.ts';
import { localDuplicateRule } from './local-duplicate.ts';
import { localEffectStyleRule } from './local-effect-style.ts';
import { localTextStyleRule } from './local-text-style.ts';
import { loremIpsumRule } from './lorem-ipsum.ts';
import { noTextStyleRule } from './no-text-style.ts';
import { opacityOverColorRule } from './opacity-over-color.ts';
import { primitiveMisuseRule } from './primitive-misuse.ts';
import type { LintRule } from './rule.ts';
import { styleOverrideRule } from './style-override.ts';
import { unboundEffectRule } from './unbound-effect.ts';
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
  unboundEffectRule,
  noTextStyleRule,
  iconAsFrameRule,
  primitiveMisuseRule,
  unknownCollectionRule,
  unresolvedBindingRule,
  opacityOverColorRule,
  localEffectStyleRule,
  localTextStyleRule,
  blendModeRule,
  datavizBrandRootRule,
  localCollectionRule,
  loremIpsumRule,
  styleOverrideRule,
  localDuplicateRule,
];
