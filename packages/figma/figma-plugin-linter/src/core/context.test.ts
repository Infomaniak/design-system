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

  it('resolves effect and text styles by id', () => {
    const effectStyle = { id: 'S:1', name: 'shadow/1', remote: true };
    const textStyle = { id: 'S:2', name: 'Heading/L', remote: true };
    const context = createLintContext(
      new Map(),
      new Map([[effectStyle.id, effectStyle]]),
      new Map([[textStyle.id, textStyle]]),
    );

    expect(context.resolveEffectStyle('S:1')).toBe(effectStyle);
    expect(context.resolveTextStyle('S:2')).toBe(textStyle);
    expect(context.resolveEffectStyle('S:404')).toBeUndefined();
    expect(context.resolveTextStyle('S:404')).toBeUndefined();
  });
});
