import * as z from 'zod';
import { getJsonEnvVariable } from './get-json-env-variable.ts';

const stringRecordSchema: z.ZodType<Readonly<Record<string, string>>> = z.record(
  z.string(),
  z.string(),
);

export function getRecordEnvVariable(
  name: string,
  defaultValue?: Readonly<Record<string, string>>,
): Readonly<Record<string, string>> {
  return getJsonEnvVariable<Readonly<Record<string, string>>>(name, {
    defaultValue,
    schema: stringRecordSchema,
  });
}
