import { type Dirent, type Stats } from 'fs';
import { opendir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { AsyncTreeExplorer } from '../../async-tree-explorer.ts';
import { type FileEntry } from './file-entry.ts';

export type NodeJsFilesExplorerInput = string | Dirent;

export const NodeJsFilesExplorer = new AsyncTreeExplorer<NodeJsFilesExplorerInput, FileEntry>(
  async function* readDirectory(fileEntry: FileEntry): AsyncGenerator<NodeJsFilesExplorerInput> {
    if (fileEntry.isDirectory) {
      yield* await opendir(fileEntry.path);
    }
  },
  async (pathOrDirent: NodeJsFilesExplorerInput): Promise<FileEntry> => {
    if (typeof pathOrDirent === 'string') {
      const stats: Stats = await stat(pathOrDirent);
      return {
        path: pathOrDirent,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        isBlockDevice: stats.isBlockDevice(),
        isCharacterDevice: stats.isCharacterDevice(),
        isSymbolicLink: stats.isSymbolicLink(),
        isFIFO: stats.isFIFO(),
        isSocket: stats.isSocket(),
      };
    } else {
      return {
        path: join(pathOrDirent.parentPath, pathOrDirent.name),
        isFile: pathOrDirent.isFile(),
        isDirectory: pathOrDirent.isDirectory(),
        isBlockDevice: pathOrDirent.isBlockDevice(),
        isCharacterDevice: pathOrDirent.isCharacterDevice(),
        isSymbolicLink: pathOrDirent.isSymbolicLink(),
        isFIFO: pathOrDirent.isFIFO(),
        isSocket: pathOrDirent.isSocket(),
      };
    }
  },
);
