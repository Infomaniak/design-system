import type { LintContext } from '../context.ts';
import { resolveEffectiveVariable } from '../effective-variable.ts';
import { variableToLabel } from '../labels.ts';
import type { Finding } from '../model/finding.ts';
import { ALL_PROPERTY_KINDS } from '../model/lint-property.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import type { VariableInfo } from '../model/variable-info.ts';
import { buildFinding } from './build-finding.ts';
import { resolveBoundVariable } from './resolve-bound-variable.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `primitive-misuse` (warning).
 *
 * The bound token effectively resolves to a primitive (t1) token — either bound
 * directly, or through an alias chain (e.g. a kit variable re-pointed to a t1).
 * Primitives may be legitimate in some contexts (e.g. the DS source file),
 * which is why this is a warning and not an error.
 */
export const primitiveMisuseRule: LintRule = {
  id: 'primitive-misuse',
  title: 'Primitive misuse',
  severity: 'warning',
  appliesTo: ALL_PROPERTY_KINDS,
  evaluate: (observation: PropertyObservation, context: LintContext): readonly Finding[] => {
    const variable = resolveBoundVariable(observation, context);

    if (variable === undefined) {
      return [];
    }

    const effectiveVariable: VariableInfo | undefined = resolveEffectiveVariable(variable, context);

    if (effectiveVariable === undefined || effectiveVariable.tier !== 't1') {
      return [];
    }

    return [
      buildFinding(
        primitiveMisuseRule,
        observation,
        variableToLabel(variable),
        'Bound token resolves to a primitive (t1) token — prefer a semantic (t2) token.',
      ),
    ];
  },
};
