import React, { useCallback, useRef, useState } from 'react';

const COPY_FEEDBACK_DURATION_MS = 1500;

type CopyStatus = 'idle' | 'copied' | 'failed';

interface CopyableTextProps {
  /** Value to copy to clipboard */
  readonly value: string;
  /** Optional label text to display before the value */
  readonly label?: string;
  /** Optional children to render instead of value */
  readonly children?: React.ReactNode;
  /** Optional additional className */
  readonly className?: string;
  /** Optional size variant */
  readonly size?: 'sm' | 'md' | 'lg';
}

const CopyableText: React.FC<CopyableTextProps> = ({
  value,
  label,
  children,
  className = '',
  size = 'sm',
}) => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleCopy = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Calculate tooltip position
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });

      try {
        await navigator.clipboard.writeText(value);
        setCopyStatus('copied');
      } catch {
        setCopyStatus('failed');
      }

      // Clear any existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Reset status after delay
      hideTimeoutRef.current = setTimeout(() => {
        setCopyStatus('idle');
      }, COPY_FEEDBACK_DURATION_MS);
    },
    [value],
  );

  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const getTooltipText = (): string => {
    if (copyStatus !== 'idle') {
      switch (copyStatus) {
        case 'copied':
          return 'Copied!';
        case 'failed':
          return 'Failed to copy';
      }
    }
    if (isHovered) {
      return 'Copy to clipboard';
    }
    return '';
  };

  const fontSizeMap = {
    sm: '14px',
    md: '16px',
    lg: '18px',
  };

  return (
    <>
      <style>{`
        .copyable-text {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .copyable-text__label {
          font-size: 14px;
          color: #6b7280;
        }
        .copyable-text__button {
          appearance: none;
          border: 1px solid transparent;
          background: var(--esds-color-gray-100, #f3f4f6);
          font-family: ui-monospace, monospace;
          font-size: var(--button-font-size);
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--esds-color-gray-700, #374151);
          line-height: 1.4;
        }
        .copyable-text__button:hover {
          background: var(--esds-color-gray-200, #e5e7eb);
          border-color: var(--esds-color-gray-300, #d1d5db);
        }
        .copyable-text__button:focus-visible {
          outline: 2px solid var(--esds-color-blue-500, #3b82f6);
          outline-offset: 2px;
        }
        .copyable-text__button:active {
          background: var(--esds-color-gray-300, #d1d5db);
        }
        .copyable-text__tooltip {
          position: fixed;
          background: var(--esds-color-gray-800, #1f2937);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-family: system-ui, -apple-system, sans-serif;
          left: var(--tooltip-x, 0);
          top: var(--tooltip-y, 0);
          transform: translateX(-50%) translateY(-100%);
          pointer-events: none;
          white-space: nowrap;
          z-index: 10001;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .copyable-text__tooltip--visible {
          opacity: 1;
        }
        .copyable-text__tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px;
          border-style: solid;
          border-color: var(--esds-color-gray-800, #1f2937) transparent transparent transparent;
        }
      `}</style>
      <span className={`copyable-text ${className}`}>
        {label && <span className="copyable-text__label">{label}:</span>}
        <button
          ref={buttonRef}
          className="copyable-text__button"
          onClick={handleCopy}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          type="button"
          aria-label={`Copy ${value} to clipboard`}
          style={{ '--button-font-size': fontSizeMap[size] } as React.CSSProperties}
        >
          {children ?? value}
        </button>
      </span>
      <span
        className={`copyable-text__tooltip ${copyStatus !== 'idle' || isHovered ? 'copyable-text__tooltip--visible' : ''}`}
        style={
          {
            '--tooltip-x': `${tooltipPosition.x}px`,
            '--tooltip-y': `${tooltipPosition.y}px`,
          } as React.CSSProperties
        }
        role="status"
        aria-live="polite"
      >
        {getTooltipText()}
      </span>
    </>
  );
};

export default CopyableText;
