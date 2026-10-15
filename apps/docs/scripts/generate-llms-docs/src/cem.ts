import type { CemElementDocs, PropRow } from './types.ts';

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

export interface CemDeclaration {
  name: string;
  tagName?: string;
  customElement?: boolean;
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

export function parseCem(raw: string): CustomElementsManifest {
  return JSON.parse(raw) as CustomElementsManifest;
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
  for (const module of cem.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.customElement === true && declaration.tagName === tagName) {
        return toElementDocs(declaration);
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

function toElementDocs(declaration: CemDeclaration): CemElementDocs {
  return {
    tagName: declaration.tagName ?? '',
    className: declaration.name,
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
