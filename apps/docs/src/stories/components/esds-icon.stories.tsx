import { configure } from '@infomaniak-design-system/components';
import { IconifyApi } from '@infomaniak-design-system/esds-icon';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef } from 'react';

try {
  configure(
    new IconifyApi({
      resources: ['https://iconify.preprod.dev.infomaniak.ch'],
    }),
  );
} catch {
  // Already configured
}

interface EsdsIconProps {
  name?: string;
  mode?: 'svg' | 'bg' | 'mask';
  inline?: boolean;
  nolazy?: boolean;
}

function EsdsIcon({
  name = 'esds:arrow-right',
  mode = 'svg',
  inline = false,
  nolazy = false,
}: EsdsIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const container = ref.current;
    container.innerHTML = '';

    const icon = document.createElement('esds-icon');
    icon.setAttribute('name', name);
    icon.setAttribute('mode', mode);
    if (inline) icon.setAttribute('inline', '');
    if (nolazy) icon.setAttribute('nolazy', '');

    container.appendChild(icon);
  }, [name, mode, inline, nolazy]);

  return <div ref={ref} />;
}

const meta = {
  title: 'Components/esds-icon',
} satisfies Meta<typeof EsdsIcon>;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--esds-spacing-400)',
        padding: 'var(--esds-spacing-500)',
      }}
    >
      <section>
        <h3>Default (SVG mode)</h3>
        <p style={{ fontSize: 'var(--esds-font-size-body-lg)' }}>
          <EsdsIcon name="esds:arrow-right" />
          esds:arrow-right
        </p>
      </section>

      <section>
        <h3>Background mode (mode=&quot;bg&quot;)</h3>
        <p style={{ fontSize: 'var(--esds-font-size-body-lg)' }}>
          <EsdsIcon
            name="esds:arrow-right"
            mode="bg"
          />
          esds:arrow-right
        </p>
      </section>

      <section>
        <h3>Mask mode (mode=&quot;mask&quot;) with color override</h3>
        <p
          style={{
            fontSize: 'var(--esds-font-size-body-lg)',
            color: 'var(--esds-color-error)',
          }}
        >
          <EsdsIcon
            name="esds:arrow-right"
            mode="mask"
          />
          esds:arrow-right (red)
        </p>
      </section>

      <section>
        <h3>Inline alignment (inline attribute)</h3>
        <p style={{ fontSize: 'var(--esds-font-size-body-lg)' }}>
          <EsdsIcon
            name="esds:arrow-right"
            inline
          />
          esds:arrow-right (inline)
        </p>
      </section>

      <section>
        <h3>Manual loading (nolazy attribute)</h3>
        <p style={{ fontSize: 'var(--esds-font-size-body-lg)' }}>
          <EsdsIcon
            name="esds:arrow-right"
            nolazy
          />
          esds:arrow-right (nolazy)
        </p>
      </section>
    </div>
  ),
};
