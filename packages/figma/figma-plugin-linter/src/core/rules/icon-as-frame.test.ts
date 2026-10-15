import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import { lintNode, observation, stringPart, stringProperty } from '../testing/fixtures.ts';
import { iconAsFrameRule } from './icon-as-frame.ts';

function componentProperty(rawType: string): ReturnType<typeof stringProperty> {
  return stringProperty('component', stringPart(rawType));
}

describe('icon-as-frame rule', () => {
  const context = createLintContext(new Map());

  it('flags a drawn container named exactly like a kit icon', () => {
    const node = lintNode({ id: 'node:1', name: 'chevron-right', type: 'FRAME' });
    const property = componentProperty('FRAME');

    const findings = iconAsFrameRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toEqual([
      {
        ruleId: 'icon-as-frame',
        ruleTitle: 'Icon as frame',
        severity: 'error',
        nodeId: 'node:1',
        nodeName: 'chevron-right',
        propertyLabel: 'Component',
        valueLabel: 'chevron-right',
        message:
          'Named like a kit icon but is a drawn container — instance the published icon instead.',
      },
    ]);
  });

  it('flags prefixed names and drawn sections and groups', () => {
    const prefixed = lintNode({ id: 'node:1', name: 'esds/icon/plus', type: 'FRAME' });
    const section = lintNode({ id: 'node:2', name: 'plus', type: 'SECTION' });
    const group = lintNode({ id: 'node:3', name: 'plus', type: 'GROUP' });

    for (const [node, rawType] of [
      [prefixed, 'FRAME'],
      [section, 'SECTION'],
      [group, 'GROUP'],
    ] as const) {
      const property = componentProperty(rawType);

      expect(
        iconAsFrameRule.evaluate(observation(node, property, property.parts[0]!), context),
      ).toHaveLength(1);
    }
  });

  it('passes instances, components and non-container types', () => {
    const property = (rawType: string): ReturnType<typeof stringProperty> =>
      componentProperty(rawType);

    for (const [name, rawType] of [
      ['esds/icon/plus', 'INSTANCE'],
      ['esds/icon/plus', 'COMPONENT'],
      ['esds/icon/plus', 'COMPONENT_SET'],
      ['esds/icon/plus', 'TEXT'],
      ['esds/icon/plus', 'RECTANGLE'],
    ] as const) {
      const node = lintNode({ id: 'node:1', name, type: rawType });

      expect(
        iconAsFrameRule.evaluate(
          observation(node, property(rawType), property(rawType).parts[0]!),
          context,
        ),
      ).toEqual([]);
    }
  });

  it('passes renamed or partial icon names', () => {
    for (const name of ['plus copy', 'icon plus', 'chevron', 'esds/icon/plus-bold']) {
      const node = lintNode({ id: 'node:1', name, type: 'FRAME' });
      const property = componentProperty('FRAME');

      expect(
        iconAsFrameRule.evaluate(observation(node, property, property.parts[0]!), context),
      ).toEqual([]);
    }
  });
});
