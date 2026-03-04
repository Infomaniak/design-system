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
  if (name in process.env) {
    const data: GValue = JSON.parse(process.env[name]!);
    return schema === undefined ? data : schema.parse(data);
  } else if (defaultValue === undefined) {
    throw new Error(`Missing .env variable "${name}"`);
  } else {
    return defaultValue;
  }
}
