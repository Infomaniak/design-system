import type { IndexEntry, StorybookIndex, TitleGroup } from './types.ts';

const CATEGORY_ORDER = [
  'Welcome',
  'Designers Guide',
  'Design Tokens',
  'Icons',
  'Typography',
  'AI & LLMs',
  'Components',
];

const GETTING_STARTED_SEGMENT = 'Getting Started';
const CHANGELOG_SEGMENT = 'CHANGELOG';

export function parseStorybookIndex(raw: string): StorybookIndex {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new Error('Invalid storybook index');
  }
  if (!isStorybookIndex(parsed)) {
    throw new Error('Invalid storybook index');
  }
  return parsed;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStorybookIndex(value: unknown): value is StorybookIndex {
  if (!isRecord(value)) return false;
  if (typeof value['v'] !== 'number') return false;
  if (!isRecord(value['entries'])) return false;
  return true;
}

export function filterEntries(entries: IndexEntry[]): IndexEntry[] {
  return entries.filter(
    (entry) =>
      !entry.tags.includes('test-only') &&
      !entry.tags.includes('internal') &&
      !entry.name.startsWith('_'),
  );
}

export function groupEntriesByTitle(entries: IndexEntry[]): TitleGroup[] {
  const groups = new Map<string, TitleGroup>();
  for (const entry of entries) {
    if (!entry.title) {
      continue;
    }
    let group = groups.get(entry.title);
    if (!group) {
      group = { title: entry.title, storyEntries: [] };
      groups.set(entry.title, group);
    }
    if (entry.type === 'docs') {
      if (!group.docsEntry) {
        group.docsEntry = entry;
      }
    } else if (entry.type === 'story') {
      group.storyEntries.push(entry);
    }
  }
  return [...groups.values()];
}

export function slugifySegment(segment: string): string {
  return segment
    .toLowerCase()
    .replaceAll('&', '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugifyTitle(title: string): string[] {
  return title
    .split('/')
    .map((segment) => slugifySegment(segment.trim()))
    .filter((slug) => slug.length > 0);
}

export function buildOutputPath(slugParts: string[]): string {
  return `llms/${slugParts.join('/')}.md`;
}

export function orderTitleGroups(groups: TitleGroup[]): TitleGroup[] {
  return [...groups].sort(compareGroups);
}

function compareGroups(a: TitleGroup, b: TitleGroup): number {
  const aCategory = categoryOf(a.title);
  const bCategory = categoryOf(b.title);
  const aRank = effectiveRank(aCategory);
  const bRank = effectiveRank(bCategory);
  if (aRank !== bRank) {
    return aRank - bRank;
  }
  if (aRank === CATEGORY_ORDER.length && aCategory !== bCategory) {
    return aCategory.localeCompare(bCategory, undefined, { sensitivity: 'accent' });
  }
  return compareWithinCategory(a.title, b.title);
}

function effectiveRank(category: string): number {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function categoryOf(title: string): string {
  const separatorIndex = title.indexOf('/');
  return separatorIndex === -1 ? title : title.slice(0, separatorIndex);
}

function lastSegmentOf(title: string): string {
  const separatorIndex = title.lastIndexOf('/');
  return separatorIndex === -1 ? title : title.slice(separatorIndex + 1);
}

function compareWithinCategory(aTitle: string, bTitle: string): number {
  const aSegment = lastSegmentOf(aTitle);
  const bSegment = lastSegmentOf(bTitle);
  if (aSegment === GETTING_STARTED_SEGMENT || bSegment === GETTING_STARTED_SEGMENT) {
    if (aSegment !== bSegment) {
      return aSegment === GETTING_STARTED_SEGMENT ? -1 : 1;
    }
  }
  if (aSegment === CHANGELOG_SEGMENT || bSegment === CHANGELOG_SEGMENT) {
    if (aSegment !== bSegment) {
      return aSegment === CHANGELOG_SEGMENT ? 1 : -1;
    }
  }
  return aTitle.localeCompare(bTitle, undefined, { sensitivity: 'accent' });
}
