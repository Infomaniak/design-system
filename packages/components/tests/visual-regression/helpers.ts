import type { Page } from '@playwright/test';

const VR_TEST_TAG: string = 'vr-test';
const DOCS_SUFFIX: string = '--docs';
const DEFAULT_GLOBALS: string = 'product:infomaniak;theme:light';

export interface StoryEntry {
  readonly id: string;
  readonly kind: string;
  readonly name: string;
  readonly tags: readonly string[];
}

export interface StoryManifest {
  readonly v: number;
  readonly entries: Record<string, StoryEntry>;
}

export interface ScreenshotOptions {
  readonly fullPage: boolean;
  readonly animations: 'disabled' | 'allow';
}

export const SCREENSHOT_OPTIONS: ScreenshotOptions = {
  fullPage: true,
  animations: 'disabled',
};

export function getStoryUrl(storybookUrl: string, storyId: string): string {
  const params: URLSearchParams = new URLSearchParams({
    id: storyId,
    viewMode: 'story',
    nav: '0',
    globals: DEFAULT_GLOBALS,
  });

  return `${storybookUrl.replace(/\/+$/, '')}/iframe.html?${params.toString()}`;
}

export async function navigateToStory(
  page: Page,
  storybookUrl: string,
  storyId: string,
): Promise<void> {
  const url: string = getStoryUrl(storybookUrl, storyId);

  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('#storybook-root');
}

export async function fetchManifest(storybookUrl: string): Promise<StoryManifest> {
  const baseUrl: string = storybookUrl.replace(/\/+$/, '');
  const controller: AbortController = new AbortController();
  const timeoutId: NodeJS.Timeout = setTimeout((): void => controller.abort(), 30_000);

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/index.json`, { signal: controller.signal });
  } catch (error: unknown) {
    throw new Error(
      `Failed to fetch manifest from ${baseUrl}: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch manifest from ${baseUrl} (${response.status})`);
  }

  return (await response.json()) as StoryManifest;
}

export function filterVisualStories(manifest: StoryManifest): readonly StoryEntry[] {
  return Object.values(manifest.entries).filter(
    (entry: StoryEntry): boolean =>
      entry.tags.includes(VR_TEST_TAG) && !entry.id.endsWith(DOCS_SUFFIX),
  );
}

export function findCommonStories(
  prStories: readonly StoryEntry[],
  developStoryIds: ReadonlySet<string>,
): readonly StoryEntry[] {
  return prStories.filter((story: StoryEntry): boolean => developStoryIds.has(story.id));
}

export function findNewStories(
  prStories: readonly StoryEntry[],
  developStoryIds: ReadonlySet<string>,
): readonly StoryEntry[] {
  return prStories.filter((story: StoryEntry): boolean => !developStoryIds.has(story.id));
}

export function findMissingStories(
  developStories: readonly StoryEntry[],
  prStoryIds: ReadonlySet<string>,
): readonly StoryEntry[] {
  return developStories.filter((story: StoryEntry): boolean => !prStoryIds.has(story.id));
}
