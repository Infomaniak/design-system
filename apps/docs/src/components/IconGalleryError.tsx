import React from 'react';
import type { IconGalleryErrorType } from '../hooks/useIconGallery.ts';

export interface IconGalleryErrorProps {
  error: IconGalleryErrorType;
  onRetry: () => void;
}

const IconGalleryError: React.FC<IconGalleryErrorProps> = ({ error, onRetry }) => {
  return (
    <>
      <style>{`
        .icon-gallery-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
        }
        .icon-gallery-error__icon {
          margin-bottom: 1rem;
          color: #ef4444;
        }
        .icon-gallery-error__title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .icon-gallery-error__message {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 1.5rem;
          max-width: 400px;
        }
        .icon-gallery-error__button {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          background-color: #3b82f6;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .icon-gallery-error__button:hover {
          background-color: #2563eb;
        }
      `}</style>
      <div className="icon-gallery-error">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="icon-gallery-error__icon"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="12"
          />
          <line
            x1="12"
            y1="16"
            x2="12.01"
            y2="16"
          />
        </svg>

        <h3 className="icon-gallery-error__title">Something went wrong</h3>

        <p className="icon-gallery-error__message">{error.message}</p>

        <button
          onClick={onRetry}
          className="icon-gallery-error__button"
        >
          Retry
        </button>
      </div>
    </>
  );
};

export default IconGalleryError;
