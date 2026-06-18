import { describe, expect, it } from 'vitest';
import { DraftComponentComponent } from './draft-component.component.ts';

describe('DraftComponentComponent', () => {
  it('should be constructible and registered', () => {
    const el = document.createElement('draft-component');
    expect(el).instanceOf(DraftComponentComponent);
  });

  it('should display the label when no slot content is provided', async () => {
    const el = document.createElement('draft-component') as DraftComponentComponent;
    el.label = 'Hello';
    document.body.append(el);
    await el.updateComplete;

    expect(el.shadowRoot?.textContent).toContain('Hello');

    el.remove();
  });
});
