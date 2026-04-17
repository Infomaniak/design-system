import type { IconMetadataDisplayProps } from '../types/icon-metadata.ts';

const IconMetadataDisplay = ({ metadata }: IconMetadataDisplayProps) => {
  const tags = metadata.tags.map((tag) => (
    <span
      key={tag}
      className="metadata-pill"
    >
      {tag}
    </span>
  ));

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
        .metadata-pill {
          font-family: monospace;
          font-size: 12px;
          background-color: var(--esds-color-gray-100);
          padding: 6px 8px;
          border-radius: 200px;
          display: flex;
          white-space: nowrap;
          width: max-content;
        }
      `}</style>
      <div className="metadata-section">
        <div className="metadata-label">Tags:</div>
        <div className="metadata-value">{tags.length > 0 ? tags : 'No tags'}</div>
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
