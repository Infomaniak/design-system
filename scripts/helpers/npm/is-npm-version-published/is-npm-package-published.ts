export interface IsNpmPackagePublishedOptions {
  readonly name: string;
  readonly version: string;
  readonly registryUrl?: string;
}

export async function isNpmPackagePublished({
  name,
  version,
  registryUrl = 'https://registry.npmjs.org',
}: IsNpmPackagePublishedOptions): Promise<boolean> {
  let response: Response;

  try {
    response = await fetch(`${registryUrl}/${encodeURIComponent(name)}/${version}`, {
      method: 'HEAD',
    });
  } catch (error: unknown) {
    throw new Error(`Unable to reach npm registry while checking ${name}@${version}.`, {
      cause: error,
    });
  }

  if (response.status === 200) {
    return true;
  }

  if (response.status === 404) {
    return false;
  }

  throw new Error(
    `Unexpected npm registry response while checking ${name}@${version}: ${response.status}`,
  );
}
