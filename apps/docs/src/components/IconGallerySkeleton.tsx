import React from 'react';

export interface IconGallerySkeletonProps {
  count?: number;
}

const IconGallerySkeleton: React.FC<IconGallerySkeletonProps> = ({ count = 20 }) => {
  return (
    <>
      <style>{`
        .icon-gallery-skeleton {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .icon-gallery-skeleton {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .icon-gallery-skeleton {
            grid-template-columns: repeat(5, 1fr);
          }
        }
        @keyframes skeleton-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .icon-gallery-skeleton__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: #f9fafb;
          min-height: 120px;
          gap: 0.75rem;
          animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .icon-gallery-skeleton__icon {
          width: 48px;
          height: 48px;
          background-color: #e5e7eb;
          border-radius: 4px;
        }
        .icon-gallery-skeleton__text {
          width: 80%;
          height: 16px;
          background-color: #e5e7eb;
          border-radius: 4px;
        }
      `}</style>
      <div className="icon-gallery-skeleton">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="icon-gallery-skeleton__item"
          >
            <div className="icon-gallery-skeleton__icon" />
            <div className="icon-gallery-skeleton__text" />
          </div>
        ))}
      </div>
    </>
  );
};

export default IconGallerySkeleton;
