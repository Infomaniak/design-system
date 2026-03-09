import * as z from 'zod';

export const packageJsonDependenciesSchema = z.record(z.string(), z.string());
