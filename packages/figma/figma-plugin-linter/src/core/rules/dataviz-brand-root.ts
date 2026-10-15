import type { LintContext } from '../context.ts';
import { variableToLabel } from '../labels.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import { resolveBoundVariable } from './resolve-bound-variable.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `dataviz-brand-root` (warning).
 *
 * A bound t2 color token carries a `dataviz` or `brand` name segment but not
 * the `@root` segment. Only `@root` variants of brand/dataviz tokens are
 * published (e.g. `color/background/dataviz/@root/dim1`), so a non-`@root`
 * binding points at an unpublished token that won't track the token set.
 *
 * Examples (fixture-driven):
 * - `["color","background","dataviz","@root","dim1"]` → pass
 * - the same path without `@root` → warning
 * - `["color","background","brand","on-background"]` → warning
 */
export const datavizBrandRootRule: LintRule = {
  id: 'dataviz-brand-root',
  title: 'Brand/dataviz @root',
  severity: 'warning',
  appliesTo: ['fill', 'stroke'],
  evaluate: (observation: PropertyObservation, context: LintContext): readonly Finding[] => {
    const variable = resolveBoundVariable(observation, context);

    if (variable === undefined || variable.tier !== 't2') {
      return [];
    }

    const isBrandOrDataviz: boolean = variable.nameSegments.some(
      (segment: string): boolean => segment === 'brand' || segment === 'dataviz',
    );

    if (!isBrandOrDataviz || variable.nameSegments.includes('@root')) {
      return [];
    }

    return [
      buildFinding(
        datavizBrandRootRule,
        observation,
        variableToLabel(variable),
        'Brand/dataviz tokens must be the @root variant — only those are published.',
      ),
    ];
  },
};
