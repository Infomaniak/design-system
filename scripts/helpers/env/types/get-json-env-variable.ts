import process from 'node:process';
import * as z from 'zod';

export interface GetJsonEnvVariableOptions<GValue> {
  readonly defaultValue?: GValue;
  readonly schema?: z.ZodType<GValue>;
}

export function getJsonEnvVariable<GValue>(
  name: string,
  { defaultValue, schema }: GetJsonEnvVariableOptions<GValue> = {},
): GValue {
  const raw: string | undefined = process.env[name];

  if (raw !== undefined && raw.trim() !== '') {
    let data: GValue;

    try {
      data = JSON.parse(raw);
    } catch (error: unknown) {
      throw new Error(`Invalid JSON for .env variable "${name}".`, {
        cause: error,
      });
    }

    return schema === undefined ? data : schema.parse(data);
  }

  if (defaultValue === undefined) {
    throw new Error(`Missing .env variable "${name}"`);
  }

  return defaultValue;
}
