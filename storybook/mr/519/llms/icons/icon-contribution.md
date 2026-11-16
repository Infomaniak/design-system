# Icons/Icon Contribution

> A guide for designers on how to create icons. Each icon is delivered in two versions, one for developers and one for...

A guide for designers on how to create icons.
Each icon is delivered in two versions, one for developers and one for designers.

- **Developer icon**: keeps its strokes. Developers can then use an equation to adjust the stroke width to the icon size, so every size gets the right thickness.
- **Designer icon**: flattened, so the strokes become filled shapes. Figma can't calculate stroke width from size like this, so the designer icon only comes in a fixed set of sizes, each with the correct stroke.

**[Contribution Figma file](https://www.figma.com/design/GiBEx5gisOnNe3cikN0z1U/ESDS-Team---System-icons---Contribution?node-id=2-8276&p=f&t=T3CL24pct9LcIv0K-0)**

---

### 1. Open Lucide Icons plugin

<img
  src={SystemIconsStep1}
  alt="Open Lucide Icons plugin"
  width="500px"
/>

### 2. Insert any icon by clicking on it

<img
  src={SystemIconsStep2}
  alt="Insert any icon by clicking on it"
  width="500px"
/>

### 3. Duplicate icon and convert both as components

<img
  src={SystemIconsStep3}
  alt="Duplicate icon and convert both as components"
  width="500px"
/>

### 4. Label and name the designer and dev components

#### 4.1 Name structure example: `esds/icon/house`

- **esds**: Design System acronym
- **icon**: asset type
- **house**: icon name

#### 4.2 Naming convention: Name an icon after what it shows, not what it's used for.

- **Describe, don't prescribe**: the name says what the icon shows (`envelope`), not what it means in a given context (`mail`).
- **Word order follows what you see first**: when an icon combines several elements, name them in the order the eye notices them. The most prominent element comes first, smaller details or badges after. For example, an envelope with a small checkmark is `envelope-check`, not `check-envelope`.
- **Search works through tags**: the uses ("mail", "email", "message"…) go in the description tags (see step 8). People can still find the icon by searching "mail" without it being its name.
- **A common practice**: [Lucide](https://lucide.dev/contribute/icons/naming-conventions) (`floppy-disk`, not `save`) and [Font Awesome](https://blog.fontawesome.com/icon-naming-conventions/) (`house`, not `home`; `magnifying-glass`, not `search`) both follow this rule.

#### 4.3 Rename designer and dev components layers properly

<img
  src={SystemIconsStep4_3}
  alt="Rename designer and dev components layers properly"
  width="600px"
/>

### 5. Dev icon:

#### 5.1 Keep it as imported and set the stroke to 1.75px

- Keep one copy of the icon exactly as it was imported from the Lucide plugin. Only change the stroke width to **1.75px**. Don't flatten or outline it, because developers need the original strokes.

#### 5.2 Create the filled version if needed

- For developers, the filled and outline versions of an icon are separate components, because they're built and handled differently.
- When a filled icon has inner details, like the `i` in `circle-info-filled`, draw those details as **strokes**, then use **Subtract** in the pathfinder to cut them out of the filled shape. Don't flatten the details. Because the cut-out is still a stroke, the equation keeps controlling its thickness, and the "i" adapts to every size the same way an outline icon does.

<img
  src={SystemIconsStep5_2}
  alt="circle-info-filled dev component: the i is a stroke subtracted from the filled circle"
  width="700px"
/>

### 6. Designer icon:

#### 6.1 Generate all sizes

- Select the designer copy of the icon and run the [ESDS icons plugin](../designers-guide/figma-plugins.md#esds-icons) to generate the designer version.

<img
  src={SystemIconsStep6_1a}
  alt="Run the ESDS icons plugin"
  width="700px"
/>

<img
  src={SystemIconsStep6_1b}
  alt="Follow the ESDS icons plugin steps to generate all sizes"
/>

#### 6.2 Variants

- **size**: make sure all sizes are included (`16, 20, 24, 32, 40`).
- **filled**: The designer version must always include a `filled` variant property, set to `false` even when the icon has no filled version. This avoids problems when swapping icons in Figma.

### 7. Remove `Fill` setting on all components and variants

<img
  src={SystemIconsStep7}
  alt="Remove Fill setting on all components and variants"
/>

### 8. Add 10-12 relevant tags to components description

<img
  src={SystemIconsStep8}
  alt="Add relevant tags to components description"
  width="500px"
/>

### 9. Send for approval

Use the [template layout](https://www.figma.com/design/GiBEx5gisOnNe3cikN0z1U/ESDS-Team---System-icons---Contribution?node-id=2020-225&t=T3CL24pct9LcIv0K-11)
and drop it to `approval` section and share it with the DS team.

<img
  src={SystemIconsStep9}
  alt="Apply template layout and drop it to the approval section"
  width="700px"
/>

### 10. Release to production

> **Golden rule:** any change, even a typo fix or a tiny adjustment, needs a new version. Never overwrite an existing version.

#### 10.1 Dev version

- Move the dev component to the [dev icons file](https://www.figma.com/design/VfpVYoNSwpoUfPTvWU3HdU/ESDS-Team---System-icons---Source-of-truth?node-id=172-67&t=RkfxFdne4hLjGxOy-11).
- Add it to the list using the same structure as the existing icons: duplicate an existing frame, paste the component into it, and rename the frame title to the icon name.
  - Titles are set in **Roboto on purpose**. A script runs on this file automatically, and the file is set up so it can't use custom fonts. Don't change the font.
- Update the version number at the top of the section by bumping the last digit (for example, `0.0.1` → `0.0.2`).
  - For now, only the last digit changes. A bigger bump (for example, `0.1.0`) has to be decided by the DS team and will be stated during the approval step (step 9).
- Save the version in Figma: open **Show version history**, add a version manually, and name it with the version number. Leave the description empty.
- **Renaming only:** rename the component, then add the old name as an alias at the start of the list, with an exclamation mark in front: `!old-icon-name`. Then update and save the version as above.

#### 10.2 Designer version

- Move the designer component to the [designer icons file](https://www.figma.com/design/nbEPxwoIzXfZVquwR4NfYg/Edelweiss---Iconography?node-id=154-62&t=8BIXs4lj0dcXXU54-11).
- Update the section name with the **same version number** as the dev file.
- Publish the library.

### 11. Let the DS team know

Tell the DS team the release is done so they can share what's new.
