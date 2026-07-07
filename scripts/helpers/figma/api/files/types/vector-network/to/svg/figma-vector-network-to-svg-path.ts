import type { FigmaVectorNetwork, FigmaVectorNetworkSegment } from '../../figma-vector-network.ts';

interface ChainInfo {
  readonly segmentIndex: number;
  readonly direction: 'forward' | 'reverse';
}

export function figmaVectorNetworkToSvgPath({
  vertices,
  segments,
  regions,
}: FigmaVectorNetwork): string {
  const usedSegments = new Set<number>();
  const paths: string[] = [];

  // 1. Process closed loops first
  if (regions !== null) {
    for (const region of regions) {
      for (const loop of region.loops) {
        if (loop.length === 0) {
          continue;
        }

        const chain = buildConnectedChain(loop, segments);

        if (chain.length === 0) {
          continue;
        }

        const parts: string[] = [];

        // Start
        const firstSeg = segments[chain[0].segmentIndex];
        const firstDir = chain[0].direction;
        const firstVertex = vertices[firstDir === 'forward' ? firstSeg.start : firstSeg.end];

        parts.push(`M ${svgNum(firstVertex.position.x)} ${svgNum(firstVertex.position.y)}`);

        // Segments
        for (const entry of chain) {
          const seg = segments[entry.segmentIndex];
          const startVertex = vertices[entry.direction === 'forward' ? seg.start : seg.end];
          const endVertex = vertices[entry.direction === 'forward' ? seg.end : seg.start];

          const startTangentX =
            entry.direction === 'forward' ? seg.startTangent.x : seg.endTangent.x;
          const startTangentY =
            entry.direction === 'forward' ? seg.startTangent.y : seg.endTangent.y;
          const endTangentX = entry.direction === 'forward' ? seg.endTangent.x : seg.startTangent.x;
          const endTangentY = entry.direction === 'forward' ? seg.endTangent.y : seg.startTangent.y;

          const x1 = startVertex.position.x + startTangentX;
          const y1 = startVertex.position.y + startTangentY;
          const x2 = endVertex.position.x + endTangentX;
          const y2 = endVertex.position.y + endTangentY;
          const x = endVertex.position.x;
          const y = endVertex.position.y;

          if (
            startTangentX === 0 &&
            startTangentY === 0 &&
            endTangentX === 0 &&
            endTangentY === 0
          ) {
            parts.push(`L ${svgNum(x)} ${svgNum(y)}`);
          } else {
            parts.push(
              `C ${svgNum(x1)} ${svgNum(y1)} ${svgNum(x2)} ${svgNum(y2)} ${svgNum(x)} ${svgNum(y)}`,
            );
          }
          usedSegments.add(entry.segmentIndex);
        }

        // Only close if the loop returns to its start
        const lastSeg = segments[chain[chain.length - 1].segmentIndex];
        const lastDir = chain[chain.length - 1].direction;
        const lastVertex = lastDir === 'forward' ? lastSeg.end : lastSeg.start;

        if (lastVertex === firstSeg.start) {
          parts.push('Z');
        }
        paths.push(parts.join(' '));
      }
    }
  }

  // 2. Process remaining segments as open paths
  const remaining = segments.map((_, i) => i).filter((i) => !usedSegments.has(i));

  const openChains = buildOpenChains(remaining, segments);

  for (const openChain of openChains) {
    if (openChain.length === 0) {
      continue;
    }

    const parts: string[] = [];

    const firstSeg = segments[openChain[0].segmentIndex];
    const firstDir = openChain[0].direction;
    const firstVertex = vertices[firstDir === 'forward' ? firstSeg.start : firstSeg.end];

    parts.push(`M ${svgNum(firstVertex.position.x)} ${svgNum(firstVertex.position.y)}`);

    for (let i = 0; i < openChain.length; i++) {
      const entry = openChain[i];
      const seg = segments[entry.segmentIndex];
      const startVertex = vertices[entry.direction === 'forward' ? seg.start : seg.end];
      const endVertex = vertices[entry.direction === 'forward' ? seg.end : seg.start];

      const startTangentX = entry.direction === 'forward' ? seg.startTangent.x : seg.endTangent.x;
      const startTangentY = entry.direction === 'forward' ? seg.startTangent.y : seg.endTangent.y;
      const endTangentX = entry.direction === 'forward' ? seg.endTangent.x : seg.startTangent.x;
      const endTangentY = entry.direction === 'forward' ? seg.endTangent.y : seg.startTangent.y;

      const x1 = startVertex.position.x + startTangentX;
      const y1 = startVertex.position.y + startTangentY;
      const x2 = endVertex.position.x + endTangentX;
      const y2 = endVertex.position.y + endTangentY;
      const x = endVertex.position.x;
      const y = endVertex.position.y;

      if (startTangentX === 0 && startTangentY === 0 && endTangentX === 0 && endTangentY === 0) {
        parts.push(`L ${svgNum(x)} ${svgNum(y)}`);
      } else {
        parts.push(
          `C ${svgNum(x1)} ${svgNum(y1)} ${svgNum(x2)} ${svgNum(y2)} ${svgNum(x)} ${svgNum(y)}`,
        );
      }
    }

    paths.push(parts.join(' '));
  }

  return paths.join(' ');
}

/* INTERNAL */

function svgNum(n: number): string {
  const str = n.toFixed(6);
  return str.replace(/\.?0+$/, '');
}

/**
 * Build a connected chain from a set of segment indices (a loop), determining
 * the correct direction for each segment to create a continuous walk that
 * returns to the start. The first segment is set to some starting index and the
 * rest are ordered by connectivity.
 */
function buildConnectedChain(
  loop: readonly number[],
  segments: readonly FigmaVectorNetworkSegment[],
): ChainInfo[] {
  if (loop.length === 0) {
    return [];
  }

  const remaining = new Set(loop);

  // Try starting with each possible first segment and direction
  for (const firstIndex of remaining) {
    // Remove first index from candidates
    remaining.delete(firstIndex);

    // Try forward
    const forwardRest = extendFrom(firstIndex, 'forward', new Set(remaining), segments);
    if (forwardRest.length === loop.length - 1) {
      return [{ segmentIndex: firstIndex, direction: 'forward' }, ...forwardRest];
    }

    // Try reverse
    const reverseRest = extendFrom(firstIndex, 'reverse', new Set(remaining), segments);
    if (reverseRest.length === loop.length - 1) {
      return [{ segmentIndex: firstIndex, direction: 'reverse' }, ...reverseRest];
    }

    // Restore for next iteration
    remaining.add(firstIndex);
  }

  return [];
}

/**
 * Extend a path from `startIndex` in `startDir` by greedily attaching
 * connecting segments from `remaining`. Does NOT include `startIndex` in the
 * returned array.
 */
function extendFrom(
  startIndex: number,
  startDir: 'forward' | 'reverse',
  remaining: Set<number>,
  segments: readonly FigmaVectorNetworkSegment[],
): ChainInfo[] {
  const chain: ChainInfo[] = [];
  const startSeg = segments[startIndex];
  let currentVertex = startDir === 'forward' ? startSeg.end : startSeg.start;

  remaining.delete(startIndex);

  while (remaining.size > 0) {
    let found = false;

    for (const candidate of remaining) {
      const candSeg = segments[candidate];

      if (candSeg.start === currentVertex) {
        chain.push({ segmentIndex: candidate, direction: 'forward' });
        currentVertex = candSeg.end;
        remaining.delete(candidate);
        found = true;
        break;
      }

      if (candSeg.end === currentVertex) {
        chain.push({ segmentIndex: candidate, direction: 'reverse' });
        currentVertex = candSeg.start;
        remaining.delete(candidate);
        found = true;
        break;
      }
    }

    if (!found) {
      break;
    }
  }

  return chain;
}

/**
 * Build chains for unused (non-region) segments. Each chain is a maximal
 * sequence of connected segments.
 */
function buildOpenChains(
  unusedIndices: readonly number[],
  segments: readonly FigmaVectorNetworkSegment[],
): ChainInfo[][] {
  if (unusedIndices.length === 0) {
    return [];
  }

  const remaining = new Set(unusedIndices);
  const chains: ChainInfo[][] = [];

  while (remaining.size > 0) {
    const startIndex = remaining.values().next().value as number;
    remaining.delete(startIndex);

    // Extend in each direction
    const fwdAfter = extendFrom(startIndex, 'forward', new Set(remaining), segments);
    const fwdBefore = extendFrom(startIndex, 'reverse', new Set(remaining), segments);

    const revAfter = extendFrom(startIndex, 'reverse', new Set(remaining), segments);
    const revBefore = extendFrom(startIndex, 'forward', new Set(remaining), segments);

    // Build two candidate chains
    // Option A: start forward, append fwdAfter, prepend reversed fwdBefore
    const optionA: ChainInfo[] = [
      ...fwdBefore.map((c) => invert(c)).reverse(),
      { segmentIndex: startIndex, direction: 'forward' as const },
      ...fwdAfter,
    ];

    // Option B: start reverse, append revAfter, prepend reversed revBefore
    const optionB: ChainInfo[] = [
      ...revBefore.map((c) => invert(c)).reverse(),
      { segmentIndex: startIndex, direction: 'reverse' as const },
      ...revAfter,
    ];

    // Pick the longer valid chain (or default to option A)
    const chain = optionA.length >= optionB.length ? optionA : optionB;

    // Mark all used segments
    for (const entry of chain) {
      remaining.delete(entry.segmentIndex);
    }

    chains.push(chain);
  }

  return chains;
}

function invert(entry: ChainInfo): ChainInfo {
  return {
    segmentIndex: entry.segmentIndex,
    direction: entry.direction === 'forward' ? 'reverse' : 'forward',
  };
}
