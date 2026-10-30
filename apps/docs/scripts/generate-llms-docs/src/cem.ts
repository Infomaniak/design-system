import type { CemComponentKind, CemElementDocs, PropRow } from './types.ts';

export interface CemAttribute {
  name: string;
  type?: { text?: string };
  default?: string;
  optional?: boolean;
  description?: string;
}

export interface CemEvent {
  name: string;
  type?: { text?: string };
  description?: string;
}

export interface CemSlot {
  name: string;
  description?: string;
}

export interface CemCssProperty {
  name: string;
  type?: { text?: string };
  description?: string;
  syntax?: string;
}

export interface CemCssPart {
  name: string;
  description?: string;
}

export interface CemSuperclass {
  name?: string;
  module?: string;
}

export interface CemDeclaration {
  name: string;
  tagName?: string;
  customElement?: boolean;
  /** Explicit marker of a custom attribute declaration (forward-compat field). */
  customAttribute?: boolean;
  superclass?: CemSuperclass;
  attributes?: CemAttribute[];
  events?: CemEvent[];
  slots?: CemSlot[];
  cssProperties?: CemCssProperty[];
  cssParts?: CemCssPart[];
  members?: unknown[];
}

export interface CemModuleEntry {
  path: string;
  declarations?: CemDeclaration[];
}

export interface CustomElementsManifest {
  schemaVersion?: string;
  modules?: CemModuleEntry[];
}

const TABLE_HEADER = '| Name | Type | Default | Required | Description |';
const TABLE_ALIGNMENT = '| :--- | :--- | :--- | :--- | :--- |';

const CUSTOM_ATTRIBUTE_SUPERCLASS_NAME = 'CustomAttribute';
const CUSTOM_ATTRIBUTE_MODULE_HINT = 'custom-attribute';

export function parseCem(raw: string): CustomElementsManifest {
  return JSON.parse(raw) as CustomElementsManifest;
}

function iterateDeclarations(cem: CustomElementsManifest): CemDeclaration[] {
  return (cem.modules ?? []).flatMap((module) => module.declarations ?? []);
}

/**
 * Mirrors the `custom-attributes-ide-contributions` plugin detection: a
 * declaration is a custom attribute when it extends `CustomAttribute` (directly,
 * transitively, or via a module hint) or carries an explicit
 * `customAttribute: true` marker.
 */
export function collectCustomAttributeClassNames(cem: CustomElementsManifest): ReadonlySet<string> {
  const declarations = iterateDeclarations(cem);
  const names = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const declaration of declarations) {
      if (names.has(declaration.name)) continue;
      if (!isCustomAttributeDeclaration(declaration, names)) continue;
      names.add(declaration.name);
      changed = true;
    }
  }
  return names;
}

function isCustomAttributeDeclaration(
  declaration: CemDeclaration,
  knownAttributeClassNames: ReadonlySet<string>,
): boolean {
  if (declaration.customAttribute === true) return true;
  const superclass = declaration.superclass;
  if (superclass === undefined) return false;
  if (superclass.name === CUSTOM_ATTRIBUTE_SUPERCLASS_NAME) return true;
  if ((superclass.module ?? '').includes(CUSTOM_ATTRIBUTE_MODULE_HINT)) return true;
  return superclass.name !== undefined && knownAttributeClassNames.has(superclass.name);
}

/**
 * Collects the tag names of the manifest declarations describing a custom
 * attribute (a class extending `CustomAttribute`) instead of a real custom
 * element. The CEM `tagName` field doubles as the attribute name.
 */
export function collectCustomAttributeTagNames(cem: CustomElementsManifest): Set<string> {
  const classNames = collectCustomAttributeClassNames(cem);
  const tagNames = new Set<string>();
  for (const declaration of iterateDeclarations(cem)) {
    if (declaration.tagName !== undefined && classNames.has(declaration.name)) {
      tagNames.add(declaration.tagName);
    }
  }
  return tagNames;
}

export function toPropRow(attr: CemAttribute): PropRow {
  return {
    name: attr.name,
    type: attr.type?.text,
    default: attr.default,
    required: attr.optional === false,
    description: attr.description,
  };
}

export function findElementByTagName(
  cem: CustomElementsManifest,
  tagName: string,
): CemElementDocs | null {
  const attributeClassNames = collectCustomAttributeClassNames(cem);
  for (const module of cem.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.customElement === true && declaration.tagName === tagName) {
        const kind = toDeclarationKind(declaration, attributeClassNames);
        return toElementDocs(declaration, kind);
      }
    }
  }
  return null;
}

export function escapeTableCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

export function renderPropTable(rows: PropRow[]): string {
  if (rows.length === 0) {
    return '';
  }
  const lines = rows.map((row) => {
    const cells = [row.name, row.type, row.default, row.required ? 'Yes' : 'No', row.description];
    return `| ${cells.map((cell) => escapeTableCell(cell ?? '—')).join(' | ')} |`;
  });
  return [TABLE_HEADER, TABLE_ALIGNMENT, ...lines].join('\n');
}

export function renderApiSection(docs: CemElementDocs): string {
  const subsections: string[] = [];
  const appendSubsection = (title: string, rows: PropRow[]) => {
    const table = renderPropTable(rows);
    if (table !== '') {
      subsections.push(`### ${title}\n\n${table}`);
    }
  };
  appendSubsection('Attributes', docs.attributes);
  appendSubsection('Events', docs.events);
  appendSubsection('Slots', docs.slots);
  appendSubsection('CSS Custom Properties', docs.cssProperties);
  appendSubsection('CSS Parts', docs.cssParts);
  if (subsections.length === 0) {
    return '';
  }
  return `## API\n\n${subsections.join('\n\n')}`;
}

function toDeclarationKind(
  declaration: CemDeclaration,
  attributeClassNames: ReadonlySet<string>,
): CemComponentKind {
  return attributeClassNames.has(declaration.name) ? 'attribute' : 'element';
}

function toElementDocs(declaration: CemDeclaration, kind: CemComponentKind): CemElementDocs {
  return {
    tagName: declaration.tagName ?? '',
    className: declaration.name,
    kind,
    attributeName: declaration.tagName ?? '',
    attributes: (declaration.attributes ?? []).map(toPropRow),
    events: (declaration.events ?? []).map((event) => ({
      name: event.name,
      type: event.type?.text,
      required: false,
      description: event.description,
    })),
    slots: (declaration.slots ?? []).map((slot) => ({
      name: slot.name,
      required: false,
      description: slot.description,
    })),
    cssProperties: (declaration.cssProperties ?? []).map((property) => ({
      name: property.name,
      type: property.type?.text,
      required: false,
      description: property.description,
    })),
    cssParts: (declaration.cssParts ?? []).map((part) => ({
      name: part.name,
      required: false,
      description: part.description,
    })),
  };
}
