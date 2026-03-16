import { describe, expect, it } from 'vitest';
import { EsdsSVGComponent } from './esds-svg.component.ts';

describe('EsdsSVGComponent', () => {
  it('should be constructible', () => {
    EsdsSVGComponent.init();
    expect(document.createElement('esds-svg')).instanceOf(EsdsSVGComponent);
  });
});
