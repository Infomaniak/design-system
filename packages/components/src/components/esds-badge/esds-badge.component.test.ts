import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EsdsBadgeComponent } from './esds-badge.component.ts';

EsdsBadgeComponent.define();

describe('EsdsBadgeComponent', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  function createElement(): EsdsBadgeComponent {
    const el = document.createElement('esds-badge');
    container.append(el);
    return el;
  }

  it('should be constructible and registered', () => {
    const el = createElement();
    expect(el).instanceOf(EsdsBadgeComponent);
    expect(customElements.get('esds-badge')).toBe(EsdsBadgeComponent);
  });

  it('should render slotted content with a status role', async () => {
    const el = createElement();
    const content = document.createElement('span');
    content.textContent = '3';
    el.append(content);
    await el.updateComplete;

    expect(el.getAttribute('role')).toBe('status');
    expect(el.shadowRoot?.querySelector('slot')?.assignedElements()).toEqual([content]);
  });

  it('should preserve a consumer-provided role', async () => {
    const el = createElement();
    el.setAttribute('role', 'note');
    await el.updateComplete;

    expect(el.getAttribute('role')).toBe('note');
  });
});
