import type { AnyFigmaNode } from './figma-types.ts';

/**
 * The resolved identity of a component instance, used by the node adapter to
 * recognize icon-library components. The component-set name (variant icons)
 * takes precedence over the component's own name. `remote` is the provenance
 * signal (`ComponentNode.remote`): true when the main component is published
 * from a team library rather than living in the file.
 */
export interface InstanceIdentity {
  readonly componentName?: string;
  readonly componentSetName?: string;
  readonly remote: boolean;
}

/**
 * Resolves identities for the instances of a raw node forest, keyed by
 * instance node id.
 *
 * The sync `mainComponent` getter is forbidden in `dynamic-page` document
 * access mode (it throws at runtime), so identities go through
 * `getMainComponentAsync()` — one call per instance, batched. Every instance
 * is resolved: provenance (remote or not) can only be verified against the
 * main component, so the instance's layer name alone is never trusted — an
 * in-file component reusing the icon naming convention must not pass for the
 * published kit.
 *
 * Detached instances (no main component) resolve to no identity and fall back
 * to their layer name in the adapter — without the library marking.
 */
export async function collectInstanceIdentities(
  roots: readonly AnyFigmaNode[],
): Promise<Map<string, InstanceIdentity>> {
  const instances: AnyFigmaNode[] = [];

  collectInstances(roots, instances);

  const identities: Map<string, InstanceIdentity> = new Map();

  await Promise.all(
    instances.map(async (instance: AnyFigmaNode): Promise<void> => {
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
        remote: component.remote === true,
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
