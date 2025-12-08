import { type FigmaDocumentNode } from '../nodes/built-in/figma-document-node.ts';
import { type FigmaComponent } from './figma-component.ts';
import { type FigmaStyle } from './figma-style.ts';

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
