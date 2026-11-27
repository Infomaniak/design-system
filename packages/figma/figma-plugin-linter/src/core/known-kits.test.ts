import { describe, expect, it } from 'vitest';
import { isKnownKitLibrary, isKnownKitVariable } from './known-kits.ts';
import { variableInfo } from './testing/fixtures.ts';

describe('isKnownKitLibrary', () => {
  it('accepts Edelweiss kit libraries case-insensitively', () => {
    expect(isKnownKitLibrary('Edelweiss - Token Core')).toBe(true);
    expect(isKnownKitLibrary('Edelweiss - Material Kit')).toBe(true);
    expect(isKnownKitLibrary('edelweiss - ios - ipados kit')).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    expect(isKnownKitLibrary('  Edelweiss - Token Core ')).toBe(true);
  });

  it('rejects foreign libraries and near-misses', () => {
    expect(isKnownKitLibrary('DS tokens')).toBe(false);
    expect(isKnownKitLibrary('Material Design 3')).toBe(false);
    expect(isKnownKitLibrary('')).toBe(false);
  });
});

describe('isKnownKitVariable', () => {
  it('accepts variables stamped from a known kit library', () => {
    const variable = variableInfo({
      name: 'button-size/lg',
      collectionName: 'button-size',
      tier: 'unknown',
      remote: true,
      knownKit: true,
    });

    expect(isKnownKitVariable(variable)).toBe(true);
  });

  it('accepts remote Material scheme variables by name namespace', () => {
    const variable = variableInfo({
      name: 'Schemes/Surface Container',
      collectionName: 'Theme',
      tier: 'unknown',
      remote: true,
    });

    expect(isKnownKitVariable(variable)).toBe(true);
  });

  it('rejects raw palette collections shipped inside kit libraries', () => {
    const paletteStep = variableInfo({
      name: 'Red/100',
      collectionName: 'Primitives',
      tier: 'unknown',
      remote: true,
      knownKit: true,
    });

    expect(isKnownKitVariable(paletteStep)).toBe(false);
  });

  it('rejects variables without the stamp from collections that are not kit namespaces', () => {
    // The old collection-name list is gone: a `theme` binding is only
    // accepted through the library stamp or a kit namespace.
    const unstamped = variableInfo({
      name: 'foreground',
      collectionName: 'theme',
      tier: 'unknown',
      remote: true,
    });

    expect(isKnownKitVariable(unstamped)).toBe(false);
  });

  it('matches namespaces case-insensitively', () => {
    expect(
      isKnownKitVariable(
        variableInfo({ name: 'schemes/primary', collectionName: 'Theme', tier: 'unknown' }),
      ),
    ).toBe(true);
  });

  it('rejects local copies of kit collections', () => {
    const localCopy = variableInfo({
      name: 'Schemes/Primary',
      collectionName: 'Theme',
      tier: 'unknown',
      remote: false,
      knownKit: true,
    });

    expect(isKnownKitVariable(localCopy)).toBe(false);
  });

  it('rejects foreign and near-miss namespaces', () => {
    expect(
      isKnownKitVariable(
        variableInfo({ name: 'foreground', collectionName: 'third-party', tier: 'unknown' }),
      ),
    ).toBe(false);
    expect(
      isKnownKitVariable(
        variableInfo({ name: 'Schemes-old/x', collectionName: 'Theme', tier: 'unknown' }),
      ),
    ).toBe(false);
  });

  it('rejects unnamed namespaces', () => {
    expect(
      isKnownKitVariable(variableInfo({ name: 'x', collectionName: '', tier: 'unknown' })),
    ).toBe(false);
  });
});
