import { describe, expect, it } from 'vitest';
import { createLintContext } from '../context.ts';
import {
  colorProperty,
  hexPart,
  lintNode,
  numberPart,
  numberProperty,
  observation,
  variableInfo,
} from '../testing/fixtures.ts';
import { localCollectionRule } from './local-collection.ts';

describe('local-collection rule', () => {
  function contextWithTokens(entry: readonly [string, ReturnType<typeof variableInfo>]) {
    return createLintContext(new Map([entry]));
  }

  it('warns for a binding resolved to a local variable, even well-named t2', () => {
    const context = contextWithTokens([
      'VariableID:local',
      variableInfo({
        id: 'VariableID:local',
        name: 'color/background/on-background',
        collectionName: 't2',
        remote: false,
      }),
    ]);
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#4A90D9', 'VariableID:local'));

    const findings = localCollectionRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toEqual([
      {
        ruleId: 'local-collection',
        ruleTitle: 'Local collection',
        severity: 'warning',
        nodeId: 'node:1',
        nodeName: 'Node',
        propertyLabel: 'Fill',
        valueLabel: 'color/background/on-background · t2',
        message:
          'Bound to a variable from "t2", which is local to this file — publish it to the token library.',
      },
    ]);
  });

  it('passes for a variable from a published library', () => {
    const context = contextWithTokens([
      'VariableID:lib',
      variableInfo({ id: 'VariableID:lib', remote: true }),
    ]);
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#4A90D9', 'VariableID:lib'));

    expect(
      localCollectionRule.evaluate(observation(node, property, property.parts[0]!), context),
    ).toEqual([]);
  });

  it('follows the alias chain and warns when the resolved variable is local', () => {
    const context = createLintContext(
      new Map([
        [
          'VariableID:kit',
          variableInfo({
            id: 'VariableID:kit',
            name: 'foreground',
            collectionName: 'mode',
            tier: 'unknown',
            aliasTargetId: 'VariableID:local-t2',
          }),
        ],
        [
          'VariableID:local-t2',
          variableInfo({
            id: 'VariableID:local-t2',
            name: 'color/content/primary',
            collectionName: 't2',
            remote: false,
          }),
        ],
      ]),
    );
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#4A90D9', 'VariableID:kit'));

    const findings = localCollectionRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]!.valueLabel).toBe('color/content/primary · t2');
  });

  it('passes raw parts and numbers bound to published tokens', () => {
    const context = contextWithTokens([
      'VariableID:spacing',
      variableInfo({
        id: 'VariableID:spacing',
        name: 'spacing/16',
        collectionName: 't2',
        remote: true,
      }),
    ]);
    const node = lintNode();
    const raw = colorProperty('fill', hexPart('#4A90D9'));

    expect(localCollectionRule.evaluate(observation(node, raw, raw.parts[0]!), context)).toEqual(
      [],
    );

    const spacing = numberProperty('gap', numberPart(16, 'VariableID:spacing'));

    expect(
      localCollectionRule.evaluate(observation(node, spacing, spacing.parts[0]!), context),
    ).toEqual([]);
  });

  it('wording falls back when the collection name is unresolvable', () => {
    const context = contextWithTokens([
      'VariableID:local',
      variableInfo({ id: 'VariableID:local', collectionName: '', remote: false }),
    ]);
    const node = lintNode();
    const property = colorProperty('fill', hexPart('#4A90D9', 'VariableID:local'));

    const findings = localCollectionRule.evaluate(
      observation(node, property, property.parts[0]!),
      context,
    );

    expect(findings[0]!.message).toBe(
      'Bound to a variable from a local collection, which is local to this file — publish it to the token library.',
    );
  });
});
