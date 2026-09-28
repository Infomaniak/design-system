import { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { dedent } from '../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';

const TRUE_TYPE_SFNT_VERSION: number = 0x00010000;
const USE_TYPO_METRICS_BIT: number = 1 << 7;
const FONT_CHECKSUM_ADJUSTMENT_BASE: number = 0xb1b0afba;
/** Over (top) edge of the centered band, mirroring the first `text-box-edge` value. */
export type CenteredBandOverEdge = 'text' | 'cap' | 'ex';
/** Under (bottom) edge of the centered band, mirroring the second `text-box-edge` value. */
export type CenteredBandUnderEdge = 'text' | 'alphabetic';

const METRIC_MVAR_VALUE_TAGS: ReadonlySet<string> = new Set([
  'hasc',
  'hdsa',
  'hlgp',
  'sTAs',
  'sTDs',
  'sTlg',
  'wasc',
  'wdsc',
  'cpht',
  'xhgt',
]);

const LATIN1_DECODER: TextDecoder = new TextDecoder('latin1');
const UTF_16_BE_DECODER: TextDecoder = new TextDecoder('utf-16be');

export interface ConvertTtfContentToCenteredBandOptions {
  /** Content of the source .ttf file */
  readonly input: Uint8Array;
  /** Over (top) edge of the centered band */
  readonly start: CenteredBandOverEdge;
  /** Under (bottom) edge of the centered band */
  readonly end: CenteredBandUnderEdge;
  /** Suffix appended to the source family name (default: derived from the edges, e.g. 'ExAlphabetic') */
  readonly familySuffix?: string;
  /** Logger for the conversion report and guards (default: silent) */
  readonly logger?: Logger;
}

/**
 * Derives a new font family from a metric-compatible source whose default vertical
 * anchoring centers the band between the two edges (`start`/`end`, mirroring
 * `text-box-edge`) — e.g. the `ex alphabetic` band (x-height top → baseline) for optical
 * centering — with the line height strictly unchanged.
 *
 * The vertical metrics are rebalanced (their sum is preserved), the `name` table is
 * rebuilt so the derivative is a distinct family, and every other table stays
 * byte-identical. The input content is never mutated.
 */
export async function convertTtfContentToCenteredBand({
  input,
  start,
  end,
  familySuffix = toBandFamilySuffix(start, end),
  logger = Logger.never(),
}: ConvertTtfContentToCenteredBandOptions): Promise<Uint8Array> {
  const tableRecords: readonly TableRecord[] = parseSfntTableDirectory(input);

  const headRecord: TableRecord = requireTableRecord(tableRecords, 'head');
  const hheaRecord: TableRecord = requireTableRecord(tableRecords, 'hhea');
  const os2Record: TableRecord = requireTableRecord(tableRecords, 'OS/2');
  const nameRecord: TableRecord = requireTableRecord(tableRecords, 'name');

  const os2: Uint8Array = copyTable(input, os2Record);
  const os2View: DataView = createDataView(os2);
  const os2Version: number = os2View.getUint16(0);

  if (os2Version < 2) {
    throw new Error(
      `Unsupported "OS/2" table version: ${os2Version} (version 2+ is required to read "sxHeight" and "sCapHeight").`,
    );
  }

  if ((os2View.getUint16(62) & USE_TYPO_METRICS_BIT) === 0) {
    logger.warn(
      '"OS/2".fsSelection bit 7 (USE_TYPO_METRICS) is not set: rendering engines may ignore the patched typo metrics.',
    );
  }

  // Split the content area so the band between the two edges is vertically centered in
  // it, while preserving the ascent + descent sum: the line box height stays identical,
  // and geometric centering centers the band exactly like `text-box: trim-both <start>
  // <end>` would on the source font.
  const sourceMetrics: CenteredBandSourceMetrics = {
    ascender: os2View.getInt16(68),
    descender: os2View.getInt16(70),
    lineGap: os2View.getInt16(72),
    xHeight: os2View.getInt16(86),
    capHeight: os2View.getInt16(88),
  };
  const band: CenteredBand = resolveCenteredBand(sourceMetrics, { start, end });
  const metrics: CenteredBandMetrics = computeCenteredBandMetrics(sourceMetrics, band);

  const mvarRecord: TableRecord | undefined = findTableRecord(tableRecords, 'MVAR');

  if (mvarRecord !== undefined) {
    warnOnMvarVerticalMetrics(mvarRecord, input, logger);
  }

  const hhea: Uint8Array = copyTable(input, hheaRecord);
  const hheaView: DataView = createDataView(hhea);
  hheaView.setInt16(4, metrics.ascender);
  hheaView.setInt16(6, -metrics.descender);
  hheaView.setInt16(8, 0);

  os2View.setInt16(68, metrics.ascender);
  os2View.setInt16(70, -metrics.descender);
  os2View.setInt16(72, 0);
  os2View.setUint16(74, metrics.ascender);
  os2View.setUint16(76, metrics.descender);

  const { table: nameTable, family }: CenteredBandNameTable = buildCenteredBandNameTable(
    copyTable(input, nameRecord),
    familySuffix,
  );

  const head: Uint8Array = copyTable(input, headRecord);

  // The head directory checksum is defined with checkSumAdjustment zeroed; the final value
  // is written by serializeSfnt once the whole serialized font can be summed.
  createDataView(head).setUint32(8, 0);

  // Start from byte-identical copies of every table, then override the patched ones.
  const tableData: Map<string, Uint8Array> = new Map<string, Uint8Array>();

  for (const record of tableRecords) {
    tableData.set(record.tag, copyTable(input, record));
  }

  tableData.set('head', head);
  tableData.set('hhea', hhea);
  tableData.set('OS/2', os2);
  tableData.set('name', nameTable);

  const output: Uint8Array = serializeSfnt(
    tableRecords.map(({ tag }) => tag),
    tableData,
  );

  logger.info(
    dedent`
      family: "${family}" -> "${family} ${familySuffix}"
      band: text-box: trim-both ${start} ${end} (centered in the content area)
      normal (line height): ${String(metrics.normal)} (preserved)
      ascender: ${String(sourceMetrics.ascender)} -> ${String(metrics.ascender)}
      descender: ${String(sourceMetrics.descender)} -> ${String(-metrics.descender)}
      trade-off: glyph parts outside the band are pushed away from the center (e.g. UPPERCASE sits high, descenders sit low) — the exact mirror of the original complaint; this is inherent: one line box, one anchor.
    `,
  );

  return output;
}

interface TableRecord {
  readonly tag: string;
  readonly checksum: number;
  readonly offset: number;
  readonly length: number;
}

interface CenteredBandSourceMetrics {
  readonly ascender: number;
  /** Negative, as stored in the font */
  readonly descender: number;
  readonly lineGap: number;
  readonly xHeight: number;
  readonly capHeight: number;
}

/** The band to center, as signed heights relative to the baseline. */
interface CenteredBand {
  readonly overEdge: number;
  readonly underEdge: number;
}

interface CenteredBandMetrics {
  /** `sTypoAscender - sTypoDescender + sTypoLineGap`, preserved exactly */
  readonly normal: number;
  /** New ascender, stored as-is */
  readonly ascender: number;
  /** Positive descender magnitude, stored as `-descender` */
  readonly descender: number;
}

interface CenteredBandNameTable {
  readonly table: Uint8Array;
  readonly family: string;
}

/** Parses and validates the sfnt table directory (tags, checksums, offsets, lengths). */
function parseSfntTableDirectory(data: Uint8Array): readonly TableRecord[] {
  if (data.length < 12) {
    throw new Error(
      `Invalid sfnt font: ${data.length} bytes is shorter than the 12-byte offset table.`,
    );
  }

  const view: DataView = createDataView(data);
  const sfntVersion: number = view.getUint32(0);

  if (sfntVersion !== TRUE_TYPE_SFNT_VERSION) {
    throw new Error(
      `Unsupported sfnt version: 0x${sfntVersion.toString(16).padStart(8, '0')} (only TrueType 0x00010000 is supported).`,
    );
  }

  const numTables: number = view.getUint16(4);

  if (data.length < 12 + numTables * 16) {
    throw new Error(
      `Invalid sfnt font: the table directory (${numTables} tables) exceeds the ${data.length}-byte file.`,
    );
  }

  const tableRecords: TableRecord[] = [];

  for (let index: number = 0; index < numTables; index++) {
    const recordOffset: number = 12 + index * 16;
    const tag: string = LATIN1_DECODER.decode(data.subarray(recordOffset, recordOffset + 4));
    const checksum: number = view.getUint32(recordOffset + 4);
    const offset: number = view.getUint32(recordOffset + 8);
    const length: number = view.getUint32(recordOffset + 12);

    if (offset + length > data.length) {
      throw new Error(
        `Invalid "${tag}" table: bytes ${offset}..${offset + length} exceed the ${data.length}-byte file.`,
      );
    }

    tableRecords.push({ tag, checksum, offset, length });
  }

  return tableRecords;
}

/**
 * Resolves the band edges from the source metrics: `start` maps to the over edge
 * (ascender, cap height or x height), `end` to the under edge (baseline or descent).
 */
function resolveCenteredBand(
  { ascender, descender, xHeight, capHeight }: CenteredBandSourceMetrics,
  { start, end }: { readonly start: CenteredBandOverEdge; readonly end: CenteredBandUnderEdge },
): CenteredBand {
  return {
    overEdge:
      start === 'text'
        ? ascender
        : start === 'cap'
          ? requirePositiveMetric(capHeight, 'sCapHeight', 'cap')
          : requirePositiveMetric(xHeight, 'sxHeight', 'ex'),
    underEdge: end === 'text' ? descender : 0,
  };
}

function requirePositiveMetric(value: number, os2Field: string, edge: string): number {
  if (value <= 0) {
    throw new Error(`Invalid "OS/2".${os2Field}: ${value} (required by the "${edge}" band edge).`);
  }

  return value;
}

/**
 * Computes the rebalanced vertical metrics: the line box (`normal`, i.e. ascent − descent
 * + line gap) is preserved exactly, and the new ascender is placed so the band between the
 * two edges ends up vertically centered in the content area.
 */
function computeCenteredBandMetrics(
  { ascender, descender, lineGap }: CenteredBandSourceMetrics,
  { overEdge, underEdge }: CenteredBand,
): CenteredBandMetrics {
  const normal: number = ascender - descender + lineGap;
  const newAscender: number = Math.floor((normal + overEdge + underEdge) / 2);
  const newDescender: number = normal - newAscender;

  return { normal, ascender: newAscender, descender: newDescender };
}

export function toBandFamilySuffix(
  start: CenteredBandOverEdge,
  end: CenteredBandUnderEdge,
): string {
  return `${capitalize(start)}${capitalize(end)}`;
}

function capitalize(value: string): string {
  return `${value[0]!.toUpperCase()}${value.slice(1)}`;
}

/**
 * Computes an sfnt checksum as defined by the spec: it backs the table directory entries
 * and, applied to the whole serialized font, the `head.checkSumAdjustment` round-trip.
 */
function calculateChecksum(data: Uint8Array): number {
  const view: DataView = createDataView(data);
  const wordCount: number = Math.floor(data.length / 4);
  let checksum: number = 0;

  for (let index: number = 0; index < wordCount; index++) {
    checksum = (checksum + view.getUint32(index * 4)) >>> 0;
  }

  const remainingBytes: number = data.length % 4;

  if (remainingBytes !== 0) {
    let lastWord: number = 0;

    for (let index: number = 0; index < remainingBytes; index++) {
      lastWord |= view.getUint8(wordCount * 4 + index) << (24 - 8 * index);
    }

    checksum = (checksum + lastWord) >>> 0;
  }

  return checksum;
}

/**
 * Rebuilds the `name` table so the derivative is a distinct family: nameIDs 1 (family),
 * 4 (full name) and 6 (PostScript name) — plus 16 (typographic family) only when present —
 * are renamed, and the string storage is rebuilt since the new names have a different
 * length. Every other record is kept byte-identical.
 */
function buildCenteredBandNameTable(
  nameTable: Uint8Array,
  familySuffix: string,
): CenteredBandNameTable {
  const view: DataView = createDataView(nameTable);
  const format: number = view.getUint16(0);
  const recordCount: number = view.getUint16(2);
  const stringOffset: number = view.getUint16(4);

  interface NameRecord {
    readonly platformID: number;
    readonly encodingID: number;
    readonly languageID: number;
    readonly nameID: number;
    readonly length: number;
    readonly offset: number;
  }

  const records: NameRecord[] = [];

  for (let index: number = 0; index < recordCount; index++) {
    const recordOffset: number = 6 + index * 12;

    records.push({
      platformID: view.getUint16(recordOffset),
      encodingID: view.getUint16(recordOffset + 2),
      languageID: view.getUint16(recordOffset + 4),
      nameID: view.getUint16(recordOffset + 6),
      length: view.getUint16(recordOffset + 8),
      offset: view.getUint16(recordOffset + 10),
    });
  }

  const familyRecord: NameRecord | undefined = records.find(({ nameID }) => nameID === 1);

  if (familyRecord === undefined) {
    throw new Error('Invalid "name" table: no record with nameID 1 (family name).');
  }

  const family: string = decodeNameString(
    readNameString(nameTable, stringOffset, familyRecord),
    familyRecord.platformID,
  );
  const newFamily: string = `${family} ${familySuffix}`;
  const postScriptName: string = newFamily.replace(/[ .-]/g, '');

  const renamedNameIDs: ReadonlySet<number> = records.some(({ nameID }) => nameID === 16)
    ? new Set([1, 4, 6, 16])
    : new Set([1, 4, 6]);

  const strings: Uint8Array[] = [];

  for (const record of records) {
    const sourceBytes: Uint8Array = readNameString(nameTable, stringOffset, record);

    strings.push(
      renamedNameIDs.has(record.nameID)
        ? encodeNameString(record.nameID === 6 ? postScriptName : newFamily, record.platformID)
        : sourceBytes,
    );
  }

  const newStringOffset: number = 6 + recordCount * 12;
  const table: Uint8Array = new Uint8Array(
    newStringOffset + strings.reduce((length, { length: byteLength }) => length + byteLength, 0),
  );
  const tableView: DataView = createDataView(table);
  let storageOffset: number = 0;

  tableView.setUint16(0, format);
  tableView.setUint16(2, recordCount);
  tableView.setUint16(4, newStringOffset);

  for (const [index, record] of records.entries()) {
    const bytes: Uint8Array = strings[index]!;
    const recordOffset: number = 6 + index * 12;

    tableView.setUint16(recordOffset, record.platformID);
    tableView.setUint16(recordOffset + 2, record.encodingID);
    tableView.setUint16(recordOffset + 4, record.languageID);
    tableView.setUint16(recordOffset + 6, record.nameID);
    tableView.setUint16(recordOffset + 8, bytes.length);
    tableView.setUint16(recordOffset + 10, storageOffset);
    table.set(bytes, newStringOffset + storageOffset);
    storageOffset += bytes.length;
  }

  return { table, family };
}

/**
 * Serializes the font from the patched tables. Because the rebuilt `name` table has a
 * different length, the file is re-laid-out from scratch: table directory checksums and
 * the whole-font `head.checkSumAdjustment` are recomputed so the result stays a valid sfnt.
 */
function serializeSfnt(
  tags: readonly string[],
  tableData: ReadonlyMap<string, Uint8Array>,
): Uint8Array {
  const offsets: Map<string, number> = new Map<string, number>();
  let offset: number = 12 + tags.length * 16;

  for (const tag of tags) {
    offsets.set(tag, offset);
    offset += Math.ceil(tableData.get(tag)!.length / 4) * 4;
  }

  const font: Uint8Array = new Uint8Array(offset);
  const view: DataView = createDataView(font);
  view.setUint32(0, TRUE_TYPE_SFNT_VERSION);
  view.setUint16(4, tags.length);

  const entrySelector: number = Math.floor(Math.log2(tags.length));
  const searchRange: number = 16 * 2 ** entrySelector;
  view.setUint16(6, searchRange);
  view.setUint16(8, entrySelector);
  view.setUint16(10, tags.length * 16 - searchRange);

  for (const [index, tag] of tags.entries()) {
    const data: Uint8Array = tableData.get(tag)!;
    const tableOffset: number = offsets.get(tag)!;
    const recordOffset: number = 12 + index * 16;

    font.set(encodeLatin1(tag), recordOffset);
    view.setUint32(recordOffset + 4, calculateChecksum(data));
    view.setUint32(recordOffset + 8, tableOffset);
    view.setUint32(recordOffset + 12, data.length);
    font.set(data, tableOffset);
  }

  view.setUint32(
    offsets.get('head')! + 8,
    (FONT_CHECKSUM_ADJUSTMENT_BASE - calculateChecksum(font)) >>> 0,
  );

  return font;
}

function findTableRecord(
  tableRecords: readonly TableRecord[],
  tag: string,
): TableRecord | undefined {
  return tableRecords.find((record) => record.tag === tag);
}

function requireTableRecord(tableRecords: readonly TableRecord[], tag: string): TableRecord {
  const record: TableRecord | undefined = findTableRecord(tableRecords, tag);

  if (record === undefined) {
    throw new Error(`Missing "${tag}" table.`);
  }

  return record;
}

/**
 * Extracts a table as an independent copy: the patches applied afterwards must never
 * reach the source buffer (a subarray would alias it, a `Buffer` slice would too).
 */
function copyTable(data: Uint8Array, record: TableRecord): Uint8Array {
  return new Uint8Array(data.subarray(record.offset, record.offset + record.length));
}

/**
 * Variation deltas can override the static vertical metrics at runtime: when `MVAR`
 * varies one of the fields this conversion patches, the anchoring cannot be guaranteed.
 */
function warnOnMvarVerticalMetrics(record: TableRecord, data: Uint8Array, logger: Logger): void {
  const mvar: Uint8Array = data.subarray(record.offset, record.offset + record.length);

  if (mvar.length < 12) {
    return;
  }

  const valueRecordSize: number = createDataView(mvar).getUint16(6);
  const valueRecordCount: number = createDataView(mvar).getUint16(8);
  const metricTags: string[] = [];

  for (let index: number = 0; index < valueRecordCount; index++) {
    const recordOffset: number = 12 + index * valueRecordSize;
    const valueTag: string = LATIN1_DECODER.decode(mvar.subarray(recordOffset, recordOffset + 4));

    if (METRIC_MVAR_VALUE_TAGS.has(valueTag)) {
      metricTags.push(valueTag);
    }
  }

  if (metricTags.length > 0) {
    logger.warn(
      `"MVAR" table varies vertical metric tags (${metricTags.join(', ')}): the patched vertical metrics may be overridden by variation deltas.`,
    );
  }
}

function readNameString(
  nameTable: Uint8Array,
  stringOffset: number,
  record: { readonly length: number; readonly offset: number },
): Uint8Array {
  const start: number = stringOffset + record.offset;
  const end: number = start + record.length;

  if (end > nameTable.length) {
    throw new Error(
      `Invalid "name" table record: string bytes ${start}..${end} exceed the ${nameTable.length}-byte table.`,
    );
  }

  return nameTable.subarray(start, end);
}

// Platform 1 (Macintosh Roman) stores names as single-byte (latin1) strings, while
// platforms 0 and 3 store them as UTF-16BE.
function decodeNameString(bytes: Uint8Array, platformID: number): string {
  return (platformID === 1 ? LATIN1_DECODER : UTF_16_BE_DECODER).decode(bytes);
}

function encodeNameString(value: string, platformID: number): Uint8Array {
  return platformID === 1 ? encodeLatin1(value) : encodeUtf16Be(value);
}

function encodeLatin1(value: string): Uint8Array {
  const bytes: Uint8Array = new Uint8Array(value.length);

  for (let index: number = 0; index < value.length; index++) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }

  return bytes;
}

function encodeUtf16Be(value: string): Uint8Array {
  const bytes: Uint8Array = new Uint8Array(value.length * 2);
  const view: DataView = createDataView(bytes);

  for (let index: number = 0; index < value.length; index++) {
    view.setUint16(index * 2, value.charCodeAt(index));
  }

  return bytes;
}

function createDataView(data: Uint8Array): DataView {
  return new DataView(data.buffer, data.byteOffset, data.byteLength);
}
