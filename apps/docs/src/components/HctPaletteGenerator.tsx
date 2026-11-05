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

type CopyTarget = 'all' | number;

interface CopyFeedback {
  readonly target: CopyTarget;
  readonly label: string;
  readonly status: 'copied' | 'failed';
}

type PaletteResult =
  | {
      readonly ok: true;
      readonly entries: PaletteEntry[];
      readonly text: string;
    }
  | { readonly ok: false; readonly error: string; readonly text: '' };

function computePalette(source: string, tones: string): PaletteResult {
  try {
    const entries: PaletteEntry[] = generateTonalPalette(source, parseTones(tones));
    return { ok: true, entries, text: formatPalette(entries) };
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
  const [background, setBackground] = useState<string>('#D1D1D1');
  const [previewBackground, setPreviewBackground] = useState<string>('#D1D1D1');
  const [spacing, setSpacing] = useState<number>(0);
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const result: PaletteResult = useMemo(() => computePalette(source, tones), [source, tones]);
  const isBackgroundValid: boolean = toPickerValue(background, '') !== '';

  useEffect(
    () => () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    },
    [],
  );

  function handleBackgroundChange(value: string): void {
    setBackground(value);
    const normalized: string = toPickerValue(value, '').toUpperCase();
    if (normalized) {
      setPreviewBackground(normalized);
    }
  }

  async function handleCopy(text: string, target: CopyTarget, label: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback({ target, label, status: 'copied' });
    } catch {
      setCopyFeedback({ target, label, status: 'failed' });
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = setTimeout(() => setCopyFeedback(null), COPY_FEEDBACK_DURATION_MS);
  }

  function feedbackFor(target: CopyTarget, idleLabel: string): string {
    if (copyFeedback?.target !== target) {
      return idleLabel;
    }
    return copyFeedback.status === 'copied' ? 'Copied!' : 'Failed to copy';
  }

  function feedbackAnnouncement(): string {
    if (!copyFeedback) {
      return '';
    }
    return copyFeedback.status === 'copied'
      ? `Copied ${copyFeedback.label}`
      : `Failed to copy ${copyFeedback.label}`;
  }

  return (
    <>
      <style>{`
        .hct-palette {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 24px 0;
          font-size: 14px;
          color: var(--esds-color-content-primary);
        }
        .hct-palette__form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 480px;
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
        .hct-palette__input[aria-invalid='true'] {
          border-color: var(--esds-color-content-feedback-error);
        }
        .hct-palette__hint {
          font-size: 12px;
        }
        .hct-palette__visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        .hct-palette__slider {
          flex: 1;
          accent-color: var(--esds-color-content-brand);
        }
        .hct-palette__slider-value {
          min-width: 4ch;
          font-family: ui-monospace, monospace;
          text-align: right;
        }
        .hct-palette__output {
          display: flex;
          flex-direction: column;
          align-self: flex-start;
          margin: 0;
          padding: 16px 24px 16px 16px;
          border-radius: 8px;
          list-style: none;
        }
        .hct-palette__entry {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0;
          border: none;
          background: none;
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }
        .hct-palette__entry:focus-visible {
          outline: 2px solid var(--esds-color-border-brand);
          outline-offset: 2px;
        }
        .hct-palette__entry:hover .hct-palette__info {
          text-decoration: underline;
        }
        .hct-palette__swatch {
          width: 160px;
          height: 40px;
        }
        .hct-palette__output li:first-child .hct-palette__swatch {
          border-radius: 6px 6px 0 0;
        }
        .hct-palette__output li:last-child .hct-palette__swatch {
          border-radius: 0 0 6px 6px;
        }
        .hct-palette__output li:only-child .hct-palette__swatch,
        .hct-palette__output.hct-palette__output--spaced li .hct-palette__swatch {
          border-radius: 6px;
        }
        .hct-palette__info {
          display: flex;
          gap: 12px;
          font-family: ui-monospace, monospace;
          white-space: pre;
        }
        .hct-palette__tone {
          min-width: 3ch;
          text-align: right;
          font-weight: 600;
        }
      `}</style>
      <div className="hct-palette sb-unstyled">
        <div className="hct-palette__form">
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
                aria-invalid={!isBackgroundValid}
                aria-describedby={isBackgroundValid ? undefined : 'hct-palette-background-error'}
                onChange={(event) => handleBackgroundChange(event.target.value)}
                onBlur={() =>
                  setBackground((value) => toPickerValue(value, '').toUpperCase() || value)
                }
              />
              <input
                type="color"
                className="hct-palette__picker"
                aria-label="Pick output background"
                value={previewBackground.toLowerCase()}
                onChange={(event) => handleBackgroundChange(event.target.value)}
              />
            </div>
            {!isBackgroundValid && (
              <p
                id="hct-palette-background-error"
                className="hct-palette__error hct-palette__hint"
              >
                Use a 6-digit hex color. The preview keeps the last valid background (
                {previewBackground}).
              </p>
            )}
          </div>

          <div className="hct-palette__field">
            <label
              className="hct-palette__label"
              htmlFor="hct-palette-spacing"
            >
              Spacing
            </label>
            <div className="hct-palette__row">
              <input
                id="hct-palette-spacing"
                type="range"
                className="hct-palette__slider"
                min={0}
                max={16}
                value={spacing}
                onChange={(event) => setSpacing(Number(event.target.value))}
              />
              <span className="hct-palette__slider-value">{spacing}px</span>
            </div>
          </div>

          <button
            type="button"
            className="hct-palette__button"
            disabled={!result.ok}
            onClick={() => handleCopy(result.text, 'all', 'palette')}
          >
            {feedbackFor('all', 'Copy output')}
          </button>
        </div>

        {result.ok ? (
          <ul
            className={`hct-palette__output${spacing > 0 ? ' hct-palette__output--spaced' : ''}`}
            aria-label="Tonal palette"
            style={{
              gap: `${spacing}px`,
              background: previewBackground,
              color: isDark(previewBackground) ? '#FFFFFF' : '#000000',
            }}
          >
            {result.entries.map(({ tone, hex }, index) => (
              <li key={`${index}-${tone}`}>
                <button
                  type="button"
                  className="hct-palette__entry"
                  aria-label={`Copy tone ${tone} (${hex})`}
                  onClick={() => handleCopy(hex, index, `tone ${tone} (${hex})`)}
                >
                  <span
                    className="hct-palette__swatch"
                    style={{ background: hex }}
                  />
                  <span className="hct-palette__info">
                    <span className="hct-palette__tone">{tone}</span>
                    <span>{feedbackFor(index, hex)}</span>
                  </span>
                </button>
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

        <p
          className="hct-palette__visually-hidden"
          role="status"
          aria-live="polite"
        >
          {feedbackAnnouncement()}
        </p>
      </div>
    </>
  );
};

export default HctPaletteGenerator;
