import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import { lintNode, observation, stringPart, stringProperty } from '../testing/fixtures.ts';
import { loremIpsumRule } from './lorem-ipsum.ts';

describe('lorem-ipsum rule', () => {
  const context = createLintContext(new Map());

  function evaluate(text: string) {
    const node = lintNode({ id: 'node:1', name: 'Headline', type: 'TEXT' });
    const property = stringProperty('textContent', stringPart(text));

    return loremIpsumRule.evaluate(observation(node, property, property.parts[0]!), context);
  }

  it('warns for classic lorem ipsum copy', () => {
    const findings = evaluate('Lorem ipsum dolor sit amet');

    expect(findings).toEqual([
      {
        ruleId: 'lorem-ipsum',
        ruleTitle: 'Lorem ipsum',
        severity: 'warning',
        nodeId: 'node:1',
        nodeName: 'Headline',
        propertyLabel: 'Text content',
        valueLabel: '"Lorem ipsum dolor sit amet"',
        message: 'Placeholder lorem ipsum copy — replace with real content.',
      },
    ]);
  });

  it('matches any casing and partial standalone words', () => {
    expect(evaluate('LOREM IPSUM DOLOR')).toHaveLength(1);
    expect(evaluate('lorem-based headline')).toHaveLength(1);
    expect(evaluate('a body mentioning ipsum only')).toHaveLength(1);
  });

  it('passes real copy and empty-ish text', () => {
    expect(evaluate('Design tokens keep the product consistent.')).toEqual([]);
    expect(evaluate('Colorimétrie et typographie')).toEqual([]);
    expect(evaluate('Exploration des lorems visuels — see lorentz model')).toEqual([]);
  });

  it('truncates long copy in the value label', () => {
    const findings = evaluate(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor',
    );

    expect(findings[0]!.valueLabel).toBe('"Lorem ipsum dolor sit amet, consectetur…"');
  });

  it('collapses multiline copy in the value label', () => {
    const findings = evaluate('Lorem\nipsum\ndolor');

    expect(findings[0]!.valueLabel).toBe('"Lorem ipsum dolor"');
  });

  it('ignores non-string parts defensively', () => {
    const node = lintNode();
    const property = stringProperty('textContent', stringPart('Lorem ipsum'));
    const numberPart = {
      ...property.parts[0]!,
      value: { kind: 'number' as const, value: 2 },
    };

    expect(loremIpsumRule.evaluate(observation(node, property, numberPart), context)).toEqual([]);
  });
});
