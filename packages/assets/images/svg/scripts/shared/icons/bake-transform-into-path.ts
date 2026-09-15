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

const PATH_DECIMALS = 4;
const PATH_NUMBER_PATTERN: RegExp = /-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;
const PATH_FLAG_PATTERN: RegExp = /[01]/y;
const PATH_SEPARATOR_PATTERN: RegExp = /[\s,]*/y;
const PATH_COMMAND_PATTERN: RegExp = /[a-zA-Z]/y;
/*
 * Arity of the non-arc commands, in coordinates per repetition. Arc commands ("A"/"a") take
 * single-character flags interleaved with numbers and are consumed by a dedicated routine.
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
};
const ARC_MAX_SEGMENT_ANGLE: number = Math.PI / 2;

type PathPoint = readonly [number, number];
type PathCommand = 'M' | 'L' | 'C' | 'Q' | 'Z';

interface PathDataSegment {
  readonly command: PathCommand;
  readonly points: readonly PathPoint[];
}

interface PathDataCursor {
  readonly pathData: string;
  position: number;
}

/*
 * Parses any valid SVG path data (absolute and relative commands, "H"/"V"/"S"/"T" shorthands and
 * elliptical arcs) into absolute "M"/"L"/"C"/"Q"/"Z" segments: the canonical internal form the
 * transforms, the bounding box computation and the serializer operate on. Arcs are converted to
 * cubic béziers (SVG specification, section F.6): they are only a storage optimization, and
 * béziers transform point-wise under any affine transform.
 */
function parsePathDataSegments(pathData: string): readonly PathDataSegment[] {
  const cursor: PathDataCursor = { pathData, position: 0 };
  const segments: PathDataSegment[] = [];

  let command: string | null = null;
  let currentPoint: PathPoint | null = null;
  let subpathStartPoint: PathPoint | null = null;
  let previousCubicControl: PathPoint | null = null;
  let previousQuadraticControl: PathPoint | null = null;

  const toAbsolute = (point: PathPoint, relative: boolean): PathPoint => {
    if (!relative || currentPoint === null) {
      return point;
    }
    return [currentPoint[0] + point[0], currentPoint[1] + point[1]];
  };

  const malformed = (coordinateCount: number): Error => {
    return new Error(
      `Malformed path data: ${String(coordinateCount)} coordinates for command ${JSON.stringify(command!.toUpperCase())}.`,
    );
  };

  const unexpectedCharacter = (): Error => {
    return new Error(
      `Unexpected character ${JSON.stringify(cursor.pathData[cursor.position])} in path data: ${JSON.stringify(pathData)}.`,
    );
  };

  while (true) {
    skipPathSeparators(cursor);
    if (cursor.position >= cursor.pathData.length) {
      break;
    }

    const commandLetter: string | null = readPathCommand(cursor);
    if (commandLetter !== null) {
      command = commandLetter;
    } else if (command === null) {
      throw new Error(`Path data starts with a coordinate: ${JSON.stringify(pathData)}`);
    }

    const relative: boolean = command! >= 'a' && command! <= 'z';
    const uppercaseCommand: string = command!.toUpperCase();

    if (uppercaseCommand === 'Z') {
      const coordinates: readonly number[] = collectPathNumbers(cursor);
      if (coordinates.length > 0) {
        throw malformed(coordinates.length);
      }
      if (!isPathCommandBoundary(cursor)) {
        throw unexpectedCharacter();
      }
      if (subpathStartPoint !== null) {
        currentPoint = subpathStartPoint;
      }
      previousCubicControl = null;
      previousQuadraticControl = null;
      segments.push({ command: 'Z', points: [] });
      continue;
    }

    if (uppercaseCommand === 'A') {
      let consumedCount: number = 0;
      while (true) {
        const rx: number | null = readPathNumberAfterSeparators(cursor);
        if (rx === null) {
          break;
        }
        consumedCount = 1;
        const ry: number | null = readPathNumberAfterSeparators(cursor);
        if (ry === null) {
          throw malformed(consumedCount);
        }
        consumedCount = 2;
        const xAxisRotation: number | null = readPathNumberAfterSeparators(cursor);
        if (xAxisRotation === null) {
          throw malformed(consumedCount);
        }
        consumedCount = 3;
        const largeArc: number | null = readPathFlagAfterSeparators(cursor);
        if (largeArc === null) {
          throw malformed(consumedCount);
        }
        consumedCount = 4;
        const sweep: number | null = readPathFlagAfterSeparators(cursor);
        if (sweep === null) {
          throw malformed(consumedCount);
        }
        consumedCount = 5;
        const x: number | null = readPathNumberAfterSeparators(cursor);
        if (x === null) {
          throw malformed(consumedCount);
        }
        consumedCount = 6;
        const y: number | null = readPathNumberAfterSeparators(cursor);
        if (y === null) {
          throw malformed(consumedCount);
        }

        const endPoint: PathPoint = toAbsolute([x, y], relative);
        for (const arcSegment of arcToCubicSegments({
          startPoint: currentPoint ?? [0, 0],
          endPoint,
          rx,
          ry,
          xAxisRotation,
          largeArc: largeArc === 1,
          sweep: sweep === 1,
        })) {
          segments.push(arcSegment);
        }
        currentPoint = endPoint;
      }
      previousCubicControl = null;
      previousQuadraticControl = null;
      if (consumedCount === 0 && !isPathCommandBoundary(cursor)) {
        throw unexpectedCharacter();
      }
      continue;
    }

    const arity: number = PATH_COMMAND_ARITIES[uppercaseCommand]!;
    const coordinates: readonly number[] = collectPathNumbers(cursor);
    if (coordinates.length === 0) {
      if (!isPathCommandBoundary(cursor)) {
        throw unexpectedCharacter();
      }
      continue;
    }
    if (coordinates.length % arity !== 0) {
      throw malformed(coordinates.length);
    }

    for (let offset = 0; offset < coordinates.length; offset += arity) {
      const values: readonly number[] = coordinates.slice(offset, offset + arity);

      switch (uppercaseCommand) {
        case 'M': {
          if (offset === 0) {
            // NOTE: a relative "m" at the very start of the path data is treated as absolute.
            const point: PathPoint = toAbsolute([values[0]!, values[1]!], relative);
            currentPoint = point;
            subpathStartPoint = point;
            previousCubicControl = null;
            previousQuadraticControl = null;
            segments.push({ command: 'M', points: [point] });
            break;
          }
          // NOTE: coordinates repeating a moveto are implicit lineto commands.
          const point: PathPoint = toAbsolute([values[0]!, values[1]!], relative);
          currentPoint = point;
          previousCubicControl = null;
          previousQuadraticControl = null;
          segments.push({ command: 'L', points: [point] });
          break;
        }
        case 'L': {
          const point: PathPoint = toAbsolute([values[0]!, values[1]!], relative);
          currentPoint = point;
          previousCubicControl = null;
          previousQuadraticControl = null;
          segments.push({ command: 'L', points: [point] });
          break;
        }
        case 'H': {
          const x: number =
            relative && currentPoint !== null ? currentPoint[0] + values[0]! : values[0]!;
          const point: PathPoint = [x, currentPoint?.[1] ?? 0];
          currentPoint = point;
          previousCubicControl = null;
          previousQuadraticControl = null;
          segments.push({ command: 'L', points: [point] });
          break;
        }
        case 'V': {
          const y: number =
            relative && currentPoint !== null ? currentPoint[1] + values[0]! : values[0]!;
          const point: PathPoint = [currentPoint?.[0] ?? 0, y];
          currentPoint = point;
          previousCubicControl = null;
          previousQuadraticControl = null;
          segments.push({ command: 'L', points: [point] });
          break;
        }
        case 'C': {
          const control1: PathPoint = toAbsolute([values[0]!, values[1]!], relative);
          const control2: PathPoint = toAbsolute([values[2]!, values[3]!], relative);
          const point: PathPoint = toAbsolute([values[4]!, values[5]!], relative);
          currentPoint = point;
          previousCubicControl = control2;
          previousQuadraticControl = null;
          segments.push({ command: 'C', points: [control1, control2, point] });
          break;
        }
        case 'S': {
          const control1: PathPoint = reflectControl(previousCubicControl, currentPoint);
          const control2: PathPoint = toAbsolute([values[0]!, values[1]!], relative);
          const point: PathPoint = toAbsolute([values[2]!, values[3]!], relative);
          currentPoint = point;
          previousCubicControl = control2;
          previousQuadraticControl = null;
          segments.push({ command: 'C', points: [control1, control2, point] });
          break;
        }
        case 'Q': {
          const control: PathPoint = toAbsolute([values[0]!, values[1]!], relative);
          const point: PathPoint = toAbsolute([values[2]!, values[3]!], relative);
          currentPoint = point;
          previousCubicControl = null;
          previousQuadraticControl = control;
          segments.push({ command: 'Q', points: [control, point] });
          break;
        }
        case 'T': {
          const control: PathPoint = reflectControl(previousQuadraticControl, currentPoint);
          const point: PathPoint = toAbsolute([values[0]!, values[1]!], relative);
          currentPoint = point;
          previousCubicControl = null;
          previousQuadraticControl = control;
          segments.push({ command: 'Q', points: [control, point] });
          break;
        }
      }
    }
  }

  return segments;
}

function skipPathSeparators(cursor: PathDataCursor): void {
  PATH_SEPARATOR_PATTERN.lastIndex = cursor.position;
  PATH_SEPARATOR_PATTERN.exec(cursor.pathData);
  cursor.position = PATH_SEPARATOR_PATTERN.lastIndex;
}

function readPathCommand(cursor: PathDataCursor): string | null {
  PATH_COMMAND_PATTERN.lastIndex = cursor.position;
  const match: RegExpExecArray | null = PATH_COMMAND_PATTERN.exec(cursor.pathData);
  if (match === null) {
    return null;
  }
  cursor.position = PATH_COMMAND_PATTERN.lastIndex;
  return match[0];
}

function readPathNumber(cursor: PathDataCursor): number | null {
  PATH_NUMBER_PATTERN.lastIndex = cursor.position;
  const match: RegExpExecArray | null = PATH_NUMBER_PATTERN.exec(cursor.pathData);
  if (match === null) {
    return null;
  }
  cursor.position = PATH_NUMBER_PATTERN.lastIndex;
  const number: number = Number(match[0]);
  if (!Number.isFinite(number)) {
    throw new Error(`Non-finite number in path data: ${JSON.stringify(cursor.pathData)}.`);
  }
  return number;
}

function readPathNumberAfterSeparators(cursor: PathDataCursor): number | null {
  skipPathSeparators(cursor);
  return readPathNumber(cursor);
}

/*
 * Arc flags are single characters ("0" or "1") which may abut the following numbers
 * (e.g. "001.654" is flag 0, flag 0, then 1.654): they cannot be read with the number pattern.
 */
function readPathFlag(cursor: PathDataCursor): number | null {
  PATH_FLAG_PATTERN.lastIndex = cursor.position;
  const match: RegExpExecArray | null = PATH_FLAG_PATTERN.exec(cursor.pathData);
  if (match === null) {
    return null;
  }
  cursor.position = PATH_FLAG_PATTERN.lastIndex;
  return Number(match[0]);
}

function readPathFlagAfterSeparators(cursor: PathDataCursor): number | null {
  skipPathSeparators(cursor);
  return readPathFlag(cursor);
}

function collectPathNumbers(cursor: PathDataCursor): readonly number[] {
  const numbers: number[] = [];
  while (true) {
    const number: number | null = readPathNumberAfterSeparators(cursor);
    if (number === null) {
      return numbers;
    }
    numbers.push(number);
  }
}

function isPathCommandBoundary(cursor: PathDataCursor): boolean {
  if (cursor.position >= cursor.pathData.length) {
    return true;
  }
  PATH_COMMAND_PATTERN.lastIndex = cursor.position;
  return PATH_COMMAND_PATTERN.exec(cursor.pathData) !== null;
}

function reflectControl(
  previousControl: PathPoint | null,
  currentPoint: PathPoint | null,
): PathPoint {
  if (previousControl === null || currentPoint === null) {
    return currentPoint ?? [0, 0];
  }
  return [2 * currentPoint[0] - previousControl[0], 2 * currentPoint[1] - previousControl[1]];
}

interface ArcToCubicSegmentsOptions {
  readonly startPoint: PathPoint;
  readonly endPoint: PathPoint;
  readonly rx: number;
  readonly ry: number;
  readonly xAxisRotation: number;
  readonly largeArc: boolean;
  readonly sweep: boolean;
}

/*
 * Converts an elliptical arc into cubic béziers, following the SVG specification (section F.6):
 * endpoint to center parameterization (F.6.5), degenerate cases (F.6.6) and a subdivision into
 * segments of at most 90° approximated with the kappa constant.
 */
function arcToCubicSegments(options: ArcToCubicSegmentsOptions): readonly PathDataSegment[] {
  const { startPoint, endPoint, largeArc, sweep } = options;

  if (startPoint[0] === endPoint[0] && startPoint[1] === endPoint[1]) {
    return [];
  }

  const rx: number = Math.abs(options.rx);
  const ry: number = Math.abs(options.ry);
  if (rx === 0 || ry === 0) {
    return [{ command: 'L', points: [endPoint] }];
  }

  const rotation: number = (options.xAxisRotation * Math.PI) / 180;
  const cosRotation: number = Math.cos(rotation);
  const sinRotation: number = Math.sin(rotation);

  const deltaX: number = (startPoint[0] - endPoint[0]) / 2;
  const deltaY: number = (startPoint[1] - endPoint[1]) / 2;
  const startPointPrimeX: number = cosRotation * deltaX + sinRotation * deltaY;
  const startPointPrimeY: number = -sinRotation * deltaX + cosRotation * deltaY;

  let normalizedRx: number = rx;
  let normalizedRy: number = ry;
  const lambda: number =
    (startPointPrimeX * startPointPrimeX) / (rx * rx) +
    (startPointPrimeY * startPointPrimeY) / (ry * ry);
  if (lambda > 1) {
    const scale: number = Math.sqrt(lambda);
    normalizedRx *= scale;
    normalizedRy *= scale;
  }

  const sign: number = largeArc !== sweep ? 1 : -1;
  const rxSquared: number = normalizedRx * normalizedRx;
  const rySquared: number = normalizedRy * normalizedRy;
  const numerator: number =
    rxSquared * rySquared -
    rxSquared * startPointPrimeY * startPointPrimeY -
    rySquared * startPointPrimeX * startPointPrimeX;
  const denominator: number =
    rxSquared * startPointPrimeY * startPointPrimeY +
    rySquared * startPointPrimeX * startPointPrimeX;
  const coefficient: number = sign * Math.sqrt(Math.max(0, numerator / denominator));
  const centerPrimeX: number = (coefficient * normalizedRx * startPointPrimeY) / normalizedRy;
  const centerPrimeY: number = (-coefficient * normalizedRy * startPointPrimeX) / normalizedRx;
  const centerX: number =
    cosRotation * centerPrimeX - sinRotation * centerPrimeY + (startPoint[0] + endPoint[0]) / 2;
  const centerY: number =
    sinRotation * centerPrimeX + cosRotation * centerPrimeY + (startPoint[1] + endPoint[1]) / 2;

  const angleBetween = (ux: number, uy: number, vx: number, vy: number): number => {
    const cosine: number = Math.min(
      1,
      Math.max(-1, (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy))),
    );
    const result: number = Math.acos(cosine);
    return ux * vy - uy * vx < 0 ? -result : result;
  };

  const startAngleX: number = (startPointPrimeX - centerPrimeX) / normalizedRx;
  const startAngleY: number = (startPointPrimeY - centerPrimeY) / normalizedRy;
  const theta: number = angleBetween(1, 0, startAngleX, startAngleY);
  const endAngleX: number = (-startPointPrimeX - centerPrimeX) / normalizedRx;
  const endAngleY: number = (-startPointPrimeY - centerPrimeY) / normalizedRy;
  let deltaTheta: number = angleBetween(startAngleX, startAngleY, endAngleX, endAngleY);
  if (!sweep && deltaTheta > 0) {
    deltaTheta -= 2 * Math.PI;
  } else if (sweep && deltaTheta < 0) {
    deltaTheta += 2 * Math.PI;
  }

  /*
   * Extreme inputs (e.g. subnormal radii overflowing the radius scale-up) produce NaN angles,
   * which would silently yield zero segments: fail loudly instead.
   */
  if (!Number.isFinite(theta) || !Number.isFinite(deltaTheta)) {
    throw new Error(
      `Non-finite arc geometry in path data: ${JSON.stringify({
        rx: options.rx,
        ry: options.ry,
        xAxisRotation: options.xAxisRotation,
        largeArc,
        sweep,
        startPoint,
        endPoint,
      })}.`,
    );
  }

  const segmentCount: number = Math.max(1, Math.ceil(Math.abs(deltaTheta) / ARC_MAX_SEGMENT_ANGLE));
  const segmentAngle: number = deltaTheta / segmentCount;
  const kappa: number = (4 / 3) * Math.tan(segmentAngle / 4);

  const ellipsePoint = (angleValue: number): PathPoint => [
    centerX +
      normalizedRx * Math.cos(angleValue) * cosRotation -
      normalizedRy * Math.sin(angleValue) * sinRotation,
    centerY +
      normalizedRx * Math.cos(angleValue) * sinRotation +
      normalizedRy * Math.sin(angleValue) * cosRotation,
  ];
  const ellipseDerivative = (angleValue: number): PathPoint => [
    -normalizedRx * Math.sin(angleValue) * cosRotation -
      normalizedRy * Math.cos(angleValue) * sinRotation,
    -normalizedRx * Math.sin(angleValue) * sinRotation +
      normalizedRy * Math.cos(angleValue) * cosRotation,
  ];

  const segments: PathDataSegment[] = [];
  for (let index = 0; index < segmentCount; index += 1) {
    const segmentStartPoint: PathPoint = ellipsePoint(theta + segmentAngle * index);
    const segmentEndPoint: PathPoint = ellipsePoint(theta + segmentAngle * (index + 1));
    const segmentStartDerivative: PathPoint = ellipseDerivative(theta + segmentAngle * index);
    const segmentEndDerivative: PathPoint = ellipseDerivative(theta + segmentAngle * (index + 1));
    segments.push({
      command: 'C',
      points: [
        [
          segmentStartPoint[0] + kappa * segmentStartDerivative[0],
          segmentStartPoint[1] + kappa * segmentStartDerivative[1],
        ],
        [
          segmentEndPoint[0] - kappa * segmentEndDerivative[0],
          segmentEndPoint[1] - kappa * segmentEndDerivative[1],
        ],
        segmentEndPoint,
      ],
    });
  }
  return segments;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error(`Non-finite number in path data: ${String(value)}.`);
  }
  return String(Number(value.toFixed(PATH_DECIMALS)));
}

function serializePathDataSegments(segments: readonly PathDataSegment[]): string {
  return segments
    .map(({ command, points }: PathDataSegment): string => {
      if (command === 'Z') {
        return 'Z';
      }
      return `${command}${points
        .map(([x, y]: PathPoint): string => ` ${formatNumber(x)} ${formatNumber(y)}`)
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
        points: points.map(([x, y]: PathPoint): PathPoint => [
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
