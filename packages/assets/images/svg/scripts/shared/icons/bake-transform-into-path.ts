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

/*
  Every SVG path command (absolute and relative) with its coordinate arity.
  Path data is normalized to absolute M/L/C/Q/Z segments while parsing.
 */
const PATH_COMMAND_ARITIES: Readonly<Record<string, number>> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};
const PATH_NUMBER_PATTERN: RegExp = /-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;
const PATH_DECIMALS = 4;
const ARC_MAX_SEGMENT_ANGLE = Math.PI / 2;
/*
  Offsets of the large-arc/sweep flags within one arc parameter set (rx ry rotation fA fS x y).
  Flags are single-char tokens: writers may pack them without separators ("01"), so they must be
  read one digit at a time instead of as numbers.
 */
const ARC_FLAG_OFFSETS: readonly number[] = [3, 4];

type PathPoint = readonly [number, number];

interface PathDataSegment {
  readonly command: string;
  readonly points: readonly PathPoint[];
}

function parsePathDataSegments(pathData: string): readonly PathDataSegment[] {
  const segments: PathDataSegment[] = [];

  let cursor: PathPoint = [0, 0];
  let subpathStart: PathPoint = [0, 0];
  let lastControlPoint: PathPoint | null = null;
  let position: number = 0;

  const skipSeparators = (): void => {
    while (position < pathData.length && /\s|,/.test(pathData[position]!)) {
      position++;
    }
  };

  const readNumber = (): number => {
    skipSeparators();
    PATH_NUMBER_PATTERN.lastIndex = position;
    const match: RegExpExecArray | null = PATH_NUMBER_PATTERN.exec(pathData);
    if (match === null) {
      throw new Error(
        `Malformed path data: expected a number at offset ${String(position)} in ${JSON.stringify(pathData)}.`,
      );
    }
    position = PATH_NUMBER_PATTERN.lastIndex;
    return Number(match[0]);
  };

  const readFlag = (): number => {
    skipSeparators();
    const char: string | undefined = pathData[position];
    if (char !== '0' && char !== '1') {
      throw new Error(
        `Malformed path data: expected a flag at offset ${String(position)} in ${JSON.stringify(pathData)}.`,
      );
    }
    position++;
    return char === '1' ? 1 : 0;
  };

  const emit = (rawCommand: string, implicit: boolean, values: readonly number[]): void => {
    const upperCommand: string = rawCommand.toUpperCase();
    const relative: boolean = rawCommand !== upperCommand;
    const x = (value: number): number => (relative ? cursor[0] + value : value);
    const y = (value: number): number => (relative ? cursor[1] + value : value);
    const reflectedControlPoint = (): PathPoint =>
      lastControlPoint === null
        ? cursor
        : [2 * cursor[0] - lastControlPoint[0], 2 * cursor[1] - lastControlPoint[1]];

    switch (upperCommand) {
      case 'M': {
        const point: PathPoint = [x(values[0]!), y(values[1]!)];
        segments.push({ command: implicit ? 'L' : 'M', points: [point] });
        cursor = point;
        if (!implicit) {
          subpathStart = point;
        }
        lastControlPoint = null;
        break;
      }
      case 'L':
      case 'H':
      case 'V': {
        const point: PathPoint =
          upperCommand === 'H'
            ? [x(values[0]!), cursor[1]]
            : upperCommand === 'V'
              ? [cursor[0], y(values[0]!)]
              : [x(values[0]!), y(values[1]!)];
        segments.push({ command: 'L', points: [point] });
        cursor = point;
        lastControlPoint = null;
        break;
      }
      case 'C':
      case 'S': {
        const points: readonly [PathPoint, PathPoint, PathPoint] =
          upperCommand === 'S'
            ? [
                reflectedControlPoint(),
                [x(values[0]!), y(values[1]!)],
                [x(values[2]!), y(values[3]!)],
              ]
            : [
                [x(values[0]!), y(values[1]!)],
                [x(values[2]!), y(values[3]!)],
                [x(values[4]!), y(values[5]!)],
              ];
        segments.push({ command: 'C', points });
        cursor = points[2]!;
        lastControlPoint = points[1]!;
        break;
      }
      case 'Q':
      case 'T': {
        const points: readonly [PathPoint, PathPoint] =
          upperCommand === 'T'
            ? [reflectedControlPoint(), [x(values[0]!), y(values[1]!)]]
            : [
                [x(values[0]!), y(values[1]!)],
                [x(values[2]!), y(values[3]!)],
              ];
        segments.push({ command: 'Q', points });
        cursor = points[1]!;
        lastControlPoint = points[0]!;
        break;
      }
      case 'A': {
        const point: PathPoint = [x(values[5]!), y(values[6]!)];
        for (const points of arcToCubicSegments(
          values[0]!,
          values[1]!,
          values[2]!,
          values[3]! !== 0,
          values[4]! !== 0,
          cursor,
          point,
        )) {
          segments.push({ command: 'C', points });
        }
        cursor = point;
        lastControlPoint = null;
        break;
      }
      case 'Z': {
        segments.push({ command: 'Z', points: [] });
        cursor = subpathStart;
        lastControlPoint = null;
        break;
      }
    }
  };

  for (;;) {
    skipSeparators();
    const char: string | undefined = pathData[position];
    if (char === undefined) {
      break;
    }
    if (!/[A-Za-z]/.test(char)) {
      throw new Error(`Path data starts with a coordinate: ${JSON.stringify(pathData)}`);
    }
    const command: string = char;
    position++;
    const upperCommand: string = command.toUpperCase();
    const arity: number | undefined = PATH_COMMAND_ARITIES[upperCommand];
    if (arity === undefined) {
      throw new Error(`Unsupported path command ${JSON.stringify(command)}.`);
    }

    const values: number[] = [];
    for (;;) {
      skipSeparators();
      if (position >= pathData.length || /[A-Za-z]/.test(pathData[position]!)) {
        break;
      }
      values.push(
        upperCommand === 'A' && ARC_FLAG_OFFSETS.includes(values.length % 7)
          ? readFlag()
          : readNumber(),
      );
    }

    if (arity === 0 ? values.length > 0 : values.length % arity !== 0) {
      throw new Error(
        `Malformed path data: ${String(values.length)} coordinates for command ${JSON.stringify(command)}.`,
      );
    }

    if (arity === 0) {
      emit(command, false, []);
    } else {
      for (let offset = 0; offset < values.length; offset += arity) {
        emit(command, offset > 0, values.slice(offset, offset + arity));
      }
    }
  }

  return segments;
}

/*
  Converts an elliptical arc to cubic bézier segments (SVG 1.1, appendix F.6.5),
  split into chunks of at most 90 degrees each.
 */
function arcToCubicSegments(
  rx: number,
  ry: number,
  xAxisRotation: number,
  largeArc: boolean,
  sweep: boolean,
  from: PathPoint,
  to: PathPoint,
): readonly (readonly [PathPoint, PathPoint, PathPoint])[] {
  if (from[0] === to[0] && from[1] === to[1]) {
    // zero-length chord: the arc segment is omitted (SVG 1.1 §F.6.2)
    return [];
  }
  if (rx === 0 || ry === 0) {
    // degenerate radii: straight line (SVG 1.1 §F.6.2), expressed as a collinear cubic
    return [
      [
        [from[0] + (to[0] - from[0]) / 3, from[1] + (to[1] - from[1]) / 3],
        [from[0] + (2 * (to[0] - from[0])) / 3, from[1] + (2 * (to[1] - from[1])) / 3],
        to,
      ],
    ];
  }

  const phi: number = (xAxisRotation * Math.PI) / 180;
  const cosPhi: number = Math.cos(phi);
  const sinPhi: number = Math.sin(phi);

  const dx: number = (from[0] - to[0]) / 2;
  const dy: number = (from[1] - to[1]) / 2;
  const x1Prime: number = cosPhi * dx + sinPhi * dy;
  const y1Prime: number = -sinPhi * dx + cosPhi * dy;

  const lambda: number = (x1Prime * x1Prime) / (rx * rx) + (y1Prime * y1Prime) / (ry * ry);
  const scaleFactor: number = lambda > 1 ? Math.sqrt(lambda) : 1;
  const scaledRx: number = rx * scaleFactor;
  const scaledRy: number = ry * scaleFactor;

  const denominator: number =
    scaledRx * scaledRx * y1Prime * y1Prime + scaledRy * scaledRy * x1Prime * x1Prime;
  const factor: number = Math.sqrt(
    Math.max(0, (scaledRx * scaledRy * scaledRx * scaledRy - denominator) / denominator),
  );
  const sign: number = largeArc !== sweep ? 1 : -1;
  const centerPrimeX: number = (sign * factor * scaledRx * y1Prime) / scaledRy;
  const centerPrimeY: number = (-sign * factor * scaledRy * x1Prime) / scaledRx;
  const centerX: number = cosPhi * centerPrimeX - sinPhi * centerPrimeY + (from[0] + to[0]) / 2;
  const centerY: number = sinPhi * centerPrimeX + cosPhi * centerPrimeY + (from[1] + to[1]) / 2;

  const startAngle: number = Math.atan2(
    (y1Prime - centerPrimeY) / scaledRy,
    (x1Prime - centerPrimeX) / scaledRx,
  );
  const endAngle: number = Math.atan2(
    (-y1Prime - centerPrimeY) / scaledRy,
    (-x1Prime - centerPrimeX) / scaledRx,
  );
  let deltaAngle: number = endAngle - startAngle;
  if (!sweep && deltaAngle > 0) {
    deltaAngle -= 2 * Math.PI;
  } else if (sweep && deltaAngle < 0) {
    deltaAngle += 2 * Math.PI;
  }

  const segmentCount: number = Math.ceil(Math.abs(deltaAngle) / ARC_MAX_SEGMENT_ANGLE);
  const controlFactor: number = (4 / 3) * Math.tan(deltaAngle / (4 * segmentCount));

  const pointAt = (angle: number): PathPoint => [
    centerX + scaledRx * cosPhi * Math.cos(angle) - scaledRy * sinPhi * Math.sin(angle),
    centerY + scaledRx * sinPhi * Math.cos(angle) + scaledRy * cosPhi * Math.sin(angle),
  ];
  const derivativeAt = (angle: number): PathPoint => [
    -scaledRx * cosPhi * Math.sin(angle) - scaledRy * sinPhi * Math.cos(angle),
    -scaledRx * sinPhi * Math.sin(angle) + scaledRy * cosPhi * Math.cos(angle),
  ];

  const segments: (readonly [PathPoint, PathPoint, PathPoint])[] = [];
  for (let index = 0; index < segmentCount; index++) {
    const start: number = startAngle + (deltaAngle * index) / segmentCount;
    const end: number = startAngle + (deltaAngle * (index + 1)) / segmentCount;
    const startPoint: PathPoint = pointAt(start);
    const endPoint: PathPoint = pointAt(end);
    const startDerivative: PathPoint = derivativeAt(start);
    const endDerivative: PathPoint = derivativeAt(end);
    segments.push([
      [
        startPoint[0] + controlFactor * startDerivative[0],
        startPoint[1] + controlFactor * startDerivative[1],
      ],
      [
        endPoint[0] - controlFactor * endDerivative[0],
        endPoint[1] - controlFactor * endDerivative[1],
      ],
      endPoint,
    ]);
  }
  return segments;
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

export function computePathsBoundingBox(pathDataList: readonly string[]): PathBoundingBox {
  return pathDataList
    .map((pathData: string): PathBoundingBox => computePathDataBoundingBox(pathData))
    .reduce((merged: PathBoundingBox, boundingBox: PathBoundingBox): PathBoundingBox => ({
      minX: Math.min(merged.minX, boundingBox.minX),
      minY: Math.min(merged.minY, boundingBox.minY),
      maxX: Math.max(merged.maxX, boundingBox.maxX),
      maxY: Math.max(merged.maxY, boundingBox.maxY),
    }));
}
