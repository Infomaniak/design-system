# Infomaniak's Design System - SVGs

Contains the list of Infomaniak's Design System SVGs.

## Figma design file

TODO: add a link to the Figma design file.

The [Figma svg assets design](https://www.figma.com/design/fjSRAikJq01Dof4iXazaPL/Tests-icons-Valentin?node-id=0-1&p=f&t=FMVSOZJWJiyGBzbW-0) contains all the SVGs used in the Infomaniak's Design System.

It is the **source of truth** for the SVGs.

### Rules

TODO define how icons/illustrations are organized in the Figma design file.

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

#### Projects

Projects are a way to group SVGs by projects.

SVGs can be assigned to a project using the following syntax:

```txt
@<project>
```

Where `<project>` is a project name.

##### Example

```txt
@kdrive @knote
```

> [!NOTE]
> Tags and projects can be mixed: `#house @kdrive`

## Workflow

### Add a new SVG

UX designers add new SVGs to the Figma design file following the previous rules.

### Commit the changes

When satisfied, UX designers commit the changes to the Figma design file by creating a new version.

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

### Graph

```mermaid
flowchart TD
  FIGMA["🎨 FIGMA"]
  COMMIT("COMMIT (create a new version)")
  WEBHOOK_SERVER("WEBHOOK SERVER")
  GITHUB_WORKFLOW("GITHUB WORKFLOW")
  BUILD_SVGS("BUILD SVGs")
  CREATE_PR("CREATE PULL REQUEST")
  MERGE_PR("MERGE PULL REQUEST")
  UPLOAD_PROD("UPLOAD TO PRODUCTION ICONIFY SERVER")
  UPLOAD_DEVELOP("UPLOAD TO DEVELOPMENT ICONIFY SERVER")


  FIGMA --> COMMIT
  COMMIT -- "webhook: trigger" --> WEBHOOK_SERVER
  WEBHOOK_SERVER --> GITHUB_WORKFLOW
  GITHUB_WORKFLOW --> BUILD_SVGS
  BUILD_SVGS --> CREATE_PR
  CREATE_PR --> MERGE_PR
  MERGE_PR -- "main" --> UPLOAD_PROD
  MERGE_PR -- "develop" --> UPLOAD_DEVELOP
```
