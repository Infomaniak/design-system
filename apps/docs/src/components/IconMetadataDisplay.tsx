import type { IconMetadataDisplayProps } from '../types/icon-metadata.ts';

const IconMetadataDisplay = ({ metadata }: IconMetadataDisplayProps) => {
  return (
    <>
      <style>{`
        .metadata-section {
          margin-bottom: 16px;
        }
        .metadata-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .metadata-value {
          font-size: 14px;
          color: #111827;
        }
      `}</style>
      <div className="metadata-section">
        <div className="metadata-label">Categories:</div>
        <div className="metadata-value">
          {metadata.categories.length > 0 ? metadata.categories.join(', ') : 'No categories'}
        </div>
      </div>
      <div className="metadata-section">
        <div className="metadata-label">Aliases:</div>
        <div className="metadata-value">
          {metadata.aliases.length > 0 ? metadata.aliases.join(', ') : 'No aliases'}
        </div>
      </div>
      <div className="metadata-section">
        <div className="metadata-label">Collection:</div>
        <div className="metadata-value">{metadata.collection}</div>
      </div>
      <div className="metadata-section">
        <div className="metadata-label">License:</div>
        <div className="metadata-value">{metadata.license}</div>
      </div>
    </>
  );
};

export default IconMetadataDisplay;
