import { type FigmaDocumentNode } from './ast/figma-document-node.ts';

export type FigmaVariableAlias = any; // TODO

export interface FigmaColor {
  readonly r: number; // [0, 1]
  readonly g: number; // [0, 1]
  readonly b: number; // [0, 1]
  readonly a: number; // [0, 1]
}

export interface FigmaVector {
  readonly x: number;
  readonly y: number;
}

export interface FigmaRectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface FigmaComponent {
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly remote: boolean;
}

export interface FigmaStyle {
  // TODO
}

export interface FigmaFile {
  readonly name: string;
  readonly role: string;
  readonly lastModified: string;
  readonly editorType: string;
  readonly thumbnailUrl: string;
  readonly version: string;
  readonly document: FigmaDocumentNode;
  readonly components: Readonly<Record<string, FigmaComponent>>;
  readonly componentSets: Readonly<Record<string, FigmaComponent>>;
  readonly schemaVersion: 0;
  readonly styles: Readonly<Record<string, FigmaStyle>>;
  readonly mainFileKey: string;
  readonly branches: {
    readonly key: string;
    readonly name: string;
    readonly thumbnail_url: string;
    readonly last_modified: string;
    readonly link_access: string;
  }[];
}
