import * as z from 'zod';
import { getJsonEnvVariable } from './get-json-env-variable.ts';

const stringArraySchema: z.ZodType<readonly string[]> = z.array(z.string());

export function getStringArrayEnvVariable(
  name: string,
  defaultValue?: readonly string[],
): readonly string[] {
  return getJsonEnvVariable<readonly string[]>(name, {
    defaultValue,
    schema: stringArraySchema,
  });
}
