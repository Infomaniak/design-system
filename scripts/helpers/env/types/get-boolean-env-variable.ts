import * as z from 'zod';
import { getJsonEnvVariable } from './get-json-env-variable.ts';

const booleanSchema: z.ZodType<boolean> = z.boolean();

export function getBooleanEnvVariable(name: string, defaultValue?: boolean): boolean {
  return getJsonEnvVariable<boolean>(name, {
    defaultValue,
    schema: booleanSchema,
  });
}
