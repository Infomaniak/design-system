/**
 * Metadata for a single icon from Iconify API
 */
export interface IconMetadata {
  /** Icon name without prefix */
  readonly name: string;
  /** Full icon ID with prefix (e.g., 'material-symbols:home') */
  readonly iconId: string;
  /** Associated tags */
  readonly tags: readonly string[];
  /** Associated categories */
  readonly categories: readonly string[];
  /** Associated aliases */
  readonly aliases: readonly string[];
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
 * Props for IconMetadataDisplay component
 */
export interface IconMetadataDisplayProps {
  /** Metadata to display */
  readonly metadata: IconMetadata;
}
