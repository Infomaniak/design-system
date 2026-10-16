import { isIconLibraryComponent } from '../core/icon-library.ts';
import type { AnyFigmaNode } from './figma-types.ts';

/**
 * The resolved identity of a component instance, used by the node adapter to
 * recognize icon-library components. The component-set name (variant icons)
 * takes precedence over the component's own name.
 */
export interface InstanceIdentity {
  readonly componentName?: string;
  readonly componentSetName?: string;
}

/**
 * Resolves identities for the instances of a raw node forest, keyed by
 * instance node id.
 *
 * The sync `mainComponent` getter is forbidden in `dynamic-page` document
 * access mode (it throws at runtime), so identities go through
 * `getMainComponentAsync()` — one call per instance, batched. Instances whose
 * layer name already matches the icon-library convention skip the call: their
 * identity is established without it (and unrenamed icons cost zero
 * round-trips, which matters for page/file-wide scans).
 *
 * Detached instances (no main component) resolve to no identity and fall back
 * to their layer name in the adapter.
 */
export async function collectInstanceIdentities(
  roots: readonly AnyFigmaNode[],
): Promise<Map<string, InstanceIdentity>> {
  const instances: AnyFigmaNode[] = [];

  collectInstances(roots, instances);

  const identities: Map<string, InstanceIdentity> = new Map();

  await Promise.all(
    instances.map(async (instance: AnyFigmaNode): Promise<void> => {
      if (isIconLibraryComponent(instance.name)) {
        return;
      }

      if (instance.getMainComponentAsync === undefined) {
        return;
      }

      const component: AnyFigmaNode | null = await instance.getMainComponentAsync();

      if (component === null) {
        return;
      }

      identities.set(instance.id, {
        componentName: component.name,
        ...(component.parent?.name === undefined
          ? {}
          : { componentSetName: component.parent.name }),
      });
    }),
  );

  return identities;
}

function collectInstances(nodes: readonly AnyFigmaNode[], instances: AnyFigmaNode[]): void {
  for (const node of nodes) {
    if (node.type === 'INSTANCE') {
      instances.push(node);
    }

    if (node.children !== undefined) {
      collectInstances(node.children, instances);
    }
  }
}
