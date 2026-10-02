import type { GitChangeEntry, GitChanges } from '../../git/git-changes.ts';
import type { UpdateGitRepositoryOnNewBranchChangesHookFunction } from '../../git/update-git-repository-on-new-branch.ts';
import { PACKAGE_VERSIONS_FILE } from './update-package-versions-file.ts';

export const UPDATE_PACKAGE_VERSIONS_FILE_CHANGES_HOOK: UpdateGitRepositoryOnNewBranchChangesHookFunction =
  (changes: GitChanges): GitChanges =>
    changes.filter(({ file }: GitChangeEntry): boolean => {
      return !file.endsWith(PACKAGE_VERSIONS_FILE);
    });
