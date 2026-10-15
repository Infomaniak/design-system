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
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Invalid custom elements manifest');
  }
  const manifest =
    typeof parsed === 'object' && parsed !== null ? (parsed as CustomElementsManifest) : {};
  return {
    schemaVersion: manifest.schemaVersion,
    modules: Array.isArray(manifest.modules) ? manifest.modules : [],
  };
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

export function findElementByModulePath(
  cem: CustomElementsManifest,
  modulePath: string,
): CemElementDocs | null {
  const candidates = (cem.modules ?? [])
    .map((module) => ({ module, score: suffixMatchScore(module.path, modulePath) }))
    .filter((candidate) => candidate.score > 0);
  if (candidates.length === 0) {
    return null;
  }
  const best = candidates.reduce((current, candidate) =>
    candidate.score > current.score ? candidate : current,
  );
  const ties = candidates.filter((candidate) => candidate.score === best.score);
  if (ties.length > 1) {
    return null;
  }
  const declaration = (best.module.declarations ?? []).find(
    (candidate) => candidate.customElement === true,
  );
  return declaration ? toElementDocs(declaration) : null;
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

function normalizeStoriesBasename(segment: string): string {
  return segment.replace(/\.stories\./, '.');
}

function suffixMatchScore(modulePath: string, queryPath: string): number {
  const moduleSegments = modulePath.split('/');
  const querySegments = queryPath.split('/');
  const moduleBasename = moduleSegments[moduleSegments.length - 1];
  const queryBasename = querySegments[querySegments.length - 1];
  if (normalizeStoriesBasename(moduleBasename) !== normalizeStoriesBasename(queryBasename)) {
    return 0;
  }
  let score = 1;
  const parentLimit = Math.min(moduleSegments.length - 1, querySegments.length - 1);
  for (let offset = 1; offset <= parentLimit; offset += 1) {
    const moduleSegment = moduleSegments[moduleSegments.length - 1 - offset];
    const querySegment = querySegments[querySegments.length - 1 - offset];
    if (moduleSegment !== querySegment) {
      break;
    }
    score += 1;
  }
  return score;
}

function toElementDocs(declaration: CemDeclaration): CemElementDocs {
  return {
    tagName: declaration.tagName ?? '',
    className: declaration.name,
    attributes: (declaration.attributes ?? []).map(toPropRow),
    properties: [],
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
