export function injectAccessTokenIntoRepositoryUrl(repository: string): string {
  if (repository.startsWith('https://')) {
    return repository.replace(/^https:\/\//, `https://x-access-token:$${ENV_ACCESS_TOKEN}@`);
  } else {
    throw new Error('Cannot inject access token: unsupported repository URL.');
  }
}

export const ENV_ACCESS_TOKEN = 'ACCESS_TOKEN';
