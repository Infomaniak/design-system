import React from 'react';
import type { IconItem } from '../hooks/useIconGallery.ts';
import IconCard from './IconCard.tsx';

export interface IconGridProps {
  icons: readonly IconItem[];
  prefix: string;
}

const IconGrid: React.FC<IconGridProps> = ({ icons, prefix }) => {
  if (icons.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        .icon-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .icon-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .icon-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
      <div className="icon-grid">
        {icons.map((icon) => (
          <IconCard
            key={`${prefix}:${icon.name}`}
            icon={icon}
            prefix={prefix}
          />
        ))}
      </div>
    </>
  );
};

export default IconGrid;
