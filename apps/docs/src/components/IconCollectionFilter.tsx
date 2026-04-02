import React from 'react';

export interface IconCollectionFilterProps {
  collections: readonly string[];
  selected: string;
  onChange: (collection: string) => void;
  disabled?: boolean;
}

const IconCollectionFilter: React.FC<IconCollectionFilterProps> = ({
  collections,
  selected,
  onChange,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(e.target.value);
  };

  const sortedCollections = React.useMemo(() => {
    return [...collections].sort((a, b) => a.localeCompare(b));
  }, [collections]);

  return (
    <>
      <style>{`
        .icon-collection-filter {
          width: 100%;
          padding: 10px 36px 10px 12px;
          font-size: 14px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          outline: none;
          background-color: #ffffff;
          color: #111827;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }
        .icon-collection-filter:focus {
          border-color: #3b82f6;
        }
        .icon-collection-filter:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
          background-image: none;
        }
      `}</style>
      <select
        id="collection-select"
        aria-label="Icon collection"
        value={selected}
        onChange={handleChange}
        disabled={disabled}
        className="icon-collection-filter"
      >
        {sortedCollections.map((collection) => (
          <option
            key={collection}
            value={collection}
          >
            {collection}
          </option>
        ))}
      </select>
    </>
  );
};

export default IconCollectionFilter;
