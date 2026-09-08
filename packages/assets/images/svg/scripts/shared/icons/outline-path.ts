export type WindingRule = 'NONZERO' | 'EVENODD';

export interface SvgOutlinePath {
  readonly d: string;
  readonly windingRule: WindingRule;
}

const WINDING_RULES: readonly WindingRule[] = ['NONZERO', 'EVENODD'];

export function parseWindingRule(value: string): WindingRule {
  const windingRule: WindingRule | undefined = WINDING_RULES.find(
    (candidate: WindingRule): boolean => candidate === value,
  );

  if (windingRule === undefined) {
    throw new Error(`Unexpected winding rule: ${JSON.stringify(value)}.`);
  }

  return windingRule;
}
