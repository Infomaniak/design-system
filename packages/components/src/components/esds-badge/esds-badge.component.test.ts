import { describe, expect, it } from 'vitest';
import { EsdsBadgeComponent } from './esds-badge.component.ts';

EsdsBadgeComponent.define();

describe('EsdsBadgeComponent', () => {
  it('should be constructible and registered', () => {
    const el = document.createElement('esds-badge');
    expect(el).instanceOf(EsdsBadgeComponent);
  });
});
