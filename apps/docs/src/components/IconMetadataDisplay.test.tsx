/**
 * @vitest-environment happy-dom
 */

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { IconMetadata } from '../types/icon-metadata.ts';
import IconMetadataDisplay from './IconMetadataDisplay.tsx';

describe('IconMetadataDisplay', () => {
  afterEach(() => {
    cleanup();
  });

  const mockMetadata: IconMetadata = {
    name: 'home',
    iconId: 'material-symbols:home',
    tags: ['home', 'house', 'building'],
    collection: 'Material Symbols',
    license: 'Apache 2.0',
  };

  it('renders tags section', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.getByText('Tags:')).toBeTruthy();
    expect(screen.getByText('home, house, building')).toBeTruthy();
  });

  it('renders collection', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.getByText('Collection:')).toBeTruthy();
    expect(screen.getByText('Material Symbols')).toBeTruthy();
  });

  it('renders license', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.getByText('License:')).toBeTruthy();
    expect(screen.getByText('Apache 2.0')).toBeTruthy();
  });

  it('handles empty tags', () => {
    const noTagsMetadata: IconMetadata = {
      ...mockMetadata,
      tags: [],
    };
    render(<IconMetadataDisplay metadata={noTagsMetadata} />);
    expect(screen.getByText('Tags:')).toBeTruthy();
    expect(screen.getByText('No tags')).toBeTruthy();
  });
});
