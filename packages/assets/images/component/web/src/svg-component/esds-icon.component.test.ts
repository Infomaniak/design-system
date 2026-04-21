import { beforeAll, describe, expect, it } from 'vitest';
import { EsdsIconComponent } from './esds-icon.component.ts';

describe('EsdsIconComponent', () => {
  beforeAll(() => {
    EsdsIconComponent.init();
  });

  it('should be constructible', () => {
    expect(document.createElement('esds-icon')).instanceOf(EsdsIconComponent);
  });
});
