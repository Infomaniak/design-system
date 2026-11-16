import { describe, expect, it } from 'vitest';
import { EsdsAvatarGroupComponent } from './esds-avatar-group.component.ts';

EsdsAvatarGroupComponent.define();

describe('EsdsAvatarGroupComponent', () => {
  it('should be constructible and registered', () => {
    const el = document.createElement('esds-avatar-group');
    expect(el).instanceOf(EsdsAvatarGroupComponent);
  });
});
