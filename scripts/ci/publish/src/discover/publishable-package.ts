import type { TopologicalPackageNode } from '../topological/topological-sort-packages.ts';

export interface PublishablePackage extends TopologicalPackageNode {
  readonly path: string;
  readonly version: string;
}
