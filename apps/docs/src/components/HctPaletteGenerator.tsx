import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_TONES,
  formatPalette,
  generateTonalPalette,
  isDark,
  normalizeHex,
  parseTones,
  type PaletteEntry,
} from '../lib/hct-palette.ts';

const COPY_FEEDBACK_DURATION_MS = 1500;

type CopyStatus = 'idle' | 'copied' | 'failed';

type PaletteResult =
  | {
      readonly ok: true;
      readonly entries: PaletteEntry[];
      readonly background: string;
      readonly text: string;
    }
  | { readonly ok: false; readonly error: string; readonly text: '' };

function computePalette(source: string, tones: string, background: string): PaletteResult {
  try {
    const entries: PaletteEntry[] = generateTonalPalette(source, parseTones(tones));
    return {
      ok: true,
      entries,
      background: normalizeHex(background),
      text: formatPalette(entries),
    };
  } catch (error) {
    return { ok: false, error: (error as Error).message, text: '' };
  }
}

/** Native color inputs only accept lowercase `#rrggbb`; fall back while the text is being edited. */
function toPickerValue(value: string, fallback: string): string {
  try {
    return normalizeHex(value).toLowerCase();
  } catch {
    return fallback;
  }
}

const HctPaletteGenerator: React.FC = () => {
  const [source, setSource] = useState<string>('#6750A4');
  const [tones, setTones] = useState<string>(DEFAULT_TONES.join(', '));
  const [background, setBackground] = useState<string>('#888888');
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const result: PaletteResult = useMemo(
    () => computePalette(source, tones, background),
    [source, tones, background],
  );

  useEffect(
    () => () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    },
    [],
  );

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(result.text);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = setTimeout(() => setCopyStatus('idle'), COPY_FEEDBACK_DURATION_MS);
  }

  const contrastColor: string = result.ok && isDark(result.background) ? '#FFFFFF' : '#000000';
  const copyLabel: Record<CopyStatus, string> = {
    idle: 'Copy output',
    copied: 'Copied!',
    failed: 'Failed to copy',
  };

  return (
    <>
      <style>{`
        .hct-palette {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 480px;
          margin: 24px 0;
          font-size: 14px;
          color: var(--esds-color-content-primary);
        }
        .hct-palette__field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .hct-palette__label {
          font-weight: 600;
        }
        .hct-palette__row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hct-palette__input {
          flex: 1;
          padding: 6px 8px;
          border: 1px solid var(--esds-color-border-dim2);
          border-radius: 4px;
          background: var(--esds-color-background-elevation-raised);
          color: var(--esds-color-content-primary);
          font-family: ui-monospace, monospace;
          font-size: 14px;
        }
        .hct-palette__input:focus-visible,
        .hct-palette__picker:focus-visible,
        .hct-palette__button:focus-visible {
          outline: 2px solid var(--esds-color-border-brand);
          outline-offset: 1px;
        }
        .hct-palette__picker {
          width: 36px;
          height: 32px;
          padding: 0;
          border: 1px solid var(--esds-color-border-dim2);
          border-radius: 4px;
          background: none;
          cursor: pointer;
        }
        .hct-palette__button {
          align-self: flex-start;
          padding: 6px 12px;
          border: 1px solid var(--esds-color-border-dim2);
          border-radius: 4px;
          background: var(--esds-color-background-elevation-raised);
          color: var(--esds-color-content-primary);
          font: inherit;
          cursor: pointer;
        }
        .hct-palette__button:hover:not(:disabled) {
          background: var(--esds-color-background-elevation-sunken);
        }
        .hct-palette__button:disabled {
          cursor: not-allowed;
          background: var(--esds-color-background-disabled);
          color: var(--esds-color-content-disabled);
        }
        .hct-palette__error {
          margin: 0;
          color: var(--esds-color-content-feedback-error);
        }
        .hct-palette__output {
          margin: 0;
          padding: 12px 16px;
          border-radius: 8px;
          list-style: none;
          font-family: ui-monospace, monospace;
          white-space: pre;
        }
        .hct-palette__entry {
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 24px;
        }
        .hct-palette__swatch {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid;
          box-sizing: border-box;
        }
      `}</style>
      <div className="hct-palette sb-unstyled">
        <div className="hct-palette__field">
          <label
            className="hct-palette__label"
            htmlFor="hct-palette-source"
          >
            Base color (source HEX)
          </label>
          <div className="hct-palette__row">
            <input
              id="hct-palette-source"
              className="hct-palette__input"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              onBlur={() => setSource((value) => toPickerValue(value, '').toUpperCase() || value)}
            />
            <input
              type="color"
              className="hct-palette__picker"
              aria-label="Pick base color"
              value={toPickerValue(source, '#000000')}
              onChange={(event) => setSource(event.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div className="hct-palette__field">
          <label
            className="hct-palette__label"
            htmlFor="hct-palette-tones"
          >
            Tones (comma separated)
          </label>
          <input
            id="hct-palette-tones"
            className="hct-palette__input"
            value={tones}
            onChange={(event) => setTones(event.target.value)}
          />
        </div>

        <div className="hct-palette__field">
          <label
            className="hct-palette__label"
            htmlFor="hct-palette-background"
          >
            Output background
          </label>
          <div className="hct-palette__row">
            <input
              id="hct-palette-background"
              className="hct-palette__input"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              onBlur={() =>
                setBackground((value) => toPickerValue(value, '').toUpperCase() || value)
              }
            />
            <input
              type="color"
              className="hct-palette__picker"
              aria-label="Pick output background"
              value={toPickerValue(background, '#888888')}
              onChange={(event) => setBackground(event.target.value.toUpperCase())}
            />
          </div>
        </div>

        <button
          type="button"
          className="hct-palette__button"
          disabled={!result.ok}
          onClick={handleCopy}
        >
          {copyLabel[copyStatus]}
        </button>

        {result.ok ? (
          <ul
            className="hct-palette__output"
            aria-label="Tonal palette"
            style={{ background: result.background, color: contrastColor }}
          >
            {result.entries.map(({ tone, hex }, index) => (
              <li
                key={`${index}-${tone}`}
                className="hct-palette__entry"
              >
                <span
                  className="hct-palette__swatch"
                  style={{ background: hex, borderColor: contrastColor }}
                />
                {`${String(tone).padStart(3)}  ${hex}`}
              </li>
            ))}
          </ul>
        ) : (
          <p
            className="hct-palette__error"
            role="alert"
          >
            Error: {result.error}
          </p>
        )}
      </div>
    </>
  );
};

export default HctPaletteGenerator;
