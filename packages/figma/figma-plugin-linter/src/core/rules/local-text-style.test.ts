import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import type { TextStyleInfo } from '../model/text-style-info.ts';
import { lintNode, observation, textStylePart, textStyleProperty } from '../testing/fixtures.ts';
import { localTextStyleRule } from './local-text-style.ts';

function contextWithStyles(styles: readonly TextStyleInfo[]) {
  return createLintContext(
    new Map(),
    new Map(),
    new Map(
      styles.map((style: TextStyleInfo): readonly [string, TextStyleInfo] => [style.id, style]),
    ),
  );
}

describe('local-text-style rule', () => {
  it('warns for a text style local to the file', () => {
    const context = contextWithStyles([{ id: 'S:1', name: 'Body/S', remote: false, fontSize: 14 }]);
    const node = lintNode({ id: 'node:1', name: 'Paragraph', type: 'TEXT' });
    const property = textStyleProperty(textStylePart({ styleId: 'S:1', fontSize: 14 }));

    expect(localTextStyleRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([
        {
          ruleId: 'local-text-style',
          ruleTitle: 'Local text style',
          severity: 'warning',
          nodeId: 'node:1',
          nodeName: 'Paragraph',
          propertyLabel: 'Text style',
          valueLabel: 'Body/S',
          message:
            'Text style "Body/S" is local to this file — use a style published from the token library.',
        },
      ]);
  });

  it('passes for a remote (published) text style', () => {
    const context = contextWithStyles([{ id: 'S:1', name: 'Title/L', remote: true, fontSize: 24 }]);
    const node = lintNode({ type: 'TEXT' });
    const property = textStyleProperty(textStylePart({ styleId: 'S:1' }));

    expect(localTextStyleRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([]);
  });

  it('passes for hand-styled text and unresolvable style ids', () => {
    const context = contextWithStyles([]);
    const node = lintNode({ type: 'TEXT' });

    const unstyled = textStyleProperty(textStylePart({ fontSize: 16 }));

    expect(
      localTextStyleRule.evaluate(observation(node, unstyled, unstyled.parts[0]!), context),
    ).toEqual([]);

    const deleted = textStyleProperty(textStylePart({ styleId: 'S:gone' }));

    expect(
      localTextStyleRule.evaluate(observation(node, deleted, deleted.parts[0]!), context),
    ).toEqual([]);
  });
});
