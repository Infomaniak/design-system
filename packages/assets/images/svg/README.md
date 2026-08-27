# Infomaniak's Design System - SVGs

Contains the list of Infomaniak's Design System SVGs.

- [Documentation ↗](https://infomaniak.github.io/design-system/storybook/main/?path=/docs/components-getting-started--docs)
- [Gallery ↗](https://infomaniak.github.io/design-system/storybook/main/?path=/docs/icons-icon-gallery--docs&collection=esds)
- [Iconography Guideline ↗](https://www.figma.com/design/nbEPxwoIzXfZVquwR4NfYg/Edelweiss---Iconography?node-id=0-1&p=f&t=50O2v4pgV2smKfy8-0)

## Workflow

### Add a new SVG

#### Icons

##### [Contribute](https://www.figma.com/design/GiBEx5gisOnNe3cikN0z1U/Edelweiss---System-icons---Contribution?m=auto&fuid=1007627152736665096)

This is the entry point for the UX designers to **propose** additions of new icons, or changes on existing ones.

Then, the UX designer must inform/request the design-system's team for approval, following our governance process to jump on the next steps.

##### [Source of truth](https://www.figma.com/design/VfpVYoNSwpoUfPTvWU3HdU/ESDS-Team---System-icons---Source-of-truth?node-id=2-8276&p=f&t=oWTzzbQevviolOKO-0)

When the changes/additions are approved, the design-system team's will replicate the additions/changes into the [source of truth](https://www.figma.com/design/VfpVYoNSwpoUfPTvWU3HdU/ESDS-Team---System-icons---Source-of-truth?node-id=2-8276&p=f&t=oWTzzbQevviolOKO-0) Figma file.

##### Rules

- icons must be converted into components.
- icons must have a name following this format: `esds/icon/<name>`, where `name` is `dash-cased`.
- icons may have descriptions to add _tags_ and _categories_ (see [Metadata](#Metadata)).

### Commit the changes

When complete, design-system's UX designers commit the changes to the Figma design file by creating a new version and updating the corresponding text node.

The version must follow the [semver convention](https://devhints.io/semver).

### Workflow trigger

A figma webhook is configured to trigger the Github workflow `on-figma-event` when a new version is created.

### Build the assets

The script import the Figma design file and generate the SVGs as well as the iconify JSON file.

#### Icons

> An icon is a **monotone** SVG: we may replace the color of each icon.

The Figma design file is traversed by a script to extract the icons.

Each icon is converted to an SVG, is optimized by SVGO, we replace the colors by `currentColor` (to make them _monotone_) and,
for each of them, we store the SVG into the `assets/svg/monotone/figma` directory as well as the metadata.

Then a single [iconify JSON](https://iconify.design/docs/libraries/tools/export/json.html) file (`assets/server/esds.json`) is generated containing all the icons.

#### Illustrations

> An illustration is a **colored** SVG: a SVG with more than one color.

The Figma design file is traversed by a script to extract the illustrations.

Each illustration is converted to an SVG, is optimized by SVGO, and,
for each of them, we store the SVG into the `assets/svg/illustration/figma` directory as well as the metadata.

Then a single iconify JSON file (`assets/server/esds-illustration.json`) is generated containing all the illustrations.

### Merge the assets

A Pull Request is created to merge the assets into the `main` branch.

### Upload the assets

When the Pull Request is merged, the assets are uploaded to the Infomaniak's Design System iconify server.

### Update the guidelines

#### [Iconography Guideline](https://www.figma.com/design/nbEPxwoIzXfZVquwR4NfYg/Edelweiss---Iconography?node-id=0-1&p=f&t=50O2v4pgV2smKfy8-0)

The UX designer updates manually the icons present into the reference file used by other UX designers.

### Graph

```mermaid
flowchart TD
  FIGMA_CONTRIBUTING["🎨 FIGMA - Contributing file"]
  REPLICATE("REPLICATE (copy icons)")
  FIGMA_SOURCE_OF_TRUTH["🎨 FIGMA - Source of truth file"]
  COMMIT("COMMIT (create a new version)")
  WEBHOOK_SERVER("WEBHOOK SERVER")
  GITHUB_WORKFLOW("GITHUB WORKFLOW")
  BUILD_SVGS("BUILD SVGs")
  CREATE_PR("CREATE PULL REQUEST")
  MERGE_PR("MERGE PULL REQUEST")
  UPLOAD_PROD("UPLOAD TO PRODUCTION ICONIFY SERVER")
  UPLOAD_DEVELOP("UPLOAD TO DEVELOPMENT ICONIFY SERVER")
  FIGMA_ICONOGRAPHY_GUIDELINE["🎨 FIGMA - Iconography file"]

  FIGMA_CONTRIBUTING -- "approval" --> REPLICATE
  REPLICATE --> FIGMA_SOURCE_OF_TRUTH
  FIGMA_SOURCE_OF_TRUTH --> COMMIT
  COMMIT -- "webhook: trigger" --> WEBHOOK_SERVER
  WEBHOOK_SERVER --> GITHUB_WORKFLOW
  GITHUB_WORKFLOW --> BUILD_SVGS
  BUILD_SVGS --> CREATE_PR
  CREATE_PR --> MERGE_PR
  MERGE_PR -- "main" --> UPLOAD_PROD
  MERGE_PR -- "develop" --> UPLOAD_DEVELOP
  UPLOAD_PROD -- "manual update" --> FIGMA_ICONOGRAPHY_GUIDELINE

  %% FIX_FIGMA_WEBHOOK
  FIX_FIGMA_WEBHOOK{{"CRON: fix-figma-webhook"}}
  FIX_FIGMA_WEBHOOK -. "trigger" .-> WEBHOOK_SERVER
```

---

### Metadata

Metadata can be added to individual svg from the Figma design file by setting a description with special syntax:

#### Tags

A tag is a keyword that can be used to alias the SVGs.

Tags can be added using the following syntax:

```txt
#<tag>
```

Where `<tag>` is a tag name.

##### Example

```txt
#house #home #main
```

#### Categories

Categories are a way to group SVGs by projects or categories.

SVGs can be assigned to a project using the following syntax:

```txt
@<category>
```

Where `<category>` is a project name or a category type of icons.

##### Example

```txt
@kdrive @knote
```

> [!NOTE]
> Tags and categories can be mixed: `#house @kdrive`

---

## LEGACY

Legacy SVGs are stored in the `assets/svg/monotone/legacy` directory.

They are not used anymore, but they are kept for backward compatibility on existing projects.

### Import new legacy SVGs

1. Create a new branch: `feat/add-legacy-svgs`
2. Build them `manually` running:

```shell
yarn build:legacy-svgs
```

This script generates the appropriate `assets/server/*.json` files, and bump this `package.json` version.

3. Commit the changes
4. Create a Pull Request and follow the CONTRIBUTING guidelines

---

### SF Symbols (iOS)

Converts the Figma source SVGs into Apple Custom SF Symbols (`.symbolset`) inside an `Icons.xcassets` catalog using a **variable template** format.

#### How it works

Each icon is exported as a **variable SF Symbol** with 3 master weights (Ultralight, Regular, Black) at Small scale. iOS interpolates the remaining weights (Thin, Light, Medium, Semibold, Bold, Heavy) automatically at runtime.

Outlined SVGs are fetched from Figma (via `yarn import:outlined`) — these are pre-filled outline paths, so no stroke-to-outline conversion is needed. The same path data is used for all 3 master weights.

**Coordinate transformation**: Source SVGs (24px, Y-down) are transformed to SF Symbol font coordinates (100pt, Y-up) with the transform baked into path data, allowing identity group transforms.

Paths use the `SFSymbolsPreviewWireframe` CSS class (no inline `stroke`/`fill` attributes), matching Apple's native template format.

#### Build

```bash
yarn build:sf-symbols
```

#### Output

```
dist/ios/sf-symbols/Icons.xcassets/
├── Contents.json
├── esds-heart.symbolset/
│   ├── Contents.json
│   └── esds-heart.svg
├── esds-arrow-left.symbolset/
│   ├── Contents.json
│   └── esds-arrow-left.svg
└── ... (one .symbolset per icon)
```
