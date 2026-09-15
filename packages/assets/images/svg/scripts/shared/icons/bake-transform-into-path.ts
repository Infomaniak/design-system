export type PathTransform = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
];

export interface PathBoundingBox {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export function identityPathTransform(): PathTransform {
  return [
    [1, 0, 0],
    [0, 1, 0],
  ];
}

export function composePathTransforms(outer: PathTransform, inner: PathTransform): PathTransform {
  const [o00, o01, o02] = outer[0];
  const [o10, o11, o12] = outer[1];
  const [i00, i01, i02] = inner[0];
  const [i10, i11, i12] = inner[1];

  return [
    [o00 * i00 + o01 * i10, o00 * i01 + o01 * i11, o00 * i02 + o01 * i12 + o02],
    [o10 * i00 + o11 * i10, o10 * i01 + o11 * i11, o10 * i02 + o11 * i12 + o12],
  ];
}

const PATH_COMMAND_ARITIES: Readonly<Record<string, number>> = { M: 2, L: 2, C: 6, Q: 4, Z: 0 };
const PATH_TOKEN_PATTERN: RegExp = /-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?|[A-Za-z]/g;
const PATH_DECIMALS = 4;

interface PathDataSegment {
  readonly command: string;
  readonly points: readonly (readonly [number, number])[];
}

function parsePathDataSegments(pathData: string): readonly PathDataSegment[] {
  const tokens: readonly string[] = pathData.match(PATH_TOKEN_PATTERN) ?? [];
  const segments: PathDataSegment[] = [];

  let command: string | null = null;
  let coordinates: readonly number[] = [];

  const flushSegment = (): void => {
    if (command === null) {
      return;
    }

    const arity: number = PATH_COMMAND_ARITIES[command];
    if (arity === 0) {
      if (coordinates.length > 0) {
        throw new Error(
          `Malformed path data: ${coordinates.length} coordinates for command ${JSON.stringify(command)}.`,
        );
      }
      segments.push({ command, points: [] });
    } else {
      if (coordinates.length % arity !== 0) {
        throw new Error(
          `Malformed path data: ${coordinates.length} coordinates for command ${JSON.stringify(command)}.`,
        );
      }

      for (let offset = 0; offset < coordinates.length; offset += arity) {
        segments.push({
          command: command === 'M' && offset > 0 ? 'L' : command,
          points: chunkIntoPoints(coordinates.slice(offset, offset + arity)),
        });
      }
    }
    coordinates = [];
    command = null;
  };

  for (const token of tokens) {
    if (Number.isNaN(Number(token))) {
      if (!(token in PATH_COMMAND_ARITIES)) {
        throw new Error(`Unsupported path command ${JSON.stringify(token)}.`);
      }
      flushSegment();
      command = token;
      continue;
    }
    if (command === null) {
      throw new Error(`Path data starts with a coordinate: ${JSON.stringify(pathData)}`);
    }
    coordinates = [...coordinates, Number(token)];
  }
  flushSegment();

  return segments;
}

function chunkIntoPoints(values: readonly number[]): readonly (readonly [number, number])[] {
  const points: [number, number][] = [];
  for (let index = 0; index < values.length; index += 2) {
    points.push([values[index]!, values[index + 1]!]);
  }
  return points;
}

function formatNumber(value: number): string {
  return String(Number(value.toFixed(PATH_DECIMALS)));
}

function serializePathDataSegments(segments: readonly PathDataSegment[]): string {
  return segments
    .map(({ command, points }: PathDataSegment): string => {
      if (command === 'Z') {
        return 'Z';
      }
      return `${command}${points
        .map(
          ([x, y]: readonly [number, number]): string => ` ${formatNumber(x)} ${formatNumber(y)}`,
        )
        .join('')}`;
    })
    .join(' ');
}

export function applyPathTransformToPathData(pathData: string, transform: PathTransform): string {
  const [m00, m01, m02] = transform[0];
  const [m10, m11, m12] = transform[1];

  return serializePathDataSegments(
    parsePathDataSegments(pathData).map(({ command, points }: PathDataSegment): PathDataSegment => {
      return {
        command,
        points: points.map(([x, y]: readonly [number, number]): [number, number] => [
          m00 * x + m01 * y + m02,
          m10 * x + m11 * y + m12,
        ]),
      };
    }),
  );
}

export function computePathDataBoundingBox(pathData: string): PathBoundingBox {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const { points } of parsePathDataSegments(pathData)) {
    for (const [x, y] of points) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (
    !Number.isFinite(minX) ||
    !Number.isFinite(minY) ||
    !Number.isFinite(maxX) ||
    !Number.isFinite(maxY)
  ) {
    throw new Error(`Empty path data: ${JSON.stringify(pathData)}`);
  }

  return { minX, minY, maxX, maxY };
}
