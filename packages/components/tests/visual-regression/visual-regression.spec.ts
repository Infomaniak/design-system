import { expect, test, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import {
  fetchManifest,
  filterVisualStories,
  findCommonStories,
  findMissingStories,
  findNewStories,
  navigateToStory,
  SCREENSHOT_OPTIONS,
  type StoryEntry,
  type StoryManifest,
} from './helpers.ts';

const PR_STORYBOOK_URL: string = process.env['VR_STORYBOOK_URL'] ?? 'http://localhost:6006';
const DEVELOP_STORYBOOK_URL: string =
  process.env['VR_DEVELOP_URL'] ?? 'https://infomaniak.github.io/design-system/storybook/develop';

const VR_METADATA_PATH: string =
  process.env['VR_METADATA_PATH'] ?? 'playwright-vr-results-metadata.json';

async function loadManifest(url: string, label: string): Promise<StoryManifest> {
  try {
    return await fetchManifest(url);
  } catch (error: unknown) {
    throw new Error(
      `Failed to load ${label} Storybook manifest from ${url}: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
}

const prManifest: StoryManifest = await loadManifest(PR_STORYBOOK_URL, 'PR');
const developManifest: StoryManifest = await loadManifest(DEVELOP_STORYBOOK_URL, 'develop');

const prVisualStories: readonly StoryEntry[] = filterVisualStories(prManifest);
const developVisualStories: readonly StoryEntry[] = filterVisualStories(developManifest);
const developStoryIds: ReadonlySet<string> = new Set(Object.keys(developManifest.entries));
const prStoryIds: ReadonlySet<string> = new Set(Object.keys(prManifest.entries));

const testableStories: readonly StoryEntry[] = findCommonStories(prVisualStories, developStoryIds);
const newStories: readonly StoryEntry[] = findNewStories(prVisualStories, developStoryIds);
const missingStories: readonly StoryEntry[] = findMissingStories(developVisualStories, prStoryIds);

interface VrMetadata {
  readonly newStoryIds: readonly string[];
  readonly missingStoryIds: readonly string[];
}

const vrMetadata: VrMetadata = {
  newStoryIds: newStories.map((story: StoryEntry): string => story.id),
  missingStoryIds: missingStories.map((story: StoryEntry): string => story.id),
};

try {
  await writeFile(VR_METADATA_PATH, `${JSON.stringify(vrMetadata, null, 2)}\n`, {
    encoding: 'utf8',
  });
} catch (error: unknown) {
  console.warn(`Warning: unable to write VR metadata to ${VR_METADATA_PATH}: ${String(error)}`);
}

test.describe('Visual regression', () => {
  newStories.forEach((story: StoryEntry) => {
    test.skip(story.id, async () => {});
  });

  missingStories.forEach((story: StoryEntry) => {
    test.skip(story.id, async () => {});
  });

  testableStories.forEach((story: StoryEntry) => {
    test(story.id, async ({ page }: { page: Page }, testInfo): Promise<void> => {
      const snapshotName: string = `${story.id}.png`;
      const snapshotPath: string = testInfo.snapshotPath(snapshotName);

      await navigateToStory(page, DEVELOP_STORYBOOK_URL, story.id);
      const baseline: Buffer = await page.screenshot(SCREENSHOT_OPTIONS);

      await mkdir(dirname(snapshotPath), { recursive: true });
      await writeFile(snapshotPath, baseline);

      await navigateToStory(page, PR_STORYBOOK_URL, story.id);
      const current: Buffer = await page.screenshot(SCREENSHOT_OPTIONS);

      await expect(current).toMatchSnapshot(snapshotName, {
        threshold: 0.01,
      });
    });
  });
});
