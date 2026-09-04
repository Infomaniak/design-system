import { describe, expect, it } from 'vitest';
import { createLintContext } from './context.ts';
import { variableInfo } from './testing/fixtures.ts';

describe('createLintContext', () => {
  it('resolves variables by id', () => {
    const variable: ReturnType<typeof variableInfo> = variableInfo({ id: 'VariableID:1:2' });
    const context = createLintContext(new Map([[variable.id, variable]]));

    expect(context.resolveVariable('VariableID:1:2')).toBe(variable);
  });

  it('returns undefined for unknown ids (deleted variables)', () => {
    const context = createLintContext(new Map());

    expect(context.resolveVariable('VariableID:1:2')).toBeUndefined();
  });
});
