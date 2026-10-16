import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SCAN_SCOPE,
  parseScanScope,
  requiresSelection,
  scanRootsFor,
} from './scan-scope.ts';

describe('parseScanScope', () => {
  it('keeps the three known scopes', () => {
    expect(parseScanScope('selection')).toBe('selection');
    expect(parseScanScope('page')).toBe('page');
    expect(parseScanScope('file')).toBe('file');
  });

  it('falls back to the default selection scope for unknown or missing values', () => {
    expect(parseScanScope(undefined)).toBe('selection');
    expect(parseScanScope('')).toBe('selection');
    expect(parseScanScope('document')).toBe('selection');
    expect(parseScanScope('SELECTION')).toBe('selection');
  });

  it('defaults to selection', () => {
    expect(DEFAULT_SCAN_SCOPE).toBe('selection');
  });
});

describe('scanRootsFor', () => {
  it('maps each scope to its root descriptor', () => {
    expect(scanRootsFor('selection')).toBe('selection');
    expect(scanRootsFor('page')).toBe('page-children');
    expect(scanRootsFor('file')).toBe('all-pages-children');
  });
});

describe('requiresSelection', () => {
  it('is only true for the selection scope', () => {
    expect(requiresSelection('selection')).toBe(true);
    expect(requiresSelection('page')).toBe(false);
    expect(requiresSelection('file')).toBe(false);
  });
});
