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
    categories: [],
    aliases: [],
    collection: 'Material Symbols',
    license: 'Apache 2.0',
  };

  it('renders tags section', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.getByText('Tags:')).toBeTruthy();
    expect(screen.getByText('home')).toBeTruthy();
    expect(screen.getByText('house')).toBeTruthy();
    expect(screen.getByText('building')).toBeTruthy();
  });

  it('hides tags section when tags are empty', () => {
    const noTagsMetadata: IconMetadata = {
      ...mockMetadata,
      tags: [],
    };
    render(<IconMetadataDisplay metadata={noTagsMetadata} />);
    expect(screen.queryByText('Tags:')).toBeNull();
  });

  it('renders categories section', () => {
    const metadataWithCategories: IconMetadata = {
      ...mockMetadata,
      categories: ['Buildings', 'Navigation'],
    };
    render(<IconMetadataDisplay metadata={metadataWithCategories} />);
    expect(screen.getByText('Categories:')).toBeTruthy();
    expect(screen.getByText('Buildings')).toBeTruthy();
    expect(screen.getByText('Navigation')).toBeTruthy();
  });

  it('hides categories section when categories are empty', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.queryByText('Categories:')).toBeNull();
  });

  it('renders aliases section', () => {
    const metadataWithAliases: IconMetadata = {
      ...mockMetadata,
      aliases: ['home-outline', 'cottage'],
    };
    render(<IconMetadataDisplay metadata={metadataWithAliases} />);
    expect(screen.getByText('Aliases (deprecated):')).toBeTruthy();
    expect(screen.getByText('home-outline')).toBeTruthy();
    expect(screen.getByText('cottage')).toBeTruthy();
  });

  it('hides aliases section when aliases are empty', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.queryByText('Aliases (deprecated):')).toBeNull();
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
});
