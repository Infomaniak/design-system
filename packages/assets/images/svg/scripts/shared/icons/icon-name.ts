/**
 * Source fragment of the icon-name rule, meant to be embedded into larger patterns (e.g. the
 * Figma component name pattern `esds/icon/<name>`).
 */
export const ICON_NAME_PATTERN_SOURCE: string = '[a-z0-9-]+';

/** Icon names are kebab-case: lowercase letters, digits and hyphens. */
export const ICON_NAME_PATTERN: RegExp = new RegExp(`^(?:${ICON_NAME_PATTERN_SOURCE})$`);
