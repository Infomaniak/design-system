export interface FileEntry {
  readonly path: string;
  readonly isFile: boolean;
  readonly isDirectory: boolean;
  readonly isBlockDevice: boolean;
  readonly isCharacterDevice: boolean;
  readonly isSymbolicLink: boolean;
  readonly isFIFO: boolean;
  readonly isSocket: boolean;
}
