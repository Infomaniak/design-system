import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import type { TextStyleInfo } from '../model/text-style-info.ts';
import { lintNode, observation, textStylePart, textStyleProperty } from '../testing/fixtures.ts';
import { styleOverrideRule } from './style-override.ts';

const PUBLISHED_STYLE: TextStyleInfo = {
  id: 'S:1',
  name: 'Title/L',
  remote: true,
  fontSize: 24,
  fontWeight: 'Bold',
  textDecoration: 'NONE',
  lineHeight: '32px',
};

function contextWithStyle(style: TextStyleInfo) {
  return createLintContext(new Map(), new Map(), new Map([[style.id, style]]));
}

describe('style-override rule', () => {
  it('warns naming each overridden prop', () => {
    const context = contextWithStyle(PUBLISHED_STYLE);
    const node = lintNode({ id: 'node:1', name: 'Title', type: 'TEXT' });
    const property = textStyleProperty(
      textStylePart({
        styleId: 'S:1',
        fontSize: 20,
        fontWeight: 'Bold',
        textDecoration: 'NONE',
        lineHeight: '28px',
      }),
    );

    expect(styleOverrideRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([
        {
          ruleId: 'style-override',
          ruleTitle: 'Style override',
          severity: 'warning',
          nodeId: 'node:1',
          nodeName: 'Title',
          propertyLabel: 'Text style',
          valueLabel: 'Title/L',
          message: 'Overrides the published style "Title/L": font size, line height differ.',
        },
      ]);
  });

  it('passes for a remote style with matching props', () => {
    const context = contextWithStyle(PUBLISHED_STYLE);
    const node = lintNode({ type: 'TEXT' });
    const property = textStyleProperty(
      textStylePart({
        styleId: 'S:1',
        fontSize: 24,
        fontWeight: 'Bold',
        textDecoration: 'NONE',
        lineHeight: '32px',
      }),
    );

    expect(styleOverrideRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([]);
  });

  it('skips props the style does not carry', () => {
    const partialStyle: TextStyleInfo = { id: 'S:2', name: 'Partial', remote: true };
    const context = contextWithStyle(partialStyle);
    const node = lintNode({ type: 'TEXT' });
    const property = textStyleProperty(textStylePart({ styleId: 'S:2', fontSize: 99 }));

    expect(styleOverrideRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([]);
  });

  it('skips local styles and hand-styled text', () => {
    const localStyle: TextStyleInfo = { id: 'S:3', name: 'Local', remote: false, fontSize: 10 };
    const context = contextWithStyle(localStyle);
    const node = lintNode({ type: 'TEXT' });

    const onLocalStyle = textStyleProperty(textStylePart({ styleId: 'S:3', fontSize: 20 }));

    expect(
      styleOverrideRule.evaluate(observation(node, onLocalStyle, onLocalStyle.parts[0]!), context),
    ).toEqual([]);

    const unstyled = textStyleProperty(textStylePart({ fontSize: 20 }));

    expect(
      styleOverrideRule.evaluate(observation(node, unstyled, unstyled.parts[0]!), context),
    ).toEqual([]);
  });

  it('passes for a remote style whose id cannot be resolved', () => {
    const context = contextWithStyle(PUBLISHED_STYLE);
    const node = lintNode({ type: 'TEXT' });
    const property = textStyleProperty(textStylePart({ styleId: 'S:gone', fontSize: 99 }));

    expect(styleOverrideRule.evaluate(observation(node, property, property.parts[0]!), context)) //
      .toEqual([]);
  });
});
