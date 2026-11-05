export interface StorybookIndex {
  v: number;
  entries: Record<string, IndexEntry>;
}

export type IndexEntryType = 'docs' | 'story';

export interface IndexEntry {
  id: string;
  title: string;
  name: string;
  importPath: string;
  storiesImports?: string[];
  componentPath?: string;
  type: IndexEntryType;
  subtype?: string;
  exportName?: string;
  tags: string[];
}

export interface TitleGroup {
  title: string;
  docsEntry?: IndexEntry;
  storyEntries: IndexEntry[];
}

export interface PropRow {
  name: string;
  type?: string;
  default?: string;
  required: boolean;
  description?: string;
}

export type CemComponentKind = 'element' | 'attribute';

export interface CemElementDocs {
  tagName: string;
  className: string;
  /**
   * Nature of the component: a real custom element (LitElement subclass) or a
   * custom attribute (`CustomAttribute` subclass whose CEM `tagName` doubles as
   * the attribute name, e.g. `esds-button`).
   */
  kind: CemComponentKind;
  /** For `attribute` kind, the attribute name (equals `tagName`). */
  attributeName: string;
  attributes: PropRow[];
  events: PropRow[];
  slots: PropRow[];
  cssProperties: PropRow[];
  cssParts: PropRow[];
}

export interface StorySnippet {
  name: string;
  description?: string;
  code: string;
}

export interface PageModel {
  title: string;
  category: string;
  slugParts: string[];
  outputPath: string;
  summary: string;
  prose: string;
  importSection: string;
  props: string;
  examples: StorySnippet[];
  /** Kind of the page component, or null when it has no CEM entry. */
  componentKind: CemComponentKind | null;
  /** CEM tag name of the page component, or null when it has no CEM entry. */
  componentTagName: string | null;
  /** CEM attribute names of the page component (empty when it has no CEM entry). */
  componentAttributeNames: readonly string[];
}
