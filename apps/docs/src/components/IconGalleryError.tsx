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
          fill="none"
          viewBox="0 0 24 24"
          className="icon-gallery-error__icon"
        >
          <path
            fill="currentColor"
            d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15"
          />
          <path
            fill="currentColor"
            d="M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16"
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
