# GitLab Fonts Delivery Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox
> (`- [ ]`) syntax for tracking.

**Goal:** Create the dedicated GitLab repository `infomaniak/fonts-delivery` on
`gitlab.infomaniak.ch` and its pipeline, which receives the fonts archive pushed by the
design-system and uploads it to Infomaniak's S3-compatible storage.

**Architecture:** The design-system CI (see companion plan
`docs/plans/2026-08-24-font-s3-publishing.md`) commits a
`fonts-{mode}-{shortSha}.tar.gz` archive to `archives/` and then triggers a pipeline via the
GitLab Trigger Pipeline API with `{ ARCHIVE_NAME, FONT_MODE }`. The `upload-fonts-to-s3` job
(amazon/aws-cli image, `docker` runner tag) validates the trigger variables, extracts the archive
(already present in the checkout at the triggered ref), maps `FONT_MODE` to the S3 path
(`prod` → `latest`, `dev`/`rc` → `dev`) and mirrors the contents to
`s3://{S3_BUCKET}/{S3_PATH}/` through the custom S3 endpoint.

**Tech Stack:** GitLab CI (pipeline trigger source), amazon/aws-cli container image, S3-compatible
storage via `--endpoint-url`, `glab` CLI (already authenticated on `gitlab.infomaniak.ch`).

## Global Constraints

- **GitLab instance:** `gitlab.infomaniak.ch`
- **Project path:** `infomaniak/fonts-delivery` (adjust the group path at execution if the group
  differs — all glab commands and URLs use this path)
- **Pipeline source:** `trigger` only — archive pushes must never start a pipeline
- **Image:** `amazon/aws-cli:latest` (pin the digest at execution if instance policy requires)
- **Runner tags:** `docker` (adjust to the actual runner tags at execution — see Task 3)
- **S3 sync semantics:** mirror with `--delete`, scoped to `*.woff2` and `*.min.css` — a font
  removed from the design-system disappears from S3 too (accepted behaviour)
- **Secrets:** never hardcoded — all credentials are masked GitLab CI/CD variables
- **Commits:** Conventional Commits format
- **README/docs language:** English

---

## Architecture Overview

```
GitHub design-system (publish-fonts.script.ts, branch feat/fonts-s3-publishing / PR #319)
  │
  │ 1. git push: archives/fonts-{mode}-{shortSha}.tar.gz on main
  │ 2. POST trigger pipeline (trigger token)
  │      ref: main
  │      variables: { ARCHIVE_NAME, FONT_MODE }
  │      (push itself starts NO pipeline — workflow.rules below)
  │
  ▼
GitLab (infomaniak/fonts-delivery) — pipeline, CI_PIPELINE_SOURCE == "trigger"
  │
  │ upload-fonts-to-s3 job:
  │   1. Validates ARCHIVE_NAME (regex, no path traversal) and FONT_MODE
  │   2. Maps mode → S3_PATH (prod → latest, dev|rc → dev)
  │   3. Extracts archives/{ARCHIVE_NAME} from the checkout
  │   4. aws --endpoint-url $S3_ENDPOINT_URL s3 sync /tmp/fonts/
  │      → s3://$S3_BUCKET/$S3_PATH/ --delete --include "*.woff2" --include "*.min.css"
  │
  ▼
S3-compatible storage → https://fonts.storage.infomaniak.com/{dev|latest}/
```

**Key design decisions:**

- **`workflow.rules` restricted to `trigger`** — the design-system pushes archive commits
  directly; without this rule every archive push would also start a pipeline and upload twice.
- **Strict trigger-variable validation** — `ARCHIVE_NAME` must match
  `^fonts-(dev|rc|prod)-[0-9a-f]{7}\.tar\.gz$` (no path traversal, deterministic naming from the
  design-system side), `FONT_MODE` must be `dev`, `rc` or `prod`; unknown modes fail loudly.
- **Archive read from the checkout** — no download step, no artifact API: the job checks out the
  triggered ref, which contains `archives/{ARCHIVE_NAME}`.
- **Mirror sync (`--delete`) scoped to the font file types** — S3 reflects exactly what the
  archive contains; objects of other types in the same path are never touched.
- **Custom S3 endpoint** — Infomaniak S3-compatible storage, so `aws` runs with
  `--endpoint-url "$S3_ENDPOINT_URL"`; endpoint, bucket and region are CI/CD variables, not
  hardcoded.
- **Accepted tradeoff (documented in the design-system plan):** push→trigger race if concurrent
  publishes interleave across refs — the job fails on a missing archive and the retry
  re-publishes. Hardening option: pass the pushed commit SHA as trigger `ref`.

---

## File Structure

### Files to Create (GitLab repository infomaniak/fonts-delivery)

| File               | Responsibility                                                        |
|--------------------|-----------------------------------------------------------------------|
| `README.md`        | Purpose, trigger contract, S3 layout, one-time setup summary          |
| `.gitlab-ci.yml`   | Pipeline: validate trigger variables → extract → mirror sync to S3    |
| `archives/.gitkeep`| Keeps `archives/` present before the first archive push               |

### Files NOT Modified (design-system repository)

The design-system side is already delivered on branch `feat/fonts-s3-publishing` (PR #319):
`publish-fonts.script.ts`, helpers, workflow env wiring, `.env.example`. This plan only creates
the GitLab counterpart and the manual configuration binding both sides.

---

## Task 1: Bootstrap the repository

**Files:**

- Create (in `infomaniak/fonts-delivery`): `README.md`
- Create (in `infomaniak/fonts-delivery`): `archives/.gitkeep`

**Interfaces:**

- Consumes: `glab` CLI (authenticated on `gitlab.infomaniak.ch`), `git` push via the glab HTTPS
  credential helper
- Produces: an empty delivery repository with a default `main` branch and the `archives/`
  directory the design-system push helper expects

- [ ] **Step 1: Create the project**

Run:
```bash
glab repo create infomaniak/fonts-delivery --internal \
  --description "Font assets delivery pipeline (design-system to S3)"
```
Expected: project created on `gitlab.infomaniak.ch`. If the group path differs, use the actual
group and record it (it feeds `GITLAB_FONTS_REPOSITORY_URL` in Task 4).

- [ ] **Step 2: Clone and add the bootstrap files**

```bash
glab repo clone infomaniak/fonts-delivery /tmp/fonts-delivery
cd /tmp/fonts-delivery
mkdir -p archives
touch archives/.gitkeep
```

Create `README.md` with the content below (full file — commit it as-is):

```markdown
# fonts-delivery

Delivery repository for Infomaniak Design System web fonts.

The [design-system](https://github.com/Infomaniak/design-system) CI builds the web fonts
(WOFF2 + min.css), packs them into `fonts-{mode}-{shortSha}.tar.gz`, commits the archive to
`archives/` on `main`, then triggers this project's pipeline via the Trigger Pipeline API with:

| Variable       | Meaning                                              |
|----------------|------------------------------------------------------|
| `ARCHIVE_NAME` | Archive file name, e.g. `fonts-prod-abc123d.tar.gz`  |
| `FONT_MODE`    | Build mode: `dev`, `rc` or `prod`                    |

The `upload-fonts-to-s3` job extracts the archive and mirrors its contents to the S3-compatible
storage (endpoint and bucket are CI/CD variables):

- `s3://{S3_BUCKET}/dev/` for mode `dev` or `rc`
- `s3://{S3_BUCKET}/latest/` for mode `prod`

Public URL: `https://fonts.storage.infomaniak.com/{dev|latest}/`

Pipelines run on `trigger` source only — archive pushes never start a pipeline.

## One-time setup

1. Pipeline trigger token (Settings > CI/CD > Pipeline trigger tokens) — used by design-system
   as `GITLAB_FONTS_TRIGGER_TOKEN`
2. Project access token, role Maintainer, scope `write_repository` — used by design-system as
   `GITLAB_FONTS_REPOSITORY_TOKEN`
3. CI/CD variables (masked): `S3_ENDPOINT_URL`, `S3_BUCKET`, `AWS_ACCESS_KEY_ID`,
   `AWS_SECRET_ACCESS_KEY`, and `AWS_DEFAULT_REGION` if the storage requires a SigV4 region
4. Runner tags in `.gitlab-ci.yml` (default `docker`) adjusted to the actual runners
5. Protected branch `main` configured to allow the access token to push
```

- [ ] **Step 3: Commit and push**

```bash
git add README.md archives/.gitkeep
git commit -m "chore: bootstrap fonts delivery repository"
git push origin main
```

- [ ] **Step 4: Verify**

Run: `glab repo view infomaniak/fonts-delivery`
Expected: `main` is the default branch and the README + `archives/.gitkeep` are present.

---

## Task 2: Pipeline definition

**Files:**

- Create (in `infomaniak/fonts-delivery`): `.gitlab-ci.yml`

**Interfaces:**

- Consumes: trigger variables `ARCHIVE_NAME` and `FONT_MODE` (sent by the design-system script),
  checkout content of the triggered ref, CI/CD variables `S3_ENDPOINT_URL`, `S3_BUCKET`,
  `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (and optional `AWS_DEFAULT_REGION`) — `aws` reads
  the last three from the environment
- Produces: mirrored `*.woff2` + `*.min.css` objects under `s3://{S3_BUCKET}/{dev|latest}/`

- [ ] **Step 1: Write `.gitlab-ci.yml`**

```yaml
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "trigger"

stages:
  - upload

upload-fonts-to-s3:
  stage: upload
  image: amazon/aws-cli:latest
  tags:
    - docker
  rules:
    - if: $CI_PIPELINE_SOURCE == "trigger"
  script:
    - test -n "${ARCHIVE_NAME}" || (echo "ARCHIVE_NAME variable is required" && exit 1)
    - test -n "${FONT_MODE}" || (echo "FONT_MODE variable is required" && exit 1)
    - echo "${ARCHIVE_NAME}" | grep -Eq '^fonts-(dev|rc|prod)-[0-9a-f]{7}\.tar\.gz$' || (echo "Invalid ARCHIVE_NAME: ${ARCHIVE_NAME}" && exit 1)
    - case "${FONT_MODE}" in prod) S3_PATH="latest" ;; dev|rc) S3_PATH="dev" ;; *) echo "Invalid FONT_MODE: ${FONT_MODE}" && exit 1 ;; esac
    - test -f "archives/${ARCHIVE_NAME}" || (echo "Archive archives/${ARCHIVE_NAME} not found at ${CI_COMMIT_SHA}" && exit 1)
    - mkdir -p /tmp/fonts
    - tar -xzf "archives/${ARCHIVE_NAME}" -C /tmp/fonts
    - aws --endpoint-url "${S3_ENDPOINT_URL}" s3 sync /tmp/fonts/ "s3://${S3_BUCKET}/${S3_PATH}/" --delete --exclude "*" --include "*.woff2" --include "*.min.css" --no-progress
    - echo "Fonts available at https://fonts.storage.infomaniak.com/${S3_PATH}/"
```

Notes:
- `workflow.rules` makes the trigger source the only way a pipeline can start — archive pushes
  from the design-system never create one (no double upload).
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` are picked up by the aws-cli from the
  environment; they are defined as masked project CI/CD variables in Task 3, not in this file.

- [ ] **Step 2: Lint the CI file**

Run: `glab ci lint infomaniak/fonts-delivery --file .gitlab-ci.yml`
Expected: valid (or fallback: `glab ci lint < .gitlab-ci.yml` depending on the glab version).

- [ ] **Step 3: Commit and push**

```bash
git add .gitlab-ci.yml
git commit -m "feat: add trigger-only fonts upload pipeline to S3"
git push origin main
```

---

## Task 3: GitLab configuration (manual, one-time)

**Files:**

- No files — Settings UI / API only

**Interfaces:**

- Produces: the tokens and variables consumed by Task 4 (design-system secrets) and by the
  pipeline at runtime

- [ ] **Step 1: Adjust runner tags**

If the actual runners are not tagged `docker`, update `tags:` in `.gitlab-ci.yml` to the real
tag(s) and push the change (`git commit -m "chore: set runner tags"`).

- [ ] **Step 2: Create the pipeline trigger token**

Settings → CI/CD → Pipeline trigger tokens → add. Copy the token (`glptt-…`) — this is the
design-system `GITLAB_FONTS_TRIGGER_TOKEN`. Note the project id (shown on the project overview)
for the trigger URL.

- [ ] **Step 3: Create the project access token**

Settings → Access tokens → role **Maintainer**, scope **`write_repository`**. Copy the token
(`glpat-…`) — this is the design-system `GITLAB_FONTS_REPOSITORY_TOKEN`.

- [ ] **Step 4: Set the CI/CD variables**

Settings → CI/CD → Variables (flag **Masked** for the secrets):

| Variable                | Value                                            |
|-------------------------|--------------------------------------------------|
| `S3_ENDPOINT_URL`       | Infomaniak S3-compatible endpoint                |
| `S3_BUCKET`             | Bucket serving `fonts.storage.infomaniak.com`    |
| `AWS_ACCESS_KEY_ID`     | S3 access key                                    |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key                                    |
| `AWS_DEFAULT_REGION`    | Only if the storage requires a SigV4 region      |

- [ ] **Step 5: Protect the branch**

Settings → Repository → Protected branches: protect `main`, with **push allowed** for the role
of the project access token (Maintainer) — otherwise the design-system push fails with a
protected-branch error.

---

## Task 4: Wire the design-system side (manual)

**Files:**

- No files — GitHub repository secrets only

**Interfaces:**

- Consumes: the values produced in Task 3
- Produces: the four secrets consumed by `.github/workflows/publish.yml` on the
  "Publish missing package versions" step

- [ ] **Step 1: Create the GitHub repository secrets**

On the `Infomaniak/design-system` GitHub repository → Settings → Secrets and variables → Actions:

| Secret                         | Value                                                        |
|--------------------------------|--------------------------------------------------------------|
| `GITLAB_FONTS_REPOSITORY_URL`  | `https://gitlab.infomaniak.ch/infomaniak/fonts-delivery.git` |
| `GITLAB_FONTS_REPOSITORY_TOKEN`| Project access token (Task 3 Step 3)                          |
| `GITLAB_FONTS_TRIGGER_URL`     | `https://gitlab.infomaniak.ch/api/v4/projects/<project-id>/trigger/pipeline` |
| `GITLAB_FONTS_TRIGGER_TOKEN`   | Trigger token (Task 3 Step 2)                                 |

`GITLAB_FONTS_TRIGGER_REF` is already hardcoded to `main` in the workflow.

---

## Task 5: End-to-end verification

**Files:**

- No persistent files — test archive + temporary branch only

**Interfaces:**

- Consumes: trigger token (Task 3), push access to `infomaniak/fonts-delivery`
- Produces: evidence that trigger → extract → S3 sync works; test objects removed afterwards

- [ ] **Step 1: Build a synthetic test archive**

```bash
mkdir -p /tmp/fonts-e2e/fonts && cd /tmp/fonts-e2e/fonts
printf 'dummy woff2' > inter.woff2
printf 'body{}' > inter.min.css
tar -czf ../fonts-dev-0000000.tar.gz inter.woff2 inter.min.css
```

- [ ] **Step 2: Push it on a temporary branch**

```bash
cd /tmp/fonts-delivery
git checkout -b pipeline-test
cp /tmp/fonts-e2e/fonts-dev-0000000.tar.gz archives/
git add archives/ && git commit -m "chore: test archive for pipeline verification"
git push origin pipeline-test
```

- [ ] **Step 3: Trigger the pipeline**

```bash
curl -s -X POST \
  "https://gitlab.infomaniak.ch/api/v4/projects/<project-id>/trigger/pipeline" \
  -F "token=<GITLAB_FONTS_TRIGGER_TOKEN>" \
  -F "ref=pipeline-test" \
  -F "variables[ARCHIVE_NAME]=fonts-dev-0000000.tar.gz" \
  -F "variables[FONT_MODE]=dev"
```

Expected: JSON response with a pipeline id.

- [ ] **Step 4: Watch the pipeline**

Run: `glab ci status --repo infomaniak/fonts-delivery --branch pipeline-test`
Expected: job `upload-fonts-to-s3` succeeds; its log shows the `aws s3 sync` output and the
final "Fonts available at …" line.

- [ ] **Step 5: Verify the S3 result**

Run (with the S3 credentials available locally):
`aws --endpoint-url <S3_ENDPOINT_URL> s3 ls "s3://<S3_BUCKET>/dev/" | grep inter`
Expected: `inter.woff2` and `inter.min.css`. If local credentials are unavailable, the job log
from Step 4 is the evidence (it lists the uploaded objects).

- [ ] **Step 6: Cleanup**

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

1. `publish-fonts.script.ts` pushes `archives/fonts-{mode}-{shortSha}.tar.gz` to `main` and
   triggers the pipeline on `ref=main`
2. The `upload-fonts-to-s3` job uploads to `dev/` or `latest/` depending on the mode
3. Verify at `https://fonts.storage.infomaniak.com/{dev|latest}/`

## Security notes

- The trigger token can only create pipelines on this project — scope it, and rotate it on a
  schedule if the instance policy requires it
- The project access token has the single `write_repository` scope and an expiry date — record
  the expiry in the team calendar
- All S3 credentials are masked GitLab CI/CD variables; they are never printed by the job
  (`aws` redacts nothing — avoid `set -x` style debug output, the default GitLab shell runner
  echo is safe)
