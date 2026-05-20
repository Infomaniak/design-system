import { IconifyApi } from '@infomaniak-design-system/esds-icon';
import { html } from 'lit';
import { configure } from '../configure.ts';
import './esds-icon.component.ts';

try {
  configure(
    new IconifyApi({
      resources: ['https://iconify.preprod.dev.infomaniak.ch'],
    }),
  );
} catch {
  // Already configured
}

export default {
  title: 'Components/esds-icon',
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: var(--esds-spacing-400); padding: var(--esds-spacing-500);"
    >
      <section>
        <h3>Default (SVG mode)</h3>
        <p style="font-size: var(--esds-font-size-body-lg);">
          <esds-icon name="esds:arrow-right"></esds-icon>
          esds:arrow-right
        </p>
      </section>

      <section>
        <h3>Background mode (mode="bg")</h3>
        <p style="font-size: var(--esds-font-size-body-lg);">
          <esds-icon
            name="esds:arrow-right"
            mode="bg"
          ></esds-icon>
          esds:arrow-right
        </p>
      </section>

      <section>
        <h3>Mask mode (mode="mask") with color override</h3>
        <p style="font-size: var(--esds-font-size-body-lg); color: var(--esds-color-error);">
          <esds-icon
            name="esds:arrow-right"
            mode="mask"
          ></esds-icon>
          esds:arrow-right (red)
        </p>
      </section>

      <section>
        <h3>Inline alignment (inline attribute)</h3>
        <p style="font-size: var(--esds-font-size-body-lg);">
          <esds-icon
            name="esds:arrow-right"
            inline
          ></esds-icon>
          esds:arrow-right (inline)
        </p>
      </section>

      <section>
        <h3>Manual loading (nolazy attribute)</h3>
        <p style="font-size: var(--esds-font-size-body-lg);">
          <esds-icon
            name="esds:arrow-right"
            nolazy
          ></esds-icon>
          esds:arrow-right (nolazy)
        </p>
      </section>
    </div>
  `,
};
