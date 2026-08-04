import * as z from 'zod';
import { getJsonEnvVariable } from './get-json-env-variable.ts';

const numberSchema: z.ZodType<number> = z.number();

export function getNumberEnvVariable(name: string, defaultValue?: number): number {
  return getJsonEnvVariable<number>(name, {
    defaultValue,
    schema: numberSchema,
  });
}
