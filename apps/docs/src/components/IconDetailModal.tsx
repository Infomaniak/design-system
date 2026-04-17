import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { iconifyApi } from '../lib/iconify-api.ts';
import type { IconDetailModalProps, IconMetadata } from '../types/icon-metadata.ts';
import CopyableText from './CopyableText.tsx';
import IconMetadataDisplay from './IconMetadataDisplay.tsx';

export default function IconDetailModal({ icon, isOpen, prefix, onClose }: IconDetailModalProps) {
  const [metadata, setMetadata] = useState<IconMetadata | null>(null);

  useEffect(() => {
    if (isOpen && icon) {
      // Fetch metadata from Iconify API with collection info
      iconifyApi
        .listIcons({ prefix, info: true })
        .then(({ icons, info }) => {
          const foundIcon = icons.find((i) => i.name === icon.name);
          if (foundIcon) {
            setMetadata({
              name: foundIcon.name,
              iconId: `${prefix}:${foundIcon.name}`,
              tags: Array.from(foundIcon.categories || new Set()),
              collection: info?.name ?? prefix,
              license: info?.license?.title ?? 'Unknown License',
            });
          } else {
            setMetadata(null);
          }
        })
        .catch(() => {
          setMetadata(null);
        });
    } else {
      setMetadata(null);
    }
  }, [isOpen, icon, prefix]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !icon) {
    return null;
  }

  const handleBackdropClick = () => {
    onClose();
  };

  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const iconName = `${prefix}:${icon.name}`;
  const esdsSnippet = `<esds-svg name="${iconName}" />`;

  const portalTarget = document.getElementById('modal-root') || document.body;

  return createPortal(
    <div
      data-testid="modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        aria-label="Icon details"
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          ×
        </button>

        <div style={{ width: '96px', height: '96px' }}>
          <esds-svg name={iconName} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <CopyableText
            value={iconName}
            label=""
            size="lg"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <CopyableText
            value={esdsSnippet}
            label="Component"
          />
        </div>

        {metadata && <IconMetadataDisplay metadata={metadata} />}
      </div>
    </div>,
    portalTarget,
  );
}
