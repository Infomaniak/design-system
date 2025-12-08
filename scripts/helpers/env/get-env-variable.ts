import process from 'node:process';

export function getEnvVariable(name: string, defaultValue?: string): string {
  if (name in process.env) {
    return process.env[name]!;
  } else if (defaultValue === undefined) {
    throw new Error(`Missing .env variable "${name}"`);
  } else {
    return defaultValue;
  }
}
