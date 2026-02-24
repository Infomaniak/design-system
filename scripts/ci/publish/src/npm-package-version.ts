const NPM_REGISTRY_URL: string = 'https://registry.npmjs.org';

export async function isNpmVersionPublished(name: string, version: string): Promise<boolean> {
  const encodedName: string = encodeURIComponent(name);
  let response: Response;

  try {
    response = await fetch(`${NPM_REGISTRY_URL}/${encodedName}/${version}`);
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
