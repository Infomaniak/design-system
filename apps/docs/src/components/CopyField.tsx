import React, { useCallback, useState } from 'react';
import type { CopyFieldProps } from '../types/icon-metadata.ts';

const COPY_FEEDBACK_DURATION_MS = 1500;

type CopyStatus = 'idle' | 'copied' | 'failed';

const CopyField: React.FC<CopyFieldProps> = ({
  label,
  value,
  monospace = false,
  className = '',
}) => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), COPY_FEEDBACK_DURATION_MS);
    } catch {
      setCopyStatus('failed');
      setTimeout(() => setCopyStatus('idle'), COPY_FEEDBACK_DURATION_MS);
    }
  }, [value]);

  const getFeedbackText = (): string => {
    switch (copyStatus) {
      case 'copied':
        return 'Copied!';
      case 'failed':
        return 'Copy failed';
      default:
        return 'Copy';
    }
  };

  return (
    <>
      <style>{`
        .copy-field {
          margin-bottom: 16px;
        }
        .copy-field__label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .copy-field__container {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }
        .copy-field__value {
          flex: 1;
          font-size: 14px;
          color: #111827;
          word-break: break-all;
        }
        .copy-field__value--monospace {
          font-family: monospace;
        }
        .copy-field__button {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .copy-field__button:hover {
          background-color: #f3f4f6;
        }
        .copy-field__button:active {
          background-color: #e5e7eb;
        }
        .copy-field__button:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        .copy-field__tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 8px;
          background-color: #111827;
          color: #ffffff;
          font-size: 12px;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
          margin-bottom: 4px;
        }
        .copy-field__tooltip--visible {
          opacity: 1;
        }
        .copy-field__button-wrapper {
          position: relative;
        }
      `}</style>
      <div className={`copy-field ${className}`}>
        <div className="copy-field__label">{label}:</div>
        <div className="copy-field__container">
          <span className={`copy-field__value ${monospace ? 'copy-field__value--monospace' : ''}`}>
            {value}
          </span>
          <div className="copy-field__button-wrapper">
            <button
              className="copy-field__button"
              onClick={handleCopy}
              aria-label={getFeedbackText()}
              title={getFeedbackText()}
              type="button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect
                  x="9"
                  y="9"
                  width="13"
                  height="13"
                  rx="2"
                  ry="2"
                />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <span
              className={`copy-field__tooltip ${copyStatus !== 'idle' ? 'copy-field__tooltip--visible' : ''}`}
              role="status"
              aria-live="polite"
            >
              {getFeedbackText()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyField;
