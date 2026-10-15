import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import { lintNode, observation, stringPart, stringProperty } from '../testing/fixtures.ts';
import { localDuplicateRule } from './local-duplicate.ts';

function componentProperty(rawType: string): ReturnType<typeof stringProperty> {
  return stringProperty('component', stringPart(rawType));
}

describe('local-duplicate rule', () => {
  const context = createLintContext(new Map());

  it('flags a local component named exactly like a kit icon (warning)', () => {
    const node = lintNode({ id: 'node:1', name: 'esds/icon/plus', type: 'COMPONENT' });
    const property = componentProperty('COMPONENT');

    const findings = localDuplicateRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toEqual([
      {
        ruleId: 'local-duplicate',
        ruleTitle: 'Local duplicate',
        severity: 'warning',
        nodeId: 'node:1',
        nodeName: 'esds/icon/plus',
        propertyLabel: 'Component',
        valueLabel: 'esds/icon/plus',
        message: 'Local duplicate of a kit icon — instance the published component instead.',
      },
    ]);
  });

  it('flags component sets and bare names', () => {
    const componentSet = lintNode({ id: 'node:1', name: 'chevron-right', type: 'COMPONENT_SET' });
    const bare = lintNode({ id: 'node:2', name: 'plus', type: 'COMPONENT' });

    for (const [node, rawType] of [
      [componentSet, 'COMPONENT_SET'],
      [bare, 'COMPONENT'],
    ] as const) {
      const property = componentProperty(rawType);

      expect(
        localDuplicateRule.evaluate(observation(node, property, property.parts[0]!), context),
      ).toHaveLength(1);
    }
  });

  it('passes instances, frames and non-inventory names', () => {
    const cases: readonly [string, string][] = [
      ['esds/icon/plus', 'INSTANCE'],
      ['esds/icon/plus', 'FRAME'],
      ['esds/icon/plus copy', 'COMPONENT'],
      ['icon plus', 'COMPONENT'],
      ['Button', 'COMPONENT'],
    ];

    for (const [name, rawType] of cases) {
      const node = lintNode({ id: 'node:1', name, type: rawType });
      const property = componentProperty(rawType);

      expect(
        localDuplicateRule.evaluate(observation(node, property, property.parts[0]!), context),
      ).toEqual([]);
    }
  });
});
