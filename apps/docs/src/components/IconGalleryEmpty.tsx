import React from 'react';

export interface IconGalleryEmptyProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

const IconGalleryEmpty: React.FC<IconGalleryEmptyProps> = ({ searchQuery = '', onClearSearch }) => {
  const hasQuery = searchQuery.length > 0;

  return (
    <>
      <style>{`
        .icon-gallery-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
        }
        .icon-gallery-empty__icon {
          margin-bottom: 1rem;
          color: #9ca3af;
        }
        .icon-gallery-empty__title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .icon-gallery-empty__text {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 0;
        }
        .icon-gallery-empty__text--with-query {
          margin-bottom: 1.5rem;
        }
        .icon-gallery-empty__button {
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
        .icon-gallery-empty__button:hover {
          background-color: #2563eb;
        }
      `}</style>
      <div className="icon-gallery-empty">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="icon-gallery-empty__icon"
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

        <h3 className="icon-gallery-empty__title">
          {hasQuery ? `No icons found for "${searchQuery}"` : 'No icons in this collection'}
        </h3>

        <p
          className={`icon-gallery-empty__text${hasQuery ? ' icon-gallery-empty__text--with-query' : ''}`}
        >
          {hasQuery
            ? 'Try adjusting your search terms or browse all icons'
            : 'This collection appears to be empty. Try selecting a different collection.'}
        </p>

        {hasQuery && onClearSearch && (
          <button
            onClick={onClearSearch}
            className="icon-gallery-empty__button"
          >
            Clear search
          </button>
        )}
      </div>
    </>
  );
};

export default IconGalleryEmpty;
