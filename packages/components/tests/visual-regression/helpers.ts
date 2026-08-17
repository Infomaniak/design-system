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

const MANIFEST_FETCH_MAX_ATTEMPTS: number = 3;
const MANIFEST_FETCH_BACKOFF_MS: readonly number[] = [5_000, 15_000];
const MANIFEST_FETCH_TIMEOUT_MS: number = 30_000;

export function sleep(duration: number): Promise<void> {
  return new Promise((resolve: () => void): void => {
    setTimeout(resolve, duration);
  });
}

async function fetchManifestOnce(baseUrl: string): Promise<Response> {
  const controller: AbortController = new AbortController();
  const timeoutId: NodeJS.Timeout = setTimeout(
    (): void => controller.abort(),
    MANIFEST_FETCH_TIMEOUT_MS,
  );

  try {
    return await fetch(`${baseUrl}/index.json`, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchManifest(storybookUrl: string): Promise<StoryManifest> {
  const baseUrl: string = storybookUrl.replace(/\/+$/, '');
  let lastError: Error | undefined;

  for (let attempt: number = 0; attempt < MANIFEST_FETCH_MAX_ATTEMPTS; attempt++) {
    let response: Response;

    try {
      response = await fetchManifestOnce(baseUrl);
    } catch (error: unknown) {
      lastError = new Error(
        `Failed to fetch manifest from ${baseUrl}: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      );

      if (attempt < MANIFEST_FETCH_MAX_ATTEMPTS - 1) {
        await sleep(MANIFEST_FETCH_BACKOFF_MS[attempt] ?? 0);
        continue;
      }

      throw lastError;
    }

    if (!response.ok) {
      lastError = new Error(`Failed to fetch manifest from ${baseUrl} (${response.status})`);

      if (attempt < MANIFEST_FETCH_MAX_ATTEMPTS - 1) {
        await sleep(MANIFEST_FETCH_BACKOFF_MS[attempt] ?? 0);
        continue;
      }

      throw lastError;
    }

    return (await response.json()) as StoryManifest;
  }

  throw (
    lastError ??
    new Error(
      `Failed to fetch manifest from ${baseUrl} after ${MANIFEST_FETCH_MAX_ATTEMPTS} attempts`,
    )
  );
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
