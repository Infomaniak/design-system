import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import {
  colorProperty,
  hexPart,
  lintNode,
  observation,
  variableInfo,
} from '../testing/fixtures.ts';
import { resolveBoundVariable } from './resolve-bound-variable.ts';

describe('resolveBoundVariable', () => {
  it('returns undefined when the part carries no binding', () => {
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000'));
    const context = createLintContext(new Map());

    expect(resolveBoundVariable(observation(node, property, property.parts[0]!), context)).toBe(
      undefined,
    );
  });

  it('returns undefined when the binding cannot be resolved', () => {
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000', 'VariableID:gone'));
    const context = createLintContext(new Map());

    expect(resolveBoundVariable(observation(node, property, property.parts[0]!), context)).toBe(
      undefined,
    );
  });

  it('returns the resolved variable', () => {
    const token: ReturnType<typeof variableInfo> = variableInfo();
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#000000', token.id));
    const context = createLintContext(new Map([[token.id, token]]));

    expect(resolveBoundVariable(observation(node, property, property.parts[0]!), context)).toBe(
      token,
    );
  });
});
