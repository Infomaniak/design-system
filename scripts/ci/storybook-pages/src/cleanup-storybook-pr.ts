export function isStorybookPrCleanupTargetDirectory(targetDirectory: string): boolean {
  const normalizedTargetDirectory: string = targetDirectory.trim().replaceAll('\\', '/');

  if (normalizedTargetDirectory === '' || normalizedTargetDirectory.startsWith('/')) {
    return false;
  }

  if (normalizedTargetDirectory.includes('..')) {
    return false;
  }

  return /^storybook\/mr\/\d+$/.test(normalizedTargetDirectory);
}

export function createCleanupCommitMessage(pullRequestNumber: string): string {
  return `chore(ci): remove storybook preview for pr #${pullRequestNumber}`;
}
