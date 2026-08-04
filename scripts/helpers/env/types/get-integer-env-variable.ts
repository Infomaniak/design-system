import * as z from 'zod';
import { getJsonEnvVariable } from './get-json-env-variable.ts';

const integerSchema: z.ZodType<number> = z.number().int();

export function getIntegerEnvVariable(name: string, defaultValue?: number): number {
  return getJsonEnvVariable<number>(name, {
    defaultValue,
    schema: integerSchema,
  });
}
