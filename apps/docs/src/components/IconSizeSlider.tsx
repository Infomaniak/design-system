import React from 'react';

export interface IconSizeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const DEFAULT_MIN = 16;
const DEFAULT_MAX = 96;
const DEFAULT_STEP = 2;

const IconSizeSlider: React.FC<IconSizeSliderProps> = ({
  value,
  onChange,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(Number(e.target.value));
  };

  return (
    <>
      <style>{`
        .icon-size-slider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 200px;
        }
        .icon-size-slider__label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
        }
        .icon-size-slider__input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          margin: 0;
          padding: 0;
          background: #e5e7eb;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          vertical-align: middle;
        }
        .icon-size-slider__input::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 3px;
        }
        .icon-size-slider__input::-moz-range-track {
          height: 6px;
          border-radius: 3px;
        }
        .icon-size-slider__input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          margin-top: -6px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: transform 0.1s ease;
        }
        .icon-size-slider__input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: transform 0.1s ease;
        }
        .icon-size-slider__input::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .icon-size-slider__input::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
        .icon-size-slider__value {
          font-size: 14px;
          font-family: monospace;
          color: #6b7280;
          min-width: 4ch;
          text-align: right;
        }
      `}</style>
      <div className="icon-size-slider">
        <span className="icon-size-slider__label">Size</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="icon-size-slider__input"
          aria-label="Icon size"
          disabled={disabled}
        />
        <span className="icon-size-slider__value">{value}px</span>
      </div>
    </>
  );
};

export default IconSizeSlider;
