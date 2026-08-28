# Font S3 Publishing Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox
> (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken npm publish flow for the `@infomaniak-design-system/fonts` package with
an archive-based delivery: build fonts, create a tar.gz archive, push it to a dedicated GitLab
repository, then trigger its pipeline which uploads the fonts to S3.

**Architecture:** GitHub (design-system) is the source of truth — TTF sources and JSON descriptors
are committed. GitHub Actions builds WOFF2 + min.css (via existing `ci:publish`). The rewritten
`publish-fonts.script.ts` creates a `fonts-{mode}-{shortSha}.tar.gz` archive from `dist/web/`,
commits it to a dedicated GitLab repository (clone → replace archives → commit → push, HTTPS +
GitLab token), then triggers the GitLab pipeline (trigger token API) with the archive name and
font mode as variables. The GitLab pipeline extracts the archive (already present in the repo at
the triggered ref) and syncs it to S3 at `fonts.storage.infomaniak.com/{dev|latest}/`.

**Scope note (revised 2026-08-28):** The previous version of this plan contained the
`opticalSizing` CSS bug fix and test-only tasks for the font build code (old Tasks 1–6) plus
GitHub Release helpers. All of these were **removed** — code fixes are handled elsewhere, and
GitHub Releases were replaced by the archive + GitLab push mechanism.

**Tech Stack:** TypeScript (NodeNext), Vitest, `node:child_process` (system `tar` + `git`), GitLab
Trigger Pipeline API, GitHub Actions, GitLab CI, S3.

## Global Constraints

- **TypeScript:** Strict mode, NodeNext modules, `.ts` import extensions
- **Formatting:** Prettier — single quotes, 100 char width, `prettier-plugin-organize-imports`
- **Testing:** Vitest v4, 100% Istanbul coverage required
- **File naming:** `kebab-case.ts`, test files `*.test.ts`
- **No comments** in code unless explicitly requested
- **Branch naming:** `feat/`, `fix/`, `docs/` prefixes
- **Commits:** Conventional Commits format
- **Package manager:** Yarn v4 (workspaces)
- **Node version:** v24

---

## Architecture Overview

```
GitHub (design-system) = source of truth
  │
  │ 1. Dev commits TTF + JSON descriptors
  │ 2. PR → merge → develop (or main)
  │ 3. publish.yml triggers ci:publish
  │ 4. ci:publish discovers the fonts package (has "publish" script)
  │ 5. yarn workspace @infomaniak-design-system/fonts run build
  │    → build-fonts.script.ts (TTF → WOFF2 + CSS) into dist/web/
  │ 6. yarn workspace @infomaniak-design-system/fonts run publish
  │    → publish-fonts.script.ts (REWRITTEN)
  │      a. Collects dist/web/*.woff2 + *.min.css
  │      b. Creates fonts-{mode}-{shortSha}.tar.gz (system tar)
  │      c. Clones the dedicated GitLab repo, replaces the archive,
  │         commits, pushes (HTTPS + GitLab token)
  │      d. Triggers the GitLab pipeline (trigger token)
  │         with variables { ARCHIVE_NAME, FONT_MODE }
  │
  ▼
GitLab CI (dedicated repository, e.g. infomaniak/fonts-delivery)
  │
  │ 1. Pipeline triggered (CI_PIPELINE_SOURCE == "trigger")
  │ 2. The archive is already in the repo checkout (archives/{ARCHIVE_NAME})
  │ 3. Extracts the archive and uploads fonts to S3:
  │    - s3://fonts/dev/    for mode dev/rc
  │    - s3://fonts/latest/ for mode prod
  │
  ▼
S3: fonts.storage.infomaniak.com/{dev|latest}/
```

**Key design decisions:**

- **No GitHub Releases** — the archive replaces release assets as artifact transport.
- **No GitHub API helpers needed** — the only GitHub-side data used is `sha` from the existing
  `GithubCiConfig`; `token`/`repository_owner` are no longer required.
- **No workflow permission changes** — no release/tag creation means `contents: read` stays
  sufficient in `.github/workflows/publish.yml`.
- **System `tar`** for archive creation (available on macOS dev machines and `ubuntu-latest`
  runners) — no new npm dependency.
- **Dedicated GitLab repo as transport** — the archive is committed to the repo; the GitLab job
  reads it directly from its own checkout (no download step, no artifact API).
- **Push→trigger race is accepted** — concurrent publishes across refs could replace the archive
  between push and trigger, making the GitLab job fail on a missing archive; a retry re-publishes.
  Passing the pushed commit SHA as trigger `ref` is a possible hardening if the GitLab instance
  accepts SHAs.
- **Previous archives are removed** at each push (`git add -A` after clearing `archives/`) so the
  repo tree always holds a single current archive; git history growth is an accepted tradeoff.
- **Dry-run safe** — when `CI_PUBLISH_DRY_RUN=true` (fork PRs, no secrets available), the script
  exits early instead of failing.
- GitLab side (pipeline definition) is out of scope for this repo — see reference section at the
  bottom.

---

## File Structure

### Files to Create (design-system repo)

| File                                                                  | Responsibility                                             |
| --------------------------------------------------------------------- | ---------------------------------------------------------- |
| `scripts/helpers/file/archive/create-tar-gz-archive.ts`               | Create a tar.gz archive from selected files of a directory |
| `scripts/helpers/file/archive/create-tar-gz-archive.test.ts`          | Integration test (real tar binary)                         |
| `scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-url.ts`   | Read `GITLAB_FONTS_REPOSITORY_URL` env var                 |
| `scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-token.ts` | Read `GITLAB_FONTS_REPOSITORY_TOKEN` env var               |
| `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-url.ts`      | Read `GITLAB_FONTS_TRIGGER_URL` env var                    |
| `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-token.ts`    | Read `GITLAB_FONTS_TRIGGER_TOKEN` env var                  |
| `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-ref.ts`      | Read `GITLAB_FONTS_TRIGGER_REF` env var                    |
| `scripts/helpers/gitlab/git/push-gitlab-fonts-archive.ts`             | Clone dedicated repo, replace archive, commit, push        |
| `scripts/helpers/gitlab/git/push-gitlab-fonts-archive.test.ts`        | Test the git push sequence (mocked `execFile`)             |
| `scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.ts`         | POST trigger pipeline request with variables               |
| `scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.test.ts`    | Test the trigger request                                   |

### Files to Modify (design-system repo)

| File                                                                          | Change                                                             |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `packages/assets/fonts/scripts/scripts/publish-fonts/publish-fonts.script.ts` | Replace npm publish with: archive → push GitLab → trigger pipeline |
| `.env.example`                                                                | Add the 5 `GITLAB_FONTS_*` variables                               |
| `.github/workflows/publish.yml`                                               | Pass the new GitLab secrets as env to `yarn ci:publish`            |

### External (out of scope for this plan — dedicated GitLab repository)

| File                              | Responsibility                        |
| --------------------------------- | ------------------------------------- |
| `<dedicated-repo>/.gitlab-ci.yml` | Pipeline: extract archive → upload S3 |

---

## Task 1: `create-tar-gz-archive` helper

**Files:**

- Create: `scripts/helpers/file/archive/create-tar-gz-archive.ts`
- Test: `scripts/helpers/file/archive/create-tar-gz-archive.test.ts`

**Interfaces:**

- Consumes: system `tar` binary via `node:child_process.execFile`
- Produces: `createTarGzArchive({ sourceDirectory, fileNames, archiveName?, outputDirectory? })` →
  `Promise<string>` (absolute path of the created archive). Default archive name is
  `archive.tar.gz`, default output directory is a fresh `os.tmpdir()` temp folder.

- [ ] **Step 1: Write the failing test**

Create `scripts/helpers/file/archive/create-tar-gz-archive.test.ts`:

```typescript
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTarGzArchive } from './create-tar-gz-archive.ts';

const execFileAsync = promisify(execFile);

describe('createTarGzArchive', () => {
  let tempDir: string;
  let sourceDir: string;
  let outputDir: string;
  let extractDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'tar-gz-archive-test-'));
    sourceDir = join(tempDir, 'source');
    outputDir = join(tempDir, 'output');
    extractDir = join(tempDir, 'extract');
    await mkdir(sourceDir);
    await mkdir(outputDir);
    await mkdir(extractDir);
    await writeFile(join(sourceDir, 'inter.woff2'), new Uint8Array([0, 1, 2, 3]));
    await writeFile(join(sourceDir, 'inter.min.css'), 'body{}');
    await writeFile(join(sourceDir, 'ignored.txt'), 'ignored');
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('creates an archive containing only the selected files', async () => {
    const archivePath: string = await createTarGzArchive({
      sourceDirectory: sourceDir,
      fileNames: ['inter.woff2', 'inter.min.css'],
      outputDirectory,
      archiveName: 'fonts-prod-abc123d.tar.gz',
    });

    expect(archivePath).toBe(join(outputDir, 'fonts-prod-abc123d.tar.gz'));

    await execFileAsync('tar', ['-xzf', archivePath, '-C', extractDir]);

    expect(await readdir(extractDir)).toEqual(['inter.woff2', 'inter.min.css']);

    const woff2: Buffer = await readFile(join(extractDir, 'inter.woff2'));
    expect(woff2).toEqual(new Uint8Array([0, 1, 2, 3]));
  });

  it('defaults to "archive.tar.gz" in a fresh temp output directory', async () => {
    const archivePath: string = await createTarGzArchive({
      sourceDirectory: sourceDir,
      fileNames: ['inter.woff2'],
    });

    expect(archivePath).toMatch(/tar-gz-archive-.*[\\/]archive\.tar\.gz$/);
  });

  it('rejects when the source directory does not exist', async () => {
    await expect(
      createTarGzArchive({
        sourceDirectory: join(sourceDir, 'missing'),
        fileNames: ['inter.woff2'],
      }),
    ).rejects.toThrow(/Failed to create tar\.gz archive/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/helpers/file/archive/create-tar-gz-archive.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `scripts/helpers/file/archive/create-tar-gz-archive.ts`:

```typescript
import { execFile } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export interface CreateTarGzArchiveOptions {
  readonly sourceDirectory: string;
  readonly fileNames: readonly string[];
  readonly archiveName?: string;
  readonly outputDirectory?: string;
}

export async function createTarGzArchive({
  sourceDirectory,
  fileNames,
  archiveName = 'archive.tar.gz',
  outputDirectory = await mkdtemp(join(tmpdir(), 'tar-gz-archive-')),
}: CreateTarGzArchiveOptions): Promise<string> {
  const archivePath: string = join(outputDirectory, archiveName);

  await new Promise<void>((resolve, reject): void => {
    execFile(
      'tar',
      ['-czf', archivePath, '-C', sourceDirectory, ...fileNames],
      (error, _stdout, stderr) => {
        if (error !== null) {
          reject(
            new Error(
              `Failed to create tar.gz archive "${archivePath}": ${error.message}${stderr === '' ? '' : ` — ${stderr}`}`,
            ),
          );
          return;
        }

        resolve();
      },
    );
  });

  return archivePath;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/helpers/file/archive/create-tar-gz-archive.test.ts`
Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add scripts/helpers/file/archive/create-tar-gz-archive.ts scripts/helpers/file/archive/create-tar-gz-archive.test.ts
git commit -m "feat(fonts): add tar.gz archive creation helper"
```

---

## Task 2: GitLab env helpers

**Files:**

- Create: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-url.ts`
- Create: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-token.ts`
- Create: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-url.ts`
- Create: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-token.ts`
- Create: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-ref.ts`

**Interfaces:**

- Consumes: `getEnvVariable` from `../../env/get-env-variable.ts`
- Produces: `getEnvGitlabFontsRepositoryUrl()`, `getEnvGitlabFontsRepositoryToken()`,
  `getEnvGitlabFontsTriggerUrl()`, `getEnvGitlabFontsTriggerToken()`,
  `getEnvGitlabFontsTriggerRef()` and the corresponding `ENV_GITLAB_FONTS_*` constants

- [ ] **Step 1: Create `get-env-gitlab-fonts-repository-url.ts`**

```typescript
import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_GITLAB_FONTS_REPOSITORY_URL = 'GITLAB_FONTS_REPOSITORY_URL';

export function getEnvGitlabFontsRepositoryUrl(): string {
  return getEnvVariable(ENV_GITLAB_FONTS_REPOSITORY_URL);
}
```

- [ ] **Step 2: Create `get-env-gitlab-fonts-repository-token.ts`**

```typescript
import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_GITLAB_FONTS_REPOSITORY_TOKEN = 'GITLAB_FONTS_REPOSITORY_TOKEN';

export function getEnvGitlabFontsRepositoryToken(): string {
  return getEnvVariable(ENV_GITLAB_FONTS_REPOSITORY_TOKEN);
}
```

- [ ] **Step 3: Create `get-env-gitlab-fonts-trigger-url.ts`**

```typescript
import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_GITLAB_FONTS_TRIGGER_URL = 'GITLAB_FONTS_TRIGGER_URL';

export function getEnvGitlabFontsTriggerUrl(): string {
  return getEnvVariable(ENV_GITLAB_FONTS_TRIGGER_URL);
}
```

- [ ] **Step 4: Create `get-env-gitlab-fonts-trigger-token.ts`**

```typescript
import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_GITLAB_FONTS_TRIGGER_TOKEN = 'GITLAB_FONTS_TRIGGER_TOKEN';

export function getEnvGitlabFontsTriggerToken(): string {
  return getEnvVariable(ENV_GITLAB_FONTS_TRIGGER_TOKEN);
}
```

- [ ] **Step 5: Create `get-env-gitlab-fonts-trigger-ref.ts`**

```typescript
import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_GITLAB_FONTS_TRIGGER_REF = 'GITLAB_FONTS_TRIGGER_REF';

export function getEnvGitlabFontsTriggerRef(): string {
  return getEnvVariable(ENV_GITLAB_FONTS_TRIGGER_REF);
}
```

- [ ] **Step 6: Commit**

```bash
git add scripts/helpers/gitlab/env/
git commit -m "feat(fonts): add GitLab fonts env helpers"
```

---

## Task 3: `push-gitlab-fonts-archive` helper

**Files:**

- Create: `scripts/helpers/gitlab/git/push-gitlab-fonts-archive.ts`
- Test: `scripts/helpers/gitlab/git/push-gitlab-fonts-archive.test.ts`

**Interfaces:**

- Consumes: `node:child_process.execFile` (system `git`), `node:fs/promises`
- Produces: `pushGitlabFontsArchive({ repositoryUrl, repositoryToken, archivePath, archiveName,
commitMessage, workDirectory })` → `Promise<void>`. Clones the repository (depth 1, HTTPS + GitLab
  token injected as `oauth2` user), clears previous `*.tar.gz` files from `archives/`, copies the
  new archive, commits with an inline git identity, pushes `HEAD`.

- [ ] **Step 1: Write the failing test**

Create `scripts/helpers/gitlab/git/push-gitlab-fonts-archive.test.ts`:

```typescript
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const execFileMock = vi.fn();
vi.mock('node:child_process', () => ({
  execFile: execFileMock,
}));

import { pushGitlabFontsArchive } from './push-gitlab-fonts-archive.ts';

describe('pushGitlabFontsArchive', () => {
  let tempDir: string;
  let workDir: string;
  let repoDir: string;
  let archivePath: string;

  const defaultOptions = {
    repositoryUrl: 'https://gitlab.infomaniak.ch/infomaniak/fonts-delivery.git',
    repositoryToken: 'glpat-token',
    archivePath: undefined as unknown as string,
    archiveName: 'fonts-prod-abc123d.tar.gz',
    commitMessage: 'chore: publish fonts prod abc123d',
    workDirectory: undefined as unknown as string,
  };

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'push-gitlab-fonts-test-'));
    workDir = join(tempDir, 'work');
    repoDir = join(workDir, 'repository');
    await mkdir(repoDir, { recursive: true });

    archivePath = join(tempDir, 'fonts-prod-abc123d.tar.gz');
    await writeFile(archivePath, 'archive-content');

    execFileMock.mockReset();
    execFileMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(null);
    });
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('clones, copies the archive, commits and pushes', async () => {
    await pushGitlabFontsArchive({ ...defaultOptions, workDirectory: workDir, archivePath });

    const repositoryUrlWithAuth =
      'https://oauth2:glpat-token@gitlab.infomaniak.ch/infomaniak/fonts-delivery.git';

    expect(execFileMock).toHaveBeenCalledTimes(4);
    expect(execFileMock.mock.calls.map((call) => [call[0], call[1]])).toEqual([
      ['git', ['clone', '--depth', '1', repositoryUrlWithAuth, repoDir]],
      ['git', ['add', '-A']],
      [
        'git',
        [
          '-c',
          'user.name=design-system-ci',
          '-c',
          'user.email=design-system-ci@infomaniak.com',
          'commit',
          '-m',
          'chore: publish fonts prod abc123d',
        ],
      ],
      ['git', ['push', 'origin', 'HEAD']],
    ]);

    for (const call of execFileMock.mock.calls.slice(1)) {
      expect(call[2]).toEqual({ cwd: repoDir });
    }

    await expect(
      readFile(join(repoDir, 'archives', 'fonts-prod-abc123d.tar.gz'), { encoding: 'utf8' }),
    ).resolves.toBe('archive-content');
  });

  it('removes previous tar.gz archives before copying the new one', async () => {
    const archivesDir = join(repoDir, 'archives');
    await mkdir(archivesDir, { recursive: true });
    await writeFile(join(archivesDir, 'fonts-dev-old1234.tar.gz'), 'old archive');
    await writeFile(join(archivesDir, 'README.md'), 'keep me');

    await pushGitlabFontsArchive({ ...defaultOptions, workDirectory: workDir, archivePath });

    const fileNames = await readdir(archivesDir);
    expect(fileNames).toEqual(['README.md', 'fonts-prod-abc123d.tar.gz']);
  });

  it('rejects with a descriptive error when a git command fails', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const command = args[1] as string[];
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(command[0] === 'push' ? new Error('push failed') : null);
    });

    await expect(
      pushGitlabFontsArchive({ ...defaultOptions, workDirectory: workDir, archivePath }),
    ).rejects.toThrow('git push origin HEAD failed: push failed');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/helpers/gitlab/git/push-gitlab-fonts-archive.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `scripts/helpers/gitlab/git/push-gitlab-fonts-archive.ts`:

```typescript
import { execFile } from 'node:child_process';
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

export interface PushGitlabFontsArchiveOptions {
  readonly repositoryUrl: string;
  readonly repositoryToken: string;
  readonly archivePath: string;
  readonly archiveName: string;
  readonly commitMessage: string;
  readonly workDirectory: string;
}

const GIT_USER_NAME = 'design-system-ci';

const GIT_USER_EMAIL = 'design-system-ci@infomaniak.com';

function runGit(args: readonly string[], cwd: string): Promise<void> {
  return new Promise<void>((resolve, reject): void => {
    execFile('git', [...args], { cwd }, (error) => {
      if (error !== null) {
        reject(new Error(`git ${args.join(' ')} failed: ${error.message}`));
        return;
      }

      resolve();
    });
  });
}

export async function pushGitlabFontsArchive({
  repositoryUrl,
  repositoryToken,
  archivePath,
  archiveName,
  commitMessage,
  workDirectory,
}: PushGitlabFontsArchiveOptions): Promise<void> {
  const repositoryUrlWithAuth: string = repositoryUrl.replace(
    'https://',
    `https://oauth2:${repositoryToken}@`,
  );

  const repositoryDirectory: string = join(workDirectory, 'repository');
  const archivesDirectory: string = join(repositoryDirectory, 'archives');

  await runGit(
    ['clone', '--depth', '1', repositoryUrlWithAuth, repositoryDirectory],
    workDirectory,
  );

  await mkdir(archivesDirectory, { recursive: true });

  const existingFileNames: string[] = await readdir(archivesDirectory);

  for (const fileName of existingFileNames) {
    if (fileName.endsWith('.tar.gz')) {
      await rm(join(archivesDirectory, fileName));
    }
  }

  await copyFile(archivePath, join(archivesDirectory, archiveName));

  await runGit(['add', '-A'], repositoryDirectory);

  await runGit(
    [
      '-c',
      `user.name=${GIT_USER_NAME}`,
      '-c',
      `user.email=${GIT_USER_EMAIL}`,
      'commit',
      '-m',
      commitMessage,
    ],
    repositoryDirectory,
  );

  await runGit(['push', 'origin', 'HEAD'], repositoryDirectory);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/helpers/gitlab/git/push-gitlab-fonts-archive.test.ts`
Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add scripts/helpers/gitlab/git/push-gitlab-fonts-archive.ts scripts/helpers/gitlab/git/push-gitlab-fonts-archive.test.ts
git commit -m "feat(fonts): add GitLab fonts archive push helper"
```

---

## Task 4: `trigger-gitlab-fonts-pipeline` helper

**Files:**

- Create: `scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.ts`
- Test: `scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.test.ts`

**Interfaces:**

- Consumes: global `fetch`
- Produces: `triggerGitlabFontsPipeline({ url, token, ref, variables })` → `Promise<void>` — POSTs
  a form-encoded trigger pipeline request. Variables are sent as `variables[NAME]=value` fields per
  GitLab Trigger Pipeline API.

- [ ] **Step 1: Write the failing test**

Create `scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.test.ts`:

```typescript
import { afterEach, describe, expect, it, vi } from 'vitest';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

import { triggerGitlabFontsPipeline } from './trigger-gitlab-fonts-pipeline.ts';

describe('triggerGitlabFontsPipeline', () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it('sends a form-encoded POST request with token, ref and variables', async () => {
    fetchMock.mockResolvedValue(new Response('{"id":42}', { status: 201 }));

    await triggerGitlabFontsPipeline({
      url: 'https://gitlab.infomaniak.ch/api/v4/projects/123/trigger/pipeline',
      token: 'glptt-token',
      ref: 'main',
      variables: {
        ARCHIVE_NAME: 'fonts-prod-abc123d.tar.gz',
        FONT_MODE: 'prod',
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toBe('https://gitlab.infomaniak.ch/api/v4/projects/123/trigger/pipeline');
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/x-www-form-urlencoded');

    const body = new URLSearchParams(init.body as string);

    expect(body.get('token')).toBe('glptt-token');
    expect(body.get('ref')).toBe('main');
    expect(body.get('variables[ARCHIVE_NAME]')).toBe('fonts-prod-abc123d.tar.gz');
    expect(body.get('variables[FONT_MODE]')).toBe('prod');
  });

  it('throws on non-2xx response', async () => {
    fetchMock.mockResolvedValue(new Response('Forbidden', { status: 403 }));

    await expect(
      triggerGitlabFontsPipeline({
        url: 'https://gitlab.infomaniak.ch/api/v4/projects/123/trigger/pipeline',
        token: 'glptt-token',
        ref: 'main',
        variables: { FONT_MODE: 'dev' },
      }),
    ).rejects.toThrow('GitLab fonts pipeline trigger failed with status 403');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.ts`:

```typescript
export interface TriggerGitlabFontsPipelineOptions {
  readonly url: string;
  readonly token: string;
  readonly ref: string;
  readonly variables: Readonly<Record<string, string>>;
}

export async function triggerGitlabFontsPipeline({
  url,
  token,
  ref,
  variables,
}: TriggerGitlabFontsPipelineOptions): Promise<void> {
  const searchParameters = new URLSearchParams({ token, ref });

  for (const [name, value] of Object.entries(variables)) {
    searchParameters.set(`variables[${name}]`, value);
  }

  const response: Response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: searchParameters.toString(),
  });

  if (!response.ok) {
    throw new Error(`GitLab fonts pipeline trigger failed with status ${response.status}`);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.test.ts`
Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
git add scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.ts scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.test.ts
git commit -m "feat(fonts): add GitLab fonts pipeline trigger helper"
```

---

## Task 5: Rewrite `publish-fonts.script.ts`, env example and workflow

**Files:**

- Modify: `packages/assets/fonts/scripts/scripts/publish-fonts/publish-fonts.script.ts`
- Modify: `.env.example`
- Modify: `.github/workflows/publish.yml`

**Interfaces:**

- Consumes: `getEnvPublishConfig` (mode: `dev` | `rc` | `prod`), `getEnvGithubCiConfig` (sha),
  `createTarGzArchive`, `pushGitlabFontsArchive`, `triggerGitlabFontsPipeline`, all
  `getEnvGitlabFonts*` env helpers, `getEnvCiPublishDryRun`, `glob` from `node:fs/promises`
- Produces: `publish-fonts` script that archives `dist/web/`, pushes the archive to the dedicated
  GitLab repository and triggers its pipeline. Skips everything when `CI_PUBLISH_DRY_RUN=true`.

- [ ] **Step 1: Rewrite the script**

Replace the content of
`packages/assets/fonts/scripts/scripts/publish-fonts/publish-fonts.script.ts`:

```typescript
import { glob, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTarGzArchive } from '../../../../../../scripts/helpers/file/archive/create-tar-gz-archive.ts';
import { getEnvGithubCiConfig } from '../../../../../../scripts/helpers/github/github-ci-config/env/get-env-github-ci-config.ts';
import { triggerGitlabFontsPipeline } from '../../../../../../scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.ts';
import { getEnvGitlabFontsRepositoryToken } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-token.ts';
import { getEnvGitlabFontsRepositoryUrl } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-url.ts';
import { getEnvGitlabFontsTriggerRef } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-ref.ts';
import { getEnvGitlabFontsTriggerToken } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-token.ts';
import { getEnvGitlabFontsTriggerUrl } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-url.ts';
import { pushGitlabFontsArchive } from '../../../../../../scripts/helpers/gitlab/git/push-gitlab-fonts-archive.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { getEnvCiPublishDryRun } from '../../../../../../scripts/helpers/publish/env/get-env-ci-publish-dry-run.ts';
import { getEnvPublishConfig } from '../../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const DIST_WEB_DIR: string = join(ROOT_DIR, 'dist', 'web');

await runScript('publish-fonts', async (logger: Logger): Promise<void> => {
  if (getEnvCiPublishDryRun()) {
    logger.info('Dry run: skipping fonts archive publication.');
    return;
  }

  const { mode } = getEnvPublishConfig();

  const { sha } = getEnvGithubCiConfig();
  const shortSha: string = sha.slice(0, 7);

  const archiveName: string = `fonts-${mode}-${shortSha}.tar.gz`;

  const fileNames: string[] = [];

  for await (const filePath of glob(`${DIST_WEB_DIR}/*.woff2`)) {
    fileNames.push(basename(filePath));
  }

  for await (const filePath of glob(`${DIST_WEB_DIR}/*.min.css`)) {
    fileNames.push(basename(filePath));
  }

  if (fileNames.length === 0) {
    throw new Error(`No WOFF2 or min.css files found in ${DIST_WEB_DIR}.`);
  }

  const archivePath: string = await logger.asyncTask(
    'create-fonts-archive',
    async (): Promise<string> => {
      return createTarGzArchive({
        sourceDirectory: DIST_WEB_DIR,
        fileNames,
        archiveName,
      });
    },
  );

  await logger.asyncTask('push-gitlab-fonts-archive', async (): Promise<void> => {
    await pushGitlabFontsArchive({
      repositoryUrl: getEnvGitlabFontsRepositoryUrl(),
      repositoryToken: getEnvGitlabFontsRepositoryToken(),
      archivePath,
      archiveName,
      commitMessage: `chore: publish fonts ${mode} ${shortSha}`,
      workDirectory: await mkdtemp(join(tmpdir(), 'publish-fonts-')),
    });
  });

  await logger.asyncTask('trigger-gitlab-fonts-pipeline', async (): Promise<void> => {
    await triggerGitlabFontsPipeline({
      url: getEnvGitlabFontsTriggerUrl(),
      token: getEnvGitlabFontsTriggerToken(),
      ref: getEnvGitlabFontsTriggerRef(),
      variables: {
        ARCHIVE_NAME: archiveName,
        FONT_MODE: mode,
      },
    });
  });
});
```

- [ ] **Step 2: Update `.env.example`**

Add at the end of the file:

```
# GITLAB FONTS
# Dedicated GitLab repository receiving the built fonts archive (transport to S3).
GITLAB_FONTS_REPOSITORY_URL="https://gitlab.infomaniak.ch/infomaniak/fonts-delivery.git"
# GitLab token with write_repository scope on the dedicated repository.
GITLAB_FONTS_REPOSITORY_TOKEN="glpat-xxxxxxxxxxxxxxxxxxxx"
# Trigger Pipeline endpoint of the dedicated repository.
GITLAB_FONTS_TRIGGER_URL="https://gitlab.infomaniak.ch/api/v4/projects/<project-id>/trigger/pipeline"
GITLAB_FONTS_TRIGGER_TOKEN="glptt-xxxxxxxxxxxxxxxxxxxx"
# Branch of the dedicated repository on which pipelines are triggered.
GITLAB_FONTS_TRIGGER_REF="main"
```

- [ ] **Step 3: Update `.github/workflows/publish.yml`**

Add the new GitLab secrets to the `env` block of the **"Publish missing package versions"** step
(the fork dry-run step needs no change — the script skips on `CI_PUBLISH_DRY_RUN`):

```yaml
env:
  GITHUB_CI_CONFIG: ${{ toJson(github) }}
  KCHAT_WEBHOOK_ID: ${{ secrets.KCHAT_WEBHOOK_ID }}
  CI_PULL_REQUEST_AUTH_TOKEN_MOBILE: ${{ secrets.CI_PULL_REQUEST_AUTH_TOKEN_MOBILE }}
  GITLAB_FONTS_REPOSITORY_URL: ${{ secrets.GITLAB_FONTS_REPOSITORY_URL }}
  GITLAB_FONTS_REPOSITORY_TOKEN: ${{ secrets.GITLAB_FONTS_REPOSITORY_TOKEN }}
  GITLAB_FONTS_TRIGGER_URL: ${{ secrets.GITLAB_FONTS_TRIGGER_URL }}
  GITLAB_FONTS_TRIGGER_TOKEN: ${{ secrets.GITLAB_FONTS_TRIGGER_TOKEN }}
  GITLAB_FONTS_TRIGGER_REF: main
```

No permission change is needed: no GitHub Release or tag is created anymore, `contents: read`
stays sufficient. Create the following GitHub repository secrets:
`GITLAB_FONTS_REPOSITORY_URL`, `GITLAB_FONTS_REPOSITORY_TOKEN`,
`GITLAB_FONTS_TRIGGER_URL`, `GITLAB_FONTS_TRIGGER_TOKEN`.

- [ ] **Step 4: Commit**

```bash
git add packages/assets/fonts/scripts/scripts/publish-fonts/publish-fonts.script.ts .env.example .github/workflows/publish.yml
git commit -m "feat(fonts): replace npm publish with GitLab archive push + pipeline trigger for S3 upload"
```

---

## Task 6: Verify full pipeline and coverage

**Files:**

- No new files

- [ ] **Step 1: Run the new helper tests**

Run:
`npx vitest run --reporter=verbose scripts/helpers/file/archive/ scripts/helpers/gitlab/`
Expected: All tests pass.

- [ ] **Step 2: Run coverage**

Run: `npx vitest run --coverage scripts/helpers/file/archive/ scripts/helpers/gitlab/`
Expected: 100% coverage on the new helper files. If any gaps, add targeted tests.

- [ ] **Step 3: Run typecheck**

Run: `yarn check:types`
Expected: No errors.

- [ ] **Step 4: Run format check**

Run: `yarn format:check`
Expected: No formatting errors. If any, run `yarn format:fix`.

- [ ] **Step 5: Commit any remaining fixes**

```bash
git add -A
git commit -m "chore(fonts): fix coverage and formatting"
```

---

## External: Dedicated GitLab repository (reference only — out of scope for this repo)

Reference for the dedicated GitLab repository (e.g. `infomaniak/fonts-delivery`). The pipeline
runs on the ref pushed by the design-system script; the archive is already present in the
checkout at `archives/{ARCHIVE_NAME}`.

`.gitlab-ci.yml`:

```yaml
stages:
  - upload

upload-fonts-to-s3:
  stage: upload
  rules:
    - if: $CI_PIPELINE_SOURCE == "trigger"
  image: alpine:latest
  before_script:
    - apk add --no-cache aws-cli
  script:
    - mkdir -p /tmp/fonts
    - tar -xzf "archives/${ARCHIVE_NAME}" -C /tmp/fonts
    - |
      case "${FONT_MODE}" in
        prod) S3_PATH="latest" ;;
        *)    S3_PATH="dev" ;;
      esac
    - aws s3 sync /tmp/fonts/ "s3://${S3_BUCKET}/${S3_PATH}/" --exclude "*" --include "*.woff2" --include "*.min.css"
  variables:
    S3_BUCKET: 'fonts.storage.infomaniak.com'
    AWS_ACCESS_KEY_ID: $S3_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY: $S3_SECRET_ACCESS_KEY
```

`ARCHIVE_NAME` and `FONT_MODE` are passed as pipeline variables by the trigger API call. The S3
credentials are configured as protected/masked GitLab CI variables
(`S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`).

**GitLab setup checklist (manual, one-time):**

- [ ] Create the dedicated repository with a default branch matching `GITLAB_FONTS_TRIGGER_REF`
      (e.g. `main`) and an empty `archives/` directory (with a `.gitkeep`)
- [ ] Create a project access token (or deploy token) with `write_repository` scope →
      `GITLAB_FONTS_REPOSITORY_TOKEN`
- [ ] Create a pipeline trigger token → `GITLAB_FONTS_TRIGGER_TOKEN`
- [ ] Add the masked variables `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`
- [ ] In the design-system GitHub repository, create the secrets:
      `GITLAB_FONTS_REPOSITORY_URL`, `GITLAB_FONTS_REPOSITORY_TOKEN`,
      `GITLAB_FONTS_TRIGGER_URL`, `GITLAB_FONTS_TRIGGER_TOKEN`
