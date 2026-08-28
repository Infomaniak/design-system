# GitLab Fonts Delivery Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox
> (`- [ ]`) syntax for tracking.

**Goal:** Create the dedicated GitLab repository `infomaniak/fonts-delivery` on
`gitlab.infomaniak.ch` with a push-triggered pipeline that mirrors the `dev/` and `latest/` font
directories (pushed by the design-system) to Infomaniak's S3-compatible storage.

**Architecture:** The design-system CI (companion plan
`docs/plans/2026-08-24-font-s3-publishing.md`) commits the WOFF2 + min.css files directly under
`dev/` or `latest/` and pushes to this repository. The push itself is the pipeline trigger: two
jobs (`upload-dev-fonts`, `upload-latest-fonts`) each watch their directory via `changes:` rules,
refuse to sync an empty directory (anti-wipe guard) and mirror it to
`s3://{S3_BUCKET}/{dev|latest}/` through the custom S3 endpoint.

**Tech Stack:** GitLab CI (push-triggered pipelines, `changes:` rules), amazon/aws-cli container
image, S3-compatible storage via `--endpoint-url`, `glab` CLI (already authenticated on
`gitlab.infomaniak.ch`).

## Global Constraints

- **GitLab instance:** `gitlab.infomaniak.ch`
- **Project path:** `infomaniak/fonts-delivery` (adjust the group path at execution if the group
  differs — all glab commands and URLs use this path)
- **Pipeline source:** `push` only (`workflow.rules`) — no trigger token, no scheduled/web/trigger
  pipelines
- **Image:** `amazon/aws-cli:latest` with `entrypoint: [""]` (the image defaults to the `aws`
  entrypoint, which would swallow the script lines)
- **Runner tags:** `docker` (adjust to the actual runner tags at execution — see Task 3)
- **S3 sync semantics:** mirror with `--delete`, scoped to `*.woff2` and `*.min.css` — a font
  removed from the design-system disappears from S3 too (accepted behaviour)
- **Anti-wipe guard:** a directory without any `.woff2` file is never synced
- **Secrets:** never hardcoded — all credentials are masked GitLab CI/CD variables
- **Commits:** Conventional Commits format
- **README/docs language:** English

---

## Revision note (2026-08-28 — v3, push-triggered, no archive)

This plan was revised once:

- **v1** received a `fonts-{mode}-{shortSha}.tar.gz` archive committed by the design-system under
  `archives/`, plus an explicit Trigger Pipeline API call passing `{ ARCHIVE_NAME, FONT_MODE }`.
- **v3 (this version)** removes the archive AND the trigger: the design-system commits the font
  files directly under `dev/` / `latest/`, and the push itself starts the pipeline via `changes:`
  rules. No trigger token, no `ARCHIVE_NAME`/`FONT_MODE` variables, no curl in the E2E test.

## Architecture Overview

```
GitHub design-system (publish-fonts.script.ts, branch feat/fonts-s3-publishing / PR #319)
  │
  │ 1. git push: files committed under dev/ or latest/ on main
  │    (commit message: "chore: publish fonts {mode} {shortSha}")
  │
  ▼
GitLab (infomaniak/fonts-delivery) — the push STARTS the pipeline
  │  workflow: push source only
  │  upload-dev-fonts      (runs when dev/**/* changed)
  │  upload-latest-fonts   (runs when latest/**/* changed)
  │  each job:
  │    1. Anti-wipe guard: refuse to sync when the directory has no .woff2
  │    2. aws --endpoint-url $S3_ENDPOINT_URL s3 sync <dir>/
  │       → s3://$S3_BUCKET/<dir>/ --delete --no-progress
  │       (scoped to *.woff2 + *.min.css — .gitkeep never reaches S3)
  │
  ▼
S3-compatible storage → https://fonts.storage.infomaniak.com/{dev|latest}/
```

**Key design decisions:**

- **Push = pipeline trigger** — `workflow.rules` accepts only the `push` source and each job
  filters on its own directory (`changes: dev/**/*` / `changes: latest/**/*`). A push touching
  `dev/` runs only `upload-dev-fonts`; a push touching only `.gitlab-ci.yml` or `README.md`
  starts no job at all.
- **The repository tree is a browsable mirror of S3** — `dev/` and `latest/` contain exactly what
  S3 serves; anyone can review or diff published fonts without S3 access.
- **Anti-wipe guard** — `ls "${FONT_DIR}"/*.woff2` must succeed or the job exits 1: a stray
  commit that empties a directory can never wipe S3 (a lone `.gitkeep` fails the guard).
- **Sync scoped to the font file types** — `--exclude "*" --include "*.woff2" --include
"*.min.css"` also keeps `.gitkeep` out of S3; `--delete` only ever removes objects of these two
  types.
- **Custom S3 endpoint** — Infomaniak S3-compatible storage, so `aws` runs with
  `--endpoint-url "$S3_ENDPOINT_URL"`; endpoint, bucket and region are CI/CD variables, not
  hardcoded.
- **Retry semantics** — a failed upload is retried by re-running the job in the GitLab UI (the
  files are already committed). An identical-content re-publish produces an `--allow-empty`
  commit with an empty diff, which starts **no** pipeline — correct, because either the content
  is already on S3 or the previous pipeline is still there to re-run.
- **`entrypoint: [""]`** — the `amazon/aws-cli` image defines `aws` as its entrypoint; without
  the override every script line is passed as arguments to `aws` and the job fails.

---

## File Structure

### Files to Create (GitLab repository infomaniak/fonts-delivery)

| File              | Responsibility                                                  |
| ----------------- | --------------------------------------------------------------- |
| `README.md`       | Purpose, push contract, S3 layout, one-time setup summary       |
| `.gitlab-ci.yml`  | Pipeline: two push-triggered jobs guarding then mirroring to S3 |
| `dev/.gitkeep`    | Keeps `dev/` present before the first font push                 |
| `latest/.gitkeep` | Keeps `latest/` present before the first font push              |

### Files NOT Modified (design-system repository)

The design-system side is delivered on branch `feat/fonts-s3-publishing` (PR #319):
`publish-fonts.script.ts`, `push-gitlab-fonts` helper, workflow env wiring, `.env.example`
(revised to the direct-files design — see the companion plan). This plan only creates the GitLab
counterpart and the manual configuration binding both sides.

---

## Task 1: Bootstrap the repository

**Files:**

- Create (in `infomaniak/fonts-delivery`): `README.md`
- Create (in `infomaniak/fonts-delivery`): `dev/.gitkeep`
- Create (in `infomaniak/fonts-delivery`): `latest/.gitkeep`

**Interfaces:**

- Consumes: `glab` CLI (authenticated on `gitlab.infomaniak.ch`), `git` push via the glab HTTPS
  credential helper
- Produces: an empty delivery repository with a default `main` branch and the `dev/` + `latest/`
  directories the design-system push helper expects (it replaces their contents while preserving
  `.gitkeep`)

- [ ] **Step 1: Create the project**

Run:

```bash
glab repo create infomaniak/fonts-delivery --internal \
  --description "Font assets delivery repository (design-system to S3)"
```

Expected: project created on `gitlab.infomaniak.ch`. If the group path differs, use the actual
group and record it (it feeds `GITLAB_FONTS_REPOSITORY_URL` in Task 4).

- [ ] **Step 2: Clone and add the bootstrap files**

```bash
glab repo clone infomaniak/fonts-delivery /tmp/fonts-delivery
cd /tmp/fonts-delivery
mkdir -p dev latest
touch dev/.gitkeep latest/.gitkeep
```

Create `README.md` with the content below (full file — commit it as-is):

```markdown
# fonts-delivery

Delivery repository for Infomaniak Design System web fonts.

The [design-system](https://github.com/Infomaniak/design-system) CI builds the web fonts
(WOFF2 + min.css), commits them directly under `dev/` or `latest/` and pushes to this
repository. **The push itself is the pipeline trigger:**

| Directory | Fed by build mode | Mirrored to                |
| --------- | ----------------- | -------------------------- |
| `dev/`    | `dev` or `rc`     | `s3://{S3_BUCKET}/dev/`    |
| `latest/` | `prod`            | `s3://{S3_BUCKET}/latest/` |

Jobs (see `.gitlab-ci.yml`):

- `upload-dev-fonts` runs when a push changes `dev/**/*`
- `upload-latest-fonts` runs when a push changes `latest/**/*`

Each job refuses to sync a directory without any `.woff2` file (anti-wipe guard) and mirrors the
directory to the S3-compatible storage (endpoint and bucket are CI/CD variables) with `--delete`,
scoped to `*.woff2` + `*.min.css` — `.gitkeep` never reaches S3.

Public URL: `https://fonts.storage.infomaniak.com/{dev|latest}/`

## One-time setup

1. Project access token, role Maintainer, scope `write_repository` — used by design-system as
   `GITLAB_FONTS_REPOSITORY_TOKEN`
2. CI/CD variables (masked): `S3_ENDPOINT_URL`, `S3_BUCKET`, `AWS_ACCESS_KEY_ID`,
   `AWS_SECRET_ACCESS_KEY`, and `AWS_DEFAULT_REGION` if the storage requires a SigV4 region
3. Runner tags in `.gitlab-ci.yml` (default `docker`) adjusted to the actual runners
4. Protected branch `main` configured to allow the access token to push

## Retry semantics

A failed upload is retried by re-running the job in the GitLab UI (the files are already
committed). A re-publish of identical content produces an empty-diff commit, which starts no
pipeline — nothing to re-run, the content is already on S3.
```

- [ ] **Step 3: Commit and push**

```bash
git add README.md dev/.gitkeep latest/.gitkeep
git commit -m "chore: bootstrap fonts delivery repository"
git push origin main
```

- [ ] **Step 4: Verify**

Run: `glab repo view infomaniak/fonts-delivery`
Expected: `main` is the default branch and the README + both `.gitkeep` files are present.

---

## Task 2: Pipeline definition

**Files:**

- Create (in `infomaniak/fonts-delivery`): `.gitlab-ci.yml`

**Interfaces:**

- Consumes: the checkout content of the pushed commit (directories `dev/` / `latest/`), CI/CD
  variables `S3_ENDPOINT_URL`, `S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (and
  optional `AWS_DEFAULT_REGION`) — `aws` reads the last three from the environment
- Produces: mirrored `*.woff2` + `*.min.css` objects under `s3://{S3_BUCKET}/{dev|latest}/`;
  per-directory jobs selected by `changes:` rules

- [ ] **Step 1: Write `.gitlab-ci.yml`**

```yaml
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "push"

stages:
  - upload

.upload-fonts:
  stage: upload
  image:
    name: amazon/aws-cli:latest
    entrypoint: ['']
  tags:
    - docker
  script:
    - ls "${FONT_DIR}"/*.woff2 > /dev/null || (echo "Refusing to sync ${FONT_DIR}/: no .woff2 file (S3 would be wiped)." && exit 1)
    - aws --endpoint-url "${S3_ENDPOINT_URL}" s3 sync "${FONT_DIR}/" "s3://${S3_BUCKET}/${FONT_DIR}/" --delete --exclude "*" --include "*.woff2" --include "*.min.css" --no-progress
    - echo "Fonts available at https://fonts.storage.infomaniak.com/${FONT_DIR}/"

upload-dev-fonts:
  extends: .upload-fonts
  variables:
    FONT_DIR: dev
  rules:
    - if: $CI_PIPELINE_SOURCE == "push"
      changes:
        - dev/**/*

upload-latest-fonts:
  extends: .upload-fonts
  variables:
    FONT_DIR: latest
  rules:
    - if: $CI_PIPELINE_SOURCE == "push"
      changes:
        - latest/**/*
```

Notes:

- A push touching only `.gitlab-ci.yml` or `README.md` matches no job, so GitLab starts no
  pipeline; a push touching `dev/` runs only `upload-dev-fonts` (same for `latest/`).
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` are picked up by the aws-cli from the
  environment; they are defined as masked project CI/CD variables in Task 3, not in this file.
- `entrypoint: [""]` is mandatory with the `amazon/aws-cli` image (its default entrypoint is
  `aws`).

- [ ] **Step 2: Lint the CI file**

Run: `glab ci lint infomaniak/fonts-delivery --file .gitlab-ci.yml`
Expected: valid (or fallback: `glab ci lint < .gitlab-ci.yml` depending on the glab version).

- [ ] **Step 3: Commit and push — and check that no job runs**

```bash
git add .gitlab-ci.yml
git commit -m "feat: add push-triggered fonts upload pipeline to S3"
git push origin main
```

This push touches neither `dev/` nor `latest/`, so it must start no job — that is the first
verification of the `changes:` rules.

- [ ] **Step 4: Verify**

Run: `glab ci list --repo infomaniak/fonts-delivery`
Expected: no pipeline for the push of this commit (or an empty pipeline with zero jobs).

---

## Task 3: GitLab configuration (manual, one-time)

**Files:**

- No files — Settings UI / API only

**Interfaces:**

- Produces: the access token consumed by Task 4 (design-system secret) and the CI/CD variables
  consumed by the pipeline at runtime

- [ ] **Step 1: Adjust runner tags**

If the actual runners are not tagged `docker`, update `tags:` in `.gitlab-ci.yml` to the real
tag(s) and push the change (`git commit -m "chore: set runner tags"`).

- [ ] **Step 2: Create the project access token**

Settings → Access tokens → role **Maintainer**, scope **`write_repository`**. Copy the token
(`glpat-…`) — this is the design-system `GITLAB_FONTS_REPOSITORY_TOKEN`.

- [ ] **Step 3: Set the CI/CD variables**

Settings → CI/CD → Variables (flag **Masked** for the secrets):

| Variable                | Value                                         |
| ----------------------- | --------------------------------------------- |
| `S3_ENDPOINT_URL`       | Infomaniak S3-compatible endpoint             |
| `S3_BUCKET`             | Bucket serving `fonts.storage.infomaniak.com` |
| `AWS_ACCESS_KEY_ID`     | S3 access key                                 |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key                                 |
| `AWS_DEFAULT_REGION`    | Only if the storage requires a SigV4 region   |

- [ ] **Step 4: Protect the branch**

Settings → Repository → Protected branches: protect `main`, with **push allowed** for the role
of the project access token (Maintainer) — otherwise the design-system push fails with a
protected-branch error.

---

## Task 4: Wire the design-system side (manual)

**Files:**

- No files — GitHub repository secrets only

**Interfaces:**

- Consumes: the access token produced in Task 3
- Produces: the two secrets consumed by `.github/workflows/publish.yml` on the
  "Publish missing package versions" step

- [ ] **Step 1: Create the GitHub repository secrets**

On the `Infomaniak/design-system` GitHub repository → Settings → Secrets and variables → Actions:

| Secret                          | Value                                                        |
| ------------------------------- | ------------------------------------------------------------ |
| `GITLAB_FONTS_REPOSITORY_URL`   | `https://gitlab.infomaniak.ch/infomaniak/fonts-delivery.git` |
| `GITLAB_FONTS_REPOSITORY_TOKEN` | Project access token (Task 3 Step 2)                         |

These are the only two secrets — there is no trigger URL or trigger token anymore.

---

## Task 5: End-to-end verification

**Files:**

- No persistent files — two dummy files + temporary branch only

**Interfaces:**

- Consumes: push access to `infomaniak/fonts-delivery`
- Produces: evidence that push → `changes:` rules → anti-wipe guard → S3 sync works; test objects
  removed afterwards

- [ ] **Step 1: Push dummy fonts on a temporary branch**

```bash
cd /tmp/fonts-delivery
git checkout -b pipeline-test
printf 'dummy woff2' > dev/inter.woff2
printf 'body{}' > dev/inter.min.css
git add dev/ && git commit -m "chore: test fonts for pipeline verification"
git push origin pipeline-test
```

Expected: the push **starts a pipeline by itself** (no trigger call) with exactly one job,
`upload-dev-fonts` — `upload-latest-fonts` is skipped because `latest/**/*` did not change.

- [ ] **Step 2: Watch the pipeline**

Run: `glab ci status --repo infomaniak/fonts-delivery --branch pipeline-test`
Expected: job `upload-dev-fonts` succeeds; its log shows the `aws s3 sync` output and the final
"Fonts available at …" line.

- [ ] **Step 3: Verify the S3 result**

Run (with the S3 credentials available locally):
`aws --endpoint-url <S3_ENDPOINT_URL> s3 ls "s3://<S3_BUCKET>/dev/" | grep inter`
Expected: `inter.woff2` and `inter.min.css`. If local credentials are unavailable, the job log
from Step 2 is the evidence (it lists the uploaded objects).

- [ ] **Step 4: Verify the anti-wipe guard**

```bash
git rm dev/inter.woff2 dev/inter.min.css && git commit -m "chore: empty the dev directory" && git push origin pipeline-test
```

Expected: the push starts a pipeline (the deletion changes `dev/**/*`); the `upload-dev-fonts`
job FAILS with "Refusing to sync dev/: no .woff2 file (S3 would be wiped)." and
`s3://<S3_BUCKET>/dev/inter.woff2` still exists (Step 3 command still lists it). The failed
pipeline is the expected evidence.

- [ ] **Step 5: Cleanup**

```bash
aws --endpoint-url <S3_ENDPOINT_URL> s3 rm "s3://<S3_BUCKET>/dev/inter.woff2"
aws --endpoint-url <S3_ENDPOINT_URL> s3 rm "s3://<S3_BUCKET>/dev/inter.min.css"
git -C /tmp/fonts-delivery push origin --delete pipeline-test
```

Expected: S3 `dev/` no longer contains the test objects; the temporary branch is gone.

---

## Post-merge smoke test (design-system side)

After PR #319 (`feat/fonts-s3-publishing`) is merged and the secrets from Task 4 exist, the next
`ci:publish` run on `develop` publishes fonts end-to-end:

1. `publish-fonts.script.ts` commits the WOFF2 + min.css files under `dev/` or `latest/` and
   pushes to `main`
2. The push starts the pipeline; the matching job mirrors the directory to the same-named S3
   directory
3. Verify at `https://fonts.storage.infomaniak.com/{dev|latest}/`

## Security notes

- The project access token has the single `write_repository` scope and an expiry date — record
  the expiry in the team calendar
- All S3 credentials are masked GitLab CI/CD variables; they are never printed by the job (`aws`
  redacts nothing — avoid `set -x` style debug output, the default GitLab shell runner echo is
  safe)
- The repository contains only font assets and pipeline configuration — no secrets are ever
  committed; the repository URL with the embedded token is built at runtime in the design-system
  CI and never leaves it
