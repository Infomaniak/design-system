# Icon Detail Modal - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a modal dialog that opens when clicking icons in the gallery, displaying icon metadata with copy functionality

**Architecture:** React components in apps/docs with focus trap and scroll lock. Modified IconCard/IconGrid to trigger modal. New components: IconDetailModal (portal), CopyField (reusable), IconMetadataDisplay.

**Tech Stack:** React 19, TypeScript, Custom esds-svg component, Tailwind CSS v4, Vitest for testing

---

## File Structure Overview

**New files to create:**

- `apps/docs/src/types/icon-metadata.ts` - TypeScript interfaces
- `apps/docs/src/components/IconMetadataDisplay.tsx` - Metadata rendering component
- `apps/docs/src/components/CopyField.tsx` - Copy button component with tooltip
- `apps/docs/src/components/IconDetailModal.tsx` - Main modal component
- `apps/docs/src/components/IconDetailModal.test.tsx` - Comprehensive tests

**Files to modify:**

- `apps/docs/src/components/IconCard.tsx` - Add onClick prop
- `apps/docs/src/components/IconGrid.tsx` - Manage modal state

---

## Task 1: Create TypeScript Types

**Files:**

- Create: `apps/docs/src/types/icon-metadata.ts`
- Test: `tests` (will be tested indirectly through component tests)

- [ ] **Step 1: Write type definitions**

```typescript
// apps/docs/src/types/icon-metadata.ts
/**
 * Metadata for a single icon from Iconify API
 */
export interface IconMetadata {
  /** Icon name without prefix */
  readonly name: string;
  /** Full icon ID with prefix (e.g., 'material-symbols:home') */
  readonly iconId: string;
  /** Associated tags and aliases */
  readonly tags: readonly string[];
  /** Collection/prefix name */
  readonly collection: string;
  /** License information */
  readonly license: string;
}

/**
 * Props for IconDetailModal component
 */
export interface IconDetailModalProps {
  /** The icon data to display, null when closed */
  readonly icon: {
    readonly name: string;
    readonly categories: ReadonlySet<string>;
  } | null;
  /** Whether the modal is visible */
  readonly isOpen: boolean;
  /** Collection prefix */
  readonly prefix: string;
  /** Called when modal should close */
  readonly onClose: () => void;
}

/**
 * Props for CopyField component
 */
export interface CopyFieldProps {
  /** Label shown above the field */
  readonly label: string;
  /** Value to display and copy */
  readonly value: string;
  /** Whether to use monospace font */
  readonly monospace?: boolean;
  /** Optional additional className */
  readonly className?: string;
}

/**
 * Props for IconMetadataDisplay component
 */
export interface IconMetadataDisplayProps {
  /** Metadata to display */
  readonly metadata: IconMetadata;
}
```

- [ ] **Step 2: Verify types are valid TypeScript**

Run: `cd apps/docs && npx tsc --noEmit src/types/icon-metadata.ts`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add apps/docs/src/types/icon-metadata.ts
git commit -m "feat(icon-modal): add TypeScript types for icon metadata"
```

---

## Task 2: Create IconMetadataDisplay Component

**Files:**

- Create: `apps/docs/src/components/IconMetadataDisplay.tsx`
- Create: `apps/docs/src/components/IconMetadataDisplay.test.tsx`

- [ ] **Step 1: Write failing test**

```typescript
// apps/docs/src/components/IconMetadataDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import IconMetadataDisplay from './IconMetadataDisplay.tsx';
import type { IconMetadata } from '../types/icon-metadata.ts';

describe('IconMetadataDisplay', () => {
  const mockMetadata: IconMetadata = {
    name: 'home',
    iconId: 'material-symbols:home',
    tags: ['home', 'house', 'building'],
    collection: 'Material Symbols',
    license: 'Apache 2.0',
  };

  it('renders tags section', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.getByText('Tags:')).toBeInTheDocument();
    expect(screen.getByText('home, house, building')).toBeInTheDocument();
  });

  it('renders collection', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.getByText('Collection:')).toBeInTheDocument();
    expect(screen.getByText('Material Symbols')).toBeInTheDocument();
  });

  it('renders license', () => {
    render(<IconMetadataDisplay metadata={mockMetadata} />);
    expect(screen.getByText('License:')).toBeInTheDocument();
    expect(screen.getByText('Apache 2.0')).toBeInTheDocument();
  });

  it('handles empty tags', () => {
    const noTagsMetadata: IconMetadata = {
      ...mockMetadata,
      tags: [],
    };
    render(<IconMetadataDisplay metadata={noTagsMetadata} />);
    expect(screen.getByText('Tags:')).toBeInTheDocument();
    expect(screen.getByText('No tags')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/docs && npx vitest run src/components/IconMetadataDisplay.test.tsx`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Write minimal implementation**

```typescript
// apps/docs/src/components/IconMetadataDisplay.tsx
import React from 'react';
import type { IconMetadataDisplayProps } from '../types/icon-metadata.ts';

const IconMetadataDisplay: React.FC<IconMetadataDisplayProps> = ({ metadata }) => {
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
        <div className="metadata-label">Tags:</div>
        <div className="metadata-value">
          {metadata.tags.length > 0 ? metadata.tags.join(', ') : 'No tags'}
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/docs && npx vitest run src/components/IconMetadataDisplay.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/components/IconMetadataDisplay.tsx apps/docs/src/components/IconMetadataDisplay.test.tsx
git commit -m "feat(icon-modal): add IconMetadataDisplay component"
```

---

## Task 3: Create CopyField Component

**Files:**

- Create: `apps/docs/src/components/CopyField.tsx`
- Create: `apps/docs/src/components/CopyField.test.tsx`

- [ ] **Step 1: Write failing test**

```typescript
// apps/docs/src/components/CopyField.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import CopyField from './CopyField.tsx';

describe('CopyField', () => {
  const mockWriteText = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  it('renders label and value', () => {
    render(<CopyField label="Icon Name" value="home" />);
    expect(screen.getByText('Icon Name:')).toBeInTheDocument();
    expect(screen.getByText('home')).toBeInTheDocument();
  });

  it('uses monospace font when monospace prop is true', () => {
    render(<CopyField label="Code" value="<esds-svg />" monospace />);
    const valueElement = screen.getByText('<esds-svg />');
    expect(valueElement).toHaveStyle('font-family: monospace');
  });

  it('copies value to clipboard when copy button is clicked', async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    render(<CopyField label="Name" value="home" />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('home');
    });
  });

  it('shows copied feedback after successful copy', async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    render(<CopyField label="Name" value="home" />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('handles copy failure gracefully', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('Failed'));
    render(<CopyField label="Name" value="home" />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Copy failed')).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/docs && npx vitest run src/components/CopyField.test.tsx`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Write minimal implementation**

```typescript
// apps/docs/src/components/CopyField.tsx
import React, { useState, useCallback } from 'react';
import type { CopyFieldProps } from '../types/icon-metadata.ts';

const COPY_FEEDBACK_DURATION_MS = 1500;

type CopyStatus = 'idle' | 'copied' | 'failed';

const CopyField: React.FC<CopyFieldProps> = ({
  label,
  value,
  monospace = false,
  className = ''
}) => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), COPY_FEEDBACK_DURATION_MS);
    } catch {
      setCopyStatus('failed');
      setTimeout(() => setCopyStatus('idle'), COPY_FEEDBACK_DURATION_MS);
    }
  }, [value]);

  const getFeedbackText = (): string => {
    switch (copyStatus) {
      case 'copied':
        return 'Copied!';
      case 'failed':
        return 'Copy failed';
      default:
        return 'Copy';
    }
  };

  return (
    <>
      <style>{`
        .copy-field {
          margin-bottom: 16px;
        }
        .copy-field__label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .copy-field__container {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }
        .copy-field__value {
          flex: 1;
          font-size: 14px;
          color: #111827;
          word-break: break-all;
        }
        .copy-field__value--monospace {
          font-family: monospace;
        }
        .copy-field__button {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .copy-field__button:hover {
          background-color: #f3f4f6;
        }
        .copy-field__button:active {
          background-color: #e5e7eb;
        }
        .copy-field__button:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        .copy-field__tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 8px;
          background-color: #111827;
          color: #ffffff;
          font-size: 12px;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
          margin-bottom: 4px;
        }
        .copy-field__tooltip--visible {
          opacity: 1;
        }
        .copy-field__button-wrapper {
          position: relative;
        }
      `}</style>
      <div className={`copy-field ${className}`}>
        <div className="copy-field__label">{label}:</div>
        <div className="copy-field__container">
          <span
            className={`copy-field__value ${monospace ? 'copy-field__value--monospace' : ''}`}
          >
            {value}
          </span>
          <div className="copy-field__button-wrapper">
            <button
              className="copy-field__button"
              onClick={handleCopy}
              aria-label={getFeedbackText()}
              title={getFeedbackText()}
              type="button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <span
              className={`copy-field__tooltip ${copyStatus !== 'idle' ? 'copy-field__tooltip--visible' : ''}`}
              role="status"
              aria-live="polite"
            >
              {getFeedbackText()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyField;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/docs && npx vitest run src/components/CopyField.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/components/CopyField.tsx apps/docs/src/components/CopyField.test.tsx
git commit -m "feat(icon-modal): add CopyField component with clipboard functionality"
```

---

## Task 4: Create IconDetailModal Component

**Files:**

- Create: `apps/docs/src/components/IconDetailModal.tsx`
- Create: `apps/docs/src/components/IconDetailModal.test.tsx`

- [ ] **Step 1: Write failing test**

```typescript
// apps/docs/src/components/IconDetailModal.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import IconDetailModal from './IconDetailModal.tsx';

describe('IconDetailModal', () => {
  const mockOnClose = vi.fn();
  const mockIcon = {
    name: 'home',
    categories: new Set(['buildings', 'navigation']),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    // Create portal root
    const portalRoot = document.createElement('div');
    portalRoot.id = 'modal-root';
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    vi.useRealTimers();
    const portalRoot = document.getElementById('modal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={false}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays icon name', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('material-symbols:home')).toBeInTheDocument();
  });

  it('displays esds-svg code snippet', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('<esds-svg name="material-symbols:home" />')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    const closeButton = screen.getByLabelText('Close dialog');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    const modalContent = screen.getByRole('dialog');
    fireEvent.click(modalContent);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('locks body scroll when open', () => {
    render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('unlocks body scroll when closed', () => {
    const { rerender } = render(
      <IconDetailModal
        icon={mockIcon}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <IconDetailModal
        icon={mockIcon}
        isOpen={false}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('renders nothing when icon is null', () => {
    render(
      <IconDetailModal
        icon={null}
        isOpen={true}
        prefix="material-symbols"
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/docs && npx vitest run src/components/IconDetailModal.test.tsx`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Write implementation**

```typescript
// apps/docs/src/components/IconDetailModal.tsx
import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { IconDetailModalProps, IconMetadata } from '../types/icon-metadata.ts';
import CopyField from './CopyField.tsx';
import IconMetadataDisplay from './IconMetadataDisplay.tsx';
import { iconifyApi } from '../lib/iconify-api.ts';

// Simple hardcoded metadata for collections
const COLLECTION_METADATA: Record<string, { license: string }> = {
  'material-symbols': { license: 'Apache 2.0' },
  'heroicons': { license: 'MIT' },
  'phosphor': { license: 'MIT' },
  // Fallback for unknown collections
  default: { license: 'Unknown' },
};

const IconDetailModal: React.FC<IconDetailModalProps> = ({
  icon,
  isOpen,
  prefix,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [metadata, setMetadata] = useState<IconMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      originalOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflowRef.current;
    }
    return () => {
      document.body.style.overflow = originalOverflowRef.current;
    };
  }, [isOpen]);

  const originalOverflowRef = useRef<string>('');

  // Fetch metadata when modal opens
  useEffect(() => {
    if (isOpen && icon) {
      setIsLoading(true);
      const iconId = `${prefix}:${icon.name}`;

      // Get collection metadata
      const collectionMeta = COLLECTION_METADATA[prefix] || COLLECTION_METADATA.default;

      // Try to fetch tags from API
      iconifyApi.listIcons({ prefix })
        .then((icons) => {
          const apiIcon = icons.find(i => i.name === icon.name);
          const tags = apiIcon ? Array.from(apiIcon.categories) : [];

          setMetadata({
            name: icon.name,
            iconId,
            tags,
            collection: prefix,
            license: collectionMeta.license,
          });
        })
        .catch(() => {
          // Fallback: use basic info without tags
          setMetadata({
            name: icon.name,
            iconId,
            tags: [],
            collection: prefix,
            license: collectionMeta.license,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setMetadata(null);
    }
  }, [isOpen, icon, prefix]);

  // Track previous active element
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Handle Escape key
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Return focus on close
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const iconId = useMemo(() => {
    return icon ? `${prefix}:${icon.name}` : '';
  }, [icon, prefix]);

  const esdsSvgCode = useMemo(() => {
    return icon ? `<esds-svg name="${prefix}:${icon.name}" />` : '';
  }, [icon, prefix]);

  if (!isOpen || !icon) {
    return null;
  }

  const modalContent = (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }
        .modal-container {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .modal-header {
          display: flex;
          justify-content: flex-end;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        .modal-close-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: #6b7280;
          transition: background-color 0.2s ease;
        }
        .modal-close-btn:hover {
          background-color: #f3f4f6;
        }
        .modal-close-btn:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        .modal-content {
          padding: 24px;
        }
        .modal-preview {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
          padding: 24px;
          background-color: #f9fafb;
          border-radius: 8px;
        }
        .modal-preview__icon {
          width: 96px;
          height: 96px;
        }
      `}</style>
      <div
        className="modal-overlay"
        onClick={handleBackdropClick}
        ref={modalRef}
        data-testid="modal-backdrop"
      >
        <div
          className="modal-container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-header">
            <button
              ref={closeButtonRef}
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close dialog"
              title="Close"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="modal-content">
            <h2 id="modal-title" className="sr-only">Icon Details</h2>

            <div className="modal-preview">
              <esds-svg
                name={iconId}
                mode="bg"
                className="modal-preview__icon"
              />
            </div>

            <CopyField
              label="Icon Name"
              value={iconId}
              monospace
            />

            <CopyField
              label="Code Snippet"
              value={esdsSvgCode}
              monospace
            />

            {isLoading ? (
              <div>Loading metadata...</div>
            ) : metadata ? (
              <IconMetadataDisplay metadata={metadata} />
            ) : null}
          </div>
        </div>
      </div>
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  );

  // Use portal to render at document body level
  const portalRoot = document.getElementById('modal-root') || document.body;
  return createPortal(modalContent, portalRoot);
};

export default IconDetailModal;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/docs && npx vitest run src/components/IconDetailModal.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/components/IconDetailModal.tsx apps/docs/src/components/IconDetailModal.test.tsx
git commit -m "feat(icon-modal): add IconDetailModal component with portal and modal functionality"
```

---

## Task 5: Update IconCard to Support Click Handler

**Files:**

- Modify: `apps/docs/src/components/IconCard.tsx`
- Create: `apps/docs/src/components/IconCard.test.tsx` (if not exists)

- [ ] **Step 1: Read current IconCard.tsx**

First verify the file content:
Run: `cat apps/docs/src/components/IconCard.tsx`

- [ ] **Step 2: Modify IconCard.tsx to add onClick prop**

```typescript
// apps/docs/src/components/IconCard.tsx
import React, { useCallback } from 'react';
import type { IconItem } from '../hooks/useIconGallery.ts';

export interface IconCardProps {
  icon: IconItem;
  prefix: string;
  /** Called when the card is clicked */
  onClick?: (icon: IconItem) => void;
}

const IconCard: React.FC<IconCardProps> = ({ icon, prefix, onClick }) => {
  const iconId = `${prefix}:${icon.name}`;

  const handleClick = useCallback(() => {
    onClick?.(icon);
  }, [onClick, icon]);

  return (
    <>
      <style>{`
        .icon-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: #ffffff;
          transition: background-color 0.2s ease;
          cursor: pointer;
          min-height: 120px;
          gap: 0.75rem;
        }
        .icon-card:hover {
          background-color: #f9fafb;
        }
        .icon-card:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        .icon-card__icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          border-radius: 4px;
        }
        .icon-card__code {
          font-size: 12px;
          font-family: monospace;
          color: #374151;
          text-align: center;
          word-break: break-all;
          line-height: 1.4;
        }
      `}</style>
      <div
        className="icon-card"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="icon-card__icon">
          <esds-svg
            name={iconId}
            mode="bg"
            style={{ width: '48px', height: '48px' }}
          />
        </div>
        <code className="icon-card__code">{iconId}</code>
      </div>
    </>
  );
};

export default IconCard;
```

- [ ] **Step 3: Create/update tests for IconCard**

```typescript
// apps/docs/src/components/IconCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import IconCard from './IconCard.tsx';
import type { IconItem } from '../hooks/useIconGallery.ts';

describe('IconCard', () => {
  const mockIcon: IconItem = {
    name: 'home',
    categories: new Set(['navigation']),
  };

  it('renders icon name', () => {
    render(<IconCard icon={mockIcon} prefix="material-symbols" />);
    expect(screen.getByText('material-symbols:home')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(
      <IconCard
        icon={mockIcon}
        prefix="material-symbols"
        onClick={mockOnClick}
      />
    );

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockIcon);
  });

  it('calls onClick when Enter key is pressed', () => {
    const mockOnClick = vi.fn();
    render(
      <IconCard
        icon={mockIcon}
        prefix="material-symbols"
        onClick={mockOnClick}
      />
    );

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    const mockOnClick = vi.fn();
    render(
      <IconCard
        icon={mockIcon}
        prefix="material-symbols"
        onClick={mockOnClick}
      />
    );

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard accessible', () => {
    render(<IconCard icon={mockIcon} prefix="material-symbols" />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/docs && npx vitest run src/components/IconCard.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/components/IconCard.tsx apps/docs/src/components/IconCard.test.tsx
git commit -m "feat(icon-modal): add onClick handler to IconCard with keyboard accessibility"
```

---

## Task 6: Update IconGrid to Manage Modal State

**Files:**

- Modify: `apps/docs/src/components/IconGrid.tsx`
- Create: `apps/docs/src/components/IconGrid.test.tsx` (if not exists)

- [ ] **Step 1: Read current IconGrid.tsx**

Run: `cat apps/docs/src/components/IconGrid.tsx`

- [ ] **Step 2: Modify IconGrid.tsx**

```typescript
// apps/docs/src/components/IconGrid.tsx
import React, { useState, useCallback, useRef } from 'react';
import type { IconItem } from '../hooks/useIconGallery.ts';
import IconCard from './IconCard.tsx';
import IconDetailModal from './IconDetailModal.tsx';

export interface IconGridProps {
  icons: readonly IconItem[];
  prefix: string;
}

const IconGrid: React.FC<IconGridProps> = ({ icons, prefix }) => {
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleIconClick = useCallback((icon: IconItem) => {
    setSelectedIcon(icon);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Clear selected icon after animation (optional)
    setTimeout(() => {
      setSelectedIcon(null);
    }, 300);
  }, []);

  if (icons.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        .icon-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .icon-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .icon-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
      <div className="icon-grid" ref={gridRef}>
        {icons.map((icon) => (
          <IconCard
            key={`${prefix}:${icon.name}`}
            icon={icon}
            prefix={prefix}
            onClick={handleIconClick}
          />
        ))}
      </div>

      <IconDetailModal
        icon={selectedIcon}
        isOpen={isModalOpen}
        prefix={prefix}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default IconGrid;
```

- [ ] **Step 3: Create/update tests for IconGrid**

```typescript
// apps/docs/src/components/IconGrid.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import IconGrid from './IconGrid.tsx';
import type { IconItem } from '../hooks/useIconGallery.ts';

describe('IconGrid', () => {
  const mockIcons: IconItem[] = [
    { name: 'home', categories: new Set(['navigation']) },
    { name: 'settings', categories: new Set(['action']) },
    { name: 'user', categories: new Set(['user']) },
  ];

  beforeEach(() => {
    // Create portal root for modal
    const portalRoot = document.createElement('div');
    portalRoot.id = 'modal-root';
    document.body.appendChild(portalRoot);
  });

  it('renders all icon cards', () => {
    render(<IconGrid icons={mockIcons} prefix="material-symbols" />);

    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('opens modal when icon card is clicked', () => {
    render(<IconGrid icons={mockIcons} prefix="material-symbols" />);

    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays correct icon details in modal', () => {
    render(<IconGrid icons={mockIcons} prefix="material-symbols" />);

    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);

    expect(screen.getByText('material-symbols:home')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    render(<IconGrid icons={mockIcons} prefix="material-symbols" />);

    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close dialog');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('returns null when no icons', () => {
    const { container } = render(<IconGrid icons={[]} prefix="material-symbols" />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/docs && npx vitest run src/components/IconGrid.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/components/IconGrid.tsx apps/docs/src/components/IconGrid.test.tsx
git commit -m "feat(icon-modal): integrate IconDetailModal into IconGrid"
```

---

## Task 7: Run Full Test Suite

**Files:** All test files

- [ ] **Step 1: Run all tests**

Run: `yarn test`
Expected: All tests pass with 100% coverage

- [ ] **Step 2: Check coverage**

Verify coverage meets 100% threshold
Expected: No coverage warnings for new code

- [ ] **Step 3: Run linting**

Run: `yarn lint` or `cd apps/docs && yarn lint`
Expected: No lint errors

- [ ] **Step 4: Run type checking**

Run: `cd apps/docs && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 5: Commit**

```bash
git commit -m "test(icon-modal): verify all tests pass with 100% coverage"
```

---

## Task 8: Manual Testing in Storybook

**Files:** Storybook components

- [ ] **Step 1: Start Storybook development server**

Run: `cd apps/docs && yarn storybook`

- [ ] **Step 2: Navigate to Icon Gallery**

Open: http://localhost:6006/?path=/docs/icons-icon-gallery--docs

- [ ] **Step 3: Test modal functionality**

Test checklist:

- [ ] Click an icon card - modal opens
- [ ] Modal displays large icon preview
- [ ] Modal displays icon name in monospace with copy button
- [ ] Modal displays esds-svg code with copy button
- [ ] Copy buttons work and show "Copied!" tooltip
- [ ] Modal displays tags, collection, and license
- [ ] Close button works
- [ ] Backdrop click closes modal
- [ ] Escape key closes modal
- [ ] Background scroll is locked when modal is open
- [ ] Background scroll restores when modal closes
- [ ] Focus returns to clicked icon after modal closes
- [ ] Modal is responsive (test on mobile viewport)

- [ ] **Step 4: Test edge cases**

Test:

- [ ] Icon without tags - displays "No tags"
- [ ] Multiple icons clicked in succession - modal updates correctly
- [ ] Rapid open/close cycles

- [ ] **Step 5: Stop Storybook**

Press Ctrl+C to stop the server

---

## Final Verification

- [ ] **Self-review checklist:**

All acceptance criteria from spec:

- [ ] Modal opens when clicking any icon card
- [ ] Modal displays icon name in monospace with copy button
- [ ] Modal displays large icon preview
- [ ] Modal displays esds-svg code with copy button
- [ ] Modal displays tags, collection, and license
- [ ] Copy buttons work and provide feedback
- [ ] Modal is responsive (works on mobile and desktop)
- [ ] Background scroll is locked when modal open
- [ ] Escape key closes modal
- [ ] Backdrop click closes modal
- [ ] Close button closes modal
- [ ] Focus is trapped within modal when open (manual test)
- [ ] Focus returns to icon card on close
- [ ] All new code has 100% test coverage
- [ ] Code follows existing project conventions

---

## Notes for implementers

1. **Iconify API Limitations:** The Iconify API is designed primarily for icon delivery, not metadata queries. Tags are available from the `categories` field in the icon list. For licensing, we use a hardcoded lookup since Iconify doesn't consistently expose license info per-icon.

2. **Focus Management:** The modal implements basic focus management (returning focus on close). Full focus trapping would require additional complexity to keep tabs within the modal.

3. **Portal Root:** The modal uses a portal to render at document body level. If `<div id="modal-root">` doesn't exist, it falls back to `document.body`.

4. **Testing Tips:**
   - IconDetailModal tests require creating a `#modal-root` element in `beforeEach`
   - Use `waitFor` for async operations like modal closing
   - Mock `navigator.clipboard` for copy tests

5. **Known Limitations:**
   - Tags may be empty if the collection doesn't provide category data
   - License info comes from hardcoded collection lookup, not API
