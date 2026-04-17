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
    categories: ['navigation', 'building'],
    aliases: ['house', 'residence'],
    collection: 'Material Symbols',
    license: 'Apache 2.0',
  };

  it('renders categories section', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.getByText('Categories:')).toBeTruthy();
    expect(screen.getByText('navigation, building')).toBeTruthy();
  });

  it('renders aliases section', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.getByText('Aliases:')).toBeTruthy();
    expect(screen.getByText('house, residence')).toBeTruthy();
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

  it('handles empty categories', () => {
    const noCategoriesMetadata: IconMetadata = {
      ...mockMetadata,
      categories: [],
    };
    render(<IconMetadataDisplay metadata={noCategoriesMetadata} />);
    expect(screen.getByText('Categories:')).toBeTruthy();
    expect(screen.getByText('No categories')).toBeTruthy();
  });

  it('handles empty aliases', () => {
    const noAliasesMetadata: IconMetadata = {
      ...mockMetadata,
      aliases: [],
    };
    render(<IconMetadataDisplay metadata={noAliasesMetadata} />);
    expect(screen.getByText('Aliases:')).toBeTruthy();
    expect(screen.getByText('No aliases')).toBeTruthy();
  });
});
