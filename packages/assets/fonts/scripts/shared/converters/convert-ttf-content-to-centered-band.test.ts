import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { MockInstance } from 'vitest';
import { describe, expect, test, vi } from 'vitest';
import { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import {
  convertTtfContentToCenteredBand,
  type ConvertTtfContentToCenteredBandOptions,
} from './convert-ttf-content-to-centered-band.ts';

const FIXTURE_PATH: string = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../fonts/infomaniak-sans/infomaniak-sans.variable.normal.[opsz,wght].ttf',
);

interface TestNameRecord {
  readonly nameID: number;
  readonly value: string;
  readonly platformID: number;
  readonly encodingID?: number;
  readonly languageID?: number;
}

interface TestFontMetrics {
  readonly ascender: number;
  readonly descender: number;
  readonly lineGap: number;
  readonly xHeight: number;
  readonly capHeight: number;
}

interface TestFontOptions {
  readonly withHead?: boolean;
  readonly withHhea?: boolean;
  readonly withOs2?: boolean;
  readonly withName?: boolean;
  readonly nameTableOverride?: Uint8Array;
  readonly os2Version?: number;
  readonly fsSelection?: number;
  readonly metrics?: TestFontMetrics;
  readonly mvarValueTags?: readonly string[];
  readonly tinyMvar?: boolean;
  readonly withName16?: boolean;
}

interface TestTable {
  readonly tag: string;
  readonly checksum: number;
  readonly bytes: Uint8Array;
}

/**
 * Independent re-implementation of the sfnt checksum, deliberately written differently
 * from the implementation, to cross-check the converted font without reusing its code.
 */
function testChecksum(bytes: Uint8Array): number {
  const padded: number[] = [...bytes];

  while (padded.length % 4 !== 0) {
    padded.push(0);
  }

  let checksum: number = 0;

  for (let index: number = 0; index < padded.length; index += 4) {
    checksum =
      (checksum +
        ((padded[index]! << 24) |
          (padded[index + 1]! << 16) |
          (padded[index + 2]! << 8) |
          padded[index + 3]!)) >>>
      0;
  }

  return checksum;
}

function createDataView(bytes: Uint8Array): DataView {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function encodeUtf16Be(value: string): Uint8Array {
  const bytes: Uint8Array = new Uint8Array(value.length * 2);
  const view: DataView = createDataView(bytes);

  [...value].forEach((character, index) => {
    view.setUint16(index * 2, character.codePointAt(0)!);
  });

  return bytes;
}

function buildTestNameTable(records: readonly TestNameRecord[]): Uint8Array {
  const recordCount: number = records.length;
  const stringOffset: number = 6 + recordCount * 12;
  const strings: readonly Uint8Array[] = records.map(({ value, platformID }) =>
    platformID === 1
      ? Uint8Array.from([...value].map((character) => character.charCodeAt(0) & 0xff))
      : encodeUtf16Be(value),
  );
  const bytes: Uint8Array = new Uint8Array(
    stringOffset + strings.reduce((length, { length: byteLength }) => length + byteLength, 0),
  );
  const view: DataView = createDataView(bytes);
  let storageOffset: number = 0;

  view.setUint16(0, 0);
  view.setUint16(2, recordCount);
  view.setUint16(4, stringOffset);

  records.forEach((record, index) => {
    const recordBytes: Uint8Array = strings[index]!;
    const recordOffset: number = 6 + index * 12;

    view.setUint16(recordOffset, record.platformID);
    view.setUint16(recordOffset + 2, record.encodingID ?? (record.platformID === 1 ? 0 : 1));
    view.setUint16(recordOffset + 4, record.languageID ?? (record.platformID === 1 ? 0 : 0x0409));
    view.setUint16(recordOffset + 6, record.nameID);
    view.setUint16(recordOffset + 8, recordBytes.length);
    view.setUint16(recordOffset + 10, storageOffset);
    bytes.set(recordBytes, stringOffset + storageOffset);
    storageOffset += recordBytes.length;
  });

  return bytes;
}

function buildTestSfnt(
  tables: readonly { readonly tag: string; readonly bytes: Uint8Array }[],
): Uint8Array {
  const numTables: number = tables.length;
  const bytes: Uint8Array = new Uint8Array(
    12 +
      numTables * 16 +
      tables.reduce(
        (length, { bytes: tableBytes }) => length + Math.ceil(tableBytes.length / 4) * 4,
        0,
      ),
  );
  const view: DataView = createDataView(bytes);

  view.setUint32(0, 0x00010000);
  view.setUint16(4, numTables);

  let tableOffset: number = 12 + numTables * 16;

  tables.forEach(({ tag, bytes: tableBytes }, index) => {
    const recordOffset: number = 12 + index * 16;

    [...tag].forEach((character, tagIndex) => {
      bytes[recordOffset + tagIndex] = character.charCodeAt(0) & 0xff;
    });
    view.setUint32(recordOffset + 4, testChecksum(tableBytes));
    view.setUint32(recordOffset + 8, tableOffset);
    view.setUint32(recordOffset + 12, tableBytes.length);
    bytes.set(tableBytes, tableOffset);
    tableOffset += Math.ceil(tableBytes.length / 4) * 4;
  });

  return bytes;
}

function buildTestOs2(options: TestFontOptions): Uint8Array {
  const { ascender, descender, lineGap, xHeight, capHeight }: TestFontMetrics = options.metrics ?? {
    ascender: 1984,
    descender: -494,
    lineGap: 0,
    xHeight: 1118,
    capHeight: 1490,
  };
  const bytes: Uint8Array = new Uint8Array(96);
  const view: DataView = createDataView(bytes);

  view.setUint16(0, options.os2Version ?? 4);
  view.setUint16(62, options.fsSelection ?? 0x0080);
  view.setInt16(68, ascender);
  view.setInt16(70, descender);
  view.setInt16(72, lineGap);
  view.setUint16(74, Math.abs(ascender - descender + lineGap));
  view.setUint16(
    76,
    Math.abs(ascender - descender + lineGap) -
      Math.floor((ascender - descender + lineGap + xHeight) / 2),
  );
  view.setInt16(86, xHeight);
  view.setInt16(88, capHeight);

  return bytes;
}

function buildTestMvar(valueTags: readonly string[]): Uint8Array {
  const bytes: Uint8Array = new Uint8Array(12 + valueTags.length * 6);
  const view: DataView = createDataView(bytes);

  view.setUint16(0, 1);
  view.setUint16(2, 0);
  view.setUint16(4, 0);
  view.setUint16(6, 6);
  view.setUint16(8, valueTags.length);
  view.setUint16(10, 0);

  valueTags.forEach((valueTag, index) => {
    const recordOffset: number = 12 + index * 6;

    [...valueTag].forEach((character, tagIndex) => {
      bytes[recordOffset + tagIndex] = character.charCodeAt(0) & 0xff;
    });
    view.setUint16(recordOffset + 4, 0);
  });

  return bytes;
}

function buildTestFont(options: TestFontOptions = {}): Uint8Array {
  const tables: { tag: string; bytes: Uint8Array }[] = [];

  if (options.withHead ?? true) {
    const head: Uint8Array = new Uint8Array(54);
    const view: DataView = createDataView(head);

    view.setUint32(12, 0x5f0f3cf5);
    view.setUint16(18, 2048);

    tables.push({ tag: 'head', bytes: head });
  }

  if (options.withHhea ?? true) {
    const hhea: Uint8Array = new Uint8Array(36);
    const view: DataView = createDataView(hhea);

    view.setInt16(4, 1984);
    view.setInt16(6, -494);
    view.setInt16(8, 0);

    tables.push({ tag: 'hhea', bytes: hhea });
  }

  if (options.withOs2 ?? true) {
    tables.push({ tag: 'OS/2', bytes: buildTestOs2(options) });
  }

  if (options.withName ?? true) {
    if (options.nameTableOverride !== undefined) {
      tables.push({ tag: 'name', bytes: options.nameTableOverride });
    } else {
      const nameRecords: TestNameRecord[] = [
        { nameID: 1, value: 'Infomaniak Variable', platformID: 3 },
        { nameID: 2, value: 'Regular', platformID: 3 },
        { nameID: 3, value: 'unique-id', platformID: 3 },
        { nameID: 4, value: 'Infomaniak Variable', platformID: 3 },
        { nameID: 6, value: 'InfomaniakVariable', platformID: 3 },
      ];

      if (options.withName16 ?? false) {
        nameRecords.push({ nameID: 16, value: 'Infomaniak Variable', platformID: 3 });
      }

      tables.push({ tag: 'name', bytes: buildTestNameTable(nameRecords) });
    }
  }

  if (options.tinyMvar ?? false) {
    tables.push({ tag: 'MVAR', bytes: new Uint8Array(4) });
  } else if (options.mvarValueTags !== undefined) {
    tables.push({ tag: 'MVAR', bytes: buildTestMvar(options.mvarValueTags) });
  }

  // Odd-length table so the checksum's trailing-partial-word path gets exercised.
  tables.push({ tag: 'cvt ', bytes: Uint8Array.from([0, 1, 2, 3, 4]) });

  return buildTestSfnt(tables);
}

interface LoggerSpy {
  readonly logger: Logger;
  readonly warn: MockInstance;
  readonly info: MockInstance;
}

function createLoggerSpy(): LoggerSpy {
  const logger: Logger = Logger.never();

  return {
    logger,
    warn: vi.spyOn(logger, 'warn'),
    info: vi.spyOn(logger, 'info'),
  };
}

function readTestTables(bytes: Uint8Array): ReadonlyMap<string, TestTable> {
  const view: DataView = createDataView(bytes);
  const numTables: number = view.getUint16(4);
  const tables: Map<string, TestTable> = new Map<string, TestTable>();

  for (let index: number = 0; index < numTables; index++) {
    const recordOffset: number = 12 + index * 16;
    const tag: string = String.fromCharCode(
      bytes[recordOffset]!,
      bytes[recordOffset + 1]!,
      bytes[recordOffset + 2]!,
      bytes[recordOffset + 3]!,
    );
    const checksum: number = view.getUint32(recordOffset + 4);
    const tableOffset: number = view.getUint32(recordOffset + 8);
    const length: number = view.getUint32(recordOffset + 12);

    // Uint8Array.from: plain copy, independent from the input's runtime type (Buffer or not).
    tables.set(tag, {
      tag,
      checksum,
      bytes: Uint8Array.from(bytes.subarray(tableOffset, tableOffset + length)),
    });
  }

  return tables;
}

function readTestTable(bytes: Uint8Array, tag: string): Uint8Array {
  return readTestTables(bytes).get(tag)!.bytes;
}

function readTestTableInt16(bytes: Uint8Array, tag: string, offset: number): number {
  return createDataView(readTestTable(bytes, tag)).getInt16(offset);
}

function readTestTableUint16(bytes: Uint8Array, tag: string, offset: number): number {
  return createDataView(readTestTable(bytes, tag)).getUint16(offset);
}

function readTestNameString(bytes: Uint8Array, nameID: number, platformID: number = 3): string {
  const table: Uint8Array = readTestTable(bytes, 'name');
  const view: DataView = createDataView(table);
  const recordCount: number = view.getUint16(2);
  const storageOffset: number = view.getUint16(4);

  for (let index: number = 0; index < recordCount; index++) {
    const recordOffset: number = 6 + index * 12;

    if (
      view.getUint16(recordOffset + 6) === nameID &&
      view.getUint16(recordOffset) === platformID
    ) {
      const length: number = view.getUint16(recordOffset + 8);
      const stringOffset: number = storageOffset + view.getUint16(recordOffset + 10);
      const stringBytes: Uint8Array = table.slice(stringOffset, stringOffset + length);

      return platformID === 1
        ? new TextDecoder('latin1').decode(stringBytes)
        : new TextDecoder('utf-16be').decode(stringBytes);
    }
  }

  throw new Error(`No name record with nameID ${nameID} (platform ${platformID}).`);
}

function readTestNameRecordCount(bytes: Uint8Array): number {
  return createDataView(readTestTable(bytes, 'name')).getUint16(2);
}

async function convertTestFont(
  options: TestFontOptions,
  convertOptions?: Partial<ConvertTtfContentToCenteredBandOptions>,
): Promise<Uint8Array> {
  return convertBytes(buildTestFont(options), convertOptions);
}

function convertBytes(
  bytes: Uint8Array,
  convertOptions?: Partial<ConvertTtfContentToCenteredBandOptions>,
): Promise<Uint8Array> {
  return convertTtfContentToCenteredBand({
    input: bytes,
    start: 'ex',
    end: 'alphabetic',
    ...convertOptions,
  });
}

describe('convertTtfContentToCenteredBand', () => {
  test('converts the fixture font preserving the line height, the outlines and the other tables', async () => {
    const source: Uint8Array = await readFile(FIXTURE_PATH);
    const inputSnapshot: Uint8Array = Uint8Array.from(source);
    const { logger, warn, info }: LoggerSpy = createLoggerSpy();

    const converted: Uint8Array = await convertTtfContentToCenteredBand({
      input: source,
      start: 'ex',
      end: 'alphabetic',
      logger,
    });

    expect([...source]).toEqual([...inputSnapshot]);

    const sourceTables: ReadonlyMap<string, TestTable> = readTestTables(source);
    const convertedTables: ReadonlyMap<string, TestTable> = readTestTables(converted);

    expect([...convertedTables.keys()]).toEqual([...sourceTables.keys()]);

    for (const [tag, { bytes }] of sourceTables) {
      if (tag === 'OS/2' || tag === 'hhea' || tag === 'name') {
        continue;
      }

      if (tag === 'head') {
        const convertedHead: Uint8Array = convertedTables.get(tag)!.bytes;

        expect([...convertedHead.slice(0, 8)]).toEqual([...bytes.slice(0, 8)]);
        expect([...convertedHead.slice(12)]).toEqual([...bytes.slice(12)]);
        continue;
      }

      expect(convertedTables.get(tag)!.bytes).toEqual(bytes);
    }

    expect(readTestTableUint16(converted, 'OS/2', 0)).toBe(4);
    expect(readTestTableUint16(converted, 'OS/2', 62) & 0x80).toBe(0x80);
    expect(readTestTableInt16(converted, 'OS/2', 68)).toBe(1798);
    expect(readTestTableInt16(converted, 'OS/2', 70)).toBe(-680);
    expect(readTestTableInt16(converted, 'OS/2', 72)).toBe(0);
    expect(readTestTableUint16(converted, 'OS/2', 74)).toBe(1798);
    expect(readTestTableUint16(converted, 'OS/2', 76)).toBe(680);
    expect(readTestTableInt16(converted, 'OS/2', 86)).toBe(1118);
    expect(readTestTableInt16(converted, 'OS/2', 88)).toBe(1490);
    expect(
      readTestTableInt16(converted, 'OS/2', 68) -
        readTestTableInt16(converted, 'OS/2', 70) +
        readTestTableInt16(converted, 'OS/2', 72),
    ).toBe(2478);
    expect((2 * readTestTableInt16(converted, 'OS/2', 68) - 1118) / 2 - 2478 / 2).toBe(0);

    expect(readTestTableInt16(converted, 'hhea', 4)).toBe(1798);
    expect(readTestTableInt16(converted, 'hhea', 6)).toBe(-680);
    expect(readTestTableInt16(converted, 'hhea', 8)).toBe(0);
    expect(
      readTestTableInt16(converted, 'hhea', 4) -
        readTestTableInt16(converted, 'hhea', 6) +
        readTestTableInt16(converted, 'hhea', 8),
    ).toBe(2478);

    expect(readTestNameRecordCount(converted)).toBe(readTestNameRecordCount(source));
    expect(readTestNameString(converted, 1)).toBe('Infomaniak Sans ExAlphabetic');
    expect(readTestNameString(converted, 4)).toBe('Infomaniak Sans ExAlphabetic');
    expect(readTestNameString(converted, 6)).toBe('InfomaniakSansExAlphabetic');
    expect(readTestNameString(converted, 6, 1)).toBe('InfomaniakSansExAlphabetic');
    expect(readTestNameString(converted, 2)).toBe('Regular');

    for (const [tag, { checksum, bytes }] of convertedTables) {
      if (tag === 'head') {
        // Uint8Array.from: a Buffer slice would alias the read font and zero it in memory.
        const zeroedHead: Uint8Array = Uint8Array.from(bytes);

        createDataView(zeroedHead).setUint32(8, 0);

        expect(checksum).toBe(testChecksum(zeroedHead));
        continue;
      }

      expect(checksum).toBe(testChecksum(bytes));
    }

    expect(testChecksum(converted)).toBe(0xb1b0afba);

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      '"MVAR" table varies vertical metric tags (xhgt): the patched vertical metrics may be overridden by variation deltas.',
    );
    expect(info).toHaveBeenCalledTimes(1);
    expect(info.mock.calls[0]?.[0]).toContain(
      'family: "Infomaniak Sans" -> "Infomaniak Sans ExAlphabetic"',
    );
    expect(info.mock.calls[0]?.[0]).toContain('band: text-box: trim-both ex alphabetic');
    expect(info.mock.calls[0]?.[0]).toContain('trade-off');
  }, 20_000);

  test('floors the ascender when the adjusted sum is odd', async () => {
    const converted: Uint8Array = await convertTestFont({
      metrics: { ascender: 1000, descender: -500, lineGap: 10, xHeight: 501, capHeight: 747 },
    });

    expect(readTestTableInt16(converted, 'OS/2', 68)).toBe(1005);
    expect(readTestTableInt16(converted, 'OS/2', 70)).toBe(-505);
    expect(readTestTableUint16(converted, 'OS/2', 74)).toBe(1005);
    expect(readTestTableUint16(converted, 'OS/2', 76)).toBe(505);
    expect(
      readTestTableInt16(converted, 'OS/2', 68) -
        readTestTableInt16(converted, 'OS/2', 70) +
        readTestTableInt16(converted, 'OS/2', 72),
    ).toBe(1510);
  });

  test('centers the cap band when "start" is "cap"', async () => {
    const converted: Uint8Array = await convertTestFont({}, { start: 'cap', end: 'alphabetic' });

    expect(readTestTableInt16(converted, 'OS/2', 68)).toBe(1984);
    expect(readTestTableInt16(converted, 'OS/2', 70)).toBe(-494);
    expect(readTestTableInt16(converted, 'hhea', 4)).toBe(1984);
    expect(readTestTableInt16(converted, 'hhea', 6)).toBe(-494);
  });

  test('centers the ascent band when "start" is "text" and "end" is "alphabetic"', async () => {
    const converted: Uint8Array = await convertTestFont({}, { start: 'text', end: 'alphabetic' });

    expect(readTestTableInt16(converted, 'OS/2', 68)).toBe(2231);
    expect(readTestTableInt16(converted, 'OS/2', 70)).toBe(-247);
  });

  test('centers the ex band down to the descent when "end" is "text"', async () => {
    const converted: Uint8Array = await convertTestFont({}, { start: 'ex', end: 'text' });

    expect(readTestTableInt16(converted, 'OS/2', 68)).toBe(1551);
    expect(readTestTableInt16(converted, 'OS/2', 70)).toBe(-927);
  });

  test('rebalances to the identity when both edges are "text"', async () => {
    const converted: Uint8Array = await convertTestFont({}, { start: 'text', end: 'text' });

    expect(readTestTableInt16(converted, 'OS/2', 68)).toBe(1984);
    expect(readTestTableInt16(converted, 'OS/2', 70)).toBe(-494);
  });

  test('derives the family suffix from the band edges', async () => {
    const converted: Uint8Array = await convertTestFont({}, { start: 'cap', end: 'alphabetic' });

    expect(readTestNameString(converted, 1)).toBe('Infomaniak Variable CapAlphabetic');
    expect(readTestNameString(converted, 6)).toBe('InfomaniakVariableCapAlphabetic');
  });

  test('throws when the band edge metric is not positive', async () => {
    await expect(
      convertTestFont(
        {
          metrics: { ascender: 1984, descender: -494, lineGap: 0, xHeight: 0, capHeight: 1490 },
        },
        { start: 'ex', end: 'alphabetic' },
      ),
    ).rejects.toThrow('Invalid "OS/2".sxHeight: 0 (required by the "ex" band edge).');

    await expect(
      convertTestFont(
        { metrics: { ascender: 1984, descender: -494, lineGap: 0, xHeight: 1118, capHeight: 0 } },
        { start: 'cap', end: 'alphabetic' },
      ),
    ).rejects.toThrow('Invalid "OS/2".sCapHeight: 0 (required by the "cap" band edge).');
  });

  test('appends a custom family suffix', async () => {
    const converted: Uint8Array = await convertTestFont({}, { familySuffix: 'Centered' });

    expect(readTestNameString(converted, 1)).toBe('Infomaniak Variable Centered');
    expect(readTestNameString(converted, 6)).toBe('InfomaniakVariableCentered');
  });

  test('renames nameID 16 when it is present', async () => {
    const converted: Uint8Array = await convertTestFont({ withName16: true });

    expect(readTestNameString(converted, 16)).toBe('Infomaniak Variable ExAlphabetic');
  });

  test('keeps the metrics patched when USE_TYPO_METRICS is not set, warning the user', async () => {
    const { logger, warn }: Pick<LoggerSpy, 'logger' | 'warn'> = createLoggerSpy();
    const converted: Uint8Array = await convertTestFont({ fsSelection: 0x0040 }, { logger });

    expect(warn).toHaveBeenCalledWith(
      '"OS/2".fsSelection bit 7 (USE_TYPO_METRICS) is not set: rendering engines may ignore the patched typo metrics.',
    );
    expect(readTestTableInt16(converted, 'OS/2', 68)).toBe(1798);
    expect(readTestTableInt16(converted, 'OS/2', 70)).toBe(-680);
  });

  test('warns when "MVAR" varies vertical metric tags', async () => {
    const { logger, warn }: Pick<LoggerSpy, 'logger' | 'warn'> = createLoggerSpy();
    const converted: Uint8Array = await convertTestFont(
      { mvarValueTags: ['xhgt', 'hasc', 'wdsc'] },
      { logger },
    );

    expect(warn).toHaveBeenCalledWith(
      '"MVAR" table varies vertical metric tags (xhgt, hasc, wdsc): the patched vertical metrics may be overridden by variation deltas.',
    );
    expect(readTestTableInt16(converted, 'OS/2', 68)).toBe(1798);
  });

  test('ignores a malformed "MVAR" table', async () => {
    const { logger, warn }: Pick<LoggerSpy, 'logger' | 'warn'> = createLoggerSpy();
    const converted: Uint8Array = await convertTestFont({ tinyMvar: true }, { logger });

    expect(warn).not.toHaveBeenCalled();
    expect(readTestTableInt16(converted, 'OS/2', 68)).toBe(1798);
  });

  test('logs silently by default', async () => {
    const converted: Uint8Array = await convertTestFont({});

    expect(readTestTableInt16(converted, 'OS/2', 68)).toBe(1798);
  });

  test('throws when "OS/2" is older than version 2', async () => {
    await expect(convertTestFont({ os2Version: 1 })).rejects.toThrow(
      'Unsupported "OS/2" table version: 1 (version 2+ is required to read "sxHeight" and "sCapHeight").',
    );
  });

  test('throws when a required table is missing', async () => {
    await expect(convertTestFont({ withHead: false })).rejects.toThrow('Missing "head" table.');
    await expect(convertTestFont({ withHhea: false })).rejects.toThrow('Missing "hhea" table.');
    await expect(convertTestFont({ withOs2: false })).rejects.toThrow('Missing "OS/2" table.');
    await expect(convertTestFont({ withName: false })).rejects.toThrow('Missing "name" table.');
  });

  test('decodes Macintosh family records as latin1', async () => {
    const nameTable: Uint8Array = buildTestNameTable([
      { nameID: 1, value: 'Infomaniak Sans', platformID: 1 },
      { nameID: 4, value: 'Infomaniak Sans', platformID: 1 },
    ]);
    const converted: Uint8Array = await convertTestFont({ nameTableOverride: nameTable });

    expect(readTestNameString(converted, 1, 1)).toBe('Infomaniak Sans ExAlphabetic');
  });

  test('throws when the "name" table has no family record', async () => {
    const nameTable: Uint8Array = buildTestNameTable([
      { nameID: 2, value: 'Regular', platformID: 3 },
    ]);

    await expect(convertTestFont({ nameTableOverride: nameTable })).rejects.toThrow(
      'Invalid "name" table: no record with nameID 1 (family name).',
    );
  });

  test('throws when a "name" record points outside the string storage', async () => {
    const nameTable: Uint8Array = buildTestNameTable([
      { nameID: 1, value: 'Infomaniak Variable', platformID: 3 },
      { nameID: 4, value: 'Infomaniak Variable', platformID: 3 },
    ]);

    createDataView(nameTable).setUint16(6 + 12 + 10, 0xffff);

    await expect(convertTestFont({ nameTableOverride: nameTable })).rejects.toThrow(
      'Invalid "name" table record: string bytes 65565..65603 exceed the 106-byte table.',
    );
  });

  test('throws on files shorter than the offset table', async () => {
    await expect(convertBytes(new Uint8Array(11))).rejects.toThrow(
      'Invalid sfnt font: 11 bytes is shorter than the 12-byte offset table.',
    );
  });

  test('throws on non-TrueType sfnt versions', async () => {
    const otto: Uint8Array = new Uint8Array(12);

    [...'OTTO'].forEach((character, index) => {
      otto[index] = character.charCodeAt(0);
    });

    await expect(convertBytes(otto)).rejects.toThrow(
      'Unsupported sfnt version: 0x4f54544f (only TrueType 0x00010000 is supported).',
    );
  });

  test('throws when the table directory exceeds the file', async () => {
    const directory: Uint8Array = new Uint8Array(12);
    const view: DataView = createDataView(directory);

    view.setUint32(0, 0x00010000);
    view.setUint16(4, 1);

    await expect(convertBytes(directory)).rejects.toThrow(
      'Invalid sfnt font: the table directory (1 tables) exceeds the 12-byte file.',
    );
  });

  test('throws when a table exceeds the file', async () => {
    const font: Uint8Array = new Uint8Array(28);
    const view: DataView = createDataView(font);

    view.setUint32(0, 0x00010000);
    view.setUint16(4, 1);
    [...'head'].forEach((character, index) => {
      font[12 + index] = character.charCodeAt(0);
    });
    view.setUint32(20, 0);
    view.setUint32(24, 100);

    await expect(convertBytes(font)).rejects.toThrow(
      'Invalid "head" table: bytes 0..100 exceed the 28-byte file.',
    );
  });
});
