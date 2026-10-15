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

export interface CemElementDocs {
  tagName: string;
  className: string;
  attributes: PropRow[];
  properties: PropRow[];
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
}
