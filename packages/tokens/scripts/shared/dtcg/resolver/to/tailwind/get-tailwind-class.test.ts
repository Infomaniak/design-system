import { describe, expect, it } from 'vitest';
import { getTailwindClass } from './get-tailwind-class.ts';

describe('getTailwindClass', () => {
  describe('color tokens', () => {
    it('should map background color to bg-{rest}', () => {
      expect(
        getTailwindClass(['color', 'background', 'elevation', 'surface', 'pressed']),
      ).toStrictEqual(['bg-background-elevation-surface-pressed']);
    });

    it('should map content color to text-{rest}', () => {
      expect(getTailwindClass(['color', 'content', 'primary'])).toStrictEqual([
        'text-content-primary',
      ]);
    });

    it('should map border color to border-{rest}', () => {
      expect(getTailwindClass(['color', 'border', 'default'])).toStrictEqual([
        'border-border-default',
      ]);
    });

    it('should fallback to bg for other color categories', () => {
      expect(getTailwindClass(['color', 'surface', 'dark'])).toStrictEqual(['bg-surface-dark']);
    });

    it('should handle minimal color background token', () => {
      expect(getTailwindClass(['color', 'background', 'base'])).toStrictEqual([
        'bg-background-base',
      ]);
    });
  });

  describe('font tokens', () => {
    it('should map font family to font-{rest}', () => {
      expect(getTailwindClass(['font', 'family', 'base'])).toStrictEqual(['font-base']);
    });

    it('should map font size to text-{rest}', () => {
      expect(getTailwindClass(['font', 'size', '12'])).toStrictEqual(['text-12']);
    });

    it('should map font line-height to leading-{rest}', () => {
      expect(getTailwindClass(['font', 'line-height', '16'])).toStrictEqual(['leading-16']);
    });

    it('should map font weight to font-{rest}', () => {
      expect(getTailwindClass(['font', 'weight', 'medium'])).toStrictEqual(['font-medium']);
    });

    it('should map letter spacing to tracking-{rest}', () => {
      expect(getTailwindClass(['font', 'letter-spacing', 'md'])).toStrictEqual(['tracking-md']);
    });
  });

  describe('text tokens', () => {
    it('should map text size to text-{rest}', () => {
      expect(getTailwindClass(['text', 'md', 'size'])).toStrictEqual(['text-md']);
    });

    it('should map text line-height to leading-{rest}', () => {
      expect(getTailwindClass(['text', 'md', 'line-height'])).toStrictEqual(['leading-md']);
    });

    it('should map text letter-spacing to tracking-{rest}', () => {
      expect(getTailwindClass(['text', 'md', 'letter-spacing'])).toStrictEqual(['tracking-md']);
    });

    it('should return null for unmapped text tokens', () => {
      expect(getTailwindClass(['text', 'md'])).toBeNull();
    });
  });

  describe('radius tokens', () => {
    it('should map radius to rounded-{rest}', () => {
      expect(getTailwindClass(['radius', 'sm'])).toStrictEqual(['rounded-sm']);
    });
  });

  describe('blur tokens', () => {
    it('should map blur to blur-{rest}', () => {
      expect(getTailwindClass(['blur', 'md'])).toStrictEqual(['blur-md']);
    });
  });

  describe('spacing tokens', () => {
    it('should map spacing to p-{rest} / m-{rest} / gap-{rest}', () => {
      expect(getTailwindClass(['spacing', 'md'])).toStrictEqual(['p-md', 'm-md', 'gap-md']);
    });
  });

  describe('shadow tokens', () => {
    it('should map shadow to shadow-{rest}', () => {
      expect(getTailwindClass(['shadow', 'sm'])).toStrictEqual(['shadow-sm']);
    });
  });

  describe('opacity tokens', () => {
    it('should map opacity to opacity-{rest}', () => {
      expect(getTailwindClass(['opacity', 'medium'])).toStrictEqual(['opacity-medium']);
    });
  });

  describe('border tokens', () => {
    it('should map border width to border-{rest}', () => {
      expect(getTailwindClass(['border', 'sm', 'width'])).toStrictEqual(['border-sm']);
    });

    it('should return null for unmapped border tokens', () => {
      expect(getTailwindClass(['border', 'sm'])).toBeNull();
    });
  });

  describe('unmapped tokens', () => {
    it('should return null for unmapped tokens', () => {
      expect(getTailwindClass([])).toBeNull();
      expect(getTailwindClass(['color'])).toBeNull();
      expect(getTailwindClass(['unmapped', 'token'])).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle minimal spacing token', () => {
      expect(getTailwindClass(['spacing', '2'])).toStrictEqual(['p-2', 'm-2', 'gap-2']);
    });

    it('should handle deep shadow token', () => {
      expect(getTailwindClass(['shadow', 'lg', 'blur'])).toStrictEqual(['shadow-lg-blur']);
    });
  });
});
