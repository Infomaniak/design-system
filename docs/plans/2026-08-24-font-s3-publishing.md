# Font S3 Publishing Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox
> (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken npm publish flow for the `@infomaniak-design-system/fonts` package
with a direct-files delivery: build fonts, commit the WOFF2 + min.css files to a dedicated GitLab
repository under a mode-mapped directory (`dev/` or `latest/`); the push itself starts the GitLab
pipeline which mirrors the directory to S3.

**Architecture:** GitHub (design-system) is the source of truth — TTF sources and JSON descriptors
are committed. GitHub Actions builds WOFF2 + min.css into `dist/web/` (via existing `ci:publish`).
The `publish-fonts.script.ts` collects the publishable files, maps the publish mode to the
delivery directory (`dev`/`rc` → `dev`, `prod` → `latest`), and pushes those files to the
dedicated GitLab repository (clone → replace the target directory contents → commit → push,
HTTPS + GitLab token). The push IS the trigger: the GitLab pipeline (companion plan
`docs/plans/2026-08-28-gitlab-fonts-delivery.md`) runs on push with `changes` filters on
`dev/**` / `latest/**` and syncs the changed directory to S3.

**Tech Stack:** TypeScript (NodeNext), Vitest, `node:child_process` (system `git`), GitHub Actions,
GitLab CI (push-triggered pipelines), S3-compatible storage.

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

## Revision note (2026-08-28 — v3, direct files)

This plan was revised twice:

- **v2** replaced GitHub Releases with an archive transport: tar.gz archive pushed to the GitLab
  repo, then an explicit Trigger Pipeline API call passing `{ ARCHIVE_NAME, FONT_MODE }`.
- **v3 (this version)** removes the archive AND the trigger entirely. The transport is the git
  push itself; the published files are committed directly under `dev/` / `latest/` and the GitLab
  pipeline runs on push (`changes:` filters). The code currently on branch
  `feat/fonts-s3-publishing` (archive + trigger helpers) is transformed by Tasks 2–4 below.

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
  │      a. Collects dist/web/*.woff2 + *.min.css (fail-fast if none)
  │      b. Maps mode → delivery directory (dev|rc → dev, prod → latest)
  │      c. Clones the dedicated GitLab repo, replaces that directory's
  │         contents with the files, commits, pushes (HTTPS + GitLab token)
  │
  ▼
GitLab CI (dedicated repository infomaniak/design-system/fonts-delivery)
  │
  │ Push to the repo STARTS the pipeline (rules: push + changes on dev/**|latest/**)
  │ upload-dev-fonts / upload-latest-fonts jobs:
  │   - Guard: refuse to sync a directory without any .woff2 (S3 would be wiped)
  │   - aws --endpoint-url $S3_ENDPOINT_URL s3 sync <dir>/ → s3://$S3_BUCKET/<dir>/
  │     --delete (mirror: a font removed from the design-system leaves S3 too)
  │
  ▼
S3: fonts.storage.infomaniak.com/{dev|latest}/
```

**Key design decisions:**

- **No archive** — the git commit transports the files themselves; the GitLab repository tree is
  an exact, browsable, diffable mirror of what is published to S3.
- **Push = pipeline trigger** — no Trigger Pipeline API call, no trigger token, no
  `ARCHIVE_NAME`/`FONT_MODE` variables: the `changes:` rules make the pipeline start exactly when
  `dev/**` or `latest/**` changes, and the pipeline checks out the exact pushed commit (no
  push→trigger race).
- **No GitHub API helpers** — the only GitHub-side data used is `sha` from the existing
  `GithubCiConfig`; no new GitHub permissions (`contents: read` stays sufficient).
- **Mode → directory mapping lives on the design-system side** — the publish script maps
  `dev`/`rc` → `dev` and `prod` → `latest` (same mapping as the font build's `serverURL`), so the
  GitLab job is mode-agnostic: it syncs whatever directory changed.
- **Retry semantics** — a failed S3 upload is retried by re-running the pipeline/job in the
  GitLab UI (the files are already committed). An identical-content re-publish produces an
  `--allow-empty` commit which creates **no** pipeline (empty diff) — correct, because either the
  content is already on S3 or the previous pipeline is still there to re-run.
- **System `git`** via `node:child_process.execFile` (token redacted from error messages);
  no new npm dependency, no `tar` anymore.
- **Dry-run safe** — when `CI_PUBLISH_DRY_RUN=true` (fork PRs, no secrets available), the script
  exits early instead of failing.
- **Anti-wipe guard (GitLab side)** — a directory without any `.woff2` is never synced, so an
  accidental empty push cannot wipe S3 (see companion plan).
- GitLab side (pipeline definition + setup) is out of scope for this repo — see companion plan
  `docs/plans/2026-08-28-gitlab-fonts-delivery.md`.

---

## File Structure

### Files to Create (design-system repo)

| File                                                                                  | Responsibility                                           |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.ts`      | Map publish mode (`dev`/`rc`/`prod`) to `dev` / `latest` |
| `scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.test.ts` | Test the mapping                                         |
| `scripts/helpers/gitlab/git/push-gitlab-fonts.ts`                                     | Clone dedicated repo, replace target dir, commit, push   |
| `scripts/helpers/gitlab/git/push-gitlab-fonts.test.ts`                                | Test the git push sequence (mocked `execFile`)           |

### Files to Modify (design-system repo)

| File                                                                          | Change                                                     |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `packages/assets/fonts/scripts/scripts/publish-fonts/publish-fonts.script.ts` | Replace archive + trigger with: map mode → dir, push files |
| `.env.example`                                                                | Keep only `GITLAB_FONTS_REPOSITORY_URL/TOKEN`              |
| `.github/workflows/publish.yml`                                               | Keep only the two `GITLAB_FONTS_REPOSITORY_*` env lines    |

### Files to Delete (design-system repo — superseded by v3)

| File                                                                              | Reason                                           |
| --------------------------------------------------------------------------------- | ------------------------------------------------ |
| `scripts/helpers/file/archive/create-tar-gz-archive.ts`                           | No archive anymore                               |
| `scripts/helpers/file/archive/create-tar-gz-archive.test.ts`                      | —                                                |
| `scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.ts`                     | No trigger anymore                               |
| `scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.test.ts`                | —                                                |
| `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-url.ts`                  | No trigger variables anymore                     |
| `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-token.ts`                | —                                                |
| `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-ref.ts`                  | —                                                |
| `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-{url,token,ref}.test.ts` | —                                                |
| `scripts/helpers/gitlab/git/push-gitlab-fonts-archive.ts` (+ test)                | Renamed and reworked into `push-gitlab-fonts.ts` |

### External (out of scope for this plan — dedicated GitLab repository)

Covered by the companion plan `docs/plans/2026-08-28-gitlab-fonts-delivery.md`:
repository bootstrap (`README.md`, `dev/.gitkeep`, `latest/.gitkeep`), `.gitlab-ci.yml`
(push-triggered `aws s3 sync` jobs), GitLab configuration and end-to-end verification.

---

## Task 1: `publish-mode-to-font-publish-directory` helper

**Files:**

- Create: `scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.ts`
- Test: `scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.test.ts`

**Interfaces:**

- Consumes: `PublishMode` from `./publish-mode.ts` (`'dev' | 'rc' | 'prod'`), the same type used
  by `publish-mode-to-npm-tag.ts` in the same directory
- Produces: `publishModeToFontPublishDirectory(mode)` → `'dev' | 'latest'` (`dev` and `rc` →
  `dev`, `prod` → `latest`), and the `FontPublishDirectory` type

- [ ] **Step 1: Write the failing test**

Create `scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { publishModeToFontPublishDirectory } from './publish-mode-to-font-publish-directory.ts';

describe('publishModeToFontPublishDirectory', () => {
  it('maps dev to dev', () => {
    expect(publishModeToFontPublishDirectory('dev')).toBe('dev');
  });

  it('maps rc to dev', () => {
    expect(publishModeToFontPublishDirectory('rc')).toBe('dev');
  });

  it('maps prod to latest', () => {
    expect(publishModeToFontPublishDirectory('prod')).toBe('latest');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.ts`:

```typescript
import type { PublishMode } from './publish-mode.ts';

export type FontPublishDirectory = 'dev' | 'latest';

export function publishModeToFontPublishDirectory(mode: PublishMode): FontPublishDirectory {
  switch (mode) {
    case 'dev':
    case 'rc':
      return 'dev';
    case 'prod':
      return 'latest';
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.test.ts`
Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.ts scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.test.ts
git commit -m "feat(fonts): add publish mode to font publish directory helper"
```

---

## Task 2: Trim GitLab env helpers

**Files:**

- Delete: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-url.ts`
- Delete: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-url.test.ts`
- Delete: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-token.ts`
- Delete: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-token.test.ts`
- Delete: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-ref.ts`
- Delete: `scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-ref.test.ts`
- Keep: `get-env-gitlab-fonts-repository-url.ts` (+ test) and
  `get-env-gitlab-fonts-repository-token.ts` (+ test) — unchanged

**Interfaces:**

- Produces (after this task): only `getEnvGitlabFontsRepositoryUrl()` and
  `getEnvGitlabFontsRepositoryToken()` remain under `scripts/helpers/gitlab/env/`

- [ ] **Step 1: Delete the three trigger env helpers and their tests**

```bash
git rm scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-url.ts scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-url.test.ts scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-token.ts scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-token.test.ts scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-ref.ts scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-ref.test.ts
```

- [ ] **Step 2: Verify nothing imports the deleted helpers**

Run: `grep -rn "getEnvGitlabFontsTrigger" scripts/ packages/ --include='*.ts'`
Expected: no matches. (The publish script still imports them until Task 5 — if this task runs
before Task 5, expect exactly one hit in `publish-fonts.script.ts` and defer: either run this
verification after Task 5, or accept that single known hit and confirm Task 5 removes it.)

- [ ] **Step 3: Commit**

```bash
git commit -m "refactor(fonts): drop GitLab trigger env helpers"
```

---

## Task 3: Delete the superseded archive and trigger helpers

**Files:**

- Delete: `scripts/helpers/file/archive/create-tar-gz-archive.ts`
- Delete: `scripts/helpers/file/archive/create-tar-gz-archive.test.ts`
- Delete: `scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.ts`
- Delete: `scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.test.ts`

**Interfaces:**

- Removes: `createTarGzArchive` and `triggerGitlabFontsPipeline` — the reworked
  `push-gitlab-fonts` (Task 4) and the publish script (Task 5) no longer use them

- [ ] **Step 1: Delete the files**

```bash
git rm scripts/helpers/file/archive/create-tar-gz-archive.ts scripts/helpers/file/archive/create-tar-gz-archive.test.ts scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.ts scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.test.ts
```

- [ ] **Step 2: Verify nothing imports them anymore**

Run: `grep -rn "createTarGzArchive\|triggerGitlabFontsPipeline" scripts/ packages/ --include='*.ts'`
Expected: no matches (see the same caveat as Task 2 Step 2 for the publish script hit).

- [ ] **Step 3: Commit**

```bash
git commit -m "refactor(fonts): remove archive and trigger helpers"
```

---

## Task 4: Rework the push helper — `push-gitlab-fonts`

**Files:**

- Rename + rework: `scripts/helpers/gitlab/git/push-gitlab-fonts-archive.ts` →
  `scripts/helpers/gitlab/git/push-gitlab-fonts.ts`
- Test: rework `scripts/helpers/gitlab/git/push-gitlab-fonts-archive.test.ts` →
  `scripts/helpers/gitlab/git/push-gitlab-fonts.test.ts`

**Interfaces:**

- Consumes: `node:child_process.execFile` (system `git`), `node:fs/promises`
- Produces: `pushGitlabFonts({ repositoryUrl, repositoryToken, sourceDirectory, fileNames,
targetDirectoryName, commitMessage, workDirectory })` → `Promise<void>`. Clones the repository
  (depth 1, HTTPS + GitLab token injected as `oauth2` user, token redacted from all error
  messages), replaces the contents of `{targetDirectoryName}/` at the repository root (preserving
  `.gitkeep`),
  commits with `--allow-empty` and an inline git identity, pushes `HEAD`.
- Keeps from the previous version: `redact`/`runGit` helpers, `GIT_USER_NAME`/`GIT_USER_EMAIL`,
  `--allow-empty`.

- [ ] **Step 1: Write the failing test**

Create `scripts/helpers/gitlab/git/push-gitlab-fonts.test.ts`:

```typescript
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const execFileMock = vi.hoisted(() => vi.fn());
vi.mock('node:child_process', () => ({
  default: { execFile: execFileMock },
  execFile: execFileMock,
}));

import { pushGitlabFonts } from './push-gitlab-fonts.ts';

describe('pushGitlabFonts', () => {
  let tempDir: string;
  let workDir: string;
  let repoDir: string;
  let sourceDir: string;

  const buildOptions = (workDirectory: string) => ({
    repositoryUrl: 'https://gitlab.example.com/infomaniak/fonts-delivery.git',
    repositoryToken: 'test-token',
    sourceDirectory: sourceDir,
    fileNames: ['inter.woff2', 'inter.min.css'] as const,
    targetDirectoryName: 'latest',
    commitMessage: 'chore: publish fonts prod abc123d',
    workDirectory,
  });

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'push-gitlab-fonts-test-'));
    workDir = join(tempDir, 'work');
    repoDir = join(workDir, 'repository');
    sourceDir = join(tempDir, 'source');
    await mkdir(repoDir, { recursive: true });
    await mkdir(sourceDir, { recursive: true });
    await writeFile(join(sourceDir, 'inter.woff2'), 'woff2-content');
    await writeFile(join(sourceDir, 'inter.min.css'), 'css-content');

    execFileMock.mockReset();
    execFileMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(null);
    });
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('clones, replaces the target directory contents, commits and pushes', async () => {
    await pushGitlabFonts(buildOptions(workDir));

    const repositoryUrlWithAuth =
      'https://oauth2:test-token@gitlab.example.com/infomaniak/fonts-delivery.git';

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
          '--allow-empty',
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
      readFile(join(repoDir, 'latest', 'inter.woff2'), { encoding: 'utf8' }),
    ).resolves.toBe('woff2-content');
    await expect(
      readFile(join(repoDir, 'latest', 'inter.min.css'), { encoding: 'utf8' }),
    ).resolves.toBe('css-content');
  });

  it('removes previous files of the target directory, preserving .gitkeep', async () => {
    const targetDir = join(repoDir, 'latest');
    await mkdir(targetDir, { recursive: true });
    await writeFile(join(targetDir, 'old-font.woff2'), 'old');
    await writeFile(join(targetDir, '.gitkeep'), '');

    await pushGitlabFonts(buildOptions(workDir));

    const fileNames = (await readdir(targetDir)).sort();
    expect(fileNames).toEqual(['.gitkeep', 'inter.min.css', 'inter.woff2']);
  });

  it('redacts the repository token from clone failure errors', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(
        new Error(
          'Command failed: git clone https://oauth2:test-token@gitlab.example.com/infomaniak/fonts-delivery.git',
        ),
      );
    });

    const rejection: unknown = await pushGitlabFonts(buildOptions(workDir)).catch(
      (error: unknown) => error,
    );

    expect(rejection).toBeInstanceOf(Error);
    expect((rejection as Error).message).toContain('https://oauth2:***@');
    expect((rejection as Error).message).not.toContain('test-token');
  });

  it('does not alter the error message when the token is empty', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(new Error('clone failed'));
    });

    const options = { ...buildOptions(workDir), repositoryToken: '' };

    await expect(pushGitlabFonts(options)).rejects.toThrow(/clone.*failed/s);
  });

  it('rejects with a descriptive error when a git command fails', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const command = args[1] as string[];
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(command[0] === 'push' ? new Error('push failed') : null);
    });

    await expect(pushGitlabFonts(buildOptions(workDir))).rejects.toThrow(
      'git push origin HEAD failed: push failed',
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/helpers/gitlab/git/push-gitlab-fonts.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Delete `push-gitlab-fonts-archive.ts` and its test, then create
`scripts/helpers/gitlab/git/push-gitlab-fonts.ts`:

```typescript
import { execFile } from 'node:child_process';
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

export interface PushGitlabFontsOptions {
  readonly repositoryUrl: string;
  readonly repositoryToken: string;
  readonly sourceDirectory: string;
  readonly fileNames: readonly string[];
  readonly targetDirectoryName: string;
  readonly commitMessage: string;
  readonly workDirectory: string;
}

const GIT_USER_NAME = 'design-system-ci';

const GIT_USER_EMAIL = 'design-system-ci@infomaniak.com';

const REDACTED = '***';

function redact(value: string, secret: string): string {
  return secret.length === 0 ? value : value.replaceAll(secret, REDACTED);
}

function runGit(args: readonly string[], repositoryToken: string, cwd: string): Promise<void> {
  return new Promise<void>((resolve, reject): void => {
    execFile('git', [...args], { cwd }, (error) => {
      if (error !== null) {
        const message = `git ${redact(args.join(' '), repositoryToken)} failed: ${redact(
          error.message,
          repositoryToken,
        )}`;
        reject(new Error(message));
        return;
      }

      resolve();
    });
  });
}

export async function pushGitlabFonts({
  repositoryUrl,
  repositoryToken,
  sourceDirectory,
  fileNames,
  targetDirectoryName,
  commitMessage,
  workDirectory,
}: PushGitlabFontsOptions): Promise<void> {
  const repositoryUrlWithAuth: string = repositoryUrl.replace(
    'https://',
    `https://oauth2:${repositoryToken}@`,
  );

  const repositoryDirectory: string = join(workDirectory, 'repository');
  const fontsDirectory: string = join(repositoryDirectory, targetDirectoryName);

  await runGit(
    ['clone', '--depth', '1', repositoryUrlWithAuth, repositoryDirectory],
    repositoryToken,
    workDirectory,
  );

  await mkdir(fontsDirectory, { recursive: true });

  const existingFileNames: string[] = await readdir(fontsDirectory);

  for (const existingFileName of existingFileNames) {
    if (existingFileName !== '.gitkeep') {
      await rm(join(fontsDirectory, existingFileName));
    }
  }

  for (const fileName of fileNames) {
    await copyFile(join(sourceDirectory, fileName), join(fontsDirectory, fileName));
  }

  await runGit(['add', '-A'], repositoryToken, repositoryDirectory);

  await runGit(
    [
      '-c',
      `user.name=${GIT_USER_NAME}`,
      '-c',
      `user.email=${GIT_USER_EMAIL}`,
      'commit',
      '--allow-empty',
      '-m',
      commitMessage,
    ],
    repositoryToken,
    repositoryDirectory,
  );

  await runGit(['push', 'origin', 'HEAD'], repositoryToken, repositoryDirectory);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/helpers/gitlab/git/push-gitlab-fonts.test.ts`
Expected: PASS — all 5 tests green.

- [ ] **Step 5: Check coverage on the reworked helper**

Run: `npx vitest run --coverage --coverage.include='scripts/helpers/gitlab/**' scripts/helpers/gitlab/`
Expected: 100% on `push-gitlab-fonts.ts`.

- [ ] **Step 6: Commit**

```bash
git rm scripts/helpers/gitlab/git/push-gitlab-fonts-archive.ts scripts/helpers/gitlab/git/push-gitlab-fonts-archive.test.ts
git add scripts/helpers/gitlab/git/push-gitlab-fonts.ts scripts/helpers/gitlab/git/push-gitlab-fonts.test.ts
git commit -m "refactor(fonts): push published font files instead of an archive"
```

---

## Task 5: Rewrite the publish script, env example and workflow

**Files:**

- Modify: `packages/assets/fonts/scripts/scripts/publish-fonts/publish-fonts.script.ts`
- Modify: `.env.example`
- Modify: `.github/workflows/publish.yml`

**Interfaces:**

- Consumes: `getEnvPublishConfig` (mode: `dev` | `rc` | `prod`), `getEnvGithubCiConfig` (sha),
  `publishModeToFontPublishDirectory`, `pushGitlabFonts`, `getEnvGitlabFontsRepositoryUrl()`,
  `getEnvGitlabFontsRepositoryToken()`, `getEnvCiPublishDryRun`, `glob` from `node:fs/promises`
- Produces: `publish-fonts` script that copies `dist/web` WOFF2 + min.css into
  `fonts/{dev|latest}/` of the dedicated GitLab repository and pushes — the push starts the
  GitLab pipeline. Skips everything when `CI_PUBLISH_DRY_RUN=true`.

- [ ] **Step 1: Rewrite the script**

Replace the content of
`packages/assets/fonts/scripts/scripts/publish-fonts/publish-fonts.script.ts`:

```typescript
import { glob, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getEnvGithubCiConfig } from '../../../../../../scripts/helpers/github/github-ci-config/env/get-env-github-ci-config.ts';
import { getEnvGitlabFontsRepositoryToken } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-token.ts';
import { getEnvGitlabFontsRepositoryUrl } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-url.ts';
import { pushGitlabFonts } from '../../../../../../scripts/helpers/gitlab/git/push-gitlab-fonts.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { getEnvCiPublishDryRun } from '../../../../../../scripts/helpers/publish/env/get-env-ci-publish-dry-run.ts';
import { getEnvPublishConfig } from '../../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';
import { publishModeToFontPublishDirectory } from '../../../../../../scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const DIST_WEB_DIR: string = join(ROOT_DIR, 'dist', 'web');

await runScript('publish-fonts', async (logger: Logger): Promise<void> => {
  if (getEnvCiPublishDryRun()) {
    logger.info('Dry run: skipping fonts publication.');
    return;
  }

  const { mode } = getEnvPublishConfig();

  const { sha } = getEnvGithubCiConfig();
  const shortSha: string = sha.slice(0, 7);

  const fontPublishDirectory: string = publishModeToFontPublishDirectory(mode);

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

  await logger.asyncTask('push-gitlab-fonts', async (): Promise<void> => {
    await pushGitlabFonts({
      repositoryUrl: getEnvGitlabFontsRepositoryUrl(),
      repositoryToken: getEnvGitlabFontsRepositoryToken(),
      sourceDirectory: DIST_WEB_DIR,
      fileNames,
      targetDirectoryName: fontPublishDirectory,
      commitMessage: `chore: publish fonts ${mode} ${shortSha}`,
      workDirectory: await mkdtemp(join(tmpdir(), 'publish-fonts-')),
    });
  });
});
```

- [ ] **Step 2: Update `.env.example`**

Replace the GITLAB FONTS section (keep only the repository transport — no trigger anymore):

```
# GITLAB FONTS
# Dedicated GitLab repository receiving the published font files (transport to S3).
GITLAB_FONTS_REPOSITORY_URL="https://gitlab.infomaniak.ch/infomaniak/design-system/fonts-delivery.git"
# GitLab token with write_repository scope on the dedicated repository.
GITLAB_FONTS_REPOSITORY_TOKEN="glpat-xxxxxxxxxxxxxxxxxxxx"
```

- [ ] **Step 3: Update `.github/workflows/publish.yml`**

In the env block of the **"Publish missing package versions"** step, keep only:

```yaml
GITLAB_FONTS_REPOSITORY_URL: ${{ secrets.GITLAB_FONTS_REPOSITORY_URL }}
GITLAB_FONTS_REPOSITORY_TOKEN: ${{ secrets.GITLAB_FONTS_REPOSITORY_TOKEN }}
```

Remove the `GITLAB_FONTS_TRIGGER_URL`, `GITLAB_FONTS_TRIGGER_TOKEN` and
`GITLAB_FONTS_TRIGGER_REF: main` lines. GitHub repository secrets to create are now only
`GITLAB_FONTS_REPOSITORY_URL` and `GITLAB_FONTS_REPOSITORY_TOKEN`.

- [ ] **Step 4: Commit**

```bash
git add packages/assets/fonts/scripts/scripts/publish-fonts/publish-fonts.script.ts .env.example .github/workflows/publish.yml
git commit -m "refactor(fonts): publish files directly, pipeline triggered by the push"
```

---

## Task 6: Verify the full revision and coverage

**Files:**

- No new files

- [ ] **Step 1: Run the helper tests**

Run:
`npx vitest run --reporter=verbose scripts/helpers/publish/publish-mode/ scripts/helpers/gitlab/ scripts/helpers/file/`
Expected: All tests pass; the deleted helpers' tests are gone.

- [ ] **Step 2: Run scoped coverage**

Run:

```bash
npx vitest run --coverage \
  --coverage.include='scripts/helpers/gitlab/**' \
  --coverage.include='scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.ts' \
  scripts/helpers/gitlab/ scripts/helpers/publish/
```

Expected: exit 0 with 100% coverage for `push-gitlab-fonts.ts`,
`get-env-gitlab-fonts-repository-url.ts`, `get-env-gitlab-fonts-repository-token.ts`, and
`publish-mode-to-font-publish-directory.ts` (scoped flags required in Vitest v4.1.10;
a bare `--coverage` instruments everything and fails on a pre-existing unrelated resolution
issue in `apps/docs`). The includes are narrowed to exactly the revision's helper files
because sibling legacy helpers under `scripts/helpers/publish/**` are out of scope, have no
tests, and would otherwise drag the aggregate below the global 100% threshold.

- [ ] **Step 3: Run typecheck**

Run: `yarn check:types`
Expected: No errors.

- [ ] **Step 4: Run format check**

Run: `yarn format:check`
Expected: No formatting errors. If any, run `yarn format:fix` on the touched files only.

- [ ] **Step 5: Commit any remaining fixes**

```bash
git add -A
git commit -m "chore(fonts): fix coverage and formatting"
```

---

## External: Dedicated GitLab repository (reference)

See the companion plan `docs/plans/2026-08-28-gitlab-fonts-delivery.md` — the GitLab pipeline is
push-triggered (`changes: dev/** | latest/**`), maps directories 1:1 to S3
(`dev/` → `s3://{S3_BUCKET}/dev/`, `latest/` → `s3://{S3_BUCKET}/latest/`), mirrors with
`--delete`, and refuses to sync a directory without `.woff2` files (anti-wipe guard).
