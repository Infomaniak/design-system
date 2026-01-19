import { describe, expect, it } from 'vitest';
import { DesignTokensCollection } from './design-tokens-collection.ts';

describe('DesignTokensCollection', () => {
  describe('methods', () => {
    describe('get', () => {
      it('should return expected token', () => {
        const collection = new DesignTokensCollection();

        collection.fromDesignTokensTree({
          breakpoint: {
            $type: 'dimension',
            sm: {
              $value: {
                value: 640,
                unit: 'px',
              },
            },
            md: {
              $value: {
                value: 768,
                unit: 'px',
              },
            },
            lg: {
              $value: {
                value: 1024,
                unit: 'px',
              },
            },
            xl: {
              $value: {
                value: 1280,
                unit: 'px',
              },
            },
            '2xl': {
              $value: {
                value: 1536,
                unit: 'px',
              },
            },
          },
        });

        expect(collection.get('breakpoint.sm')).toEqual({
          name: ['breakpoint', 'sm'],
          type: 'dimension',
          value: {
            unit: 'px',
            value: 640,
          },
        });
      });
    });
  });
});
