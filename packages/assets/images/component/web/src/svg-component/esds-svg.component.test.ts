import { beforeAll, describe, expect, it } from 'vitest';
import { EsdsSVGComponent } from './esds-svg.component.ts';

describe('EsdsSVGComponent', () => {
  beforeAll(() => {
    EsdsSVGComponent.init();
  });

  it('should be constructible', () => {
    expect(document.createElement('esds-svg')).instanceOf(EsdsSVGComponent);
  });
});
