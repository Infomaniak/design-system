import React from 'react';
import type { IconItem } from '../hooks/useIconGallery.ts';

export interface IconCardProps {
  icon: IconItem;
  prefix: string;
}

const IconCard: React.FC<IconCardProps> = ({ icon, prefix }) => {
  const iconId = `${prefix}:${icon.name}`;

  return (
    <>
      <style>{`
        .icon-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: #ffffff;
          transition: background-color 0.2s ease;
          cursor: pointer;
          min-height: 120px;
          gap: 0.75rem;
        }
        .icon-card:hover {
          background-color: #f9fafb;
        }
        .icon-card__icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          border-radius: 4px;
        }
        .icon-card__code {
          font-size: 12px;
          font-family: monospace;
          color: #374151;
          text-align: center;
          word-break: break-all;
          line-height: 1.4;
        }
      `}</style>
      <div className="icon-card">
        <div className="icon-card__icon">
          <esds-icon
            name={iconId}
            mode="bg"
            style={{ width: '48px', height: '48px' }}
          ></esds-icon>
        </div>
        <code className="icon-card__code">{iconId}</code>
      </div>
    </>
  );
};

export default IconCard;
