export function parseBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  const normalized: string = value.trim().toLowerCase();

  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

export function parseInteger(value: string | undefined, defaultValue: number): number {
  if (value === undefined || value.trim() === '') {
    return defaultValue;
  }

  const parsed: number = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

export function parseNumber(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }

  const parsed: number = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric value: "${value}".`);
  }

  return parsed;
}

export function parseStringArray(value: string | undefined): readonly string[] {
  if (value === undefined || value.trim() === '') {
    return [];
  }

  const parsed: unknown = JSON.parse(value);

  if (!Array.isArray(parsed)) {
    throw new Error('Expected JSON array for files list.');
  }

  return parsed.filter((entry: unknown): entry is string => {
    return typeof entry === 'string';
  });
}

export function parseJsonStringArray(
  value: string | undefined,
  variableName: string = 'value',
): readonly string[] {
  if (value === undefined || value.trim() === '') {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch (error: unknown) {
    throw new Error(`Invalid JSON array for "${variableName}".`, {
      cause: error,
    });
  }

  if (
    !Array.isArray(parsed) ||
    !parsed.every((entry: unknown): boolean => typeof entry === 'string')
  ) {
    throw new Error(`"${variableName}" must be a JSON string array.`);
  }

  return parsed;
}

export function parseJsonStringRecord(
  value: string | undefined,
  variableName: string = 'value',
): Readonly<Record<string, string>> {
  if (value === undefined || value.trim() === '') {
    return {};
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch (error: unknown) {
    throw new Error(`Invalid JSON object for "${variableName}".`, {
      cause: error,
    });
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`"${variableName}" must be a JSON object.`);
  }

  const entries: readonly (readonly [string, unknown])[] = Object.entries(parsed);

  if (
    !entries.every(
      ([, fieldValue]: readonly [string, unknown]): boolean => typeof fieldValue === 'string',
    )
  ) {
    throw new Error(`"${variableName}" must be a JSON object<string,string>.`);
  }

  return Object.fromEntries(entries) as Readonly<Record<string, string>>;
}
