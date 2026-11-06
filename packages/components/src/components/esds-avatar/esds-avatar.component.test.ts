import { describe, expect, it } from 'vitest';
import { EsdsAvatarComponent } from './esds-avatar.component.ts';

EsdsAvatarComponent.define();

describe('EsdsAvatarComponent', () => {
  it('should be constructible and registered', () => {
    const el = document.createElement('esds-avatar');
    expect(el).instanceOf(EsdsAvatarComponent);
  });
});
