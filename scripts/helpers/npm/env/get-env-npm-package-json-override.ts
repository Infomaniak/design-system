import { getEnvVariable } from '../../env/get-env-variable.ts';

export function getEnvNpmPackageJsonOverride(): string {
  return getEnvVariable('NPM_PACKAGE_JSON_OVERRIDE');
}
