# Icons/Icon Contribution

> A guide for designers on how to create icons. Each icon is delivered in two versions, one for developers and one for...

A guide for designers on how to create icons.
Each icon is delivered in two versions, one for developers and one for designers.

- **Developer icon**: keeps its strokes. Developers can then use an equation to adjust the stroke width to the icon size, so every size gets the right thickness.
- **Designer icon**: flattened, so the strokes become filled shapes. Since Figma can't scale stroke width with icon size, the designer icon comes in a fixed set of sizes, each with its own correct stroke.

**[Contribution Figma file](https://www.figma.com/design/GiBEx5gisOnNe3cikN0z1U/ESDS-Team---System-icons---Contribution?node-id=2-8276&p=f&t=T3CL24pct9LcIv0K-0)**

---

### 1. Open the Lucide Icons plugin

<img
  src={SystemIconsStep1}
  alt="Open the Lucide Icons plugin"
  width="500px"
/>

### 2. Click an icon to insert it

<img
  src={SystemIconsStep2}
  alt="Click an icon to insert it"
  width="500px"
/>

### 3. Convert the icon into a component

<img
  src={SystemIconsStep3}
  alt="Convert the icon into a component"
  width="500px"
/>

### 4. Dev icon

#### 4.1 Keep it as imported and set the stroke to 1.75px

- Don't flatten or outline it, because developers need the original strokes.

> 💡 Tip: set the plugin's default stroke to 1.75px to skip this step in the future

<img
  src={SystemIconsStep4_1}
  alt="Lucide Icons plugin settings with stroke width set to 1.75"
  width="500px"
/>

#### 4.2 Create the filled version if needed

- For developers, the filled and stroke versions of an icon are separate components, because they're built and handled differently.
- When a filled icon has inner details, like the `i` in `circle-info-filled`, draw those details as **strokes**, then use **Subtract** in the pathfinder to cut them out of the filled shape. Don't flatten the details. Because the cut-out is still a stroke, the equation keeps controlling its thickness, and the "i" adapts to every size the same way an outline icon does.

<img
  src={SystemIconsStep4_2}
  alt="circle-info-filled dev component: the i is a stroke subtracted from the filled circle"
  width="700px"
/>

### 5. Designer icon

#### 5.1 Generate all sizes

- Select the stroke dev icon and run the [ESDS icons plugin](../designers-guide/figma-plugins.md#esds-icons) to generate the designer version (by default, the plugin works on a copy, so your dev icon stays untouched).

<img
  src={SystemIconsStep5_1a}
  alt="Run the ESDS icons plugin"
  width="700px"
/>

<img
  src={SystemIconsStep5_1b}
  alt="Follow the ESDS icons plugin steps to generate all sizes"
/>

#### 5.2 Variants

- **size**: make sure all sizes are included (`16, 20, 24, 32, 40`).
- **filled**: The designer version must always include a `filled` variant property, set to `false` even when the icon has no filled version. This avoids problems when swapping icons in Figma.

### 6. Name the dev and designer components

#### 6.1 Name structure example:

Icon: `esds/icon/house`

- **esds**: Design System acronym
- **icon**: asset type
- **house**: `icon name`

Filled icon (_dev only_): `esds/icon/house-filled`

- **esds**: Design System acronym
- **icon**: asset type
- **house-filled**: `icon name`

#### 6.2 Naming convention

Name an icon after what it shows, not what it's used for, following the
[internal icon naming convention](https://infomaniak.pages.infomaniak.com/handbook/activites/frontend/convention-nommage-icones/). The key rules:

- **Describe, don't prescribe**: the name says what the icon shows (`envelope`), not what it means in a given context (`mail`).
- **Modifiers come as a suffix**: a detail completing the object goes after it. An envelope with a small checkmark is `envelope-check`, not `check-envelope`.
- **Multiple objects follow their order of importance**: the most prominent element comes first, smaller details or badges after.
- **Search works through tags**: the uses ("mail", "email", "message"…) go in the description tags (see step 7). People can still find the icon by searching "mail" without it being its name.

### 7. Final adjustments on both dev and designer components

- Remove the `Fill` setting.

<img
  src={SystemIconsStep7a}
  alt="Remove the Fill setting"
/>

- Give the component layers clear names.

<img
  src={SystemIconsStep7b}
  alt="Component layers named clearly"
  width="700px"
/>

- Add 10–12 relevant tags to the component description following the same naming convention as the icon name.
- **Renaming only:** if you need to rename a component, then add the old name as an alias at the start of the list, with an exclamation mark in front: `!old-icon-name`. Then update and save the version as described in step 9.

<img
  src={SystemIconsStep7c}
  alt="Add relevant tags to the component description"
  width="500px"
/>

### 8. Send for approval

Use the [template layout](https://www.figma.com/design/GiBEx5gisOnNe3cikN0z1U/ESDS-Team---System-icons---Contribution?node-id=2020-225&t=T3CL24pct9LcIv0K-11), drop it into the `approval` section, then share it with the DS team.

<img
  src={SystemIconsStep8}
  alt="Template layout dropped into the approval section"
  width="700px"
/>

### 9. Release to production

> 👑 **Golden rule:** any change, even a typo fix or a tiny adjustment, needs a new version. Never overwrite an existing version.

#### 9.1 Dev version

- Move the dev component to the [dev icons file](https://www.figma.com/design/VfpVYoNSwpoUfPTvWU3HdU/ESDS-Team---System-icons---Source-of-truth?node-id=172-67&t=RkfxFdne4hLjGxOy-11).
- Add it to the list using the same structure as the existing icons: duplicate an existing frame, paste the component into it, and rename the frame title to the icon name.
  - Titles are set in **Roboto on purpose**. A script runs on this file automatically, and the file is set up so it can't use custom fonts. Don't change the font.
- Update the version number at the top of the section by bumping the last digit (for example, `0.0.1` → `0.0.2`).
  - For now, only the last digit changes. A bigger bump (for example, `0.1.0`) has to be decided by the DS team and will be stated during the approval step (step 8).
- Save the version in Figma: open **Show version history**, add a version manually, and name it with the version number. Leave the description empty.

#### 9.2 Designer version

- Move the designer component to the [designer icons file](https://www.figma.com/design/nbEPxwoIzXfZVquwR4NfYg/Edelweiss---Iconography?node-id=154-62&t=8BIXs4lj0dcXXU54-11).
- Update the section name with the **same version number** as the dev file. The two files must always stay in sync, in both content and version number.
- Publish the library.

### 10. Let the DS team know

Tell the DS team the release is done so they can share what's new.
