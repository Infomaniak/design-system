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
