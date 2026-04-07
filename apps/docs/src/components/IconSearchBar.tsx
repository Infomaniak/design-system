import React from 'react';

export interface IconSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onClear: () => void;
}

const IconSearchBar: React.FC<IconSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search icons by name...',
  disabled = false,
  onClear,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  const handleClearClick = (): void => {
    onClear();
  };

  const hasValue = value.length > 0;

  return (
    <>
      <style>{`
        .icon-search-bar {
          position: relative;
          display: flex;
          align-items: center;
        }
        .icon-search-bar__input {
          width: 100%;
          padding: 10px 40px 10px 40px;
          font-size: 14px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          outline: none;
          background-color: #ffffff;
          color: #111827;
        }
        .icon-search-bar__input:focus {
          border-color: #3b82f6;
        }
        .icon-search-bar__input:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }
        .icon-search-bar__icon {
          position: absolute;
          left: 12px;
          pointer-events: none;
          color: #6b7280;
        }
        .icon-search-bar__icon:has(+ input:disabled) {
          opacity: 0.5;
        }
        .icon-search-bar__clear {
          position: absolute;
          right: 10px;
          padding: 4px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-search-bar__clear:hover {
          background-color: #f3f4f6;
        }
      `}</style>
      <div className="icon-search-bar">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="icon-search-bar__icon"
        >
          <circle
            cx="11"
            cy="11"
            r="8"
          />
          <line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="icon-search-bar__input"
        />
        {hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClearClick}
            className="icon-search-bar__clear"
            aria-label="Clear search"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default IconSearchBar;
