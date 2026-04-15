# Icon Detail Modal - Design Specification

**Date:** 2026-04-15  
**Status:** Approved  
**Related to:** Icon Gallery Storybook Documentation

---

## Context & Motivation

The Icon Gallery page (`/docs/icons-icon-gallery--docs`) currently allows users to browse and search icons, but lacks a way to inspect detailed metadata for a specific icon. Users need a way to:

- Copy the icon name quickly
- Get the exact `<esds-svg>` code snippet for immediate use
- View metadata like tags, collection, and license information

---

## User Stories

**US1:** As a developer, I want to click an icon in the gallery and see its full details in a modal so I can understand how to use it.

**US2:** As a developer, I want to copy the icon name with one click so I can paste it into my code or documentation.

**US3:** As a developer, I want to copy the esds-svg code snippet with one click so I can immediately paste it into my HTML/JSX.

**US4:** As a developer, I want to see tags associated with an icon so I can find related icons or understand the icon's meaning.

**US5:** As a developer, I want to see the collection and license information so I understand the icon's origin and usage rights.

---

## Design Decisions

### UI Pattern: Modal Dialog

**Rationale:** Modal is the standard pattern for inspecting details without navigating away. It keeps context (the icon gallery visible in background) while focusing attention on the selected icon.

**Alternatives considered:**

- Side panel: More space but adds complexity; modal is simpler
- Expandable card: Less obstruction but no backdrop focus

### Responsive Behavior

- **Mobile:** Modal width 90% of viewport, max 600px
- **Desktop:** Fixed max-width 600px, centered
- **Max-height:** 90vh with internal scroll if content exceeds viewport

### Background Scroll

Background gallery scrolling is disabled when modal is open (standard modal behavior using CSS `overflow: hidden` on body).

---

## Component Architecture

### New Components

#### 1. IconDetailModal

**Location:** `apps/docs/src/components/IconDetailModal.tsx`

**Responsibilities:**

- Render modal in portal (render outside component tree)
- Handle open/close state
- Lock body scroll when open
- Manage focus trap and keyboard handling (Escape to close)
- Fetch icon metadata from Iconify API
- Coordinate child components

**Props:**

```typescript
interface IconDetailModalProps {
  icon: IconItem | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**State:**

```typescript
interface IconDetailModalState {
  metadata: IconMetadata | null;
  isLoading: boolean;
  error: string | null;
  copiedField: 'name' | 'code' | null;
}
```

#### 2. CopyField

**Location:** `apps/docs/src/components/CopyField.tsx`

**Responsibilities:**

- Display a value with a copy button
- Show copy feedback on successful copy
- Handle copy errors gracefully

**Props:**

```typescript
interface CopyFieldProps {
  label: string;
  value: string;
  monospace?: boolean;
}
```

#### 3. IconMetadataDisplay

**Location:** `apps/docs/src/components/IconMetadataDisplay.tsx`

**Responsibilities:**

- Display tags, collection, and license in a readable format
- Handle undefined/null values gracefully

**Props:**

```typescript
interface IconMetadataDisplayProps {
  metadata: IconMetadata;
}
```

### Modified Components

#### IconCard

**Location:** `apps/docs/src/components/IconCard.tsx`

**Changes:**

- Add `onClick` prop: `(icon: IconItem) => void`
- Pass icon data on click
- Ensure card is keyboard accessible (Enter/Space triggers click)

#### IconGrid

**Location:** `apps/docs/src/components/IconGrid.tsx`

**Changes:**

- Add `selectedIcon` state
- Add `isModalOpen` state
- Pass click handler to IconCard instances
- Render IconDetailModal at root level

#### useIconGallery Hook

**Location:** `apps/docs/src/hooks/useIconGallery.ts`

**Changes:**

- No changes required - modal state kept local to IconGrid

---

## Modal Content Structure

```
┌───────────────────────────────────────────────┐
│ [X] Close button (top-right)                  │
├───────────────────────────────────────────────┤
│                                               │
│         [ICON PREVIEW]                        │  ← esds-svg, 96x96px
│                                               │
├───────────────────────────────────────────────┤
│ Icon Name:                                    │
│ ┌─────────────────────────────────────────┐  │
│ │ home                                  [📋]│  │  ← Monospace font
│ └─────────────────────────────────────────┘  │
├───────────────────────────────────────────┤
│ Code Snippet:                                 │
│ ┌─────────────────────────────────────────┐  │
│ │ <esds-svg name="prefix:home" />     [📋]│  │
│ └─────────────────────────────────────────┘  │
├───────────────────────────────────────────┤
│ Tags: home, house, building                   │  ← Comma-separated
│                                               │
│ Collection: Material Design Icons            │
│                                               │
│ License: Apache 2.0                           │
└───────────────────────────────────────────────┘
```

---

## API Integration

### Icon Metadata Interface

```typescript
interface IconMetadata {
  name: string;
  tags: string[];
  collection: string;
  license: string;
}
```

### Fetching Metadata

The Iconify API provides raw icon data including:

- `categories` - Category groupings
- `aliases` - Icon name aliases
- Various other metadata fields

**Endpoint:** Use existing `IconifyApi` from `iconify-api.ts`

**Implementation:**

1. When modal opens, fetch icon metadata using icon ID (format: `prefix:name`)
2. Cache metadata to avoid refetching during session
3. Parse metadata to extract:
   - Tags: From `categories` field plus `aliases` as tags
   - Collection: From prefix
   - License: From collection metadata

---

## Visual Specifications

### Modal Container

- **Backdrop**: `rgba(0, 0, 0, 0.5)`
- **Background**: White (respects theme)
- **Border radius**: 8px
- **Max-width**: 600px
- **Width**: 90% mobile, 600px desktop
- **Max-height**: 90vh
- **Padding**: 24px
- **Box shadow**: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

### Typography

- **Icon name**: Monospace font (system mono), 14px
- **Labels**: Regular weight, secondary color
- **Values**: Regular weight, primary color
- **Tags**: Small size, pill-shaped if styled

### Copy Button

- **Icon**: Clipboard icon (use existing icon set)
- **Position**: Right end of input field
- **Feedback**: Brief "Copied!" tooltip on success
- **Error**: "Copy failed" tooltip with retry option

---

## Accessibility Requirements

- **Focus trap**: Tab cycles within modal when open
- **Escape key**: Closes modal
- **ARIA**: `role="dialog"`, `aria-modal="true"`
- **Focus return**: On close, return focus to the clicked icon card
- **Screen reader**: Announce modal title when opened

---

## Error Handling

### Metadata Load Failure

- Gracefully degrade to basic info (name + code)
- Show inline error: "Failed to load icon details. Showing basic information only."

### Copy Failure

- Show error tooltip: "Copy failed. Please try again."
- Fallback: Select text for manual copy

---

## Testing Requirements

**Unit Tests:**

- IconDetailModal renders with correct content
- CopyField copies text to clipboard
- Modal closes on Escape key
- Modal closes on backdrop click
- Modal closes on close button click

**Integration Tests:**

- Clicking icon card opens modal
- Modal displays fetched metadata
- Copy buttons work with system clipboard

---

## File Structure

```
apps/docs/src/
├── components/
│   ├── IconDetailModal.tsx       # Main modal
│   ├── IconDetailModal.test.tsx  # Tests
│   ├── CopyField.tsx             # Copy functionality
│   └── IconMetadataDisplay.tsx   # Metadata rendering
├── hooks/
│   └── useIconMetadata.ts        # Fetch hook (optional, can inline)
└── types/
    └── icon-metadata.ts          # TypeScript interfaces
```

---

## Success Criteria

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
- [ ] Focus is trapped within modal when open
- [ ] Focus returns to icon card on close
- [ ] All new code has 100% test coverage
- [ ] Code follows existing project conventions

---

## Notes

- Keep implementation simple - no keyboard navigation between icons
- Use existing tooltip component from preview.tsx for copy feedback
- Leverage existing IconifyApi for metadata fetching
- Ensure modal is properly cleaned up on unmount to prevent memory leaks
- Consider using React Portal for modal rendering
