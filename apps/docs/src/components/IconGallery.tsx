import React from 'react';
import { useIconGallery } from '../hooks/useIconGallery.ts';
import IconCollectionFilter from './IconCollectionFilter.tsx';
import IconGalleryEmpty from './IconGalleryEmpty.tsx';
import IconGalleryError from './IconGalleryError.tsx';
import IconGallerySkeleton from './IconGallerySkeleton.tsx';
import IconGrid from './IconGrid.tsx';
import IconSearchBar from './IconSearchBar.tsx';

const IconGallery: React.FC = () => {
  const {
    collections,
    icons,
    totalCount,
    filteredCount,
    selectedCollection,
    searchQuery,
    isLoading,
    isLoadingCollections,
    error,
    setCollection,
    setSearchQuery,
    retry,
    clearSearch,
  } = useIconGallery();

  const handleCollectionChange = (collection: string): void => {
    setCollection(collection);
  };

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
  };

  const handleClearSearch = (): void => {
    clearSearch();
  };

  const handleRetry = (): void => {
    retry();
  };

  const renderContent = (): React.ReactNode => {
    if (isLoadingCollections) {
      return (
        <div className="icon-gallery__loading">
          <IconGallerySkeleton />
          <p className="icon-gallery__loading-text">Loading collections...</p>
        </div>
      );
    }

    if (isLoading) {
      return <IconGallerySkeleton />;
    }

    if (error !== null) {
      return (
        <IconGalleryError
          error={error}
          onRetry={handleRetry}
        />
      );
    }

    if (icons.length === 0) {
      return (
        <IconGalleryEmpty
          searchQuery={searchQuery}
          onClearSearch={searchQuery.length > 0 ? handleClearSearch : undefined}
        />
      );
    }

    return (
      <IconGrid
        icons={icons}
        prefix={selectedCollection}
      />
    );
  };

  const isDisabled = isLoading || error !== null;

  return (
    <>
      <style>{`
        .icon-gallery {
          padding: 1.5rem;
        }
        .icon-gallery__header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .icon-gallery__title-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .icon-gallery__title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .icon-gallery__count {
          font-size: 14px;
          color: #6b7280;
        }
        .icon-gallery__controls-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .icon-gallery__controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .icon-gallery__controls {
            flex-direction: row;
          }
        }
        .icon-gallery__search {
          flex: 1 1 auto;
        }
        .icon-gallery__filter {
          flex: 0 0 auto;
          min-width: 200px;
        }
        .icon-gallery__loading {
          text-align: center;
          padding: 3rem 1rem;
        }
        .icon-gallery__loading-text {
          margin-top: 1rem;
          color: #6b7280;
          font-size: 14px;
        }
      `}</style>
      <div className="icon-gallery">
        <div className="icon-gallery__header">
          <div className="icon-gallery__title-row">
            <h1 className="icon-gallery__title">Icon Gallery</h1>
            <span className="icon-gallery__count">
              Showing {filteredCount} of {totalCount} icons
            </span>
          </div>

          <div className="icon-gallery__controls-wrapper">
            <div className="icon-gallery__controls">
              <div className="icon-gallery__search">
                <IconSearchBar
                  value={searchQuery}
                  onChange={handleSearchChange}
                  disabled={isDisabled}
                  onClear={handleClearSearch}
                />
              </div>
              <div className="icon-gallery__filter">
                <IconCollectionFilter
                  collections={collections}
                  selected={selectedCollection}
                  onChange={handleCollectionChange}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>
        </div>

        <div>{renderContent()}</div>
      </div>
    </>
  );
};

export default IconGallery;
