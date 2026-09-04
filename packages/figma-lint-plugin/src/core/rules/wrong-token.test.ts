import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import {
  colorProperty,
  hexPart,
  lintNode,
  observation,
  variableInfo,
} from '../testing/fixtures.ts';
import { wrongTokenRule } from './wrong-token.ts';

describe('wrong-token rule', () => {
  it('flags a content token bound to a frame fill', () => {
    const contentToken: ReturnType<typeof variableInfo> = variableInfo({
      id: 'VariableID:1:1',
      name: 'color/content/primary',
      scopes: ['ALL_FILLS'],
    });
    const node = lintNode({ id: 'node:1', name: 'Card', type: 'FRAME' });
    const property = colorProperty('fill', hexPart('#000000', contentToken.id));
    const context = createLintContext(new Map([[contentToken.id, contentToken]]));

    const findings = wrongTokenRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toEqual([
      {
        ruleId: 'wrong-token',
        ruleTitle: 'Wrong token',
        severity: 'error',
        nodeId: 'node:1',
        nodeName: 'Card',
        propertyLabel: 'Fill',
        valueLabel: 'color/content/primary · t2',
        message: '`color/content` tokens are for text and icon colors — not for frame fills.',
      },
    ]);
  });

  it('passes a content token on text fills', () => {
    const contentToken: ReturnType<typeof variableInfo> = variableInfo({
      name: 'color/content/primary',
    });
    const node = lintNode({ type: 'TEXT' });
    const property = colorProperty('fill', hexPart('#000000', contentToken.id));
    const context = createLintContext(new Map([[contentToken.id, contentToken]]));

    expect(
      wrongTokenRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('passes a content token on shape (icon) fills', () => {
    const contentToken: ReturnType<typeof variableInfo> = variableInfo({
      name: 'color/content/primary',
    });
    const node = lintNode({ type: 'SHAPE', name: 'Icon/close' });
    const property = colorProperty('fill', hexPart('#000000', contentToken.id));
    const context = createLintContext(new Map([[contentToken.id, contentToken]]));

    expect(
      wrongTokenRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('passes a background token on frame fills', () => {
    const backgroundToken: ReturnType<typeof variableInfo> = variableInfo({
      name: 'color/background/elevation/surface/default',
    });
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty('fill', hexPart('#FFFFFF', backgroundToken.id));
    const context = createLintContext(new Map([[backgroundToken.id, backgroundToken]]));

    expect(
      wrongTokenRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('flags a background token on text fills', () => {
    const backgroundToken: ReturnType<typeof variableInfo> = variableInfo({
      name: 'color/background/elevation/surface/default',
    });
    const node = lintNode({ type: 'TEXT' });
    const property = colorProperty('fill', hexPart('#FFFFFF', backgroundToken.id));
    const context = createLintContext(new Map([[backgroundToken.id, backgroundToken]]));

    const findings = wrongTokenRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]!.message).toBe(
      '`color/background` tokens are for backgrounds (frame and shape fills) — not for text fills.',
    );
  });

  it('flags a border token bound to a fill', () => {
    const borderToken: ReturnType<typeof variableInfo> = variableInfo({
      name: 'color/border/dim1/default',
    });
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty('fill', hexPart('#FFFFFF', borderToken.id));
    const context = createLintContext(new Map([[borderToken.id, borderToken]]));

    expect(
      wrongTokenRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });

  it('passes a border token on strokes', () => {
    const borderToken: ReturnType<typeof variableInfo> = variableInfo({
      name: 'color/border/dim1/default',
    });
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty('stroke', hexPart('#000000', borderToken.id));
    const context = createLintContext(new Map([[borderToken.id, borderToken]]));

    expect(
      wrongTokenRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('flags a shadow token bound to any checked color property', () => {
    const shadowToken: ReturnType<typeof variableInfo> = variableInfo({ name: 'color/shadow/md' });
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty('fill', hexPart('#FFFFFF', shadowToken.id));
    const context = createLintContext(new Map([[shadowToken.id, shadowToken]]));

    expect(
      wrongTokenRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toHaveLength(1);
  });

  it('flags a shadow token bound to a stroke', () => {
    const shadowToken: ReturnType<typeof variableInfo> = variableInfo({ name: 'color/shadow/md' });
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty('stroke', hexPart('#000000', shadowToken.id));
    const context = createLintContext(new Map([[shadowToken.id, shadowToken]]));

    const findings = wrongTokenRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]!.message).toBe(
      '`color/shadow` tokens are for shadow effects — not for strokes.',
    );
  });

  it('skips unknown categories (not color/background|content|border|shadow)', () => {
    const otherToken: ReturnType<typeof variableInfo> = variableInfo({
      name: 'color/dataviz/blue',
    });
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty('fill', hexPart('#FFFFFF', otherToken.id));
    const context = createLintContext(new Map([[otherToken.id, otherToken]]));

    expect(
      wrongTokenRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('skips non-t2 variables', () => {
    const primitiveToken: ReturnType<typeof variableInfo> = variableInfo({
      name: 'color/gray/900',
      collectionName: 't1',
      tier: 't1',
    });
    const node = lintNode({ type: 'FRAME' });
    const property = colorProperty('fill', hexPart('#FFFFFF', primitiveToken.id));
    const context = createLintContext(new Map([[primitiveToken.id, primitiveToken]]));

    expect(
      wrongTokenRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('skips parts without bound variables', () => {
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#FFFFFF'));

    expect(
      wrongTokenRule.evaluate(
        observation(node, property, property.parts[0]!),
        createLintContext(new Map()),
      ),
    ).toEqual([]);
  });

  it('skips unresolvable variables', () => {
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#FFFFFF', 'VariableID:gone'));

    expect(
      wrongTokenRule.evaluate(
        observation(node, property, property.parts[0]!),
        createLintContext(new Map()),
      ),
    ).toEqual([]);
  });

  it('does not apply to number properties', () => {
    expect(wrongTokenRule.appliesTo).toEqual(['fill', 'stroke']);
  });
});
