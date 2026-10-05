import type { IconMetadataDisplayProps } from '../types/icon-metadata.ts';

function toPill(label: string) {
  return (
    <span
      key={label}
      className="metadata-pill"
    >
      {label}
    </span>
  );
}

const IconMetadataDisplay = ({
  metadata: { collection, license, tags, categories, aliases },
}: IconMetadataDisplayProps) => {
  return (
    <>
      <style>{`
        .metadata-section {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: center;
          gap: 8px;
          margin-bottom: var(--esds-spacing-2xl);
        }
        .metadata-label {
          font-size: 14px;
          color: #6b7280;
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
      {tags.length > 0 && (
        <div className="metadata-section">
          <div className="metadata-label">Tags:</div>
          {tags.map(toPill)}
        </div>
      )}
      {categories.length > 0 && (
        <div className="metadata-section">
          <div className="metadata-label">Categories:</div>
          {categories.map(toPill)}
        </div>
      )}
      {aliases.length > 0 && (
        <div className="metadata-section">
          <div className="metadata-label">Aliases (deprecated):</div>
          {aliases.map(toPill)}
        </div>
      )}
      <div className="metadata-section">
        <div className="metadata-label">Collection:</div>
        <div className="metadata-value">{collection}</div>
      </div>
      <div className="metadata-section">
        <div className="metadata-label">License:</div>
        <div className="metadata-value">{license}</div>
      </div>
    </>
  );
};

export default IconMetadataDisplay;
