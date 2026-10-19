import { describe, expect, it } from 'vitest';
import { EsdsBadgeComponent } from './esds-badge.component.ts';

EsdsBadgeComponent.define();

describe('EsdsBadgeComponent', () => {
  it('should be constructible and registered', () => {
    const el = document.createElement('esds-badge');
    expect(el).instanceOf(EsdsBadgeComponent);
  });

  it('should render slotted content with a status role', async () => {
    const el = document.createElement('esds-badge');
    const content = document.createElement('span');
    content.textContent = '3';
    el.append(content);
    document.body.append(el);

    try {
      await el.updateComplete;
      expect(el.getAttribute('role')).toBe('status');
      expect(el.shadowRoot?.querySelector('slot')?.assignedElements()).toEqual([content]);
    } finally {
      el.remove();
    }
  });

  it('should preserve a consumer-provided role', async () => {
    const el = document.createElement('esds-badge');
    el.setAttribute('role', 'note');
    document.body.append(el);

    try {
      await el.updateComplete;
      expect(el.getAttribute('role')).toBe('note');
    } finally {
      el.remove();
    }
  });
});
