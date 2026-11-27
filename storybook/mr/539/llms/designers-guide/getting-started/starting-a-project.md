# Designers Guide/Getting Started/Starting a project

> 1. Copy the template **[Product name - Platform (Template)](https://www.figma.com/design/pESXZo4fDQrSgsbJtX5IOR/Proje...

## 🚀 Getting started

1. Copy the template **[Product name - Platform (Template)](https://www.figma.com/design/pESXZo4fDQrSgsbJtX5IOR/Project-template?node-id=3-39&p=f&t=zkSBoFIGqLnNjhvp-0)** to your workspace and rename it (see File naming).
2. Install the Infomaniak Sans font in your Figma workspace by following **[Install the Font](../install-the-font.md)**.
3. Annotate specs with the **[ESDS Team - Specs](https://www.figma.com/design/5RDtCKiVTN9MiknaODVe32/ESDS-Team---Specs?t=OawvpF8JsEzKWSWQ-0)** kit.
4. Use **[Calendar](https://www.figma.com/design/9a0Wo7ySCwmVUFELxvnIDy/Calendar-App---iOS?t=yTGobXKbImvVrIAD-0)** as a reference project.

## 🗂️ Project file structure

### Naming

`Product - Platform` (e.g. `Calendar - iOS/iPadOS`)

### Cover

- Use the **icon** that matches your product and apply the layout for your **platform**.
- Add your **product name only**, without the platform or any other detail, since these are handled by the tag below.

<img
  src={StartProjectCover}
  alt="Project cover with the thumbnail component properties: type, variant, archive, file name and logo"
/>

### Pages

Don't rename, move, or delete the fixed pages:

- **Get started**: team and linked files.
- **Components / Presets**: approved custom components and presets.
- **Lab**: temporary research. Once done, delete it or move it to the archive file.

Below them, create your screens:

- **Module**: `✏️ Module name`
- **Sub-module**: `↪ Sub-module`, including a spec block with the month and year it was created

Name pages after the PM's sprints. Screens are in French; annotations in French or English.

## 🧩 Presets

Reusable helper components, stored in Components / Presets:

- **Content presets**: pre-written content reused across the product (alert, empty state, action item whose icon and label change with the action).
- **Structure presets**: a ready-made layout (page, list, form, grid), filled with components or content presets.

**Golden rules**

- One preset per need; use variants for variations.
- A structure preset can contain content presets. Nothing else is nested.
- System components and tokens only.
- Never modify a preset in a screen: modify the parent preset in Components / Presets instead.
- Validate texts before creating: they propagate everywhere (see **[Designer's Handbook glossary](https://handbook.design-ik.ch/tag/knowledge-base/)**).
- Only create a preset if it's reused.

**Naming**: `Preset / Name` (e.g. `Preset / Settings`, `Preset / Events`)

## 🧰 Custom components

Only when no native component covers the need, and after design system team approval. See **[Creating a custom component](../helpers/creating-a-custom-component.md)**.

## 📐 Screen design

- Only design new views and complex features; refer to existing screens for known patterns.
- No duplicates: one reference screen, linked from elsewhere.
- One screen if mobile and tablet behave the same, one per size otherwise.
- Annotate behavior with **[ESDS Team - Specs](https://www.figma.com/design/5RDtCKiVTN9MiknaODVe32/ESDS-Team---Specs?t=OawvpF8JsEzKWSWQ-0)**.

## 🤝 Working with developers

- Share screens early.
- Mark each screen and preset as draft, in review, approved, or outdated.
- Notify the team when an approved screen or preset changes.

## ✅ Before considering a screen ready

- Right module, designed in French.
- Only system components, tokens, and presets, none detached.
- No duplicate, complex behavior annotated, reviewed by someone else.

## 📦 Archive file structure

When the project is complete, create an Archive file containing the lab section and any other iterations.

### Naming

`Archive / Product - Platform` (e.g. `Archive / Calendar - iOS/iPadOS`)

### Cover

You can reuse the project cover by simply enabling the "Archive" setting in the properties.

<img
  src={StartProjectArchiveCover}
  alt="Archive cover with the archive property enabled in the thumbnail component"
/>

### Pages

Don't rename, move, or delete the fixed pages:

- **Get started**
- **Lab**
- **Sub-module**: `↪ mm.yyyy : Sub-module` (archived sub-modules, one page per feature updates named as in the project file)
