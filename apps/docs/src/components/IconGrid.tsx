import React, { useCallback, useState } from 'react';
import type { IconItem } from '../hooks/useIconGallery.ts';
import IconCard from './IconCard.tsx';
import IconDetailModal from './IconDetailModal.tsx';

export interface IconGridProps {
  icons: readonly IconItem[];
  prefix: string;
  iconSize?: number;
}

const IconGrid: React.FC<IconGridProps> = ({ icons, prefix, iconSize }) => {
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIconClick = useCallback((icon: IconItem) => {
    setSelectedIcon(icon);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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
            iconSize={iconSize}
            onClick={handleIconClick}
          />
        ))}
      </div>
      <IconDetailModal
        icon={selectedIcon}
        isOpen={isModalOpen}
        prefix={prefix}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default IconGrid;
