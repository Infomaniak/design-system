import { describe, expect, test } from 'vitest';
import type { TransitionDesignToken } from '../../../../../../../../design-token/token/types/composite/types/transition/transition-design-token.ts';
import type { TransitionDesignTokenValue } from '../../../../../../../../design-token/token/types/composite/types/transition/value/transition-design-token-value.ts';
import {
  ensureTransitionDesignTokenContainsOnlyReferences,
  ensureTransitionDesignTokenValueContainsOnlyReferences,
} from './ensure-transition-design-token-contains-only-references.ts';

describe('ensureTransitionDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: TransitionDesignToken = {
      $value: '{transition.fast}',
    };

    expect(() => ensureTransitionDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: TransitionDesignToken = {
      $value: { $ref: 'transition.fast' },
    };

    expect(() => ensureTransitionDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains object value with all references', () => {
    const token: TransitionDesignToken = {
      $value: {
        duration: '{duration.fast}',
        delay: '{delay.none}',
        timingFunction: '{easing.easeInOut}',
      },
    };

    expect(() => ensureTransitionDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains object value with direct duration value', () => {
    const token: TransitionDesignToken = {
      $value: {
        duration: {
          value: 300,
          unit: 'ms',
        },
        delay: '{delay.none}',
        timingFunction: '{easing.easeInOut}',
      },
    };

    expect(() => ensureTransitionDesignTokenContainsOnlyReferences(token)).toThrow();
  });

  test('should throw when token contains object value with direct delay value', () => {
    const token: TransitionDesignToken = {
      $value: {
        duration: '{duration.fast}',
        delay: {
          value: 0,
          unit: 'ms',
        },
        timingFunction: '{easing.easeInOut}',
      },
    };

    expect(() => ensureTransitionDesignTokenContainsOnlyReferences(token)).toThrow();
  });

  test('should throw when token contains object value with direct timingFunction value', () => {
    const token: TransitionDesignToken = {
      $value: {
        duration: '{duration.fast}',
        delay: '{delay.none}',
        timingFunction: [0.4, 0, 0.2, 1],
      },
    };

    expect(() => ensureTransitionDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});

describe('ensureTransitionDesignTokenValueContainsOnlyReferences', () => {
  test('should not throw when value contains all references', () => {
    const value: TransitionDesignTokenValue = {
      duration: '{duration.fast}',
      delay: '{delay.none}',
      timingFunction: '{easing.easeInOut}',
    };

    expect(() => ensureTransitionDesignTokenValueContainsOnlyReferences(value)).not.toThrow();
  });

  test('should throw when duration is not a reference', () => {
    const value: TransitionDesignTokenValue = {
      duration: {
        value: 300,
        unit: 'ms',
      },
      delay: '{delay.none}',
      timingFunction: '{easing.easeInOut}',
    };

    expect(() => ensureTransitionDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });

  test('should throw when delay is not a reference', () => {
    const value: TransitionDesignTokenValue = {
      duration: '{duration.fast}',
      delay: {
        value: 0,
        unit: 'ms',
      },
      timingFunction: '{easing.easeInOut}',
    };

    expect(() => ensureTransitionDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });

  test('should throw when timingFunction is not a reference', () => {
    const value: TransitionDesignTokenValue = {
      duration: '{duration.fast}',
      delay: '{delay.none}',
      timingFunction: [0.4, 0, 0.2, 1],
    };

    expect(() => ensureTransitionDesignTokenValueContainsOnlyReferences(value)).toThrow();
  });
});
